<template>
  <div class="checkout">
    <el-container>
      <el-header>
        <nav-bar></nav-bar>
      </el-header>
      <el-main>
        <el-card class="checkout-card">
          <div slot="header">
            <h2>确认订单信息</h2>
          </div>
          <el-form :model="form" :rules="rules" ref="form" label-width="100px">
            <el-form-item label="收货人" prop="receiver">
              <el-input v-model="form.receiver" placeholder="请输入收货人姓名"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号码"></el-input>
            </el-form-item>
            <el-form-item label="所在地区" required>
              <el-select v-model="form.province" placeholder="请选择省份" @change="handleProvinceChange">
                <el-option v-for="item in provinces" :key="item" :label="item" :value="item"></el-option>
              </el-select>
              <el-select v-model="form.city" placeholder="请选择城市" @change="handleCityChange">
                <el-option v-for="item in cities" :key="item" :label="item" :value="item"></el-option>
              </el-select>
              <el-select v-model="form.district" placeholder="请选择区县">
                <el-option v-for="item in districts" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="详细地址" prop="detailAddress">
              <el-input v-model="form.detailAddress" type="textarea" placeholder="请输入详细地址"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSubmit">确认支付</el-button>
              <el-button @click="$router.push('/cart')">返回购物车</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { logisticsApi } from '../api'
import NavBar from '../components/NavBar.vue'
import { getProvinces, getCities, getDistricts } from '../utils/address-data'

export default {
  components: { NavBar },
  data() {
    return {
      form: {
        receiver: '',
        phone: '',
        province: '',
        city: '',
        district: '',
        detailAddress: ''
      },
      rules: {
        receiver: [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        detailAddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      provinces: getProvinces(),
      cities: [],
      districts: []
    }
  },
  methods: {
    handleProvinceChange(val) {
      this.form.city = ''
      this.form.district = ''
      this.cities = getCities(val) || []
      this.districts = []
    },
    handleCityChange(val) {
      this.form.district = ''
      this.districts = getDistricts(this.form.province, val) || []
    },
    async handleSubmit() {
      try {
        await this.$refs.form.validate()
        
        // 获取用户信息
        const userStr = localStorage.getItem('user')
        if (!userStr) {
          throw new Error('请先登录')
        }
        const user = JSON.parse(userStr)
        
        // 获取结算商品
        const checkoutItems = JSON.parse(localStorage.getItem('checkoutItems') || '[]')
        if (checkoutItems.length === 0) {
          throw new Error('没有要结算的商品')
        }
        
        // 构建完整地址
        const fullAddress = `${this.form.province}${this.form.city}${this.form.district} ${this.form.detailAddress}`
        
        // 创建订单
        await logisticsApi.createOrder({
          user_id: user.id,
          receiver: this.form.receiver,
          phone: this.form.phone,
          address: fullAddress,
          items: checkoutItems
        })
        
        // 清除结算商品缓存
        localStorage.removeItem('checkoutItems')
        
        // 提示成功
        this.$message.success('订单创建成功')
        
        // 跳转到订单页面
        this.$router.push('/orders')
        
      } catch (error) {
        console.error('提交订单失败:', error)
        this.$message.error(error.message || '提交订单失败，请重试')
      }
    }
  }
}
</script>

<style scoped>
.checkout {
  background-color: #f5f7fa;
  min-height: 100vh;
}

.checkout-card {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
}

.el-select {
  margin-right: 10px;
  width: 160px;
}

/* 添加一些响应式样式 */
@media screen and (max-width: 768px) {
  .el-select {
    width: 100%;
    margin-right: 0;
    margin-bottom: 10px;
  }
}

h2 {
  text-align: center;
  color: #409EFF;
  margin: 0;
}
</style> 