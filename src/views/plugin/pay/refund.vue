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
                   v-if="permission.refund_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { getList, getDetail, add, update, remove } from '@/api/plugin/pay/refund';
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
            label: 'id',
            prop: 'id',
            rules: [{
              required: true,
              message: '请输入',
              trigger: 'blur'
            }]
          },
          {
            label: '退款单号',
            prop: 'refundNo',
            rules: [{
              required: true,
              message: '请输入退款单号',
              trigger: 'blur'
            }]
          },
          {
            label: '业务订单',
            prop: 'orderNo',
            rules: [{
              required: true,
              message: '请输入业务订单',
              trigger: 'blur'
            }]
          },
          {
            label: '支付单号',
            prop: 'payNo',
            rules: [{
              required: true,
              message: '请输入支付单号',
              trigger: 'blur'
            }]
          },
          {
            label: '退款商户',
            prop: 'refundMchId',
            rules: [{
              required: true,
              message: '请输入退款商户',
              trigger: 'blur'
            }]
          },
          {
            label: '退款金额',
            prop: 'refundMoney',
            rules: [{
              required: true,
              message: '请输入退款金额',
              trigger: 'blur'
            }]
          },
          {
            label: '退款原因',
            prop: 'refundDesc',
            rules: [{
              required: true,
              message: '请输入退款原因',
              trigger: 'blur'
            }]
          },
          {
            label: '退款状态',
            prop: 'refundStatus',
            rules: [{
              required: true,
              message: '请输入退款状态 -1：退款失败 0：已发起 1：退款成功',
              trigger: 'blur'
            }]
          },
          {
            label: '退款回调地址 ',
            prop: 'notifyUrl',
            rules: [{
              required: true,
              message: '请输入退款回调地址 ',
              trigger: 'blur'
            }]
          },
          {
            label: '备注',
            prop: 'remark',
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
        addBtn: this.vaildData(this.permission.refund_add, false),
        viewBtn: this.vaildData(this.permission.refund_view, false),
        delBtn: this.vaildData(this.permission.refund_delete, false),
        editBtn: this.vaildData(this.permission.refund_edit, false)
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
