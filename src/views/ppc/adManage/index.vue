<!-- 广告管理 -->
<template>
  <basic-container :class="treeSelectedInfo.campaignId && 'has-path_crumbs'">
    <el-container v-loading="pageLoading">
      <!-- 左侧菜单 -->
      <el-aside 
        v-show="!isLeftMenuCollapse" 
        class="left-aside" 
        :class="{ 'has-path_crumbs': treeSelectedInfo.campaignId }"
      >
        <div class="store_time-container">
          <!-- 店铺和时间 -->
          <el-cascader
            :value="[currentStore.storeName, currentStore.adStoreId]"
            :options="$store.state.shop.adCascader"
            :props="{ expandTrigger: 'hover' }"
            @change="handleStoreChange"
            :size="size"
            class="store-cascader"
            popper-class="_ad_mamage-store-cascader-popper"
          >
           <template slot-scope="{ data }">
            <span>{{ data.label }}</span>
            <span v-if="data.disabled"> (<el-button type="text" @click="handleToAuthorize">去授权</el-button>)</span>
          </template>
          </el-cascader>
          <div class="marketplace-time">{{ currentStore.timezone && getMarketplaceTime(currentStore.timezone) }}</div>
        </div>
        <!-- 广告活动和 portfolio 标签页切换 -->
        <el-tabs type="border-card" class="left-tabs" v-model="activeTreeTabsName">
          <el-tab-pane label="广告活动" name="stateTree">
            <CampaignTree
              ref="refTree"
              :storeId="currentStore.adStoreId"
              :treeSelectedKey="treeSelectedKey"
              @treeSelect="handleTreeSelect"
              :key="currentStore.adStoreId"
            />
          </el-tab-pane>
          <el-tab-pane label="广告组合" name="portfolioTree">
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
              <PortfolioCampaignTree
                v-if="portfolioList.length"
                :key="portfolioList"
                :storeId="currentStore.adStoreId"
                :portfolioList="portfolioList"
                :treeSelectedKey="treeSelectedKey"
                @treeSelect="handleTreeSelect"
                @saveEditName="handleSavePortfolioEdit"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
        <!-- 主页按钮 -->
        <div class="btn-home" @click="handleClickHome">
          <i class="el-icon-s-home"></i>
        </div>
      </el-aside>
      <el-main class="right-main">
        <!-- 面包屑导航 -->
        <PathCrumbs
          v-if="treeSelectedInfo.campaignId"
          :storeInfo="currentStore"
          :treeSelectedInfo="treeSelectedInfo"
          @jump="handleClickPathCrumbs"
        />
        <!-- 各列表 -->
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
                <!-- 不显示数量的页面 -->
                <template v-if="['searchTerm', 'placement'].includes(item)">
                </template>
                <template v-else-if="tabsCellCount[allTabs[item].countKey] === undefined || tabsCellCountLoading">
                  (...)
                </template>
                <template v-else>
                  ({{ tabsCellCount[allTabs[item].countKey] }})
                </template>
              </span>
            </span>
            <component
              v-if="currentStore.adStoreId"
              ref="refTabPane"
              :is="allTabs[item].tabPane"
              :key="currentStore.adStoreId"
              :treeSelectedKey="treeSelectedKey"
              :portfolioList="portfolioList"
              :marketplace="currentStore.marketplace"
              :currency="currentStore.currency"
              :storeId="currentStore.adStoreId"
              :mwsStoreId="currentStore.mwsStoreId"
              @updateStateTree="handleUpdateStateTree"
              @createSuccess="reloadTabPan"
              @changeTreeCampaignState="changeTreeCampaignState"
              @changeTreeSelected="changeTreeSelected"
            />
          </el-tab-pane>
        </el-tabs>
        <!-- 展开/收起左侧菜单按钮 -->
        <div
          class="btn-collapse"
          :class="{ collapse: isLeftMenuCollapse }"
          @click="isLeftMenuCollapse = !isLeftMenuCollapse"
          title="收起/展开左侧菜单"
        >
          <i :class="isLeftMenuCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
          <div v-if="isLeftMenuCollapse">展开</div>
          <div v-else>收起</div>
        </div>
      </el-main>
    </el-container>
    
  </basic-container>
</template>

<script>
import {
  queryPortfolioList,
  addPortfolio,
  updatePortfolio,
  queryTabsCellCount,
} from '@/api/ppc/adManage';
// import { log } from '@/util/util';
import { setStore, getStore } from '@/util/store';
import PathCrumbs from './components/PathCrumbs';
import CampaignTree from './components/CampaignTree';
import PortfolioCampaignTree from './components/PortfolioCampaignTree';
import { parseTreeKey, getMarketplaceTime } from './utils/fun';
import { stateIconDict, tabsStateDict, allTabs } from './utils/dict';
import { currentShopKey } from './utils/options';
import Campaign from './pages/Campaign';
import Group from './pages/Group';
import Placement from './pages/Placement';
import Ad from './pages/Ad';
import Keyword from './pages/Keyword';
import Targeting from './pages/Targeting';
import TargetingGroups from './pages/TargetingGroups';
import NegativeKeyword from './pages/NegativeKeyword';
import NegativeTargeting from './pages/NegativeTargeting';
import SearchTerm from './pages/SearchTerm';

export default{
  name: 'adManage',

  components: {
    PathCrumbs,
    CampaignTree,
    PortfolioCampaignTree,
    Campaign,
    Group,
    Placement,
    Ad,
    Keyword,
    Targeting,
    TargetingGroups,
    NegativeKeyword,
    NegativeTargeting,
    SearchTerm,
  },

  data() {
    return {
      allTabs,
      tabsStateDict,
      stateIconDict,
      size: 'small',
      getMarketplaceTime,
      pageLoading: false,
      // 左侧菜单收起
      isLeftMenuCollapse: false,
      // 当前店铺
      currentStore: {
        marketplace: '',
        adStoreId: '',
        mwsStoreId: '',
        currency: '',
        timezone: '',
        storeName: '',
      },
      activeTreeTabsName: 'stateTree',
      // 广告树选中的节点 key
      treeSelectedKey: '',
      // 广告树选中的全部信息
      treeSelectedInfo: {},
      // 广告组合
      portfolioList: [],
      portfolioAddName: '',
      // 右侧标签页
      tabsActive: 'campaign',
      tabsCellCount: {},
      tabsCellCountLoading: false,
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
        // 区分关键词广告组和targeting广告组
        state = `${treeSelectedNodeInfo.groupType}Group`;
        // 区分自动广告组，不显示 关键词和分类/商品投放
        if (treeSelectedNodeInfo.targetingType === 'auto') {
          const upper = `${state[0].toUpperCase()}${state.substr(1)}`;
          state = `auto${upper}`;
        }
      } else if (treeSelectedNodeInfo.campaignId) {
        // 区分自动广告活动，不显示 关键词和分类/商品投放
        if (treeSelectedNodeInfo.targetingType === 'auto') {
          state = 'autoCampaign';
        } else {
          state = 'campaign';
        }
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
        // 查询 localStorage 中的店铺选中数据
        const localStorageCurrentShop = getStore({ name: currentShopKey });
        if (localStorageCurrentShop) {
          this.currentStore = { ...localStorageCurrentShop };
          // 由于前期失误直接保存了 time 导致页面直接使用了上次保存的旧时间，需要增加 timezone 字段用于重新计算时间, 后期删除
          if (!localStorageCurrentShop.timezone) {
            const storeList = this.$store.state.shop.storeNameObj[localStorageCurrentShop.storeName];
            const store = storeList.find(item => item.adStoreId === localStorageCurrentShop.adStoreId);
            this.currentStore.timezone = store.timezone;
          }
        } else {
          // 如果 localStorage 没有数据，找到第一个有授权广告的店铺作为默认店铺
          let defaultStore;
          for (let index = 0; index < this.$store.state.shop.adCascader.length; index++) {
            const cascaderItem = this.$store.state.shop.adCascader[index];
            const firstAdStore = cascaderItem.children.find(item => item.adStoreId);
            if (firstAdStore) {
              defaultStore = firstAdStore;
              break;
            }
          }
          if (!defaultStore) {
            this.$confirm('没有已授权广告的店铺，请前往"我的店铺"进行授权', '提示', {
              ...confirmOptions,
              confirmButtonText: '去授权',
            });
            return;
          }
          const currentStore = {
            marketplace: defaultStore.marketplace,
            adStoreId: defaultStore.adStoreId,
            mwsStoreId: defaultStore.id,
            currency: defaultStore.currency,
            timezone: defaultStore.timezone,
            storeName: defaultStore.storeName,
          };
          this.currentStore = { ...currentStore };
          // 保存在 localStorage
          setStore({ name: currentShopKey, content: currentStore });
        }
        _this.pageLoading = false;
        this.getPortfolioList();
        this.getTabsCellCount();
      });
    },

    // 获取标签页数量
    getTabsCellCount() {
      this.tabsCellCountLoading = true;
      const selectedTreeInfo = parseTreeKey(this.treeSelectedKey);
      const params = {
        adStoreId: this.currentStore.adStoreId,
        portfolioId: selectedTreeInfo.portfolioId,
        campaignId: selectedTreeInfo.campaignId,
        groupId: selectedTreeInfo.groupId,
      };
      queryTabsCellCount(params).then(res => {
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
      const currentStore = {
        marketplace: storeInfo.marketplace,
        adStoreId: storeInfo.adStoreId,
        mwsStoreId: storeInfo.id,
        currency: storeInfo.currency,
        timezone: storeInfo.timezone,
        storeName: storeInfo.storeName,
      };
      this.currentStore = { ...currentStore };
      // 存储 localStorage
      setStore({ name: currentShopKey, content: currentStore });
    },

    // 点击去授权
    handleToAuthorize() {
      this.$router.push('/ppc/shop');
    },

    // 广告组合-获取列表
    getPortfolioList() {
      queryPortfolioList({ adStoreId: this.currentStore.adStoreId }).then(res => {
        this.portfolioList = res.data.data;
      });
    },

    // 广告组合-名称修改确定
    handleSavePortfolioEdit(data, callback) {
      const { id, name: newName } = data;
      const params = {
        adStoreId: this.currentStore.adStoreId,
        portfolioId: id,
        name: newName,
      };
      updatePortfolio(params).then(() => {
        // 修改页面数据
        for (let i = 0; i < this.portfolioList.length; i++) {
          if (this.portfolioList[i].id === id) {
            this.portfolioList[i].name = newName;
            break;
          }
        }
        this.$message.success('操作成功');
        // 若是广告活动页，且当前显示的广告活动有属于修改的广告组合的，需要修改广告活动列表数据
        this.$refs.refTabPane[0].updatePortfolio({ id, newName });
      }).catch(() => {
        callback(false);
      });
    },

    // 广告组合-添加
    handleAddPortfolio() {
      if (this.portfolioAddName === '') {
        this.$message.warning('请输入广告组合名称');
        return;
      }
      // 判断是否有相同的名称
      const duplicateName = this.portfolioList.find(item => item.name === this.portfolioAddName);
      if (duplicateName) {
        this.$message.warning('广告组合名称已存在，请重新输入');
        return;
      }
      const params = {
        adStoreId: this.currentStore.adStoreId,
        name: this.portfolioAddName,
      };
      addPortfolio(params).then(res => {
        const newList = [...this.portfolioList];
        newList.unshift(res.data.data);
        this.portfolioList = newList;
        this.$message.success('操作成功');
      });
    },

    // 树-树组件切换了选中
    handleTreeSelect(val) {
      this.treeSelectedInfo = { ...val };
      this.treeSelectedKey = val.key;
      // 请求标签页数量
      this.getTabsCellCount();
    },

    // 树-刷新节点（因在列表中修改了广告活动/广告组的状态，需要刷新部分树节点）
    handleUpdateStateTree(val) {
      const { type, newState, list } = val;
      // 广告活动
      if (type === 'campaign') {
        const oldKeyList = [];
        list.forEach(item => {
          oldKeyList.push(`${item.state}-${item.id}-${item.targetingType}`);
        });
        // 更新树节点
        oldKeyList.forEach(key => {
          const newParentKey = newState;
          this.$refs.refTree.updateCampaignState(key, newParentKey);
        });
      } else if (type === 'group') {
        // 广告组
        const oldKeyList = [];
        list.forEach(item => {
          oldKeyList.push(`${item.campaignState}-${item.campaignId}-${item.campaignTargetType}-${item.id}-${item.groupType}`);
        });
        // 更新广告组树节点
        oldKeyList.forEach(key => {
          const newData = { state: newState };
          this.$refs.refTree.updateGroupDate(key, newData);
        });
      }
    },

    // 树-切换选中的状态节点
    changeTreeCampaignState(state) {
      // 广告活动的状态筛选为多选，需要判断，单选时正常赋值，多选时清空
      if (!state || state.length > 1) {
        this.treeSelectedKey = null;
      } else {
        this.treeSelectedKey = state[0];
      }
    },

    // 树切换选中的节点(用于广告活动、广告组名称点击)
    changeTreeSelected(val) {
      // 区分要同步到状态树还是组合树
      // 如果当前选中了其中一棵树的节点，那就同步到这棵树，如果没有选中的树，就看哪一棵树 active
      const selectedTreeInfo = parseTreeKey(this.treeSelectedKey);
      let key = val.key;
      if (selectedTreeInfo.portfolioId) {
        // 同步到组合树
        const arr = key.split('-');
        key = `${selectedTreeInfo.portfolioId}-${arr.slice(1).join('-')}`;
      }
      val.key = key;
      this.treeSelectedKey = key;
      this.treeSelectedInfo = { ...val };
      // 请求标签页数量
      this.getTabsCellCount();
    },

    // 点击主页按钮
    handleClickHome() {
      // 重置广告树
      this.treeSelectedKey = null;
      this.treeSelectedInfo = {};
      this.activeTreeTabsName = 'stateTree';
      // 请求广告组合
      this.getPortfolioList();
      // 请求标签页数量
      this.getTabsCellCount();
    },

    // 面包屑导航点击
    handleClickPathCrumbs(val) {
      if (val.storeName) {
        // 点击店铺，触发 currentStore watch
        this.currentStore = { ...this.currentStore };
      } else if (val.campaignName) {
        // 点击广告活动，触发树组件选中，区分状态树和组合树
        let newTreeSelectedInfo = {};
        if (this.treeSelectedInfo.portfolioId) {
          // 选中组合树时生成的面包屑
          newTreeSelectedInfo = {
            ...this.treeSelectedInfo,
            key: `${this.treeSelectedInfo.portfolioId}-${val.campaignId}-${val.targetingType}`,
            name: this.treeSelectedInfo.campaignName,
            isLeaf: false,
          };
        } else {
          // 选中状态树时生成的面包屑
          newTreeSelectedInfo = {
            ...this.treeSelectedInfo,
            key: `${this.treeSelectedInfo.campaignState}-${val.campaignId}-${val.targetingType}`,
            name: this.treeSelectedInfo.campaignName,
            isLeaf: false,
          };
        }
        // 此时广告树是选中广告组的状态，删除广告组相关数据
        delete newTreeSelectedInfo.groupId;
        delete newTreeSelectedInfo.groupName;
        delete newTreeSelectedInfo.groupType;
        this.handleTreeSelect(newTreeSelectedInfo);
      }
    },

    // 刷新各 tab， 并更新标签页数量
    reloadTabPan() {
      const adStoreId = this.currentStore.adStoreId;
      this.currentStore.adStoreId = null;
      this.$nextTick(() => {
        this.currentStore.adStoreId = adStoreId;
        this.getTabsCellCount();
      });
    },
  },

  watch: {
    currentStore(_, old) {
      // 非初始化时才需要
      if (old.adStoreId) {
        // 重置广告树
        this.treeSelectedKey = null;
        this.treeSelectedInfo = {};
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

<style lang="scss">
._ad_mamage-store-cascader-popper {
  .el-cascader-menu__wrap {
    height: auto;
    max-height: 520px;
  }
}
</style>

<style scoped lang="scss">
// 出现面包屑导航时，去掉容器的 paddingTop，高度用来放面包屑导航
.has-path_crumbs {
  ::v-deep {
    .el-card__body {
      padding-top: 0;
    }
  }
}
</style>