<template>
  <el-dialog
    title="添加广告"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    :close-on-press-escape="false"
    destroy-on-close
    @close="cancel"
    v-loading="loading"
    top="1vh"
    width="80%">

    <el-form label-width="130px" :model="form" ref="form" :rules="rules" hide-required-asterisk>
      
      <el-form-item prop="campaignId">
        <template slot="label">
          <div style="display: flex;">
            <span>选择广告活动：</span>
            <span class="msg">*</span>
          </div>
        </template>
        <el-select
          v-model="form.campaignId"
          @change="handleGroup"
          filterable
          reserve-keyword
          remote
          :remote-method="remoteMethod"
          :loading="campaignLoading"
          v-loadmore="loadmore"
          @focus="searchCampaign = '';
            searchCampaignList = [];"
          placeholder="请选择广告活动"
          size="small"
          class="autocomplete"
          style="width: 400px">
          <el-option
            v-for="item in !searchCampaign ? campaignList : searchCampaignList"
            :key="item.id"
            :value="item.id"
            :label="item.label"
            class="box2"
          />
        </el-select>
      </el-form-item>

      <el-form-item prop="groupId">
        <template slot="label">
          <div style="display: flex;">
            <span>选择广告组：</span>
            <span class="msg">*</span>
          </div>
        </template>
        <el-select
          v-model="form.groupId"
          @change="handleGroup"
          filterable
          reserve-keyword
          remote
          :remote-method="remoteMethodGroup"
          :loading="groupLoading"
          v-loadmore="loadmoreGroup"
          @focus="
            searchGroup = '';
            searchGroupList = [];"
          placeholder="请选择广告组"
          size="small"
          style="width: 400px">
          <el-option
            v-for="item in !searchGroup ? groupList : searchGroupList"
            :key="item.id"
            :value="item.id"
            :label="item.label"
            class="box2"
          />
        </el-select>
      </el-form-item>

      <campaign-table
        ref="priceTable"
        :mwsStoreId="mwsStoreId"
      />

    </el-form>

    <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="saveBtn">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>

import CampaignTable from './CampaignTable.vue';
import { queryCampaignList, getGroupList, createAd } from '@/api/ppc/adManage';

export default {

  props: {
    dialogVisible: {
      type: Boolean,
      require: true
    },
    mwsStoreId: {
      type: String,
      required: true,
    },
    storeId: {
      type: String,
      required: true, 
    },
    marketplace: {
      type: String,
      required: true, 
    }
  },

  components: {
    CampaignTable
  },
  
  data() {
    return {
      form: {
        campaignId: '',
        groupId: ''
      },
      campaignLoading: false,
      groupLoading: false,
      loading: false,
      searchCampaign: '',
      searchGroup: '',
      campaignList: [],
      searchCampaignList: [],
      searchGroupList: [],
      groupList: [],
      data: [],
      total: 0,
      searchTotal: 0,
      groupTotal: 0,
      groupSearchTotal: 0,
      page: {
        size: 20,
        current: 1,
      },
      searchPage: {
        size: 20,
        current: 1,
      },
      groupPage: {
        size: 20,
        current: 1,
      },
      groupSearchPage: {
        size: 20,
        current: 1,
      },
      rules: {
        campaignId: [{ required: true, message: '请选择广告活动', trigger: 'blur' }],
        groupId: [{ required: true, message: '请选择广告组', trigger: 'blur' }],
      }
    };
  },

  directives: {
    'loadmore': {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
        SELECTWRAP_DOM.addEventListener('scroll', function () {
          const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
          if (condition) {
            binding.value();
          }
        }, true);
      }
    }
  },

  mounted() {
    this.queryCampaignList();
    this.getGroupList();
  },


  methods: {

    repetit(arr) {
      let res = [];
      const hasObj = {};
      res = arr.reduce((total, next) => {
        const filterKey = next.id;
        hasObj[filterKey] ? '' : hasObj[filterKey] = true && total.push(next);
        return total;
      }, []);
      return res;
    },

    loadmore() {
      const result = !this.searchCampaign ?
        this.page.size * this.page.current : this.searchPage.size * this.searchPage.current;
      if (result < !this.searchCampaign ? this.total : this.searchTotal) { //加载全部出来 停止请求
        !this.searchCampaign ? this.page.current ++ : this.searchPage.current ++;
        this.queryCampaignList(true);
      }  
    },

    loadmoreGroup() {
      const result = !this.searchGroup ?
        this.groupPage.size * this.groupPage.current : this.groupSearchPage.size * this.groupSearchPage.current;
      if (result < !this.searchGroup ? this.groupTotal : this.groupSearchTotal) { //加载全部出来 停止请求
        !this.searchGroup ? this.groupPage.current ++ : this.groupSearchPage.current ++;
        this.getGroupList(true);
      }  
    },

    cancel() {
      this.$emit('update:dialogVisible', false);
    },

    queryCampaignList(flag) {
      queryCampaignList({
        current: !this.searchCampaign ? this.page.current : this.searchPage.current,
        size: !this.searchCampaign ? this.page.size : this.searchPage.size,
        order: 'createdTime',
        asc: false
      }, {
        marketplace: this.marketplace,
        storeId: this.storeId,
        search: this.searchCampaign || '',
      }).then(res => {
        if (res.data.code === 200) {
          this.campaignLoading = false;
          const data = res.data.data.page.records.map(item => {
            return {
              value: item.id,
              id: item.id,
              label: item.name
            };
          });
          if (this.searchCampaign) {
            this.searchTotal = res.data.data.page.total;
            if (this.searchTotal > this.searchPage.current * this.searchPage.size) {
              this.searchCampaignList = this.searchCampaignList.concat(data);
              this.searchCampaignList = this.repetit(this.searchCampaignList);
            } else {
              this.searchCampaignList = data;
            }
            return;
          }
          this.total = res.data.data.page.total;
          this.data = this.data.concat(res.data.data.page.records);
          this.data = this.repetit(this.data);
          this.campaignList = this.data.map(item => {
            return {
              value: item.id,
              id: item.id,
              label: item.name
            };
          });
          
          if (!flag) { //非预加载赋值
            this.form.campaignId = this.campaignList.length && this.campaignList[0].id || '';
          }
        }
      }).catch(() => {
        this.campaignLoading = false;
      });
    },

    getGroupList(flag) {
      getGroupList({
        current: !this.searchGroup ? this.groupPage.current : this.groupSearchPage.curren,
        size: !this.searchGroup ? this.groupPage.size : this.groupSearchPage.size,
      }, { name: this.searchGroup || '' }).then(res => {
        if (res.data.code === 200) {
          this.groupLoading = false;
          const data = res.data.data.records.map(item => {
            return {
              value: item.groupId,
              id: item.groupId,
              label: item.name
            };
          });
          
          if (this.searchGroup) {
            this.groupSearchTotal = res.data.data.total;
            if (this.groupSearchTotal > this.groupSearchPage.current * this.groupSearchPage.size) {
              this.searchGroupList = this.searchGroupList.concat(data);
              this.searchGroupList = this.repetit(this.searchGroupList);
            } else {
              this.searchGroupList = data;
            }
            return;
          }
          this.groupTotal = res.data.data.total;
          this.groupList = this.groupList.concat(data);
          this.groupList = this.repetit(this.groupList);
          if (!flag) { //非预加载赋值
            this.form.groupId = this.groupList.length && this.groupList[0].id;
          }
        }
      });
    },

    remoteMethod(val) {
      this.searchCampaign = val;
      this.campaignLoading = true;
      this.searchCampaignList = [];
      this.searchPage.current = 1;
      this.queryCampaignList();
    },

    remoteMethodGroup(val) {
      this.searchGroup = val;
      this.groupLoading = true;
      this.searchGroupList = [];
      this.groupSearchPage.current = 1;
      this.getGroupList();
    },

    saveBtn() {
      const priceTable = this.$refs.priceTable.getField();
      
      if (!this.form.campaignId || !this.form.campaignId) {
        this.$refs.form.validate();
        return;
      } else if (!priceTable.length) {
        this.$message({
          type: 'error',
          message: '请选择商品'
        });
        return;
      }

      this.loading = true;
      createAd({
        campaignId: this.form.campaignId,
        groupId: this.form.groupId,
        productItemRoList: priceTable,
      }).then(res => {

        if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: '添加广告成功'
          });
          this.$emit('success');
          this.loading = false;
          this.$emit('update:dialogVisible', false);
        }
      }).catch(() => {
        this.loading = false;
      });
    },
  }
};
</script>

<style lang="scss" scoped>
  .msg {
    color: #ff4d4f;
    font-size: 20px;
    font-family: SimSun,sans-serif;
    content: "*";
    display: block;
    widows: 10px;
  }

  .box2 {
    width: 400px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .box2:hover {
    text-overflow:inherit;
    overflow: visible;
    white-space: pre-line;
  }
</style>

