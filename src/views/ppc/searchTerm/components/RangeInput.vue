<!-- min - max 输入框 -->
<template>
  <div class="container">
    <div class="label">{{label}}</div>
    <div :class="contentClass">
      <span>
        <el-input
          v-model="value.min"
          placeholder="min"
          size="mini"
          @input="handleInputMin"
          class="input input-min"
          maxlength="12"
        />
      </span>
      -
      <span>
        <el-input
          v-model="value.max"
          placeholder="max"
          size="mini"
          @input="handleInputMax"
          class="input input-max"
          maxlength="12"
        />
      </span>
    </div>
    <div v-if="error" class="msg">
      最大值必须大于最小值
    </div>
  </div>
</template>

<script>
import { invalidVals } from '../utils';

export default {
  name: 'RangeInput',

  props: {
    label: {
      type: String,
      required: true,
    },
    valueFilter: {
      type: Function,
    },
    value: {
      type: Object,
      default() {
        return {
          min: '',
          max: '',
        };
      },
    },
  },

  // data() {
  //   return {
  //     min: this.value.min,
  //     max: this.value.max,
  //   };
  // },

  computed: {
    error() {
      if (!invalidVals.includes(this.value.min) && !invalidVals.includes(this.value.max)) {
        return Number(this.value.min) > Number(this.value.max);
      }
    },

    contentClass() {
      return this.error ? 'content error' : 'content';
    },
  },

  methods: {
    handleInputMin(value) {
      const val = this.valueFilter(value);
      this.$emit('input', { min: val, max: this.value.max });
    },
    handleInputMax(value) {
      const val = this.valueFilter(value);
      this.$emit('input', { min: this.value.min, max: val });
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep{
  .input {
    input {
      text-align: center;
      border: none;
    }
  }
}

.container {
  position: relative;
  width: 340px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content {
  display: flex;
  align-items: center;
  margin: 6px 0 10px 0;
  color: #979797;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  background: #fff;

  &.error {
    border-color: #F56C6C;
  }
}

.label {
  flex: 0 0 25%;
}

.msg {
  position: absolute;
  bottom: -6px;
  right: 68px;
  color: #F56C6C;
}
</style>
