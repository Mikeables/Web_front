import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// 添加响应拦截器
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const userApi = {
  register: (data) => api.post('/user/register', data),
  login: (data) => api.post('/user/login', data)
}

export const productApi = {
  getProducts: () => api.get('/products')
}

export const cartApi = {
  addToCart: (data) => api.post('/cart', data),
  getCart: (userId) => api.get(`/cart/${userId}`),
  deleteFromCart: (cartId) => api.delete(`/cart/${cartId}`)
}

export const logisticsApi = {
  createOrder: (data) => api.post('/logistics', data),
  getLogistics: (userId) => api.get(`/logistics/user/${userId}`),
  getLogisticsDetail: (orderId) => api.get(`/logistics/${orderId}`),
  deleteOrder: (orderId) => api.delete(`/logistics/${orderId}`)
} 