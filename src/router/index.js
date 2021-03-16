import Vue from 'vue'
import Router from 'vue-router'
import other from './modules/other'
import rpush from './modules/rpush'

Vue.use(Router)

let route = new Router({
  base: '/assets/',
  mode: 'hash',
  routes: [
    ...rpush,
    ...other
  ]
})

route.beforeEach((to, from, next) => {
  if (to.path === '/') {
    next({ path: '/login' })
    return
  }
  if (to.path === '/login') {
    next()
  } else {
    // 检测是否存在登录信息
    const logininfo = window.localStorage.getItem('operateLoginInfo')
    console.log(logininfo)
    next()
  }
})
export default route
