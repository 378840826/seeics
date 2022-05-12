<template>
  <basic-container>
    <el-row>
      <el-col :span="12">
        <el-input class="inputclass" placeholder="请输入需要分析的关键词" />
        <el-button class="btn" size="mini">搜索</el-button>
        <el-button class="btn" size="mini">重置</el-button>
        <el-button type="text" @click="centerDialogVisible = true">点击打开 Dialog</el-button>


      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="centerDialogVisible"
      :append-to-body="true"
      class="tst"
    >
      <span>创建搜索词：</span>
      <div class="tabel">
        <span>规则名称：</span>
        <span style="width: 50%"><el-input/></span>
      </div>
      <div class="tabel">
        <span>规则说明：</span>
        <div style="width: 70%"><el-input type="textarea"/></div>
      </div>
      <global-filter ref="filters" fields="tatolFileds"/>
      <automatic/>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="centerDialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
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
  </basic-container>
</template>

<script>
import globalFilter from '@/components/globalFilter/globalFilter.vue';
import Automatic from './components/automatic.vue';
export default {
  name: 'automaticTeplate',
  components: {
    globalFilter,
    Automatic
  },
  data() {
    return {
      option: {
        emptyText: '没有找到相关商品，请重新查询',
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
            label: '模板名称',
            prop: 'recordTime',
            sortable: true, //排序
            // width: 200,
            //slot:true
          },
          {
            label: '模板类型',
            prop: 'searchCountry',
            // width: 283,
          },
          {
            label: '规则或范围',
            prop: 'searchKeyword',
            // width:700,
            slot: true,            
          },
          {
            label: '广告活动数量',
            prop: 'searchKeyword',
            // width:700,
            slot: true,            
          },
          {
            label: '创建账号',
            prop: 'searchKeyword',
            // width:700,
            slot: true,            
          },
          {
            label: '创建时间',
            prop: 'searchKeyword',
            // width:700,
            slot: true,            
          },
          {
            label: '更新时间',
            prop: 'searchKeyword',
            // width:700,
            slot: true,            
          },
          {
            label: '更新人账号',
            prop: 'searchKeyword',
            // width:700,
            slot: true,            
          },
          {
            label: '操作',
            prop: 'menu',
            align: 'center',
            width: 230,
            fixed: 'right'
          },
        ]
      },
      page: {
        total: 0,
        currentPage: 1,
        layout: 'total, sizes, prev, pager, next, jumper',
        pageSize: 20,
        pageSizes: [20, 50, 100],
      },
      centerDialogVisible: false
    };
  },
  mounted() {
    console.log(document.querySelector('.tst').clientWidth);
  },
  updated() {
      console.log(document.querySelector('.tst').clientWidth);
  }
};
</script>

<style lang="scss" scoped>
  ::v-deep .el-input__inner {
    line-height: 30px;
    height: 30px;   
  }
  .inputclass {
    line-height: 28px;
    width: 40%;
  }
  .btn {
    margin-left: 40px;
  }
  .tabel {
    display: flex;
    margin-top: 30px;
  }
</style>
