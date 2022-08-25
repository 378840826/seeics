<!-- 广告管理 -->
<template>
  <basic-container>
    <el-container>
      <!-- 左侧菜单 -->
      <el-aside class="left-aside">
        <div class="store_time-container">
          <!-- 店铺和时间 -->
          <el-cascader
            v-model="store"
            :options="storeCascaderData"
            :props="{ expandTrigger: 'hover' }"
            @change="handleStoreChange"
            :size="size"
            class="store"
          />
          <div class="marketplace-time">2022-10-22 02:23:45</div>
        </div>
        <!-- 广告活动和 portfolio 标签页切换 -->
        <el-tabs type="border-card" class="left-tabs">
          <el-tab-pane label="广告活动">
            <CampaignTree
              :treeSelectedKey="treeSelectedKey"
              @treeSelect="handleTreeSelect"
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
          >
            <span slot="label">
              {{ allTabs[item].label }}
              <span class="tabs-cell-count">
                <template v-if="tabsCellCount[allTabs[item].countKey] === undefined">
                  (...)
                </template>
                <template v-else>
                  ({{ tabsCellCount[allTabs[item].countKey] }})
                </template>
              </span>
            </span>
            <component
              :is="allTabs[item].tabPane"
              marketplace="US"
              currency="$"
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

    <create-campaign-dialog/>
  </basic-container>
</template>

<script>
import {
  queryPortfolioList,
  addPortfolio,
  updatePortfolio,
  queryTabsCellCount,
} from '@/api/ppc/adManage';
import { log } from '@/util/util';
import DialogPortfoiloEdit from './components/DialogPortfoiloEdit';
import CampaignTree from './components/CampaignTree';
import { parseTreeKey } from './utils/fun';
import { stateIconDict, tabsStateDict, allTabs } from './utils/dict';
import Campaign from './pages/Campaign';
import Group from './pages/Group';
import Ad from './pages/Ad';
import createCampaignDialog from './create/createCampaignDialog.vue';

export default{
  name: 'adManage',

  components: {
    DialogPortfoiloEdit,
    CampaignTree,
    Campaign,
    Group,
    Ad,
    createCampaignDialog,
  },

  data() {
    return {
      allTabs,
      tabsStateDict,
      stateIconDict,
      size: 'small',
      pageLoading: false,
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
      mainPage: '',
    };
  },

  created() {
    this.getShopList();
    this.getPortfolioList();
    this.getTabsCellCount();
  },

  computed: {
    // 按级联选择器的格式生成店铺数据
    storeCascaderData() {
      const list = this.$store.state.shop.list;
      const obj = {};
      list.forEach(shop => {
        const marketplace = shop.marketplace;
        if (obj.hasOwnProperty(marketplace)) {
          obj[marketplace].push(shop);
        } else {
          obj[marketplace] = [shop];
        }
      });
      const marketplaceList = Object.keys(obj).sort();
      const result = marketplaceList.map(marketplace => {
        const marketplaceStoreList = obj[marketplace];
        return {
          value: marketplace,
          label: marketplace,
          children: marketplaceStoreList.map(store => {
            return {
              value: store.id,
              label: store.storeName,
            };
          }),
        };
      });
      return result;
    },
    
    // 初始默认店铺
    store() {
      if (!this.storeCascaderData.length) {
        return [];
      }
      const store = this.storeCascaderData[0];
      const result = [store.value, store.children[0].value];
      return result;
    },

    // 右侧标签页的状态
    tabsState() {
      const treeSelectedNodeInfo = parseTreeKey(this.treeSelectedKey);
      let state = 'default';
      if (treeSelectedNodeInfo.groupId) {
        state = 'group';
      } else if (treeSelectedNodeInfo.camId) {
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
      // filterByUser 获取当前账号绑定的店铺
      this.$store.dispatch('getShopList', { filterByUser: true }).finally(() => {
        _this.pageLoading = false;
      });
    },

    // 获取标签页数量
    getTabsCellCount() {
      queryTabsCellCount().then(res => {
        log('请求标签页数量res', res.data.data);
        this.tabsCellCount = res.data.data;
      });
    },

    // 切换店铺
    handleStoreChange(store) {
      log('handleStoreChange', store);
      log('store list', this.$store.state.shop.list);
    },

    // 广告组合-获取列表
    getPortfolioList() {
      queryPortfolioList().then(res => {
        this.portfolioList = res.data.data;
      });
    },

    // 广告组合-点击选中
    handleClickPortfolio(val) {
      log('广告组合点击', val);
      this.portfolioSelectedId = val.id;
      // 取消广告树的选中
      this.treeSelectedKey = null;
      // 请求标签页数量
      this.getTabsCellCount();
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
    handleTabsClick(tabs) {
      console.log('标签页点击', tabs, this.tabsActive);
    },

    // 树-切换选中
    // 切换选中的广告活动或广告组
    changeTreeSelected(params, scrollTree = false) {
      log('changeSelected', params, scrollTree);
      // const { tabsState, selectedInfo } = params;
      // 根据节点重新加载标签页
      // 切换到第一个标签
      // 请求各标签显示的数量（只有切换广告活动或广告组时才请求）
      // 修改菜单树选中的 key 和广告信息
      // 菜单树滚动到选中位置, 在下一个事件循环中执行(先切换了选中再执行滚动)
      // scrollTree && setTimeout(scrollTreeToSelected, 0);
    },

    // 树-树组件切换了选中
    handleTreeSelect(val) {
      this.treeSelectedKey = val.key;
      // 请求标签页数量
      this.getTabsCellCount();
      // 取消广告组合的选中
      this.portfolioSelectedId = '';
    },
  },
};
</script>

<style scoped lang="scss">
  @import "./index.scss";
</style>
