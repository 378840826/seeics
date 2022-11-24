
const frequencyOption = [
  { 
    label: '每7天',
    value: '7'
  },
  {
    label: '每14天',
    value: '14'
  },
  {
    label: '每21天',
    value: '21'
  },
  {
    label: '每30天',
    value: '30'
  },
];

const adjustmentFrequency = [
  {
    label: '每天',
    value: '每天',
  }, {
    label: '每周',
    value: '每周'
  }, {
    label: '工作日',
    value: '工作日'
  }, {
    label: '周末',
    value: '周末',
  }
];

export const frequency = (params) => {
  if (params === '搜索词' || params === '投放') {
    return frequencyOption;
  } else if (params === '分时调价') {
    return adjustmentFrequency;
  }
};