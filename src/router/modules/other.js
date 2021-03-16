export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      hideInMenu: true,
      title: 'Login - 登录',
      access: null,
      icon: ''
    },
    component: () => import('@/views/login/login.vue')
  }
]
