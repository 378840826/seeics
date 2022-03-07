import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/blade-resource/attach/list',
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
    url: '/api/blade-resource/attach/detail',
    method: 'get',
    params: {
      id
    }
  });
};

export const remove = (ids) => {
  return request({
    url: '/api/blade-resource/attach/remove',
    method: 'post',
    params: {
      ids,
    }
  });
};

export const add = (row) => {
  return request({
    url: '/api/blade-resource/attach/submit',
    method: 'post',
    data: row
  });
};

export const update = (row) => {
  return request({
    url: '/api/blade-resource/attach/submit',
    method: 'post',
    data: row
  });
};

//设置默认模板
export const defaultTemplate = (id) => {
  return request({
    url: '/api/blade-resource/attach/default',
    method: 'post',
    params: {
      id,
    }
  });
};

//附件下载
export const download = (data) => {
  return request({
    url: '/api/blade-resource/attach/download',
    method:'get',
    responseType: 'blob',
    params: {
      ...data
    }
  })
}
