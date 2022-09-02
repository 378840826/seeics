<!-- 广告管理 -->
<template>
  <basic-container>
    <el-container v-loading="pageLoading">
      <!-- 左侧菜单 -->
      <el-aside class="left-aside">
        <div class="store_time-container">
          <!-- 店铺和时间 -->
          <el-cascader
            :value="[currentStore.storeName, currentStore.adStoreId]"
            :options="$store.state.shop.adCascader"
            :props="{ expandTrigger: 'hover' }"
            @change="handleStoreChange"
            :size="size"
            class="store-cascader"
          />
          <div class="marketplace-time">{{ currentStore.time }}</div>
        </div>
        <!-- 广告活动和 portfolio 标签页切换 -->
        <el-tabs type="border-card" class="left-tabs">
          <el-tab-pane label="广告活动">
            <CampaignTree
              :storeId="currentStore.adStoreId"
              :treeSelectedKey="treeSelectedKey"
              @treeSelect="handleTreeSelect"
              :key="currentStore.adStoreId"
            />
          </el-tab-pane>
          <el-tab-pane label="广告组合">
            <el-input
              placeholder="输入广告组合名称，1-20字符"
              v-model="portfolioAddName"
              maxlength="20"
              class="input-with-select"
              size="mini"
              clearable
            >
              <el-button
                slot="append"
                icon="el-icon-plus"
                @click="handleAddPortfolio"
              >添加</el-button>
            </el-input>
            <div class="tab-pane-roll">
              <ul class="ul-portfolio">
                <li
                  v-for="item in portfolioList"
                  :key="item.id"
                  :class="{ 'selected': item.id === portfolioSelectedId }"
                >
                  <span class="portfolio" @click="() => handleClickPortfolio(item)">
                    {{ item.name }}
                  </span>
                  <i class="el-icon-edit" title="修改" @click="handleClickEditPortfolio(item)" />
                </li>
              </ul>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-aside>
      <el-main class="right-main">
        <el-tabs v-model="tabsActive" @tab-click="handleTabsClick">
          <el-tab-pane
            v-for="item in tabsStateDict[tabsState]"
            :name="item"
            :key="item"
            lazy
          >
            <span slot="label">
              {{ allTabs[item].label }}
              <span class="tabs-cell-count">
                <template v-if="tabsCellCount[allTabs[item].countKey] === undefined || tabsCellCountLoading">
                  (...)
                </template>
                <template v-else>
                  ({{ tabsCellCount[allTabs[item].countKey] }})
                </template>
              </span>
            </span>
            <component
              v-if="currentStore.adStoreId"
              :is="allTabs[item].tabPane"
              :key="currentStore.adStoreId"
              :treeSelectedKey="treeSelectedKey"
              :portfolioId="portfolioSelectedId"
              :marketplace="currentStore.marketplace"
              :currency="currentStore.currency"
              :storeId="currentStore.adStoreId"
              :mwsStoreId="currentStore.mwsStoreId"
            />
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
    
    <!-- 编辑 portfolio 名称弹窗 -->
    <DialogPortfoiloEdit
      :visible="portfolioEdit.visible"
      :portfolioName="portfolioEdit.name"
      @cancel="portfolioEdit.visible = false"
      @save="handleSavePortfolioEdit"
    />

  </basic-container>
</template>

<script>
import {
  // queryPortfolioList,
  addPortfolio,
  updatePortfolio,
  queryTabsCellCount,
} from '@/api/ppc/adManage';
import { log } from '@/util/util';
import DialogPortfoiloEdit from './components/DialogPortfoiloEdit';
import CampaignTree from './components/CampaignTree';
import { parseTreeKey, getMarketplaceTime } from './utils/fun';
import { stateIconDict, tabsStateDict, allTabs } from './utils/dict';
import Campaign from './pages/Campaign';
import Group from './pages/Group';
import Ad from './pages/Ad';
import Keyword from './pages/Keyword';
import Targeting from './pages/Targeting';

export default{
  name: 'adManage',

  components: {
    DialogPortfoiloEdit,
    CampaignTree,
    Campaign,
    Group,
    Ad,
    Keyword,
    Targeting,
  },

  data() {
    return {
      allTabs,
      tabsStateDict,
      stateIconDict,
      size: 'small',
      pageLoading: false,
      // 当前店铺
      currentStore: {
        marketplace: '',
        adStoreId: '',
        currency: '',
        time: '',
      },
      // 广告树选中的节点 key
      treeSelectedKey: '',
      // 广告组合
      portfolioList: [],
      portfolioSelectedId: '',
      portfolioEdit: { visible: false, id: '', name: '', },
      portfolioAddName: '',
      // 右侧标签页
      tabsActive: 'campaign',
      tabsCellCount: {},
      tabsCellCountLoading: false,
      mainPage: '',
    };
  },

  created() {
    this.getShopList();
  },

  computed: {
    // 右侧标签页的状态
    tabsState() {
      const treeSelectedNodeInfo = parseTreeKey(this.treeSelectedKey);
      let state = 'default';
      if (treeSelectedNodeInfo.groupId) {
        state = 'group';
      } else if (treeSelectedNodeInfo.campaignId) {
        state = 'campaign';
      }
      return state;
    },
  },

  methods: {
    // 请求店铺列表
    getShopList() {
      this.pageLoading = true;
      const _this = this;
      this.$store.dispatch('getShopList').finally(() => {
        // 店铺异常时提示
        const confirmOptions = {
          type: 'warning',
          showCancelButton: false,
          showClose: false,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          callback: action => {
            if (action === 'confirm') {
              this.$router.push('/ppc/shop');
            }
          },
        };
        if (!this.$store.state.shop.list || !this.$store.state.shop.list.length) {
          this.$confirm('没有绑定店铺，请前往"我的店铺"进行绑定', '提示', {
            ...confirmOptions,
            confirmButtonText: '去绑定',
          });
          return;
        }
        // 找到第一个有授权广告的店铺作为默认店铺
        const defaultStore = this.$store.state.shop.list.find(shop => shop.adStoreId);
        if (!defaultStore) {
          this.$confirm('没有已授权广告的店铺，请前往"我的店铺"进行授权', '提示', {
            ...confirmOptions,
            confirmButtonText: '去授权',
          });
          return;
        }
        this.currentStore = {
          marketplace: defaultStore.marketplace,
          adStoreId: defaultStore.adStoreId,
          mwsStoreId: defaultStore.id,
          currency: defaultStore.currency,
          time: getMarketplaceTime(defaultStore.timezone),
          storeName: defaultStore.storeName,
        };
        _this.pageLoading = false;
        this.getPortfolioList();
        this.getTabsCellCount();
        // log('store', this.$store.state.shop);
      });
    },

    // 获取标签页数量
    getTabsCellCount() {
      this.tabsCellCountLoading = true;
      const selectedTreeInfo = parseTreeKey(this.treeSelectedKey);
      const params = {
        adStoreId: this.currentStore.adStoreId,
        campaignId: selectedTreeInfo.campaignId,
        groupId: selectedTreeInfo.groupId,
      };
      queryTabsCellCount(params).then(res => {
        // log('请求标签页数量res', res.data.data);
        this.tabsCellCount = res.data.data;
      }).finally(() => {
        this.tabsCellCountLoading = false;
      });
    },

    // 切换店铺
    handleStoreChange(newStore) {
      if (!newStore[1]) {
        this.$message.error('该店铺未授权广告，请前往"我的店铺"进行授权');
        this.currentStore = { ...this.currentStore };
        return;
      }
      // 从店铺列表中找到
      const storeInfo = this.$store.state.shop.storeNameObj[newStore[0]].find(s => s.adStoreId === newStore[1]);
      log('切换店铺', newStore, storeInfo);
      this.currentStore = {
        marketplace: storeInfo.marketplace,
        adStoreId: storeInfo.adStoreId,
        mwsStoreId: storeInfo.id,
        currency: storeInfo.currency,
        time: getMarketplaceTime(storeInfo.timezone),
        storeName: storeInfo.storeName,
      };
    },

    // 广告组合-获取列表
    getPortfolioList() {
      // queryPortfolioList({ storeId: this.currentStore.adStoreId }).then(res => {
      //   this.portfolioList = res.data.data;
      // });
    },

    // 广告组合-点击选中
    handleClickPortfolio(val) {
      log('广告组合点击', val);
      this.portfolioSelectedId = val.id;
      // 取消广告树的选中
      this.treeSelectedKey = null;
    },

    // 广告组合-点击编辑名称
    handleClickEditPortfolio(portfolio) {
      this.portfolioEdit = {
        visible: true,
        ...portfolio,
      };
    },

    // 广告组合-名称修改确定
    handleSavePortfolioEdit(newName) {
      const params = {
        id: this.portfolioEdit.id,
        name: newName,
      };
      updatePortfolio(params).then(() => {
        // 修改页面数据
        for (let i = 0; i < this.portfolioList.length; i++) {
          if (this.portfolioList[i].id === this.portfolioEdit.id) {
            this.portfolioList[i].name = newName;
            break;
          }
        }
        this.portfolioEdit.visible = false;
        // 若是广告活动页，且当前显示的广告活动有属于修改的广告组合的，需要修改广告活动列表数据
      });
    },

    // 广告组合-添加
    handleAddPortfolio() {
      if (this.portfolioAddName === '') {
        this.$message.warning('请输入广告组合名称');
        return;
      }
      addPortfolio({ name: this.portfolioAddName }).then(res => {
        this.portfolioList.unshift(res.data.data);
      });
    },

    // 标签页点击
    // handleTabsClick(tabs) {
    //   console.log('标签页点击', tabs, this.tabsActive);
    // },

    // // 树-切换选中
    // // 切换选中的广告活动或广告组
    // changeTreeSelected(params, scrollTree = false) {
    //   log('changeSelected', params, scrollTree);
    //   // const { tabsState, selectedInfo } = params;
    //   // 根据节点重新加载标签页
    //   // 切换到第一个标签
    //   // 请求各标签显示的数量（只有切换广告活动或广告组时才请求）
    //   // 修改菜单树选中的 key 和广告信息
    //   // 菜单树滚动到选中位置, 在下一个事件循环中执行(先切换了选中再执行滚动)
    //   // scrollTree && setTimeout(scrollTreeToSelected, 0);
    // },

    // 树-树组件切换了选中
    handleTreeSelect(val) {
      this.treeSelectedKey = val.key;
      // 取消广告组合的选中
      this.portfolioSelectedId = '';
    },
  },

  watch: {
    currentStore(_, old) {
      // 非初始化时才需要
      if (old.adStoreId) {
        // 请求广告组合
        this.getPortfolioList();
        // 请求标签页数量
        this.getTabsCellCount();
      }
    },

    tabsState(val) {
      // 切换到第当前状态的一个标签页
      this.tabsActive = tabsStateDict[val][0];
    },
  },
};
</script>

<style scoped lang="scss">
  @import "./index.scss";
</style>
