<template>
  <div class="regsuccess-container">
    <img src="/img/activeEmail.png">
    <div>
      注册成功，请<a :href="emailsite" target="_blank"> 前往邮箱 </a>激活
    </div>
    <div class="bottomtext">
      没有收到验证邮件？
      <span @click="resetsendEmail" class="sendagin">重新发送</span>
    </div>  
  </div>
</template>

<script>
import {sendEmailAgain} from "@/api/user";
import {mapGetters} from "vuex";

export default {
  name: 'regsuccess', 
  data() {
    return {
      emailsite: '',
    }
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
    ...mapGetters(["cacheemail"])
  },
  methods: {
    resetsendEmail(){
      //发送请求
      sendEmailAgain(this.cacheemail).then((res) => {
        if(res.data.code === 200){
          this.$message.success('激活邮件已发送至您的邮箱，请查收')
        }
      })
    },
  },
}

</script>