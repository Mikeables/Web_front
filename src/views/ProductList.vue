<template>
  <div class="product-list">
    <el-container>
      <el-header>
        <nav-bar></nav-bar>
      </el-header>
      <el-container class="main-container">
        <!-- 左侧分类菜单 -->
        <el-aside width="220px">
          <div class="category-wrapper">
            <h3 class="category-title">商品分类</h3>
            <el-menu
              :default-active="activeCategory"
              class="category-menu"
              @select="handleCategorySelect">
              <el-menu-item index="all">
                <i class="el-icon-menu"></i>
                <span>全部商品</span>
              </el-menu-item>
              <el-menu-item v-for="category in categories" :key="category.value" :index="category.value">
                <i :class="category.icon"></i>
                <span>{{ category.label }}</span>
              </el-menu-item>
            </el-menu>
          </div>
        </el-aside>
        
        <!-- 右侧商品列表 -->
        <el-main>
          <div class="welcome-banner">
            <h1 class="welcome">欢迎光临南华购物系统</h1>
            <p class="welcome-subtitle">精选优质商品，为您提供愉悦的购物体验</p>
          </div>
          <el-row :gutter="20">
            <el-col :span="6" v-for="product in filteredProducts" :key="product.id">
              <el-card class="product-card" :body-style="{ padding: '0px' }">
                <div class="product-type">{{ product.type }}</div>
                <div class="product-info">
                  <h3>{{ product.name }}</h3>
                  <p class="code">编号：{{ product.product_code }}</p>
                  <p class="price">￥{{ product.price }}</p>
                  <div class="quantity-control">
                    <el-input-number 
                      v-model="product.quantity" 
                      :min="1"
                      :max="99"
                      size="small">
                    </el-input-number>
                  </div>
                  <el-button type="success" round @click="addToCart(product)">
                    <i class="el-icon-shopping-cart-2"></i>
                    加入购物车
                  </el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { productApi, cartApi } from '../api'
import NavBar from '../components/NavBar.vue'

export default {
  components: { NavBar },
  data() {
    return {
      products: [],
      activeCategory: 'all',
      categories: [
        { label: '手机数码', value: '手机', icon: 'el-icon-mobile-phone' },
        { label: '电脑办公', value: '笔记本', icon: 'el-icon-notebook-1' },
        { label: '耳机音响', value: '耳机', icon: 'el-icon-headset' },
        { label: '智能设备', value: '智能手环', icon: 'el-icon-watch' },
        { label: '运动户外', value: '运动鞋', icon: 'el-icon-basketball' },
        { label: '游戏设备', value: '游戏机', icon: 'el-icon-video-game-controller' }
      ]
    }
  },
  computed: {
    filteredProducts() {
      if (this.activeCategory === 'all') {
        return this.products
      }
      return this.products.filter(product => product.type === this.activeCategory)
    }
  },
  async created() {
    try {
      const res = await productApi.getProducts()
      this.products = res.data.map(product => ({
        ...product,
        quantity: 1
      }))
    } catch (error) {
      this.$message.error('获取商品列表失败')
    }
  },
  methods: {
    handleCategorySelect(index) {
      this.activeCategory = index
    },
    async addToCart(product) {
      try {
        const userStr = localStorage.getItem('user')
        if (!userStr) {
          this.$confirm('请先登录后再添加商品到购物车', '提示', {
            confirmButtonText: '去登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$router.push('/login')
          }).catch(() => {})
          return
        }

        const user = JSON.parse(userStr)
        if (!user.id) {
          throw new Error('请先登录')
        }

        await cartApi.addToCart({
          user_id: user.id,
          product_name: product.name,
          price: product.price,
          quantity: product.quantity
        })

        this.$message({
          message: '添加到购物车成功',
          type: 'success',
          duration: 1000
        })
        
        product.quantity = 1
      } catch (error) {
        console.error('添加购物车错误:', error)
        this.$message.error(error.response?.data?.message || '添加到购物车失败')
      }
    }
  }
}
</script>

<style scoped>
.product-list {
  min-height: 100vh;
  background: #f9f7f4 url('/src/assets/natural-paper.png') repeat;
}

.main-container {
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  margin: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.category-wrapper {
  background: #fff;
  border-radius: 8px;
  padding: 15px 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.category-title {
  text-align: center;
  color: #7a956b;
  font-size: 18px;
  margin-bottom: 15px;
  padding: 10px;
  border-bottom: 2px solid #e8f3e5;
}

.category-menu {
  border: none;
}

.el-menu-item {
  font-size: 15px;
  color: #666;
  margin: 5px 0;
}

.el-menu-item:hover, .el-menu-item.is-active {
  background-color: #e8f3e5 !important;
  color: #7a956b !important;
}

.el-menu-item i {
  color: #7a956b;
  margin-right: 10px;
}

.welcome-banner {
  text-align: center;
  padding: 30px 0;
  margin-bottom: 30px;
  background: linear-gradient(to right, #e8f3e5, #f0f7ed);
  border-radius: 8px;
}

.welcome {
  color: #7a956b;
  font-size: 28px;
  margin-bottom: 10px;
}

.welcome-subtitle {
  color: #999;
  font-size: 16px;
}

.product-card {
  margin-bottom: 20px;
  transition: all 0.3s;
  border-radius: 8px;
  border: none;
  background: #fff;
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(122, 149, 107, 0.2);
}

.product-type {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #7a956b;
  color: white;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 12px;
}

.product-info {
  padding: 20px;
}

.product-info h3 {
  color: #4a4a4a;
  margin-bottom: 10px;
}

.price {
  color: #e65d5d;
  font-size: 20px;
  font-weight: bold;
  margin: 15px 0;
}

.code {
  color: #999;
  font-size: 12px;
}

.quantity-control {
  margin: 15px 0;
}

.el-button--success {
  background-color: #7a956b;
  border-color: #7a956b;
  width: 100%;
  margin-top: 10px;
}

.el-button--success:hover {
  background-color: #8ba57c;
  border-color: #8ba57c;
}

:deep(.el-input-number) {
  width: 120px;
}

:deep(.el-input-number .el-input__inner) {
  text-align: center;
}
</style> 