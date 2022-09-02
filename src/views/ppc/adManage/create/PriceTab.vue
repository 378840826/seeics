<template>
  <div style="backgroundColor: #f2f2f2">
    <el-button type="text" @click="handleTab($event)" 
      :style="{color: category === '建议商品' && '#409EFF' || '#000'}">建议商品</el-button>
    <el-button type="text" @click="handleTab($event)"
      :style="{color: category === '搜索商品' && '#409EFF' || '#000'}">搜索商品</el-button>
    <el-button type="text" @click="handleTab($event)"
      :style="{color: category === '批量输入' && '#409EFF' || '#000'}">批量输入</el-button>
    
    <el-row class="row">
      <el-col :span="8" v-if="category === '建议商品'" style="textAlign: end;">
        <el-button
          @click="handleSelectAll"
          type="text"
          size="small"
          style="padding: 8px 36px;fontSize: 14px">全选</el-button></el-col>

      <el-col :span="8" v-if="category === '搜索商品'">
         <el-input 
            v-model="search" 
            clearable
            @clear="queryPriceList"
            placeholder="输入标题或ASIN" 
            size="small">
            <el-button @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
          </el-input>
      </el-col>

      <el-col :span="8" v-if="category === '批量输入'">
      </el-col>

      <el-col :span="15">
        <el-button @click="batchDelete" size="small" :disabled="!selectData.length">批量删除</el-button>
        <el-button @click="batchUseBid" size="small" :disabled="!selectData.length">应用建议竞价</el-button>
        <el-button @click="ifBid = true" size="small" :disabled="!selectData.length">设置竞价</el-button>
        <span v-if="ifBid">
          <el-select v-model="bid" @change="handleBid" size="small" style="width: 140px">
            <el-option
              v-for="item in bidList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
              style="textAlign: center"
            />
          </el-select>

          <el-select v-if="bid !== 'bid'" v-model="modified" size="small" style="width: 50px">
            <el-option
              v-for="item in modifiedList"
              :key="item.label"
              :value="item.label"
              style="textAlign: center"
            >{{item.label}}</el-option>
          </el-select>

          <el-select v-if="bid !== 'bid'" v-model="symbol" size="small" style="width: 50px">
            <el-option
              v-for="item in symbolList"
              :key="item.label"
              :value="item.label"
              style="textAlign: center"
            >{{item.label}}</el-option>
          </el-select>
          
          <el-input v-if="bid !== 'bid'" size="small" v-model="bidval" style="width: 50px"/>
          <el-input v-else size="small" v-model="bidval" style="width: 150px"/>
          <el-button @click="empty" size="small" style="marginLeft: 10px;">取消</el-button>
          <el-button @click="setBid" type="primary" size="small" :disabled="!bidval">确定</el-button>
        </span>
      </el-col>
    </el-row>

    <el-row class="row">
      <el-col :span="8" v-if="category === '建议商品'">
         <el-table
            :data="data"
            v-loading="loading"
            border
            style="width: 100%"
            height="350"
            class="table">
            <el-table-column
              prop="priceInfo"
              label="商品信息">

              <template slot-scope="scope">
                <div>
                  ASIN：{{scope.row.priceInfo}}
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
                    @click="handleSelect(scope.row)"
                    type="text"
                    style="padding: 0"
                    :disabled="scope.row.checked">选择</el-button>
                </template>
            </el-table-column>
        </el-table>
      </el-col>

      <el-col :span="8" v-if="category === '搜索商品'">
        <!-- <div v-for="item in searchData" :key="item.priceInfo" class="searchList">
          <div style="width: 80%">ASIN：{{item.priceInfo}}</div>
          <div style="width: 20%">选择</div>
        </div> -->
        <div  class="tableBox">
          
        <table border="1" style="width: 100%;borderColor: #EBEEF5;backgroundColor: white;">
          <tr v-for="item in searchData" :key="item.priceInfo" style="lineHeight: 32px">
            <td style="paddingLeft: 10px;">ASIN：{{item.priceInfo}}</td>
            <td style="textAlign: center">
              <el-button @click="handleSearchSelect(item)" type="text" :disabled="item.checked">选择</el-button>
            </td>
          </tr>
        </table>
        </div>
      </el-col>

      <el-col :span="7" v-if="category === '批量输入'">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入多个ASIN，用英文逗号，空格或换行分隔"
          v-model="textarea"
          @input="handleTextarea"
          style="maxHeight: 200px;minHeight: 200px;">
        </el-input>
      </el-col>

      <el-col :span="1" v-if="category === '批量输入'">
        <el-button
          @click="textareaSelect"
          :disabled="!textareaArr.filter(Boolean).length"
          type="text"
          style="text-align: center;line-height: 200px;">添加</el-button>
      </el-col>

      <el-col :span="15">
         <el-table
            :data="tableData"
            border
            @selection-change="handleSelectionChange"
            style="width: 100%"
            height="350"
            class="table">
            <!-- <el-table-column
              type="selection"
              width="50"/> -->
            <el-table-column
              type="selection"
              width="50px"
            />
            <el-table-column
              prop="priceInfo"
              label="商品信息">

              <template slot-scope="scope">
                <div>
                  ASIN：{{scope.row.priceInfo}}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="bid"
              align="center"
              label="商品竞价"
              width="100">

              <template slot-scope="scope">
                <div 
                  @mouseenter="handleKeyword(scope.row)"
                  @mouseleave="handleLeaveKeyword(scope.row)"
                >
                  <div v-if="!scope.row.isInput">{{scope.row.bid}}</div>
                  <el-input
                    v-else
                    v-model="scope.row.bid"
                    size="small"
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="address"
              width="100"
              :render-header="headerDelete">

              <template slot-scope="scope">
                  <el-button
                    @click="handleDelete(scope.row.priceInfo, scope.$index)"
                    type="text"
                    style="padding: 0">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>

</template>

<script>

import DragStrip from './DragStrip.vue';
import { getPriceList, queryPriceList } from '@/api/ppc/adManage';
import Table from '@/views/util/table.vue';

export default {

  components: {
    DragStrip,
    Table
  },

  props: {
    asinList: {
      type: Array
    },
    targetingMode: {
      type: String,
    },
    mwsStoreId: {
      type: String,
      require: true,
    },
    defaultBid: {
      type: String,
      require: true,
    },
    budget: {
      type: String,
      require: true,
    },
    marketplace: {
      type: String,
    }
  },

  data() {
    return {
      loading: false,
      category: '建议商品',
      modified: '+',
      symbol: '$',
      bidval: '',
      textarea: '',
      bid: 'bid',
      data: [],
      tableData: [],
      textareaArr: [],
      searchData: [],
      search: '',
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
      modifiedList: [
        {
          label: '+',
        },
        {
          label: '-',
        },
      ],
      symbolList: [
        {
          label: '$',
        },
        {
          label: '%',
        },
      ],
      categoryData1: [
        {
          date: '6666'
        }
      ],
      dialogVisible: false,
      ifBid: false,
      selectData: []
    };
  },

  watch: {
    asinList: {
      handler() {
        this.getPriceList();
      },
      deep: true
    },
    targetingMode: {
      handler() {
        this.getPriceList();
      },
      deep: true
    },
  },

  mounted() {
    this.getPriceList();
  },
  

  methods: {

    getField() {
      const arr = this.tableData.map(item => {
        return {
          asin: item.priceInfo,
          bid: item.bid
        };
      });
      return arr;
    },

    handleKeyword(row) {
      this.tableData.forEach(item => {
        if (item.priceInfo === row.priceInfo) {
          item.isInput = true;
        }
      });
    },

    handleLeaveKeyword(row) {
      this.tableData.forEach(item => {
        if (item.priceInfo === row.priceInfo) {
          if (Number(item.bid) > Number(this.budget)) {
            this.$message({
              type: 'error',
              message: '竞价不能超过广告活动日预算'
            });
          } else if (Number(item.bid) < 0.02) {
            this.$message({
              type: 'error',
              message: '竞价必须大于等于0.02'
            });
          } else if (this.marketplace === 'JP' && Number(item.bid) < 2) {
            this.$message({
              type: 'error',
              message: '竞价必须大于等于2'
            });
          } else if (!item.bid) {
            this.$message({
              type: 'error',
              message: '请输入竞价'
            });
          } else {
            item.isInput = false;
          }
        }
      });
    },

    headerDelete() {
      return (
        <el-button type="text" style="padding: 0" onClick={this.handleAllDelete}>全部删除</el-button>
      );
    },

    getPriceList() {
      const params = {
        storeId: this.mwsStoreId,
        strategy: this.targetingMode,
        asinList: this.asinList,
      };
      this.loading = true;
      getPriceList(params).then(res => {
        this.loading = false;
        if (res.data.code === 200) {
          this.data = res.data.data.length && res.data.data.map(item => {
            return {
              priceInfo: item,
              checked: false,
              bid: this.defaultBid,
              isInput: false
            };
          });
        }
      }).catch( () => {
        this.loading = false;
      });
    },

    handleSelectionChange(val) {
      this.selectData = val;
    },

    handleBid() {
      this.bidval = '';
    },

    batchDelete() {
      const arr = this.selectData.map(item => item.priceInfo);
      this.tableData = this.tableData.filter(item => !arr.includes(item.priceInfo));
      this.data.forEach(item => {
        if (arr.includes(item.priceInfo)) {
          item.checked = false;
        }
      });
      this.searchData.forEach(item => {
        if (arr.includes(item.priceInfo)) {
          item.checked = false;
        }
      });
    },

    batchUseBid() {
      let flag = false;
      this.tableData.map(item => {
        if (!item.suggestedBid) {
          flag = true;
        }
      });

      if (flag) {
        this.$message({
          type: 'warning',
          message: '暂无建议竞价'
        });
        return;
      }

      this.tableData = this.tableData.map(item => {
        if ([...this.selectData].includes(item)) {
          item.bid = item.suggestedBid;
        }
        return item;
      });
    },

    empty() {
      this.ifBid = false;
      // this.symbol = '$';
      // this.modified = '+';
      // this.bidval = '';
      // this.bid = 'suggestedBid';
      // this.tableData = this.tableData.map(item => item);
    },

    setBid() {
      if (this.bid === 'bid') {

        if (Number(this.bidval) > this.budget) {
          this.$message({
            type: 'error',
            message: '竞价不能超过广告活动日预算'
          });
          return;
        } else if (Number(this.bidval) < 0.02) {
          this.$message({
            type: 'error',
            message: '竞价必须大于等于0.02'
          });
          return;
        } else if (this.marketplace === 'JP' && Number(this.bidval) < 2) {
          this.$message({
            type: 'error',
            message: '竞价必须大于等于2'
          });
          return;
        }

        this.tableData.forEach(item => {
          if ([...this.selectData].includes(item)) {
            
            item.bid = this.bidval;
          }
          // return item;
        });
        return;
      }
      
      const arr = this.selectData.filter(s => !s[this.bid]);
      if (arr.length) {
        this.$message({
          type: 'warning',
          message: '选中关键词无建议竞价，无法设置该选项'
        });
        return;
      }

      this.tableData.forEach(item => {
        if ([...this.selectData].includes(item)) {
          for (const key in item) {
            if (key === this.bid) {
              const chu = this.modified === '-' ? Number(item[key]) - Number(item[key]) * (Number(this.bidval) / 100) : Number(item[key]) + Number(item[key]) * (Number(this.bidval) / 100);
              const modified = this.modified === '-' ? Number(item[key]) - Number(this.bidval) : Number(item[key]) + Number(this.bidval);
              const res = this.symbol === '$' ? modified : chu;
              if (res > 0.02) {
                item[key] = res.toFixed(2);
                // this.empty();
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

    handleSelectAll() {
      if (!this.defaultBid) {
        this.$message({
          type: 'warning',
          message: '请先输入正确的默认竞价'
        });
        return;
      }
      const arr = this.tableData.length && this.tableData.map(item => item.priceInfo) || [];
      this.data.forEach(item => {
        if (!arr.includes(item.priceInfo)) {
          item.checked = true;
          this.tableData.push({
            ...item,
            bid: this.defaultBid
          });
        }
      });
    },

    handleSelect(row) {
      if (!this.defaultBid) {
        this.$message({
          type: 'warning',
          message: '请先输入正确的默认竞价'
        });
        return;
      }
      this.data = this.data.map(item => {
        if (item.priceInfo === row.priceInfo) {
          item.checked = true;
        }
        return item;
      });
      this.tableData.push({
        ...row,
        bid: this.defaultBid
      });
    },

    handleAllDelete() {
      this.tableData = [];
      this.data.forEach(item => {
        item.checked = false;
      });
      this.searchData.forEach(item => {
        item.checked = false;
      });
    },

    handleDelete(asin, index) {
      this.tableData.splice(index, 1);
      this.data.forEach(item => {
        if (item.priceInfo === asin) {
          item.checked = false;
        }
      });
      this.searchData.forEach(item => {
        if (item.priceInfo === asin) {
          item.checked = false;
        }
      });
      
    },

    handleTab(val) {
      this.category = val.target.innerText;
      // this.getPriceList();
    },

    handleSearch() {
      if (!this.defaultBid) {
        this.$message({
          type: 'warning',
          message: '请先输入正确的默认竞价'
        });
        return;
      }
      const params = {
        storeId: this.mwsStoreId,
        // strategy: this.targetingMode,
        keyword: this.search
      };
      queryPriceList(params).then(res => {
        if (res.data.code === 200) {
          res.data.data.records.map(item => {
            const arr = this.searchData.length && this.searchData.map(item => item.priceInfo) || [];
            if (!arr.includes(item.asin)) {
              this.searchData.push({
                priceInfo: item.asin,
                checked: false,
                bid: this.defaultBid,
                isInput: false
              });
            }
          });
        }
      });
    },

    handleSearchSelect(row) {
      const arr = this.tableData.length && this.tableData.map(item => item.priceInfo) || [];
      this.searchData.forEach(item => {
        if (item.priceInfo === row.priceInfo && !arr.includes(item.priceInfo)) {
          item.checked = true;
          this.tableData.push(item);
        }
      });
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

    textareaSelect() {
      if (!this.defaultBid) {
        this.$message({
          type: 'warning',
          message: '请先输入正确的默认竞价'
        });
        return;
      }

      const res = /^[A-Za-z0-9]+$/;
      let flag = false;

      this.textareaArr.map(item => {
        const arr = this.tableData.length && this.tableData.map(item => item.priceInfo) || [];
        if (!arr.includes(item)) {
          if (!res.test(item) || item.length !== 10) {
            flag = true;
          } else {
            this.tableData.push({
              priceInfo: item,
              checked: false,
              bid: this.defaultBid,
              isInput: false
            });
          }
        }
      });

      if (flag) {
        this.$message({
          type: 'error',
          message: '部分ASIN格式输入有误，请重新输入'
        });
      }
      
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
  }

  ::v-deep .el-dialog__header {
    padding: 0;
  }

  ::v-deep .el-textarea__inner {
      min-height: 350px !important;
      max-height: 350px;
  }

  .tableBox {
    max-height: 350px;
    overflow: hidden;
    overflow-y: auto;
    border: 1px solid #EBEEF5;
    box-sizing: border-box;
  }

</style>
