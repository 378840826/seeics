import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-pay/order/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  });
};

export const getDetail = (id) => {
  return request({
    url: '/api/blade-pay/order/detail',
    method: 'get',
    params: {
      id
    }
  });
};

export const remove = (ids) => {
  return request({
    url: '/api/blade-pay/order/remove',
    method: 'post',
    params: {
      ids,
    }
  });
};

export const add = (row) => {
  return request({
    url: '/api/blade-pay/order/submit',
    method: 'post',
    data: row
  });
};

export const update = (row) => {
  return request({
    url: '/api/blade-pay/order/submit',
    method: 'post',
    data: row
  });
};


export const checkOrderStatus = (params) => {
  return request({
    url: '/api/blade-pay/order/checkOrderStatus',
    method: 'get',
    params: params
  });
};
