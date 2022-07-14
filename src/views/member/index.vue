<template>
  <basic-container>
    <div>
      <h2>我的会员</h2>
      <p>
        当前会员等级：{{3}}
        <span style="marginLeft: 40px">有效期剩余：{{12}}天</span>
        <span style="marginLeft: 40px">订单加油包剩余：{{12}}</span>
      </p>
      <h4>功能余量</h4>
      <el-table 
        :data="table"
         border
        :header-cell-style="rowStyle('header')"
        :cell-style="rowStyle('row')"
        height="300px"
      >
        <el-table-column prop="122" label="功能" align="center">
          <template slot-scope="scope">
             <div>123</div>
          </template>
        </el-table-column>
        <el-table-column label="套餐剩余次数" align="center"></el-table-column>
        <el-table-column label="加油包剩余次数" align="center"></el-table-column>
      </el-table>
    </div>
    <div style="maxWidth: 800px">

      升级：<el-button style="marginLeft: 30px">至尊VIP</el-button>
      <el-button style="marginLeft: 30px">购买订单加油包</el-button>
      <el-button style="marginLeft: 30px">购买关键词分析加油包</el-button>
      <el-button style="marginLeft: 30px">购买榜单分析加油包</el-button>
    </div>
    <h4>付款记录</h4>
    <avue-crud></avue-crud>
  </basic-container>
</template>

<script>

export default {
  name: 'nember',
  data() {
    return {
      table: [{
        122: '123'
      }]
    };
  },
  methods: {
    // 表格样式
    rowStyle(flag) {
      if (flag === 'row') {
        return { padding: '5px 0' };
      } else if (flag === 'header') {
        return { background: '#ccc', color: '#303133', padding: '5px 0' };
      }
    }
  }
};
</script>
