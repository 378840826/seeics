import request from '@/router/axios';

export const getList = () => {
  return request({
    url: '/api/seeics-mws/store/list',
    method: 'get',
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
  console.log('updateName', data);
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
