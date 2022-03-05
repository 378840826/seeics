const getters = {
  tag: state => state.tags.tag,
  language: state => state.common.language,
  website: state => state.common.website,
  userInfo: state => state.user.userInfo,
  colorName: state => state.common.colorName,
  themeName: state => state.common.themeName,
  isShade: state => state.common.isShade,
  isCollapse: state => state.common.isCollapse,
  keyCollapse: (state, getters) => getters.screen > 1 ? getters.isCollapse : false,
  screen: state => state.common.screen,
  isLock: state => state.common.isLock,
  isFullScren: state => state.common.isFullScren,
  isMenu: state => state.common.isMenu,
  lockPasswd: state => state.common.lockPasswd,
  tagList: state => state.tags.tagList,
  tagWel: state => state.tags.tagWel,
  token: state => state.user.token,
  roles: state => state.user.roles,
  permission: state => state.user.permission,
  menu: state => state.user.menu,
  menuId: state => state.user.menuId,
  menuAll: state => state.user.menuAll,
  logsList: state => state.logs.logsList,
  logsLen: state => state.logs.logsList.length || 0,
  logsFlag: (state, getters) => getters.logsLen === 0,
  flowRoutes: state => state.dict.flowRoutes,
  registeredsuccess: state => state.user.registeredsuccess,
  isPhone: state => state.user.isPhone, //是否有电话
  cacheemail: state => state.user.cacheemail, //邮件
  isactivatedAccount: state => state.user.isactivatedAccount, //未激活状态
  isactivatedAccountspan: state => state.user.isactivatedAccountspan,
};
export default getters;
