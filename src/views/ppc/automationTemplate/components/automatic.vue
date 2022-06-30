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
          :disabled="item.disable"
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
          <el-select 
            v-model="scope.row.matchType" 
            placeholder="请选择"
            @change="matchTypeSelect"
          >
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
          <el-select 
            v-model="scope.row.bidType" 
            placeholder="请选择"
            @change="bidTypeSelect(scope.$index)"
          >
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
        label=""
        prop="cpcType"
        align="center"
      >
        <template 
          slot-scope="scope" 
          v-if="scope.row.bidType === '过去7天CPC' 
          || scope.row.bidType === '过去14天CPC' 
          || scope.row.bidType === '过去21天CPC' 
          || scope.row.bidType === '过去30天CPC'">
          <el-select 
            v-model="scope.row.cpcType" 
            placeholder="请选择"
            @change="cpcTypeSelect(scope.$index)"
          >
            <el-option
              v-for="item in shang"
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
         <div v-else-if="scope.row.bidType === '固定竞价'" class="bid">
            <el-input 
              v-model="scope.row.bid" 
              placeholder="固定竞价"
              @blur="numberChange($event, 'bid')"
            >
              <div
                slot="prefix"
                style="lineHeight: 30px;">站点货币</div>
            </el-input>
           <!-- <div v-if="msg" class="msg">支持两位小数</div> -->
         </div>
         <div v-else-if="!scope.row.cpcType">无</div>
         <div v-else-if="scope.row.cpcType">
           <el-input
              v-model="scope.row.cpcValue"
              @blur="numberChange($event, 'cpcValue')"
              placeholder="调整数值"
            >
              <div
                v-if="scope.row.cpcType === '上浮(%)' || scope.row.cpcType === '下调(%)'"
                slot="suffix"
                style="lineHeight: 30px;">%</div>
                <div
                v-else
                slot="prefix"
                style="lineHeight: 30px;">站点货币</div>
            </el-input>
            <!-- <div v-if="scope.row.valueMsg" class="msg">支持两位小数</div> -->
         </div>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label=""
      >
        <template slot-scope="scope">
         <div v-if="scope.row.bidType !== '广告组默认竞价'" class="currency">(站点货币)</div> 
        </template>
      </el-table-column> -->
      <el-table-column
        label=""
        prop="cpcMost"
        align="center"
      >
        <template slot-scope="scope" v-if="scope.row.cpcType">
          <el-input
            v-model="scope.row.cpcMost"
            @blur="numberChange($event, 'cpcMost')"
            placeholder="竞价最大值"
          >
            <div slot="prefix" style="lineHeight: 30px;">站点货币</div>
          </el-input>
          <!-- <div v-if="scope.row.mostMsg" class="msg">支持两位小数</div> -->
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
          campaign: '自动化标签所在广告活动',
          adGroup: '自动化标签所在广告组',
          matchType: '精准匹配',
          bidType: '广告组默认竞价',
          bid: '',
          cpcType: '',
          cpcValue: '',
          cpcMost: '',
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
          value: '过去7天CPC',
          label: '过去7天CPC'
        },
        {
          value: '过去14天CPC',
          label: '过去14天CPC'
        },
        {
          value: '过去21天CPC',
          label: '过去21天CPC'
        },
        {
          value: '过去30天CPC',
          label: '过去30天CPC'
        },
        {
          value: '广告组默认竞价',
          label: '广告组默认竞价'
        }, {
          value: '固定竞价',
          label: '固定竞价'
        }
      ],
      shang: [
        // {
        //   label: '--',
        //   value: ''
        // },
        {
          label: '上浮(%)',
          value: '上浮(%)'
        },
        {
          label: '上浮(绝对值)',
          value: '上浮(绝对值)'
        },
        {
          label: '下调(%)',
          value: '下调(%)'
        },
        {
          label: '下调(绝对值)',
          value: '下调(绝对值)'
        },
      ],
      automatedOperation: '添加到投放',
      launchOption: [
        {
          label: '添加到投放',
          value: '添加到投放'
        },
        {
          label: '添加到否定投放',
          value: '添加到否定投放',
          disable: true
        }
      ],
      msg: false
    };
  },
  mounted() {
    Object.keys(this.echo).length && this.echoFiled();
  },
  watch: {
    tableData: {
      handler(val) {
        const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/;
        if (reg.test(Number(val[0].bid))) {
          this.msg = false;
        } else {
          this.msg = true;
        }
      },
      deep: true
    }
  },
  methods: {
    numberChange (val, name) {
      const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      if (isNaN(val.target.value)) { 
        val.target.value = parseFloat(val.target.value) ;
      } 
      if (val.target.value.indexOf('.') > 0){
        val.target.value = val.target.value.slice(0, val.target.value.indexOf('.') + 3);
        this.tableData[0][name] = val.target.value;
      }
      if (!reg.test(val.target.value)) {
        val.target.value = '';
        this.tableData[0][name] = '';
      }
    },
    echoFiled() {
      this.tableData[0].matchType = this.echo.matchType || '精准匹配';
      this.tableData[0].bid = this.echo.bid;
      this.tableData[0].bidType = this.echo.bidType || '广告组默认竞价';
      this.tableData[0].cpcType = this.echo.cpcType;
      this.tableData[0].cpcValue = this.echo.cpcValue;
      this.tableData[0].cpcMost = this.echo.cpcMost;
    },
    getFiled() {
      return {
        matchType: this.tableData[0].matchType,
        bidType: this.tableData[0].bidType,
        bid: this.tableData[0].bid,
        automatedOperation: this.automatedOperation,
        cpcType: this.tableData[0].cpcType,
        cpcValue: this.tableData[0].cpcValue || '',
        cpcMost: this.tableData[0].cpcMost || '',
      };
    },
    bidTypeSelect(index) {
      this.tableData[index].bid = '';
      if (this.tableData[index].bidType === '广告组默认竞价' || this.tableData[index].bidType === '固定竞价') {
        this.tableData[index].cpcType = '';
      } else {
        this.tableData[index].cpcType = '上浮(%)';
      }
      this.tableData[index].cpcMost = '';
      this.tableData[index].cpcValue = '';
    },
    matchTypeSelect() {
      // this.tableData[0].bidType = '广告组默认竞价';
      // this.tableData[0].bid = '';
      // this.tableData[0].cpcType = '';
    },
    cpcTypeSelect() {
      this.tableData[0].bid = '';
      this.tableData[0].cpcMost = '';
      this.tableData[0].cpcValue = '';
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
  ::v-deep .el-input__prefix, .el-input__suffix {
    position: absolute;
    top: 0;
    -webkit-transition: all .3s;
    height: 100%;
    color: #C0C4CC;
    font-size: 12px;
    text-align: center;
  }
  ::v-deep .el-input--prefix .el-input__inner {
    padding-left: 55px;
    font-size: 12px;
  }
  ::v-deep .el-input--suffix .el-input__inner {
    padding-right: 30px;
    font-size: 12px;
  }
  .bid {
    .msg {
      color: red;
    }
  }
</style>