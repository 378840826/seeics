<template>
  <div class="filterBox">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
          <span style="fontSize: 14px; fontWeight: 600; marginRight: 30px">子规则1</span>
        <span style="fontSize: 12px;">规则内指标之间关系为且</span>
        
        <!-- <el-button style="float: right; padding: 3px 0" type="text" @click="remove">操作按钮</el-button> -->
      </div>
      <div>
          <el-row v-for="formInline in formInline" :key="formInline" style="marginTop: 10px">
              <el-select v-model="formInline.label">
                <el-option v-for="item in fieldsPage" :key="item.label" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <el-select v-model="formInline.condition" class="condition" @change="sleect(formInline.condition, formInline.id)">
                <el-option v-for="item in condition" :key="item.label" :label="item.label" :value="item.label"/>
              </el-select>
              <span v-if="formInline.condition === '≥且<'" class="span">
                  <el-input v-model="formInline.minVal"/>
                  <el-input v-model="formInline.maxVal"/>
              </span>
              <span v-else-if="formInline.condition === '环比'">
                <el-select v-model="formInline.chain">
                  <el-option label="上升" value="上升"></el-option>
                  <el-option label="下降" value="下降"></el-option>
                </el-select>
                <el-select v-model="formInline.vlaueType" class="condition">
                  <el-option label="值" value="值"></el-option>
                  <el-option label="百分比" value="百分比"></el-option>
                </el-select>
                <span v-if="formInline.vlaueType === '百分比'">%</span>
                <span class="span"><el-input/></span>
              </span>
              <span v-else class="span"><el-input v-model="formInline.value"/></span>
              <el-button v-if="formInline.btn" type="text" :disabled="disabled">添加</el-button>
          </el-row>
      </div>
    </el-card>
    <el-card v-for="item in data" :key="item.id" class="box-card" shadow="never">
      <div slot="header" class="clearfix">
          <span style="fontSize: 14px; fontWeight: 600; marginRight: 30px">子规则{{item.key + 1}}</span>
        <span style="fontSize: 12px;">规则内指标之间关系为且</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="remove(item.key)">操作按钮</el-button>
      </div>
      <!-- <div v-for="o in item.num" :key="o" class="text item">
        {{'列表内容 ' + o }}
      </div> -->
    </el-card>
    <el-button style="width: 100%" @click="add" type="primary" size="mini">+添加子规则</el-button>
  </div>
</template>

<script>

export default {
  name: 'globalFilter',
  data() {
    return {
      data: [
        {
          id: 1,
          key: 1,
          num: 3
        }
      ],
      formInline: [
        {
          id: 11,
          label: 'search_result_page_no',
          condition: '>',
          chain: '上升',
          vlaueType: '值',
          value: '',
          maxVal: '',
          minVal: '',
        },
        {
          id: 22,
          label: 'search_result_page_no',
          condition: '>',
          chain: '上升',
          vlaueType: '值',
          value: '',
          maxVal: '',
          minVal: '',
        },
        {
          id: 33,
          label: 'search_result_page_no',
          condition: '>',
          chain: '上升',
          vlaueType: '值',
          value: '',
          maxVal: '',
          minVal: '',
          btn: true,
        },
      ],
      condition: [
        {
          label: '≥且<'
        },
        {
          label: '>'
        },
        {
          label: '≥'
        },
        {
          label: '<'
        },
        {
          label: '≤'
        },
        // {
        //   label: '环比'
        // },
      ],
      fields: [
        {
          label: 'ABA排名'
        },
        {
          label: '自然排名',
          value: 'search_result_page_no'
        },
        {
          label: '自然排名页码',
          value: 'search_result_page'
        },
        {
          label: '广告排名',
          value: 'advertise_result_page_no'
        },
        {
          label: '广告排名页码',
          value: 'advertise_result_page'
        },
        {
          label: '销售额'
        },
        {
          label: '订单量'
        },
        {
          label: 'Impressions'
        },
        {
          label: 'Clicks'
        },
        {
          label: 'CPC'
        },
        {
          label: 'CPA'
        },
        {
          label: 'Spend'
        },
        {
          label: 'CTR'
        },
        {
          label: 'ACoS'
        },
        {
          label: 'RoAS'
        },
        {
          label: '转化率'
        },
      ],
      totalFields: [],
      fieldsPage: [],
      disabled: true,
    };
  },
  mounted() {
    this.totalFields = Array.from(this.fields);
    this.fieldsPage = this.totalFields.splice(1, 4);
  },
  methods: {
    filterField() {
      const arr = JSON.parse(JSON.stringify(this.formInline));
      for (let i = 0; i < arr.length; i ++) {
        for (const key in arr[i]) {
          if (arr[i][key] === '') {
            delete arr[i][key];
          }
        }
      }
      return arr;
    },
    sleect(condition, id) {
      if (condition === '≥且<' || condition === '环比') {
        this.formInline = this.formInline.map(item => {
          if (item.id === id) {
            item.value = '';
            item.maxVal = '';
            item.minVal = '';
          } 
          return item;
        });
      } else {
          this.formInline = this.formInline.map(item => {
          if (item.id === id) {
            item.value = '';
            item.maxVal = '';
            item.minVal = '';
          } 
          return item;
        });
      }
    },
    add() {
      if (this.data.length < 4) {
        this.data.push({
          id: this.data.length + 1,
          key: this.data.length + 1,
          num: 4
        });
      } else {
        this.$message({
          type: 'warning',
          message: '最多可以添加5个条件'
        });
      }
    },
    remove(key) {
      const idx = this.data.findIndex(item => {
        if (item.key === key) {
          return true;
        }
      });
      this.data.splice(idx, 1);
      this.data = this.data.map(item => {
        let obj = {};
        if (item.key >= key) {
          obj = {
            ...item,
            key: item.key - 1,
            id: item.id - 1,
          };
        }
        return {
          ...item,
          ...obj
        };
      });
    }
  },
  watch: {
    formInline: {
      handler(val) {
        const arr = [];
        for (let i = 0; i < val.length; i ++) {
          if (val[i].value || val[i].maxVal && val[i].minVal) {
             arr.push(val[i])
          }
        }
        this.disabled = val.length > arr.length;
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
  .filterBox {
    .condition {
      ::v-deep .el-input__inner  {
        position: relative;
        font-size: 14px;
        display: inline-block;
        width: 80px;
        padding: 0 15px;
        height: 30px;
      }
    }
    .span {
      ::v-deep .el-input {
            position: relative;
            font-size: 14px;
            display: inline-block;
            width: 130px;
            margin-right: 10px;
        }
    }
    ::v-deep .el-input__inner  {
        position: relative;
        font-size: 14px;
        display: inline-block;
        width: 130px;
        padding: 0 15px;
        height: 30px;
    }
   ::v-deep .el-input__icon {
       line-height: 30px;
   }
   ::v-deep .el-select {
      margin-right: 10px;
    }
  }
  .box-card {
    width: 1000px;
    background-color: #f2f2f2;
  }
</style>