<template>
  <basic-container>
    <div>
      <h2>我的会员</h2>
      <p>
        当前会员等级：<span style="color: #ff0000; fontWeight: 600">{{levelName}}</span>
        <span style="marginLeft: 40px">有效期剩余：<span style="color: #009900">{{effectiveDays}}</span>天</span>
        <el-button type="text" style="marginLeft: 10px">续费</el-button>
        <span style="marginLeft: 40px" >订单加油包剩余：{{effectiveDays}}</span>
      </p>
      <h4>功能余量</h4>
      <el-table 
        :data="table"
         border
        :header-cell-style="rowStyle('header')"
        :cell-style="rowStyle('row')"
      >
        <el-table-column prop="functionName" label="功能" align="center"></el-table-column>
        <el-table-column prop="frequency" label="套餐剩余次数" align="center"></el-table-column>
        <el-table-column prop="packageFrequency" label="加油包剩余次数" align="center"></el-table-column>
      </el-table>
    </div>
    <div class="upgrade">

      升级：<el-button type="primary" @click="handleUpgrade" style="marginLeft: 30px">至尊VIP</el-button>
      <el-button type="primary" style="marginLeft: 30px">购买订单加油包</el-button>
      <el-button type="primary" style="marginLeft: 30px">购买关键词分析加油包</el-button>
      <el-button type="primary" style="marginLeft: 30px">购买榜单分析加油包</el-button>
    </div>
    <h4>付款记录</h4>
    <avue-crud
      :option="option"
    ></avue-crud>
    <upgrade-dialog
      v-if="isvibist"
      v-model="isvibist"
      :dialogVisible="dialogVisible"
    />
  </basic-container>
</template>

<script>
// import upgradeDialog from './componets/upgradeDialog.vue';

import upgradeDialog from './componets/upgradeDialog';
import { queryInfo } from '@/api/member/member';
export default {
  name: 'nember',
  components: {
    // upgradeDialog,
    upgradeDialog,
  },
  data() {
    return {
      // 基本信息
      levelName: '', //会员名
      effectiveDays: 0, //有效天数
      table: [],
      option: {
        emptyText: '暂无数据',
        addBtn: false,
        border: true,
        columnBtn: false,
        refreshBtn: false,
        saveBtn: false,
        updateBtn: false,
        cancelBtn: false,
        delBtn: false,
        menu: false,
        editBtn: false,
        align: 'center',
        menuAlign: 'left',
        rowKey: 'id',
        height: 300,
        // selection: true,
        tip: false,
        column: [
          {
            label: '付款时间',
            prop: 'name',
          },
          {
            label: '订单号',
            prop: 'name',
          },
          {
            label: '订单详情',
            prop: 'name',
          },
          {
            label: '支付方式',
            prop: 'name',
          },
          {
            label: '支付金额(￥)',
            prop: 'name',
          },
        ],
      },
      isvibist: false
    };
  },
  mounted() {
    queryInfo().then(res => {
      if (res.data.code === 200) {
        this.levelName = res.data.data.levelName;
        this.effectiveDays = res.data.data.effectiveDays;
        this.table = res.data.data.surplusVoList;
      }
    });
  },
  methods: {
    // 表格样式
    rowStyle(flag) {
      if (flag === 'row') {
        return { padding: '5px 0' };
      } else if (flag === 'header') {
        return { background: '#ccc', color: '#303133', padding: '5px 0' };
      }
    },
    handleUpgrade() {
      console.log(666)
      this.dialogVisible = true
      this.isvibist = true
    }
  }
};
</script>

<style lang="scss" scoped>
  ::v-deep .avue-crud__menu {
    min-height: 0px;
  }
  .upgrade {
    max-width: 800px;
    margin-top: 30px;
  }
</style>
