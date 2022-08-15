/**
 * 绑定的店铺列表
 */
import Vue from 'vue';
import { getList, updateName, unbind, cancelAuthorize, bind, authorize, changeSync } from '@/api/ppc/shop';

const shop = {
  state: {
    list: [],
  },

  mutations: {
    saveList(state, list) {
      // 按店铺名称排序
      list.sort((a, b) => a.storeName.localeCompare(b.storeName));
      state.list = list;
      // 生成站点: 店铺 对象
      const marketplaceObj = {};
      list.forEach(shop => {
        const marketplace = shop.marketplace;
        if (marketplaceObj.hasOwnProperty(marketplace)) {
          marketplaceObj[marketplace].push(shop);
        } else {
          marketplaceObj[marketplace] = [shop];
        }
      });
      // 生成级联选择器对象
      const marketplaceList = Object.keys(marketplaceObj).sort();
      const cascader = marketplaceList.map(marketplace => {
        const marketplaceStoreList = marketplaceObj[marketplace];
        return {
          value: marketplace,
          label: marketplace,
          children: marketplaceStoreList.map(store => {
            return {
              value: store.id,
              label: store.storeName,
            };
          }),
        };
      });
      state.marketplaceObj = marketplaceObj;
      state.cascader = cascader;
    },

    updateList(state, payload) {
      const index = state.list.findIndex(item => item.id === payload.id);
      Vue.set(state.list, index, payload);
    },

    deleteShop(state, payload) {
      const index = state.list.findIndex(item => item.id === payload.shop.id);
      state.list.splice(index, 1);
    },
  },

  actions: {
    // 获取店铺列表
    getShopList({ commit }, payload) {
      return new Promise((resolve, reject) => {
        getList(payload).then(r => {
          commit('saveList', r.data.data);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 修改店铺名称
    updateName({ commit }, payload) {
      return new Promise((resolve, reject) => {
        updateName({ storeId: payload.id, storeName: payload.storeName }).then(r => {
          commit('updateList', payload);
          resolve(r);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 取消广告授权
    cancelAdAuthorize({ commit }, payload) {
      return new Promise((resolve, reject) => {
        cancelAuthorize({ storeId: payload.id }).then(r => {
          commit('updateList', payload);
          resolve(r);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 解绑店铺
    unbindShop({ commit }, payload) {
      return new Promise((resolve, reject) => {
        unbind({ storeId: payload.shop.id }).then(r => {
          commit('deleteShop', payload);
          resolve(r);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 绑定店铺
    bindShop(_, payload) {
      return new Promise((resolve, reject) => {
        bind(payload).then(r => {
          resolve(r);
        }).catch(error => {
          reject(error);
        });
      });
    },
    
    // 添加广告授权
    adAuthorize({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const params = {
          storeId: payload.shop.id,
          accountType: 'seller',
          code: payload.code,
        };
        authorize(params).then(r => {
          commit('updateList', { ...payload.shop, bindAdStore: true, adStoreId: r.data.adStoreId });
          resolve(r);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 改变同步开关
    setSyncSwitch({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const params = {
          storeId: payload.id,
          dataSync: payload.dataSync,
        };
        changeSync(params).then(r => {
          commit('updateList', { ...payload });
          resolve(r);
        }).catch(error => {
          reject(error);
        });
      });
    },
  },
};

export default shop;
