import request from '@/router/axios';
export const getCampaignList = (data) => {
  return request({
    url: '/api/seeics-ad/campaign/list',
    method: 'post',
    params: {
      current: data.current,
      size: data.size
    },
    data,
  });
};

export const getShopNameList = () => {
  return request({
    url: '/api/seeics-ad/store/shopNameList',
    method: 'get'
  });
};

export const getMarketplaceList = (shopName) => {
  return request({
    url: '/api/seeics-ad/store/marketplaceList',
    method: 'get',
    params: {
      shopName
    }
  });
};

// 创建模板
export const createTemplate = (data) => {
  return request({
    url: '/api/seeics-analysis/automation-template/create',
    method: 'post',
    data,
  });
};

//详情
export const detailTemplate = (id) => {
  return request({
    url: '/api/seeics-analysis/automation-template/details',
    method: 'get',
    params: {
      id
    }
  });
};

// 分页
export const getTemplatePage = (data) => {
  return request({
    url: '/api/seeics-analysis/automation-template/page',
    method: 'get',
    params: {
      ...data
    }
  });
};

//编辑
export const updateTemplate = (data) => {
  return request({
    url: '/api/seeics-analysis/automation-template/update',
    method: 'post',
    data,
  });
};

//添加广告活动
export const addCampaign = (data) => {
  return request({
    url: '/api/seeics-analysis/automation-template/addCampaign',
    method: 'post',
    data
  });
};