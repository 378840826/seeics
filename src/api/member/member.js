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