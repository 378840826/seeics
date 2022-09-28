<template>
  <div class="tableBox">
    <div style="width: 45%">

        <div class="tableTop">
            <div style="width: 80%;">
                搜索：
                <el-input 
                  v-model="search" 
                  clearable
                  @clear="queryPriceList"
                  placeholder="输入标题、ASIN或SKU"
                  style="width: 80%;"  
                  size="small">
                  <el-button @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </div>
            <div style="width: 20%;text-align: end;padding-right: 40px;cursor: pointer" @click="handleAll">全选</div>
        </div>
      
      <el-table
        :data="tableData"
        border
        height="350"
        style="width: 100%"
        class="table">
        <el-table-column
            prop="itemName"
            label="商品信息">
          <template scope="scope">
            <div style="display: flex; align-items: center">
              <img :src="scope.row.imgUrl" :style="{width: '50px', height: '50px', marginRight: '5px'}"/>
              <ul style="width: calc(100% - 150px); fontSize: 12px;">
                <li>
                  <el-tooltip placement="top">
                    <div style="width: 400px; " slot="content">{{scope.row.itemName}}</div>
                    <div class="itemName" style="fontSize: 14px;">{{scope.row.itemName}}</div>
                  </el-tooltip>
                </li>
                <li>
                  <span style="marginRight: 15px">{{scope.row.price}}</span>
                  <span style="marginRight: 15px">{{scope.row.asin}}</span>
                  <span style="marginRight: 15px">{{scope.row.sellerSku}}</span>
                </li>
              </ul>
              <el-tooltip placement="top">
                <div style="width: 400px; " slot="content">{{scope.row.overallStatusMessageList[0]}}</div>
                <div class="overallStatus">{{overallStatus(scope.row.overallStatus)}}
                  <i v-show="overallStatus(scope.row.overallStatus)" class="el-icon-arrow-down arrow"/>
                </div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column
            prop="name"
            width="100"
            label="库存"
            >
        </el-table-column>
        <el-table-column
            prop="address"
            width="100"
            label="排名">
        </el-table-column> -->
        <el-table-column
            align="center"
            prop="address"
            width="80"
            label="操作">
            <template scope="scope">
              <el-button type="text" @click="handleSelect(scope.row)" :disabled="scope.row.checked || scope.row.ineligible">
                {{scope.row.checked ? '已选' : '选择'}}</el-button>
              <!-- <el-button type="text">选择</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[20, 50, 100]"
        :page-size="page.size"
        :current-page="page.current"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <div style="width: 45%">

      <div class="tableTop">
        <span>{{selectData.length}}个已选商品</span>
        <span style="padding-right: 30px;cursor: pointer" @click="deleteAll">全部删除</span>
      </div>

      <el-table
        :data="selectData"
        border
        height="350"
        style="width: 100%"
        class="table">
        <el-table-column
            prop="itemName"
            label="商品信息">
          <template scope="scope">
            <div style="display: flex; align-items: center">
              <img :src="scope.row.imgUrl" :style="{width: '50px', height: '50px', marginRight: '5px'}"/>
              <ul style="width: calc(100% - 50px); fontSize: 12px;">
                <li>
                  <el-tooltip placement="top">
                    <div style="width: 400px; " slot="content">{{scope.row.itemName}}</div>
                    <div class="itemName" style="fontSize: 14px;">{{scope.row.itemName}}</div>
                  </el-tooltip>
                </li>
                <li>
                  <span style="marginRight: 15px">{{scope.row.price}}</span>
                  <span style="marginRight: 15px">{{scope.row.asin}}</span>
                  <span style="marginRight: 15px">{{scope.row.sellerSku}}</span>
                </li>
              </ul>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column
            prop="name"
            width="100"
            label="库存"
            >
        </el-table-column>
        <el-table-column
            prop="address"
            width="100"
            label="排名">
        </el-table-column> -->
        <el-table-column
            align="center"
            prop="address"
            width="80"
            label="操作">
            <template scope="scope">
              <el-button type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>

import { queryPriceList } from '@/api/ppc/adManage';

export default {

  props: {
    priceAsin: {
      type: Array,
    },
    mwsStoreId: {
      type: String,
      require: true,
    },
  },

  data() {
    return {
      search: '',
      tableData: [],
      selectData: [],
      page: {
        size: 20,
        current: 1
      },
      total: 0
    };
  },

  mounted() {
    this.queryPriceList();
  },

  methods: {

    overallStatus(val) {
      if (val === 'ELIGIBLE ' || !val) {
        return '';
      } else if (val === 'INELIGIBLE ') {
        return '不符合条件';
      } else if (val === 'ELIGIBLE_WITH_WARNING') {
        return '警告';
      }
    },

    getField () {
      const arr = this.selectData.map(item => {
        return {
          sellerSku: item.sellerSku,
          asin: item.asin,
        };
      });
      return arr;
    },

    queryPriceList() {
      queryPriceList({
        ...this.page,
        storeId: this.mwsStoreId,
        keyword: this.search
      }).then(res => {
        if (res.data.code === 200) {
          const arr = this.selectData.length && this.selectData.map(item => item.sellerSku) || [];
          this.tableData = res.data.data.records.map(item => {
            if (arr.includes(item.sellerSku)) {
              item.checked = true;
            } else if (item.overallStatus === 'ELIGIBLE_WITH_WARNING' || item.overallStatus === 'INELIGIBLE') {
              item.ineligible = true;
            }
            return item;
          });
          this.total = res.data.data.total;
        }
      });
    },

    handleSearch() {
      this.queryPriceList();
    },

    handleCurrentChange(val) {
      this.page.current = val;
      this.queryPriceList();
    },

    handleSizeChange(val) {
      this.page.size = val;
      this.queryPriceList();
    },

    handleAll() {
      this.tableData = this.tableData.map(item => {
        if (!item.ineligible) {
          item.checked = true;
          this.selectData.push(item);
        }
        return item;
      });
      
      // this.selectData = this.tableData.filter(item => item.checked);
      this.$emit('update:priceAsin', this.selectData.map(item => item.asin));
    },

    handleSelect(row) {
      this.tableData = this.tableData.map(item => {
        if (item.sellerSku === row.sellerSku) {
          item.checked = true;
          this.selectData.push(item);
        }
        return item;
      });

      // this.selectData = this.tableData.filter(item => item.checked);
      this.$emit('update:priceAsin', this.selectData.map(item => item.asin));
    },

    deleteAll() {
      this.tableData = this.tableData.map(item => {
        item.checked = false;
        return item;
      });

      this.selectData = [];
      this.$emit('update:priceAsin', this.selectData.map(item => item.asin));
    },

    handleDelete(idx, row) {
      this.tableData = this.tableData.map(item => {
        if (item.sellerSku === row.sellerSku) {
          item.checked = false;
        }
        return item;
      });

      this.selectData.splice(idx, 1);
      this.$emit('update:priceAsin', this.selectData.map(item => item.asin));
    }
  }
};
</script>

<style lang="scss" scoped>

  .tableBox {
    width: 100%;
    display: flex;
    justify-content: space-around;
    border: 1px solid #ccc;
    box-sizing: border-box;
    padding: 5px;
  }

  .tableTop {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    line-height: 32px;
  }

  .table {
    margin: 10px 0;
  }

  .itemName {
    overflow:hidden; 
    text-overflow:ellipsis;
    display:-webkit-box; 
    -webkit-box-orient:vertical;
    -webkit-line-clamp:1; 
    font-size: 12px;
  }

  .overallStatus {
    width: 80px;
    margin-left: 20px;
    font-size: 12px;
    color: #8b93a6;
    cursor: pointer;
    text-align: center;
  }

  .overallStatus:hover {
    .arrow {
      transform: rotate(-180deg);
      -webkit-transform: rotate(-180deg);
      -webkit-transition: -webkit-transform .3s;
      transition: -webkit-transform .3s;
      transition: transform .3s;
      transition: transform .3s,-webkit-transform .3s;
    }
  }

</style>
