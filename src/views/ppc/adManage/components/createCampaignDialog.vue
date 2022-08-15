<template>
  <el-dialog
    title="新增广告活动"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    :close-on-press-escape="false"
    top="1vh"
    width="70%">
    <div class="dialogBox">
      <h3>▌广告活动</h3>
      
      <div class="label">
        <span>广告活动名称：</span>
        <el-input style="width: 80%" size="small"/>
      </div>

      <div class="label">
        <span>日预算：</span>
        <el-input 
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
          v-model="value1"
          type="daterange"
          range-separator="——"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small">
        </el-date-picker>
      </div>

      <div class="label">
        <span>投放类型：</span>
        <el-radio-group v-model="radio">
          <el-radio :label="3">自动</el-radio>
          <el-radio :label="6">手动</el-radio>
        </el-radio-group>
      </div>

      <div class="label">
        <span>竞价策略：</span>
        <div style="width: 80%">
          <el-radio-group v-model="radio">
          <el-radio :label="3">动态竞价 - 仅降低
            <p>当您的广告不太可能带来销售时，我们将实时降低您的竞价。</p>
          </el-radio>
          <el-radio :label="6">动态竞价 - 提高和降低
            <p>当您的广告很有可能带来销售时，我们将实时提高您的竞价（最高可达 </p>
            <p>100%），并在您的广告不太可能带来销售时降低您的竞价。</p>
          </el-radio>
          <el-radio :label="6">固定竞价
            <p>我们将使用您的确切竞价和您设置的任何手动调整，而不会根据售出可能性对</p>
            <p>您的竞价进行更改。</p>
            <p>除了竞价策略外，您可以将竞价最多提高 900%。</p>
            <p>搜索结果顶部（首页）
              <el-input style="width: 150px" size="small"/>%
            </p>
            <p style="marginLeft: 140px;">示例： 对于此广告位，$0.75 竞价将为 $0.90。动态竞价可以将其提高至 $1.80</p>
            <p>商品页面
              <el-input style="marginLeft: 82px;width: 150px" size="small"/>%
            </p>
             <p style="marginLeft: 140px;">示例： 对于此广告位，$0.75 竞价将保持 $0.75 不变。动态竞价可以将其提高至 $1.13</p>
          </el-radio>
        </el-radio-group>
        </div>
      </div>

      <h3>▌广告活动</h3>

      <div class="label">
        <span>广告组名称：</span>
        <el-input style="width: 80%" size="small"/>
      </div>

      <Table/>

      <div>
        <el-radio :label="6">默认竞价：
          <el-input style="width: 80%" size="small"></el-input>
        </el-radio>
        <div>
          
        <el-radio :label="6">按Targeting Group设置竞价
        </el-radio>
        </div>

        <tg-bid-talbe/>

        <deny-keyword/>

        <deny-keyword/>
        
      </div>

    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
    </el-dialog>
</template>

<script>

import Table from './CampaignTable.vue';
import TgBidTalbe from './tgBidTable.vue';
import DenyKeyword from './denyKeyword.vue';

export default {
  components: {
    Table,
    TgBidTalbe,
    DenyKeyword
  },
  
  data() {
    return {
      dialogVisible: true
    };
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
