import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Container from '../views/Container'
import UserList from '../views/UserList'
import FirstPage from '../views/FirstPage'
import CourseList from '../views/CourseList'
import ClassRoom from '../views/ClassRoom'
import UpdatePwd from '../views/UpdatePwd'
import GradePage from '../views/GradePage'
import UserList1 from '../views/UserList1'
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
        path: '',
        name: 'FirstPage',
        component: FirstPage
      },
      {
        path: 'userList', // 这里设成空 登录之后直接显示列表 如果要写入路径不带/
        name: 'UserList',
        component: UserList
      },
      {
        path: 'courseList',
        name: 'CourseList',
        component: CourseList
      },
      {
        path: 'classRoom',
        name: 'ClassRoom',
        component: ClassRoom
      },
      {
        path: 'updatePwd',
        name: 'UpdatePwd',
        component: UpdatePwd
      },
      {
        path: 'gradePage',
        name: 'GradePage',
        component: GradePage
      },
      {
        path: 'userList1',
        name: 'UserList1',
        component: UserList1
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    next()
  } else {
    const token = localStorage.getItem('Authorization')

    if (token === null || token === '') {
      next('/')
    } else {
      next()
    }
  }
})
export default router
