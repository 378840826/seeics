<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page.sync="page"
               :permission="permissionList"
               :before-open="beforeOpen"
               v-model="form"
               ref="crud"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @row-del="rowDel"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.order_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot-scope="{row}" slot="status">
        <el-tag v-if="row.status===1" type="success">已支付</el-tag>
        <el-tag v-if="row.status===0" type="danger">未支付</el-tag>
      </template>
      <template slot-scope="{row}" slot="isRefund">
        <el-tag v-if="row.isRefund===1" type="danger">有退款</el-tag>
        <el-tag v-if="row.isRefund===0" type="info">未退款</el-tag>
      </template>
      <template slot-scope="{row}" slot="channel">
        <el-tag>{{row.channel==='wxpay'?'微信支付':'支付宝'}}</el-tag>
      </template>
      <template slot-scope="{row}" slot="payType">
        <el-tag v-if="row.payType==='native'">扫码支付</el-tag>
        <el-tag v-if="row.payType==='jsapi'">公众号支付</el-tag>
        <el-tag v-if="row.payType==='wxapp'">微信小程序</el-tag>
        <el-tag v-if="row.payType==='h5'">H5支付</el-tag>
        <el-tag v-if="row.payType==='app'">APP支付</el-tag>
      </template>
      
    </avue-crud>
  </basic-container>
</template>

<script>
import { getList, getDetail, add, update, remove } from '@/api/plugin/pay/order';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      form: {},
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      option: {
        height: 'auto',
        calcHeight: 30,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        viewBtn: true,
        selection: true,
        dialogClickModal: false,
        column: [
          {
            label: '系统单号',
            prop: 'orderNo',
            rules: [{
              required: true,
              message: '请输入系统单号',
              trigger: 'blur'
            }]
          },
          {
            label: '商品名称',
            prop: 'body',
            rules: [{
              required: true,
              message: '请输入商品名称',
              trigger: 'blur'
            }]
          },
          {
            label: '支付金额',
            prop: 'money',
            rules: [{
              required: true,
              message: '请输入支付金额',
              trigger: 'blur'
            }]
          },
          {
            label: '商户号',
            prop: 'mchId',
            rules: [{
              required: true,
              message: '请输入商户号',
              trigger: 'blur'
            }]
          },
          {
            label: '收款名称',
            prop: 'payName',
            rules: [{
              required: true,
              message: '请输入收款名称',
              trigger: 'blur'
            }]
          },
          {
            label: '支付方式',
            prop: 'payType',
            slot: true,
            rules: [{
              required: true,
              message: '请输入支付方式',
              trigger: 'blur'
            }]
          },
          {
            label: '支付渠道',
            prop: 'channel',
            slot: true,
            rules: [{
              required: true,
              message: '请输入支付渠道',
              trigger: 'blur'
            }]
          },
          {
            label: '买家ID',
            prop: 'buyerId',
            rules: [{
              required: true,
              message: '请输入买家ID',
              trigger: 'blur'
            }]
          },
          {
            label: '支付状态',
            prop: 'status',
            slot: true,
            rules: [{
              required: true,
              message: '请输入0：未支付、1：已支付',
              trigger: 'blur'
            }]
          },
          {
            label: '第三方支付单号',
            prop: 'payNo',
            rules: [{
              required: true,
              message: '请输入第三方支付单号',
              trigger: 'blur'
            }]
          },
          {
            label: '支付时间',
            prop: 'payTime',
            rules: [{
              required: true,
              message: '请输入支付时间',
              trigger: 'blur'
            }]
          },
          {
            label: '是否退款',
            prop: 'isRefund',
            slot: true,
            rules: [{
              required: true,
              message: '请输入是否退款',
              trigger: 'blur'
            }]
          },
          {
            label: '已退款金额',
            prop: 'refundMoney',
            rules: [{
              required: true,
              message: '请输入已退款金额',
              trigger: 'blur'
            }]
          },
          {
            label: '异步回调地址',
            prop: 'notifyUrl',
            rules: [{
              required: true,
              message: '请输入异步回调地址',
              trigger: 'blur'
            }]
          },
          {
            label: '创建时间',
            prop: 'createTime',
            rules: [{
              required: true,
              message: '请输入备注',
              trigger: 'blur'
            }]
          },
        ]
      },
      data: []
    };
  },
  computed: {
    ...mapGetters(['permission']),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.order_add, false),
        viewBtn: this.vaildData(this.permission.order_view, false),
        delBtn: this.vaildData(this.permission.order_delete, false),
        editBtn: this.vaildData(this.permission.order_edit, false)
      };
    },
    ids() {
      const ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(',');
    }
  },
  methods: {
    rowSave(row, done, loading) {
      add(row).then(() => {
        this.onLoad(this.page);
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
        done();
      }, error => {
        loading();
        window.console.log(error);
      });
    },
    rowUpdate(row, index, done, loading) {
      update(row).then(() => {
        this.onLoad(this.page);
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
        done();
      }, error => {
        loading();
        console.log(error);
      });
    },
    rowDel(row) {
      this.$confirm('确定将选择数据删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: 'success',
            message: '操作成功!'
          });
        });
    },
    handleDelete() {
      if (this.selectionList.length === 0) {
        this.$message.warning('请选择至少一条数据');
        return;
      }
      this.$confirm('确定将选择数据删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return remove(this.ids);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: 'success',
            message: '操作成功!'
          });
          this.$refs.crud.toggleSelection();
        });
    },
    beforeOpen(done, type) {
      if (['edit', 'view'].includes(type)) {
        getDetail(this.form.id).then(res => {
          this.form = res.data.data;
        });
      }
      done();
    },
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    currentChange(currentPage){
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize){
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    onLoad(page, params = {}) {
      this.loading = true;
      getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
      });
    }
  }
};
</script>

<style>
</style>
