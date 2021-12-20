<template>
  <div class="index-container">
    <div class="top-container">
      <div class="top-center">
        <div class="left-text">
          <img src="/img/bg/logoseeics.png">
          <div class="title">找数据，上思意</div>
          <div class="subtitle">亚马逊创业者的数据神器</div>
          <el-button type="primary" @click="tokeywordindex">立即免费体验</el-button>
        </div>
        <img src="/img/bg/indexbg.png">
      </div>
    </div>
    <div class="center-container">
      <div class="center-center">
        <el-form :inline="true" :model="formInline">
          <el-form-item>
            <el-select v-model="formInline.site" class="siteselect">
              <el-option label="美国" value="US"></el-option>
              <el-option label="英国" value="EN" disabled></el-option>
              <el-option label="加拿大" value="CA" disabled></el-option>
              <el-option label="法国" value="FR" disabled></el-option>
              <el-option label="意大利" value="SP" disabled></el-option>
              <el-option label="德国" value="GE" disabled></el-option>
            </el-select>
          </el-form-item>
          <el-form-item >
            <el-input v-model="formInline.keyword" placeholder="请输入需要分析的关键词" class="keywordinput"></el-input>
          </el-form-item>       
          <el-form-item>
            <el-button type="primary" @click="tokeywordindex">分析</el-button>
          </el-form-item>
          <el-form-item label="亚马逊搜索结果前 ">
            <el-select v-model="formInline.page" class="pageselect">
              <el-option label="2" value=2></el-option>
              <el-option label="4" value=4 ></el-option>
              <el-option label="6" value=6 ></el-option>
              <el-option label="8" value=8 ></el-option>
              <el-option label="10" value=10 ></el-option>
            </el-select>
            <span>  页</span>
          </el-form-item>
        </el-form> 
      </div>
    </div>
    <footer class="footer">Copyright 2017 - 2021 All Rights Reserved | Powered by amzics.com</footer>
  </div>
</template>
<script>
export default {
  name: 'index',
  data(){
    return {
      formInline:{
        site: "美国",
        keyword: "",
        page: "2"
      },
    }
  },
  methods: {
    tokeywordindex(){
      this.$router.push({path: "/keyword/index"});
    }
  },
}
</script>
<style lang="scss">
  @import "./index.scss";
</style>