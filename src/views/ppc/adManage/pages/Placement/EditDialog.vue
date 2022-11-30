<!-- 表格行数据修改弹窗 -->
<!-- 广告位修改弹窗需要可修改所属广告活动的全部数据 -->
<template>
  <el-dialog :visible="visible" :append-to-body="true" @close="handleCancel">
    <div slot="title">
      广告活动编辑- <span class="edit_dialog-title-name">{{ data.campaignName }}</span>
    </div>

    <el-form
      ref="formRef"
      :model="data"
      label-width="124px"
      :rules="rules"
      size="small"
    >
      <el-form-item label="状态" prop="campaignState">
        <el-select disabled v-model="data.campaignState" ref="campaignState">
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

      <el-form-item label="广告组合" prop="portfolioId">
        <el-select disabled v-model="data.portfolioId" ref="portfolioId">
          <el-option
            v-for="item in portfolioList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
            <span>{{ item.name }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="广告活动名称" prop="campaignName">
        <el-input disabled v-model="data.campaignName" ref="campaignName" />
      </el-form-item>
  
      <el-form-item label="竞价策略" prop="biddingStrategy">
        <el-select v-model="data.biddingStrategy" ref="biddingStrategy">
          <el-option
            v-for="(value, key) in biddingStrategyDict"
            :key="key"
            :label="value"
            :value="key"
          >
            <span>{{ value }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="biddingPlacementTop">
        <span slot="label">
          搜索结果顶部<span class="edit_dialog-label-suffix">(%)</span>
        </span>
        <el-input
          ref="biddingPlacementTop"
          v-model="data.biddingPlacementTop"
          @input="handleMoneyInput('biddingPlacementTop')"
        />
      </el-form-item>

      <el-form-item prop="biddingPlacementProductPage">
        <span slot="label">
          商品页面<span class="edit_dialog-label-suffix">(%)</span>
        </span>
        <el-input
          ref="biddingPlacementProductPage"
          v-model="data.biddingPlacementProductPage"
          @input="handleMoneyInput('biddingPlacementProductPage')"
        />
      </el-form-item>

      <el-form-item prop="dailyBudget">
        <span slot="label">
          日预算<span class="edit_dialog-label-suffix">({{currency}})</span>
        </span>
        <el-input
          ref="dailyBudget"
          v-model="data.dailyBudget"
          @input="handleMoneyInput('dailyBudget')"
        />
      </el-form-item>

      <el-form-item label="开始时间" prop="startDate">
        <el-date-picker
          ref="startDate"
          v-model="data.startDate"
          format="yyyy-MM-dd"
          value-format="yyyyMMdd"
          type="date"
          :picker-options="pickerOptions"
          :clearable="false"
          placeholder="选择开始日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="结束时间" prop="endDate">
        <el-date-picker
          ref="endDate"
          v-model="data.endDate"
          format="yyyy-MM-dd"
          value-format="yyyyMMdd"
          type="date"
          :picker-options="pickerOptions"
          placeholder="选择结束日期">
        </el-date-picker>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button @click="handleCancel" size="mini">取 消</el-button>
      <el-button type="primary" @click="handleSave" size="mini">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { stateNameDict, biddingStrategyDict } from '../../utils/dict';
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
    portfolioList: {
      type: Array,
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
      biddingStrategyDict,
      strToMoneyStr,
      rules: {
        // campaignName: [
        //   { required: true, message: '请输入广告活动名称', trigger: 'blur' },
        //   { min: 1, max: 128, message: '最多 128 个字符', trigger: 'blur' }
        // ],
        dailyBudget: [
          { required: true, message: '日预算不能为空', trigger: 'blur' },
          { 
            validator: (_, value, callback) => {
              if (Number(value) > 1000000 || Number(value) < 1) {
                callback(new Error('广告活动每日预算范围为 1-1000000'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
        biddingPlacementTop: [
          { 
            validator: (_, value, callback) => {
              if (Number(value) > 900) {
                callback(new Error('最大值不能超过900'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
        biddingPlacementProductPage: [
          { 
            validator: (_, value, callback) => {
              if (Number(value) > 900) {
                callback(new Error('最大值不能超过900'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
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

    // 把 form 的数据转为接口所需要的格式
    formatData(data) {
      // 清除结束日期时候，需要传空字符串
      if (data.endDate === null) {
        data.endDate = '';
      }
      // 日预算 dailyBudget 的 key 需要改为 budget
      if (data.dailyBudget) {
        data.budget = data.dailyBudget;
        delete data.dailyBudget;
      }

      if (data.portfolioId !== undefined) {
        data.portfolioName = this.portfolioList.find(item => item.id === data.portfolioId).name;
        // 广告组合改为未分组时，需要传空字符串id
        if (data.portfolioId === 0) {
          data.portfolioId = '';
        }
      }
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
          // 结束日期不能早于开始日期
          if (saveData.startDate || saveData.endDate) {
            const startDate = saveData.startDate || this.data.startDate;
            const endDate = saveData.endDate || this.data.endDate;
            // 有结束时间才判断
            if (endDate && (startDate > endDate)) {
              this.$message.error('结束日期不能早于开始日期');
              return;
            }
          }
          // 按接口需求格式化数据
          this.formatData(saveData);
          this.$emit('save', {
            ...saveData,
            campaignId: this.data.campaignId,
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
