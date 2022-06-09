<template>
  <div class="suspensionBox" v-show="istext">
    <div class="bgblue">
      <i class="el-icon-close" @click="closeissuspensionBox"></i>
      <div class="textcss">专属客服经理为您服务</div>
    </div>
    <img src="/img/contactcustomer.png"/>
  </div>
</template>

<script>


export default {
  name: 'suspensionBox',
  data() {
    return {
      istext: true,
    };
  },
  methods: {
    //点击×关闭客服悬框
    closeissuspensionBox(){
      this.istext = false;
    }
  },
};

</script>

<style scoped>
.suspensionBox {
  width: 100px;
  position: fixed;
  right: 12px;
  top: 115px;
  z-index: 9999;
  background: #fff;
}
img {
  width: 100%;
}
i {
  float: right;
}
.bgblue {
  background: #409EFF;
  border-left: 1px solid #409EFF;
  border-radius: 10px 0 0 0;
}
.textcss {
  font-size: 12px;
  color: aliceblue;
  font-weight: bold;
  width: 80px;
  text-align: center;
  padding: 10px 9px;
  margin-bottom: 10px;
}

</style>