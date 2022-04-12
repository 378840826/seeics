import request from '@/router/axios';

export const queryCampaigns = data => {
  return request({
    url: '/api/seeics-analysis/ppc/campaigns',
    method: 'post',
    data,
  });
};

export const queryGroups = data => {
  return request({
    url: '/api/seeics-analysis/ppc/groups',
    method: 'post',
    data,
  });
};

export const queryPutKeywordList = data => {
  console.log('请求投放词', data);
  return request({
    url: '/api/seeics-analysis/ppc/st/put-keyword',
    method: 'post',
    data,
  });
};

export const queryQueryKeywordList = data => {
  console.log('请求搜索词', data);
  return request({
    url: '/api/seeics-analysis/ppc/st/query-keyword',
    method: 'post',
    data,
  });
};

export const savePreference = data => {
  return request({
    url: '/api/seeics-analysis/ppc/st/save-preference',
    method: 'post',
    data,
  });
};

export const queryPreference = () => {
  return request({
    url: '/api/seeics-analysis/ppc/st/preference',
    method: 'get',
  });
};

export const querySearchTermList = () => {
  return request({
    url: '/api/seeics-analysis/ppc/st/list',
    method: 'get',
  });
};
