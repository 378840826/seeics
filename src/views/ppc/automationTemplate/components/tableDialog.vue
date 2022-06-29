<template>
  <div>
    <el-row>
      <el-col :span="8">
        <div class="search">
            <el-select v-model="fromInline.shopName" @change="handelShopChange" style="width: 35%">
              <el-option
                v-for="item in shopList"
                :key="item"
                :value="item"
                :label="item"
              />
            </el-select>
            <el-select 
              @change="getCampaignList()" 
              v-model="fromInline.marketplace" 
              style="width: 25%">
              <el-option
                v-for="item in marketplaceList"
                :key="item.name"
                :value="item.name"
                :label="item.name"
              />
            </el-select>
            <avue-select
                v-model="fromInline.state"
                :dic="stateList"
                placeholder="请选择"
                style="width: 35%"
                :clearable="false"
                @change="getCampaignList()"
            />
        </div>
        <div class="search" >
            <el-input 
              v-model="fromInline.name" 
              placeholder="筛选广告活动"
              style="width: 50%"
            />
            <el-button @click="handleSearch" size="mini">搜索</el-button>
            <el-button @click="reset" size="mini">重置</el-button>
        </div>
      </el-col>
      <el-col :span="15" class="table2 pading">
          <span>已选中{{num}}个广告活动</span>
          <el-button type="text" @click="handleDelet('all')">删除所有</el-button>
      </el-col>
    </el-row>
    <el-row>
    <el-col :span="8">
      
      <avue-crud 
        :option="option" 
        v-model="user"
        :data="data" 
        @selection-change="selectionChange"
        @on-load="getCampaignList"
        ref="table1"
        :table-loading="tableLoading"
      >
    </avue-crud>
    </el-col>
    <el-col :span="15" class="table2">
      <avue-crud 
        :option="options" 
        v-model="user"
        :data="datas" 
      >
        <template slot-scope="{row}" slot="meum">
          <el-button type="text" size="mini" @click="handleDelet(row.campaignId)">删除</el-button>
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
      <div>
        <p>在广告自动化模板下添加广告活动，相当于给广告活动批量设置模板：</p>
        <p>1. 自动化标签、广告位自动化模板，添加广告活动后，每个广告活动都会新增一个自动化标签或广告位自动化规则。</p>
      </div>
  </div>
</template>

<script>
import { 
  getCampaignList,
  getShopNameList,
  getMarketplaceList,
} from '@/api/ppc/automation';
export default {
  name: 'tableDialog',
  props: {
    automationRow: {
      type: Object,
    },
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
            label: '广告活动',
            prop: 'name',
            // sortable: true, //排序
            // width: 400,
            //slot:true
          },
          {
            label: '店铺名称',
            prop: 'shopName',
            // width: 283,
          },
          {
            label: '站点',
            prop: 'marketplace',
            width: 50,
            slot: true,            
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
            label: '广告活动',
            prop: 'name',
          },
          {
            label: '店铺名称',
            prop: 'shopName',
            // width: 283,
          },
          {
            label: '站点',
            prop: 'marketplace',
            // width: 50,
            slot: true,            
          },
          {
            label: '标签名称',
            prop: 'templateName',
            // width: 50,
            slot: true,            
          },
          {
            label: '操作',
            prop: 'meum',
            // width: 50,
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
    };
  },
  mounted() {
    getShopNameList().then(res => {
      this.tableLoading = true;
      if (res.data.code === 200) {
        this.shopList = res.data.data;
        this.fromInline.shopName = res.data.data.length && res.data.data[0] || '';
        this.getMarketplaceList(this.fromInline.shopName);
      }
    });
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
    
  },
  methods: {
    bas(row) {
      if (!row.inCurrentAutomationTemplate) {
        return true;
      // eslint-disable-next-line no-else-return
      } else {
        return false;
      }
    },
    getFiled() {
      const detailDtoList = this.datas.map(item => {
        return {
          campaignId: item.campaignId,
          marketplace: item.marketplace
        };
      });
      const params = {
        id: this.automationRow.id,
        detailDtoList
      };
      return params;
    },
    getMarketplaceList(shopName) {
      getMarketplaceList(shopName).then(res => {
        if (res.data.code === 200) {
          this.marketplaceList = res.data.data.sort((a, b) => b.name.localeCompare(a.name));
          this.fromInline.marketplace = res.data.data.length && res.data.data[0].name || '';
          this.tableLoading = true;
          this.getCampaignList();
        } 
      });
    },
    getCampaignList() {
      const params = Object.assign({ 
        marketplace: this.fromInline.marketplace,
        name: this.fromInline.name,
        shopName: this.fromInline.shopName,
        stateList: this.state,
        automationTemplateId: this.automationRow.id
      }, { current: this.page.currentPage, size: this.page.pageSize });
      const leftDataId = this.datas.length && this.datas.map(item => item.campaignId) || [];
      getCampaignList(params).then(res => {
        if (res.data.code === 200) {
          this.page.total = res.data.data.total;
          this.data = res.data.data.records.map(item => {
            if (leftDataId.includes(item.campaignId)) {
              item.inCurrentAutomationTemplate = true;
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
      this.getCampaignList();
    },
    //currentpage 变化
    handleCurrentChange(currentPage) {
      this.page.currentPage = currentPage;  
      this.tableLoading = true;
      this.getCampaignList();

    },
    selectionChange(list) {
      this.listData = list;
      const arr = this.datas.length && this.datas.map(item => item.campaignId) || [];
      const leftDataId = list.map(item => item.campaignId);
      list.map(item => {
        item.templateName = this.automationRow.templateName;
        if (!arr.includes(item.campaignId)) {
          this.datas.unshift(item);
        }
      });
      this.data.forEach(item => {
        if (leftDataId.includes(item.campaignId)) {
          item.inCurrentAutomationTemplate = true;
        }
      });
    },
    handelShopChange(val) {
      this.fromInline.name = '';
      this.marketplaceList = [];
      this.tableLoading = true;
      this.getMarketplaceList(val);
    },
    reset() {
      this.fromInline.state = 'enabled';
      this.fromInline.shopName = this.shopList[0];
      this.handelShopChange(this.shopList[0]);
      this.page.currentPage = 1;
      this.page.pageSize = 20;
    },
    handleSearch() {
      this.tableLoading = true;
      this.getCampaignList();
    },
    async handleDelet(id) {
      if (id !== 'all') {
        this.datas = this.datas.filter(item => item.campaignId !== id);
        this.data.forEach(item => {
          if (item.campaignId === id) {
            item.inCurrentAutomationTemplate = false;
            // this.$refs.table1.toggleSelection(item, true);
          }
        });
        this.$nextTick(() => {
          this.listData.forEach(row => {
            if (row.campaignId === id) {
              this.$refs.table1.toggleRowSelection(row, false); 
            }
          });
        });
      } else {
        const leftDataId = this.datas.map(item => item.campaignId);
        this.data.forEach(item => {
          if (leftDataId.includes(item.campaignId)) {
            item.inCurrentAutomationTemplate = false;
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
  ::v-deep .el-input__icon {
    line-height: 30px;
  }
  .search {
      margin-top: 10px;
      display: flex;
      justify-content:space-between;
  }
  .table2  {
    margin-left: 20px; 
    &.pading {
      padding: 45px 0px 0px 0px;
      display: flex;
      justify-content:space-between;
      line-height: 40px;
    }
   
  }
</style>
