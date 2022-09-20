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

//删除
export const removeTemplate = (id) => {
  return request({
    url: '/api/seeics-analysis/automation-template/remove',
    method: 'get',
    params: {
      id,
    }
  });
};

// 模板名称校验
export const repeatName = (name) => {
  return request({
    url: '/api/seeics-analysis/automation-template/repeat-name',
    method: 'get',
    params: {
      name,
    }
  });
};

// 广告活动
export const queryCampaignList = params => {
  return request({
    url: '/api/seeics-analysis/automation-template/store',
    method: 'get',
    params
  });
};

// 根据id获取广告活动
export const queryCampaignPage = data => {
  return request({
    url: '/api/seeics-analysis/automation-template/campaign-page',
    method: 'post',
    data,
  });
};

// 删除已添加广告活动
export const deleteCampaign = params => {
  return request({
    url: '/api/seeics-analysis/automation-template/campaign-remove',
    method: 'get',
    params,
  });
};