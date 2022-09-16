/**
 * 全局配置文件
 */
export default {
  title: '思意', //title: "saber",
  logo: 'S',
  key: 'saber', //配置主键,目前用于存储
  indexTitle: '思意', //导航栏最上面的显示
  clientId: 'saber', // 客户端id
  clientSecret: 'saber_secret', // 客户端密钥
  tenantMode: true, // 是否开启租户模式
  tenantId: '000000', // 管理组租户编号
  captchaMode: true, // 是否开启验证码模式
  switchMode: false, // 是否开启部门切换模式
  lockPage: '/lock',
  tokenTime: 3000,
  tokenHeader: 'Blade-Auth',
  //http的status默认放行列表
  statusWhiteList: [],
  // axios 请求 response 拦截的路由放行列表
  urlWhiteList: [
    // st报表导出
    '/api/seeics-analysis/searchTerm/download',
    // 机构用户导入
    '/api/blade-user/import-dept-user',
    // 自动化模板名称校验
    '/api/seeics-analysis/automation-template/repeat-name',
    // 创建广告活动
    '/api/seeics-ad/campaign/create',
    // 关键词批量导入
    '/api/seeics-analysis/keyword-analyze/batch-analyze',
    // 智能广告-创建广告组校验
    '/api/seeics-analysis/automation-template/repeat-group',
  ],
  //配置首页不可关闭
  isFirstPage: false,
  fistPage: {
    label: '关键词分析',
    value: '/keyword/index',
    params: {},
    query: {},
    meta: {
      i18n: 'keyword'
    },
    group: [],
    close: false
  },
  //配置菜单的属性
  menu: {
    iconDefault: 'iconfont icon-caidan',
    props: {
      label: 'name',
      path: 'path',
      icon: 'source',
      children: 'children'
    }
  },
  // 第三方系统授权地址
  //authUrl: 'http://localhost/blade-auth/oauth/render',
  authUrl: 'https://www.seeics.com/api/blade-auth/oauth/render',

  // 流程设计器地址
  flowDesignUrl: 'http://localhost:9999',
  // 报表设计器地址(cloud端口为8108,boot端口为80)
  reportUrl: 'http://localhost:8108/ureport',
};
