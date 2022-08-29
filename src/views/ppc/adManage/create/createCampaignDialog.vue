<template>
  <el-dialog
    title="新增广告活动"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    :close-on-press-escape="false"
    destroy-on-close
    @close="close"
    v-loading="loading"
    top="1vh"
    width="80%">
    <el-form :model="form" :rules="rules" label-width="120px" class="form">
    <div class="dialogBox">
      
      <h3>▌广告活动</h3>
      <el-form-item label="广告活动名称：" prop="name">
        <el-input v-model="form.name" size="small"></el-input>
      </el-form-item>
      <!-- <div class="label">
        <span>广告活动名称：</span>
        <el-input v-model="form.name" style="width: 80%" size="small"/>
      </div> -->

      <el-form-item label="日预算：" prop="budget">
        <el-input 
          v-model="form.budget"
          style="width: 30%"
          placeholder="至少1"
          size="small">
           <template slot="prefix">$</template>
        </el-input>
      </el-form-item>

      <!-- <div class="label">
        <span>日预算：</span>
        <el-input 
          v-model="form.budget"
          style="width: 30%"
          placeholder="至少1"
          size="small">
           <template slot="prefix">$</template>
        </el-input>
      </div> -->

      <div class="label">
        <span>日期范围：</span>
        <el-date-picker
          style="width: 80%"
          v-model="date"
          type="daterange"
          range-separator="——"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          size="small">
        </el-date-picker>
      </div>

      <div class="label">
        <span>投放类型：</span>
        <el-radio-group v-model="form.targetingMode" @change="form.groupRo.defaultBid = ''">
          <el-radio label="auto">自动</el-radio>
          <el-radio label="manual">手动</el-radio>
        </el-radio-group>
      </div>

      <div class="label">
        <span>竞价策略：</span>
        <div style="width: 80%">
          <el-radio-group v-model="form.biddingStrategy">
            <el-radio label="legacyForSales">动态竞价 - 仅降低
              <p>当您的广告不太可能带来销售时，我们将实时降低您的竞价。</p>
            </el-radio>
            <el-radio label="autoForSales">动态竞价 - 提高和降低
              <p>当您的广告很有可能带来销售时，我们将实时提高您的竞价（最高可达 </p>
              <p>100%），并在您的广告不太可能带来销售时降低您的竞价。</p>
            </el-radio>
            <el-radio label="manual">固定竞价
              <p>我们将使用您的确切竞价和您设置的任何手动调整，而不会根据售出可能性对</p>
              <p>您的竞价进行更改。</p> 
            </el-radio>
          </el-radio-group>
        </div>
      </div>

      <div style="padding: 0px 0px 0px 120px;">
        <p>除了竞价策略外，您可以将竞价最多提高 900%。</p>
          <p>搜索结果顶部（首页）
            <el-input v-model="form.biddingPlacementTop" style="width: 150px" size="small"/>%
          </p>
          <p style="marginLeft: 140px;">示例： 对于此广告位，$0.75 竞价将为 $0.90。动态竞价可以将其提高至 $1.80</p>
          <p>商品页面
            <el-input
              v-model="form.biddingPlacementProductPage" style="marginLeft: 82px;width: 150px" size="small"/>%
          </p>
          <p style="marginLeft: 140px;">示例： 对于此广告位，$0.75 竞价将保持 $0.75 不变。动态竞价可以将其提高至 $1.13</p>
      </div>

      <span>
        状态：
        <el-switch
          v-model="state">
        </el-switch>
      </span>

      <h3>▌广告活动</h3>

      <el-form-item label="广告组名称：" prop="groupRo.name">
        <el-input v-model="form.groupRo.name" size="small"/>
      </el-form-item>
      <!-- <div class="label">
        <span>广告组名称：</span>
        <el-input v-model="form.groupRo.name" style="width: 80%" size="small"/>
      </div> -->

      <span>
        状态：
        <el-switch
          v-model="groupState">
        </el-switch>
      </span>

      <Table 
        ref="priceTable"
        :priceAsin.sync="priceAsin"
        :mwsStoreId="mwsStoreId"
        style="marginTop: 20px"/>

      <div>
        <div v-if="form.targetingMode === 'auto'">
          <div style="position: relative;marginTop: 10px;">
            <el-radio v-model="defaultRadio" label="1" style="z-index: 10;">
              默认竞价：
            </el-radio>
            <el-form-item
              v-if="defaultRadio === '1'"  prop="groupRo.defaultBid" style="position: absolute;top: 0;left: 0">
                <el-input v-model="form.groupRo.defaultBid" placeholder="至少0.02" style="width: 60%" size="small">
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
            :targetingMode.sync="form.biddingStrategy"
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

        <div v-if="form.targetingMode === 'manual'">

          <div v-if="form.targetingMode === 'manual'" class="label">
            <!-- <span>默认竞价：</span>
            <el-input v-model="form.groupRo.defaultBid" placeholder="至少1" style="width: 40%" size="small">
              <i slot="prefix">$</i>
            </el-input> -->
            <el-form-item label="默认竞价：" prop="groupRo.defaultBid">
              <el-input v-model="form.groupRo.defaultBid" placeholder="至少0.02" style="width: 100%" size="small">
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
            :targetingMode.sync="form.biddingStrategy"
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
            :targetingMode.sync="form.biddingStrategy"
            :mwsStoreId="mwsStoreId"/>

          <deny-keyword
            v-if="KeywordFlag === '分类/商品'"
            ref="denyPrice"
            :title="'商品'"
          />
        </div>


      </div>

    </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="saveBtn">确 定</el-button>
    </span>
    </el-dialog>
</template>

<script>

import dayjs from 'dayjs';
import Table from './CampaignTable.vue';
import TgBidTalbe from './tgBidTable.vue';
import DenyKeyword from './denyKeyword.vue';
import ManualCategory from './manualCategory.vue';
import Keyword from './keyword.vue';
import PriceCategory from './PriceTab.vue';
import { createAdManage } from '@/api/ppc/adManage';

export default {
  components: {
    Table,
    TgBidTalbe,
    DenyKeyword,
    ManualCategory,
    Keyword,
    PriceCategory
  },

  props: {
    dialogVisible: {
      type: Boolean,
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
        } else if (value > 100000) {
          return callback(new Error('广告组默认竞价最大值不超过100000'));
        }
      } else {
        if (value < 0.02) {
          return callback(new Error('广告组默认竞价必须大于等于0.02'));
        } else if (value > 1000) {
          return callback(new Error('广告组默认竞价最大值不超过1000'));
        }
      }
    };

    const checkBudget = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('广告活动每日预算至少$1'));
      }
      if (this.marketplace === 'JP') {
        if (value < 100) {
          return callback(new Error('广告活动每日预算至少$1'));
        } else if (value > 21000000) {
          return callback(new Error('广告活动每日预算不能超过￥21,000,000'));
        }
      } else {
        if (value < 1) {
          return callback(new Error('广告活动每日预算至少$1'));
        } else if (value > 1000000) {
          return callback(new Error('广告活动每日预算不能超过1000000'));
        }
      }
    };

    return {
      loading: false,
      // dialogVisible: true,
      KeywordFlag: '关键词',
      priceAsin: [],
      date: null,
      form: {
        name: '',
        budget: '',
        endDate: '',
        startDate: '',
        targetingMode: 'auto',
        biddingStrategy: 'legacyForSales',
        biddingPlacementProductPage: '', //商品页面 百分比
        biddingPlacementTop: '', //搜索结果顶部 百分比
        groupRo: {
          name: '',
          defaultBid: '0.75',
          negativeKeywordItemRoList: [], //否定关键词集合
          keywordItemRoList: [], //关键词集合
          negativeTargetingAsinList: [], //否定投放商品（ASIN）集合
          productItemRoListL: [], //商品广告集合
          targetingAsinList: [], //投放商品（ASIN）集合
          targetingExpressionRoList: [], //targetingGroup  自动投放表达式
        }
      },
      state: true,
      groupState: true,
      defaultRadio: '1',
      rules: {
        name: [
          { required: true, message: '请输入广告活动名称', trigger: 'blur' },
          { max: 128, message: '最长128个字符', trigger: 'blur' }
        ],
        budget: [
          { validator: checkBudget, trigger: 'blur' },
        ],
        ['groupRo.name']: [
          { required: true, message: '请输入广告组名称', trigger: 'blur' },
          { max: 255, message: '最长255个字符', trigger: 'blur' }
        ],
        ['groupRo.defaultBid']: [
          { validator: checkDefaultBid, trigger: 'blur' },
        ]
      },
      pickerOptions: {
        disabledDate: (date) => {
          return date.getTime() < Date.now() - 8.64e7;
        }
      }
    };  
  },

  watch: {
    date: {
      handler() {
        this.form.startDate = dayjs(this.date[0]).format('YYYYMMDD');
        this.form.endDate = dayjs(this.date[1]).format('YYYYMMDD');
      },
      deep: true
    },
  },

  methods: {
    cancel() {
      this.$emit('update:dialogVisible', false);
    },

    empty() {
      this.form.name = '';
      this.form.budget = '';
      this.date = null;
      this.form.targetingMode = 'auto';
      this.form.biddingStrategy = 'legacyForSales';
      this.form.biddingPlacementProductPage = '';
      this.form.biddingPlacementTop = '';
      this.state = true;
      this.groupState = true;
      this.defaultRadio = '1';
      this.KeywordFlag = '关键词';
    },

    saveBtn() {
      // this.dialogVisible = false;
      const denyPrice = this.form.targetingMode === 'manual' && this.KeywordFlag === '分类/商品' && this.$refs.denyPrice.getField()
      || this.form.targetingMode === 'auto' && this.$refs.denyPrice.getField() || [];
      const priceCategory = this.form.targetingMode === 'manual' && this.KeywordFlag === '分类/商品' && this.$refs.priceCategory.getField() || [];
      const denyKeyword = this.form.targetingMode === 'manual' && this.KeywordFlag === '关键词' && this.$refs.denyKeyword.getField()
      || this.form.targetingMode === 'auto' && this.$refs.denyKeyword.getField() || [];
      const keywordTable = this.form.targetingMode === 'manual' && this.form.targetingMode === 'manual' && this.KeywordFlag === '关键词' && this.$refs.keywordTable.getField() || [];
      const tgTable = this.form.targetingMode === 'auto' && this.defaultRadio === '2' && this.$refs.tgTable.getField() || [];
      const priceTable = this.$refs.priceTable.getField();

      this.form = {
        ...this.form,
        campaignType: 'sponsoredProducts',
        state: this.state ? 'enabled' : 'paused',
        storeId: this.mwsStoreId,
      };
      this.form.groupRo = {
        ...this.form.groupRo,
        state: this.groupState ? 'enabled' : 'paused',
        keywordItemRoList: keywordTable,
        negativeKeywordItemRoList: denyKeyword,
        negativeTargetingAsinList: denyPrice,
        targetingAsinList: priceCategory,
        productItemRoList: priceTable,
        targetingExpressionRoList: tgTable
      };
      this.loading = true;
      createAdManage(this.form).then(res => {
        if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: '创建广告活动成功'
          });
          this.loading = false;
          this.dialogVisible = false;
          // this.empty();
        }
      }).catch(() => {
        this.loading = false;
      });

    },

    close() {
      this.$emit('update:dialogVisible', false);
    }
  },
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

  ::v-deep .el-radio {
    color: #606266;
    cursor: pointer;
    margin-right: 30px;
    margin-top: 15px;
  }

  ::v-deep .el-dialog__body {
    padding: 0 15px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }
  
  .form {
    ::v-deep .el-form-item__label {
      text-align: start;
    }
  }

</style>
