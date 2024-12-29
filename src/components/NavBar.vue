<template>
  <div class="nav-bar">
    <el-menu 
      mode="horizontal" 
      router 
      class="cyber-menu"
      :default-active="activeIndex">
      <div class="menu-items">
        <el-menu-item index="/products" class="cyber-menu-item">
          <i class="el-icon-shopping-bag-1"></i>商品列表
        </el-menu-item>
        <el-menu-item index="/cart" class="cyber-menu-item">
          <i class="el-icon-shopping-cart-2"></i>购物车
        </el-menu-item>
        <el-menu-item index="/orders" class="cyber-menu-item">
          <i class="el-icon-document"></i>我的订单
        </el-menu-item>
        <el-menu-item @click="logout" class="cyber-menu-item logout">
          <i class="el-icon-switch-button"></i>退出登录
        </el-menu-item>
      </div>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: this.$route.path
    }
  },
  methods: {
    async logout() {
      try {
        localStorage.removeItem('user')
        if (this.$route.path !== '/login') {
          await this.$router.push('/login')
        }
        this.$message({
          message: '退出成功',
          type: 'success',
          duration: 1000
        })
      } catch (error) {
        console.error('退出错误:', error)
        this.$message({
          message: '退出失败',
          type: 'error',
          duration: 1000
        })
      }
    }
  }
}
</script>

<style scoped>
.nav-bar {
  background: #1a1a1a;
  border-bottom: 1px solid rgba(0, 255, 157, 0.2);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
}

.cyber-menu {
  background: transparent;
  border: none;
  height: 60px;
  display: flex;
  justify-content: center;
  padding: 0;
}

.menu-items {
  display: flex;
  gap: 20px;
}

.cyber-menu-item {
  height: 60px;
  line-height: 60px;
  border: none !important;
  background: transparent !important;
  color: #00ff9d !important;
  font-size: 16px;
  padding: 0 30px !important;
  margin: 0 !important;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}

.cyber-menu-item::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ff9d, transparent);
  transform: scaleX(0);
  transition: transform 0.3s;
}

.cyber-menu-item:hover::before,
.cyber-menu-item.is-active::before {
  transform: scaleX(1);
}

.cyber-menu-item:hover {
  text-shadow: 0 0 8px rgba(0, 255, 157, 0.8);
  background: rgba(0, 255, 157, 0.1) !important;
}

.cyber-menu-item.is-active {
  text-shadow: 0 0 8px rgba(0, 255, 157, 0.8);
  background: rgba(0, 255, 157, 0.15) !important;
}

.cyber-menu-item i {
  margin-right: 5px;
  font-size: 18px;
}

.logout {
  color: #ff3e3e !important;
}

.logout::before {
  background: linear-gradient(90deg, transparent, #ff3e3e, transparent);
}

.logout:hover {
  text-shadow: 0 0 8px rgba(255, 62, 62, 0.8);
  background: rgba(255, 62, 62, 0.1) !important;
}

:deep(.el-menu--horizontal > .el-menu-item.is-active) {
  border-bottom: none;
}

:deep(.el-menu--horizontal > .el-menu-item) {
  border-bottom: none;
}

/* 添加动画效果 */
@keyframes flicker {
  0% { opacity: 1; }
  50% { opacity: 0.8; }
  100% { opacity: 1; }
}

.cyber-menu-item i {
  animation: flicker 2s infinite;
}
</style> 