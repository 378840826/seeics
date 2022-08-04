// 企业会员
import request from '@/router/axios';

// 获取用户会员
export const queryMemberUserList = data => {
  return request({
    url: '/api/seeics-member/information/queryMemberUserList',
    method: 'get',
    params: {
      ...data
    }
  });
};

export const getHeader = () => {
  return request({
    url: '/api/seeics-member/common/queryFunctionHeaderList',
    method: 'get'
  });
};

export const queryEnterpriseList = data => {
  return request({
    url: '/api/seeics-member/level/enterpriseList',
    method: 'post',
    params: {
      ...data
    },
    data,
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

// 新增会员
export const addLeve = data => {
  return request({
    url: '/api/seeics-member/level/create',
    method: 'post',
    data,
  });
};