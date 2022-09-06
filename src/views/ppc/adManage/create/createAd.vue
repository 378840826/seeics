<template>
  <el-dialog
    title="添加广告"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    :close-on-press-escape="false"
    destroy-on-close
    @close="close"
    v-loading="loading"
    top="1vh"
    width="1160px">

    <el-form label-width="130px">
      
      <el-form-item>
        <template slot="label">
          <div style="display: flex;">
            <span>选择广告活动：</span>
            <span class="msg">*</span>
          </div>
        </template>
        <el-select
          v-model="form.campaignId"
          @change="handleGroup"
          size="small"
          style="width: 400px">
          <el-option
            v-for="item in campaignList"
            :key="item.id"
            :value="item.id"
            :label="item.label"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <template slot="label">
          <div style="display: flex;">
            <span>选择广告组：</span>
            <span class="msg">*</span>
          </div>
        </template>
        <el-select
          
          v-model="form.groupId"
          @change="handleGroup"
          size="small"
          style="width: 400px">
          <el-option
            v-for="item in groupList"
            :key="item.id"
            :value="item.id"
            :label="item.label"
          />
        </el-select>
      </el-form-item>

      <campaign-table
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
import { queryCampaignList, getGroupList } from '@/api/ppc/adManage';

export default {

  props: {
    dialogVisible: {
      type: Boolean,
      require: true
    },
    mwsStoreId: {
      type: String,
      // required: true,
      default: '1525044033420210177'
    },
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
      campaignList: [],
      groupList: [],
      data: [],
      total: 0,
      page: {
        size: 10,
        current: 1,
      }
    };
  },

  mounted() {
    this.queryCampaignList();
    this.getGroupList();
  },


  methods: {

    cancel() {
      this.$emit('update:dialogVisible', false);
    },

    queryCampaignList() {
      queryCampaignList({
        ...this.page,
        order: 'createdTime',
        asc: false
      }, {
        marketplace: 'CA',
        storeId: '1524676862584238082'
      }).then(res => {
        if (res.data.code === 200) {
          this.campaignList = res.data.data.page.records.map(item => {
            return {
              value: item.id,
              id: item.id,
              label: item.name
            };
          });
          this.data = res.data.data.page.records;
          this.total = res.data.data.page.total;
          this.form.campaignId = this.campaignList.length && this.campaignList[0].id;
          this.targetingMode = res.data.data.page.records.length && res.data.data.page.records[0].targetingType;
          this.strategy = res.data.data.page.records.length && res.data.data.page.records[0].biddingStrategy;
        }
      });
    },

    getGroupList() {
      getGroupList(this.page).then(res => {
        this.groupList = res.data.data.records.map(item => {
          return {
            value: item.groupId,
            id: item.groupId,
            label: item.name
          };
        });
      });
    }
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
</style>

