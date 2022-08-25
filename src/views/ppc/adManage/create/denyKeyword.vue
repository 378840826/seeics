<template>
  <div class="denyBox">
    
    <el-row>
      <el-col><h3>▌否定{{title}}（选填）</h3></el-col>
    </el-row>
    <el-row>
      <el-col :span="12" style="lineHeight: 32px">
        <div v-if="title === '关键词'">
          <span style="marginLeft: 10px">匹配方式：</span>
          <el-radio-group v-model="radio">
            <el-radio label="negativePhrase">词组否定</el-radio>
            <el-radio label="negativeExact">精准否定</el-radio>
          </el-radio-group>
        </div>
      </el-col>
      <el-col :span="10" style="lineHeight: 32px">
          <div class="added">已添加 3个否定{{title}} （最多可添加1000个，会过滤重复的否定{{title}}）</div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="10">
        <el-input
          type="textarea"
          :rows="2"
          :placeholder="title === '关键词' ? '请输入否定关键词，每行一个，回车换行；' : '请输入多个ASIN，每行一个，回车换行'"
          v-model="textarea"
          @header-click="handleAllDelete"
          @input="handleTextarea"
          style="marginLeft: 10px">
        </el-input>
      </el-col>

      <el-col :span="2" style="text-align: center;line-height: 200px;">
          <el-button type="text" size="medium" @click="handleAdd">添加</el-button>
      </el-col>

      <el-col :span="10">
        <el-table
          :data="data"
          stripe
          border
          height="200"
          style="width: 100%">
          <el-table-column
            prop="keyword"
            :label="'否定' + title"
            align="center"
          >
          </el-table-column>
          <el-table-column
            v-if="title === '关键词'"
            prop="type"
            label="匹配方式"
            width="96"
            align="center">

            <template slot-scope="scope">
              <div>{{format(scope.row.type)}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            :render-header="headerDelete"
            width="96"
            align="center">
              <template scope="row">
                <el-button type="text" size="min" @click="handleDelete(row.$index)" style="padding: 0">删除</el-button>
              </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {

  props: {
    title: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      radio: 'negativePhrase',
      data: [],
      textarea: '',
      textareaArr: []
    };
  },

  methods: {

    isObjectValueEqual(a, b) {
      const arr1 = Object.keys(a);
      const arr2 = Object.keys(b);

      if (arr1.length !== arr2.length) {
        return false;
      }

      for (const k in a) {
        if (a[k] !== b[k]) {
          return false;
        }
      }
      return true;
    },

    format(val) {
      if (val === 'negativePhrase') {
        return '词组否定';
      } else if (val === 'negativeExact') {
        return '精准否定';
      }
    },

    getField() {
      const arr = this.data.map(item => {
        return this.title === '关键词' ? { keywordText: item.keyword, matchType: item.type } : { keywordText: item.keyword };
      });
      return arr;
    },

    headerDelete() {
      return (
        <el-button type="text" style="padding: 0" onClick={this.handleAllDelete}>全部删除</el-button>
      );
    },

    handleAllDelete() {
      this.data = [];
    },

    handleDelete(idx) {
      this.data = this.data.splice(1, idx);
    },

    handleTextarea(value) {
      const maxLines = 20;
      let valueArr = value.split(/\r\n|\r|\n/);
      if (valueArr.length > maxLines) {
        valueArr = valueArr.slice(0, maxLines);
        value = valueArr.join('\n');
        this.textarea = value;
      }
      this.textareaArr = valueArr;
    },
    
    handleAdd() {
      const keywordArr = this.data.length && this.data.map(item => item.keyword) || [];
      const idArr = this.data.length && this.data.map(item => item.id) || [];
      this.textareaArr.map(item => {
        if (this.title === '关键词') {
          if (!idArr.includes(`${item}${this.radio}`)) {
            this.data.push({
              keyword: item,
              type: this.radio,
              id: `${item}${this.radio}`
            });
          }
        } else {
          if (!keywordArr.includes(item)) {
            this.data.push({
              keyword: item,
              type: this.radio,
              id: `${item}${this.radio}`
            });
          }
        }
      });
    }
  }
};
</script>


<style lang="scss" scoped>
  .denyBox {
    height: 300px;
    background-color: rgba(242, 242, 242, 1);
    box-sizing: border-box;
    margin-top: 20px;

    h3 {
      margin: 10px;
    }

    .added {
      line-height: 32px;
      background-color: white;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    ::v-deep .el-radio {
        color: #606266;
        cursor: pointer;
        line-height: 32px;
        margin-right: 30px;
        margin-top: 0px;
    }

    ::v-deep .el-textarea__inner {
      min-height: 200px !important;
      max-height: 200px;
    }
  }
</style>