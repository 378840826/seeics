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
                   v-if="permission.wxconfig_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { getList, getDetail, add, update, remove } from '@/api/plugin/pay/wxconfig';
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
            label: '微信商户号',
            labelWidth: 150,
            prop: 'mchId',
            rules: [{
              required: true,
              message: '请输入微信支付商户号',
              trigger: 'blur'
            }]
          },
          {
            label: '支付密钥',
            labelWidth: 150,
            prop: 'payKey',
            rules: [{
              required: true,
              message: '请输入支付密钥',
              trigger: 'blur'
            }]
          },
          {
            label: '收款名称',
            labelWidth: 150,
            prop: 'payName',
            rules: [{
              required: true,
              message: '请输入收款名称',
              trigger: 'blur'
            }]
          },
          {
            label: 'V3密钥',
            labelWidth: 150,
            prop: 'v3Key',
            rules: [{
              required: true,
              message: '请输入V3密钥',
              trigger: 'blur'
            }]
          },
          {
            label: '支付回调',
            labelWidth: 150,
            tip: '不可包含端口，需外网可访问',
            prop: 'notifyUrl',
            rules: [{
              message: '请输入支付回调的域名',
              trigger: 'blur'
            }]
          },
          {
            label: '退款回调',
            labelWidth: 150,
            tip: '不可包含端口，需外网可访问',
            prop: 'refundNotifyUrl',
            rules: [{
              message: '请输入退款回调的域名',
              trigger: 'blur'
            }]
          },
          {
            label: '状态',
            labelWidth: 150,
            prop: 'status',
            type: 'select',
            dicData: [
              {
                label: '启用',
                value: 1
              },
              {
                label: '关闭',
                value: 0
              }
            ],
            hide: true,
            rules: [{
              required: true,
              message: '请选择状态',
              trigger: 'blur'
            }]
          },
          {
            label: '备注',
            labelWidth: 150,
            prop: 'remark',
            rules: [{
              message: '请输入备注',
              trigger: 'blur'
            }]
          },
          {
            label: 'KEY证书文件',
            labelWidth: 150,
            prop: 'wxPayPrivateKeyFile',
            type: 'upload',
            accept: '.pem',
            drag: true,
            loadText: '证书上传中，请稍等',
            propsHttp: {
              res: 'data',
              url: 'link'
            },
            tip: '请上传微信证书 KEY 文件',
            multiple: false,
            limit: 1,
            action: '/api/blade-resource/oss/endpoint/put-file-attach',
            rules: [{
              required: true,
              message: '请上传微信证书KEY文件',
              trigger: 'blur'
            }]
          },
          {
            label: 'CERT证书文件',
            labelWidth: 150,
            prop: 'wxPayCertFile',
            type: 'upload',
            accept: '.pem',
            drag: true,
            multiple: false,
            limit: 1,
            loadText: '证书上传中，请稍等',
            propsHttp: {
              res: 'data',
              url: 'link'
            },
            tip: '请上传微信证书CERT文件',
            action: '/api/blade-resource/oss/endpoint/put-file-attach',
            rules: [{
              required: true,
              message: '请上传微信证书CERT文件',
              trigger: 'blur'
            }]
          },
          {
            label: 'P12证书文件',
            labelWidth: 150,
            prop: 'wxPayPkCsFile',
            type: 'upload',
            accept: '.p12',
            multiple: false,
            limit: 1,
            drag: true,
            loadText: '证书上传中，请稍等',
            propsHttp: {
              res: 'data',
              url: 'link'
            },
            tip: '请上传微信证书 p12 文件',
            action: '/api/blade-resource/oss/endpoint/put-file-attach',
            rules: [{
              required: true,
              message: '请输入微信证书p12文件',
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
        addBtn: this.vaildData(this.permission.wxconfig_add, false),
        viewBtn: this.vaildData(this.permission.wxconfig_view, false),
        delBtn: this.vaildData(this.permission.wxconfig_delete, false),
        editBtn: this.vaildData(this.permission.wxconfig_edit, false)
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
      row.wxPayPrivateKeyFile = row.wxPayPrivateKeyFile[0].value;
      row.wxPayCertFile = row.wxPayCertFile[0].value;
      row.wxPayPkCsFile = row.wxPayPkCsFile[0].value;
      row.certPem = null;
      row.certPkcs = null;
      row.certPubKey = null;
      row.certPrivateKey = null;
      row.certSerialNo = null;
      row.certPlatSerialNo = null;
      row.privateKey = null;
      row.certPkcsStream = null;
      row.certPubKeyStream = null;
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
      row.certPem = null;
      row.certPkcs = null;
      row.certPubKey = null;
      row.certPrivateKey = null;
      row.certSerialNo = null;
      row.certPlatSerialNo = null;
      row.privateKey = null;
      row.certPkcsStream = null;
      row.certPubKeyStream = null;
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
