<template>
  <basic-container>
    <div>
      <h2>我的会员</h2>
      <p>
        当前会员等级：<span style="color: #ff0000; fontWeight: 600">{{levelName}}</span>
        <span style="marginLeft: 40px">有效期剩余：<span style="color: #009900">{{effectiveDays}}</span>天</span>
        <el-button v-if="levelName !== '普通会员'" type="text" @click="handleUpgrade('renew')" style="marginLeft: 10px">续费</el-button>
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

      <span v-if="levelName !== '至尊VIP'">升级：<el-button type="primary" @click="handleUpgrade('upgrade')">{{vip(levelName)}}</el-button></span> 
      <el-button type="primary" disabled @click="handleRefuel()" style="marginLeft: 30px">购买订单加油包</el-button>
      <el-button type="primary" @click="handleRefuel(4)" style="marginLeft: 30px">购买关键词分析加油包</el-button>
      <el-button type="primary" @click="handleRefuel(6)" style="marginLeft: 30px">购买榜单分析加油包</el-button>
    </div>
    <h4>付款记录</h4>
    <avue-crud
      :option="option"
      :data="data"
      :page.sync="page"
      @on-load="queryIndentPage"
    ></avue-crud>
    <upgrade-dialog
      v-if="isvibist"
      v-model="isvibist"
      :dialogVisible="dialogVisible"
      :info="{
        levelName,
        effectiveDays,
        expirationTime,
        renew,
        priceVoList
      }"
    />
    <refuel-dialog
      v-if="isRefuel"
      v-model="isRefuel"
      :refuelVisible="refuelVisible"
      :info="{
        levelName,
        effectiveDays,
        expirationTime,
        refuelList,
        renew
      }"
    />
  </basic-container>
</template>

<script>
// import upgradeDialog from './componets/upgradeDialog.vue';

import upgradeDialog from './componets/upgradeDialog';
import refuelDialog from './componets/refuelDialog';
import { queryInfo, queryIndentPage, upgradeInfo, renewInfo, refuelList } from '@/api/member/member';
export default {
  name: 'nember',
  components: {
    refuelDialog,
    upgradeDialog,
  },
  data() {
    return {
      // 基本信息
      levelName: '', //会员名
      effectiveDays: 0, //有效天数
      expirationTime: '', //过期时间
      // priceVoList: [], //会员价格列表
      renew: false, //续费标识
      table: [],
      data: [],
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
            prop: 'payTime',
          },
          {
            label: '订单号',
            prop: 'code',
          },
          {
            label: '订单详情',
            prop: 'itemName',
          },
          {
            label: '支付方式',
            prop: 'payType',
          },
          {
            label: '支付金额(￥)',
            prop: 'payAmount',
          },
        ],
      },
      page: {
        total: 0,
        currentPage: 1,
        layout: 'total, sizes, prev, pager, next, jumper',
        pageSize: 20,
        pageSizes: [20, 50, 100],
      },
      isvibist: false,
      isRefuel: false
    };
  },
  mounted() {
    queryInfo().then(res => {
      if (res.data.code === 200) {
        this.levelName = res.data.data.levelName;
        this.effectiveDays = res.data.data.effectiveDays;
        this.table = res.data.data.surplusVoList;
        this.expirationTime = res.data.data.expirationTime;
      }
    });
  },
  watch: {
    isvibist: {
      handler(val) {
        if (!val) {
          this.renew = false;
        }
      },
      deep: true
    }
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
    vip(val) {
      if (val === '普通会员') {
        return 'VIP';
      } else if (val === 'VIP') {
        return '高级VIP';
      } else if (val === '高级VIP') {
        return '至尊VIP';
      }
    },
    handleUpgrade(flag) {
      if (flag === 'renew') {
        this.renew = true;
        renewInfo().then(res => {
          if (res.data.code === 200) {
            this.priceVoList = res.data.data.priceVoList;
            this.dialogVisible = true;
            this.isvibist = true;
          }
        });
      } else {
        upgradeInfo().then(res => {
          if (res.data.code === 200) {
            this.priceVoList = res.data.data.priceVoList.filter(item => item.levelName !== this.levelName);
            this.dialogVisible = true;
            this.isvibist = true;
          }
        });
      }
      
    },
    handleRefuel(code) { 
      refuelList({ function: code }).then(res => {
        if (res.data.code === 200) {
          this.refuelList = res.data.data;
          this.refuelVisible = true;
          this.isRefuel = true;
        }
      });
    },
    queryIndentPage() {
      queryIndentPage({ size: this.page.pageSize, current: this.page.currentPage }).then(res => {
        if (res.data.code === 200) {
          this.data = res.data.data.records;
          this.page.total = res.data.data.total;
          this.page.currentPage = res.data.data.current;
        }
      });
    },
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
