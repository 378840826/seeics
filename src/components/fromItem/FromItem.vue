<template>
  <div class="box" :style="{width: width}">
    <span>{{label}}：</span>
    <el-form-item class="mix" :style="{width: inputWidth}"><el-input type="number" style="width: 100%"  @input="inputMin" v-model="mins"/></el-form-item>
     <div class="divs">
       ——
     </div>
    <el-form-item class="max" :style="{width: inputWidth}"><el-input style="width: 100%"  @input="inputMax" v-model="maxs"/></el-form-item>
  </div>
</template>

<script>

export default {
  name: 'FromItem',
  props: {
    width: {
      type: String,
      default: '400px'
    },
    label: {
      type: String,
      default: ''
    },
    max: {
      type: String,
      default: ''
    },
    min: {
      type: String,
      default: ''
    },
    inputWidth: {
      type: String,
      default: '100px',
    }
  },
  data() {
    return {
      maxs: this.max,
      mins: this.min,
    };
  },
  methods: {
    inputMax(e) {
      this.$emit('update:max', e);
    },
    inputMin(e) {
      this.$emit('update:min', e);
    }
  }
};
</script>

<style lang='scss' scoped>
  .box {
    display: flex;
    align-content: center;
    span {
      line-height: 40px;
    }
    .mix {
      // width: 100px;
      ::v-deep .el-input__inner {
        font-size: 12px;
        width: 100%;
      }
    }
    .max {
      // width: 100px;
      ::v-deep .el-input__inner {
        font-size: 12px;
        width: 100%;
      }
    }
    .divs {
      // border-bottom: 2px #ccc solid;
      // width: 30px;
      line-height: 40px;
      margin: 0 2px;
    }
  }
</style>
