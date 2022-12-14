<!-- 列表查询条件的面包屑 -->
<template>
<div v-if="visible" class="container">
  <el-tag
    :key="key"
    v-for="(value, key) in tags"
    closable
    @close="handleClose(key)"
    type="info"
    effect="plain"
    :disable-transitions="true"
    class="tag"
    size="mini"
  >
    <span class="title">{{ value.title.title }}</span>
    <span v-if="value.title.suffix" class="suffix">({{ value.title.suffix }})</span>
    ：
    <span class="value">{{ value.value }}</span>
  </el-tag>

  <el-button
    type="text"
    @click="handleEmpty"
    class="btn-empty"
    size="mini"
  >清空条件</el-button>
</div>
</template>

<script>
// 非 Min-Max 值的 key
const notRangeKeys = ['search', 'targetingType', 'groupType', 'state', 'qualification', 'matchType', 'deliveryMethod', 'queryText', 'targetText'];
export { notRangeKeys };
// 可多选的值可能很长的 key
const multipleLongValueKeys = ['portfolios', 'campaigns', 'groups'];
export { multipleLongValueKeys };

export default {
  name: 'FilterCrumbs',

  props: {
    filterConditions: {
      type: Array,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default() {
        return '';
      }
    }
  },

  computed: {
    tags() {
      const obj = {};
      const keys = Object.keys(this.filterConditions);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = this.filterConditions[key];
        if (!value) {
          continue;
        }
        if (this.notRangeKeys.includes(key)) {
          obj[key] = {
            title: { title: this.titleDict[key].title },
            value,
          };
        } else if (this.multipleLongValueKeys.includes(key)) {
          obj[key] = {
            title: { title: this.titleDict[key].title },
            value: `${value[0]} ${value.length > 1 ? ` +${value.length - 1}项` : ''}`,
          };
        } else {
          const k = key.slice(0, -3);
          if (!obj[k]) {
            const min = this.getShowValue(this.filterConditions[`${k}Min`]);
            const max = this.getShowValue(this.filterConditions[`${k}Max`]);
            obj[k] = {
              title: this.titleDict[k],
              value: `${min} - ${max}`,
            };
          }
        }
      }
      return obj;
    },

    visible() {
      return Object.keys(this.tags).length;
    },
  },

  data() {
    return {
      notRangeKeys,
      multipleLongValueKeys,
      titleDict: {
        search: { title: '查询' },
        queryText: { title: '搜索词' },
        targetText: { title: '投放' },
        state: { title: '状态' },
        targetingType: { title: '广告类型' },
        groupType: { title: '投放类型' },
        qualification: { title: '投放资格' },
        matchType: { title: '匹配方式' },
        deliveryMethod: { title: 'Targeting类型' },
        portfolios: { title: '广告组合' },
        campaigns: { title: '广告活动' },
        groups: { title: '广告组' },
        // 以下为 min-max 值的
        sales: { title: '销售额', suffix: this.currency },
        spend: { title: 'Spend', suffix: this.currency },
        acos: { title: 'ACoS', suffix: '%' },
        ctr: { title: 'CTR', suffix: '%' },
        conversionsRate: { title: '转化率', suffix: '%' },
        orderNum: { title: '订单量' },
        impressions: { title: 'Impressions' },
        clicks: { title: 'Clicks' },
        roas: { title: 'RoAS', suffix: '%' },
        cpc: { title: 'CPC', suffix: this.currency },
        cpa: { title: 'CPA', suffix: this.currency },
      },
    };
  },

  methods: {
    handleClose(tag) {
      this.$emit('close', tag);
    },

    handleEmpty() {
      this.$emit('empty');
    },

    getShowValue(val) {
      return [undefined, null].includes(val) ? '_' : val;
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  margin: 10px 0;
  padding: 4px 10px;
  background-color: #fafafa;

  & > *:not(:last-child) {
    margin: 0 10px 6px 0;
  }

  .tag {
    display: inline-flex;
  }

  .btn-empty {
    font-weight: 400;
  }

  .title {
    color: $textColor;
  }

  .suffix {
    color: $secondaryTextColor;
  }

  .value {
    color: $successColor;
    max-width: 600px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  ::v-deep {
    .el-tag__close.el-icon-close {
      color: $danger;
      top: 1px;

      &:hover {
        color: #fff;
        background-color: $danger;
      }
    }
  }
}
</style>
