import request from '@/router/axios';

// 店铺名称列表
export const queryShopNameList = () => {
  return request({
    // url: '/api/seeics-ad/store/shopNameList',
    url: '/api/seeics-mws/store/storeInfoList',
    method: 'get',
  });
};

// 站点列表
export const queryMarketplaceList = params => {
  return request({
    // url: '/api/seeics-ad/store/marketplaceList',
    url: '/api/seeics-mws/store/storeInfoList',
    method: 'get',
    params,
  });
};

// 列表
export const queryCampaignList = data => {
  return request({
    url: '/api/seeics-ad/campaign/list',
    method: 'post',
    data,
    params: {
      current: data.current,
      size: data.size,
    }
  });
};

//广告组列表
export const getGroupList = (campaignIds) => {
  return request({
    url: '/api/seeics-ad/group/list',
    method: 'post',
    data: {
      campaignIds,
    }
  });
};

//自动化模板列表
export const getAutomationList = (data) => {
  return request({
    url: '/api/seeics-analysis/automation-template/list',
    method: 'get',
    params: {
      ...data
    }
  });
};

//自动化模板规则回显
export const getAutomationDetail = (id) => {
  return request({
    url: '/api/seeics-analysis/automation-template/details',
    method: 'get',
    params: {
      id: id
    }
  });
};

// 手动投放
export const manualDelivery = (data) => {
  return request({
    url: '/api/seeics-analysis/automation-template/manual-delivery',
    method: 'post',
    data
  });
};

// 创建并保存模板
export const createAndSave = (data) => {
  return request({
    url: '/api/seeics-analysis/automation-template/advertising-campaign-template-create',
    method: 'post',
    data,
  });
};

// 创建模板
export const createTemplate = (data) => {
  return request({
    url: '/api/seeics-analysis/automation-template/advertising-campaign-create',
    method: 'post',
    data,
  });
};

// 设置模板状态
export const templateStatus = (data) => {
  return request({
    url: '/api/seeics-analysis/automation-template/advertising-campaign-status',
    method: 'post',
    data,
  });
};

// 批量设置模板
export const batchTemplate = (data) => {
  return request({
    url: '/api/seeics-analysis/automation-template/advertising-campaign-batch-template',
    method: 'post',
    data,
  });
};

// 批量设置zhuangtai
export const batchStatus = (data) => {
  return request({
    url: '/api/seeics-analysis/automation-template/advertising-campaign-batch-status',
    method: 'post',
    data,
  });
};

// 模板详情
export const templateDetail = (data) => {
  return request({
    url: '/api/seeics-analysis/automation-template/advertising-campaign-details',
    method: 'get',
    params: {
      ...data
    }
  });
};

// 编辑模板
export const templateUpdate = (data) => {
  return request({
    url: '/api/seeics-analysis/automation-template/advertising-campaign-update',
    method: 'post',
    data,
  });
};

// 获取广告组分页根据id
export const getCampaignPage = (data) => {
  return request({
    url: '/api/seeics-analysis/advertising-campaign/page',
    method: 'post',
    // params: {
    //   current: data.current,
    //   size: data.size
    // },
    data,
  });
};

// 创建广告组校验
export const createGroup = data => {
  return request({
    url: '/api/seeics-analysis/automation-template/repeat-group',
    method: 'post',
    data,
  });
};

// 模板名称检验
export const repeatName = params => {
  return request({
    url: '/api/seeics-analysis/automation-template/advertising-repeat-name',
    method: 'get',
    params,
  });
};