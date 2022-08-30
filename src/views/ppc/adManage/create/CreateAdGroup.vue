<template>
  <el-dialog
    title="新增广告组"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    :close-on-press-escape="false"
    destroy-on-close
    @close="close"
    v-loading="loading"
    top="1vh"
    width="80%">

    <el-form>
      
      <el-form-item label="选择广告活动：">
        <el-select size="small" style="width: 400px">
          <el-option
            v-for="item in campaignList"
            :key="item.id"
            :value="item.id"
            :label="item.label"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="广告组名称：">
        <el-input/>
      </el-form-item>

      <CampaignTable/>

    </el-form>

    <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="saveBtn">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>

import CampaignTable from './CampaignTable.vue';
import { queryCampaignList } from '@/api/ppc/adManage';

export default {

  components: {
    CampaignTable
  },

  data() {
    return {
      dialogVisible: true,
      campaignList: []
    };
  },

  mounted() {
    queryCampaignList({
      current: 1,
      size: 20,
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
      }
    });
  }
};
</script>

<style lang="scss" scoped>
  .label{
    width: 600px;
    display: flex;
    line-height: 32px;
    margin-top: 20px;

    span {
      width: 20%;
    }
    
  }
</style>
