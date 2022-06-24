import request from '@/router/axios';

export const wxNativePay = (row) => {
  return request({
    url: '/api/blade-pay/wxpay/nativePay',
    method: 'post',
    data: row
  });
};

export const wxJsPay = (row) => {
  return request({
    url: '/api/blade-pay/wxpay/jsPay',
    method: 'post',
    data: row
  });
};

export const wxMinAppPay = (row) => {
  return request({
    url: '/api/blade-pay/wxpay/wxAppPay',
    method: 'post',
    data: row
  });
};

export const wxH5Pay = (row) => {
  return request({
    url: '/api/blade-pay/wxpay/h5Pay',
    method: 'post',
    data: row
  });
};

export const wxAppPay = (row) => {
  return request({
    url: '/api/blade-pay/wxpay/appPay',
    method: 'post',
    data: row
  });
};

export const aliNativePay = (row) => {
  return request({
    url: '/api/blade-pay/alipay/nativePay',
    method: 'post',
    data: row
  });
};

export const aliJsPay = (row) => {
  return request({
    url: '/api/blade-pay/alipay/jsPay',
    method: 'post',
    data: row
  });
};

export const aliPcPay = (row) => {
  return request({
    url: '/api/blade-pay/alipay/pcPay',
    method: 'post',
    data: row
  });
};

export const aliH5Pay = (row) => {
  return request({
    url: '/api/blade-pay/alipay/h5Pay',
    method: 'post',
    data: row
  });
};

export const aliAppPay = (row) => {
  return request({
    url: '/api/blade-pay/alipay/appPay',
    method: 'post',
    data: row
  });
};
