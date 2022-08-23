<template>
  <div>

  <el-dialog
    :title="'购买' + info.title + '会员'"
    :visible.sync="visible"
    width="500px"
    :append-to-body="true"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    center
    :before-close="handleClose">
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
      <p v-for="item in info.priceLists" :key="item">
          <el-radio 
            v-model="price" 
            :label="item.price" 
            @change="handleRadio(item)"  
            style="width: 400px; position: relative">
            <span>{{`${info.title} 1` + `${item.unitName === '月' ? '个' : ''}` + item.unitName}}</span>
            <div class="radioDiv">
              <span style="color: #999999;">原价：{{item.price + '元/' + item.unitName}}</span>
              <span >{{item.price + '元/' + item.unitName}}</span>
            </div>
          </el-radio>
        </p>
      <!-- <p>优惠金额：￥100</p> -->
      <div style="fontSize: 18px; marginTop: 20px">实付：{{price}}元</div>
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
      <!-- <div class="QRcode">
        <div style="height: 30px; lineHeight: 30px;">{{checked ? `请用${qrName}扫码进行支付` : ''}}</div>
        <el-image 
          v-if="!overdue" 
          :style="{ width: '150px', height: '150px', opacity: checked ? 1 : '0.02' }" 
          :src="url"/>
        <div v-else class="load">二维码已过期，<el-button type="text" @click="placeAnOrder">刷新</el-button></div>
      </div> -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('change', false)">取 消</el-button>
      <el-button type="primary" @click="changeLevel" :disabled="!checked">确 定</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
import { placeAnOrder, queryOrderInfo, changeLevel } from '@/api/member/member';
import { getStore } from '@/util/store';
const userId = getStore({ name: 'userInfo' }).user_id;
export default{
  name: 'buyDialog',
  props: {
    visible: {
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
      price: '', //实付价格
      checked: false,
      innerVisible: false,
      qrName: '微信',
      active: '',
      payType: 2, //付款类型
      businessId: '', //价格id
      url: 'https://seeics.com/member/index',
      time: null,
      overdue: false, //二维码过期标识
      orderId: ''
    };
  },
  mounted() {
    this.price = this.info.priceLists[0].price;
    this.businessId = this.info.priceLists[0].id;
  },

  methods: {
    // 测试升级
    changeLevel() {
      this.placeAnOrder();
    },
    handleRadio(val) {
      this.price = val.price;
      this.businessId = val.id;
    },
    // handlePrice(price) {
    //   this.price = price;
    //   this.active = price;
    // },
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
      this.time = null;
      this.overdue = false;
      const params = {
        businessId: this.businessId,
        orderType: 1, //下单类型 1.购买会员 2.升级会员 3.续费会员 4.购买加油包
        payAmount: Number(this.price),
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
  }
};
</script>

<style lang="scss" scoped>
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
  
  .radioDiv {
    width: 250px;
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
  }
  .load {
    width: 160px;
    height: 150px;
    background-color: #ccc;
    line-height: 150px;
  }
</style>