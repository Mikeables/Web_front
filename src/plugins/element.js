import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 全局配置
Vue.use(ElementUI, {
  size: 'medium', // 设置组件默认尺寸
  zIndex: 3000    // 设置弹框的初始 z-index
})

// 配置消息提示的默认显示时间
Vue.prototype.$ELEMENT = {
  size: 'medium',
  duration: 1000  // 消息显示1秒
} 