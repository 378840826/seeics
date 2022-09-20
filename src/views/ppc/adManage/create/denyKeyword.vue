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
          <div class="added">已添加 {{data.length}}个否定{{title}} （最多可添加1000个，会过滤重复的否定{{title}}）</div>
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
          <el-button type="text" size="medium" @click="handleAdd" :disabled="disabled">添加</el-button>
      </el-col>

      <el-col :span="10">
        <el-table
          :data="data"
          stripe
          border
          height="300"
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
                <el-button type="text" size="min" @click="handleDelete(row.row.id)" style="padding: 0">删除</el-button>
              </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-dialog
      :visible.sync="dialogVisible"
      append-to-body
      :show-close="false"
      width="500px"
      center
      top="40vh"
      @close="handleClose"
      destroy-on-close>
      <div v-if="title === '关键词'">
        {{`关键词${msg.join('、')}`}}已存在，无需重复添加
      </div>
      <div v-if="title === '商品'">
        <div v-if="msg.length">{{msg.join('、')}}添加成功；</div>
        <div v-if="repetition.length">{{repetition.join('、')}}已存在，无需重复添加；</div>
        <div v-if="fail.length">{{fail.join('、')}}添加失败，请检查ASIN是否有误；</div>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogVisible = false">取 消{{max}}</el-button>
          <el-button
            type="primary"
            size="small"
            @click="dialogVisible = false; textarea = ''; textareaArr = []">确 定</el-button>
      </span>
    </el-dialog>
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
      textareaArr: [],
      dialogVisible: false,
      msg: [],
      fail: [],
      repetition: [],
      disabled: false
    };
  },

  watch: {
    title: {
      handler() {
        this.data = [];
        this.textarea = '';
      }
    }
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
        return this.title === '关键词' ? { asin: item.keyword, matchType: item.type } : { asin: item.keyword };
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

    handleDelete(id) {
      this.data = this.data.filter(item => item.id !== id);
    },

    handleTextarea(value) {
      const maxLines = 1000;
      let valueArr = value.split(/\r\n|\r|\n/);
      const arr = [];
      if (this.title === '关键词') {
        
        valueArr.map((item, idx) => {
      
          if (item.length > 80) {
            this.$message({
              type: 'error',
              message: `第${idx + 1}行关键词已超过80个字符`
            });
            arr.push(item);
          }
        });
      }
      this.disabled = arr.length;
      if (valueArr.length > maxLines) {
        valueArr = valueArr.slice(0, maxLines);
        value = valueArr.join('\n');
        this.textarea = value;
      }
      this.textareaArr = valueArr;
    },
    
    handleAdd() {
      const res = /^[A-Za-z0-9]+$/;
      this.repetition = [];
      this.msg = [];
      this.fail = [];
      if (this.title === '关键词') {
        if (!this.textareaArr.filter(Boolean).length) {
          this.$message({
            type: 'warning',
            message: '请添加/输入关键词'
          });
          return;
        }
      } else {
        if (!this.textareaArr.filter(Boolean).length) {
          this.$message({
            type: 'warning',
            message: '请输入否定ASIN'
          });
          return;
        }
      }
      this.textareaArr.map(item => {
        const keywordArr = this.data.length && this.data.map(item => item.keyword) || [];
        const idArr = this.data.length && this.data.map(item => item.id) || [];
        
        if (this.title === '关键词') {
          if (!idArr.includes(`${item}${this.radio}`)) {
            this.data.push({
              keyword: item,
              type: this.radio,
              id: `${item}${this.radio}`
            });
            this.textarea = '';
            this.textareaArr = [];
          } else {
            this.msg.push(item);
            this.msg = [...new Set(this.msg)];
            this.dialogVisible = true;
          }
        } else {
          this.dialogVisible = true;
          if (!keywordArr.includes(item) && res.test(item) && item.length === 10) {
            this.data.push({
              keyword: item,
              type: this.radio,
              id: `${item}${this.radio}`
            });
            this.msg.push(item);
            this.msg = [...new Set(this.msg)];
          } else {
            if (!res.test(item)) {
              this.fail.push(item);
              this.fail = [...new Set(this.fail)];
            } else if (item.length !== 10) {
              this.fail.push(item);
              this.fail = [...new Set(this.fail)];
            } else if (keywordArr.includes(item)) {
              this.repetition.push(item);
              this.repetition = [...new Set(this.repetition)];
            }
            
          }
        }
      });
    }
  }
};
</script>


<style lang="scss" scoped>
  .denyBox {
    // height: 300px;
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
      min-height: 300px !important;
      max-height: 300px;
    }

    ::v-deep .el-table__body-wrapper {
      height: 250px !important;
    }
  }
</style>