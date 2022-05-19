<template>
  <div class="sa">
    <div class="tabel">
      <span>规则名称：</span>
      <el-select v-model="launch">
        <el-option
          v-for="item in launchOption"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <el-table
      :data="tableData"
      :header-cell-style="{'text-align':'center'}"
      style="width: 100%; margin: 10px 0 0 0">
      <el-table-column
        label="广告活动"
        prop="campaign"
        align="center"
      >
        <template slot-scope="scope">
          <div>{{scope.row.campaign}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="广告组"
        prop="adGroup"
        align="center"
      >
        <template slot-scope="scope">
          <div>{{scope.row.adGroup}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="匹配类型"
        prop="matching"
        align="center"
      >
        <template slot-scope="scope">
          <el-select v-model="scope.row.matching" placeholder="请选择">
            <el-option
              v-for="item in matchType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="竞价参考"
        prop="did"
        align="center"
      >
        <template slot-scope="scope">
          <el-select v-model="scope.row.bid" placeholder="请选择">
            <el-option
              v-for="item in bidSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="竞价策略"
        align="center"
      >
        <template slot-scope="scope">
         <div v-if="scope.row.bid === '选项1'">无需选择竞价</div> 
         <el-input v-else v-model="scope.row.bidding" type="text" style="width: 50%">
            <div slot="suffix">$</div>
         </el-input>
        </template>
      </el-table-column>
      <el-table-column
        label=""
      >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'automatic',
  data() {
    return {
      tableData: [
        {
          campaign : '自动化标签所在广告活动',
          adGroup: '自动化标签所在广告组',
          matching: '选项1',
          bid: '选项1',
          bidding: ''
        },
        // {
        //   huo: '自动化标签所在广告活动1',
        //   zu: '自动化标签所在广告组1',
        //   value: '选项1',
        //   jin: '选项1'
        // }
      ],
       matchType: [{
          value: '选项1',
          label: '精准匹配'
        }, {
          value: '选项2',
          label: '词组匹配'
        }, {
          value: '选项3',
          label: '广泛匹配'
        }
       ],
       bidSelect: [
         {
           value: '选项1',
           label: '广告组默认竞价'
         }, {
           value: '选项2',
           label: '固定竞价'
         }
       ],
      launch: '1',
      launchOption: [
        {
          label: '添加到投放',
          value: '1'
        },
        {
          label: '添加到否定投放',
          value: '2'
        }
      ]
    };
  },
  watch: {
    tableData: {
      handler(val) {
        console.log(val)
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
  .tabel {
    display: flex;
    margin-top: 20px;
  }
  
  .sa {
    ::v-deep .el-table th {
      padding: 0;
      min-width: 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      text-overflow: ellipsis;
      vertical-align: middle;
      position: relative;
      text-align: left;
      // font-weight: 100;
      color: black;
      font-size: 14px;
      background: #ccc;
    }
  }
  ::v-deep .el-input__icon {
    line-height: 30px;
  }
   
</style>