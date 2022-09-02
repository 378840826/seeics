<template>
  <basic-container>
    <div>
      <el-select 
        style="width: 300px"
        v-model="form.userIds" 
        @change="handleAccout($event, 'search')"
        multiple
        collapse-tags
        filterable
        remote
        :remote-method="remoteMethod"
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
            ref="filterPorover" 
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
            <div style="float: right;">
              <el-button @click="handleFilter" size="small" :disabled="filterBtn">确定</el-button>
              <el-button @click="handleClaer" size="small">清空</el-button>
            </div>
            <el-button slot="reference" size="small" class="search">高级筛选</el-button>
        </el-popover>

      <el-select 
        v-model="form.status" 
        @change="handleStatus"
        size="small" 
        class="search">
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
        @change="handleDate"
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
            placeholder="请选择企业会员" 
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
        min-width="120"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.defaultRoleId" size="mini" 
          @click="handlePrice(scope.row.defaultRoleId)">权限配置</el-button>
          <div v-else>权限配置</div>
        </template>
      </el-table-column>

      <el-table-column
        label="状态"
        prop="status"
        align="center"
        min-width="60"
      >
        <template slot-scope="scope">
            <div>{{getStatus(scope.row.status)}}</div>
        </template>
      </el-table-column>

      <el-table-column
        v-for="item in handlerList"
        :key="item.value"
        :label="`${item.label}${item.unitName ? `(${item.unitName})` : ''}`"
        :prop="item.value"
        min-width="180"
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
            <el-input 
              :ref="`${item.value}` + scope.$index"
              v-model="scope.row[item.value]" 
              @blur="numberChange($event, item.value, scope.$index)"
              type="number"/>
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
        width="150"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.add" 
            @click="handleAdd(scope.row)"
            type="text"
            size="mini"
          >添加</el-button>
           <!-- <el-button 
            v-if="scope.row.delete" 
            @click="handleAdd(scope.row, true)"
            type="text"
            size="mini">重新添加</el-button> -->
          <el-button 
            v-if="scope.row.delete" 
            @click="handleDelete(scope.row.id)"
            type="text"
            size="mini">删除</el-button>
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

    <el-dialog
      width="850px"
      :visible.sync="dialogVisible"
      :show-close="false"
      center
      append-to-body>
      <div class="explain">
       {{content}}
      <button v-copy="content">复制路径</button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="角色权限配置"
               append-to-body
               :visible.sync="box"
               width="345px">
      <el-tabs type="border-card">
        <el-tab-pane label="菜单权限">
          <el-tree :data="menuGrantList"
                   show-checkbox
                   node-key="id"
                   ref="treeMenu"
                   :default-checked-keys="menuTreeObj"
                   :props="props">
          </el-tree>
        </el-tab-pane>
      </el-tabs>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="box = false">取 消</el-button>
        <el-button type="primary"
                   @click="hanldeSubmit">确 定</el-button>
      </span>
    </el-dialog>
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
  deleteLeve
} from '@/api/member/corporate';
import { getRole, grant, grantTree, } from '@/api/system/role';
import { getDateRangeForKey } from '@/util/date';
import RangeInput from '@/views/ppc/searchTerm/components/RangeInput.vue';
import { strToMoneyStr } from '@/util/numberString';
import { setStore, getStore } from '@/util/store';

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
      dialogVisible: false,
      filterBtn: false,
      content: '',
      form: {
        status: null,
        userAccount: '',
        userIds: [],
        dateRange: getDateRangeForKey(30),
        filter: {
          levelPrice: { min: '', max: '' }
        }
      },
      options: [],
      funList: [],
      accountList: [],
      box: false,
      menuTreeObj: [],
      menuGrantList: [],
      roleId: '',
      props: {
        label: 'title',
        value: 'key'
      },
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
          value: 1
        },
        // {
        //   label: '状态',
        //   value: ''
        // },
        {
          label: '失效',
          value: 0
        },
        {
          label: '不限',
          value: null
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

  directives: {
    'copy': {
      bind(el, { value }) {
        el.$value = value;
        el.handler = () => {
          if (!el.$value) {
            return alert('无复制内容'); //全局提示
          }
          const textarea = document.createElement('textarea');
          textarea.style.position = 'absolute';
          textarea.style.left = '-9999px';
          textarea.value = el.$value;
          el.appendChild(textarea);
          textarea.select();
          const result = document.execCommand('Copy');
          if (result) {
            alert('复制成功');
          }
          document.body.removeChild(textarea);
        };
        el.addEventListener('click', el.handler);
      },
      componentUpdated(el, { value }) {
        el.$value = value;
      },
      unbind(el) {
        el.removeEventListener('click', el.handler);
      }

    }
  },

  watch: {
    'form.filter': {
      handler(val) {
        const arr = [];
        for (const key in val) {
          Object.keys(val[key]).map(() => {
            if (val[key]['min'] > val[key]['max']) {
              arr.push(true);
            } else {
              arr.push(false);
              this.filterBtn = false;
            }
          });
        }
        this.filterBtn = arr.filter(Boolean).length ? true : false;
      },
      deep: true,
    }
  },

  mounted() {
    this.queryMemberUserList();
    
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
            unitName: item.unitName,
            disabled: true
          };
        });
        
      });
    });
    this.queryEnterpriseList();
  },

  methods: {
    strToMoneyStr,

    diffDate(val) {
      const star = new Date(val);
      const end = new Date();
      const diff = end - star;
      const diffSeconds = diff / 1000;
      const HH = Math.floor(diffSeconds / 3600);
      return HH;
    },

    handlePrice(id) {
      this.menuTreeObj = [];
      this.roleId = id;
      grantTree()
        .then(res => {
          this.menuGrantList = res.data.data.menu;
          getRole(id).then(res => {
            this.menuTreeObj = res.data.data.menu;
            this.box = true;
          });
        });
    },

    hanldeSubmit() {
      const menuList = this.$refs.treeMenu.getCheckedKeys();
      grant([this.roleId], menuList, [], []).then(() => {
        this.box = false;
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
      });
    },

    // 修改不合法字符以及数字
    numberChange (val, name, index) { // name字段名，index索引
      // 校验正数，带两位小数
      const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      val.target.style.borderColor = '';
      // this.$emit('change', false);
      if (isNaN(val.target.value)) { 
        val.target.value = parseFloat(val.target.value) ;
      } 
      // 修改超出两位小数值
      if (val.target.value.indexOf('.') > 0){
        val.target.value = val.target.value.slice(0, val.target.value.indexOf('.') + ( name === 'levelPrice' ? 3 : 1));
        this.data[index][name] = val.target.value;
      }
      if (val.target.value > 100000) {
        val.target.style.borderColor = 'red';
        this.$message({
          type: 'error',
          message: '值不能超过100000'
        });
        val.target.value = '';
        // this.$emit('change', true);
      }
      if (!reg.test(val.target.value)) {
        val.target.value = '';
        val.target.style.borderColor = 'red';
        this.data[index][name] = '';
      }
    },

    queryMemberUserList() {
      queryMemberUserList({ isEnterprise: false }).then(res => {
        this.accountList = res.data.data.map(item => {
          return {
            label: item.account,
            value: item.id
          };
        });
      });
    },
    
    queryEnterpriseList(date) {
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
      const param = {
        userAccount: this.form.userAccount,
        userIds: this.form.userIds,
        status: this.form.status,
        startTime: date && date[0] || null,
        endTime: date && date[1] || null
      };
      queryEnterpriseList({ current: this.page.current, size: this.page.size }, Object.assign(param, fun)).then(res => {
        this.data = res.data.data.records.map(item => {
          if (this.diffDate(item.createTime) > 24 && !item.status) {
            item.delete = true;
          }
          return item;
        });
        this.page.total = res.data.data.total;
        if (this.page.total / this.page.size <= this.page.current) {
          this.data.push(JSON.parse(JSON.stringify(this.addObj)));
        }
        
      });
    },

    handleSizeChange(size) {
      this.page.size = size;
      this.queryEnterpriseList();
    },

    handleCurrentChange(current) {
      this.page.current = current;
      this.queryEnterpriseList();
    },

    remoteMethod(query) {
      queryMemberUserList({ isEnterprise: true, account: query }).then(res => {
        this.options = res.data.data.map(item => {
          return {
            label: item.account,
            value: item.id
          };
        });
      });
    },

    clear() {
      for (const key in this.form.filter) {
        Object.keys(this.form.filter[key]).forEach(item => {
          this.form.filter[key][item] = '';
        });
      }
    },

    handleFilter() {
      this.queryEnterpriseList();
      this.$refs.filterPorover.doClose();
    },

    handleClaer() {
      this.clear();
      this.queryEnterpriseList();
      this.$refs.filterPorover.doClose();
    },

    handleStatus() {
      this.queryEnterpriseList();
    },

    handleDate() {
      this.queryEnterpriseList(this.form.dateRange);
    },

    getStatus(val) {
      if (val === 0) {
        return '失效';
      } else if (val === 1) {
        return '有效';
      }
    },

    nonPayment() {
    //   this.queryEnterpriseList();
    },

    handleFixed() {
      setStore({ name: 'fixedMeun', content: this.fixedMeun });
    },
    
    handleFun() {
      setStore({ name: 'funList', content: this.funList });
    },

    handleAccout(val, idx) {
      if (idx === 'search') {
        this.options.map(item => {
          if (item.value === val) {
            this.form.userAccount = item.label;
          }
        });
        this.queryEnterpriseList();
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
        if (frequency <= 0) {
          this.$message({
            type: 'error',
            message: '购买价格不能低于等于0'
          });
          return;
        }
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
    
    handleAdd(row, flag) {
      if (!flag && !row.userId) {
        this.$message({
          type: 'error',
          message: '请选择企业会员'
        });
        return;
      }
      if (row.levelPrice <= 0) {
        this.$message({
          type: 'error',
          message: '请输入购买价格'
        });
        return;
      }
      addLeve({ ...row, price: row.levelPrice,
        userId: flag ? row.enterpriseUserId : row.userId,
        userAccount: row.userAccount ? row.userAccount : row.account }).then(res => {
        if (res.data.code === 200) {
          this.dialogVisible = true;
          this.content = `${window.location.href.split('index')[0]}buy?levelPrice=${res.data.data.levelPrice}&levelPriceId=${res.data.data.levelPriceId}`;
          this.queryMemberUserList();
          this.queryEnterpriseList();
        }
      });
    },

    handleDelete(id) {
      deleteLeve(id).then(res => {
        if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          this.queryMemberUserList();
          this.queryEnterpriseList();
        }
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
