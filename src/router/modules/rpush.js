import Main from '@/views/main/main'

export default [
  {
    path: '/rpush',
    name: 'rpush',
    meta: {
      title: '消息',
      access: null,
      icon: 'el-icon-tickets',
      // 是否显示在下级的
      nextLevel: true
    },
    component: Main,
    children: [
      {
        path: '/configManagement',
        name: 'configManagement',
        meta: {
          title: '消息配置'
        },
        component: () => import('@/views/page/rpush/configManagement')
      },
      {
        path: '/receiverManagement',
        name: 'receiverManagement',
        meta: {
          title: '接收人管理'
        },
        component: () => import('@/views/page/rpush/receiverManagement')
      },
      {
        path: '/groupManagement',
        name: 'groupManagement',
        meta: {
          title: '接收人分组'
        },
        component: () => import('@/views/page/rpush/groupManagement')
      },
      {
        path: '/templateManagement',
        name: 'templateManagement',
        meta: {
          title: '模板管理'
        },
        component: () => import('@/views/page/rpush/templateManagement')
      },
      {
        path: '/sendMessage',
        name: 'sendMessage',
        meta: {
          title: '发消息'
        },
        component: () => import('@/views/page/rpush/sendMessage')
      }
    ]
  }
]
