<template>
  <el-dialog
    title="新增广告组"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    :close-on-press-escape="false"
    destroy-on-close
    @close="cancel"
    v-loading="loading"
    top="1vh"
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
          size="small"
          style="width: 400px">
          <el-option
            v-for="item in campaignList"
            :key="item.id"
            :value="item.id"
            :label="item.label"
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
                <i slot="prefix">$</i>
                </el-input>
            </el-form-item>
          </div>
          <div>
            
          <el-radio v-model="defaultRadio" label="2" style="marginTop: 30px;">按Targeting Group设置竞价
          </el-radio>
          </div>

          <tg-bid-talbe
            v-if="defaultRadio === '2'"
            ref="tgTable"
            :asinList.sync="priceAsin"
            :targetingMode.sync="strategy"
            :defaultBid="form.defaultBid"
            :mwsStoreId="mwsStoreId"
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
              <i slot="prefix">$</i>
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
            :mwsStoreId="mwsStoreId"/>

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

import CampaignTable from './CampaignTable.vue';
import TgBidTalbe from './tgBidTable.vue';
import DenyKeyword from './denyKeyword.vue';
import ManualCategory from './manualCategory.vue';
import Keyword from './keyword.vue';
import PriceCategory from './PriceTab.vue';
import { queryCampaignList, createAdGroup } from '@/api/ppc/adManage';

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
    }
  },

  data() {

    const checkDefaultBid = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('广告组默认竞价不能为空'));
      }
      if (this.marketplace === 'JP') {
        if (value < 2) {
          return callback(new Error('广告组默认竞价必须大于等于2'));
        } else if (value > Number(this.dailyBudget)) {
          return callback(new Error('广告组默认竞价不能超过广告活动日预算'));
        }
      } else {
        if (value < 0.02) {
          return callback(new Error('广告组默认竞价必须大于等于0.02'));
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
        defaultBid: '0.75',
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
    this.queryCampaignList();
  },

  methods: {

    loadmore() {
      const result = this.page.size * this.page.current;
      if (result < this.total) { //加载全部出来 停止请求
        this.page.current ++;
        this.queryCampaignList();
      }  
    },

    queryCampaignList() {
      queryCampaignList({
        ...this.page,
        order: 'createdTime',
        asc: false
      }, {
        marketplace: this.marketplace,
        storeId: this.storeId,
      }).then(res => {
        if (res.data.code === 200) {
          this.campaignList = res.data.data.page.records.map(item => {
            return {
              value: item.id,
              id: item.id,
              label: item.name
            };
          });
          this.data = res.data.data.page.records;
          this.total = res.data.data.page.total;
          this.form.campaignId = this.campaignList.length && this.campaignList[0].id;
          this.targetingMode = res.data.data.page.records.length && res.data.data.page.records[0].targetingType;
          this.strategy = res.data.data.page.records.length && res.data.data.page.records[0].biddingStrategy;
          this.dailyBudget = res.data.data.page.records.length && res.data.data.page.records[0].dailyBudget;
        }
      });
    },

    handleGroup(value) {
      this.targetingMode = this.data.filter(item => item.id === value)[0].targetingType;
      this.strategy = this.data.filter(item => item.id === value)[0].biddingStrategy;
      this.dailyBudget = this.data.filter(item => item.id === value)[0].dailyBudget;
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
    height: calc(100vh - 250px);
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
</style>
