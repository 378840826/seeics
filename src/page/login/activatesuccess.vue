<template>
  <div class="activatesuccess-container">
    <div class="activatesuccess-main">
    <div class="logo">
      <img src="/img/bg/bluelogo.png">
    </div>
    <div class="activatesuccess-center">
      <div class="activatesuccess-boder" v-if="isSuccess">
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
      <div class="successtext" v-else>激 活 失 败</div>
    </div> 
    </div>
  </div>
</template>
<script>
import { activateAccount } from '@/api/user';
//import {getQueryString} from "@/util/util";

export default {
  name: 'activatesuccess',
  data() {
    return {
      isSuccess: false,
      maxtime: 4,
    };
  },
  mounted() {
    this.activateaccount();
  },
  methods: {
    activateaccount(){
      //从url里面切activateId
      const dd = this.$route.query.activateId;
      
      activateAccount(dd).then((res) => {
        //激活成功执行倒计时
        if (res.data.code === 200){
          if (res.data.msg === '已激活'){
            this.$message.success(`${res.data.msg}`);
          }
          this.isSuccess = true;
          this.countdown();
        }
      });
    },
    //倒计时
    countdown(){  
      this.maxtime = this.maxtime - 1;
      if (this.maxtime > 0){
        setTimeout(() => {
          this.countdown();
        }, 1000);
      } else {
        this.$router.push({ path: '/login' });
      }
    }
  },
};

</script>

<style lang="scss" scoped>
.activatesuccess-container {
  min-width: 100%;
  min-height: 100%;
  background-color: #fff;
  margin:  0 auto;
  position: relative;

  .activatesuccess-main {
    width: 1366px;
    margin: 0 auto;

    .logo {
      width: 100%;
      margin: 0 auto;
      padding-top: 30px;
      padding-bottom: 220px;
    }

    .activatesuccess-center {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .activatesuccess-boder {
        height: 300px;
        width: 460px;
      }
      .flexcenter {
        display: flex;
        justify-content: center;
      }

      img{
        width: 54px;
        height: 54px;
      }
      .successtext{
        font-size: 30px;
        font-weight: bold;
        color: #000000;
        line-height: 54px;
        margin-left: 32px;
      }
      .jumptext {
        width: 100%;
        text-align: center;
        margin-top: 30px;
        font-size: 24px;
        font-weight: bold;
        color: #606266;
        line-height: 24px;
      }
      .errortext {
        color: #F04343; 
      }
    }
  }
}
</style>