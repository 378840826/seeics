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
      <el-popover
          width="200"
          trigger="click"
        >
         <el-button slot="reference" size="mini" style="marginLeft: 30px">关键词批量查询</el-button>
          <div>
            <el-input
              class="asin-textarea"
              v-model="asinMskuKeyword"
              placeholder="请输入关键词，换行间隔；"
              type="textarea"
              :rows="10"
              @input="handleTextAreaInput"
            />
          </div>
        </el-popover>
    </div>
    <el-table
      :data="tableData"
      :header-cell-style="{'text-align':'center'}"
      max-height="300"
      style="width: 100%; margin: 10px 0 0 0">
      <el-table-column
        label="广告活动"
        prop="campaign"
        align="center"
      >
        <template slot-scope="scope">
          <!-- <el-tooltip :content="scope.row.campaign">
            <div style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">{{scope.row.campaign}}</div>
          </el-tooltip> -->
          <el-select 
            v-model="scope.row.campaign" 
            placeholder="请选择广告活动"
            @change="campaignChange($event, scope.$index)"
            v-loadmore="loadmore"
          >
            <el-option
              class="option"
              v-for="item in campaignList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
              :disabled="item.disabled"
              >
              <div class="box2">{{item.name}}</div>
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="广告组"
        prop="adGroup"
        align="center"
      >
        <template slot-scope="scope">
          <el-select 
            v-model="scope.row.adGroup" 
            placeholder="请选择广告组"
            @change="adGroupSelect(scope.$index)"
          >
            <el-option
              class="option"
              v-for="item in scope.row.adGroupList"
              :key="item.groupId"
              :label="item.name"
              :value="item.groupId"
              :disabled="item.disabled"
              >
              <div class="box2">{{item.name}}</div>
            </el-option>
          </el-select>
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
              type="number"
              placeholder="站点货币"
              min="0"
            ><i slot="prefix" style="lineHeight: 30px;">{{ rowData.currency }}</i></el-input>
           <div v-if="scope.row.msg" class="msg">支持两位小数</div>
         </div>
         <div v-else-if="!scope.row.cpcType">无</div>
         <div v-else-if="scope.row.cpcType">
           <el-input
              v-model="scope.row.cpcValue"
              type="number"
              placeholder="调整数值"
            >
              <div
                v-if="scope.row.cpcType === '上浮(%)' || scope.row.cpcType === '下调(%)'"
                slot="suffix"
                style="lineHeight: 30px;">%</div>
                <div
                v-else
                slot="prefix"
                style="lineHeight: 30px;">$</div>
            </el-input>
            <div v-if="scope.row.valueMsg" class="msg">支持两位小数</div>
         </div>
        </template>
      </el-table-column>
      <el-table-column
        label=""
        prop="cpcMost"
        align="center"
      >
        <template slot-scope="scope" v-if="scope.row.cpcType">
          <el-input
            v-model="scope.row.cpcMost"
            type="number"
            placeholder="竞价最大值"
          >
            <div slot="prefix" style="lineHeight: 30px;">$</div>
          </el-input>
          <div v-if="scope.row.mostMsg" class="msg">支持两位小数</div>
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
           :disabled="deleteDisabled"
         />
         <el-button 
           v-if="scope.row.add"
           type="text"
           @click="add"
           :disabled="addDisabled || scope.row.addDisabled"
        >+添加</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="explain">
        <p>操作要点</p>
        <p>1. 每个自动化标签最多支持一种自动化操作。</p>
        <p>2. 您手动输入各种竞价时，请确认数值符合亚马逊规定；当调整竞价值超出亚马逊的最值限制时，我们将会按亚马逊要求的最值进行调整。</p>
        <p>3. 同一个广告活动下，同类型的广告自动化规则不可重复应用同一个自动化模板。</p>
        <p>规则执行</p>
        <p>1. 广告自动化按照广告所在站点时间执行。</p>
        <p>2. 创建或启用自动化标签后，将在站点时间第二天00:00开始执行，之后按执行频率定期执行；编辑运行中自动化标签对应的执行频率，将以上次执行时间为开始时间，按执行
        <br/> 频率定期执行；若编辑时距离上次执行时间已超过执行频率，则在站点时间第二天00:00开始执行。</p>
        <p>3. 自动化操作可能因为接口或网络原因有10分钟左右的延迟。</p>
        <p>备注信息</p>
        <p>广告自动化的数据范围排除最近3天，如最近14天，实际指第17-4天。</p>
      </div>
  </div>
</template>

<script>
import {
  queryCampaignList,
  getGroupList
} from '@/api/ppc/autoAd';

export default {
  name: 'automation',
  props: {
    echo: {
      type: Object,
      default: new Object
    },
    campaign: {
      type: String,
      default: '',
    },
    rowData: {
      type: Object,
      default: new Object
    }
  },
  data() {
    return {
      tableData: [
        {
          id: null,
          campaign: '',
          adGroup: '',
          matchType: '精准匹配',
          bidType: '广告组默认竞价',
          bid: '',
          cpcType: '',
          cpcValue: '',
          cpcMost: '',
          msg: false,
          add: true,
          adGroupList: [],
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
      formData: {
        current: 1,
        size: 20
      },
      total: 0,
      campaignList: [],
      adGroupList: [],
      asinList: [],
      asinMskuKeyword: '',
      msg: false,
      addDisabled: false,
      deleteDisabled: false,
    };
  },
  mounted() {
    Object.keys(this.echo).length && this.echoFiled();
    this.queryCampaignList(this.formData);
  },
  destroyed() {
    this.echo.adCampaignInfos = [];
    this.automatedOperation = '';
  },
  directives: {
    'loadmore': {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
        SELECTWRAP_DOM.addEventListener('scroll', function () {
          /**
          * scrollHeight 获取元素内容高度(只读)
          * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
          * clientHeight 读取元素的可见高度(只读)
          * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
          * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
          */
          const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
          if (condition) {
            binding.value();
          }
        }, true);
      }
    }
  },
  watch: {
    tableData: {
      handler(val) {
        const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/;
        if (val.length === this.adGroupList.length) {
          // this.addDisabled = true;
        } else {
          // this.addDisabled = false; 
        }
        if (val.length === 1) {
          this.deleteDisabled = true;
        } else {
          this.deleteDisabled = false;
        }
        const adGroupId = [];
        val.forEach(item => {
          if (item.adGroup) {
            adGroupId.push(item.adGroup);
          }
          if (item.bidType === '固定竞价' && !item.bid
              || item.cpcType === '上浮(%)' && (!item.cpcMost || !item.cpcValue)
              || item.cpcType === '下调(%)' && (!item.cpcMost || !item.cpcValue)
              || item.cpcType === '下调(绝对值)' && (!item.cpcMost || !item.cpcValue)
              || item.cpcType === '上浮(绝对值)' && (!item.cpcMost || !item.cpcValue)
          ) {
            item.addDisabled = true;
          } else {
            item.addDisabled = false;
            if (!reg.test(Number(item.bid)) || !reg.test(Number(item.cpcMost)) || !reg.test(Number(item.cpcValue))) {
              item.msg = true;
              item.addDisabled = true;
            
            } else {
              
              item.msg = false;
              item.addDisabled = false;
            }
            // if ( item.cpcMost && !reg.test(Number(item.cpcMost))) {
            //   item.mostMsg = true;
            //   item.addDisabled = true;
            
            // } else {
              
            //   item.mostMsg = false;
            //   item.addDisabled = false;
            // }
            // if (item.cpcValue && !reg.test(Number(item.cpcValue))) {
            //   item.valueMsg = true;
            //   item.addDisabled = true;
            
            // } else {
              
            //   item.valueMsg = false;
            //   item.addDisabled = false;
            // }
          }
          // 选中过的广告禁用
          this.adGroupList.forEach(item => {
            if ([...adGroupId].includes(item.groupId)) {
              item.disabled = true;
            } else {
              item.disabled = false;
            }
          });
        });
      },
      deep: true
    },
    adGroupList: {
      handler(val) {
        if (val.length === this.tableData.length) {
          // this.addDisabled = true;
          this.deleteDisabled = true;
        }
        if (this.tableData.length === 1) {
          this.deleteDisabled = true;
        } else {
          this.deleteDisabled = false;
        }
      },
      deep: true
    },
  },
  methods: {
    loadmore() {
      const result = this.formData.size * this.formData.current;
      if (result < this.total) { //加载全部出来 停止请求
        this.formData.current ++;
        this.queryCampaignList(this.formData);
      }  
    },
    //
    queryCampaignList(formData) {
      queryCampaignList({
        shopName: this.rowData.shopName, 
        marketplace: this.rowData.marketplace, 
        ...formData
      }).then(res => {
        const data = res.data.data.records.map(item => {
          return {
            name: item.name,
            value: item.campaignId
          };
        });
        this.total = res.data.data.total;
        this.campaignList = [...this.campaignList, ...data];
      });
    },
    // 默认选择第一个
    labelFilter(arr) {
      const arrs = arr.filter(item => !item.disabled);
      return arrs[0] && arrs[0].groupId || '';
    },
    echoFiled() {
      if (!this.echo.adCampaignInfos.length) {
        return;
      }
      this.tableData = this.echo.adCampaignInfos.map((item, index) => {
        this.getGroupList(item.campaignId, index);
        return {
          ...item,
          campaign: item.campaignId,
          adGroup: item.adGroupId,
          adGroupList: [],
        };
      });
      // if (this.tableData.length && this.tableData[0].campaign) {
      //   this.getGroupList(this.tableData[0].campaign);
      // }
      this.automatedOperation = this.echo.automatedOperation;
      this.tableData[this.tableData.length - 1].add = true;
    },
    getFiled() {
      let obj = {};
      const data = this.tableData.map(item => {
        return {
          ...item,
          campaignId: item.campaign,
          adGroupId: item.adGroup,
          currency: this.rowData.currency,
        };
      });
      obj = {
        adCampaignInfos: data,
        automatedOperation: this.automatedOperation,
        keywordTexts: this.asinList,
        adStoreId: this.rowData.adStoreId,
        currency: this.rowData.currency,
        marketplace: this.rowData.marketplace,
        id: this.echo.id || null,
        campaignId: this.rowData.campaignId
      };
      return obj;
    },
    // 获取广告组
    getGroupList(value, index) {
      getGroupList([value]).then(res => {
        if (res.data.code === 200) {
          this.tableData[index].adGroupList = res.data.data.records.map(item => {
            // item.disabled = false;
            return item;
          });
          // if ( this.echo.adCampaignInfos && !this.echo.adCampaignInfos.length || !Object.keys(this.echo).length) {
          //   this.tableData[0].adGroup = this.adGroupList.length && this.adGroupList[0].groupId || '';
          // }
          // this.tableData.forEach(item => {
          //   if (item.campaign === value) {
          //     item.adGroupList = adGroupList;
          //   }
          // });
          // 选中过的广告禁用
          // const adGroupId = [];
          // this.tableData.map(item => {
          //   if (item.adGroup) {
          //     adGroupId.push(item.adGroup);
          //   }
          // });
          // this.adGroupList.forEach(item => {
          //   if ([...adGroupId].includes(item.groupId)) {
          //     item.disabled = true;
          //   } else {
          //     item.disabled = false;
          //   }
          // });
        }
      });
    },
    // 批量搜索输入框输入
    handleTextAreaInput(value) {
      const maxLines = 20;
      let valueArr = value.split(/\r\n|\r|\n/);
      // 超过行数时截取
      if (valueArr.length > maxLines) {
        valueArr = valueArr.slice(0, maxLines);
        value = valueArr.join('\n');
        this.asinMskuKeyword = value;
      }
      this.asinList = valueArr;
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
    cpcTypeSelect(index) {
      this.tableData[index].cpcMost = '';
      this.tableData[index].cpcValue = '';
    },
    campaignChange(value, index) {
      this.getGroupList(value, index);
    },
    adGroupSelect(index) {
      this.tableData[index].bid = '';
    },
    add() {
      if (this.adGroupList === this.tableData.length) {
        return;
      }
      this.tableData.push({
        id: null,
        campaign: this.campaign,
        adGroup: this.labelFilter(this.adGroupList),
        matchType: '精准匹配',
        bidType: '广告组默认竞价',
        bid: '',
        cpcType: '',
        cpcValue: '',
        cpcMost: '',
        msg: false,
        add: true,
        adGroupList: []
      });
      delete this.tableData[this.tableData.length - 2].add;
    },
    delet(index) {
      if (this.tableData.length === 1) {
        return;
      }
      this.tableData.splice(index, 1);
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
  ::v-deep .el-input__inner {
    line-height: 30px;
    height: 30px;   
  }
  ::v-deep .el-input__icon {
    line-height: 30px;
  }
  ::v-deep .el-input--prefix .el-input__inner {
    padding-left: 20px;
  }
  .currency {
    color: #409EFF;
  }
  .bid {
    .msg {
      color: red;
    }
  }
  .msg {
      color: red;
    }
  .option {
    width: 100%;
    max-width: 700px;
    .box2 {
      padding: 0 20px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .box2:hover {
      padding: 0 20px;
      text-overflow:inherit;
      overflow: visible;
      white-space: pre-line;
    }
  }
  .explain {
  margin-top: 20px;
    p {
        font-size: 12px;
        margin: 0;
    }
  }
</style>