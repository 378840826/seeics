import { setToken, setRefreshToken, removeToken, removeRefreshToken } from '@/util/auth';
import { Message } from 'element-ui';
import { setStore, getStore } from '@/util/store';
import { isURL, validatenull } from '@/util/validate';
import { deepClone, getTopUrl, removePageSetup } from '@/util/util';
import website from '@/config/website';
import { loginByUsername, loginBySocial, getUserInfo, logout, refreshToken, getButtons } from '@/api/user';
import { getTopMenu, getRoutes } from '@/api/system/menu';
import md5 from 'js-md5';


function addPath(ele, first) {
  const menu = website.menu;
  const propsConfig = menu.props;
  const propsDefault = {
    label: propsConfig.label || 'name',
    path: propsConfig.path || 'path',
    icon: propsConfig.icon || 'icon',
    children: propsConfig.children || 'children'
  };
  const icon = ele[propsDefault.icon];
  ele[propsDefault.icon] = validatenull(icon) ? menu.iconDefault : icon;
  const isChild = ele[propsDefault.children] && ele[propsDefault.children].length !== 0;
  if (!isChild) {
    ele[propsDefault.children] = []; 
  }
  if (!isChild && first && !isURL(ele[propsDefault.path])) {
    ele[propsDefault.path] = `${ele[propsDefault.path] }/index`;
  } else {
    ele[propsDefault.children].forEach(child => {
      addPath(child);
    });
  }

}

const user = {
  state: {
    tenantId: getStore({ name: 'tenantId' }) || '',
    userInfo: getStore({ name: 'userInfo' }) || [],
    permission: getStore({ name: 'permission' }) || {},
    roles: [],
    menuId: {},
    menu: getStore({ name: 'menu' }) || [],
    menuAll: getStore({ name: 'menuAll' }) || [],
    token: getStore({ name: 'token' }) || '',
    refreshToken: getStore({ name: 'refreshToken' }) || '',
    registeredsuccess: false,
    isPhone: false,
    cacheemail: '',
    isactivatedAccount: false,
    isactivatedAccountspan: false,
  },
  actions: {
    //根据用户名登录
    LoginByUsername({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginByUsername(
          userInfo.tenantId,
          userInfo.deptId,
          userInfo.roleId,
          userInfo.username,
          md5(userInfo.password),
          userInfo.type,
          userInfo.key,
          userInfo.code,
        ).then(res => {
          //如果是注册，则
          if (res.data.error === 'registering'){
            //修改状态值为true
            commit('SET_REGISTEREDSUCCESS', true);        
            //跳转到注册成功
          } else {
            commit('SET_REGISTEREDSUCCESS', false);
          }

          //判断error=invalid_grant，用于前端拦截
          if (res.data.error === 'invalid_grant'){
            //修改状态值为true
            commit('SET_ISACTIVATEDACCOUNT', true);
          } else {
            commit('SET_ISACTIVATEDACCOUNT', false);
          }

          //判断是否是未激活发邮件字样
          if (res.data.error_description === '用户未激活,请到邮箱进行激活'){
            //修改状态值为true
            commit('SET_ISACTIVATEDACCOUNTSPAN', true);
            //跳转到注册成功
          } else {
            commit('SET_ISACTIVATEDACCOUNTSPAN', false);
          }

          //判断是否有电话号码
          if (res.data.phone){
            commit('SET_ISPHONE', true);
          } else {
            commit('SET_ISPHONE', false);
          } 
          
          //将邮箱保存到缓存，发邮件时使用
          commit('SET_CACHEEMAIL', userInfo.username);

          const data = res.data;
          if (data.error_description) {
            Message({
              message: data.error_description,
              type: 'error'
            });
          } else {
            commit('SET_TOKEN', data.access_token);
            commit('SET_REFRESH_TOKEN', data.refresh_token);
            commit('SET_TENANT_ID', data.tenant_id);
            commit('SET_USER_INFO', data);
            commit('DEL_ALL_TAG');
            commit('CLEAR_LOCK');
            //提示登录成功
            removePageSetup();
            Message({
              message: '登录成功',
              type: 'success'
            });
          }
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },
    //根据手机号登录
    LoginByPhone({ commit }, userInfo) {
      return new Promise((resolve) => {
        loginByUsername(userInfo.phone, userInfo.code).then(res => {
          const data = res.data.data;
          commit('SET_TOKEN', data);
          commit('DEL_ALL_TAG');
          commit('CLEAR_LOCK');
          resolve();
        });
      });
    },
    //根据第三方信息登录
    LoginBySocial({ commit }, userInfo) {
      return new Promise((resolve) => {
        
        loginBySocial(userInfo.tenantId, userInfo.source, userInfo.code, userInfo.state).then(res => {
          const data = res.data;
          if (data.error_description) {
            Message({
              message: data.error_description,
              type: 'error'
            });
          } else {
            commit('SET_TOKEN', data.access_token);
            commit('SET_REFRESH_TOKEN', data.refresh_token);
            commit('SET_USER_INFO', data);
            commit('DEL_ALL_TAG');
            commit('CLEAR_LOCK');
            removePageSetup();
            if (!data.user_id) {
              const topUrl = getTopUrl();
              const redirectUrl = '/blade-auth/oauth/redirect/';
              window.location.href = `${topUrl.split(redirectUrl)[0]}#/keyword/index`;
            }
          }
          resolve(data);
        });
      });
    },
    //获取用户信息
    GetUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then((res) => {
          const data = res.data.data;
          commit('SET_ROLES', data.roles);
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
    },
    //刷新token
    refreshToken({ state, commit }) {
      window.console.log('handle refresh token');
      return new Promise((resolve, reject) => {
        refreshToken(state.refreshToken, state.tenantId).then(res => {
          const data = res.data;
          commit('SET_TOKEN', data.access_token);
          commit('SET_REFRESH_TOKEN', data.refresh_token);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_TOKEN', '');
          commit('SET_MENU', []);
          commit('SET_MENU_ALL_NULL', []);
          commit('SET_ROLES', []);
          commit('SET_TAG_LIST', []);
          commit('DEL_ALL_TAG');
          commit('CLEAR_LOCK');
          removeToken();
          removeRefreshToken();
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },
    //修改注册成功的值
    ModifyRegistrationcode({ commit }){
      return new Promise(resolve => {
        commit('SET_REGISTEREDSUCCESS', true);
        resolve();
      });
    },
    //注销session
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        commit('SET_MENU_ALL_NULL', []);
        commit('SET_MENU', []);
        commit('SET_ROLES', []);
        commit('SET_TAG_LIST', []);
        commit('DEL_ALL_TAG');
        commit('CLEAR_LOCK');
        removeToken();
        removeRefreshToken();
        resolve();
      });
    },
    //获取顶部菜单
    GetTopMenu() {
      return new Promise(resolve => {
        getTopMenu().then((res) => {
          const data = res.data.data || [];
          resolve(data);
        });
      });
    },
    //获取系统菜单
    GetMenu({ commit, dispatch }, topMenuId) {
      return new Promise(resolve => {
        getRoutes(topMenuId).then((res) => {
          const data = res.data.data;
          const menu = deepClone(data);
          menu.forEach(ele => {
            addPath(ele, true);
          });
          commit('SET_MENU_ALL', menu);
          commit('SET_MENU', menu);
          dispatch('GetButtons');
          resolve(menu);
        });
      });
    },
    //获取系统按钮
    GetButtons({ commit }) {
      return new Promise((resolve) => {
        getButtons().then(res => {
          const data = res.data.data;
          commit('SET_PERMISSION', data);
          resolve();
        });
      });
    },
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      setToken(token);
      state.token = token;
      setStore({ name: 'token', content: state.token });
    },
    SET_MENU_ID(state, menuId) {
      state.menuId = menuId;
    },
    SET_MENU_ALL: (state, menuAll) => {
      const menu = state.menuAll;
      menuAll.forEach(ele => {
        if (!menu.find(item => item.label === ele.label && item.path === ele.path)) {
          menu.push(ele);
        }
      });
      state.menuAll = menu;
      setStore({ name: 'menuAll', content: state.menuAll });
    },
    SET_MENU_ALL_NULL: (state) => {
      state.menuAll = [];
      setStore({ name: 'menuAll', content: state.menuAll });
    },
    SET_MENU: (state, menu) => {
      state.menu = menu;
      setStore({ name: 'menu', content: state.menu });
    },
    SET_REFRESH_TOKEN: (state, refreshToken) => {
      setRefreshToken(refreshToken);
      state.refreshToken = refreshToken;
      setStore({ name: 'refreshToken', content: state.refreshToken });
    },
    SET_TENANT_ID: (state, tenantId) => {
      state.tenantId = tenantId;
      setStore({ name: 'tenantId', content: state.tenantId });
    },
    SET_REGISTEREDSUCCESS: (state, registeredsuccess) => {
      state.registeredsuccess = registeredsuccess;
      setStore({ name: 'registeredsuccess', content: state.registeredsuccess });
    },
    SET_ISACTIVATEDACCOUNT: (state, isactivatedAccount) => {
      state.isactivatedAccount = isactivatedAccount;
      setStore({ name: 'isactivatedAccount', content: state.isactivatedAccount });
    },
    SET_CACHEEMAIL: (state, cacheemail) => {
      state.cacheemail = cacheemail;
      setStore({ name: 'cacheemail', content: state.cacheemail });
    },
    SET_ISPHONE: (state, isPhone) => {
      state.isPhone = isPhone;
      setStore({ name: 'isPhone', content: state.isPhone });
    },
    SET_USER_INFO: (state, userInfo) => {
      if (validatenull(userInfo.avatar)) {
        userInfo.avatar = '/img/bg/img-logo.png';
      }
      state.userInfo = userInfo;
      setStore({ name: 'userInfo', content: state.userInfo });
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_PERMISSION: (state, permission) => {
      const result = [];

      function getCode(list) {
        list.forEach(ele => {
          if (typeof (ele) === 'object') {
            const chiildren = ele.children;
            const code = ele.code;
            if (chiildren) {
              getCode(chiildren);
            } else {
              result.push(code);
            }
          }
        });
      }

      getCode(permission);
      state.permission = {};
      result.forEach(ele => {
        state.permission[ele] = true;
      });
      setStore({ name: 'permission', content: state.permission });
    }
  }

};
export default user;
