<template>
  <div class="tableBox">
    <div style="width: 45%">

        <div class="tableTop">
            <div style="width: 80%;">
                搜索：
                <el-input style="width: 80%;"  size="small"/>
            </div>
            <div style="width: 20%;text-align: end;padding-right: 36px;">全选</div>
        </div>
      
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        class="table">
        <el-table-column
            prop="date"
            label="商品信息">
        </el-table-column>
        <el-table-column
            prop="name"
            width="100"
            label="库存"
            >
        </el-table-column>
        <el-table-column
            prop="address"
            width="100"
            label="排名">
        </el-table-column>
        <el-table-column
            align="center"
            prop="address"
            width="100"
            label="操作">
        </el-table-column>
      </el-table>
    </div>

    <div style="width: 45%">

      <div class="tableTop">
        <span>已选商品</span>
        <span style="padding-right: 20px;">全部删除</span>
      </div>

      <el-table
        :data="tableData"
        border
        style="width: 100%"
        class="table">
        <el-table-column
            prop="date"
            label="商品信息">
        </el-table-column>
        <el-table-column
            prop="name"
            width="100"
            label="库存"
            >
        </el-table-column>
        <el-table-column
            prop="address"
            width="100"
            label="排名">
        </el-table-column>
        <el-table-column
            align="center"
            prop="address"
            width="100"
            label="操作">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>

export default {
  
};
</script>

<style lang="scss" scoped>

  .tableBox {
    width: 100%;
    display: flex;
    justify-content: space-around;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }

  .tableTop {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    line-height: 32px;
  }

  .table {
    margin: 10px 0;
  }

</style>
