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
                   v-if="permission.aliconfig_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>

      <template slot="privateKey" slot-scope="scope" >
        {{scope.row.privateKey}}
      </template>

      <template slot="appCert" slot-scope="scope" >
        {{scope.row.appCert}}
      </template>

      <template slot="alipayPubCert" slot-scope="scope" >
        {{scope.row.alipayPubCert}}
      </template>

      <template slot="rootCert" slot-scope="scope" >
        {{scope.row.rootCert}}
      </template>

    </avue-crud>
  </basic-container>
</template>

<script>
import { getList, getDetail, add, update, remove } from '@/api/plugin/pay/aliconfig';
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
            label: '支付宝商户号',
            labelWidth: 150,
            prop: 'mchId',
            placeholder: '请输入2088开头的支付宝商户号',
            rules: [{
              required: true,
              message: '请输入2088开头的支付宝商户号',
              trigger: 'blur'
            }]
          },
          {
            label: '支付宝应用ID',
            labelWidth: 150,
            prop: 'appId',
            placeholder: '请输入支付宝应用ID',
            rules: [{
              required: true,
              message: '请输入支付宝应用ID',
              trigger: 'blur'
            }]
          },
          {
            label: '支付宝账户',
            labelWidth: 150,
            prop: 'account',
            placeholder: '请输入支付宝账户',
            rules: [{
              required: true,
              message: '请输入支付宝账户',
              trigger: 'blur'
            }]
          },
          {
            label: '收款名称',
            labelWidth: 150,
            prop: 'payName',
            placeholder: '请输入收款名称',
            rules: [{
              required: true,
              message: '请输入收款名称',
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
            label: '应用私钥',
            labelWidth: 150,
            prop: 'privateKey',
            overHidden: true,
            slot: true,
            type: 'upload',
            accept: '.txt',
            drag: true,
            loadText: '证书上传中，请稍等',
            propsHttp: {
              res: 'data',
              url: 'link'
            },
            tip: '支付宝开发者工具生成的私钥，CSR文件夹下的域名_私钥.txt',
            multiple: false,
            limit: 1,
            action: '/api/blade-resource/oss/endpoint/put-file-attach',
            rules: [{
              required: true,
              message: '请上传应用私钥txt文件',
              trigger: 'blur'
            }]
          },
          {
            label: '应用证书',
            labelWidth: 150,
            prop: 'appCert',
            type: 'upload',
            overHidden: true,
            slot: true,
            accept: '.crt',
            drag: true,
            loadText: '证书上传中，请稍等',
            propsHttp: {
              res: 'data',
              url: 'link'
            },
            tip: '从支付宝开放平台下载的支付宝根证书文件，文件名默认为：appCertPublicKey_你的APPID.crt',
            multiple: false,
            limit: 1,
            action: '/api/blade-resource/oss/endpoint/put-file-attach',
            rules: [{
              required: true,
              message: '请上传应用证书crt文件',
              trigger: 'blur'
            }]
          },
          {
            label: '支付宝公钥证书',
            labelWidth: 150,
            prop: 'alipayPubCert',
            type: 'upload',
            overHidden: true,
            slot: true,
            accept: '.crt',
            drag: true,
            multiple: false,
            limit: 1,
            loadText: '证书上传中，请稍等',
            propsHttp: {
              res: 'data',
              url: 'link'
            },
            tip: '从支付宝开放平台下载的支付宝根证书文件，文件名默认为：alipayCertPublicKey_RSA2.crt',
            action: '/api/blade-resource/oss/endpoint/put-file-attach',
            rules: [{
              required: true,
              message: '请上传支付宝公钥证书crt文件',
              trigger: 'blur'
            }]
          },
          {
            label: '支付宝根证书',
            labelWidth: 150,
            prop: 'rootCert',
            type: 'upload',
            overHidden: true,
            slot: true,
            accept: '.crt',
            multiple: false,
            limit: 1,
            drag: true,
            loadText: '证书上传中，请稍等',
            propsHttp: {
              res: 'data',
              url: 'link'
            },
            tip: '从支付宝开放平台下载的支付宝根证书文件，文件名默认为：alipayRootCert.crt',
            action: '/api/blade-resource/oss/endpoint/put-file-attach',
            rules: [{
              required: true,
              message: '请输入支付宝根证书crt文件',
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
        addBtn: this.vaildData(this.permission.aliconfig_add, false),
        viewBtn: this.vaildData(this.permission.aliconfig_view, false),
        delBtn: this.vaildData(this.permission.aliconfig_delete, false),
        editBtn: this.vaildData(this.permission.aliconfig_edit, false)
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
      row.privateKeyUrl = row.privateKey[0].value;
      row.appCertUrl = row.appCert[0].value;
      row.aliPayPubCertUrl = row.alipayPubCert[0].value;
      row.aliPayRootCertUrl = row.rootCert[0].value;
      row.privateKey = null;
      row.appCert = null;
      row.alipayPubCert = null;
      row.rootCert = null;
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
      row.privateKey = null;
      row.appCert = null;
      row.alipayPubCert = null;
      row.rootCert = null;
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
