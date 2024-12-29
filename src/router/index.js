import Vue from 'vue'
import VueRouter from 'vue-router'
import { setupRouteGuard } from './guard'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import ProductList from '../views/ProductList.vue'
import Cart from '../views/Cart.vue'
import Checkout from '../views/Checkout.vue'
import Orders from '../views/Orders.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/products' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/products', component: ProductList },
  { path: '/cart', component: Cart },
  { path: '/checkout', component: Checkout },
  { path: '/orders', component: Orders }
]

const router = new VueRouter({ routes })

setupRouteGuard(router)

export default router 