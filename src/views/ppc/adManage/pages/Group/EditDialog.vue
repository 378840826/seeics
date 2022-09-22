<!-- 表格行数据修改弹窗 -->
<template>
  <el-dialog :visible="visible" :append-to-body="true" @close="handleCancel">
    <div slot="title" :title="oldName">
      广告组编辑- <span class="edit_dialog-title-name">{{ oldName }}</span>
    </div>

    <el-form
      ref="formRef"
      :model="data"
      label-width="120px"
      :rules="rules"
      size="small"
    >
      <el-form-item label="状态" prop="state">
        <el-select v-model="data.state" ref="state" :class="data.state">
          <el-option
            v-for="(value, key) in stateNameDict"
            :key="key"
            :label="value"
            :value="key"
          >
            <span :class="key">{{ value }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="广告组名称" prop="name">
        <el-input v-model="data.name" ref="name" />
      </el-form-item>

      <el-form-item prop="defaultBid">
        <span slot="label">
          默认竞价<span class="edit_dialog-label-suffix">({{currency}})</span>
        </span>
        <el-input
          ref="defaultBid"
          v-model="data.defaultBid"
          @input="handleMoneyInput('defaultBid')"
        />
      </el-form-item>

    </el-form>  
    <div slot="footer">
      <el-button @click="handleCancel" size="mini">取 消</el-button>
      <el-button type="primary" @click="handleSave" size="mini">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { stateNameDict } from '../../utils/dict';
import { strToMoneyStr } from '@/util/numberString';

export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    // 点击哪个编辑按钮打开的弹窗，焦点就默认在哪里
    editKey: {
      type: Object,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      stateNameDict,
      strToMoneyStr,
      rules: {
        name: [
          { required: true, message: '请输入广告组名称', trigger: 'blur' },
          { min: 1, max: 255, message: '最多 255 个字符', trigger: 'blur' }
        ],
        defaultBid: [
          { required: true, message: '默认竞价不能为空', trigger: 'blur' },
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      oldName: this.data.name,
      oldData: { ...this.data },
    };
  },

  created() {
    this.$nextTick(() => {
      this.$refs[this.editKey].focus();
    });
  },

  methods: {
    // 金额输入
    handleMoneyInput(key) {
      const value = strToMoneyStr(this.data[key]);
      this.data[key] = value;
    },

    // 过滤出被修改了的值
    getModified() {
      const saveData = {};
      Object.keys(this.data).forEach(key => {
        const newVal = this.data[key];
        if (newVal !== this.oldData[key]) {
          saveData[key] = newVal;
        }
      });
      return saveData;
    },
  
    // 修改确定
    handleSave() {
      this.$refs.formRef.validate(valid => {
        if (!valid) {
          return false;
        }
        // 获取本次被修改了的值
        const saveData = this.getModified();
        // 有修改的字段才进行请求
        if (Object.keys(saveData).length) {
          this.$emit('save', {
            ...saveData,
            groupId: this.data.id,
          });
        } else {
          this.$message.warning('未修改任何数据');
        }
        this.$emit('update:visible', false);
      });
    },
  
    // 取消
    handleCancel() {
      this.$emit('update:visible', false);
    },
  },
};
</script>

<style scoped lang="scss">
  @import "../common.scss";
</style>
