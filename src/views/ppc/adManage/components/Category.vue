<template>
  <div>
    <el-button type="text" @click="handleTab($event)">建议分类</el-button>
    <el-button type="text" @click="handleTab($event)">搜索分类</el-button>
    
    <el-row class="row">
      <el-col :span="8" v-if="category === '建议分类'"><el-button type="text" size="small">全选</el-button></el-col>

      <el-col :span="8" v-if="category === '搜索分类'">
        <el-input
          placeholder="输入分类名称"
          size="small"/>
      </el-col>

      <el-col :span="15">
        <el-button size="small">批量删除</el-button>
        <el-button size="small">应用建议竞价</el-button>
        <el-button size="small">设置竞价</el-button>
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
      </el-col>
    </el-row>

    <el-row class="row">
      <el-col :span="8" v-if="category === '建议分类'">
         <el-table
            :data="tableData"
            border
            style="width: 100%"
            class="table">
            <el-table-column
                prop="date"
                align="center"
                label="分类">
            </el-table-column>
            <el-table-column
                align="center"
                prop="address"
                width="100"
                label="操作">
            </el-table-column>
        </el-table>
      </el-col>

      <el-col :span="8" v-if="category === '搜索分类'">

      </el-col>

      <el-col :span="15">
         <el-table
            :data="tableData"
            border
            @selection-change="handleSelectionChange"
            style="width: 100%"
            class="table">
            <el-table-column
              type="selection"
              width="45">
            </el-table-column>
            <el-table-column
              prop="date"
              align="center"
              label="Targeting">
            </el-table-column>
            <el-table-column
              prop="date"
              align="center"
              label="建议竞价"
              width="120">
            </el-table-column>
            <el-table-column
              prop="date"
              align="center"
              label="分类竞价"
              width="120">
            </el-table-column>
            <el-table-column
              align="center"
              prop="address"
              width="100"
              label="操作">
            </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>

</template>

<script>

export default {
  
  data() {
    return {
      category: '建议分类',
      bid: '固定值',
      jia: '+',
      qian: '$',
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
    };
  },

  methods: {
    handleTab(val) {
      this.category = val.target.innerText;
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

</style>
