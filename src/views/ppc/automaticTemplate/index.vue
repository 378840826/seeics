<template>
  <basic-container>
    <el-row>
      <el-col :span="12">
        <el-input class="inputclass" placeholder="请输入需要分析的关键词" />
        <el-button class="btn" size="mini">搜索</el-button>
        <el-button class="btn" size="mini">重置</el-button>
        <el-button type="primary" size="mini" @click="centerDialogVisible = true">创建模板</el-button>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="centerDialogVisible"
      :append-to-body="true"
      width="50%"
      class="tst"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
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
      <h4>规则范围：</h4>
      <div>
        执行频率
        <el-select v-model="frequency">
          <el-option
            v-for="item in frequencyOption"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </div>
      <global-filter ref="filters" fields="tatolFileds" dateSelect style="marginTop: 10px"/>
      <automatic/>
      <div class="explain">
        <p>操作要点</p>
        <p>1. 您设置的自动化模板可以添加到商品推广（Sponsored Product）、品牌推广（Sponsored Brand）、展示型推广（Sponsored Display）广告。</p>
        <p>2. 在广告管理页面，点击广告活动名称，然后进入“广告自动化”tab页，可以通过各种自动化规则的创建、编辑弹窗应用自动化模板</p>
        <p>3. 在广告自动化页面，点击广告活动名称对应的自动化操作，可以批量添加自动化模板。</p>
        <p>4. 已经添加到广告活动的自动化模板，编辑后若选择“仅保存”，请注意设置一个新的模板名称。</p>
        <p>1. 每个自动化标签最多支持一种自动化操作。</p>
        <p>2.  同一个广告活动下，同类型的广告自动化规则不可重复应用同一个自动化模板。</p>
        <p>规则执行</p>
        <p>1. 广告自动化按照广告所在站点时间执行。</p>
        <p>备注信息</p>
        <p>广告自动化的数据范围排除最近3天，如最近14天，实际指第17-4天。</p>
      </div>
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
      <template slot-scope="{row}" slot="menu">
        <el-button type="primary" size="mini" @click="groupVisible = true">添加广告活动</el-button>
      </template>
    </avue-crud>
    <el-dialog
      :visible.sync="groupVisible"
      :append-to-body="true"
      width="70%"
      class="tst"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
    <table-dialog/>
    <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="groupVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="groupVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
import globalFilter from '@/components/globalFilter/globalFilter.vue';
import Automatic from './components/automatic.vue';
import tableDialog from './components/tableDialog.vue';
export default {
  name: 'automaticTeplate',
  components: {
    globalFilter,
    Automatic,
    tableDialog
  },
  data() {
    return {
      data: [
        {
          recordTime: '1566'
        }
      ],
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
        ],
      },
      page: {
        total: 0,
        currentPage: 1,
        layout: 'total, sizes, prev, pager, next, jumper',
        pageSize: 20,
        pageSizes: [20, 50, 100],
      },
      centerDialogVisible: false,
      groupVisible: false,
      frequency: 7,
      frequencyOption: [
        {
          label: '每7天',
          value: 7
        },
        {
          label: '每14天',
          value: 14
        },
        {
          label: '每21天',
          value: 21
        },
        {
          label: '每30天',
          value: 30
        },
      ]
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
  .explain {
    margin-top: 20px;
    p {
      font-size: 12px;
      margin: 0;
    }
  }
</style>
