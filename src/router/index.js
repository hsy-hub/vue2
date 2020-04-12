import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Container from '../views/Container'
import UserList from '../views/UserList'
// import MainPage from '../views/MainPage'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/container',
    name: 'Container',
    component: Container,
    children: [
      {
        path: '', // 这里设成空 登录之后直接显示列表 如果要写入路径不带/
        name: 'UserList',
        component: UserList
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
