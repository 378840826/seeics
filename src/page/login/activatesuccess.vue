<template>
  <div class="activatesuccess-container">
    <div class="activatesuccess-main" v-if="isSuccess">
    <div class="logo">
      <img src="/img/bg/bluelogo.png">
    </div>
    <div class="activatesuccess-center">
      <div class="activatesuccess-boder">
        <div class="flexcenter">
          <img src="/img/activeEmail.png">
          <div class="successtext">
            激 活 成 功
          </div>
        </div>
        <div class="jumptext">
          <span class="errortext">{{maxtime}} 秒 </span>后 自 动 跳 转 思 意 首 页
        </div>     
      </div>
    </div> 
    </div>
  </div>
</template>
<script>
import {activateAccount} from "@/api/user";
//import {getQueryString} from "@/util/util";

export default {
  name: 'activatesuccess',
  data() {
    return {
      isSuccess: true,
      maxtime: 4,
    }
  },
  mounted() {
    this.activateaccount();
  },
  methods: {
    activateaccount(){
      //从url里面切activateId
      const dd = this.$route.query.activateId
      
      activateAccount(dd).then((res) => {
        //激活成功执行倒计时
        if(res.code === 200){
          this.isSuccess=true;
          this.countdown();
        }
      })
    },
    //倒计时
    countdown(){  
      this.maxtime = this.maxtime-1;
      if(this.maxtime > 0){
        setTimeout(()=>{
          this.countdown();
        },1000);
      } else {
        this.$router.push({path: '/login'});
      }
    }
  },
}

</script>