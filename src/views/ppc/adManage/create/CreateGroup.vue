<template>
  <el-dialog
    title="新增广告组"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    :close-on-press-escape="false"
    destroy-on-close
    @close="cancel"
    v-loading="loading"
    top="2vh"
    width="80%">
    <div class="dialogBox">
    <el-form :model="form" ref="form" :rules="rules" label-width="130px">
      
      <el-form-item>
        <template slot="label">
          <div style="display: flex;">
            <span>选择广告活动：</span>
            <span class="msg">*</span>
          </div>
        </template>
        <el-select
          v-loadmore="loadmore"
          v-model="form.campaignId"
          @change="handleGroup"
          filterable
          reserve-keyword
          remote
          :remote-method="remoteMethod"
          :loading="campaignLoading"
          @focus="searchCampaign = '';
            searchCampaignList = [];"
          size="small"
          style="width: 400px">
          <el-option
            v-for="item in !searchCampaign ? campaignList : searchCampaignList"
            :key="item.id"
            :value="item.id"
            :label="item.label"
            class="box2"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item prop="name">
        <template slot="label">
          <div style="display: flex;">
            <span>广告组名称：</span>
            <span class="msg">*</span>
          </div>
        </template>
        <el-input v-model="form.name" placeholder="请输入广告组名称"  style="width: 400px" size="small"/>
      </el-form-item>

      <div style="marginBottom: 10px;">
        状态：
        <el-switch
          v-model="form.state">
        </el-switch>
      </div>

      <CampaignTable
        ref="priceTable"
        :mwsStoreId="mwsStoreId"
        :priceAsin.sync="priceAsin"
      />

      <div>
        <div v-if="targetingMode === 'auto'">
          <div style="position: relative;marginTop: 20px;">
            <el-radio v-model="defaultRadio" label="1" style="z-index: 10;">
              默认竞价：
              <span v-if="defaultRadio === '1'" style="color: #ff4d4f;font-size: 20px;font-family: SimSun,sans-serif;content: '*';">*</span>
            </el-radio>
            <el-form-item
              v-if="defaultRadio === '1'"  prop="defaultBid" style="position: absolute;top: -10px;left: 0">
                
                <el-input v-model="form.defaultBid" placeholder="至少0.02" style="width: 60%" size="small">
                <i slot="prefix">{{currency}}</i>
                </el-input>
            </el-form-item>
          </div>
          <div>
            
          <el-radio v-model="defaultRadio" label="2" style="marginTop: 30px;">投放组竞价
          </el-radio>
          </div>

          <tg-bid-talbe
            v-if="defaultRadio === '2'"
            ref="tgTable"
            :asinList.sync="priceAsin"
            :targetingMode.sync="strategy"
            :defaultBid="form.defaultBid"
            :mwsStoreId="mwsStoreId"
            :budget="dailyBudget"
            :currency="currency"
            style="marginTop: 20px"
          />

          <deny-keyword
            ref="denyKeyword"
            :title="'关键词'"
          />

          <deny-keyword
            ref="denyPrice"
            :title="'商品'"
          />
        </div>

        <div v-if="targetingMode === 'manual'" style="marginTop: 10px">

          <div v-if="targetingMode === 'manual'">
            <el-form-item prop="defaultBid">
              <template slot="label">
                <div style="display: flex;">
                  <span>默认竞价：</span>
                  <span class="msg">*</span>
                </div>
              </template>
              <el-input v-model="form.defaultBid" placeholder="至少0.02" style="width: 150px" size="small">
              <i slot="prefix">{{currency}}</i>
              </el-input>
            </el-form-item>
          </div>

          <h3>
            <span 
              @click="KeywordFlag = '关键词'" 
              :style="{color: KeywordFlag === '关键词' && '#409EFF' || '', cursor: 'pointer'}">关键词</span>
            <span 
              @click="KeywordFlag = '分类/商品'" 
              :style="{marginLeft: '30px',
              color: KeywordFlag === '分类/商品' && '#409EFF' || '', cursor: 'pointer'}">分类/商品</span>
          </h3>

          <keyword
            v-if="KeywordFlag === '关键词'"
            ref="keywordTable"
            :asinList.sync="priceAsin"
            :targetingMode.sync="strategy"
            :defaultBid="form.defaultBid"
            :mwsStoreId="mwsStoreId"
            :budget="dailyBudget"
            :currency="currency"
          />

          <deny-keyword
            v-if="KeywordFlag === '关键词'"
            ref="denyKeyword"
            :title="'关键词'"
          />

          <!-- <manual-category v-if="KeywordFlag === '分类/商品'"/> -->

          <price-category
            v-if="KeywordFlag === '分类/商品'"
            ref="priceCategory"
            :asinList.sync="priceAsin"
            :targetingMode.sync="strategy"
            :defaultBid="form.defaultBid"
            :mwsStoreId="mwsStoreId"
            :budget="dailyBudget"
            :currency="currency"/>

          <deny-keyword
            v-if="KeywordFlag === '分类/商品'"
            ref="denyPrice"
            :title="'商品'"
          />
        </div>


      </div>
    </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="saveBtn">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>

import CampaignTable from './components/CampaignTable.vue';
import TgBidTalbe from './components/tgBidTable.vue';
import DenyKeyword from './components/denyKeyword.vue';
import ManualCategory from './components/manualCategory.vue';
import Keyword from './components/keyword.vue';
import PriceCategory from './components/PriceTab.vue';
import { queryCampaignList, createAdGroup, queryCampaignSelectList } from '@/api/ppc/adManage';

export default {

  components: {
    CampaignTable,
    TgBidTalbe,
    DenyKeyword,
    ManualCategory,
    Keyword,
    PriceCategory,
  },

  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
    },
    storeId: {
      type: String,
      required: true,
    },
    mwsStoreId: {
      type: String,
      required: true,
    },
    marketplace: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    }
  },

  data() {

    const checkDefaultBid = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('广告组默认竞价不能为空'));
      }
      if (this.marketplace === 'JP') {
        if (value < 2) {
          return callback(new Error(`广告组默认竞价必须大于等于${this.currency}2`));
        } else if (value > Number(this.dailyBudget)) {
          return callback(new Error('广告组默认竞价不能超过广告活动日预算'));
        }
      } else {
        if (value < 0.02) {
          return callback(new Error(`广告组默认竞价必须大于等于${this.currency}0.02`));
        } else if (value > Number(this.dailyBudget)) {
          return callback(new Error('广告组默认竞价不能超过广告活动日预算'));
        }
      }
    };

    const checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入广告组名称'));
      }
      if (value.length > 255) {
        return callback(new Error('最长255个字符'));
      }
    };

    return {
      form: {
        campaignId: '',
        name: '',
        defaultBid: this.marketplace === 'JP' ? '4' : '0.75',
        negativeKeywordItemRoList: [], //否定关键词集合
        keywordItemRoList: [], //关键词集合
        negativeTargetingAsinList: [], //否定投放商品（ASIN）集合
        productItemRoListL: [], //商品广告集合
        targetingAsinList: [], //投放商品（ASIN）集合
        targetingExpressionRoList: [], //targetingGroup  自动投放表达式
        state: true,
      },
      dailyBudget: '',
      targetingMode: 'auto',
      strategy: '',
      priceAsin: [],
      targetingType: '',
      KeywordFlag: '关键词',
      defaultRadio: '1',
      // dialogVisible: false,
      campaignList: [],
      data: [],
      page: {
        current: 1,
        size: 20
      },
      total: 0,
      rules: {
        name: [
          { validator: checkName, trigger: 'blur' }
        ],
        defaultBid: [
          { validator: checkDefaultBid, trigger: 'change' },
        ]
      },
      loading: false,
      campaignLoading: false,
      searchCampaign: '',
      searchCampaignList: [],
      searchTotal: 0,
      searchPage: {
        size: 20,
        current: 1,
      },
    };
  },

  directives: {
    'loadmore': {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
        SELECTWRAP_DOM.addEventListener('scroll', function () {
          const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
          if (condition) {
            binding.value();
          }
        }, true);
      }
    }
  },

  mounted() {
    this.queryCampaignList(false,
      this.$parent.$data.tableData.length && this.$parent.$data.tableData.filter(item => item.campaignState !== 'archived').length && this.$parent.$data.tableData.filter(item => item.campaignState !== 'archived')[0].campaignName || '',
      this.$parent.$data.tableData.length && this.$parent.$data.tableData.filter(item => item.campaignState !== 'archived').length && this.$parent.$data.tableData.filter(item => item.campaignState !== 'archived')[0].campaignId) || '';
  },

  methods: {

    repetit(arr) {
      let res = [];
      const hasObj = {};
      res = arr.reduce((total, next) => {
        const filterKey = next.id;
        hasObj[filterKey] ? '' : hasObj[filterKey] = true && total.push(next);
        return total;
      }, []);
      return res;
    },

    loadmore() {
      const result = !this.searchCampaign ?
        this.page.size * this.page.current : this.searchPage.size * this.searchPage.current;
      const total = !this.searchCampaign ? this.total : this.searchTotal;
      if (result < total) { //加载全部出来 停止请求
        !this.searchCampaign ? this.page.current ++ : this.searchPage.current ++;
        this.queryCampaignList(true);
      }  
    },

    queryCampaignList(flag, name, id) {
      queryCampaignSelectList({
        current: !this.searchCampaign ? this.page.current : this.searchPage.current,
        size: !this.searchCampaign ? this.page.size : this.searchPage.size,
        
      }, {
        marketplace: this.marketplace,
        adStoreId: this.storeId,
        name: this.searchCampaign || name,
        states: ['enabled', 'paused'],
      }).then(res => {
        if (res.data.code === 200) {

          this.campaignLoading = false;
          if (this.searchCampaign) {
            const data = res.data.data.records.map(item => {
              return {
                value: item.campaignId,
                id: item.campaignId,
                label: item.name
              };
            });
            this.searchTotal = res.data.data.total;
            if (this.searchTotal > this.searchPage.current * this.searchPage.size) {
              this.searchCampaignList = this.searchCampaignList.concat(data);
              this.searchCampaignList = this.repetit(this.searchCampaignList);
            } else {
              this.searchCampaignList = data;
            }
            return;
          }
          this.data = this.data.concat(res.data.data.records);
          this.campaignList = this.data.map(item => {
            return {
              value: item.campaignId,
              id: item.campaignId,
              label: item.name
            };
          });
          this.campaignList = this.repetit(this.campaignList);
          this.total = res.data.data.total;
          if (!flag) { //非预加载赋值
            this.form.campaignId = id || this.campaignList.length && this.campaignList[0].id || '';
            this.targetingMode = this.data.length && this.data[0].targetingType;
            this.strategy = this.data.length && this.data[0].biddingStrategy;
            this.dailyBudget = this.data.length && this.data[0].dailyBudget;
          }

          if (name) {
            const arr = this.data.length && this.data.filter(item => item.campaignId === id) || [];
            this.targetingMode = arr.length && arr[0].targetingType;
            this.strategy = arr.length && arr[0].biddingStrategy;
            this.dailyBudget = arr.length && arr[0].dailyBudget;
            this.queryCampaignList(true);
          }
        }
      });
    },

    handleGroup(value) {
      this.targetingMode = this.data.filter(item => item.campaignId === value)[0].targetingType;
      this.strategy = this.data.filter(item => item.campaignId === value)[0].biddingStrategy;
      this.dailyBudget = this.data.filter(item => item.campaignId === value)[0].dailyBudget;
    },

    remoteMethod(val) {
      this.searchCampaign = val;
      this.campaignLoading = true;
      this.searchCampaignList = [];
      this.searchPage.current = 1;
      this.queryCampaignList();
    },

    saveBtn() {
      const denyPrice = this.targetingMode === 'manual' && this.KeywordFlag === '分类/商品' && this.$refs.denyPrice.getField()
      || this.targetingMode === 'auto' && this.$refs.denyPrice.getField() || [];
      const priceCategory = this.targetingMode === 'manual' && this.KeywordFlag === '分类/商品' && this.$refs.priceCategory.getField() || [];
      const denyKeyword = this.targetingMode === 'manual' && this.KeywordFlag === '关键词' && this.$refs.denyKeyword.getField()
      || this.targetingMode === 'auto' && this.$refs.denyKeyword.getField() || [];
      const keywordTable = this.targetingMode === 'manual' && this.KeywordFlag === '关键词' && this.$refs.keywordTable.getField() || [];
      const tgTable = this.targetingMode === 'auto' && this.defaultRadio === '2' && this.$refs.tgTable.getField() || [];
      const priceTable = this.$refs.priceTable.getField();
      this.$refs.form.validate();
      if (!this.form.campaignId) {
        return this.$message({
          type: 'error',
          message: '请选择广告活动'
        });
      } else if (!this.form.name) {
        return this.$message({
          type: 'error',
          message: '请输入广告组名称'
        });
      } else if (!priceTable.length) {
        return this.$message({
          type: 'error',
          message: '请输入选择商品'
        });
      } else if (!this.form.defaultBid) {
        return this.$message({
          type: 'error',
          message: '请输入默认竞价'
        });
      } else if (this.form.defaultBid < 0.02) {
        return this.$message({
          type: 'error',
          message: '广告组默认竞价必须大于等于0.02'
        });
      } else if (this.form.defaultBid > this.dailyBudget) {
        return this.$message({
          type: 'error',
          message: '广告组默认竞价不能超过广告活动日预算'
        });
      } else if (this.targetingMode === 'manual' && !keywordTable.length && !priceCategory.length) {
        this.$message({
          type: 'error',
          message: '请添加关键词或分类/商品'
        });
        return;
      }
      

      this.form = {
        ...this.form,
        state: this.form.state ? 'enabled' : 'paused',
        // storeId: this.mwsStoreId,
        keywordItemRoList: keywordTable,
        negativeKeywordItemRoList: denyKeyword,
        negativeTargetingAsinList: denyPrice,
        targetingAsinList: priceCategory,
        productItemRoList: priceTable,
        targetingExpressionRoList: tgTable
      };
      this.loading = true;
      createAdGroup(this.form).then(res => {
        if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: '创建广告组成功',
          });
          this.$emit('update:dialogVisible', false);
          this.$emit('success');
          this.loading = false;
          // this.$parent.getList({ current: 1 });
        }
      }).catch(() => {
        this.loading = false;
      });
    },

    cancel() {
      this.$emit('update:dialogVisible', false);
    }
  }
};
</script>

<style lang="scss" scoped>
  .dialogBox {
    
    overflow: hidden;
    overflow-y: auto;
    padding: 0 15px;
    height: calc(100vh - 240px);
  }
  .label{
    width: 600px;
    display: flex;
    line-height: 32px;
    margin-top: 20px;

    span {
      width: 20%;
    }
    
  }

  .msg {
    color: #ff4d4f;
    font-size: 20px;
    font-family: SimSun,sans-serif;
    content: "*";
    display: block;
    widows: 10px;
  }

  .box2 {
    width: 400px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .box2:hover {
    text-overflow:inherit;
    overflow: visible;
    white-space: pre-line;
  }
</style>
