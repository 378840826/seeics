<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      :append-to-body="true"
      width="1100px"
      center
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleClose"
    >
      <div slot="title" style="text-align: start;">分时调价</div>

      <h3>基础设置</h3>

      <el-form label-width="90px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item
              label="广告活动"
            >
              <el-input size="mini" class="label-width"/>
            </el-form-item>
          </el-col>

        <el-col :span="8"> 
            <el-form-item
              label="规则名称"
            >
              <el-input size="mini" class="label-width"/>
            </el-form-item>
        </el-col>

        </el-row>

        <el-row :gutter="20">
        <el-col :span="8">
        <el-form-item
          label="规则状态"
        >
          <el-select
            size="mini"
            class="label-width"
          />
        </el-form-item>
        </el-col>

        <el-col :span="14">
          <el-form-item
            label="自动化模板"
          >
            <el-select
              size="mini"
              class="label-width"
            />

           <span style="marginLeft: 10px">去设置自动化模板</span>
          </el-form-item>
        </el-col>
        </el-row>
      </el-form>

      <adjustemnt-tabel />
    </el-dialog>
  </div>
</template>

<script>

import adjustemntTabel from './adjustmentTabel.vue';

export default {

  components: {
    adjustemntTabel,
  },
  
  props: {
    dialogVisible: {
      type: Boolean,
      require: true,
    },
  }
};
</script>

<style lang="scss" scoped>
  .label-width {
    width: 250px;
  }
</style>
