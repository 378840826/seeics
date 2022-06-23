// 调整日志
import request from '@/router/axios';

// 列表
export const queryTable = data => {
  return request({
    url: '/api/seeics-ad/adjustment-log/list',
    method: 'post',
    data,
    params: {
      current: data.current,
      size: data.size,
    }
  });
};