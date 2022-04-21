<!-- min - max 输入框 -->
<template>
  <div class="container">
    <div class="label">{{label}}</div>
    <div class="content">
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
  width: 340px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content {
  display: flex;
  align-items: center;
  margin: 6px 0;
  color: #979797;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  background: #fff;
}

.label {
  flex: 0 0 25%;
}
</style>
