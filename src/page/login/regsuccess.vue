<template>
  <div class="regsuccess-container">
    <img src="/img/activeEmail.png">
    <div>
      注册成功，请<a :href="emailsite" target="_blank"> 前往邮箱 </a>激活
    </div>
    <div class="bottomtext">
      没有收到验证邮件？
      <span class="sendagin" v-if="iscountdown">{{countdown}}s</span>
      <span @click="resetsendEmail" class="sendagin" v-else>重新发送</span>
      

    </div>  
  </div>
</template>

<script>
import { sendEmailAgain } from '@/api/user';
import { mapGetters } from 'vuex';

export default {
  name: 'regsuccess', 
  data() {
    return {
      emailsite: '',
      iscountdown: false,
      countdown: 120
    };
  },
  props: {
    userEmail: {
      type: String,
      default: '',
    }
  },
  created() {
    const regEmail = /@(\w)+((\.\w+)+)$/;
    const m = this.cacheemail.match(regEmail);
    if (m.length){
      this.emailsite = `http://www.mail.${ m[0].substr(1)}`;
    }
  },
  computed: {
    ...mapGetters(['cacheemail'])
  },
  methods: {

    //启动倒计时
    startcountdown(){
      this.countdown = this.countdown - 1;
      //判断是否>0
      if (this.countdown > 0){
        setTimeout(() => {
          this.startcountdown();
        }, 1000);
      } else {
        //重新发送字样,关倒计时
        this.iscountdown = false;
        //给值回到120
        this.countdown = 120;
        
      }
    },
    resetsendEmail(){
      this.iscountdown = true;
      //发送请求
      sendEmailAgain(this.cacheemail).then((res) => {
        if (res.data.code === 200){
          this.$message.success('激活邮件已发送至您的邮箱，请查收');
          //开启倒计时
          this.startcountdown();
        }
      });
    },
  },
};

</script>