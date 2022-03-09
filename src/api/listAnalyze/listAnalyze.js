import request from '@/router/axios';

export const analyzeTree = ( parentId ) => {
  return request({
    url: '/api/seeics-analysis/list-analyze/lazy-tree',
    method: 'get',
    params: {
      parentId,
    }
  })
}

//搜索
export const analyzeSearch = ( data ) => {
  return request({
    url: '/api/seeics-analysis/list-analyze/search',
    method: 'post',
    data,
  })
}