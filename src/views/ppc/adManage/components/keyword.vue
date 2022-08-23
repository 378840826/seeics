<template>
  <div style="backgroundColor: rgba(242, 242, 242, 1)">
    <el-button type="text" @click="handleTab($event)" 
      :style="{color: category === '建议关键词' && '#409EFF' || '#000'}">建议关键词</el-button>
    <el-button type="text" @click="handleTab($event)"
      :style="{color: category === '输入关键词' && '#409EFF' || '#000'}">输入关键词</el-button>
    
    <el-row class="row">
      <el-col :span="8" :style="{display: 'flex',justifyContent: category === '建议关键词' ? 'space-between' : 'start',}">
          <span>匹配方式：</span>
          <el-checkbox-group
            @change="handleCheck"
            v-model="suggestionKeywordMatchType"
            style="width: 200px">
            <el-checkbox label="broad">广泛</el-checkbox>
            <el-checkbox label="phrase">词组</el-checkbox>
            <el-checkbox label="exact">精准</el-checkbox>
        </el-checkbox-group>
        <el-button
          v-if="category === '建议关键词'" 
          @click="handleSelectAll"
          type="text" 
          size="small" 
          style="paddingRight: 38px;">全选</el-button>
      </el-col>

      <el-col :span="15">
        <el-button @click="batchDelete" size="small" :disabled="!selectData.length">批量删除</el-button>
        <el-button @click="batchUseBid" size="small" :disabled="!selectData.length">应用建议竞价</el-button>
        <el-button @click="ifBid = true" size="small" :disabled="!selectData.length">设置竞价</el-button>
        <span v-if="ifBid">
          <el-select v-model="bid" size="small" style="width: 140px">
            <el-option
              v-for="item in bidList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
              style="textAlign: center"
            />
          </el-select>

          <el-select v-model="jia" size="small" style="width: 50px">
            <el-option
              v-for="item in jiaList"
              :key="item.label"
              :value="item.label"
              style="textAlign: center"
            >{{item.label}}</el-option>
          </el-select>

          <el-select v-model="qian" size="small" style="width: 50px">
            <el-option
              v-for="item in qianList"
              :key="item.label"
              :value="item.label"
              style="textAlign: center"
            >{{item.label}}</el-option>
          </el-select>

          <el-input size="small" v-model="bidval" style="width: 50px"/>
          <el-button @click="empty" size="small" style="marginLeft: 10px;">取消</el-button>
          <el-button @click="setBid" type="primary" size="small" :disabled="!bidval">确定</el-button>
        </span>
      </el-col>
    </el-row>

    <el-row class="row">
      <el-col :span="8" v-if="category === '建议关键词'">
         <el-table
            :data="categoryData"
            border
            height="200"
            style="width: 100%"
            class="table">
            <el-table-column
              prop="suggestedKeyword"
              align="center"
              label="关键词">
            </el-table-column>

            <el-table-column
              prop="matchTypeSuggestedBids"
              align="center"
              label="匹配方式">

              <template slot-scope="scope">
                <div
                  v-for="item in scope.row.matchTypeSuggestedBids"
                  :key="item.matchType"
                >
                {{formatter(item.matchType)}}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="date"
              align="center"
              label="建议竞价">

              <template slot-scope="scope">
                <div
                  v-for="item in scope.row.matchTypeSuggestedBids"
                  :key="item.matchType"
                >
                {{item.suggestedBid}}
                </div>
              </template>
            </el-table-column>

            <el-table-column
                align="center"
                prop="address"
                width="100"
                label="操作">
                
                <template slot-scope="scope">
                  <div
                    v-for="item in scope.row.matchTypeSuggestedBids"
                    :key="item.matchType"
                   
                  >
                  
                   <el-button  
                     @click="handleSelect(scope.row.suggestedKeyword, item.matchType, item)"
                     type="text"
                     :disabled="item.checked" style="padding: 0">{{item.checked ? '已选' : '选择'}}</el-button>
                  </div>
              </template>
            </el-table-column>
        </el-table>
      </el-col>

      <el-col :span="7" v-if="category === '输入关键词'">
          <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="textarea"
          @input="handleTextarea"
        >
        </el-input>
      </el-col>

      <el-col :span="1" v-if="category === '输入关键词'" style="lineHeight: 200px;">
        <el-button @click="searchKeyword" type="text">添加</el-button>
      </el-col>

      <el-col :span="15">
         <el-table
            :data="tableData"
            border
            @selection-change="handleSelectionChange"
            height="200"
            style="width: 100%"
            class="table">
            <el-table-column
              type="selection"
              width="45">
            </el-table-column>
            <el-table-column
              prop="suggestedKeyword"
              align="center"
              label="关键词">
            </el-table-column>
            <el-table-column
              prop="matchType"
              align="center"
              label="匹配方式">

              <template slot-scope="scope">
                <div>{{formatter(scope.row.matchType)}}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="suggestedBid"
              align="center"
              label="建议竞价"
              width="120">

              <template slot-scope="scope">
                <div v-if="scope.row.suggestedBid">
                  <div>{{scope.row.suggestedBid}}
                    <el-button @click="useBid(scope.row)" style="padding: 0">应用</el-button>
                  </div>
                  <div>(${{scope.row.minSuggestedBid}} - ${{scope.row.maxSuggestedBid}})</div>
                </div>
                <div v-else>——</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="keywordBid"
              align="center"
              label="关键词竞价"
              width="120">

               <template slot-scope="scope">
                <div 
                  @mouseenter="handleKeyword(scope.row)"
                  @mouseleave="handleLeaveKeyword(scope.row)"
                >
                  <div v-if="!scope.row.isInput">{{scope.row.keywordBid}}</div>
                  <el-input
                    v-else
                    v-model="scope.row.keywordBid"
                    size="small"
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="address"
              width="100"
              label="操作">

              <template slot-scope="scope">
                <el-button 
                  @click="handleDelete(scope.row, scope.$index)"
                  type="text">删除</el-button>
              </template>
            </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>

</template>

<script>

import DragStrip from './DragStrip.vue';
import { querySuggestKeyword, manualQueryKeyword } from '@/api/ppc/adManage';

export default {
  components: {
    DragStrip
  },

  props: {
    asinList: {
      type: Array
    },
    targetingMode: {
      type: String,
    }
  },

  data() {
    return {
      category: '建议关键词',
      bid: 'suggestedBid',
      jia: '+',
      qian: '$',
      bidval: '',
      textarea: '',
      suggestionKeywordMatchType: ['exact', 'phrase', 'broad'],
      keywordList: [],
      bidList: [
        {
          label: '固定值',
          value: 'bid'
        },
        {
          label: '建议竞价的基础上',
          value: 'suggestedBid',
        },
        {
          label: '最高建议竞价',
          value: 'maxSuggestedBid',
        },
        {
          label: '最低建议竞价',
          value: 'minSuggestedBid',
        },
      ],
      jiaList: [
        {
          label: '+',
        },
        {
          label: '-',
        },
      ],
      qianList: [
        {
          label: '$',
        },
        {
          label: '%',
        },
      ],
      categoryData: [],
      tableData: [],
      selectData: [],
      dialogVisible: false,
      ifBid: false
    };
  },

  mounted() {

  },

  watch: {
    asinList: {
      handler() {
        this.querySuggestKeyword();
      },
      deep: true
    },
    targetingMode: {
      handler() {
        this.querySuggestKeyword();
      },
      deep: true
    },
  },

  methods: {

    getField() {
      const arr = this.tableData.map(item => {
        return {
          bid: item.keywordBid,
          keywordText: item.suggestedKeyword,
          matchType: item.matchType
        };
      });
      return arr;
    },

    empty() {
      this.ifBid = false;
      this.qian = '$';
      this.jia = '+';
      this.bidval = '';
      this.bid = 'suggestedBid';
      this.tableData = this.tableData.map(item => item);
    },

    handleKeyword(row) {
      this.tableData.forEach(item => {
        if (this.isObjectValueEqual(item, row)) {
          item.isInput = true;
        }
      });
    },

    handleLeaveKeyword(row) {
      this.tableData.forEach(item => {
        if (this.isObjectValueEqual(item, row)) {
          item.isInput = false;
        }
      });
    },

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

    formatter(value) {
      // if (value === 'exact') {
      //   return '精准';
      // } else if ()
      switch (value) {
      case 'exact':
        return '精准';
      case 'phrase':
        return '词组';
      case 'broad':
        return '广泛';
      default: '';
        
        
      }
    },

    querySuggestKeyword() {
      const params = {
        storeId: '1525044033420210177',
        strategy: this.targetingMode,
        suggestionKeywordMatchType: this.suggestionKeywordMatchType,
        asinList: this.asinList,
      };
      querySuggestKeyword(params).then(res => {
        if (res.data.code === 200) {
          this.categoryData = res.data.data;
        }
      });
    },

    handleCheck() {
      if (this.category === '建议关键词') {
        this.querySuggestKeyword();
      }
    },

    handleSelectAll() {
      this.categoryData = this.categoryData.map(item => {
        item.matchTypeSuggestedBids.forEach(t => {
          t.checked = true;
          this.tableData.push({
            ...t,
            suggestedKeyword: item.suggestedKeyword,
            isInput: false,
            keywordBid: '',
          });
        });
        return item;
      });
    },

    handleSelect(keyword, matchType, row) {
      
      this.categoryData = this.categoryData.map(item => {
        if (item.suggestedKeyword === keyword) {
          item.matchTypeSuggestedBids.forEach(t => {
            if (t.matchType === matchType) {
              t.checked = true;
            }
          });
        }
        return item;
      });

      this.tableData.push({
        ...row,
        suggestedKeyword: keyword,
        isInput: false,
        keywordBid: '',
      });
    },

    handleSelectionChange(val) {
      this.selectData = val;
    },

    batchDelete() {
      const suggestedKeyword = [];
      this.tableData = this.tableData.filter(item => ![...this.selectData].includes(item));
      this.selectData = this.selectData.map(item => {
        suggestedKeyword.push(item.suggestedKeyword);
        delete item.suggestedKeyword;
        delete item.keywordBid;
        delete item.isInput;
        return item;
      });

      this.categoryData = this.categoryData.map(item => {
        if ([...suggestedKeyword].includes(item.suggestedKeyword)) {
          item.matchTypeSuggestedBids.forEach(t => {
            this.selectData.some(s => {
              if (this.isObjectValueEqual(s, t)) {
                t.checked = false;
              }
            });
          });
        }
        return item;
      });

    },

    handleDelete(row, idx) {
      this.tableData.splice(idx, 1);

      this.categoryData = this.categoryData.map(item => {
        if (item.suggestedKeyword === row.suggestedKeyword) {
          item.matchTypeSuggestedBids.forEach(t => {
            if (t.matchType === row.matchType) {
              t.checked = false;
            }
          });
        }
        return item;
      });
    },

    batchUseBid() {
      this.tableData = this.tableData.map(item => {
        if ([...this.selectData].includes(item)) {
          item.keywordBid = item.suggestedBid;
        }
        return item;
      });
    },

    useBid(row) {
      this.tableData = this.tableData.map(item => {
        if (this.isObjectValueEqual(item, row)) {
          item.keywordBid = row.suggestedBid;
        }
        return item;
      });
    },

    setBid() {
      this.tableData.forEach(item => {
        if ([...this.selectData].includes(item)) {
          for (const key in item) {
            if (key === this.bid) {
              const chu = this.jia === '-' ? Number(item[key]) - Number(item[key]) * (Number(this.bidval) / 100) : Number(item[key]) + Number(item[key]) * (Number(this.bidval) / 100);
              const jia = this.jia === '-' ? Number(item[key]) - Number(this.bidval) : Number(item[key]) + Number(this.bidval);
              const res = this.qian === '$' ? jia : chu;
              if (res > 0.02) {
                item[key] = res.toFixed(2);
                this.empty();
              } else {
                this.$message({
                  type: 'error',
                  message: '关键词竞价必须大于等于0.02'
                });
                this.ifBid = true;
              }
            }
          }
        }
        // return item;
      });
    },

    handleTab(val) {
      this.category = val.target.innerText;
    },

    handleTextarea(value) {
      const maxLines = 1000;
      let valueArr = value.split(/\r\n|\r|\n/);
      if (valueArr.length > maxLines) {
        valueArr = valueArr.slice(0, maxLines);
        value = valueArr.join('\n');
        this.textarea = value;
      }
      this.keywordList = valueArr;
    },

    searchKeyword() {
      const params = {
        storeId: '1525044033420210177',
        strategy: 'legacyForSales',
        suggestionKeywordMatchType: this.suggestionKeywordMatchType,
        asinList: this.asinList,
        keywordList: this.keywordList
      };

      const tableData = [];

      manualQueryKeyword(params).then(res => {
        if (res.data.code === 200) {
          res.data.data.map(item => {
            item.matchTypeSuggestedBids.forEach(t => {
              tableData.push({
                ...t,
                suggestedKeyword: item.suggestedKeyword,
                isInput: false,
                keywordBid: '',
              });
            });
          });
        }
      });

      this.tableData = tableData;
    }

  }
};
</script>

<style lang="scss" scoped>

  ::v-deep .el-input__inner {
    padding: 0 0 0 5px;
  }

  ::v-deep .el-select-dropdown__wrap .el-scrollbar__wrap {
    text-align: center;
  }

  ::v-deep .el-button--small, .el-button--small.is-round {
    padding: 9px 9px;
  }

  .row {
    display: flex;justify-content: space-between; 
    line-height: 32px;
  }

  ::v-deep .el-dialog__header {
    padding: 0;
  }

  ::v-deep .el-checkbox {
    margin-right: 5px;
  }
 
  ::v-deep .el-textarea__inner {
    min-height: 200px !important;
    max-height: 200px;
  }

</style>
