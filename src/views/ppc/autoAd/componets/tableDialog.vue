<template>
  <div>
    <el-row style="height: 45px">
      <el-col :span="10">
        <div class="search" >
            <el-input 
              v-model="fromInline.name" 
              placeholder="筛选广告组"
              style="width: 50%"
            />
            <el-button @click="handleSearch" size="mini">搜索</el-button>
            <el-button @click="reset" size="mini">重置</el-button>
        </div>
      </el-col>
      <el-col :span="13" class="table2 pading">
          <span>已选中{{num}}个广告组</span>
          <el-button type="text" @click="handleDelet('all')">删除所有</el-button>
      </el-col>
    </el-row>
    <el-row>
    <el-col :span="10">
      
      <avue-crud 
        :option="option" 
        v-model="user"
        :data="data" 
        @selection-change="selectionChange"
        @on-load="getCampaignPage"
        ref="table1"
        :table-loading="tableLoading"
      >
    </avue-crud>
    </el-col>
    <el-col :span="13" class="table2">
      <avue-crud 
        :option="options" 
        v-model="user"
        :data="datas" 
      >
        <template slot-scope="{row}" slot="meum">
          <el-button type="text" size="mini" @click="handleDelet(row.adGroupId)">删除</el-button>
        </template>
      </avue-crud>
    </el-col>
    </el-row>
    <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="page.pageSizes"
        :page-size="page.pageSize"
        :layout="page.layout"
        :total="page.total">
    </el-pagination>
  </div>
</template>

<script>
import { 
  getCampaignPage
} from '@/api/ppc/autoAd';
export default {
  name: 'tableDialog',
  props: {
    automationRow: {
      type: Object,
    },
    adStoreId: {
      type: String,
      default: ''
    },
    templateId: {
      type: String,
      default: ''
    },
    echoGroupList: {
      type: Array,
      default: new Array()
    }
  },
  data() {
    return {
      shopList: [], //店铺名称列表
      fromInline: {
        shopName: '',
        marketplace: '',
        state: 'enabled',
        name: ''
      },
      marketplaceList: [],
      stateList: [
        {
          label: '运行中',
          value: 'enabled'
        },
        {
          label: '运行中和已暂停',
          value: 'enabledAndPaused'
        },
        {
          label: '已暂停',
          value: 'paused'
        },
        {
          label: '已归档',
          value: 'archived'
        },
        {
          label: '全选',
          value: 'all'
        }
      ],
      data: [],
      datas: [],
      listData: [],
      tableLoading: false,
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
        height: 300,
        selection: true,
        tip: false,
        selectable: this.bas,
        column: [
          {
            label: '广告组',
            prop: 'name',
            // sortable: true, //排序
            // width: 400,
            //slot:true
          },
        ],
      },
      options: {
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
        height: 300,
        column: [
          {
            label: '广告组',
            prop: 'name',
          },
          {
            label: '操作',
            prop: 'meum',
            width: 80,
            slot: true,            
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
      noShopDialog: false,
    };
  },
  mounted() {
    // getShopNameList().then(res => {
    //   this.tableLoading = true;
    //   if (res.data.code === 200) {
    //     this.shopList = res.data.data;
    //     if (!res.data.data.length) {
    //       this.noShopDialog = true;
    //       return;
    //     }
    //     this.fromInline.shopName = res.data.data.length && res.data.data[0] || '';
    //     this.getMarketplaceList(this.fromInline.shopName);
    //   }
    // });
    this.datas = this.echoGroupList.length && this.echoGroupList.map(item => {
      return {
        ...item,
        adGroupId: item.groupId,
        name: item.groupName
      };
    }) || [];
  },
  computed: {
    num: (vm) => {
      return vm.datas.length;
    },
    state: (vm) => {
      const stateList = [];
      vm.stateList.forEach(item => {
        if (item.value !== 'all') {
          stateList.push(item.value);
        }
      });
      if (vm.fromInline.state === 'enabledAndPaused') {
        return ['enabled', 'paused'];
      } 
      if (vm.fromInline.state === 'all') {
        return stateList;
      }
      return [vm.fromInline.state];
    }
  },
  watch: {
    echoGroupList: {
      handler() {
        this.close();
      },
      deep: true,
    }
  },
  methods: {
    bas(row) {
      if (!row.selected) {
        return true;
      // eslint-disable-next-line no-else-return
      } else {
        return false;
      }
    },
    getFiled() {
      const groupIdList = [];
      this.datas.map(item => {
        groupIdList.push(item.adGroupId);
      });
      return groupIdList;
    },
    getList() {
      const groupList = this.datas.map(item => {
        return {
          groupId: item.adGroupId,
          groupName: item.name
        };
      });
      return groupList;
    },

    close() {
      const arr = this.echoGroupList.map(item => item.groupId);
      const arr2 = [];
      this.datas.map(item => {
        if (!arr.includes(item.adGroupId)) {
          arr2.push(item.adGroupId);
        }
      });
      
      this.data.forEach(item => {
        if (arr2.includes(item.adGroupId)) {
          item.selected = false;
          this.$refs.table1.toggleRowSelection(item, false);
        }
      });
      
      this.datas = this.echoGroupList.length && this.echoGroupList.map(item => {
        return {
          ...item,
          adGroupId: item.groupId,
          name: item.groupName
        };
      }) || [];
    },

    // getMarketplaceList(shopName) {
    //   getMarketplaceList(shopName).then(res => {
    //     if (res.data.code === 200) {
    //       this.marketplaceList = res.data.data.sort((a, b) => b.name.localeCompare(a.name));
    //       this.fromInline.marketplace = res.data.data.length && res.data.data[0].name || '';
    //       this.tableLoading = true;
    //       // this.getCampaignList();
    //     } 
    //   });
    // },
    getCampaignPage() {
      const params = Object.assign({ 
        // marketplace: this.fromInline.marketplace,
        groupName: this.fromInline.name,
        templateId: this.templateId
        // shopName: this.fromInline.shopName,
        // stateList: this.state,
        // automationTemplateId: this.automationRow.id
      }, { current: this.page.currentPage, size: this.page.pageSize, storeId: this.adStoreId });
      const leftDataId = this.datas.length && this.datas.map(item => item.adGroupId) || [];
      getCampaignPage(params).then(res => {
        if (res.data.code === 200) {  
          this.page.total = res.data.data.total;
          this.data = res.data.data.records.map(item => {
            if (leftDataId.includes(item.adGroupId)) {
              item.selected = true;
            }
            return item;
          });
          this.tableLoading = false;
        }
      });
    },
    //pagesize变化
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.tableLoading = true;
      this.getCampaignPage();
    },
    //currentpage 变化
    handleCurrentChange(currentPage) {
      this.page.currentPage = currentPage;  
      this.tableLoading = true;
      this.getCampaignPage();

    },
    selectionChange(list) {
      this.listData = list;
      const arr = this.datas.length && this.datas.map(item => item.adGroupId) || [];
      const leftDataId = list.map(item => item.adGroupId);
      list.map(item => {
        // item.name = this.automationRow.templateName;
        if (!arr.includes(item.adGroupId)) {
          this.datas.unshift(item);
        }
      });
      this.data.forEach(item => {
        if (leftDataId.includes(item.adGroupId)) {
          item.selected = true;
        }
      });
    },
    reset() {
      this.fromInline.name = '';
      this.page.currentPage = 1;
      this.page.pageSize = 20;
      this.getCampaignPage();
    },
    handleSearch() {
      this.tableLoading = true;
      this.getCampaignPage();
    },
    async handleDelet(id) {
      if (id !== 'all') {
        this.datas = this.datas.filter(item => item.adGroupId !== id);
        this.data.forEach(item => {
          if (item.adGroupId === id) {
            item.selected = false;
            // this.$refs.table1.toggleSelection(item, true);
          }
        });
        this.$nextTick(() => {
          this.listData.forEach(row => {
            if (row.adGroupId === id) {
              this.$refs.table1.toggleRowSelection(row, false); 
            }
          });
        });
      } else {
        const leftDataId = this.datas.map(item => item.adGroupId);
        this.data.forEach(item => {
          if (leftDataId.includes(item.adGroupId)) {
            item.selected = false;
            this.$refs.table1.toggleRowSelection(item, false);
          }
        });
        this.datas = await [];
      }
    }
  },
};
</script>
<style lang="scss" scoped>
  ::v-deep .avue-crud__menu {
    min-height: 0px;
  }
  
  .search {
      margin-top: 5px;
      display: flex;
      justify-content:space-between;
      ::v-deep .el-input__inner {
        height: 30px;
      }
  }
  .table2  {
    margin-left: 20px; 
    &.pading {
      // padding: 45px 0px 0px 0px;
      display: flex;
      justify-content:space-between;
      line-height: 40px;
    }
   
  }
</style>
