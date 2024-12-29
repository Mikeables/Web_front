<template>
  <div class="cart">
    <el-container>
      <el-header>
        <nav-bar></nav-bar>
      </el-header>
      <el-main class="main-container">
        <el-card class="cart-card">
          <div slot="header" class="card-header">
            <div class="title-container">
              <h2>我的购物车</h2>
              <div class="cyber-line"></div>
            </div>
          </div>
          <div v-if="cartItems.length > 0" class="cart-content">
            <div class="select-all">
              <el-checkbox 
                v-model="selectAll" 
                @change="handleSelectAllChange"
                :indeterminate="isIndeterminate"
                class="cyber-checkbox">
                <span class="cyber-text">全选</span>
              </el-checkbox>
            </div>
            <el-table 
              :data="cartItems" 
              ref="cartTable"
              class="cyber-table"
              :header-cell-style="headerStyle"
              :cell-style="cellStyle">
              <el-table-column width="80" align="center">
                <template slot-scope="scope">
                  <el-checkbox 
                    v-model="scope.row.selected"
                    @change="handleItemSelect"
                    class="cyber-checkbox">
                  </el-checkbox>
                </template>
              </el-table-column>
              <el-table-column 
                prop="product_name" 
                label="商品名称"
                min-width="200">
              </el-table-column>
              <el-table-column 
                prop="price" 
                label="价格" 
                width="150"
                align="center">
                <template slot-scope="scope">
                  <div class="cyber-price">￥{{ scope.row.price }}</div>
                </template>
              </el-table-column>
              <el-table-column 
                prop="quantity" 
                label="数量" 
                width="150"
                align="center">
                <template slot-scope="scope">
                  <div class="cyber-quantity">{{ scope.row.quantity }}</div>
                </template>
              </el-table-column>
              <el-table-column 
                label="操作" 
                width="120"
                align="center">
                <template slot-scope="scope">
                  <el-button
                    type="danger"
                    size="small"
                    class="cyber-button delete-button"
                    @click="deleteItem(scope.row.id)">
                    <i class="el-icon-delete"></i>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="cart-footer">
              <div class="total">
                <span class="cyber-text">已选择 {{ selectedItems.length }} 件商品</span>
                <span class="cyber-price total-price">总计：￥{{ totalPrice }}</span>
              </div>
              <el-button 
                class="cyber-button checkout-button"
                @click="checkout"
                :disabled="selectedItems.length === 0">
                <span class="button-text">去结算</span>
                <div class="button-glitch"></div>
              </el-button>
            </div>
          </div>
          <div v-else class="empty-cart">
            <el-empty description="购物车是空的" :image-size="200"></el-empty>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { cartApi } from '../api'
import NavBar from '../components/NavBar.vue'

export default {
  components: { NavBar },
  data() {
    return {
      cartItems: [],
      selectAll: false,
      isIndeterminate: false,
      headerStyle: {
        background: '#1a1a1a',
        color: '#00ff9d',
        fontWeight: 'bold',
        borderBottom: '1px solid rgba(0, 255, 157, 0.2)',
        textAlign: 'center'
      },
      cellStyle: {
        background: '#2a2a2a',
        borderBottom: '1px solid rgba(0, 255, 157, 0.2)',
        color: '#00ff9d'
      }
    }
  },
  computed: {
    selectedItems() {
      return this.cartItems.filter(item => item.selected)
    },
    totalPrice() {
      return this.selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
    }
  },
  async created() {
    await this.loadCart()
  },
  methods: {
    async loadCart() {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        const res = await cartApi.getCart(user.id)
        this.cartItems = res.data.map(item => ({
          ...item,
          selected: false
        }))
      } catch (error) {
        this.$message.error('获取购物车失败')
      }
    },
    handleSelectAllChange(val) {
      this.cartItems.forEach(item => {
        item.selected = val
      })
      this.isIndeterminate = false
    },
    handleItemSelect() {
      const selectedCount = this.selectedItems.length
      this.selectAll = selectedCount === this.cartItems.length
      this.isIndeterminate = selectedCount > 0 && selectedCount < this.cartItems.length
    },
    async deleteItem(id) {
      try {
        await cartApi.deleteFromCart(id)
        this.$message.success('删除成功')
        await this.loadCart()
      } catch (error) {
        this.$message.error('删除失败')
      }
    },
    checkout() {
      if (this.selectedItems.length === 0) {
        this.$message.warning('请选择要结算的商品')
        return
      }
      localStorage.setItem('checkoutItems', JSON.stringify(this.selectedItems))
      this.$router.push('/checkout')
    }
  }
}
</script>

<style scoped>
.cart {
  min-height: 100vh;
  background: #1a1a1a;
  color: #00ff9d;
  padding: 20px;
}

.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.cart-card {
  background: #2a2a2a;
  border: none;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 255, 157, 0.2);
  margin: 0 auto;
}

.cart-content {
  padding: 0 20px;
}

.card-header {
  background: #2a2a2a;
  border-bottom: 2px solid #00ff9d;
  padding: 20px;
}

.title-container {
  position: relative;
  text-align: center;
}

h2 {
  color: #00ff9d;
  font-size: 28px;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(0, 255, 157, 0.5);
}

.cyber-line {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ff9d, transparent);
}

.select-all {
  padding: 15px;
  border-bottom: 1px solid rgba(0, 255, 157, 0.2);
}

.cyber-checkbox {
  color: #00ff9d;
}

.cyber-text {
  color: #00ff9d;
  text-shadow: 0 0 5px rgba(0, 255, 157, 0.5);
}

.cyber-table {
  margin: 20px 0;
}

:deep(.el-table) {
  background-color: transparent !important;
  color: #00ff9d;
}

:deep(.el-table::before) {
  display: none;
}

:deep(.el-table__header) {
  border-bottom: 2px solid rgba(0, 255, 157, 0.3);
}

:deep(.el-checkbox__inner) {
  background-color: transparent;
  border-color: #00ff9d;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #00ff9d;
  border-color: #00ff9d;
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
  background-color: rgba(0, 255, 157, 0.1) !important;
}

.cyber-price {
  font-family: 'Orbitron', sans-serif;
  color: #ff3e3e;
  text-shadow: 0 0 5px rgba(255, 62, 62, 0.5);
}

.cyber-quantity {
  font-family: 'Orbitron', sans-serif;
  color: #00ff9d;
}

.cyber-button {
  background: transparent;
  border: 1px solid #00ff9d;
  color: #00ff9d;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}

.cyber-button:hover {
  background: rgba(0, 255, 157, 0.1);
  box-shadow: 0 0 10px rgba(0, 255, 157, 0.5);
}

.delete-button {
  border-color: #ff3e3e;
  color: #ff3e3e;
}

.delete-button:hover {
  background: rgba(255, 62, 62, 0.1);
  box-shadow: 0 0 10px rgba(255, 62, 62, 0.5);
}

.cart-footer {
  margin: 20px 0;
  padding: 20px;
  background: rgba(0, 255, 157, 0.05);
  border: 1px solid rgba(0, 255, 157, 0.2);
  border-radius: 5px;
}

.total {
  display: flex;
  align-items: center;
  gap: 20px;
}

.total-price {
  font-size: 24px;
}

.checkout-button {
  width: 150px;
  height: 45px;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
}

.button-text {
  position: relative;
  z-index: 1;
}

.button-glitch {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, transparent 3%, #00ff9d 3%, #00ff9d 5%, transparent 5%);
  opacity: 0;
  transition: opacity 0.3s;
}

.checkout-button:hover .button-glitch {
  opacity: 0.5;
  animation: glitch 1s infinite;
}

@keyframes glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-5px, 5px); }
  40% { transform: translate(-5px, -5px); }
  60% { transform: translate(5px, 5px); }
  80% { transform: translate(5px, -5px); }
  100% { transform: translate(0); }
}

.empty-cart {
  padding: 40px;
  text-align: center;
}

:deep(.el-empty__description) {
  color: #00ff9d;
}

/* 添加字体 */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap');
</style> 