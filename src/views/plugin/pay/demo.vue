<template>
  <basic-container>
      <basic-container>
        <div class="pay-demo-title">订单信息</div>
        <el-form ref="form" :rules="rules" :model="form" label-width="150px">
            <el-form-item label="订单号">
                <el-input v-model="form.orderNo"></el-input>
            </el-form-item>
            <el-form-item label="商品名称">
                <el-input v-model="form.body"></el-input>
            </el-form-item>
            <el-form-item label="支付金额">
                <el-input v-model="form.money"></el-input>
            </el-form-item>
            <el-form-item label="APPID" prop="appId" :rules="[
                        { 
                            required: true, 
                            message: '请输入公众号或小程序APPID', 
                            trigger: 'blur' 
                        }
                    ]">
                <el-input v-model="form.appId"></el-input>
            </el-form-item>
            <el-form-item label="收款商户号" prop="mchId" :rules="[
                        { 
                            required: true, 
                            message: '请输入微信收款商户号', 
                            trigger: 'blur' 
                        }
                    ]">
                <el-input 
                    v-model="form.mchId" 
                ></el-input>
            </el-form-item>
            <el-form-item label="openId">
                <el-input v-model="form.openId"></el-input>
            </el-form-item>
            <el-form-item label="附加参数">
                <el-input v-model="form.attach"></el-input>
            </el-form-item>
            <el-form-item label="同步回调地址">
                <el-input v-model="form.returnUrl"></el-input>
            </el-form-item>
        </el-form>
      </basic-container>

      <basic-container>
        <div class="pay-demo-title">支付方式</div>
        <div>
            <el-radio-group v-model="payType">
                <el-radio label="wx_nativePay" border>微信扫码支付</el-radio>
                <el-radio label="wx_jsPay" border>微信公众号支付</el-radio>
                <el-radio label="wx_wxAppPay" border>微信小程序支付</el-radio>
                <el-radio label="wx_h5Pay" border>微信H5支付</el-radio>
                <el-radio label="wx_appPay" border>微信APP支付</el-radio>
            </el-radio-group>
        </div>
        <div style="margin-top:20px">
            <el-radio-group v-model="payType">
                <el-radio label="ali_nativePay" border>支付宝扫码支付</el-radio>
                <el-radio label="ali_jsPay" border>支付宝小程序支付</el-radio>
                <el-radio label="ali_pcPay" border>支付宝电脑支付</el-radio>
                <el-radio label="ali_h5Pay" border>支付宝H5支付</el-radio>
                <el-radio label="ali_appPay" border>支付宝APP支付</el-radio>
            </el-radio-group>
        </div>
      </basic-container>

      <basic-container>
          <div style="text-align:right">
            <span style="font-size:18px;color:rgb(255, 102, 0);margin-right:10px">
                支付金额：{{form.money}}
            </span>
            <el-button type="primary" @click="onSubmit()">立即支付</el-button>
          </div>
      </basic-container>

        <el-dialog
            title="支付体验"
            append-to-body
            :visible.sync="dialogVisible"
            width="300px"
            center
            :before-close="closeDialog"
        >
        <div style="text-align:center"><img :src="codeUrl"/></div>
        </el-dialog>
  </basic-container>
</template>

<script>
import { wxNativePay, wxJsPay, wxMinAppPay, wxH5Pay, wxAppPay, aliNativePay, aliJsPay, aliPcPay, aliH5Pay, aliAppPay } from '@/api/plugin/pay/demo';
import { checkOrderStatus } from '@/api/plugin/pay/order';
let timer = null;
export default {
  data() {
    return {
      form: {
        orderNo: new Date().getTime(),
        body: '测试', 
        money: '0.01',
        appId: '',
        mchId: '',
        openId: '',
        returnUrl: 'https://seeics.com/plugin/pay/demo'
      },
      payType: '',
      dialogVisible: false,
      codeUrl: null,
      rules: {
        mchId: [
          { 
            required: true,
            message: '请输入微信收款商户号', 
            trigger: 'blur' 
          }
        ],
        appId: [
          { 
            required: true,
            message: '请输入公众号或小程序APPID', 
            trigger: 'blur' 
          }
        ]
      },
      order: null
    };
  },

  watch: {
    payType: {
      handler(val) {
        if (val === 'ali_pcPay') {
          this.form.appId = '2021003143612160';
          this.form.mchId = '2088441743103441';
        } else {
          this.form.appId = '';
          this.form.mchId = '';
        }
      }
    }
  },

  methods: {
    onSubmit(){
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return false;
        }

        const payType = this.payType;

        // eslint-disable-next-line eqeqeq
        if (payType == null || payType == ''){
          this.$message({
            type: 'error',
            message: '请选择支付方式'
          });
          return;
        }

        switch (payType) {
        case 'wx_nativePay':{
          wxNativePay(this.form).then((response) => {
            const data = response.data.data;
            this.dialogVisible = true;
            this.codeUrl = data.url;
            this.order = data.order;
            timer = setInterval(() => {
              this.checkOrder(); 
            }, 2000);

          });
          break;
        }
                        
        case 'wx_jsPay':{
          const openId = this.form.openId;
          // eslint-disable-next-line eqeqeq
          if (openId == null || openId == ''){
            this.$message({
              type: 'error',
              message: '该支付方式必须填写openId'
            });
            return;
          }
          wxJsPay(this.form).then((jsresponse) => {
            const data = jsresponse.data.data;
            this.$alert(data, '微信JSAPI支付结果', {
              confirmButtonText: '确定'
            });
          });
          break;
        }
                         
        case 'wx_wxAppPay':{
          const openId = this.form.openId;
          // eslint-disable-next-line eqeqeq
          if (openId == null || openId == ''){
            this.$message({
              type: 'error',
              message: '该支付方式必须填写openId'
            });
            return;
          }
          wxMinAppPay(this.form).then((minappResponse) => {
            const data = minappResponse.data.data;
            this.$alert(data, '小程序支付结果', {
              confirmButtonText: '确定'
            });
          });
          break;
        }
                            
        case 'wx_h5Pay':{
          wxH5Pay(this.form).then((h5response) => {
            const data = h5response.data.data;
            window.location.href = data;
          });
          break;
        }
                            
        case 'wx_appPay':{
          wxAppPay(this.form).then((appresponse) => {
            const data = appresponse.data.data;
            this.$alert(data, 'APP支付结果', {
              confirmButtonText: '确定'
            });
          });
          break;
        }

        case 'ali_nativePay':{
          aliNativePay(this.form).then((response) => {
            const data = response.data.data;
            this.dialogVisible = true;
            this.codeUrl = data.url;
            this.order = data.order;
            timer = setInterval(() => {
              this.checkOrder(); 
            }, 2000);

          });
          break;
        }

        case 'ali_jsPay':{
          const openId = this.form.openId;
          // eslint-disable-next-line eqeqeq
          if (openId == null || openId == ''){
            this.$message({
              type: 'error',
              message: '该支付方式必须填写openId'
            });
            return;
          }
          this.form.buyerId = openId;
          aliJsPay(this.form).then((jsresponse) => {
            const data = jsresponse.data.data;
            this.$alert(data, '支付宝小程序支付结果', {
              confirmButtonText: '确定'
            });
          });
          break;
        }

        case 'ali_pcPay':{
          aliPcPay(this.form).then((jsresponse) => {
            const data = jsresponse.data.data.form;
            const div = document.createElement('div');
            div.innerHTML = data;
            document.body.appendChild(div);
            document.forms[1].submit();
          });
          break;
        }

        case 'ali_h5Pay':{
          aliH5Pay(this.form).then((jsresponse) => {
            const data = jsresponse.data.data;
            window.location.href = data.url;
          });
          break;
        }

        case 'ali_appPay':{
          aliAppPay(this.form).then((jsresponse) => {
            const data = jsresponse.data.data;
            this.$alert(data, '支付宝APP支付结果', {
              confirmButtonText: '确定'
            });
          });
          break;
        }
            
        default:
          break;
        }

      });
    },
    /**
       * 查询订单状态
       */
    checkOrder(){
      const order = this.order;
      const params = {
        mchId: order.mchId,
        orderNo: order.orderNo,
      };
      checkOrderStatus(params).then((response) => {
        const data = response.data.data;
        console.log(data);
        if (data){
          this.$message({
            type: 'success',
            message: '支付成功!'
          });
          this.closeDialog();
        }
      });
    },
    closeDialog(done){
      this.codeUrl = null;
      this.dialogVisible = false;
      // eslint-disable-next-line eqeqeq
      if (timer != null){
        clearInterval(timer);
      }
      done();
    }
  }
};
</script>

<style>
.pay-demo-title{
    margin-bottom: 20px;
    font-size: 16px;
}
</style>
