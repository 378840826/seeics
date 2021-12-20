<template>
  <div class="regsuccess-container">
    <img src="/img/activeEmail.png">
    <div>
      注册成功，请<a href="#" target="_blank"> 前往邮箱 </a>激活
    </div>
    <div class="bottomtext">
      没有收到验证邮件？
      <span @click="resetsendEmail">重新发送</span>
    </div>  
  </div>
  
</template>

<script>
export default {
  name: 'regsuccess',
  data() {
  },
  methods: {
    resetsendEmail(){},
  },
}

</script>