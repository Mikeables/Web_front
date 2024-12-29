<template>
  <div class="orders">
    <el-container>
      <el-header>
        <nav-bar></nav-bar>
      </el-header>
      <el-main>
        <el-card class="orders-card">
          <div slot="header" class="card-header">
            <h2>我的订单</h2>
            <p class="subtitle">温馨提示：您可以查看订单详情或取消订单</p>
          </div>
          <el-table
            v-if="orders.length > 0"
            :data="orders"
            style="width: 100%"
            :header-cell-style="headerStyle"
            :cell-style="cellStyle">
            <el-table-column
              prop="order_id"
              label="订单号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="status"
              label="状态"
              width="120">
              <template slot-scope="scope">
                <el-tag :type="getStatusType(scope.row.status)" effect="plain">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="收货信息">
              <template slot-scope="scope">
                <div v-if="scope.row.tracking_info" class="tracking-info">
                  <p><i class="el-icon-user"></i> {{ getTrackingInfo(scope.row.tracking_info).receiver }}</p>
                  <p><i class="el-icon-phone"></i> {{ getTrackingInfo(scope.row.tracking_info).phone }}</p>
                  <p><i class="el-icon-location"></i> {{ getTrackingInfo(scope.row.tracking_info).address }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="created_at"
              label="创建时间"
              width="180">
              <template slot-scope="scope">
                {{ formatDate(scope.row.created_at) }}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="200">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="small"
                  plain
                  @click="showOrderDetail(scope.row)">
                  <i class="el-icon-document"></i> 订单详情
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  plain
                  @click="handleCancelOrder(scope.row)">
                  <i class="el-icon-close"></i> 取消订单
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-else class="empty-state">
            <el-empty description="暂无订单信息"></el-empty>
          </div>
        </el-card>
      </el-main>
    </el-container>

    <!-- 订单详情对话框 -->
    <el-dialog
      title="订单详情"
      :visible.sync="dialogVisible"
      width="600px"
      custom-class="order-dialog">
      <div v-if="currentOrder" class="order-detail">
        <div class="detail-section">
          <h3><i class="el-icon-info"></i> 基本信息</h3>
          <p><strong>订单号：</strong>{{ currentOrder.order_id }}</p>
          <p><strong>创建时间：</strong>{{ formatDate(currentOrder.created_at) }}</p>
          <p><strong>订单状态：</strong>
            <el-tag :type="getStatusType(currentOrder.status)" effect="plain">
              {{ currentOrder.status }}
            </el-tag>
          </p>
        </div>

        <div class="detail-section">
          <h3><i class="el-icon-location-information"></i> 收货信息</h3>
          <p><strong>收货人：</strong>{{ getTrackingInfo(currentOrder.tracking_info).receiver }}</p>
          <p><strong>联系电话：</strong>{{ getTrackingInfo(currentOrder.tracking_info).phone }}</p>
          <p><strong>收货地址：</strong>{{ getTrackingInfo(currentOrder.tracking_info).address }}</p>
        </div>

        <div class="detail-section">
          <h3><i class="el-icon-shopping-cart-full"></i> 商品信息</h3>
          <el-table
            :data="getTrackingInfo(currentOrder.tracking_info).items"
            border
            style="width: 100%">
            <el-table-column prop="product_name" label="商品名称"></el-table-column>
            <el-table-column prop="price" label="单价" width="120">
              <template slot-scope="scope">
                ￥{{ scope.row.price }}
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" width="100"></el-table-column>
            <el-table-column label="小计" width="120">
              <template slot-scope="scope">
                ￥{{ (scope.row.price * scope.row.quantity).toFixed(2) }}
              </template>
            </el-table-column>
          </el-table>
          <div class="total-price">
            总计：￥{{ calculateTotal(getTrackingInfo(currentOrder.tracking_info).items) }}
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { logisticsApi } from '../api'
import NavBar from '../components/NavBar.vue'

export default {
  components: { NavBar },
  data() {
    return {
      orders: [],
      dialogVisible: false,
      currentOrder: null,
      headerStyle: {
        backgroundColor: '#fdf6ec',
        color: '#986839',
        fontWeight: 'bold'
      },
      cellStyle: {
        color: '#666'
      }
    }
  },
  async created() {
    await this.loadOrders()
  },
  methods: {
    async loadOrders() {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        if (!user || !user.id) {
          this.$message.error('请先登录')
          this.$router.push('/login')
          return
        }
        const res = await logisticsApi.getLogistics(user.id)
        if (res.data) {
          this.orders = Array.isArray(res.data) ? res.data : [res.data]
        }
      } catch (error) {
        console.error('获取订单失败:', error)
        this.$message.error('获取订单失败')
      }
    },
    getTrackingInfo(info) {
      try {
        return JSON.parse(info)
      } catch {
        return {}
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleString()
    },
    getStatusType(status) {
      const statusMap = {
        '待发货': 'warning',
        '已发货': 'primary',
        '已签收': 'success'
      }
      return statusMap[status] || 'info'
    },
    async handleCancelOrder(order) {
      try {
        await this.$confirm('确定要取消该订单吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        await logisticsApi.deleteOrder(order.order_id)
        this.$message({
          type: 'success',
          message: '订单取消成功',
          duration: 1000
        })
        
        // 重新加载订单列表
        await this.loadOrders()
      } catch (error) {
        if (error !== 'cancel') {  // 用户点击取消按钮不显示错误提示
          console.error('取消订单失败:', error)
          this.$message.error('取消订单失败')
        }
      }
    },
    showOrderDetail(order) {
      this.currentOrder = order
      this.dialogVisible = true
    },
    calculateTotal(items) {
      if (!items) return '0.00'
      return items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
    }
  }
}
</script>

<style scoped>
.orders {
  background-color: #fff9f5;
  min-height: 100vh;
  padding: 20px;
}

.orders-card {
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  text-align: center;
  padding: 20px 0;
  background: linear-gradient(to right, #fdf6ec, #fff9f5);
  border-radius: 8px 8px 0 0;
}

h2 {
  color: #986839;
  margin: 0 0 10px 0;
  font-size: 24px;
}

.subtitle {
  color: #c3976a;
  font-size: 14px;
  margin: 0;
}

.tracking-info p {
  margin: 5px 0;
  color: #666;
}

.tracking-info i {
  color: #c3976a;
  margin-right: 5px;
}

.empty-state {
  padding: 40px 0;
}

.order-dialog {
  border-radius: 8px;
}

.order-detail {
  padding: 20px;
  background-color: #fff9f5;
}

.detail-section {
  margin-bottom: 30px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.detail-section h3 {
  color: #986839;
  margin-bottom: 15px;
  font-size: 16px;
  border-bottom: 2px solid #fdf6ec;
  padding-bottom: 10px;
}

.detail-section h3 i {
  margin-right: 5px;
}

.detail-section p {
  margin: 10px 0;
  line-height: 1.5;
  color: #666;
}

.total-price {
  text-align: right;
  margin-top: 20px;
  font-size: 16px;
  font-weight: bold;
  color: #e6a23c;
}

:deep(.el-table) {
  background-color: transparent;
}

:deep(.el-table th) {
  background-color: #fdf6ec !important;
}

:deep(.el-table--border) {
  border-color: #f3e3d3;
}

:deep(.el-table td, .el-table th.is-leaf) {
  border-color: #f3e3d3;
}

:deep(.el-button--primary.is-plain) {
  color: #986839;
  border-color: #f3e3d3;
  background-color: #fdf6ec;
}

:deep(.el-button--primary.is-plain:hover) {
  color: #fff;
  background-color: #986839;
  border-color: #986839;
}

:deep(.el-button--danger.is-plain) {
  color: #f56c6c;
  border-color: #fbc4c4;
  background-color: #fef0f0;
}

:deep(.el-tag) {
  border-radius: 4px;
}

:deep(.el-tag--warning) {
  background-color: #fdf6ec;
  border-color: #f3e3d3;
  color: #e6a23c;
}

:deep(.el-tag--success) {
  background-color: #f0f9eb;
  border-color: #e1f3d8;
  color: #67c23a;
}

:deep(.el-dialog__header) {
  background: linear-gradient(to right, #fdf6ec, #fff9f5);
  padding: 20px;
  border-radius: 8px 8px 0 0;
}

:deep(.el-dialog__title) {
  color: #986839;
  font-size: 18px;
  font-weight: bold;
}
</style> 