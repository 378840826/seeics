<template>
  <div style="width: 50%">
    <el-table
      :data="tableData"
      stripe
      border
      style="width: 100%">
      <el-table-column
        prop="date"
        label="状态"
       >
      </el-table-column>
      <el-table-column
        prop="name"
        label="Targeting Group"
        >
      </el-table-column>
      <el-table-column
        prop="address"
        label="建议竞价">
      </el-table-column>
      <el-table-column
        prop="address"
        label="竞价">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {

};
</script>
