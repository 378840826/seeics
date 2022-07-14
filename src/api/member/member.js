// 我的会员
import request from '@/router/axios';

// 会员基本信息
export const queryInfo = () => {
  return request({
    url: '/api/seeics-member/information/info',
    method: 'get',
  });
};