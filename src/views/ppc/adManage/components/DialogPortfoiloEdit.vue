<!-- 弃用，功能用 PortfolioCampaignTree 代替了 -->
<!-- 广告组合 portfoilo 编辑名称弹窗 -->
<template>
  <el-dialog :visible="visible" @close="handleCancel" :append-to-body="true">
    <div slot="title" :title="oldName">
      广告组合名称修改- <span class="edit_dialog-title-name">{{ portfolioName }}</span>
    </div>

    <el-form
      ref="ref"
      :model="form"
      label-width="80px"
      :rules="rules"
      size="small"
    >
      <el-form-item label="新名称" prop="newName">
        <el-input value="portfolioName" v-model="form.newName" autocomplete="off" />
      </el-form-item>
    </el-form>  
    <div slot="footer">
      <el-button @click="handleCancel" size="mini">取 消</el-button>
      <el-button type="primary" @click="handleSave" size="mini">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'DialogPortfoiloEdit',

  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    portfolioName: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      rules: { 
        newName: [
          { required: true, message: '请输入新名称', trigger: 'blur' },
          { min: 1, max: 20, message: '最多 20 个字符', trigger: 'blur' }
        ],
      },
      form: {
        newName: '',
      },
    };
  },

  methods: {
    // 修改确定
    handleSave() {
      this.$refs.ref.validate(valid => {
        if (!valid) {
          return false;
        }
        this.$emit('save', this.form.newName);
      });
    },
  
    // 取消
    handleCancel() {
      this.$emit('cancel', false);
    },
  },

  watch: {
    portfolioName: function (val) {
      this.form.newName = val;
    }
  },
};
</script>

<style lang="scss" scoped>
.edit_dialog-title-name {
  display: inline-block;
  color: $secondaryTextColor;
  vertical-align: bottom;
  max-width: 300px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
