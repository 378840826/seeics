<!-- 高级筛选 -->
<template>
  <div v-show="visible" class="container">
    <div v-for="item in options" :key="item.key" class="item">
      <div class="title">
        {{ item.title }}<span v-if="item.suffix" class="suffix">({{ item.suffix }})</span>:
      </div>
      <div class="content">
        <el-input
          v-model="values[`${item.key}Min`]"
          placeholder="min"
          @input="handleInput(`${item.key}Min`)"
          size="mini"
        />
        <span class="hyphen">-</span>
        <el-input
          v-model="values[`${item.key}Max`]"
          @input="handleInput(`${item.key}Max`)"
          placeholder="max"
          size="mini"
        />
      </div>
    </div>
    <div class="item filtrate-btns">
      <el-button @click="handleCancel" size="mini">收起</el-button>
      <el-button type="primary" @click="handleOk" size="mini">确定</el-button>
      <el-button type="text"  @click="handleEmpty" size="mini">清空</el-button>
    </div>
  </div>
</template>

<script>
import { strToMoneyStr, strToNaturalNumStr } from '@/util/numberString';
import { changeFilterTypeToObj } from '@/views/ppc/searchTerm/utils';

export default {
  name: 'FilterMore',

  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    }
  },

  data() {
    return {
      options: [
        { title: '销售额', key: 'sales', formatFun: strToMoneyStr, suffix: this.currency },
        { title: 'Spend', key: 'spend', formatFun: strToMoneyStr, suffix: this.currency },
        { title: 'Clicks', key: 'clicks', formatFun: strToNaturalNumStr },
        { title: '订单量', key: 'orderNum', formatFun: strToNaturalNumStr },
        { title: 'ACoS', key: 'acos', formatFun: strToMoneyStr, suffix: '%' },
        { title: 'CTR', key: 'ctr', formatFun: strToMoneyStr, suffix: '%' },
        { title: 'CPC', key: 'cpc', formatFun: strToMoneyStr, suffix: this.currency },
        { title: 'RoAS', key: 'roas', formatFun: strToMoneyStr },
        { title: '转化率', key: 'conversionsRate', formatFun: strToMoneyStr, suffix: '%' },
        { title: 'CPA', key: 'cpa', formatFun: strToMoneyStr, suffix: this.currency },
        { title: 'Impressions', key: 'impressions', formatFun: strToNaturalNumStr },
      ],
      values: {
      },
    };
  },

  methods: {
    handleInput(key) {
      const formatFun = this.options.find(item => item.key === key.slice(0, -3)).formatFun;
      // 限制输入
      const value = formatFun(this.values[key]);
      this.values[key] = value;
    },

    handleOk() {
      const obj = changeFilterTypeToObj(this.values);
      // 判断最大值是否大于最小值
      const keys = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const min = obj[key]['min'];
        const max = obj[key]['max'];
        if (min && max && Number(min) > Number(max)) {
          const title = this.options.find(item => item.key === key).title;
          this.$message.error(`${title} 筛选的最大值不能低于最小值`);
          return;
        }
      }
      this.$emit('filter', this.values);
    },

    handleCancel() {
      this.$emit('cancel');
    },

    handleEmpty() {
      this.values = {};
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  background-color: #fafafa;
  margin: 10px 0;
  padding: 8px 10px;
}

.item {
  display: flex;
  align-items: center;
  width: 300px;
  font-size: 12px;
  line-height: 36px;
}

.title {
  width: 80px;
}

.suffix {
  color: $secondaryTextColor;
}

.hyphen {
  margin: 0 4px;
  color: $secondaryTextColor;
}

.content {
  display: flex;
  align-items: center;

  ::v-deep {
    .el-input {
      width: 100px;

      input {
        text-align: center;
      }
    }
  }
}

.filtrate-btns {
  justify-content: flex-end;
}
</style>
