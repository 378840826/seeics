<template>
  <div>
    <el-button type="text" @click="handleTab($event)" 
      :style="{color: category === '建议分类' && '#409EFF' || '#000'}">建议分类</el-button>
    <el-button type="text" @click="handleTab($event)"
      :style="{color: category === '搜索分类' && '#409EFF' || '#000'}">搜索分类</el-button>
    
    <el-row class="row">
      <el-col :span="8" v-if="category === '建议分类'" style="textAlign: end;">
        <el-button type="text" size="small" style="padding: 8px 36px;fontSize: 14px">全选</el-button></el-col>

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
            :data="categoryData1"
            border
            height="200"
            style="width: 100%"
            class="table">
            <el-table-column
              prop="date"
              align="center"
              label="商品信息">
              <template scope="scope">
                 <div>
                    <span>{{scope.row.date}}</span>
                    <el-button 
                      @click="dialogVisible = true"
                      type="text"
                      size="mini" >细化</el-button>
                 </div>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="address"
                width="100"
                label="操作">
                <template scope="row">
                  <el-button type="text" style="padding: 0">选择</el-button>
                </template>
            </el-table-column>
        </el-table>
      </el-col>

      <el-col :span="8" v-if="category === '搜索分类'">

      </el-col>

      <el-col :span="15">
         <el-table
            :data="tableData"
            border
            height="200"
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

    <el-dialog
      :visible.sync="dialogVisible"
      width="500px"
      append-to-body
      :show-close="false"
      center
      top="40vh"
   
      @close="handleClose"
      destroy-on-close>
      <div>
        <div class="label">
          <span>品牌：</span>
          <div class="div" style="height: 290px; ">
            <p class="p">select</p>
            <div style="border: 1px solid;height: 260px;">
              <el-input  size="small" style="width: 260px; margin: 10px 0px 0px 20px"/>
              <ul class="ul">
                <li><el-checkbox label="6666">66666</el-checkbox></li>
              </ul>
            </div>
          </div>
        </div>

        <div class="label" style="marginTop: 20px">
          <span>价格区间：</span>
          <div>
            $
            <el-input size="small" value="1000" style="width: 100px"/>
            ——
            <el-input size="small" value="1000" style="width: 100px"/>
          </div>
        </div>

        <div class="label" style="marginTop: 20px">
          <span>Review区间：</span>
          <div>
            <drag-strip/>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogVisible = false">取 消{{max}}</el-button>
          <el-button type="primary" size="small" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>

import DragStrip from './DragStrip.vue';

export default {
  components: {
    DragStrip
  },
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
      categoryData1: [
        {
          date: '6666'
        }
      ],
      dialogVisible: false,
    };
  },

  methods: {
    handleTab(val) {
      this.category = val.target.innerText;
    },
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

  .label{
    width: 400px;
    display: flex;
    // line-height: 32px;

    span {
      width: 25%;
      line-height: 32px;
    }
    .div {
      width: 75%;
    }

    .p {
        margin: 0px;
        text-align: center;
        padding: 5px 0px;
        border: 1px solid;
    }

    .ul {
      height: 100px;
      width: 260px;
      margin-left: 20px;
    }

    .round1 {
    //   width: 6px;
    //   height: 6px;
      border: 8px solid #ccc;
      border-radius: 8px;
      position: absolute;
    }

    .round {
    //   width: 6px;
    //   height: 6px;
      border: 8px solid #ccc;
      border-radius: 8px;
      position: absolute;
      left: 40px;
    }
    
    
  }

</style>
