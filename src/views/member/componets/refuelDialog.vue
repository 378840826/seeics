<template>
  <div>

  <el-dialog
    :title="info.renew ? '会员续费' : '购买订单加油包'"
    :visible.sync="refuelVisible"
    width="750px"
    :append-to-body="true"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    center
    :before-close="handleClose">
      <div class="cardPrice">
          <el-card 
            v-for="item in priceList" 
            :key="item" shadow="hover" 
            :body-style="{padding: '10px', width: '100px'}" 
            :class="{active : active === item.price}"
            @click.native="handlePrice(item.price)"
          >
              <p>{{item.number}}个</p>
              <p>¥{{item.price}}</p>
          </el-card>
      </div>
      <p>优惠金额：￥100</p>
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
      <div class="QRcode">
        <div style="height: 30px; lineHeight: 30px;">{{checked ? `请用${qrName}扫码进行支付` : ''}}</div>
        <el-image :style="{ width: '150px', height: '150px', opacity: checked ? 1 : '0.02' }" src="https://d1icd6shlvmxi6.cloudfront.net/gsc/XTEPHL/90/a6/d4/90a6d47195614b5db966ae2e9e6a33a5/images/购买vip/u7396.jpg"/>
      </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="refuelVisible = false; $emit('change', false)">取 消</el-button>
      <el-button type="primary" @click="refuelVisible = false; $emit('change', false)">确 定</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>

export default{
  name: 'refuelDialog',
  props: {
    refuelVisible: {
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
      price: 599,
      checked: false,
      innerVisible: false,
      qrName: '微信',
      priceList: [
        {
          price: 599,
          number: 10000,
        },
        {
          price: 1799,
          number: 30000,
        },
        {
          price: 3599,
          number: 60000,
        },
        {
          price: 5399,
          number: 90000,
        },
        {
          price: 7199,
          number: 120000,
        },
      ],
      active: 599
    };
  },
  mounted() {
    console.log(this.info)
  },
  methods: {
    handlePrice(price) {
      this.price = price;
      this.active = price;
    },
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
  .cardPrice {
    display: flex;
    justify-content: space-between;
    width: 700px;
    text-align: center;
    
    p {
      margin: 0;
    }
  }
  .active {
    border: 1px solid #58bc58;
  }
</style>