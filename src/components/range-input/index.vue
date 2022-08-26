<!-- min - max 输入框 -->
<template>
  <div class="container">
    <div class="label">{{label}}</div>
    <div :class="contentClass">
      <span>
        <el-input
          v-model="score.min"
          placeholder="min"
          size="small"
          @input="handleInputMin"
          class="input input-min"
          maxlength="12"
        />
      </span>
      -
      <span>
        <el-input
          v-model="score.max"
          placeholder="max"
          size="small"
          @input="handleInputMax"
          class="input input-max"
          maxlength="12"
        />
      </span>
    </div>
    <!-- <div v-if="error" class="msg">
      最大值必须大于最小值
    </div> -->
  </div>
</template>

<script>

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
    msg: {
      type: Boolean,
    },
    score: {
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
      if (![null, undefined, ''].includes(this.score.min) && ![null, undefined, ''].includes(this.score.max)) {
        return Number(this.score.min) > Number(this.score.max);
      }
    },

    contentClass() {
      return this.error ? 'content' : 'content';
    },
  },

  methods: {
    handleInputMin(value) {
      const val = this.valueFilter(value);
      this.$emit('update:score', { min: val, max: this.score.max });
    },
    handleInputMax(value) {
      const val = this.valueFilter(value);
      this.$emit('update:score', { min: this.score.min, max: val });
    },
  },

  watch: {
    error: {
      handler(val) {
        this.$emit('update:msg', val);
      },
      deep: true,
    }
  }
};
</script>

<style scoped lang="scss">
::v-deep{
  .input {
    input {
      text-align: center;
      border: none;
      height: 30px;
    }
  }
}

.container {
  position: relative;
  width: 340px;
  display: flex;
  justify-content: space-between;
  align-items: center;
//   height: 30px;
}

.content {
  display: flex;
  align-items: center;
//   margin: 6px 0 10px 0;
  color: #979797;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  background: #fff;
  height: 30px;
  &.error {
    border-color: #F56C6C;
  }
}

.label {
  flex: 0 0 25%;
  font-size: 14px;
}

.msg {
  position: absolute;
  bottom: -6px;
  right: 68px;
  color: #F56C6C;
}
</style>
