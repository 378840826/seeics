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
        <!-- <el-button size="small">批量删除</el-button>
        <el-button size="small">应用建议竞价</el-button>
        <el-button size="small">设置竞价</el-button>
        <span>
          <el-select v-model="bid" size="small" style="width: 140px">
            <el-option
              v-for="item in bidList"
              :key="item.label"
              :value="item.label"
              style="textAlign: center"
            >{{item.label}}</el-option>
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

          <el-input size="small" value="1000" style="width: 50px"/>
          <el-button size="small" style="marginLeft: 10px;">取消</el-button>
          <el-button type="primary" size="small">确定</el-button>
        </span> -->
      </el-col>
    </el-row>

    <el-row class="row">
      <el-col :span="8" v-if="category === '建议商品'">
         <el-table
            :data="data"
            border
            style="width: 100%"
            height="300"
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
          type="text"
          style="text-align: center;line-height: 200px;">添加</el-button>
      </el-col>

      <el-col :span="15">
         <el-table
            :data="tableData"
            border
            @selection-change="handleSelectionChange"
            style="width: 100%"
            height="300"
            class="table">
            <!-- <el-table-column
              type="selection"
              width="50"/> -->
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
import { getPriceList } from '@/api/ppc/adManage';
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
  },

  data() {
    return {
      category: '建议商品',
      bid: '固定值',
      jia: '+',
      qian: '$',
      textarea: '',
      data: [],
      tableData: [],
      textareaArr: [],
      searchData: [],
      search: '',
      bidList: [
        {
          label: '固定值',
        },
        {
          label: '建议竞价的基础上',
        },
        {
          label: '最高建议竞价',
        },
        {
          label: '最低建议竞价',
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
      categoryData1: [
        {
          date: '6666'
        }
      ],
      dialogVisible: false,
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
          item.isInput = false;
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
      getPriceList(params).then(res => {
        if (res.data.code === 200) {
          this.data = res.data.data.length && res.data.data.map(item => {
            return {
              priceInfo: item,
              checked: false,
              bid: '0.02',
              isInput: false
            };
          });
        }
      });
    },

    handleSelectAll() {
      const arr = this.tableData.length && this.tableData.map(item => item.priceInfo) || [];
      this.data.forEach(item => {
        if (!arr.includes(item.priceInfo)) {
          item.checked = true;
          this.tableData.push(item);
        }
      });
    },

    handleSelect(row) {
      this.data = this.data.map(item => {
        if (item.priceInfo === row.priceInfo) {
          item.checked = true;
        }
        return item;
      });
      this.tableData.push(row);
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
      const params = {
        storeId: this.mwsStoreId,
        strategy: this.targetingMode,
        asinList: [this.search],
      };
      getPriceList(params).then(res => {
        if (res.data.code === 200) {
          this.searchData = res.data.data.length && res.data.data.map(item => {
            return {
              priceInfo: item,
              checked: false,
              bid: '0.02',
              isInput: false
            };
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
      const params = {
        storeId: this.mwsStoreId,
        strategy: this.targetingMode,
        asinList: this.textareaArr,
      };
      const arr = this.tableData.length && this.tableData.map(item => item.priceInfo) || [];
      getPriceList(params).then(res => {
        if (res.data.code === 200) {
          res.data.data.length && res.data.data.map(item => {
            if (!arr.includes(item)) {
              this.tableData.push({
                priceInfo: item,
                checked: false,
                bid: '0.02',
                isInput: false
              });
            }
          });
        }
      });
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
      min-height: 300px !important;
      max-height: 300px;
  }

  .tableBox {
    max-height: 300px;
    overflow: hidden;
    overflow-y: auto;
    border: 1px solid #EBEEF5;
    box-sizing: border-box;
  }

</style>
