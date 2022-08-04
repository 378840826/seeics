<template>
  <basic-container>
    <div>
      <el-select 
        v-model="form.userIds" 
        @change="handleAccout($event, 'search')"
        filterable 
        placeholder="请输入企业会员账号" 
        size="small" 
        class="search">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

       <el-popover
            placement="bottom-start"  
            width="800"
            trigger="click">
            <div class="filtrate-content">
              <range-input
                v-for="item in filterList"
                :key="item.value"
                :label="item.label + '：'"
                :valueFilter="strToMoneyStr"
                v-model="form.filter[item.value]"
              />
            </div>
            <el-button slot="reference" size="small" class="search">高级筛选</el-button>
        </el-popover>

      <el-select v-model="form.status" size="small" class="search">
        <el-option
          v-for="item in statusList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

      <el-button @click="nonPayment" size="small" class="search">未支付</el-button>

      <el-date-picker
        v-model="form.dateRange"
        type="daterange"
        value-format="yyyy-MM-dd"
        align="right"
        unlink-panels
        :clearable="false"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
   
        :picker-options="pickerOptions"
        size="small"
        class="search"
      />

      <el-popover
        width="100"
        trigger="click">
        <div>
            <el-checkbox 
              v-for="item in fixedList" 
              :key="item.value" 
              v-model="item.disabled"
              @change="handleFixed">
              {{item.label}}
            </el-checkbox>
            <h4>功能</h4>
            <el-checkbox 
              v-for="item in funList" 
              :key="item.value" 
              v-model="item.disabled"
              @change="handleFun"
            >
              {{item.label}}
            </el-checkbox>
        </div>
        <el-button slot="reference" size="small" class="search">自定义数据</el-button>
      </el-popover>
    </div>

    <el-table
      :data="data"
      :header-cell-style="{background: '#ccc', color: 'rgb(48, 49, 51)'}"
      border
      style="width: 100%">

      <el-table-column
        label="企业会员"
        prop="account"
        min-width="180"
        fixed="left"
        align="center"
      >
        <template slot-scope="scope">
          <el-select 
            v-if="scope.row.add" 
            v-model="scope.row.userId" 
            @change="handleAccout($event, scope.$index)"
            placeholder="请输入企业会员" 
            size="small">
              <el-option
                v-for="item in accountList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <div v-else>{{ scope.row.account }}</div>
        </template>
      </el-table-column>

      <el-table-column
        label="角色"
        align="center"
        min-width="100"
      >
        <template>
          <div>权限配置</div>
        </template>
      </el-table-column>

      <el-table-column
        label="状态"
        prop="status"
        align="center"
        min-width="60"
      >
        <template slot-scope="scope">
            <div>{{handleStatus(scope.row.status)}}</div>
        </template>
      </el-table-column>

      <el-table-column
        v-for="item in handlerList"
        :key="item.value"
        :label="item.label"
        :prop="item.value"
        min-width="140"
        align="center"
      >
        <template slot-scope="scope">
          <div 
            v-if="!scope.row['common' + item.value]" 
            :class="(item.value === 'expiredTime' || item.value === 'payTime' || item.value === 'cost') 
            ? '' : 'nus'">{{ scope.row[item.value] }}
            <el-button 
              type="text" 
              size="mini" 
              @click="handleEdit(scope.row.id, 'common' + item.value, scope.row[item.value], item.value)"
              class="el-icon-edit edit"/>
          </div>
          <div v-else class="input">
            <el-input v-model="scope.row[item.value]" type="number"/>
            <div style="width: 68px; float: right;">
              <el-button 
                size="mini" 
                @click="handleClose(scope.row.id, 'common' + item.value, item.value)"
                class="el-icon-close"/>
              <el-button
                size="mini" 
                class="el-icon-check" 
                @click="handleSeve(scope.row[item.value + (item.value === 'levelPrice' ? 'Id' : 'InterestId')], 
                  scope.row[item.value], 
                  item.value, 
                  scope.row.add,
                  scope.$index)"
                :disabled="!scope.row[item.value]"
                style="marginLeft: 0"/>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        width="100"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.add" 
            @click="handleAdd(scope.row)"
            type="text"
          >添加</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.current"
      :page-sizes="[20, 50, 100]"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total"
      class="page">
    </el-pagination>
  </basic-container>
</template>

<script>

import { 
  getHeader, 
  queryEnterpriseList, 
  updateLevelNum, 
  updateLevePrice, 
  queryMemberUserList,
  addLeve,
} from '@/api/member/corporate';
import { getDateRangeForKey } from '@/util/date';
import RangeInput from '@/views/ppc/searchTerm/components/RangeInput.vue';
import { strToMoneyStr } from '@/util/numberString';
import { setStore, getStore } from '@/util/store';
import page from '@/router/page';

const gets = getStore({ name: 'funList' });
const fixedMeun = getStore({ name: 'fixedMeun' });

// 日期选择器配置
const pickerOptions = {
  // 限制可选日期为最近 60 天
  disabledDate: (time) => {
    const nowDate = (new Date()).getTime();
    const durationTime = 60 * 24 * 3600 * 1000;
    const twoMonths = nowDate - durationTime;
    return time.getTime() > Date.now() || time.getTime() < twoMonths;
  },
  // 快捷选项
  shortcuts: [
    {
      text: '今日',
      onClick(picker) {
        picker.$emit('pick', getDateRangeForKey(1));
      }
    }, {
      text: '昨日',
      onClick(picker) {
        picker.$emit('pick', getDateRangeForKey('yesterday'));
      }
    }, {
      text: '上周',
      onClick(picker) {
        picker.$emit('pick', getDateRangeForKey('lastWeek'));
      }
    }, {
      text: '上月',
      onClick(picker) {
        picker.$emit('pick', getDateRangeForKey('lastMonth'));
      }
    }, {
      text: '最近7天',
      onClick(picker) {
        picker.$emit('pick', getDateRangeForKey(7));
      }
    }, {
      text: '最近30天',
      onClick(picker) {
        picker.$emit('pick', getDateRangeForKey(30));
      }
    }, {
      text: '最近60天',
      onClick(picker) {
        picker.$emit('pick', getDateRangeForKey(60));
      }
    },
  ],
};

export default {
  name: 'corporate',
  components: {
    RangeInput
  },
  data() {
    return {
      pickerOptions,
      form: {
        status: '状态',
        userAccount: '',
        userIds: '',
        dateRange: getDateRangeForKey(30),
        filter: {
          levelPrice: { min: '', max: '' }
        }
      },
      options: [],
      funList: [],
      accountList: [],
      fixedMeun: fixedMeun || [
        {
          label: '购买时间',
          value: 'payTime',
          disabled: true
        },
        {
          label: '过期时间',
          value: 'expiredTime',
          disabled: true,
          isShow: true
        },
        {
          label: '购买价格',
          value: 'levelPrice',
          disabled: true
        },
        {
          label: '成本估算',
          value: 'cost',
          disabled: true
        }
      ],
      filterList: [
        {
          label: '购买价格',
          value: 'levelPrice'
        }
      ],
      statusList: [
        {
          label: '有效',
          value: '有效'
        },
        {
          label: '状态',
          value: '状态'
        },
        {
          label: '失效',
          value: '失效'
        },
        {
          label: '不限',
          value: '不限'
        },
      ],
      data: [],
      page: {
        total: 0,
        size: 20,
        current: 1
      },
      inputVal: 0,
      editFiled: '',
      fun: 0,
      filed: '',
      addObj: {
        add: true,
        account: '',
        status: '',
        payTime: '',
        levelPrice: 0,
        cost: ''
      }
    };
  },

  computed: {
    fixedList: vm => {
      return vm.fixedMeun.filter(item => !item.isShow);
    },
    handlerList: vm => {
      return [...vm.fixedMeun, ...vm.funList].filter(item => item.disabled);
    },
  },

  mounted() {
    queryMemberUserList({ isEnterprise: true }).then(res => {
      this.options = res.data.data.map(item => {
        return {
          label: item.account,
          value: item.id
        };
      });
    });
    queryMemberUserList({ isEnterprise: false }).then(res => {
      this.accountList = res.data.data.map(item => {
        return {
          label: item.account,
          value: item.id
        };
      });
    });
    getHeader().then(res => {
      res.data.map(item => {
        this.addObj = {
          ...this.addObj,
          [item.functionVarName]: 0
        };
        this.form.filter = {
          ...this.form.filter,
          [item.functionVarName]: { min: '', max: '' }
        };
        this.filterList.push({
          value: item.functionVarName,
          label: item.functionName
        });
        this.funList = gets || res.data.map(item => {
          
          return {
            value: item.functionVarName,
            label: item.functionName,
            disabled: true
          };
        });
        
      });
    });
    this.queryEnterpriseList();
  },

  watch: {
    form: {
      handler(val) {
        console.log(val);
      },
      deep: true
    }
  },

  methods: {
    strToMoneyStr,

    queryEnterpriseList() {
      let fun = {};
      for (const key in this.form.filter) {
        // eslint-disable-next-line no-loop-func
        Object.keys(this.form.filter[key]).map(item => {
          fun = {
            ...fun,
            [`${key}${item.trim().toLowerCase().replace(item[0], item[0].toUpperCase())}`]: this.form.filter[key][item],
          };
        });
      }
      console.log(fun);
      const param = {
        userAccount: this.form.userAccount,
        
      };
      console.log(fun);
      queryEnterpriseList(Object.assign({ current: this.page.current, size: this.page.size }, param, fun)).then(res => {
        this.data = res.data.data.records;
        this.page.total = res.data.data.total;

      });
    },

    handleStatus(val) {
      if (val === 1) {
        return '失效';
      } else if (val === 2) {
        return '有效';
      }
    },

    nonPayment() {
      this.queryEnterpriseList();
      console.log(this.data)
    },

    handleFixed() {
      setStore({ name: 'fixedMeun', content: this.fixedMeun });
    },
    
    handleFun() {
      setStore({ name: 'funList', content: this.funList });
      console.log(getStore({ name: 'funList' }));
    },

    handleAccout(val, idx) {
      if (idx === 'search') {
        this.accountList.map(item => {
          if (item.value === val) {
            this.form.userAccount = item.label;
          }
        });
        return;
      }
      this.accountList.map(item => {
        if (item.value === val) {
          this.data[idx].userAccount = item.label;
        }
      });
    },

    handleEdit(fun, name, val, filed) {
      this.handleClose(this.fun, this.editFiled, this.filed);
      this.inputVal = val;
      this.editFiled = name;
      this.fun = fun;
      this.filed = filed;
      this.data = this.data.map(item => {
        item[name] = false;
        if (item.id === fun) {
          item[name] = true;
        }
        return item;
      });
    },

    handleClose(val, name, filed, addVal) {
      this.data = this.data.map(item => {
        if (item.id === val) {
          item[name] = false;
          item[filed] = addVal || this.inputVal;
          addVal && delete item[name];
        }
        return item;
      });
    },

    handleSeve(id, frequency, filed, add, idx) {
      if (add) {
        this.data[idx][filed] = frequency;
        this.handleClose(id, `common${filed}`, filed, frequency);
        this.editFiled = '';
        this.fun = '';
        this.filed = '';
        return;
      }
      if (filed === 'levelPrice') {
        updateLevePrice({
          id,
          price: frequency
        }).then(res => {
          if (res.data.success) {
            this.$message({
              type: 'success',
              message: '修改价格成功！'
            });
            this.queryEnterpriseList();
            this.updatePriceId = '';
            this.updatePriceName = '';
          }
        });
        return;
      }
      updateLevelNum({
        id,
        frequency
      }).then(res => {
        if (res.data.success) {
          this.$message({
            type: 'success',
            message: '修改成功！'
          });
          this.queryEnterpriseList();
          this.editFiled = '';
          this.fun = '';
          this.filed = '';
        }
      });
    },
    
    handleAdd(row) {
      addLeve({ ...row, price: row.levelPrice }).then(res => {
        console.log(res)
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  .search {
    margin: 0 20px 10px 0
  }
  .filtrate-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
   }
   .page {
      margin: 10px 0;
      float: right;
   }
   
  .input {
    ::v-deep {
        .el-button--mini, .el-button--mini.is-round {
          padding: 5px 10px;
        }
        .el-input__inner {
          height: 24px;
        }
        .el-input__inner::-webkit-inner-spin-button,
        .el-input__inner::-webkit-outer-spin-button {
          -webkit-appearance: none !important;
        }
    }
  }
  .nus:hover {
        .edit {
        padding: 0px 10px;
        display: inline-block;
        }
    }
    .edit {
        display: none;
    }
</style>
