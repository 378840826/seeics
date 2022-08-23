<template>
  <el-dialog
    title="新增广告活动"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    :close-on-press-escape="false"
    top="1vh"
    width="1140px">
    <div class="dialogBox">
      <h3>▌广告活动</h3>
      
      <div class="label">
        <span>广告活动名称：</span>
        <el-input v-model="form.name" style="width: 80%" size="small"/>
      </div>

      <div class="label">
        <span>日预算：</span>
        <el-input 
          v-model="form.budget"
          style="width: 30%"
          placeholder="至少1"
          size="small">
           <template slot="prefix">$</template>
        </el-input>
      </div>

      <div class="label">
        <span>日期范围：</span>
        <el-date-picker
          style="width: 80%"
          v-model="date"
          type="daterange"
          range-separator="——"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small">
        </el-date-picker>
      </div>

      <div class="label">
        <span>投放类型：</span>
        <el-radio-group v-model="form.targetingMode">
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
            <p>除了竞价策略外，您可以将竞价最多提高 900%。</p>
            <p>搜索结果顶部（首页）
              <el-input v-model="form.biddingPlacementTop" style="width: 150px" size="small"/>%
            </p>
            <p style="marginLeft: 140px;">示例： 对于此广告位，$0.75 竞价将为 $0.90。动态竞价可以将其提高至 $1.80</p>
            <p>商品页面
              <el-input v-model="form.biddingPlacementProductPage" style="marginLeft: 82px;width: 150px" size="small"/>%
            </p>
             <p style="marginLeft: 140px;">示例： 对于此广告位，$0.75 竞价将保持 $0.75 不变。动态竞价可以将其提高至 $1.13</p>
          </el-radio>
        </el-radio-group>
        </div>
      </div>

      <h3>▌广告活动</h3>

      <div class="label">
        <span>广告组名称：</span>
        <el-input v-model="form.groupRo.name" style="width: 80%" size="small"/>
      </div>

      <Table 
        ref="priceInfo"
        :priceAsin.sync="priceAsin"
        style="marginTop: 20px"/>

      <div>
        <div v-if="form.targetingMode === 'auto'">
          <el-radio v-model="defaultRadio" label="1">默认竞价：
            <el-input
              v-if="defaultRadio === '1'"
              v-model="form.groupRo.defaultBid"
              placeholder="至少1"
              size="small">
              <i slot="prefix" style="lineHeight: 32px">$</i>
            </el-input>
          </el-radio>
          <div>
            
          <el-radio v-model="defaultRadio" label="2">按Targeting Group设置竞价
          </el-radio>
          </div>

          <tg-bid-talbe
            v-if="defaultRadio === '2'"
            :asinList.sync="priceAsin"
            :targetingMode.sync="form.biddingStrategy"
          />
        </div>

        <div v-if="form.targetingMode === 'manual'" class="label">
          <span>默认竞价：</span>
          <el-input v-model="form.groupRo.defaultBid" placeholder="至少1" style="width: 40%" size="small">
            <i slot="prefix">$</i>
          </el-input>
        </div>

         <h3>
          <span @click="KeywordFlag = '关键词'" :style="{color: KeywordFlag === '关键词' && '#409EFF' || ''}">关键词</span>
          <span 
            @click="KeywordFlag = '分类/商品'" 
            :style="{marginLeft: '30px', color: KeywordFlag === '分类/商品' && '#409EFF' || ''}">分类/商品</span>
        </h3>

        <keyword
          v-if="KeywordFlag === '关键词'"
          :asinList.sync="priceAsin"
          :targetingMode.sync="form.biddingStrategy"
        />

        <deny-keyword
          v-if="KeywordFlag === '关键词'"
          :title="'关键词'"
        />

        <!-- <manual-category v-if="KeywordFlag === '分类/商品'"/> -->

        <price-category
          v-if="KeywordFlag === '分类/商品'"
          :asinList.sync="priceAsin"
          :targetingMode.sync="form.biddingStrategy"/>

        <deny-keyword
          v-if="KeywordFlag === '分类/商品'"
          :title="'商品'"
        />

      </div>

    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
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

export default {
  components: {
    Table,
    TgBidTalbe,
    DenyKeyword,
    ManualCategory,
    Keyword,
    PriceCategory
  },
  
  data() {
    return {
      dialogVisible: true,
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
          defaultBid: '',
          negativeKeywordItemRoList: [], //否定关键词集合
          negativeTargetingAsinList: [], //否定投放商品（ASIN）集合
          productItemRoListL: [], //商品广告集合
          targetingAsinList: [], //投放商品（ASIN）集合
          targetingExpressionRoList: [], //targetingGroup  自动投放表达式
        }
      },
      defaultRadio: '1'
    };
  },

  watch: {
    priceAsin: {
      handler(val) {
        console.log(val)
      },
      deep: true,
    },
    date: {
      handler() {
        this.form.startDate = dayjs(this.date[0]).format('YYYY-MM-DD');
        this.form.endDate = dayjs(this.date[1]).format('YYYY-MM-DD');
      },
      deep: true
    }
  },

  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done();
        })
        .catch(() => {});
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

</style>
