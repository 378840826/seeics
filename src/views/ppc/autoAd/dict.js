
export const timeList = [
  '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',
  '24:00',
];

export const timeScopeList = [
  '凌晨，00:00 - 07:00', '上午，07:00 - 12:00', '上班，09:00 - 17:00',
  '下午，12:00 - 17:00', '晚间，17:00 - 21:00', '深夜，21:00 - 24:00',
  '24h，00:00 - 24:00',
];

export const bidAdjustList = [
  '原始竞价', '过去7天CPC', '过去14天CPC', '过去21天CPC', '过去30天CPC',
  '固定竞价', '广告组默认竞价'
];

export const flaotList = [
  {
    label: '--',
    value: ''
  },
  {
    label: '上浮(%)',
    value: '上浮(%)'
  },
  {
    label: '上浮(绝对值)',
    value: '上浮(绝对值)'
  },
  {
    label: '下调(%)',
    value: '下调(%)'
  },
  {
    label: '下调(绝对值)',
    value: '下调(绝对值)'
  },
];

export const weekList = [
  { week: '星期一', type: 'word', }, { week: '星期二', type: 'word', },
  { week: '星期三', type: 'word', }, { week: '星期四', type: 'word', },
  { week: '星期五', type: 'word', }, { week: '星期六', type: 'weekend', },
  { week: '星期天', type: 'weekend', },
];