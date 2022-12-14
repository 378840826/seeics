import request from '@/router/axios';

export const queryCampaigns = data => {
  return request({
    url: '/api/seeics-ad/campaign/list',
    method: 'post',
    data,
  });
};

export const queryGroups = data => {
  return request({
    url: '/api/seeics-ad/group/list',
    method: 'post',
    data,
  });
};

// 获取广告组下的搜索词或者投放词
export const queryGroupKeywordList = data => {
  return request({
    url: '/api/seeics-analysis/searchTerm/queryKeywordList',
    method: 'post',
    data,
  });
};

export const savePreference = data => {
  return request({
    url: '/api/seeics-analysis/searchTerm/savePreference',
    method: 'post',
    data,
  });
};

export const queryPreference = () => {
  return request({
    url: '/api/seeics-analysis/searchTerm/queryPreference',
    method: 'get',
  });
};

export const querySearchTermList = data => {
  return request({
    url: '/api/seeics-analysis/searchTerm/list',
    method: 'post',
    params: data,
    data: {
      identicalRecordId: data.identicalRecordId,
    },
  });
};

export const querySearchTerm = data => {
  return request({
    url: '/api/seeics-analysis/searchTerm/search',
    method: 'post',
    data,
  });
};

export const downloadReport = id => {
  return request({
    url: '/api/seeics-analysis/searchTerm/download',
    method: 'get',
    params: { id },
    responseType: 'blob',
  });
};

// 查询一条筛选记录结果中的搜索词
export const querySearchKeyword = params => {
  return request({
    url: '/api/seeics-analysis/searchTerm/querySearchKeywordListFromSearchTerm',
    method: 'get',
    params,
  });
};

// 生成 ASIN关键词排名
export const createAsinKeyworkRanking = data => {
  return request({
    url: '/api/seeics-analysis/keyword-ranking/jump',
    method: 'post',
    data,
  });
};
