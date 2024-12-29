<template>
  <div class="login">
    <div class="new-year">2025年新年快乐</div>
    <el-card class="login-card">
      <div class="title">
        <h2>南华购物系统 - 用户登录</h2>
      </div>
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
        <el-form-item label="手机号" prop="username">
          <el-input v-model="form.username" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">登录</el-button>
          <el-button @click="$router.push('/register')">没有账号？去注册</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { userApi } from '../api'

export default {
  data() {
    // 手机号验证规则
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号'))
      } else if (!/^1[3-9]\d{9}$/.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }

    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度应在6-20位之间', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async handleLogin() {
      try {
        await this.$refs.form.validate()
        const res = await userApi.login(this.form)
        if (res.data && res.data.data) {  // 确保有返回数据
          localStorage.setItem('user', JSON.stringify({
            id: res.data.data.id,
            username: res.data.data.username,
            role: res.data.data.role
          }))
          this.$message.success('登录成功')
          this.$router.push('/products')
        } else {
          throw new Error('登录返回数据格式错误')
        }
      } catch (error) {
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || '登录失败')
        } else {
          this.$message.error('登录失败，请检查手机号和密码')
        }
      }
    }
  }
}
</script>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #409EFF, #FF4B2B);
  position: relative;
}
.new-year {
  position: absolute;
  top: 50px;
  color: #fff;
  font-size: 36px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  animation: bounce 2s infinite;
}
.login-card {
  width: 400px;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
}
.title {
  text-align: center;
  margin-bottom: 30px;
  color: #409EFF;
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}
</style> 