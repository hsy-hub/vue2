import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import qs from 'qs'
import axios from 'axios'
import VueResource from './assets/js/vue-resource-1.3.4'
Vue.use(VueResource)
Vue.http.interceptors.push((request, next) => {
  request.headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'))
  next((response) => {
    return response
  })
})
Vue.prototype.$qs = qs
Vue.prototype.$axios = axios
// Vue.http.options.root = 'http://localhost:8081'
Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
