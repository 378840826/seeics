<template>
  <basic-container>
    <el-row  type="flex" justify="end" class="cardPrice">
      <el-col :span="4" v-for="item in priceList" :key="item.name">
        <el-card 
          shadow="never" 
          :body-style="{padding: '10px', height: '150px'}">
          <p>{{item.name}}</p>
          <el-button size="mini" @click="handlePrice(item.defaultRoleId)">权限配置</el-button>
          <div>
            <div v-for="i in item.priceList" :key="i.id">
              <p v-if="!i['common' + item.name]" class="nus">{{i.price + '/' + i.unitName}}
                <el-button 
                  type="text" 
                  size="mini" 
                  @click="updatePrice(i.id, 'common' + item.name, i.price)"
                  class="el-icon-edit edit"/>
              </p>
              <div v-else :style="{marginTop: i.unitName === '月' ? '13px' : ''}">
                <el-input v-model="i.price" type="number" style="width: 60%"/>
                <div style="width: 40%; float: right;">
                  <el-button 
                    size="mini" 
                    style="width: 50%"
                    @click="priceClose(i.id, 'common' + item.name)"
                    class="el-icon-close"/>
                  <el-button
                    size="mini" 
                    class="el-icon-check" 
                    @click="priceSeve(i.id, i.price)"
                    :disabled="!i.price"
                    style="marginLeft: 0; width: 50%"/>
                </div>
              </div>
            </div>
            
          </div>
          <p v-if="item.name === '普通会员'"  class="bot p">永久免费</p>
        </el-card>
      </el-col>
      <el-col :span="4">
          <el-card shadow="never" :body-style="{padding: '10px', height: '150px', position: 'relative'}">
            <p>企业会员</p>
            <el-button size="mini" class="bot" @click="$router.push('/contact')">联系客服</el-button>
          </el-card>
        </el-col>
    </el-row>  
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
      <el-table-column
        v-for="item in column"
        :key="item.prop"
        align="center"
        :prop="item.prop"
        :label="item.label">
        <template slot-scope="scope">
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
                @click="hanldeSeve(scope.row[item.prop + 'interestId'], scope.row[item.prop])"
                :disabled="!scope.row[item.prop]"
                style="marginLeft: 0"/>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="address"
        label="企业会员">
        <template slot-scope="">
          <div>—</div>
        </template>
      </el-table-column>
    </el-table>
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
import { buyInfo, updateLevePrice, updateLevelNum } from '@/api/member/member';
import { getRole, grant, grantTree, } from '@/api/system/role';
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
      box: false,
      menuTreeObj: [],
      menuGrantList: [],
      roleId: '',
      props: {
        label: 'title',
        value: 'key'
      },
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
      filed: '',
      updatePriceVal: 0,
      updatePriceId: '',
      updatePriceName: ''
    };
  },
  mounted() {
    this.buyPage();
  },
  methods: {
    buyPage() {
      buyInfo().then(res => {
        const obj = new Array(res.data.data.memberLevelInfoListVoList[0].functionList.length);
        this.priceList = res.data.data.memberLevelInfoListVoList;
        res.data.data.memberLevelInfoListVoList.map(item => {
          item.functionList.map((s, i) => {
            obj[i + 1] = {
              ...obj[i + 1],
              [item.name]: s.frequency,
              functionName: s.functionName,
              unitName: s.unitName,
              function: s.function,
              [`${item.name}interestId`]: s.interestId
            } ;
          });
        });
        this.data = obj;
      });
      
    },
    handlePrice(id) {
      console.log(id)
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
    hanldeEdit(fun, name, val, filed) {
      this.hanldClose(this.fun, this.editFiled, this.filed);
      this.inputVal = val;
      this.editFiled = name;
      this.fun = fun;
      this.filed = filed;
      this.data = this.data.map(item => {
        // item[name] = false;
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
    },
    hanldeSeve(id, frequency) {
      updateLevelNum({
        id,
        frequency
      }).then(res => {
        if (res.data.success) {
          this.$message({
            type: 'success',
            message: '修改成功！'
          });
          this.buyPage();
          this.editFiled = '';
          this.fun = '';
          this.filed = '';
        }
      });
    },
    updatePrice(id, name, price) {
      this.priceClose(this.updatePriceId, this.updatePriceName);
      this.updatePriceVal = price;
      this.updatePriceId = id;
      this.updatePriceName = name;
      this.priceList = this.priceList.map(item => {
        item.priceList.forEach(i => {
          if (i.id === id) {
            i[name] = true;
          }
        });
        return item;
      });
    },
    priceClose(id, name) {
      this.priceList = this.priceList.map(item => {
        item.priceList.forEach(i => {
          if (i.id === id) {
            i[name] = false;
            i['price'] = this.updatePriceVal;
          }
        });
        return item;
      });
    },
    priceSeve(id, price) {
      updateLevePrice({
        id,
        price
      }).then(res => {
        if (res.data.success) {
          this.$message({
            type: 'success',
            message: '修改价格成功！'
          });
          this.buyPage();
          this.updatePriceId = '';
          this.updatePriceName = '';
        }
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
  },
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
        margin-top: 55px;
      }
    }
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
