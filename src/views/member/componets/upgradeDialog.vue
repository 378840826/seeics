<template>
  <div>

  <el-dialog
    :title="info.renew ? '会员续费' : '会员升级'"
    :visible.sync="dialogVisible"
    width="530px"
    :append-to-body="true"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    center
    :before-close="handleClose">
    <el-dialog
      width="40%"
      :visible.sync="innerVisible"
      center
      append-to-body>
      <div class="explain">
        <p>• 当月未用完的次数，月底清零；</p>
        <p>• 会员等级是针对主账号的，子账号的等级=主账号的等级；子账号没有权限购买会员或者升级会员；</p>
        <p>• 会员到期后：数据停止更新；直至会员续费成功；</p>
        <p>• 按月付费，有效期为30天，按年付费，有效期为365天；</p>
        <p>• 原则上付费后不退款，不找零，会员有效期间，不降会员等级；</p>
        <p>• 普通会员免费；</p>
        <p class="extrude">普通会员购买VIP</p>
        <p>• 普通会员如果付费购买VIP、高级VIP或至尊VIP，付款后，权益会直接升级到相应级别；会员有效期从付费成功当天算起；</p>
        <p>• 会员过期后再购买VIP、高级VIP或至尊VIP，相当于重新开会员。高级别的会员过期后，可以买低级别的会员；</p>
        <p class="extrude">VIP续费</p>
        <p>• 每月提前7天全局弹窗提示用户续费；</p>
        <p>• 过期后续费，会员有效期重新算；会员有效期从付费成功当天算起；</p>
        <p>• 过期前续费，会员有效期顺延，例如：6.10号过期，1号续费1个月，那么续费后有效期是7.11；按年续费同理；可以连续多次按月续费或按年续费，会员有效期累加</p>
        <p>• 按年续费，按月续费，会员等级都不变；</p>
        <p class="extrude">VIP升级</p>
        <p>• 普通会员、VIP会员、高级VIP会员，升级更高级别的会员；SKU/ASIN/店铺个数的限额，直接升级到相应级别；月使用次数升级至相应级别；</p>
        <p>• 月卡会员能升级至月卡会员或年卡会员，年卡会员只能升级至年卡会员；例如：月卡VIP只能升级至月卡/年卡高级VIP或者月卡/年卡至尊VIP；</p>
        <p>• 月卡VIP升级至月卡高级VIP/年卡高级VIP，当日生效；当月剩余的使用次数清零，不顺延至下一个月；SKU/ASIN/店铺个数的限额，直接升级到相应级别；</p>
        <p>• 需按天补齐差价，实付金额=应付费用-（原等级费用/天数）*剩余天数。例如，月卡VIP会员，剩余天数n天，升级至月卡高级VIP，补齐费用=499-（299/30）*n；
          年卡VIP，剩余天数n天，升级至年卡高级VIP，补齐费用=4999-（2999/365）*n；</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="innerVisible = false">已悉知</el-button>
      </span>
    </el-dialog>
    <p>
      <span>当前会员等级：{{info.levelName}}</span>
      <span style="marginLeft: 50px">有效期剩余：<span style="color: #009900">{{info.effectiveDays}}</span>天（{{info.expirationTime}}到期）</span>
    </p>
    <!-- <el-radio-group v-model="radio"> -->
      <div v-if="info.renew ? info.levelName === 'VIP' : info.levelName === '普通会员'">
        <p>
          <el-radio v-model="radio" :label="299">
            <span>VIP 1个月</span>
            <span style="marginLeft: 57px; color: #999999">原价：299元/月</span>
            <span style="marginLeft: 30px">299元/月</span>
          </el-radio>
        </p>
        <p>
          <el-radio v-model="radio" :label="2999">
            <span>VIP 1年</span>
            <span style="marginLeft: 72px; color: #999999">原价：3599元/年</span>
            <span style="marginLeft: 20px; color: #ff0000">2999元/年</span>
          </el-radio>
        </p>
      </div>
      <div v-if="info.renew ? info.levelName === '高级VIP' : info.levelName === 'VIP' || info.levelName === '普通会员' ">
        <p>
          <el-radio v-model="radio" :label="499">
            <span>高级VIP 1个月</span>
            <span style="marginLeft: 30px; color: #999999">原价：499元/月</span>
            <span style="marginLeft: 30px">499元/月</span>
          </el-radio>
        </p>
        <p>
          <el-radio v-model="radio" :label="5999">
            <span>高级VIP 1年</span>
            <span style="marginLeft: 43px; color: #999999">原价：5999元/年</span>
            <span style="marginLeft: 23px; color: #ff0000">4999元/年</span>
          </el-radio>
        </p>
      </div>
      <div v-if="info.renew ? info.levelName === '至尊VIP' : info.levelName === 'VIP' || info.levelName === '高级VIP' || info.levelName === '普通会员'">
        <p>
          <el-radio v-model="radio" :label="999">
            <span>至尊VIP 1个月</span>
            <span style="marginLeft: 30px; color: #999999">原价：999元/月</span>
            <span style="marginLeft: 30px">999元/月</span>
          </el-radio>
        </p>
        <p>
          <el-radio v-model="radio" :label="11999">
            <span>至尊VIP 1年</span>
            <span style="marginLeft: 43px; color: #999999">原价：11999元/年</span>
            <span style="marginLeft: 20px; color: #ff0000">9999元/年</span>
          </el-radio>
        </p>
      </div>
      <div style="fontSize: 18px">实付：{{radio}}元</div>
      <div v-if="!info.renew" style="fontSize: 14px; color: #999999; marginLeft: 50px">={{radio}}-（{{spread(info.levelName)}}/30）*12</div>
      <div style="fontSize: 14px; color: #999999">
        {{info.renew ? '（付费成功后，有效期延长至 2021-10-12）' : '（升级当日生效，有效期延长15天（2021-10-12到期），需补齐差价）'}}
      </div>
      <el-checkbox v-model="checked">本人已阅且同意</el-checkbox>
      <el-button type="text" @click="innerVisible = true">会员协议</el-button>
      <div class="selectQR">
        <div :class="checked ? 'pay pointer' : 'pay not-allowed'" @click="handleQR('wechat')">
          <el-image style="width: 30px; height: 30px" src="/img/wechat.png"/>
          <span>微信支付</span>
        </div>
        <div :class="checked ? 'pay pointer' : 'pay not-allowed'" @click="handleQR('alipay')">
          <el-image style="width: 30px; height: 30px" src="/img/alipay.png"/>
          <span style="margin-right: 10px;">支付宝</span>
        </div>
      </div>
      <div class="QRcode">
        <div style="height: 30px; lineHeight: 30px;">{{checked ? `请用${qrName}扫码进行支付` : ''}}</div>
        <el-image :style="{ width: '150px', height: '150px', opacity: checked ? 1 : '0.02' }" src="https://d1icd6shlvmxi6.cloudfront.net/gsc/XTEPHL/90/a6/d4/90a6d47195614b5db966ae2e9e6a33a5/images/购买vip/u7396.jpg"/>
      </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false; $emit('change', false)">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false; $emit('change', false)">确 定</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>

export default{
  name: 'upgradeDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data() {
    return {
      radio: 299,
      checked: false,
      innerVisible: false,
      qrName: '微信'
    };
  },
  mounted() {
    console.log(this.info)
  },
  methods: {
    handleQR(val) {
      if (!this.checked) {
        return;
      }
      if (val === 'wechat') {
        this.qrName = '微信';
      } else if (val === 'alipay') {
        this.qrName = '支付宝';
      }
    },
    spread(val) {
      if (val === 'VIP') {
        return 299;
      } else if (val === '高级VIP') {
        return 499;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .explain {
    .extrude {
      font-weight: 600;
      margin-top: 30px;
    }

    p {
      margin: 0;
    }
  }
  .selectQR {
    width: 260px;
    display: flex;
    justify-content: space-around;
    margin: auto
  }
  .pay {
    line-height: 30px;
    height: 30px;
    width: 100px;
    font-size: 16px;
    border: 1px solid #EBEEF5;
    padding: 5px;
    &.not-allowed {
      cursor: not-allowed;
      background-color: #F2F6FC;
    }
    &.pointer {
      cursor: pointer;
    }
    span {
      float: right;
    }
  }
  .QRcode {
    width: 160px;
    margin: auto;
    text-align: center;
  }
  .div {
    width: 150px;
    height: 150px;
    position: absolute;
    bottom: 100px;
    background: #ccc;
  }
</style>
