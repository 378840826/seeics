import request from '@/router/axios';
export const getCampaignList = (data) => {
  return request({
    url: '/api/seeics-ad/store/shopNameList',
    method: 'get',

  });
};