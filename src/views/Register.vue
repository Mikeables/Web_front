<template>
  <div class="register">
    <div class="new-year">2025年新年快乐</div>
    <el-card class="register-card">
      <div class="title">
        <h2>南华购物系统 - 用户注册</h2>
      </div>
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
        <el-form-item label="手机号" prop="username">
          <el-input 
            v-model="form.username" 
            placeholder="请输入11位手机号"
            prefix-icon="el-icon-mobile-phone">
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input 
            type="password" 
            v-model="form.password" 
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            show-password>
          </el-input>
        </el-form-item>
        <el-form-item class="button-group">
          <div class="button-row">
            <el-button 
              type="primary" 
              @click="handleRegister" 
              class="register-button"
              :loading="loading">
              注册
            </el-button>
            <el-button 
              @click="$router.push('/login')"
              class="login-button">
              已有账号？去登录
            </el-button>
          </div>
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
    // 密码验证规则
    const validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (value.length < 6 || value.length > 20) {
        callback(new Error('密码长度应在6-20位之间'))
      } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
        callback(new Error('密码只能包含字母和数字'))
      } else {
        callback()
      }
    }

    return {
      loading: false,
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async handleRegister() {
      try {
        this.loading = true
        await this.$refs.form.validate()
        const res = await userApi.register(this.form)
        this.$message.success('注册成功')
        this.$router.push('/login')
      } catch (error) {
        console.error('注册错误:', error)
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.message || '注册失败')
        } else {
          this.$message.error('注册失败，请检查输入信息')
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.register {
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

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.register-card {
  width: 400px;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.title {
  text-align: center;
  margin-bottom: 30px;
}

h2 {
  color: #409EFF;
  margin-bottom: 10px;
  font-size: 24px;
}

.subtitle {
  color: #909399;
  font-size: 14px;
}

.button-group {
  margin-top: 30px;
}

.button-row {
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

.register-button, .login-button {
  flex: 1;
  padding: 12px 0;
}

.register-button {
  background: linear-gradient(to right, #409EFF, #36D1DC);
  border: none;
}

.register-button:hover {
  background: linear-gradient(to right, #36D1DC, #409EFF);
  transform: translateY(-1px);
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.3);
}

.login-button {
  border: 1px solid #DCDFE6;
  color: #606266;
}

.login-button:hover {
  color: #409EFF;
  border-color: #409EFF;
  background: #ecf5ff;
}

:deep(.el-input__inner) {
  height: 40px;
  line-height: 40px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input__prefix) {
  left: 10px;
  color: #909399;
}

:deep(.el-input input) {
  padding-left: 35px;
}
</style> 