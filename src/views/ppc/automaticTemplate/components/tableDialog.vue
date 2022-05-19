<template>
  <div>
    <el-row>
      <el-col :span="8">
        <div class="search">
            <el-select style="width: 35%"/>
            <el-select style="width: 25%"/>
            <el-select style="width: 35%"/>
        </div>
        <div class="search">
            <el-input style="width: 50%"/>
            <el-button size="mini">搜索</el-button>
            <el-button size="mini">重置</el-button>
        </div>
      </el-col>
      <el-col :span="15" style="marginLeft: 20px">
          <span>已选中XX个广告活动</span>
          <el-button type="text">删除所有</el-button>
      </el-col>
    </el-row>
    <el-row>
    <el-col :span="8">
      
      <avue-crud 
        :option="option" 
        v-model="user"
        :data="data" 
        :page.sync="page"
        @size-change="sizeChange"
        @current-change="currentChange"
        @sort-change="sortChange"
        @on-load="getAnalyzeLists"
      >
    </avue-crud>
    </el-col>
    <el-col :span="15" style="marginLeft: 20px">
      <avue-crud 
        :option="option" 
        v-model="user"
        :data="data" 
        :page.sync="page"
        @size-change="sizeChange"
        @current-change="currentChange"
        @sort-change="sortChange"
        @on-load="getAnalyzeLists"
      >
      </avue-crud>
    </el-col>
    </el-row>
  </div>
</template>

<script>
import { getCampaignList } from '@/api/ppc/automatic';
export default {
  name: 'tableDialog',
  data() {
    return {
      option: {
        emptyText: '暂无数据',
        addBtn: false,
        border: true,
        columnBtn: false,
        refreshBtn: false,
        saveBtn: false,
        updateBtn: false,
        cancelBtn: false,
        delBtn: false,
        menu: false,
        editBtn: false,
        align: 'center',
        menuAlign: 'left',
        rowKey: 'id',
        column: [
          {
            label: '广告活动',
            prop: 'recordTime',
            // sortable: true, //排序
            // width: 200,
            //slot:true
          },
          {
            label: '账号',
            prop: 'searchCountry',
            // width: 283,
          },
          {
            label: '站点',
            prop: 'searchKeyword',
            // width:700,
            slot: true,            
          },
         
        ],
      },
    };
  },
  mounted() {
    getCampaignList().then(res => {
        console.log(res)
    })
  }
};
</script>
<style lang="scss" scoped>
  ::v-deep .avue-crud__menu {
    min-height: 0px;
  }
  .search {
      margin-top: 10px;
      display: flex;
      justify-content:space-between;
  }
</style>
