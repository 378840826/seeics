<template>
  <div class="sa">
    <div class="tabel">
      <span>自动化操作：</span>
      <el-select 
        v-model="automatedOperation"
        @change="hanlderAuto"
      >
        <el-option
          v-for="item in (launch ? launchOption : searchOption)"
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
         <!-- <el-button slot="reference" size="mini" style="marginLeft: 30px">关键词批量查询</el-button> -->
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

    <!-- <div v-show="automatedOperation === '创建广告活动'" style="marginTop: 10px">
      <adCampaign 
        ref="adCampaign"
        :form.sync="form"
        :currency="rowData.currency"
        :adStoreId="rowData.adStoreId"
        :echoPortfolioId="echoPortfolioId"/>
    </div> -->

    <el-table
      v-if="automatedOperation && (automatedOperation !== '创建广告组' && automatedOperation !== '创建广告活动') ? true : false || false"
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
          <!-- <el-tooltip :content="scope.row.campaign">
            <div style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">{{scope.row.campaign}}</div>
          </el-tooltip> -->
          <el-select 
            v-model="scope.row.campaign" 
            placeholder="请选择广告活动"
            @change="campaignChange($event, scope.$index)"
            filterable
            reserve-keyword
            remote
            :remote-method="remoteMethod"
            :loading="loading"
            v-loadmore="loadmore"
            @focus="name=''; queryCampaignList(formData)"
            :disabled="launch
            && automatedOperation !== '添加到投放'
            || automatedOperation === '创建广告组'
            || automatedOperation === '创建广告活动'"
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
        v-if="automatedOperation === '添加到投放' || automatedOperation === '创建广告活动'"
        label="广告组"
        prop="adGroup"
        align="center"
      >
        <template slot-scope="scope">

          <div v-if="automatedOperation === '创建广告活动'">ASIN+MSKU+关键词+匹配方式+日期时间+
            <el-input v-model="scope.row.customText" placeholder="请输入自定义文本；"/>
          </div>

          <el-select 
            v-else
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
        v-if="!launch"
        label="匹配类型"
        prop="matchType"
        align="center"
      >
        <template slot-scope="scope">

          <el-checkbox-group
            v-if="automatedOperation === '创建广告活动'"
            v-model="scope.row.matchType">
            <el-checkbox label="精准匹配">精准匹配</el-checkbox>
            <el-checkbox label="词组匹配">词组匹配</el-checkbox>
            <el-checkbox label="广泛匹配">广泛匹配</el-checkbox>
          </el-checkbox-group>

          <el-select
            v-else
            v-model="scope.row.matchType" 
            placeholder="请选择"
            collapse-tag
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
        :label="`竞价${automatedOperation === '添加到投放' ? '参考' : '调整'}`"
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
                  @blur="numberChange($event, 'bid', scope.$index)"
                  placeholder="站点货币"
                  min="0"
                ><div 
                  @click="focus('input_bid' + scope.$index)" 
                  slot="prefix" 
                  style="lineHeight: 30px;">{{ rowData.currency }}</div></el-input>
              <!-- <div v-if="scope.row.msg" class="msg">支持两位小数</div> -->
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
                    @click="focus('input_adjustTheValue' + scope.$index)"
                    slot="prefix"
                    style="lineHeight: 30px;">{{ rowData.currency }}</div>
                </el-input>
                <!-- <div v-if="scope.row.valueMsg" class="msg">支持两位小数</div> -->
            </div>
          </div>
        </template>
      </el-table-column>
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
              style="lineHeight: 30px;">{{ rowData.currency }}</div>
          </el-input>
          <!-- <div v-if="scope.row.mostMsg" class="msg">支持两位小数</div> -->
        </template>
      </el-table-column>
      <el-table-column
        v-if="!launch"
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

    <div v-else-if="automatedOperation === '创建广告组'">
      <div v-if="searchWord !== 2">
        <adGroup
          ref="adGroup1"
          :automatedOperation.sync="automatedOperation"
          :echo="echoAdGroup1"
          :campaign="campaign"
          :rowData="rowData"
          :type="1"
          :deduplication="echoDeduplication"
        />
      </div>

      <adGroup
        v-if="searchWord !== 1"
        ref="adGroup2"
        :automatedOperation.sync="automatedOperation"
        :echo="echoAdGroup2"
        :campaign="campaign"
        :rowData="rowData"
        :type="2"
      />
    </div>

    <div v-else-if="automatedOperation === '创建广告活动'">
      <div v-if="searchWord !== 2">
        <adGroup
          ref="adCampaign1"
          :automatedOperation.sync="automatedOperation"
          :echo="echoAdCampaign1"
          :campaign="campaign"
          :rowData="rowData"
          :type="1"
          :deduplication="echoDeduplication"
          :campaignType="'关键词'"
          :templateId="templateId"
          :echoCampaign="echoCampaignInfo1"
        />
      </div>

      <adGroup
        v-if="searchWord !== 1"
        ref="adCampaign2"
        :automatedOperation.sync="automatedOperation"
        :echo="echoAdCampaign2"
        :campaign="campaign"
        :rowData="rowData"
        :type="2"
        :campaignType="'商品'"
        :templateId="templateId"
        :echoCampaign="echoCampaignInfo2"
      />
    </div>

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
    <el-dialog
      :visible.sync="msgVisible"
      :append-to-body="true"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      center
    >
    <span>搜索词来源-添加广告组，只支持 一个广告组投放一个ASIN广告，若选择多个广告组，必须为同一个ASIN；</span>
    <span slot="footer" class="dialog-footer" style="textAlign: center">
        <el-button size="mini" type="primary" @click="hanldeAdGroup">确 定</el-button>
        <el-button size="mini" 
          @click="msgVisible = false;
          $emit('verifyClose');
        ">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryCampaignList,
  getGroupList,
  createGroup,
} from '@/api/ppc/autoAd';
import dayjs from 'dayjs';
import adCampaign from './adCampaign.vue';
import adGroup from './adGroup.vue';

export default {
  name: 'automation',
  components: { adCampaign, adGroup },
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
    },
    launch: {
      type: Boolean,
      default: false
    },
    adGroupOption: {
      type: Array,
      require: true
    },
    radio: {
      type: Number,
      require: true
    },
    groupVisible: {
      type: Boolean,
      require: true
    },
    isGroupTabel: {
      type: Boolean,
      require: true
    },
    isRadio: {
      type: Boolean,
      require: true
    },
    templateId: {
      type: String,
      require: true
    },
    searchWord: {
      type: Number,
    },
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data() {
    return {
      msgVisible: false,
      automatedOperation: '添加到投放',
      tableData: [
        {
          id: null,
          campaign: '',
          adGroup: '',
          matchType: '精准匹配',
          bidType: '广告组默认竞价',
          bid: '',
          rule: '',
          adjustTheValue: '', //调整数值
          bidLimitValue: '', //竞价限值
          msg: false,
          add: true,
          adGroupList: [],
          customText: '',
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
          // disable: true
        },
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
      formData: {
        current: 1,
        size: 20
      },
      name: '',
      total: 0,
      campaignList: [],
      adGroupList: [],
      asinList: [],
      asinMskuKeyword: '',
      msg: false,
      addDisabled: false,
      deleteDisabled: false,
      isAutoShow: true,
      loading: false,

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
      echoPortfolioId: this.echo && Object.keys(this.echo).length && this.echo.createAdvertisingCampaignDTO && this.echo.createAdvertisingCampaignDTO.portfolioId || '',
    };
  },
  mounted() {
    Object.keys(this.echo).length && this.echoFiled();
    this.name = this.rowData.name;
    this.tableData[0].campaign = this.rowData.campaignId || '';
    this.queryCampaignList(this.formData);
    this.getGroupList(this.tableData[0].campaign, 0, 'flag');
  },
  destroyed() {
    this.echo.adCampaignInfos = [];
    this.automatedOperation = '添加到投放';
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
        const reg = /^(([1-9]{1}\d{0,4})|(0{1}))(\.\d{0,2})?$/;
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
              || item.rule === '上浮(%)' && (!item.bidLimitValue || !item.adjustTheValue)
              || item.rule === '下调(%)' && (!item.bidLimitValue || !item.adjustTheValue)
              || item.rule === '下调(绝对值)' && (!item.bidLimitValue || !item.adjustTheValue)
              || item.rule === '上浮(绝对值)' && (!item.bidLimitValue || !item.adjustTheValue)
          ) {
            item.addDisabled = true;
          } else {
            item.addDisabled = false;
            if (!reg.test(Number(item.bid)) || !reg.test(Number(item.bidLimitValue)) || !reg.test(Number(item.adjustTheValue))) {
              item.msg = true;
              item.addDisabled = true;
            
            } else {
              
              item.msg = false;
              item.addDisabled = false;
            }
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

    adGroupOption: {
      handler(val) {
        if (!val.length) {
          this.automatedOperation = '添加到投放';
        } else {
          if (this.automatedOperation === '创建广告组' || this.automatedOperation === '创建广告活动') {
            this.createGroup();
          }
        }
      },
      deep: true
    },

    automatedOperation: {
      handler(val) {
        if (val === '创建广告活动') {
          this.$emit('update:isRadio', true);
        } else {
          this.$emit('update:isRadio', false);
        }
      }
    }
  },
  methods: {
    algorithm(value) {
      const res = Number(value) / 100;
      return ( 0.75 * (1 + res)).toFixed(2);
    },

    budgetMsg() {
      if (this.searchWord === 1) {
        return [this.$refs.adCampaign1.$refs.adCampaign.msg()];
      } else if (this.searchWord === 2) {
        return [this.$refs.adCampaign2.$refs.adCampaign.msg()];
      } else if (this.searchWord === 3) {
        return [this.$refs.adCampaign1.$refs.adCampaign.msg(), this.$refs.adCampaign2.$refs.adCampaign.msg()];
      }
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
        name: this.name,
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
        const hasObj = {};
        this.campaignList = this.campaignList.reduce((total, next) => {
          const filterKey = next.value;
          hasObj[filterKey] ? '' : hasObj[filterKey] = true && total.push(next);
          return total;
        }, []);
      });
    },
    // 默认选择第一个
    labelFilter(arr) {
      const arrs = arr.filter(item => !item.disabled);
      return arrs[0] && arrs[0].groupId || '';
    },
    echoFiled() {
      if (!this.echo.automatedOperation) {
        this.isAutoShow = false;
        this.automatedOperation = this.echo.automatedOperation;
      }
      if (!this.echo.adCampaignInfos.length) {
        return;
      }
      if (this.echo.automatedOperation === '创建广告组') {

        this.echoAdGroup1 = this.echo.adCampaignInfos.filter(item => item.type === 1) || [];
        // this.echoDeduplication = this.deduplication;
        this.echoAdGroup2 = this.echo.adCampaignInfos.filter(item => item.type === 2) || [];

      } else if (this.echo.automatedOperation === '创建广告活动') {

        this.echoAdCampaign1 = this.echo.adCampaignInfos.filter(item => item.type === 1) || [];
        this.echoAdCampaign2 = this.echo.adCampaignInfos.filter(item => item.type === 2) || [];
        this.echoCampaignInfo1 = this.echo.createAdvertisingCampaignDTOList.filter(item => item.type === 1) || [];
        
        this.echoCampaignInfo2 = this.echo.createAdvertisingCampaignDTOList.filter(item => item.type === 2) || [];

      } else {

        this.tableData = this.echo.adCampaignInfos.map((item, index) => {
          this.getGroupList(item.campaignId, index);
  
          return {
            ...item,
            campaign: item.campaignId,
            adGroup: item.adGroupId,
            adGroupList: [],
            matchType: this.echo.automatedOperation === '创建广告活动' ? item.matchType && item.matchType.split(',') || ['精准匹配'] : item.matchType && item.matchType || '精准匹配'
          };
        });
  
        if (this.echo.automatedOperation === '创建广告活动') {
          this.addDisabled = true;
        }
      }
      this.form = this.echo.createAdvertisingCampaignDTO;
      // this.form.deduplication = this.deduplication;
      this.automatedOperation = this.echo.automatedOperation;
      // console.log(this.echo.automatedOperation)
      this.tableData[this.tableData.length - 1].add = true;
    },
    getFiled() {
      let obj = {};

      if (this.automatedOperation === '创建广告组') {
        const adGroup1 = this.searchWord === 1 && this.$refs.adGroup1.getFiled() || [];
        const adGroup2 = this.searchWord === 2 && this.$refs.adGroup2.getFiled() || [];
        obj = {
          adCampaignInfos: this.searchWord !== 3 
            ? [...adGroup1, ...adGroup2]
            : [...this.$refs.adGroup1.getFiled(), ...this.$refs.adGroup2.getFiled()],
          automatedOperation: this.automatedOperation,
          adStoreId: this.rowData.adStoreId,
          currency: this.rowData.currency,
          marketplace: this.rowData.marketplace,
          id: this.echo.id || null,
          campaignId: this.rowData.campaignId,
        };
      } else if (this.automatedOperation === '创建广告活动') {
        const adCampaign1 = this.searchWord === 1 && this.$refs.adCampaign1.getFiled() || [];
        const adCampaign2 = this.searchWord === 2 && this.$refs.adCampaign2.getFiled() || [];
        obj = {
          adCampaignInfos: this.searchWord !== 3 
            ? [...adCampaign1, ...adCampaign2]
            : [...this.$refs.adCampaign1.getFiled(), ...this.$refs.adCampaign2.getFiled()],
          automatedOperation: this.automatedOperation,
          adStoreId: this.rowData.adStoreId,
          currency: this.rowData.currency,
          marketplace: this.rowData.marketplace,
          id: this.echo.id || null,
          campaignId: this.rowData.campaignId,
          // createAdvertisingCampaignDTO: {
          //   ...this.form,
          //   campaignId: this.rowData.campaignId,
          //   templateId: this.templateId,
          //   endTime: this.form.endTime && dayjs(this.form.endTime).format('YYYY-MM-DD HH:mm:ss') || null,
          //   startTime: this.form.startTime && dayjs(this.form.startTime).format('YYYY-MM-DD HH:mm:ss') || null,
          // },
          createAdvertisingCampaignDTOList: this.adCampaignFormat(this.searchWord),
        };
      } else {
        const data = this.tableData.map(item => {
          return {
            ...item,
            campaignId: item.campaign,
            adGroupId: this.automatedOperation === '添加到投放' || this.automatedOperation === '创建广告活动' ? item.adGroup : null,
            currency: this.rowData.currency,
            matchType: this.automatedOperation === '创建广告活动' ? item.matchType.join(',') : item.matchType,
            customText: this.automatedOperation === '创建广告活动' ? item.customText : '',
          };
        });
        obj = {
          adCampaignInfos: this.automatedOperation ? data : null,
          automatedOperation: this.automatedOperation,
          // keywordTexts: this.asinList,
          adStoreId: this.rowData.adStoreId,
          currency: this.rowData.currency,
          marketplace: this.rowData.marketplace,
          id: this.echo.id || null,
          campaignId: this.rowData.campaignId,
        };
        obj = this.automatedOperation === '创建广告活动' ? Object.assign(obj, { createAdvertisingCampaignDTO: {
          ...this.form,
          campaignId: this.rowData.campaignId,
          templateId: this.templateId,
          endTime: this.form.endTime && dayjs(this.form.endTime).format('YYYY-MM-DD HH:mm:ss') || null,
          startTime: this.form.startTime && dayjs(this.form.startTime).format('YYYY-MM-DD HH:mm:ss') || null,
          deduplication: this.form.deduplication ? 1 : 0,
        } }) : obj;
      }
      return obj;
      // console.log(this.$refs.adGroup1.getFiled(), this.$refs.adGroup2.getFiled())
    },

    adCampaignFormat(val) {
      if (val === 1) {
        return [this.$refs.adCampaign1.getCampaignField()];
      } else if (val === 2) {
        return [this.$refs.adCampaign2.getCampaignField()];
      } else if (val === 3) {
        return [this.$refs.adCampaign1.getCampaignField(), this.$refs.adCampaign2.getCampaignField()];
      }
    },

    // 获取广告组
    getGroupList(value, index, flag) {
      getGroupList([value]).then(res => {
        const data = res.data.data.records;
        if (res.data.code === 200) {
          // this.tableData[index].adGroup = data.length && data[0].groupId || '';
          this.tableData[index].adGroupList = data.map(item => {
            // item.disabled = false;
            return item;
          });
          if (flag) {
            this.tableData[index].adGroup = data.length && data[0].groupId || '';
          }
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
        this.tableData[index].rule = '';
      } else {
        this.tableData[index].rule = '';
      }
      this.tableData[index].bidLimitValue = '';
      this.tableData[index].adjustTheValue = '';
    },
    cpcTypeSelect(index) {
      this.tableData[index].bidLimitValue = '';
      this.tableData[index].adjustTheValue = '';
    },
    campaignChange(value, index) {
      this.tableData[index].adGroup = '';
      this.getGroupList(value, index, 'flag');
    },
    adGroupSelect(index) {
      // this.tableData[index].bid = '';
    },
    // 修改不合法字符以及数字
    numberChange (val, name, index) { // name字段名，index索引
      // 校验正数，带两位小数
      const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      val.target.style.borderColor = '';
      // this.$emit('change', false);
      if (isNaN(val.target.value)) { 
        val.target.value = parseFloat(val.target.value) ;
      } 
      // 修改超出两位小数值
      if (val.target.value.indexOf('.') > 0){
        val.target.value = val.target.value.slice(0, val.target.value.indexOf('.') + 3);
        this.tableData[index][name] = val.target.value;
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
        this.tableData[index][name] = '';
      }
    },
    hanlderAuto(val) {
      if (this.launch) {
        if (val === '自动归档' || val === '自动暂停') {
          this.tableData[0].matchType = null;
          this.tableData[0].bid = null;
          this.tableData[0].bidType = null;
        }
        this.tableData[0].bidType = '广告组默认竞价';
        this.tableData[0].rule = '';
        this.tableData[0].bidLimitValue = '';
        this.tableData[0].adjustTheValue = '';
        this.tableData[0].bid = '';
      } else {
        if (val === '创建广告组' || val === '创建广告活动') {
          if (!this.adGroupOption.length) {
            this.$emit('update:groupVisible', true);
            this.$emit('update:isGroupTabel', true);
          } else {
            this.createGroup();
          }
          this.$emit('update:radio', 2);
        }
      }

      if (val === '创建广告活动') {
        this.tableData = [
          {
            id: null,
            campaign: this.rowData.campaignId,
            adGroup: '',
            matchType: '精准匹配',
            bidType: '广告组默认竞价',
            bid: '',
            rule: '',
            adjustTheValue: '', //调整数值
            bidLimitValue: '', //竞价限值
            msg: false,
            add: true,
            adGroupList: [],
          },
        ];
        this.getGroupList(this.tableData[0].campaign, 0, 'flag');
        this.tableData[0].matchType = ['精准匹配'];
        this.addDisabled = true;
      } else {
        this.tableData[0].matchType = '精准匹配';
        this.addDisabled = false;
      }

      if (!val) {
        this.isAutoShow = false;
      } else {
        this.isAutoShow = true;
        this.isAutoShow = this.isAutoShow ? false : true;
        this.$nextTick(() => {
          this.isAutoShow = this.isAutoShow ? false : true;
        });
      }
    },

    createGroup() {
      createGroup(this.adGroupOption).then(res => {
        if (res.data.code === 500) {
          this.msgVisible = true;
        }
      });
    },

    hanldeAdGroup() {
      this.msgVisible = false;
      this.$emit('update:groupVisible', true);
      this.$emit('update:isGroupTabel', true);
      this.$emit('verifyClose');
    },

    handleAuto() {
      if (!this.adGroupOption.length) {
        this.automatedOperation = '添加到投放';
      }
    },

    add() {
      if (this.adGroupList === this.tableData.length) {
        return;
      }
      if (this.automatedOperation === '创建广告组' && this.tableData.length >= 20) {
        this.$message({
          type: 'warning',
          message: '创建广告组最多可以添加20条'
        });
        return;
      }
      this.tableData.push({
        id: null,
        campaign: this.automatedOperation === '创建广告组' ? this.rowData.campaignId : '',
        adGroup: this.labelFilter(this.adGroupList),
        matchType: this.automatedOperation === '创建广告活动' ? ['精准匹配'] : '精准匹配',
        bidType: '广告组默认竞价',
        bid: '',
        rule: '',
        adjustTheValue: '',
        bidLimitValue: '',
        msg: false,
        add: true,
        adGroupList: [],
        customText: '',
      });
      delete this.tableData[this.tableData.length - 2].add;
    },
    delet(index) {
      if (this.tableData.length === 1) {
        return;
      }
      this.tableData.splice(index, 1);
      this.tableData[this.tableData.length - 1].add = true;
    },
    // 广告活动远程搜索
    remoteMethod(query) {
      if (query !== '') {
        this.name = query;
        this.loading = true;
        queryCampaignList({
          shopName: this.rowData.shopName, 
          marketplace: this.rowData.marketplace,
          name: query,
          current: 1,
          size: 2147483647
        }).then(res => {
          this.loading = false;
          this.campaignList = res.data.data.records.map(item => {
            return {
              name: item.name,
              value: item.campaignId
            };
          });
        });
      } else {
        this.name = '';
        this.campaignList = [];
        this.formData.current = 1;
        this.queryCampaignList(this.formData);
      }
    }
  },
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
  // ::v-deep .el-input--prefix .el-input__inner {
  //   padding-left: 20px;
  // }
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

  ::v-deep .el-checkbox:last-of-type {
    margin-right: 30px;
  }

</style>