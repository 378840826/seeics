import request from '@/router/axios';

//获取表格数据，修改排序，修改表格页数
export const getkeywordList = (current, size) => {
  return request({
    url: '/api/seeics-analysis/keyword-analyze/page',
    method: 'get',
    params: {
      current,
      size,
    }
  })
}

//发起关键词分析
export const analysiskeyword = (params,id) => {
  return request({
    url: '/api/seeics-analysis/keyword-analyze/analyze',
    method: 'post',
    data: {
      ...params,
      id,
    },  
  })
}