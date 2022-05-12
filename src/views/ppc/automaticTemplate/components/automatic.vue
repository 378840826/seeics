<template>
  <div class="sa">
    <div class="tabel">
      <span>规则名称：</span>
      <span style="width: 50%"><el-input/></span>
    </div>
    <el-table
    :data="tableData"
    
    style="width: 100%; marginRight: 0">
      <el-table-column
        label="广告活动"
      >
      </el-table-column>
      <el-table-column
        label="广告组"
      >
      </el-table-column>
      <el-table-column
        label="匹配类型"
      >
      123
      </el-table-column>
      <el-table-column
        label="竞价参考"
      >
      </el-table-column>
      <el-table-column
        label="竞价策略"
      >
      </el-table-column>
      <el-table-column
        label=""
      >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'automatic',
  data() {
    return {
      
    };
  }
};
</script>

<style lang="scss" scoped>
  .tabel {
    display: flex;
    margin-top: 30px;
  }
  .sa {
    ::v-deep .el-table th {
    padding: 0;
    min-width: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align: middle;
    position: relative;
    text-align: left;
    // font-weight: 100;
    color: black;
    font-size: 12px;
    background: #ccc;
}

  }
   
</style>