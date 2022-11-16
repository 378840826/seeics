<template>
  <div>
    <h3 v-if="type">▌广告活动（{{type === '商品' ? '商品' : '关键词'}}）</h3>
    <div style="display: flex;">
        <span style="width: 130px">广告活动名称：</span>
        <span>{{type === '商品' ? 'ASIN+MSKU+搜索词（ASIN）+ ' : 'ASIN+MSKU+关键词+匹配方式+'}}
          <span style="position: relative">日期时间
            <el-tooltip class="item" effect="dark" content="日期时间为站点时间；" placement="bottom">
              <i style="position: absolute;top: -3px;left: 50px;" class="el-icon-question"></i>
            </el-tooltip>
          </span>
           +
          <el-input v-model="form.campaignName" placeholder="请输入自定义文本；" style="width: 200px"/>
        </span>
      </div>
      <el-form :model="form" ref="form" :rules="rule" label-width="130px">

        <el-form-item v-if="!this.portfolio"  prop="portfolioId">
        <template slot="label">
          <div style="display: flex;">
            <span>广告组合：</span>
          </div>
        </template>

        <el-select
          v-model="form.portfolioId"
          v-loadmore="loadmore"
          @change="handleConise"
          clearable
          filterable
          remote
          :remote-method="remoteMethod"
          :loading="conciseLoading"
          @focus="searchConise = '';
            searchConciseList = [];"
          size="small"
        >
          <el-option
            v-for="item in !searchConise ? conciseList : searchConciseList"
            :key="item.portfolioId"
            :value="item.portfolioId"
            :label="item.name"
          />
        </el-select>
      </el-form-item>


        <el-form-item prop="dailyBudget">
        <template slot="label">
          <div style="display: flex;">
            <span>日预算：</span>
            <el-tooltip placement="top">
              <div slot="content" style="width: 200px">
              您愿意每天为该广告活动花费的金额。
              如果广告活动支出低于您的每日预算,
              则剩余金额可用于增加该日历月的其他日期的每日预算，
              最多可增加 25%。</div>
              <span class="el-icon-question" style="line-height: 40px;"></span>
            </el-tooltip>
            <span class="budget">*</span>
          </div>
        </template>
        <el-input 
          v-model="form.dailyBudget"
          style="width: 30%"
          placeholder="至少1"
          size="small">
           <template slot="prefix">{{currency}}</template>
        </el-input>
      </el-form-item>

      <div class="label">
        <span>日期范围：
          <el-tooltip placement="top">
            <div slot="content" style="width: 200px">
              广告活动开始时间小于当前日期自动调整为当前日期；若结束时间小于当前日期，模板不执行；
            </div>
            <span class="el-icon-question" style="line-height: 40px;"></span>
          </el-tooltip>
        </span>
        <el-date-picker
          v-model="form.startTime"
          style="width: 25%"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions"
          size="small">
        </el-date-picker>
        <span style="margin: 0 6px;color: #d9d9d9;width: 12px;">—</span>
        <el-date-picker
          v-model="form.endTime"
          style="width: 25%"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions2"
          size="small">
        </el-date-picker>
      </div>

      <div class="label">
        <span>投放类型：</span>
        <el-radio-group v-model="form.deliveryType" style="marginTop: 10px">
          <!-- <el-radio label="auto">自动</el-radio> -->
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

      <div class="bidding">
        <p style="fontSize: 14px; marginTop: 10px">除了竞价策略外，您可以将竞价最多提高 900%。</p>
          <p>
            <span style="fontSize: 14px;color: #222">搜索结果顶部（首页）</span>
            <el-input v-model="form.frontPage" @blur="numberChange" style="width: 150px" size="small">
              <template slot="suffix">
                <div  style="lineHeight: 32px">%</div>
              </template>
            </el-input>
            <span v-if="form.frontPage > 900" style="color: red; marginLeft: 10px">最大值不能超过900</span>
          </p>
          <p style="marginLeft: 140px;">示例： 对于此广告位，$0.75 竞价将为 
            ${{algorithm(form.frontPage)}}。
            {{form.biddingStrategy !== 'manual' ? `动态竞价范围$0 - $${algorithm(form.frontPage)}` : ''}}</p>
          <p>
            <span style="fontSize: 14px;color: #222">商品页面</span>
            <el-input
              v-model="form.productPage"
              @blur="numberChange" style="marginLeft: 82px;width: 150px" size="small">
              <template slot="suffix">
                <div  style="lineHeight: 32px;">%</div>
              </template>
            </el-input>
            <span v-if="form.productPage > 900" style="color: red; marginLeft: 10px">最大值不能超过900</span>
          </p>
          <p style="marginLeft: 140px;">示例： 对于此广告位，$0.75 竞价将为 
            ${{algorithm(form.productPage)}}。
            {{form.biddingStrategy !== 'manual' ? 
            `动态竞价范围$0 - $${algorithm(form.productPage)}` : ''}}</p>
      </div>
      </el-form>
  </div>
</template>

<script>

import { getAdConciseList } from '@/api/ppc/adManage';
import dayjs from 'dayjs';
export default {
  props: {
    currency: {
      type: String,
      require: true
    },
    adStoreId: {
      type: String,
      require: true
    },
    echoPortfolioId: {
      type: String,
    },
    portfolio: {
      type: Boolean,
    },
    rowData: {
      type: String,
      require: true
    },
    type: {
      type: String
    },
    templateId: {
      type: String,
      require: true,
    },
    echoCampaign: {
      type: Array,
    }
    
  },

  data() {

    const checkBudget = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(`日预算不能为空`));
      }
      if (this.marketplace === 'JP') {
        if (value < 100) {
          return callback(new Error(`广告活动每日预算至少${this.currency}100`));
        } else if (value > 21000000) {
          return callback(new Error(`广告活动每日预算不能超过${this.currency}21,000,000`));
        // eslint-disable-next-line no-else-return
        } else {
          callback();
        }
      } else {
        if (value < 1) {
          return callback(new Error(`广告活动每日预算至少${this.currency}1`));
        } else if (value > 1000000) {
          return callback(new Error(`广告活动每日预算不能超过${this.currency}1000000`));
        // eslint-disable-next-line no-else-return
        } else {
          callback();
        }
      }
    };

    const format = (val) => {
      if (val === '商品') {
        return 1;
      } else if (val === '关键词') {
        return 2;
      }
    };

    return {
      rule: {
        dailyBudget: [
          { validator: checkBudget, trigger: 'blur' },
        ]
      },
      pickerOptions: {
        disabledDate: (date) => {
          return date.getTime() < Date.now() - 8.64e7;
        }
      },
      pickerOptions2: {
        disabledDate: (date) => {
          const day = new Date(this.form.startTime);    
          return date.getTime() <= day.getTime() + 24 * 60 * 60 * 1000 - 8.64e7;
        }
      },
      //广告组合
      concisePage: {
        current: 1,
        size: 20
      },
      searchConcisePage: {
        current: 1,
        size: 20
      },
      conciseList: [],
      searchConciseList: [],
      conciseTotal: 0,
      searchConise: '',
      searchConciseTotal: 0,
      form: {
        id: '',
        campaignName: '',
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
        type: format(this.type)
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

  watch: {
    'form.startTime': {
      handler() {
        const start = new Date(this.form.startTime).getTime();
        const end = new Date(this.form.endTime).getTime();
        if (start >= end) {
          this.form.endTime = '';
        }
      },
      deep: true,
    }
  },

  mounted() {
    this.echoCampaign && this.echo();
    if (!this.portfolio && this.echoPortfolioId) {
      this.getAdConciseList(false, '', this.echoPortfolioId);
    } else {
      !this.portfolio && this.getAdConciseList();
    }
  },

  methods: {
    algorithm(value) {
      const res = Number(value) / 100;
      return ( 0.75 * (1 + res)).toFixed(2);
    },

    msg() {
      let flag;
      this.$refs.form.validate(s => {
        flag = s;
      });
      
      if (!flag) {
        return true;
      // eslint-disable-next-line no-else-return
      } else {
        return false;
      }
    },

    repetit(arr) {
      let res = [];
      const hasObj = {};
      res = arr.reduce((total, next) => {
        const filterKey = next.portfolioId;
        hasObj[filterKey] ? '' : hasObj[filterKey] = true && total.push(next);
        return total;
      }, []);
      return res;
    },

    loadmore() {
      const result = !this.searchConise ?
        this.concisePage.size * this.concisePage.current : this.searchConcisePage.size * this.searchConcisePage.current;
      const total = !this.searchConise ? this.conciseTotal : this.searchConciseTotal;
      if (result < total) { //加载全部出来 停止请求
        !this.searchConise ? this.concisePage.current ++ : this.searchConcisePage.current ++;
        this.getAdConciseList(true);
      }  
    },

    getAdConciseList(flag, name, id) {
      this.conciseLoading = true;
      getAdConciseList({
        current: !this.searchConise ? this.concisePage.current : this.searchConcisePage.current,
        size: !this.searchConise ? this.concisePage.size : this.searchConcisePage.size,
      }, {
        adStoreId: this.adStoreId,
        states: ['enabled', 'paused'],
        name: this.searchConise || name,
        portfolioIds: [id].filter(Boolean)
      }).then(res => {
        this.conciseLoading = false;
        if (this.searchConise) {
          const data = res.data.data.records;
          this.searchConciseTotal = res.data.data.total;
          if (this.searchConciseTotal > this.searchConcisePage.current * this.searchConcisePage.size) {
            this.searchConciseList = this.searchConciseList.concat(data);
            this.searchConciseList = this.repetit(this.searchConciseList);
          } else {
            this.searchConciseList = data;
          }
          return;
        }

        this.conciseTotal = res.data.data.total;
        if (flag) {
          this.conciseList = [...this.conciseList, ...res.data.data.records];
          this.conciseList = this.repetit(this.conciseList);
          return;
        }

        if (id) {
          this.getAdConciseList(true);
        }

        this.conciseList = res.data.data.records;
        this.conciseList = this.repetit(this.conciseList);
      });
    },

    remoteMethod(val) {
      this.searchConise = val;
      this.conciseLoading = true;
      this.searchConciseList = [];
      this.searchConcisePage.current = 1;
      this.getAdConciseList(false, val);
    },

    handleConise(val) {
      if (this.searchConise) {
        const arr = this.searchConciseList.filter(item => item.portfolioId === val);
        if (this.conciseList.length && !this.conciseList.filter(item => item.portfolioId === val).length) {
          this.conciseList = [...arr, ...this.conciseList];
        }
      }
    },

    getField() {
      return {
        ...this.form,
        endTime: this.form.endTime && dayjs(this.form.endTime).format('YYYY-MM-DD HH:mm:ss') || null,
        startTime: this.form.startTime && dayjs(this.form.startTime).format('YYYY-MM-DD HH:mm:ss') || null,
      };
    },

    echo() {
      this.form = this.echoCampaign[0];
    }
  }
};
</script>

<style lang="scss" scoped>
  .label{
    width: 600px;
    display: flex;
    line-height: 32px;
    margin-top: 20px;

    span {
      width: 22%;
    }

    p {
      margin: 0 0 6px 24px;
      font-size: 12px;
      color: #888;
    }
    
  }

  .bidding {
    padding: 0px 0px 0px 120px;

    p {
      margin: 0 0 6px 9px;
      font-size: 12px;
      color: #888;
    }
  }

  .budget {
    color: #ff4d4f;
    font-size: 20px;
    font-family: SimSun,sans-serif;
    content: "*";
    display: block;
    widows: 10px;
  }

</style>
