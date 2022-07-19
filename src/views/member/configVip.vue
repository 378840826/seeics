<template>
  <basic-container>
    <!-- <avue-crud
      :option="option"
      :data="data"
     
      @on-load="queryIndentPage"
    ></avue-crud> -->
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="功能"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="普通会员"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="VIP">
      </el-table-column>
      <el-table-column
        prop="address"
        label="高级VIP">
      </el-table-column>
      <el-table-column
        prop="address"
        label="至尊VIP">
      </el-table-column>
      <el-table-column
        prop="address"
        label="企业会员">
      </el-table-column>
    </el-table>
  </basic-container>
</template>

<script>
import { buyInfo, buyPage } from '@/api/member/member';

export default {
  data() {
    return {
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
        delBtn: false,
        menu: false,
        editBtn: false,
        align: 'center',
        menuAlign: 'left',
        rowKey: 'id',
        height: 300,
        // selection: true,
        tip: false,
        column: [
          {
            label: '付款时间',
            prop: 'payTime',
          },
          {
            label: '订单号',
            prop: 'code',
          },
          {
            label: '订单详情',
            prop: 'itemName',
          },
          {
            label: '支付方式',
            prop: 'payType',
          },
          {
            label: '支付金额(￥)',
            prop: 'payAmount',
          },
        ],
      },
      // page: {
      //   total: 0,
      //   currentPage: 1,
      //   layout: 'total, sizes, prev, pager, next, jumper',
      //   pageSize: 20,
      //   pageSizes: [20, 50, 100],
      // },
    };
  },
  mounted() {
    buyInfo().then(res => {
      console.log(res)
    });
    
  },
  methods: {
    buyPage() {
      buyPage({ current: 1, size: 20, levelType: 1 }).then(res => {
        this.data = res.data.data.records
      });
    }
  }
};
</script>
