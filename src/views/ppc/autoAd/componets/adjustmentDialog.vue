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

        <el-form-item
          label="调价频率"
        >
          <el-select
            v-model="executionFrequency"
            size="mini"
            class="label-width"
          >
            <el-option label="每天" value="每天"/>
            <el-option label="每周" value="每周"/>
            <el-option label="工作日" value="工作日"/>
            <el-option label="周末" value="周末"/>
          </el-select>
        </el-form-item>

      </el-form>

      <el-collapse
        v-if="executionFrequency !== '每天'"
        v-model="activeNames"
        @change="handleChange"
        style="borderTop: none; borderBottom: none">
         <el-collapse-item
            v-for="(item, index) in weekListFormat()"
            :key="item.week"
            :title="item.week"
            :name="item.week"
            class="ditto"
          >
            <el-button
              v-if="index"
              @click="handleDitto(item.week, index)"
              size="mini"
              type="primary"
              class="is-ditto">同上</el-button>
            <adjustemnt-tabel
              :ref="'table_' + index"
              :rowData="rowData"
            />
         </el-collapse-item>
      </el-collapse>

      <adjustemnt-tabel
        v-else
        :rowData="rowData"
      />
    </el-dialog>
  </div>
</template>

<script>

import adjustemntTabel from './adjustmentTabel.vue';
import { weekList } from '../dict';

export default {

  components: {
    adjustemntTabel,
  },
  
  props: {
    dialogVisible: {
      type: Boolean,
      require: true,
    },
    rowData: {
      type: Object,
      default: new Object
    },
  },

  data() {
    return {
      weekList,
      activeNames: [],
      executionFrequency: '每天',
      echoTabel: [],
      echoTabe2: [],
      echoTabe3: [],
      echoTabe4: [],
      echoTabe5: [],
      echoTabe6: [],
      echoTabe7: [],
    };
  },

  methods: {
    weekListFormat() {
      if (this.executionFrequency === '每周') {
        return weekList;
      } else if (this.executionFrequency === '工作日') {
        return weekList.filter(item => item.type !== 'weekend');
      } else {
        console.log(weekList.filter(item => item.type === 'weekend'))
        return weekList.filter(item => item.type === 'weekend');
      }
    },

    handleDitto(val, idx) {
      
      console.log(this.$refs['table_' + (idx - 1)][0].getField(), idx)
    }
  }
};
</script>

<style lang="scss" scoped>
  .label-width {
    width: 250px;
  }

  .collapse {
    padding: 12px 0 0;
    height: 26px;
  }

  ::v-deep .el-collapse-item__header {
    width: 250px;
    background: rgba(51,153,255,.6);
    color: #fff;
    border: none;
    height: 26px;
    border-radius: 2px;
    margin-bottom: 10px;
    padding: 0px 0px 0px 10px;
  }

  ::v-deep .el-collapse-item__wrap {
    border: none;
  }

  .ditto {
    position: relative;
  }

  .is-ditto {
    position: absolute;
    top: 0;
    left: 270px;
  }
</style>
