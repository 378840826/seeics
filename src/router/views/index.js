import Layout from '@/page/index/';

export default [{
  path: '/wel',
  component: Layout,
  redirect: '/wel/index',
  children: [{
    path: 'index',
    name: '首页',
    meta: {
      i18n: 'dashboard'
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/wel/index')
  }, {
    path: 'dashboard',
    name: '控制台',
    meta: {
      i18n: 'dashboard',
      menu: false,
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/wel/dashboard')
  }]
}, {
  path: '/ppc',
  component: Layout,
  children: [
    {
      path: '/ppc/shop',
      name: '我的店铺',
      component: () => import('@/views/ppc/shop/ShopList'),
    }, {
      path: '/ppc/search-term',
      name: 'Search Term报表',
      component: () => import('@/views/ppc/searchTerm'),
    },
  ],
}, {
  path: '/test',
  component: Layout,
  redirect: '/test/index',
  children: [{
    path: 'index',
    name: '测试页',
    meta: {
      i18n: 'test'
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/util/test')
  }]
}, {
  path: '/keyword',
  component: Layout,
  redirect: '/keyword/index',
  children: [{
    path: 'index',
    name: '关键词分析',
    meta: {
      i18n: 'keyword'
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/keyword/keyword')
  },
  // {
  //   path: 'detail',
  //   name: '关键词分析详情',
  //   meta: {
  //     i18n: 'detail'
  //   },
  //   component: () => {
  //     import('@/views/keyword/keywordDetail')
  //   },
  // }
  ]
},
{
  path: '/keywordDetail',
  component: Layout,
  redirect: '/keywordDetail/index',
  children: [{
    path: 'index',
    name: '关键词分析详情',
    meta: {
      i18n: 'keyword'
    },
    component: () => 
      import(/* webpackChunkName: "views" */ '@/views/keyword/keywordDetail')
  }]
}, 
{
  path: '/dict-horizontal',
  component: Layout,
  redirect: '/dict-horizontal/index',
  children: [{
    path: 'index',
    name: '字典管理',
    meta: {
      i18n: 'dict'
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/util/demo/dict-horizontal')
  }]
}, {
  path: '/dict-vertical',
  component: Layout,
  redirect: '/dict-vertical/index',
  children: [{
    path: 'index',
    name: '字典管理',
    meta: {
      i18n: 'dict'
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/util/demo/dict-vertical')
  }]
}, {
  path: '/info',
  component: Layout,
  redirect: '/info/index',
  children: [{
    path: 'index',
    name: '个人信息',
    meta: {
      i18n: 'info'
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/system/userinfo')
  }]
}, {
  path: '/work/process/leave',
  component: Layout,
  redirect: '/work/process/leave/form',
  children: [{
    path: 'form/:processDefinitionId',
    name: '请假流程',
    meta: {
      i18n: 'work'
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/work/process/leave/form')
  }, {
    path: 'handle/:taskId/:processInstanceId/:businessId',
    name: '处理请假流程',
    meta: {
      i18n: 'work'
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/work/process/leave/handle')
  }, {
    path: 'detail/:processInstanceId/:businessId',
    name: '请假流程详情',
    meta: {
      i18n: 'work'
    },
    component: () =>
      import( /* webpackChunkName: "views" */ '@/views/work/process/leave/detail')
  }]
}, {
  path: '/listAnalysis',
  component: Layout,
  redirect: '/listAnalysis/index',
  children: [{
    path: 'index',
    name: '榜单分析',
    meta: {
      i18n: 'listAnalysis'
    },
    component: () =>
      import(/* webpackChunkName: "views" */ '@/views/listAnalysis/listAnalysis')
  }]
}, {
  path: '/keywordRanking',
  component: Layout,
  redirect: '/keywordRanking/index',
  children: [{
    path: 'index',
    name: 'ASIN关键词分析',
    meta: {
      i18n: 'keywordRanking'
    },
    component: () => 
    import(/* webpackChunkName: "views" */ '@/views/keywordRanking/asinRanking')
  }]
}];
