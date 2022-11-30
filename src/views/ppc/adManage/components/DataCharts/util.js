export const nameDict = {
  impressions: 'Impressions',
  clicks: 'Clicks',
  spend: 'Spend',
  acos: 'ACoS',
  roas: 'RoAS',
  ctr: 'CTR',
  cpc: 'CPC',
  cpa: 'CPA',
  sales: '销售额',
  orderNum: '订单量',
  conversionsRate: '转化率',
};

export const pageNameDict = {
  campaign: '广告活动',
  placement: '广告位',
  group: '广告组',
  ad: '广告',
  keyword: '关键词',
  targeting: 'Targeting',
  targetingGroup: '广告组合',
};

// 模拟 a 标签下载
export const downloadATag = (blobUrl, fileName) => {
  const a = document.createElement('a');
  a.download = `${fileName}`;
  a.href = blobUrl;
  a.click();
};
