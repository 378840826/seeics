// 企业会员
import request from '@/router/axios';

export const getHeader = () => {
  return request({
    url: '/api/seeics-member/common/queryFunctionHeaderList',
    method: 'get'
  });
};