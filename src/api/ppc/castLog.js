import request from '@/router/axios';

export const getLogPage = (data) => {
  return request({
    url: '/api/seeics-analysis/automation-log/page',
    method: 'get',
    params: {
      ...data
    }
  });
};