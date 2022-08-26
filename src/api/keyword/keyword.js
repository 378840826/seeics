import request from '@/router/axios';

//获取表格数据，修改排序，修改表格页数
export const getkeywordList = (data) => {
  return request({
    url: '/api/seeics-analysis/keyword-analyze/page',
    method: 'post',
    data: {
      ...data
    }
  });
};

//发起关键词分析
export const analysiskeyword = (params, id) => {
  return request({
    url: '/api/seeics-analysis/keyword-analyze/analyze',
    method: 'post',
    data: {
      ...params,
      id,
    },  
  });
};

//词频统计
export const wordStatistics = (id) => {
  return request({
    url: '/api/seeics-analysis/keyword-analyze/word-frequency',
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

//重复关键词调用
export const keyWordReset = (id) => {
  return request({
    url: `/api/seeics-analysis/keyword-analyze/reset-state?id=${id}`,
    method: 'get',
  });
};

//导出词频
export const keywordOptions = (data) => {
  return request({
    url: '/api/seeics-analysis/keyword-analyze/download/keyword/count',
    method: 'post',
    params: {
      ...data
    },
    responseType: 'blob'
  });
};

//导出分析
export const analyzeDownload = (id) => {
  return request({
    url: '/api/seeics-analysis/keyword-analyze/download',
    method: 'get',
    params: {
      id,
    },
    responseType: 'blob'
  });
};

//应用全局词频选项
export const overallOption = (data) => {
  return request({
    url: '/api/seeics-analysis/keyword-analyze/save/keyword/count/overall/option',
    method: 'post',
    data,
  });
};

//获取应用全局选项
export const getGlobalOption = () => {
  return request({
    url: '/api/seeics-analysis/keyword-analyze/get/keyword/count/overall/option',
    method: 'get'
  });
};

//详情页（大屏）
export const getDetial = (id) => {
  return request({
    url: `/api/seeics-analysis/keyword-analyze/detail-page/${id}`,
    method: 'get',
  });
};

// 批量分析
export const batchAnalyze = (searchCountry, data) => {
  return request({
    url: '/api/seeics-analysis/keyword-analyze/batch-analyze',
    method: 'post',
    params: {
      searchCountry
    },
    data,
  });
};

//批量导入下载模板
export const batchDownload = () => {
  return request({
    url: '/api/seeics-analysis/keyword-analyze/download/ranking/template',
    method: 'get',
    responseType: 'blob'
  });
};

// 批量导出关键词
export const batchExport = data => {
  return request({
    url: '/api/seeics-analysis/keyword-analyze/download/score-batch',
    method: 'post',
    responseType: 'blob',
    data,
  });
};
