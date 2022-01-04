import Layout from '@/page/index/'

export default [{
  path: '/login',
  name: '登录页',
  component: () =>
    import( /* webpackChunkName: "page" */ '@/page/login/index'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/activate',
    name: '激活页',
    component: () =>
      import( /* webpackChunkName: "page" */ '@/page/login/activatesuccess'),
      meta: {
        keepAlive: true,
        isTab: false,
        isAuth: false
      }
  },
  {
    path: '/setupnewpsw',
    name: '重置密码页',
    component: () =>
      import( /* webpackChunkName: "page" */ '@/page/login/setupnewpsw'),
      meta: {
        keepAlive: true,
        isTab: false,
        isAuth: false
      }
  },{
    path: '/wechatreg',
    name: '微信登录注册页',
    component: () =>
      import( /* webpackChunkName: "page" */ '@/page/login/wechatreg'),
      meta: {
        keepAlive: true,
        isTab: false,
        isAuth: false
      }
  },{
    path: '/regsuccess',
    name: '注册成功页',
    component: () =>
      import( /* webpackChunkName: "page" */ '@/page/login/regsuccess'),
      meta: {
        keepAlive: true,
        isTab: false,
        isAuth: false
      }
  },
  {
    path: '/',
    name: '主页',
    //redirect: '/wel'
    component: () =>
      import( /* webpackChunkName: "page" */ '@/views/index/index'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },{
    path: '/lock',
    name: '锁屏页',
    component: () =>
      import( /* webpackChunkName: "page" */ '@/page/lock/index'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/404',
    component: () =>
      import( /* webpackChunkName: "page" */ '@/components/error-page/404'),
    name: '404',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }

  },
  {
    path: '/403',
    component: () =>
      import( /* webpackChunkName: "page" */ '@/components/error-page/403'),
    name: '403',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/500',
    component: () =>
      import( /* webpackChunkName: "page" */ '@/components/error-page/500'),
    name: '500',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/myiframe',
    component: Layout,
    redirect: '/myiframe',
    children: [{
      path: ":routerPath",
      name: 'iframe',
      component: () =>
        import( /* webpackChunkName: "page" */ '@/components/iframe/main'),
      props: true
    }]

  },
  {
    path: '*',
    redirect: '/404'
  },
]
