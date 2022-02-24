<template>
  <div class="title" :style="{height: height, width: width}"><span class="span1"></span><span style="marginLeft: 11px">{{title}}</span></div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
    },
    height: {
      type: String,
      default: '40px'
    },
    width: {
      type: String,
      default: '100%'
    }
  }
}
</script>
<style scoped>
  .title {
    background: linear-gradient(270deg, #000110 0%, #043492 100%);
    font-size: 14px;
    font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
    font-weight: bold;
    color: #8BA6CF;
    line-height: 40px;
    margin-top: 0;
    position: relative;
  }
  .span1 {
    position: absolute;
				padding: 4px;
				border-style: solid;
				border-color: rgba(1, 227, 227, 1);
				border-width: 1px 0 0 1px;
  }
</style>