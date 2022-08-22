<template>
  <basic-container>
    <h1>购买企业会员</h1>
    <el-radio v-model="radio" label="1">企业会员
      <span style="marginLeft: 10px">{{$route.query.levelPrice}}元/年</span>
    </el-radio>
    <p style="fontSize: 24px">实付：{{$route.query.levelPrice}}元</p>
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
        <el-image 
          v-if="!overdue" 
          :style="{ width: '150px', height: '150px', opacity: checked ? 1 : '0.02' }" 
          :src="url"/>
        <div v-else class="load">二维码已过期，<el-button type="text" @click="placeAnOrder">刷新</el-button></div>
      </div>
      <div style="marginTop: 30px">

        <el-button @click="placeAnOrder" size="small" :disabled="checked">确 认</el-button>
        <el-button @click="close" size="small">取 消</el-button>
      </div>
    <el-dialog
        width="850px"
        :visible.sync="innerVisible"
        center
        append-to-body>
        <div class="explain">
            <p>• 当月未用完的次数，月底清零；</p>
            <p>• 会员等级是针对主账号的，子账号的等级=主账号的等级；子账号没有权限购买会员或者升级会员；</p>
            <p>• 会员到期后：数据停止更新；直至会员续费成功；</p>
            <p>• 按月付费，有效期为30天，按年付费，有效期为365天；注意：距离今天结束少于12小时的，今天不算在有效期内，
              即按月31天，按年366天；距离今天结束大于等于12小时，算在有效期内，即按月30天，按年365天；</p>
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
  </basic-container>
</template>

<script>
import { placeAnOrder } from '@/api/member/member';
import { mapGetters } from 'vuex';
export default {
  name: 'buyCorporate',
  data() {
    return {
      radio: '1',
      innerVisible: false,
      checked: false,
      qrName: '微信',
      payType: 1,
      url: 'https://seeics.com/corporate'
    };
  },

  computed: {
    ...mapGetters(['tagWel', 'tagList', 'tag', 'website']),
  },

  mounted() {
    // this.placeAnOrder();
  },

  methods: {
    handleQR(val) {
      if (!this.checked) {
        return;
      }
      if (val === 'wechat') {
        this.qrName = '微信';
        this.payType = 1;
      } else if (val === 'alipay') {
        this.qrName = '支付宝';
        this.payType = 2;
      }
    },

    placeAnOrder() {
      const params = {
        businessId: this.$route.query.levelPriceId,
        orderType: 1, //下单类型 1.购买会员 2.升级会员 3.续费会员 4.购买加油包
        payAmount: Number(this.$route.query.levelPrice),
        payType: this.payType,
        returnUrl: this.url,
      };
      placeAnOrder(params).then(res => {
        if (res.data.code === 200) {
          const data = res.data.data.form;
          const div = document.createElement('div');
          div.innerHTML = data;
          document.body.appendChild(div);
          document.forms[2].submit();
          this.$emit('change', false);
          this.dialogVisible = false;
        }
      });
    },

    close() {
      const tagObj = this.findTag(`${window.location.pathname}${window.location.search}`);
      let { tag } = tagObj;
      const { key } = tagObj;
      this.$store.commit('DEL_TAG', tag);
      if (tag.value === this.tag.value) {
        tag = this.tagList[key === 0 ? key : key - 1]; //如果关闭本标签让前推一个
        this.openTag(tag);
      }
    },

    openTag(item) {
      let tag;
      if (item.name) {
        tag = this.findTag(item.name).tag;
      } else {
        tag = item;
      }
      this.$router.push({
        path: this.$router.$avueRouter.getPath({
          name: tag.label,
          src: tag.value
        }, tag.meta),
        query: tag.query
      });
    },

    findTag(value) {
      let tag, key;
      this.tagList.map((item, index) => {
        if (item.value === value) {
          tag = item;
          key = index;
        }
      });
      return { tag: tag, key: key };
    },
  }
};
</script>

<style lang="scss" scoped>
  ::v-deep .el-card__body {
    padding: 20px;
    text-align: center;
   }
  .selectQR {
    width: 260px;
    display: flex;
    justify-content: space-around;
    margin: auto
  }
  .QRcode {
    width: 160px;
    margin: auto;
    text-align: center;
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
</style>
