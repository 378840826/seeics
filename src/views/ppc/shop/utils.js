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
