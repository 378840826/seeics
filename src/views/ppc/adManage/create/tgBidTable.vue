<template>
  <div style="width: 50%">
    <el-table
      :data="tableData"
      v-loading="loading"
      stripe
      border
      height="333"
      style="width: 100%">
      <el-table-column
        prop="status"
        align="center"
        label="状态"
       >

       <template slot-scope="scope">

          <el-switch
            v-model="scope.row.status">
          </el-switch>
       </template>

      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        label="Targeting Group"
        >

        
      </el-table-column>
      <el-table-column
        prop="address"
        align="center"
        label="建议竞价">

        <template slot-scope="scope">
                <div v-if="scope.row.bid.suggestedBid">
                  <div>{{scope.row.bid.suggestedBid}}
                    <el-button @click="useBid(scope.row)" style="padding: 0">应用</el-button>
                  </div>
                  <div>(${{scope.row.bid.minSuggestedBid}} - ${{scope.row.bid.maxSuggestedBid}})</div>
                </div>
                <div v-else>——</div>
              </template>
      </el-table-column>
      <el-table-column
        prop="keywordBid"
        align="center"
        label="竞价">

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
    </el-table>
  </div>
</template>

<script>

import { queryTargeList } from '@/api/ppc/adManage';

export default {

  props: {
    asinList: {
      type: Array
    },
    targetingMode: {
      type: String
    },
    mwsStoreId: {
      type: String,
      require: true,
    },
    defaultBid: {
      type: String,
      require: true,
    }
  },

  data() {
    return {
      tableData: [],
      loading: false
    };
  },

  watch: {
    asinList: {
      handler() {
        this.tableData = [];
        this.queryTargeList();
      },
      deep: true
    },
    targetingMode: {
      handler() {
        this.tableData = [];
        this.queryTargeList();
      },
      deep: true
    },
  },

  mounted() {
    this.queryTargeList();
  },

  methods: {

    getField() {
      const arr = this.tableData.map(item => {
        return {
          bid: item.keywordBid,
          state: item.state ? 'enabled' : 'paused',
          type: item.name
        };
      });
      return arr;
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

    queryTargeList() {
      const params = {
        storeId: this.mwsStoreId,
        strategy: this.targetingMode,
        asinList: this.asinList,
      };
      this.loading = true;
      queryTargeList(params).then(res => {
        if (res.data.code === 200) {
          this.loading = false;
          const data = res.data.data;
          // this.tableData = res.data.data.map(item => {
            
            
          //   return obj;
          // });
          const obj = {};

          for (const key in data) {
            // obj.name = 
            obj.bid = data[key];
            this.tableData.push({
              name: key,
              bid: data[key],
              status: true,
              isInput: false,
              keywordBid: this.defaultBid,
            });
          }
        }
      });
    },

    useBid(row) {
      this.tableData = this.tableData.map(item => {
        if (this.isObjectValueEqual(item, row)) {
          item.keywordBid = row.bid.suggestedBid;
        }
        return item;
      });
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
          if (item.keywordBid < 0.02) {
            this.$message({
              type: 'error',
              message: '竞价必须大于等于0.02'
            });
            // item.isInput = false;
          } else if (!/(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0)$)|(?:^[0-9]\.[0-9](?:[0-9])?$)/.test(item.keywordBid)) {
            if (item.keywordBid.indexOf('.') > 0){
              item.keywordBid = item.keywordBid.slice(0, item.keywordBid.indexOf('.') + 3);
              item.isInput = false;
            } else {
              item.keywordBid = '';
            }
          } else {
            item.isInput = false;
          }
          
        }
      });
    },
  }
};
</script>
