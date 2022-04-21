export const marketplacesOptions = [
  {
    label: '北美地区（多选）',
    value: 'NorthAmerica',
    options: [
      {
        value: 'US',
        label: 'US美国',
      },
      {
        value: 'CA',
        label: 'CA加拿大',
      },
      {
        value: 'MX',
        label: 'MX墨西哥',
      },
      {
        value: 'BR',
        label: 'BR巴西',
      },
    ],
  }, {
    label: '欧洲地区（多选）',
    value: 'Europe',
    options: [
      {
        value: 'UK',
        label: 'UK英国',
      },
      {
        value: 'IT',
        label: 'IT意大利',
      },
      {
        value: 'DE',
        label: 'DE德国',
      },
      {
        value: 'FR',
        label: 'FR法国',
      },
      {
        value: 'ES',
        label: 'ES西班牙',
      },
      {
        value: 'PL',
        label: 'PL波兰',
      },
      {
        value: 'EG',
        label: 'EG埃及',
      },
      {
        value: 'NL',
        label: 'NL荷兰',
      },
      {
        value: 'SE',
        label: 'SE瑞典',
      },
      {
        value: 'IN',
        label: 'IN印度',
      },
      {
        value: 'TR',
        label: 'TR土耳其',
      },
      {
        value: 'SA',
        label: 'SA沙特阿拉伯',
      },
      {
        value: 'AE',
        label: 'AE阿联酋',
      },
    ],
  }, {
    label: '远东地区（多选）',
    value: 'AsiaPacific',
    options: [
      {
        value: 'JP',
        label: 'JP日本',
      },
      {
        value: 'SG',
        label: 'SG新加坡',
      },
      {
        value: 'AU',
        label: 'AU澳大利亚',
      },
    ],
  },
];

// 站点对应的地区
export const marketplacesRegion = (() => {
  const result = {};
  marketplacesOptions.forEach(region => {
    region.options.forEach(marketplaces => {
      result[marketplaces.value] = region.value;
    });
  });
  return result;
})();

// 卖家中心 url
export const urls = {
  // 北美 North America
  CA:	'https://sellercentral.amazon.ca',
  US:	'https://sellercentral.amazon.com',
  MX:	'https://sellercentral.amazon.com.mx',
  BR:	'https://sellercentral.amazon.com.br',
  // 欧洲 Europe
  ES: 'https://sellercentral-europe.amazon.com',
  UK: 'https://sellercentral-europe.amazon.com',
  FR: 'https://sellercentral-europe.amazon.com',
  NL: 'https://sellercentral.amazon.nl',
  DE: 'https://sellercentral-europe.amazon.com',
  IT: 'https://sellercentral-europe.amazon.com',
  SE: 'https://sellercentral.amazon.se',
  PL: 'https://sellercentral.amazon.pl',
  EG: 'https://sellercentral.amazon.eg',
  TR: 'https://sellercentral.amazon.com.tr',
  SA: 'https://sellercentral.amazon.com.sa',
  AE: 'https://sellercentral.amazon.ae',
  IN: 'https://sellercentral.amazon.in',
  // 远东 Far East
  SG: 'https://sellercentral.amazon.sg',
  AU: 'https://sellercentral.amazon.com.au',
  JP: 'https://sellercentral.amazon.co.jp',
};

// 获取店铺授权登录的 url
export const getOAuthUrl = (marketplace, state) => {
  const sellerCentralUrl = urls[marketplace];
  const common = '/apps/authorize/consent';
  const applicationId = 'amzn1.sp.solution.23a02eea-8b16-4c81-98c4-74767293b05f';
  const stateJson = encodeURIComponent(JSON.stringify(state));
  const redirect_uri = 'https://www.seeics.com/#/authorize_consent';
  // 草稿状态添加 &version=beta 进行测试
  const url = `${sellerCentralUrl}${common}?application_id=${applicationId}&version=beta&redirect_uri=${redirect_uri}&state=${stateJson}`;
  return url;
};
