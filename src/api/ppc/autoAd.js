import request from '@/router/axios';

// 店铺名称列表
export const queryShopNameList = () => {
  return request({
    url: '/api/seeics-ad/store/shopNameList',
    method: 'get',
  });
};

// 站点列表
export const queryMarketplaceList = params => {
  return request({
    url: '/api/seeics-ad/store/marketplaceList',
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
export const getAutomationList = () => {
  return request({
    url: '/api/seeics-analysis/automation-template/list',
    method: 'get'
  });
};