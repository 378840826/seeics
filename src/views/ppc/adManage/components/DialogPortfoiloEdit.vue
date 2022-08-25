<!-- 广告组合 portfoilo 编辑名称弹窗 -->
<template>
  <el-dialog title="修改广告组合名称" :visible="visible" :append-to-body="true">
    <el-form
      ref="ref"
      :model="form"
      label-width="80px"
      :rules="{ newName: [
        { required: true, message: '请输入新名称', trigger: 'blur' },
        { min: 1, max: 20, message: '最多 20 个字符', trigger: 'blur' }
      ],}"
      >
        <el-form-item label="现名称">
          <span>{{ portfolioName }}</span>
        </el-form-item>
        <el-form-item label="新名称" prop="newName">
          <el-input value="portfolioName" v-model="form.newName" autocomplete="off" />
        </el-form-item>
      </el-form>  
    <div slot="footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSave">确 定</el-button>
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
