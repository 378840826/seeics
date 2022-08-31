<template>
  <basic-container>
    <div>
      <h2>我的会员</h2>
      <p>
        当前会员等级：<span style="color: #ff0000; fontWeight: 600">{{type === 1 && levelName || type === 2 && '企业会员' || '普通会员' }}</span>
        <span style="marginLeft: 40px">有效期剩余：<span style="color: #009900">{{levelName === '普通会员' ? '—' : effectiveDays + '天'}}</span></span>
        <el-button 
          v-if="levelName !== '普通会员'" 
          type="text" @click="handleUpgrade('renew')" style="marginLeft: 10px">续费</el-button>
        <!-- <span style="marginLeft: 40px" >订单加油包剩余：{{effectiveDays}}</span> -->
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

      <span v-if="levelName !== '至尊VIP'">升级：
        <el-button v-if="type === 1 && nextLevelName" type="primary" @click="handleUpgrade('upgrade')">{{nextLevelName}}</el-button>
      </span> 
      <el-button type="primary" disabled @click="handleRefuel()" style="marginLeft: 30px">购买订单加油包</el-button>
      <el-button type="primary" @click="handleRefuel(4, '购买关键词分析加油包')" style="marginLeft: 30px">购买关键词分析加油包</el-button>
      <el-button type="primary" @click="handleRefuel(6, '购买榜单分析加油包')" style="marginLeft: 30px">购买榜单分析加油包</el-button>
    </div>
    <h4>付款记录</h4>
    <avue-crud
      :option="option"
      :data="data"
      :page.sync="page"
      @on-load="queryIndentPage"
    >
      <template slot="itemName" slot-scope="scope">
         <div>
           {{`${format(scope.row.type)}${scope.row.itemName}一${scope.row.unitName}` }}</div>
      </template>

      <template slot="payType" slot-scope="scope">
         <div>{{ payTypeMethos(scope.row.payType) }}</div>
      </template>
    </avue-crud>
    <upgrade-dialog
      v-if="isvibist"
      v-model="isvibist"
      :dialogVisible="dialogVisible"
      :info="{
        levelName,
        effectiveDays,
        expirationTime,
        renew,
        priceVoList,
        queryIndentPage,
        queryInfo
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
        renew,
        tilte: refuelTitle,
        queryIndentPage,
        queryInfo
      }"
    />
  </basic-container>
</template>

<script>
// import upgradeDialog from './componets/upgradeDialog.vue';

import upgradeDialog from './componets/upgradeDialog';
import refuelDialog from './componets/refuelDialog';
import { queryInfo, queryIndentPage, upgradeInfo, renewInfo, refuelList, changeLevel } from '@/api/member/member';
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
      nextLevelName: '',
      effectiveDays: 0, //有效天数
      expirationTime: '', //过期时间
      // priceVoList: [], //会员价格列表
      renew: false, //续费标识
      refuelTitle: '',
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
            slot: true
          },
          {
            label: '支付方式',
            prop: 'payType',
            slot: true
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
      isRefuel: false,
      type: 1,
    };
  },
  mounted() {
    this.queryInfo();
  },
  watch: {
    isvibist: {
      handler(val) {
        if (!val) {
          this.renew = false;
        }
      },
      deep: true
    },
    $router: {
      handler() {
        if (window.location.href.split('?').length > 1) {
          window.location.href = window.location.href.split('?')[0];
        }
      },
      immediate: true,
    }
  },

  methods: {
    format(val) {
      // if (val === 1) {
      //   return '购买会员';
      // } else if (val === 2)
      switch (val) {
      case 1:
        return '购买会员';
      case 2:
        return '升级会员';
      case 3: 
        return '续费会员';
      case 4:
        return '购买加油包';
      default: '';
      }
    },

    orginPrice(val) {
      switch (val) {
      case 'VIP月':
        return '299.00';
      case 'VIP年':
        return '2999.00';
      case '高级VIP月': 
        return '499.00';
      case '高级VIP年':
        return '4999.00';
      case '至尊VIP月':
        return '999.00';
      case '至尊VIP年':
        return '9999.00';
      default: '';
      }
    },

    changeLevel() {
      changeLevel({
        userId: '1123598821738675201',
        type: 2,
        levelPriceId: '1547099470383886340'
      }).then(res => console.log(res));
    },
    // 表格样式
    rowStyle(flag) {
      if (flag === 'row') {
        return { padding: '5px 0' };
      } else if (flag === 'header') {
        return { background: '#ccc', color: '#303133', padding: '5px 0' };
      }
    },
    payTypeMethos(val) {
      if (val === 1) {
        return '微信';
      } else if (val === 2) {
        return '支付宝';
      }
    },
    handleUpgrade(flag) {
      // this.changeLevel();
      if (flag === 'renew') {
        this.renew = true;
        renewInfo().then(res => {
          if (res.data.code === 200) {
            this.priceVoList = res.data.data.priceVoList;
            this.priceVoList = this.priceVoList.map(item => {
              return {
                ...item,
                orginPrice: this.orginPrice(`${item.levelName}${item.unitName}`)
              };
            });
            this.dialogVisible = true;
            this.isvibist = true;
          }
        });
      } else {
        upgradeInfo().then(res => {
          if (res.data.code === 200) {
            this.priceVoList = res.data.data.priceVoList.filter(item => item.levelName !== this.levelName);
            this.priceVoList = this.priceVoList.map(item => {
              return {
                ...item,
                orginPrice: this.orginPrice(`${item.levelName}${item.unitName}`)
              };
            });
            this.dialogVisible = true;
            this.isvibist = true;
          }
        });
      }
      
    },
    handleRefuel(code, tilte) {
      this.refuelTitle = tilte;
      refuelList({ function: code }).then(res => {
        if (res.data.code === 200) {
          this.refuelList = res.data.data;
          this.refuelVisible = true;
          this.isRefuel = true;
        }
      });
    },
    queryInfo() {
      queryInfo().then(res => {
        if (res.data.code === 200) {
          this.levelName = res.data.data.levelName;
          this.nextLevelName = res.data.data.nextLevelName;
          this.effectiveDays = res.data.data.effectiveDays;
          this.table = res.data.data.surplusVoList;
          this.expirationTime = res.data.data.expirationTime;
          this.type = res.data.data.type;
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
