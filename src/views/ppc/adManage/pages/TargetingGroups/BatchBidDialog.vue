<!-- 批量调整投放组竞价 -->
<template>
  <el-dialog
    title="批量调整投放组竞价" 
    :visible="visible" 
    :append-to-body="true" 
    @close="handleCancel"
    width="800px"
  >
    <el-form
      ref="formRef"
      :model="options"
      :rules="rules"
      size="small"
      inline
      label-width="64px"
    >
      <el-form-item prop="base" label="将竞价">
        <el-select v-model="options.base" class="item base">
          <el-option label="在当前竞价" value="bid"></el-option>
          <el-option label="调至指定金额" value="inputNum"></el-option>
          <el-option label="在建议竞价" value="recommendBid"></el-option>
          <el-option label="在建议竞价最小值" value="recommendBidStart"></el-option>
          <el-option label="在建议竞价最大值" value="recommendBidEnd"></el-option>
        </el-select>
      </el-form-item>

      <template v-if="options.base !== 'inputNum'">
        <div class="connect">的基础上</div>
        <el-form-item prop="operator">
          <el-select v-model="options.operator" class="item">
            <el-option label="上调" value="+"></el-option>
            <el-option label="下调" value="-"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="unit">
          <el-select v-model="options.unit" class="item">
            <el-option label="%" value="percent"></el-option>
            <el-option :label="currency" value="currency"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item prop="changeValue">
          <el-input
            v-model="options.changeValue"
            @input="handleMoneyInput('changeValue')"
            class="item"
            :placeholder="options.unit === 'currency' ? '请输入金额' : '请输入百分比'"
            maxlength="10"
          />
        </el-form-item>
      </template>

      <el-form-item v-else prop="changeValue">
        <el-input
          v-model="options.changeValue"
          @input="handleMoneyInput('changeValue')"
          class="item"
          placeholder="请输入目标竞价"
          maxlength="10"
        />
      </el-form-item>
    </el-form>  

    <div class="expect">
      将所选投放组竞价{{ expect }}
    </div>

    <ul class="describe">
      <!-- <li>竞价调整超出亚马逊限制的最小值或最大值时，将调整为最小值或最大值；</li> -->
      <li>竞价调整四舍五入精确到小数点后两位数；</li>
      <li>以建议竞价作为基准价时，如未获取到建议竞价则不会进行调整；</li>
    </ul>

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
  name: 'BatchBidDialog',

  props: {
    visible: {
      type: Boolean,
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
        changeValue: [
          { required: true, message: '值不能为空', trigger: 'blur' },
        ],
      },
      options: {
        base: 'bid',
        operator: '+',
        unit: 'percent',
        changeValue: '',
      },
    };
  },

  computed: {
    expect() {
      // 将所选投放组竞价{{ expect }}
      let expect = '';
      // 调至指定金额
      if (this.options.base === 'inputNum') {
        expect = `修改为${this.currency}${this.options.changeValue}`;
      } else if (this.options.base === 'bid') {
        // 以当前竞价为基准
        const prefix = this.options.unit === 'currency' ? this.currency : '';
        const suffix = this.options.unit === 'percent' ? '%' : '';
        expect = `${this.options.operator}${prefix}${this.options.changeValue || '?'}${suffix}`;
      } else {
        // 以建议竞价为基准
        const baseDict = {
          recommendBid: '建议竞价',
          recommendBidStart: '建议竞价最小值',
          recommendBidEnd: '建议竞价最大值',
        };
        const baseName = baseDict[this.options.base];
        const operator = this.options.operator;
        if (this.options.unit === 'percent') {
          expect = `调整为：${baseName}${operator}${this.options.changeValue}%`;
        } else {
          expect = `调整为：${baseName}${operator}${this.currency}${this.options.changeValue}`;
        }
      }
      return expect;
    },
  },

  methods: {
    // 金额输入
    handleMoneyInput(key) {
      const value = strToMoneyStr(this.options[key]);
      this.options[key] = value;
    },

    // 修改确定
    handleSave() {
      this.$refs.formRef.validate(valid => {
        if (!valid) {
          return false;
        }
        // 接口要求增加 type 参数， 调整到指定金额时为 2， 其余为 1
        const type = this.options.base === 'inputNum' ? '2' : '1';
        let changeValue = Number(this.options.changeValue);
        // changeValue 应后端要求，在非调整到指定金额，并且 unit 为  % 时 changeValue 改为小数
        if (type !== '2' && this.options.unit === 'percent') {
          changeValue = changeValue / 100;
        }
        this.$emit('save', {
          ...this.options,
          type,
          changeValue,
        });
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
  
  .item {
    width: 110px;
  }

  .base {
    width: 150px;
  }

  .connect {
    display: inline-block;
    margin-right: 10px;
    line-height: 32px;
  }

  .expect {
    margin-left: 64px;
    color: $warningColor;
    font-size: $textSizeLg;
  }
  
  .describe {
    margin: 20px 0 0 64px;
    padding: 16px;
    font-size: 12px;
    background: #f5f5f5;

    li {
      line-height: 24px;
    }
  }
</style>

