<template>
  <div class="denyBox">
    <h3>▌否定关键词（选填）</h3>

    <el-row>
      <el-col :span="12" style="lineHeight: 32px">
        <span>匹配方式：</span>
        <el-radio-group v-model="radio">
          <el-radio label="词组否定">词组否定</el-radio>
          <el-radio label="精准否定">精准否定</el-radio>
        </el-radio-group>
      </el-col>
      <el-col :span="10" style="lineHeight: 32px">
          <div class="added">已添加 3个否定关键词 （最多可添加1000个，会过滤重复的否定关键词）</div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="10">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="textarea"
          @header-click="handleAllDelete"
          @input="handleTextarea"
          style="maxHeight: 200px;minHeight: 200px;">
        </el-input>
      </el-col>

      <el-col :span="2" style="lineHeight: 200px; fontSize: 20px">
          <el-button type="text" size="medium">添加</el-button>
      </el-col>

      <el-col :span="10">
        <el-table
          :data="tableData"
          stripe
          border
          height="200"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="否定商品"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="address"
            label="匹配方式"
            width="96"
            align="center">
          </el-table-column>
          <el-table-column
            prop="address"
            :render-header="headerDelete"
            width="96"
            align="center">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  data() {
    return {
      radio: '词组否定',
      textarea: ''
    };
  },

  methods: {
    headerDelete() {
      return (
        <el-button type="text" style="padding: 0" onClick={this.handleAllDelete}>全部删除</el-button>
      );
    },

    handleAllDelete() {
      console.log(666)
    },

    handleTextarea(value) {
      let valueArr = value.split(/\r\n|\r|\n/);
      console.log(valueArr);
    }
  }
};
</script>


<style lang="scss" scoped>
  .denyBox {
    height: 290px;
    background-color: rgba(242, 242, 242, 1);

    .added {
      line-height: 32px;
      background-color: white;
    }

    ::v-deep .el-radio {
        color: #606266;
        cursor: pointer;
        line-height: 32px;
        margin-right: 30px;
        margin-top: 0px;
    }

    ::v-deep .el-textarea__inner {
      min-height: 200px !important;
      max-height: 200px;
    }
  }
</style>