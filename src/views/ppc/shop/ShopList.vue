<!-- 店铺列表 -->
<template>
  <basic-container>
    <avue-crud
      :data="list"
      :option="tableOption"
      @on-load="getShopList"
      @row-del="handelDelte"
      :table-loading="tableLoading"
    >
      <template slot="menuLeft">
        <el-button
          type="primary"
          size="medium"
          @click="bindShopVisible = true"
        >添加店铺</el-button>
      </template>

      <template slot="dataSync" slot-scope="{ row }">
        <span v-if="!row.dataSync"  class="error">暂停同步</span>
        <span v-else>正常同步</span>
      </template>

      <template slot="createTime" slot-scope="{ row }">
        <div>{{ row.createTime}}</div>
        <span v-if="row.validityDays < 0" class="error">
          <i class="el-icon-error" />
          授权已过期，请更新授权(编辑-更新授权)
        </span>
        <span v-else-if="row.validityDays <= 30" class="warning">
          <i class="el-icon-warning" />
          {{ row.validityDays }}天后过期，请及时更新授权
        </span>
      </template>

      <template slot="bindAdStore" slot-scope="{ row }">
        <el-button
          v-if="row.bindAdStore"
          type="primary"
          size="mini"
          @click="handleCancelAdAuthorize(row)"
          >取消授权</el-button>
        <el-button
          v-else
          type="primary"
          size="mini"
          @click="handleClickAuthorize(row)"
        >去授权</el-button>
      </template>

      <template slot-scope="{row,index}" slot="menu">
        <div class="table-menu">
          <el-button
            v-if="row.dataSync"
            type="danger"
            size="small"
            plain
            @click="handleClickSync(row, !row.dataSync)"
          >
            暂停同步
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            plain
            @click="handleClickSync(row, !row.dataSync)"
          >
            同步
          </el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            plain
            @click="handleClickEditBtn(row, index)"
          >
            编辑
          </el-button>
          <el-button type="danger"
            icon="el-icon-delete"
            size="small"
            plain
            @click.stop="handelDelte(row)"
          >
            解绑
          </el-button>
        </div>
      </template>
    </avue-crud>

  <!-- 店铺绑定弹窗 -->
    <el-dialog
      title="店铺授权"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :visible.sync="bindShopVisible"
      :append-to-body="true"
    >
      <ShopBind
        :onClose="handleBindShopClose"
        :onOk="handleBindShopOk"
        :editShopData="editShopData"
      />
    </el-dialog>

    <!-- 广告授权弹窗 -->
    <el-dialog
      :title="authorizeState.shop.marketplace + '-' + authorizeState.shop.storeName + '广告授权'"
      :visible.sync="authorizeState.visible"
      :append-to-body="true"
    >
      <div>
        <p>1. 点击【开始授权】将跳转到亚马逊登录页面，请在授权店铺主账号的常用环境操作，以免关联；</p>
        <p>2. 授权前请将后台页面切换到对应的站点；</p>
        <p>3. 亚马逊官方支持北美、欧洲、日本、澳洲、印度及阿联酋站；</p>
        <p>3. 授权成功后，系统将会：
          <ul>
            <li>获取您的广告数据</li>
            <li>支持您在系统进行广告活动数据操作</li>
            <li>亚马逊广告相关业绩数据的访问权限</li>
          </ul>
        </p>
        <div class="shop_info">
          <div>店铺名称：{{ authorizeState.shop.storeName }}</div>
          <div>地区站点：{{ authorizeState.shop.marketplace }}</div>
          <div>账号类型：卖家账号</div>
          <div class="checked_ip">
            <el-checkbox v-model="authorizeState.checkedIP">
              我已确认目前是在
              {{authorizeState.shop.marketplace + '-' + authorizeState.shop.storeName}}
              店铺的常用电脑上操作
            </el-checkbox>
            <i v-show="!authorizeState.checkedIP" class="el-icon-warning danger" title="请勾选确认框" />
          </div>
        </div>
      </div>
      <span slot="footer">
        <el-button
          @click="authorizeState.visible = false
        ">取 消</el-button>
        <el-button
          type="primary"
          @click="handleAuthorize"
          :disabled="!authorizeState.checkedIP"
        >开始授权</el-button>
      </span>
    </el-dialog>

  </basic-container>
</template>

<script>
import ShopBind from './ShopBind';
import dayjs from 'dayjs';
import { marketplacesRegion } from './utils';

// 表格配置
const tableOption = {
  emptyText: '未绑定店铺，请点击上方添加店铺按钮完成绑定。',
  delBtn: false,
  addBtn: false,
  editBtn: false,
  border: true,
  cellBtn: true,
  refreshBtn: false,
  columnBtn: false,
  height: 'calc(100vh - 200px)',
  menuWidth: 300,
  column: [
    {
      label: '站点',
      prop: 'marketplace',
      disabled: true,
    }, {
      label: '店铺名称',
      prop: 'storeName',
      rules: [{
        validator: (_, value, callback) => {
          const storeName = value.replace(/(^\s*)|(\s*$)/g, '');
          if (storeName === '') {
            callback(new Error('请输店铺名称'));
          } else if (storeName.length > 20) {
            callback(new Error('店铺名称最多20个字符'));
          } else {
            callback();
          }
        },
        trigger: 'blur',
      }],
    }, {
      label: 'Seller ID',
      prop: 'sellerId',
      disabled: true,
      editDisplay: false,
    }, {
      label: '店铺状态',
      prop: 'dataSync',
      align: 'center',
      disabled: true,
      editDisplay: false,
    }, {
      label: '广告授权',
      prop: 'bindAdStore',
      align: 'center',
      disabled: true,
      editDisplay: false,
    }, {
      label: '店铺授权时间',
      prop: 'createTime',
      align: 'center',
      disabled: true,
      editDisplay: false,
    },
  ],
};

const addAmazonSdk = () => {
  const amazonRoot = document.createElement('div');
  amazonRoot.id = 'amazon-root';
  document.body.appendChild(amazonRoot);
  window.onAmazonLoginReady = function () {
    window.amazon.Login.setClientId('amzn1.application-oa2-client.f5629ca0717645ac8ed861a8408327aa');
  };
  (function (document) {
    const a = document.createElement('script');
    a.type = 'text/javascript';
    a.async = true;
    a.id = 'amazon-login-sdk';
    a.src = 'https://api-cdn.amazon.com/sdk/login1.js';
    document.getElementById('amazon-root').appendChild(a);
  })(window.document);
};

export default {
  name: 'ShopList',

  components: {
    ShopBind,
  },

  data() {
    return {
      data: [],
      tableOption,
      tableLoading: false,
      bindShopVisible: false,
      editShopData: {},
      authorizeState: {
        visible: false,
        checkedIP: false,
        shop: {},
      },
    };
  },

  computed: {
    list() {
      // 计算店铺授权到期天数
      const list = this.$store.state.shop.list;
      list.forEach(shop => {
        if (shop.refreshExpiresIn) {
          const refreshExpiresIn = shop.refreshExpiresIn ? dayjs(shop.refreshExpiresIn) : null;
          const expires = dayjs(refreshExpiresIn);
          const nowDate = dayjs();
          // 距离到期的天数
          let validityDays = expires.diff(nowDate, 'day');
          // 如个是今天到期，判断是否已经到期
          if (validityDays === 0 && expires.isBefore(nowDate)) {
            // 如果已经到期，设到期天数为 -1
            validityDays = validityDays - 1;
          }
          shop.validityDays = validityDays;
        }
      });
      return list;
    },
  },

  mounted() {
    addAmazonSdk();
  },

  methods: {
    getShopList() {
      this.tableLoading = true;
      const _this = this;
      // filterByUser 获取当前账号绑定的店铺
      this.$store.dispatch('getShopList', { filterByUser: true }).finally(() => {
        _this.tableLoading = false;
      });
    },

    // 点击广告授权
    handleClickAuthorize(row) {
      this.authorizeState = {
        visible: true,
        checkedIP: false,
        shop: { ...row },
      };
    },

    // 开始广告授权
    handleAuthorize() {
      const options = {
        scope: 'advertising::campaign_management',
        response_type: 'code',
      };
      const region = marketplacesRegion[this.authorizeState.shop.marketplace];
      window.amazon.Login.setRegion(window.amazon.Login.Region[region]);
      // 跳转登录亚马逊
      window.amazon.Login.authorize(options, (response) => {
        if (response.error) {
          alert(`oauth error: ${response.error}`);
          return;
        }
        // 亚马逊登录成功, 请求添加店铺广告授权
        this.$store.dispatch('adAuthorize', {
          shop: { ...this.authorizeState.shop },
          code: response.code,
        }).then(res => {
          this.$message({
            type: 'success',
            message: res.data.msg || '操作成功',
          });
          this.authorizeState.visible = false;
          this.getShopList();
        });
      });
    },

    // 取消广告授权
    handleCancelAdAuthorize(row) {
      this.$confirm(`确定取消店铺 ${row.marketplace} ${row.storeName} 的广告授权？`, '店铺操作', {
        type: 'warning',
        callback: action => {
          if (action !== 'confirm') {
            return;
          }
          this.$store.dispatch('cancelAdAuthorize', {
            ...row, bindAdStore: false, adStoreId: null,
          }).then(res => {
            this.$message({
              type: 'success',
              message: res.data.msg || '操作成功',
            });
          }, error => {
            window.console.log('取消广告授权 error', error, row);
          });
        }
      });
    },

    handleClickEditBtn(row) {
      this.editShopData = row;
      this.bindShopVisible = true;
    },

    handelDelte(row) {
      this.$confirm('解绑将清除该账号的所有数据，确定解绑？', '店铺操作', {
        type: 'warning',
        confirmButtonText: '解绑',
        confirmButtonClass: '_sy-unbind_shop-confirm_btn',
        callback: action => {
          if (action !== 'confirm') {
            return;
          }
          this.$store.dispatch('unbindShop', { shop: row }).then(res => {
            this.$message({
              type: 'success',
              message: res.data.msg || '操作成功',
            });
          });
        }
      });
    },

    handleBindShopClose() {
      this.bindShopVisible = false;
      this.editShopData = {};
    },

    handleBindShopOk() {
      this.bindShopVisible = false;
      this.editShopData = {};
    },

    // 开启/关闭 店铺同步开关
    setSync(row) {
      this.tableLoading = true;
      const _this = this;
      this.$store.dispatch('setSyncSwitch', row).then(r => {
        this.$message.success(r.data.msg || '操作成功');
      }).finally(() => {
        _this.tableLoading = false;
      });
    },

    // 点击同步开关
    handleClickSync(row, sync) {
      if (sync === false) {
        this.$confirm('确定暂停同步？', {
          type: 'warning',
          callback: action => {
            if (action !== 'confirm') {
              return;
            }
            this.setSync({ ...row, dataSync: sync });
          }
        });
      } else {
        this.setSync({ ...row, dataSync: sync });
      }
    },
  },
};
</script>

<style>
._sy-unbind_shop-confirm_btn {
  background: #F56C6C !important;
  border-color: #F56C6C !important;;
}
</style>

<style scoped>
.authorize-confirm-model {
  width: 550px;
}

.el-icon-error,
.error,
.danger {
  color: #F56C6C;
}

.warning {
  color: #E6A23C;
}

.shop_info {
  padding: 20px;
  background: #f0f0f0;
}

.checked_ip {
  margin-top: 10px;
}

.table-menu {
  display: flex;
  justify-content: center;
}

</style>
