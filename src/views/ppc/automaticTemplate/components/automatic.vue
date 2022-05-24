<template>
  <div class="sa">
    <div class="tabel">
      <span>自动化模板：</span>
      <el-select v-model="automatedOperation">
        <el-option
          v-for="item in launchOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <el-table
      :data="tableData"
      :header-cell-style="{'text-align':'center'}"
      style="width: 100%; margin: 10px 0 0 0">
      <el-table-column
        label="广告活动"
        prop="campaign"
        align="center"
      >
        <template slot-scope="scope">
          <div>{{scope.row.campaign}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="广告组"
        prop="adGroup"
        align="center"
      >
        <template slot-scope="scope">
          <div>{{scope.row.adGroup}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="匹配类型"
        prop="matchType"
        align="center"
      >
        <template slot-scope="scope">
          <el-select v-model="scope.row.matchType" placeholder="请选择">
            <el-option
              v-for="item in matchType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="竞价参考"
        prop="bidType"
        align="center"
      >
        <template slot-scope="scope">
          <el-select v-model="scope.row.bidType" placeholder="请选择">
            <el-option
              v-for="item in bidSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="竞价策略"
        align="center"
      >
        <template slot-scope="scope">
         <div v-if="scope.row.bidType === '广告组默认竞价'">无需选择竞价</div> 
         <el-input v-else v-model="scope.row.bid" type="number">
         </el-input>
        </template>
      </el-table-column>
      <el-table-column
        label=""
      >
        <template slot-scope="scope">
         <div v-if="scope.row.bidType !== '广告组默认竞价'" class="currency">(站点货币)</div> 
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'automatic',
  props: {
    echo: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      tableData: [
        {
          campaign : '自动化标签所在广告活动',
          adGroup: '自动化标签所在广告组',
          matchType: '精准匹配',
          bidType: '广告组默认竞价',
          bid: ''
        },
      ],
       matchType: [{
          value: '精准匹配',
          label: '精准匹配'
        }, {
          value: '词组匹配',
          label: '词组匹配'
        }, {
          value: '广泛匹配',
          label: '广泛匹配'
        }
       ],
       bidSelect: [
         {
           value: '广告组默认竞价',
           label: '广告组默认竞价'
         }, {
           value: '固定竞价',
           label: '固定竞价'
         }
       ],
      automatedOperation: '添加到投放',
      launchOption: [
        {
          label: '添加到投放',
          value: '添加到投放'
        },
        {
          label: '添加到否定投放',
          value: '添加到否定投放'
        }
      ]
    };
  },
  watch: {
    tableData: {
      handler(val) {
        console.log(val)
      },
      deep: true
    }
  },
  mounted() {
  //   console.log(Object.keys(this.echo).length)
    Object.keys(this.echo).length && this.echoFiled();
  },
  methods: {
    echoFiled() {
      // this.tableData[0] = {
      //   campaign : '自动化标签所在广告活动',
      //   adGroup: '自动化标签所在广告组',
      //   ...this.echo
      // }
      this.tableData[0].matchType = this.echo.matchType;
      this.tableData[0].bid = this.echo.bid;
      this.tableData[0].bidType = this.echo.bidType;
    },
    getFiled() {
      return {
        matchType: this.tableData[0].matchType,
        bidType: this.tableData[0].bidType,
        bid: this.tableData[0].bid,
        automatedOperation: this.automatedOperation
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .tabel {
    display: flex;
    margin-top: 20px;
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
      font-size: 14px;
      background: #ccc;
    }
  }
  ::v-deep .el-input__icon {
    line-height: 30px;
  }
  .currency {
    color: #409EFF;
  }
   
</style>