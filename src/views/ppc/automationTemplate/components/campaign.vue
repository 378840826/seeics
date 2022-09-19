<template>
  <el-dialog
    :visible.sync="visible"
    :append-to-body="true"
    :close-on-press-escape="false"
    destroy-on-close
    @close="close"
    v-loading="loading"
    
    width="1160px">
    <span slot="title">添加广告</span>

    <div>
      <span>模板名称：{{rowInfo.templateName}}</span>
      <span style="marginLeft: 50px">模板类型：{{rowInfo.templateType}}</span>
    </div>
    <!-- <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="close">取 消</el-button>
        <el-button 
          size="mini" 
          type="primary" 
          @click="save"
          :disabled="saveDisabled"
        >保 存</el-button>
      </span> -->
  </el-dialog>
</template>

<script>

export default {

  props: {
    visible: {
      type: Boolean,
      require: true
    },
    rowInfo: {
      type: Object,
      require: true
    },
  },

  mounted() {
    console.log(this.rowInfo)
  },

  methods: {
    close() {
      this.$emit('update:visible', false);
    }
  }
};
</script>
