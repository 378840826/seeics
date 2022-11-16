<template>
  <div class="sa">

    <div v-show="automatedOperation === '创建广告活动'" style="marginTop: 10px">
      <adCampaign 
        ref="adCampaign"
        :rowData="rowData"
        :currency="rowData.currency"
        :adStoreId="rowData.adStoreId"
        :echoPortfolioId="echoPortfolioId"
        :type="campaignType"
        :templateId="templateId"
        :echoCampaign="echoCampaign"/>
    </div>

    <el-table
      :data="tableData"
      :header-cell-style="{'text-align':'center'}"
      max-height="300"
      style="width: 100%; margin: 10px 0 0 0">
      <el-table-column
        v-if="automatedOperation !== '创建广告活动'"
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
          <el-input v-model="scope.row.customText" placeholder="请输入自定义文本；"/>
        </template>
      </el-table-column>

      <el-table-column
        v-if="type === 1"
        label="匹配类型"
        prop="matchType"
        align="center"
      >
        <template slot-scope="scope">
          <el-checkbox-group 
            v-model="scope.row.matchType">
            <el-checkbox label="精准匹配">精准匹配</el-checkbox>
            <el-checkbox label="词组匹配">词组匹配</el-checkbox>
            <el-checkbox label="广泛匹配">广泛匹配</el-checkbox>
          </el-checkbox-group>
          <!-- <el-radio-group v-model="scope.row.matchType">
            <el-radio label="精准匹配">精准匹配</el-radio>
            <el-radio label="词组匹配">词组匹配</el-radio>
            <el-radio label="广泛匹配">广泛匹配</el-radio>
        </el-radio-group> -->
        </template>
      </el-table-column>

      <el-table-column
        :label="`竞价${'调整'}`"
        prop="bidType"
        align="center"
      >
        <template slot-scope="scope">
          <div v-if="automatedOperation === '自动暂停' || automatedOperation === '自动归档'">无</div>
          <el-select 
            v-else
            v-model="scope.row.bidType" 
            placeholder="请选择"
            @change="bidTypeSelect(scope.$index)"
          >
            <el-option
              v-for="item in (automatedOperation === '自动竞价'
                || automatedOperation === '创建广告组'
                || automatedOperation === '创建广告活动'
                ? [...bidSelect, ...launchBidSelect] : bidSelect)"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label=""
        prop="rule"
        align="center"
      >
        <template 
          slot-scope="scope" 
          v-if="(automatedOperation !== '自动竞价' || automatedOperation !== '添加到投放') 
          &&(scope.row.bidType === '过去7天CPC' 
          || scope.row.bidType === '过去14天CPC' 
          || scope.row.bidType === '过去21天CPC' 
          || scope.row.bidType === '过去30天CPC'
          || scope.row.bidType === '建议竞价最小值'
          || scope.row.bidType === '建议竞价最大值'
          || scope.row.bidType === '建议竞价')">
          <el-select 
            v-model="scope.row.rule" 
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
         <div v-if="automatedOperation === '自动暂停' || automatedOperation === '自动归档'">无</div>
         <div v-else>
          <div v-if="scope.row.bidType === '广告组默认竞价'">无需选择竞价</div>
          <div v-else-if="scope.row.bidType === '固定竞价'" class="bid">
              <el-input 
                :ref="'input_bid' + scope.$index"
                v-model="scope.row.bid" 
                placeholder="固定竞价"
                @blur="numberChange($event, 'bid', scope.$index)"
              >
                <div
                  slot="prefix"
                  @click="focus('input_bid' + scope.$index)"
                  style="lineHeight: 30px;">{{rowData.currency}}</div>
              </el-input>
            <!-- <div v-if="msg" class="msg">支持两位小数</div> -->
          </div>
          <div v-else-if="!scope.row.rule">无</div>
          <div v-else-if="scope.row.rule">
            <el-input
                :ref="'input_adjustTheValue' + scope.$index"
                v-model="scope.row.adjustTheValue"
                @blur="numberChange($event, 'adjustTheValue', scope.$index)"
                placeholder="调整数值"
              >
                <div
                  v-if="scope.row.rule === '上浮(%)' || scope.row.rule === '下调(%)'"
                  slot="suffix"
                  style="lineHeight: 30px;">%</div>
                  <div
                  v-else
                  slot="prefix"
                  @click="focus('input_adjustTheValue' + scope.$index)"
                  style="lineHeight: 30px;">{{rowData.currency}}</div>
              </el-input>
              <!-- <div v-if="scope.row.valueMsg" class="msg">支持两位小数</div> -->
          </div>
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
        prop="bidLimitValue"
        align="center"
      >
        <template slot-scope="scope" v-if="scope.row.rule">
          <el-input
            :ref="'input_bidLimitValue' + scope.$index"
            v-model="scope.row.bidLimitValue"
            @blur="numberChange($event, 'bidLimitValue', scope.$index)"
            :placeholder="minValue(scope.row.rule)"
          >
            <div 
              @click="focus('input_bidLimitValue' + scope.$index)"
              slot="prefix"
              style="lineHeight: 30px;">{{rowData.currency}}</div>
          </el-input>
          <!-- <div v-if="scope.row.mostMsg" class="msg">支持两位小数</div> -->
        </template>
      </el-table-column>

      <el-table-column
        label=""
        width="100"
      >
        <template slot-scope="scope">
         <el-button 
           @click="delet(scope.$index)" 
           type="text"
           class="el-icon-delete"
           :disabled="tableData.length === 1"
         />
         <el-button 
           type="text"
           @click="add"
           :disabled="addDisabled(!scope.row.add, scope.row.addDisabled)"
        >+添加</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div v-show="type === 1" class="explain">
      <span style="fontWeight: 900">匹配方式去重： </span> <el-switch v-model="deduplication">
      </el-switch>
      <p>匹配方式去重规则：</p>
      <p>若该店铺的广告组下已有相同的asin，相同的关键词和相同的匹配方式且广告活动状态、广告组状态，ASIN广告状态，关键词状态，均为开启，则跳过该</p>
      <p>匹配方式继续为其他匹配方式创建广告活动；</p>
      <p>默认开启，规则生效，用户可以关闭，规则失效，不校验关键词匹配方式，直接跟进用户选择的匹配方式创建广告活动；</p>
    </div>

    <div v-show="type === 2" class="explain">
      <span style="fontWeight: 900">商品投放去重： </span> <el-switch v-model="deduplication">
      </el-switch>
      <p>商品投放去重规则：</p>
      <p>若该店铺的广告组下已有相同的asin，相同的商品投放且广告活动状态、广告组状态，ASIN广告状态，商品投放状态，均为开启，则此搜索词（ASIN）不</p>
      <p>不再创建广告组；</p>
      <p>默认开启，规则生效，用户可以关闭，规则失效，不校验商品投放是否存在，直接跟进用户规则筛选到的搜索词（ASIN）创建广告组；</p>
    </div>
  </div>
</template>

<script>

import adCampaign from './adCampaign.vue';

export default {
  name: 'automatic',

  components: { adCampaign },

  props: {
    echo: {
      type: Object,
      default: null
    },
    templateType: {
      type: String
    },
    automatedOperation: {
      type: String
    },
    campaign: {
      type: String
    },
    rowData: {
      type: Object,
      default: new Object
    },
    type: {
      type: Number,
      require: true
    },
    campaignType: {
      type: String
    },
    templateId: {
      type: String,
    },
    echoCampaign: {
      type: Array,
    }
  },
  data() {
    const format = (val) => {
      if (val === 1) {
        return '关键词+匹配方式';
      } else if (val === 2) {
        return '搜索词（ASIN）';
      }
    };

    return {
      tableData: [
        {
          campaign: this.campaign,
          adGroup: `ASIN+MSKU+${format(this.type)}+日期时间+`,
          matchType: ['精准匹配'],
          bidType: '广告组默认竞价',
          bid: '',
          rule: '',
          adjustTheValue: '',
          bidLimitValue: '',
          customText: '',
          add: true,
          addDisabled: false
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
      launchBidSelect: [
        {
          value: '建议竞价最小值',
          label: '建议竞价最小值'
        },
        {
          value: '建议竞价最大值',
          label: '建议竞价最大值'
        },
        {
          value: '建议竞价',
          label: '建议竞价'
        }
      ],
      shang: [
        {
          label: '--',
          value: ''
        },
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
      //   automatedOperation: '添加到投放',
      launchOption: [
        {
          label: '无',
          value: null
        },
        {
          label: '添加到投放',
          value: '添加到投放'
        },
        {
          label: '添加到否定投放',
          value: '添加到否定投放',
          disable: true
        },
        {
          label: '自动竞价',
          value: '自动竞价'
        },
        {
          label: '自动暂停',
          value: '自动暂停'
        },
        {
          label: '自动归档',
          value: '自动归档'
        }
      ],
      searchOption: [
        {
          label: '无',
          value: null
        },
        {
          label: '添加到投放',
          value: '添加到投放'
        },
        {
          label: '添加到否定投放',
          value: '添加到否定投放',
          disable: true
        },
        {
          label: '创建广告组',
          value: '创建广告组',
          // disable: true
        },
        {
          label: '创建广告活动',
          value: '创建广告活动',
        }
      ],
      msg: false,
      isAutoShow: true,
      launch: false,
      deduplication: true,

      // 创建广告活动
      form: {
        id: '',
        campaignName: this.rowData.name,
        dailyBudget: '',
        campaignId: this.rowData.campaignId,
        templateId: this.templateId,
        endTime: '',
        startTime: Date.now(),
        deliveryType: 'manual',
        biddingStrategy: 'legacyForSales',
        frontPage: '20', //商品页面 百分比
        productPage: '0', //搜索结果顶部 百分比
        deduplication: 0, //去重
        portfolioId: '',
      },
    };
  },

  mounted() {
    this.echo && Object.keys(this.echo).length && this.echoFiled();
    this.templateType === '投放' ? this.launch = true : this.launch = false;
  },

  watch: {
    tableData: {
      handler(val) {
        const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/;
        val.forEach(item => {
          if (item.bidType === '固定竞价' && !item.bid
              || item.rule === '上浮(%)' && (!item.bidLimitValue || !item.adjustTheValue)
              || item.rule === '下调(%)' && (!item.bidLimitValue || !item.adjustTheValue)
              || item.rule === '下调(绝对值)' && (!item.bidLimitValue || !item.adjustTheValue)
              || item.rule === '上浮(绝对值)' && (!item.bidLimitValue || !item.adjustTheValue)
          ) {
            item.addDisabled = true;
          } else {
            // item.addDisabled = false;
            if (!reg.test(Number(item.bid))
              || !reg.test(Number(item.bidLimitValue))
              || !reg.test(Number(item.adjustTheValue))) {

              item.addDisabled = true;
            
            } else {
              
              item.addDisabled = false;
            }
          }
        });

      },
      deep: true
    },
  },
  
  methods: {

    addDisabled(add, addDisabled) {
      if (this.automatedOperation === '创建广告活动') {
        return true;
      // eslint-disable-next-line no-else-return
      } else {
        return add || addDisabled;
      }
    },

    budgetMsg() {
      return this.$refs.adCampaign.msg();
    },

    minValue(rule) {
      if (rule === '下调(绝对值)' || rule === '下调(%)') {
        return '竞价最小值';
      } else if (rule === '上浮(%)' || rule === '上浮(绝对值)') {
        return '竞价最大值';
      }
    },
    focus(name) {
      this.$refs[name].focus();
    },
    wathcType(val) { //监听模板变化
      if (val === '搜索词') {
        this.launch = false;
        this.automatedOperation = '添加到投放';
        this.tableData[0].matchType = '精准匹配';
        this.isAutoShow = true;
      } else if (val === '投放') {
        this.launch = true;
      }
    },
    numberChange (val, name, idx) {
      const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      val.target.style.borderColor = '';
      if (isNaN(val.target.value)) { 
        val.target.value = parseFloat(val.target.value) ;
      } 

      if (val.target.value.indexOf('.') > 0){
        val.target.value = val.target.value.slice(0, val.target.value.indexOf('.') + 3);
        this.tableData[idx][name] = val.target.value;
      }

      if (this.rowData.marketplace === 'JP') { //日本站
        if (val.target.value > 100000) {
          val.target.style.borderColor = 'red';
          this.$message({
            type: 'error',
            message: '值不能超过100000'
          });
          val.target.value = '';
          // this.$emit('change', true);
        } else if (val.target.value < 2) {
          val.target.style.borderColor = 'red';
          this.$message({
            type: 'error',
            message: '值不能低于2'
          });
          val.target.value = '';
        }
      } else {
        if (val.target.value > 1000) {
          val.target.style.borderColor = 'red';
          this.$message({
            type: 'error',
            message: '值不能超过1000'
          });
          val.target.value = '';
          // this.$emit('change', true);
        } else if (name === 'adjustTheValue' && Number(val.target.value) <= 0) {
          val.target.style.borderColor = 'red';
          this.$message({
            type: 'error',
            message: `值不能低于${name === 'adjustTheValue' ? 0 : 0.02}`
          });
          val.target.value = '';
        } else if (name !== 'adjustTheValue' && val.target.value < 0.02) {
          val.target.style.borderColor = 'red';
          this.$message({
            type: 'error',
            message: `值不能低于${name === 'adjustTheValue' ? 0 : 0.02}`
          });
          val.target.value = '';
        }
      }
      if (!reg.test(val.target.value)) {
        val.target.value = '';
        this.tableData[idx][name] = '';
      }
    },
    
    echoFiled() {
      this.tableData = this.echo.map(item => {
        return {
          ...item,
          campaign: this.campaign,
          adGroup: `ASIN+MSKU+${this.type === 1 ? '关键词' : '搜索词'}+匹配方式+日期时间`,
          matchType: item.matchType && item.matchType.split(',') || ['精准匹配']
        };
      });
      this.deduplication = this.tableData[0].deduplication ? true : false;
      this.tableData[this.tableData.length - 1].add = true;
    },
    getFiled() {
      const obj = this.tableData.map(item => {
        return {
          bidType: item.bidType,
          matchType: item.matchType.join(','),
          // matchType: item.matchType,
          bid: item.bid,
          campaignId: this.rowData.campaignId,
          currency: this.rowData.currency,
          rule: item.rule,
          adjustTheValue: item.adjustTheValue,
          bidLimitValue: item.bidLimitValue,
          customText: item.customText,
          type: this.type,
          deduplication: this.deduplication ? 1 : 0,
        };
      });
      return obj;
    },

    getCampaignField() {
      return this.$refs.adCampaign.getField();
    },


    bidTypeSelect(index) {
      this.tableData[index].bid = '';
      if (this.tableData[index].bidType === '广告组默认竞价' || this.tableData[index].bidType === '固定竞价') {
        this.tableData[index].rule = '';
      } else {
        this.tableData[index].rule = '';
      }
      this.tableData[index].bidLimitValue = '';
      this.tableData[index].adjustTheValue = '';
    },
    matchTypeSelect() {
      // this.tableData[0].bidType = '广告组默认竞价';
      // this.tableData[0].bid = '';
      // this.tableData[0].cpcType = '';
    },
    cpcTypeSelect() {
      this.tableData[0].bid = '';
      this.tableData[0].bidLimitValue = '';
      this.tableData[0].adjustTheValue = '';
    },
    
    add() {
      if (this.tableData.length >= 20) {
        this.$message({
          type: 'warning',
          message: '创建广告组最多可以添加20条'
        });
        return;
      }

      this.tableData.push({
        campaign: this.campaign,
        adGroup: `ASIN+MSKU+${this.type === 1 ? '关键词' : '搜索词'}+匹配方式+日期时间`,
        matchType: ['精准匹配'],
        bidType: '广告组默认竞价',
        bid: '',
        rule: '',
        adjustTheValue: '',
        bidLimitValue: '',
        customText: '',
        add: true,
        addDisabled: false,
      });
      this.tableData[this.tableData.length - 2].add = false;
    },

    delet(idx) {
      this.tableData.splice(idx, 1);
      this.tableData[this.tableData.length - 1].add = true;
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
//   ::v-deep .el-input--prefix .el-input__inner {
//     padding-left: 15px;
//     font-size: 12px;
//   }
  ::v-deep .el-input--suffix .el-input__inner {
    padding-right: 30px;
    font-size: 12px;
  }
  .bid {
    .msg {
      color: red;
    }
  }

  .explain {
    margin-top: 20px;
      p {
          font-size: 12px;
          margin: 0;
      }
  }

  ::v-deep .el-checkbox:last-of-type {
    margin-right: 30px;
  }

  ::v-deep .el-radio {
    color: #606266;
    cursor: pointer;
    margin-right: 30px;
    margin: 5px 0
  }
</style>