import request from '@/router/axios';

export const analyzeTree = ( data ) => {
  return request({
    url: '/api/seeics-analysis/list-analyze/lazy-tree',
    method: 'get',
    params: {
      ...data,
    }
  });
};

//搜索
export const analyzeSearch = ( data ) => {
  return request({
    url: '/api/seeics-analysis/list-analyze/search',
    method: 'post',
    data,
  });
};

//分页
export const analyzePage = (current, size, data)  => {
  return request({
    url: '/api/seeics-analysis/list-analyze/page',
    method: 'get',
    params: {
      current,
      size,
      ...data,
    }
  });
};

//分析
export const analyze = ( data, id ) => {
  return request({
    url: '/api/seeics-analysis/list-analyze/analyze',
    method: 'post',
    data: {
      ...data,
      id,
    },
  });
};

//词频分析
export const keyWordAnalyze = ( id ) => {
  return request({
    url: '/api/seeics-analysis/list-analyze/word-frequency',
    method: 'post',
    data: {
      id,
    },
  });
};

//下载模板
export const download = () => {
  return request({
    url: '/api/seeics-analysis/keyword-analyze/download/template',
    method: 'get',
    responseType: 'blob'
  });
};

//导出分析
export const analyzeDownload = (id) => {
  return request({
    url: '/api/seeics-analysis/list-analyze/download',
    method: 'get',
    params: {
      id,
    },
    responseType: 'blob'
  });
};

//导出词频
export const wordFrequency = (data) => {
  return request({
    url: '/api/seeics-analysis/list-analyze/download/list-analyze/count',
    method: 'post',
    params: {
      ...data
    },
    responseType: 'blob'
  });
};

//应用全局词频选项
export const overallOption = (data) => {
  return request({
    url: '/api/seeics-analysis/list-analyze/save/list-analyze/count/overall/option',
    method: 'post',
    data,
  });
};

//获取应用全局选项
export const getGlobalOption = () => {
  return request({
    url: '/api/seeics-analysis/list-analyze/get/list-analyze/count/overall/option',
    method: 'get'
  });
};