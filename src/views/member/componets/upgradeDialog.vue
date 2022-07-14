<template>
  <div>

  <el-dialog
    title="会员升级"
    :visible.sync="dialogVisible"
    width="50%"
    :append-to-body="true"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
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
      <span>当前会员等级：{{'普通会员'}}</span>
      <span style="marginLeft: 50px">有效期剩余：{{12}}天</span>
    </p>
    <!-- <el-radio-group v-model="radio"> -->
      <p>
        <el-radio v-model="radio" :label="299">
          <span>VIP 1个月</span>
          <span style="marginLeft: 57px; color: #999999">原价：299元/月</span>
          <span style="marginLeft: 30px">299元/月</span>
        </el-radio>
      </p>
      <p>
        <el-radio v-model="radio" :label="29992999">
          <span>VIP 1年</span>
          <span style="marginLeft: 72px; color: #999999">原价：3599元/年</span>
          <span style="marginLeft: 20px; color: #ff0000">2999元/年</span>
        </el-radio>
      </p>
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
      <div style="fontSize: 18px">实付：{{radio}}元</div>
      <el-checkbox v-model="checked">本人已阅且同意</el-checkbox>
      <el-button type="text" @click="innerVisible = true">会员协议</el-button>
      <div>
        <el-button :type="checked ? 'primary' : ''" :disabled="!checked">微信支付</el-button>
        <el-button :type="checked ? 'primary' : ''" :disabled="!checked">支付宝支付</el-button>
      </div>
    <!-- </el-radio-group> -->
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
      innerVisible: false
    };
  },
  mounted() {
    console.log(this.dialogVisible)
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
</style>
