<template>
  <basic-container>
    <!-- <avue-crud
      :option="option"
      :data="data"
     
      @on-load="queryIndentPage"
    ></avue-crud> -->
    <!-- <div class="cardPrice"> -->
      <el-row  type="flex" justify="end" class="cardPrice">
        <el-col :span="4" v-for="(item, idx) in priceList" :key="item.name">
           
          <el-card 
            shadow="never" 
            :body-style="{padding: '10px', height: '150px'}">
            <p>{{item.name}}</p>
            <div>
              <p v-for="i in item.priceList" :key="i.id">{{i.price + '/' + i.unitName}}</p>
            </div>
            <!-- <el-button v-if="item.name !== '普通会员'" size="mini" @click="handlePrice(idx, item.name)">购买</el-button> -->
            <p  class="bot p">永久免费</p>
          </el-card>
        </el-col>
        <el-col :span="4">
            <el-card shadow="never" :body-style="{padding: '10px', height: '150px', position: 'relative'}">
              <p>企业会员</p>
              <el-button size="mini" class="bot" @click="$router.push('/contact')">联系客服</el-button>
            </el-card>
          </el-col>
      </el-row>  
    <!-- </div> -->
    <el-table
      :data="data"
      :header-cell-style="{background: '#ccc', color: 'rgb(48, 49, 51)'}"
      border
      style="width: 100%">
      <el-table-column
        align="center"
        prop="functionName"
        label="功能">
      </el-table-column>
      <!-- <el-table-column
        prop="普通会员"
        align="center"
        label="普通会员">
        <template slot-scope="scope"> -->
          <!-- <el-input v-model="scope.row['普通会员']" @input="inputs(scope.row)"/> -->
          <!-- <div v-if="!scope.row.commonVip" class="nus">{{`${scope.row['普通会员'] || 0}` + scope.row.unitName}}
            <el-button 
              type="text" 
              size="mini" 
              @click="hanldeEdit(scope.row.function, 'commonVip', scope.row['普通会员'])"
              class="el-icon-edit edit"/>
          </div>
          <div v-else>
            <el-input v-model="scope.row['普通会员']"/>
            <div style="width: 68px; float: right;">
              <el-button 
                size="mini" 
                @click="hanldClose(scope.row.function, 'commonVip', '普通会员')"
                class="el-icon-close"/>
              <el-button size="mini" class="el-icon-check" style="marginLeft: 0"/>
            </div>
          </div>
        </template>
      </el-table-column> -->
    
      <el-table-column
        v-for="item in column"
        :key="item.prop"
        align="center"
        :prop="item.prop"
        :label="item.label">
        <template slot-scope="scope">
          <!-- <el-input v-model="scope.row['普通会员']" @input="inputs(scope.row)"/> -->
          <div v-if="!scope.row['commonVip' + item.prop]" class="nus">{{`${scope.row[item.prop] || 0}` + scope.row.unitName}}
            <el-button 
              type="text" 
              size="mini" 
              @click="hanldeEdit(scope.row.function, 'commonVip' + item.prop, scope.row[item.prop], item.prop)"
              class="el-icon-edit edit"/>
          </div>
          <div v-else>
            <el-input v-model="scope.row[item.prop]" type="number"/>
            <div style="width: 68px; float: right;">
              <el-button 
                size="mini" 
                @click="hanldClose(scope.row.function, 'commonVip' + item.prop, item.prop)"
                class="el-icon-close"/>
              <el-button
                size="mini" 
                class="el-icon-check" 
                :disabled="!scope.row[item.prop]"
                style="marginLeft: 0"/>
            </div>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column
        align="center"
        prop="VIP"
        label="VIP">
      </el-table-column>
      <el-table-column
        align="center"
        prop="高级VIP"
        label="高级VIP">
      </el-table-column>
      <el-table-column
        align="center"
        prop="至尊VIP"
        label="至尊VIP">
      </el-table-column> -->
      <el-table-column
        align="center"
        prop="address"
        label="企业会员">
        <template slot-scope="">
          <div>—</div>
        </template>
      </el-table-column>
    </el-table>
    <!-- <buyDialog
      :visible="isBuyDialog"
      v-if="isBuyDialog"
      v-model="isBuyDialog"
      :info="{
        priceLists,
        title,
        i
      }"
    /> -->
  </basic-container>
</template>

<script>
import { buyInfo, buyPage } from '@/api/member/member';
import buyDialog from './componets/buyDialog';
export default {
  components: {
    buyDialog
  },
  data() {
    return {
      data: [],
      priceList: [],
      isBuyDialog: false,
      column: [
        {
          label: '普通会员',
          prop: '普通会员',
        },
        {
          label: 'VIP',
          prop: 'VIP',
        },
        {
          label: '高级VIP',
          prop: '高级VIP',
        },
        {
          label: '至尊VIP',
          prop: '至尊VIP',
        },
      ],
      option: {
        emptyText: '暂无数据',
        addBtn: false,
        border: true,
        columnBtn: false,
        refreshBtn: false,
        saveBtn: false,
        updateBtn: false,
        cancelBtn: false,
        delBtn: false,
        menu: false,
        editBtn: false,
        align: 'center',
        menuAlign: 'left',
        rowKey: 'id',
        height: 300,
        // selection: true,
        tip: false,
        column: [
          {
            label: '付款时间',
            prop: 'payTime',
          },
          {
            label: '订单号',
            prop: '普通会员',
          },
          {
            label: '订单详情',
            prop: 'VIP',
          },
          {
            label: '支付方式',
            prop: '高级VIP',
          },
          {
            label: '支付金额(￥)',
            prop: '至尊VIP',
          },
        ],
      },
      // page: {
      //   total: 0,
      //   currentPage: 1,
      //   layout: 'total, sizes, prev, pager, next, jumper',
      //   pageSize: 20,
      //   pageSizes: [20, 50, 100],
      // },
      inputVal: 0,
      editFiled: '',
      fun: 0,
      filed: ''
    };
  },
  mounted() {
    buyInfo().then(res => {
      console.log(res);
    });
    this.buyPage();
  },
  methods: {
    inputs(s) {
      console.log(s)
    },
    buyPage() {
      buyPage({ current: 1, size: 20, levelType: 1 }).then(res => {
        const obj = new Array(res.data.data.records[0].functionList.length);
        this.priceList = res.data.data.records;
        res.data.data.records.map(item => {
          item.functionList.map((s, i) => {
            obj[i + 1] = {
              ...obj[i + 1],
              [item.name]: s.frequency,
              functionName: s.functionName,
              unitName: s.unitName,
              function: s.function,
            } ;
          });
        });
        this.data = obj;
      });
      
    },
    handlePrice(index, name) {
      
      this.isBuyDialog = true;
      this.title = name;
      this.priceLists = this.priceList[index].priceList;
    },
    hanldeEdit(fun, name, val, filed) {
      this.hanldClose(this.fun, this.editFiled, this.filed);
      this.inputVal = val;
      this.editFiled = name;
      this.fun = fun;
      this.filed = filed;
      this.data = this.data.map(item => {
        item[name] = false;
        if (item.function === fun) {
          item[name] = true;
        }
        return item;
      });
    },
    hanldClose(val, name, filed) {
      this.data = this.data.map(item => {
        if (item.function === val) {
          item[name] = false;
          item[filed] = this.inputVal;
        }
        return item;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  .cardPrice {
    display: flex;
    width: 100%;
    text-align: center;
    margin: auto;
    margin-bottom: 4px;
    position: relative; 
  }
  .bot {
     
      margin-top: 74px;
      &.p {
        margin-top: 95px;
      }
    }
  ::v-deep {
    .el-button--mini, .el-button--mini.is-round {
      padding: 5px 10px;
    }
    .el-input__inner {
      height: 28px;
    }
    .el-input__inner::-webkit-inner-spin-button,
    .el-input__inner::-webkit-outer-spin-button {
      -webkit-appearance: none !important;
    }
  }
  .nus:hover {
    .edit {
    display: inline-block;
  }
  }
  .edit {
    display: none;
  }
</style>
