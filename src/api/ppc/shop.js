import request from '@/router/axios';

export const getList = params => {
  return request({
    url: '/api/seeics-mws/store/user_store',
    method: 'get',
    params,
  });
};

export const bind = data => {
  return request({
    url: '/api/seeics-mws/store/bind',
    method: 'post',
    data,
  });
};

export const unbind = data => {
  return request({
    url: '/api/seeics-mws/store/unbind',
    method: 'post',
    data,
  });
};

export const updateName = data => {
  return request({
    url: '/api/seeics-mws/store/modify/name',
    method: 'post',
    data, 
  });
};

export const authorize = data => {
  return request({
    url: '/api/seeics-ad/store/authorize',
    method: 'post',
    data,
  });
};

export const cancelAuthorize = data => {
  return request({
    url: '/api/seeics-ad/store/cancel',
    method: 'post',
    data,
  });
};

// 改变同步开关
export const changeSync = data => {
  return request({
    url: '/api/seeics-mws/seeics-mws/store/modify/dataSync',
    method: 'post',
    data,
  });
};

