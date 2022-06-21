<template>
  <basic-container>
    <avue-crud 
      :option="option" 
      v-model="user"
      :data="data" 
      @on-load="getLogPage"
      ref="table1"
      :page.sync="page"
      :table-loading="tableLoading"
    >
      <template slot="matchType" slot-scope="scope">
        <div v-if="scope.row.matchType === 'exact'">精准匹配</div>
        <div v-if="scope.row.matchType === 'phrase'">词组匹配</div>
        <div v-if="scope.row.matchType === 'broad'">广泛匹配</div>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { getLogPage } from '@/api/ppc/castLog';

export default{
  data() {
    return {
      tableLoading: false,
      data: [],
      option: {
        emptyText: '暂无数据',
        addBtn: false,
        border: true,
        columnBtn: false,
        refreshBtn: false,
        saveBtn: false,
        updateBtn: false,
        cancelBtn: false,
        // delBtn: true,
        menu: false,
        editBtn: false,
        align: 'center',
        menuAlign: 'left',
        rowKey: 'id',
        maxHeight: 'calc(100vh - 290px)',
        column: [
          {
            label: '操作时间（站点时间）',
            width: 230,
            prop: 'createTime',
          },
          {
            label: '店铺名称',
            prop: 'adStoreName',
            width: 150,
            sortable: true,
          },
          {
            label: '站点',
            prop: 'marketplace',
            width: 50,
            slot: true,            
          },
          {
            label: '投放词',
            prop: 'keywordText',
            width: 200,
            slot: true,            
          },
          {
            label: '广告活动',
            prop: 'campaignName',
            minWidth: 283,
            slot: true,            
          },
          {
            label: '广告组',
            prop: 'adGroupName',
            minWidth: 283,
          },
          {
            label: '模板名称',
            prop: 'templateName',
            width: 200,
            slot: true,            
          },
          {
            label: '匹配类型',
            prop: 'matchType',
            width: 150,
            slot: true,            
          },
          {
            label: '竞价',
            prop: 'bid',
            width: 100,
            slot: true,            
          },
          {
            label: '投放结果',
            prop: 'state',
            width: 100,
            slot: true,            
          },
          {
            label: '操作人',
            prop: 'userName',
            width: 150,
            slot: true,            
          },
        ],
      },
      page: {
        total: 0,
        //pagerCount: 5,
        currentPage: 1,
        layout: 'total, sizes, prev, pager, next, jumper',
        pageSize: 20,
        pageSizes: [20, 50, 100],
        //background:false,
      },
    };
  },
  methods: {
    getLogPage() {
      getLogPage({ current: this.page.currentPage, size: this.page.pageSize }).then(res => {
        if (res.data.code === 200) {
          this.data = res.data.data.records;
          this.page.currentPage = res.data.data.current;
          this.page.total = res.data.data.total;
        }
      });
    }
  }
};
</script>
