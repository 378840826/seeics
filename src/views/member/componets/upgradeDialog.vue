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
      width="850px"
      :visible.sync="innerVisible"
      center
      append-to-body>
      <div class="explain">
        <p>• 当月未用完的次数，月底清零；</p>
        <p>• 会员等级是针对主账号的，子账号的等级=主账号的等级；子账号没有权限购买会员或者升级会员；</p>
        <p>• 会员到期后：数据停止更新；直至会员续费成功；</p>
        <p>• 按月付费，有效期为30天，按年付费，有效期为365天；注意：距离今天结束少于12小时的，今天不算在有效期内，即按月31天，
          按年366天；距离今天结束大于等于12小时，算在有效期内，即按月30天，按年365天；</p>
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
      <span >当前会员等级：{{info.levelName}}</span>
      <span style="marginLeft: 50px">有效期剩余：
      <span style="color: #009900">{{info.levelName === '普通会员' ? '—' : info.effectiveDays}}
        </span>{{ info.levelName === '普通会员' ? '' : `天（${info.expirationTime}到期）`}}</span>
    </p>
        <p 
          v-for="item in (info.renew ? 
          info.priceVoList.filter(item => item.unitName === '年' && item.isCurrentPrice 
          || item) : info.priceVoList)" 
          :key="item">
          <el-radio 
            v-model="price" 
            :label="item.payAmount" @change="handleRadio(item)" style="width: 400px; position: relative">
            <span>{{`${item.levelName} 1` + `${item.unitName === '月' ? '个' : ''}` + item.unitName}}</span>
            <div class="radioDiv">
              <span style="color: #999999;">原价：{{item.price + '元/' + item.unitName}}</span>
              <span >{{item.payAmount + '元/' + item.unitName}}</span>
            </div>
          </el-radio>
        </p>
      <div style="fontSize: 18px">实付：{{price}}元</div>
      <div v-if="!info.renew" style="fontSize: 14px; color: #999999; marginLeft: 50px">{{explain}}</div>
      <div style="fontSize: 14px; color: #999999">
        {{info.renew ? `（付费成功后，有效期延长至 ${extensionDate}）` : `（升级当日生效，有效期延长15天（${extensionDate}到期），需补齐差价）`}}
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
        <el-image 
         v-if="!overdue" 
         :style="{ width: '150px', height: '150px', opacity: checked ? 1 : '0.02' }" 
         :src="url"/>
        <div v-else class="load">二维码已过期，<el-button type="text" @click="placeAnOrder">刷新</el-button></div>
      </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false; $emit('change', false)">取 消</el-button>
      <el-button type="primary" @click="changeLevel">确 定</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
import { placeAnOrder, queryOrderInfo, changeLevel } from '@/api/member/member';
import { getStore } from '@/util/store';
const userId = getStore({ name: 'userInfo' }).user_id;
export default{
  name: 'upgradeDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
    },
    queryIndentPage: {
      type: Function
    },
    queryInfo: {
      type: Function
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data() {
    return {
      price: '',
      checked: false,
      innerVisible: false,
      qrName: '微信',
      explain: '',
      extensionDate: '',
      businessId: '',
      orderId: '',
      url: 'https://seeics.com/member/index',
      payType: 1,
      time: null,
      overdue: false,
    };
  },
  mounted() {
    this.price = this.info.priceVoList[0].payAmount;
    this.explain = this.info.priceVoList[0].explain;
    this.extensionDate = this.info.priceVoList[0].extensionDate;
    this.businessId = this.info.priceVoList[0].id;
  },
  methods: {
    // 测试升级
    changeLevel() {
      this.placeAnOrder();
    },
    handleQR(val) {
      if (!this.checked) {
        return;
      }
      if (val === 'wechat') {
        this.payType = 1;
        this.qrName = '微信';
      } else if (val === 'alipay') {
        this.payType = 2;
        this.qrName = '支付宝';
      }
    },
    handleRadio(val) {
      this.explain = val.explain;
      this.extensionDate = val.extensionDate;
      this.businessId = val.id;
    },
    placeAnOrder() {
      this.time = null;
      this.overdue = false;
      const params = {
        businessId: this.businessId,
        orderType: this.info.renew ? 3 : 2, //下单类型 1.购买会员 2.升级会员 3.续费会员 4.购买加油包
        payAmount: 0.01,
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
  .radioDiv {
    width: 250px;
    /* top: 16px; */
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
