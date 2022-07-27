// 我的会员
import request from '@/router/axios';

// 会员基本信息
export const queryInfo = () => {
  return request({
    url: '/api/seeics-member/information/info',
    method: 'get',
  });
};

// 订单列表
export const queryIndentPage = (data) => {
  return request({
    url: '/api/seeics-member/order/orderList',
    method: 'get',
    params: {
      ...data
    }
  });
};

// 会员升级
export const upgradeInfo = () => {
  return request({
    url: '/api/seeics-member/level/upgradeInfo',
    method: 'get'
  });
};

// 会员续费
export const renewInfo = () => {
  return request({
    url: '/api/seeics-member/level/renewInfo',
    method: 'get'
  });
};

// 加油包列表
export const refuelList = (data) => {
  return request({
    url: '/api/seeics-member/package/list',
    method: 'get',
    params: {
      ...data
    }
  });
};

//手动升级
export const changeLevel = data => {
  return request({
    url: '/api/seeics-member/information/changeLevel',
    method: 'put',
    data
  });
};

//购买会员信息
export const buyInfo = () => {
  return request({
    url: '/api/seeics-member/level/buyInfo',
    method: 'get'
  });
};

// 购买会员列表
export const buyPage = (data) => {
  return request({
    url: '/api/seeics-member/level/levelInfoList',
    method: 'get',
    params: {
      ...data
    }
  });
};

// 获取下单二维码
export const placeAnOrder = data => {
  return request({
    url: '/api/seeics-member/order/placeAnOrder',
    method: 'post',
    data
  });
};

// 查询订单交易状态
export const queryOrderInfo = id => {
  return request({
    url: `/api/seeics-member/order/queryInfo/${id}`,
    method: 'post',
  });
};

// 修改功能数量
export const updateLevelNum = data => {
  return request({
    url: '/api/seeics-member/level/updateLevelInterest',
    method: 'put',
    params: {
      ...data
    }
  });
};

// 修改会员价格
export const updateLevePrice = data => {
  return request({
    url: '/api/seeics-member/level/updateLevelPrice',
    method: 'put',
    params: {
      ...data
    }
  });
};
