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
            <el-button v-if="item.name !== '普通会员'" size="mini" @click="handlePrice(idx, item.name)">购买</el-button>
            <p v-else class="bot p">永久免费</p>
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
      <el-table-column
        prop="普通会员"
        align="center"
        label="普通会员">
      </el-table-column>
      <el-table-column
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
    <buyDialog
      :visible="isBuyDialog"
      v-if="isBuyDialog"
      v-model="isBuyDialog"
      :info="{
        priceLists,
        title,
        i
      }"
    />
    <el-dialog
      :visible.sync="dialogVisible"
      width="400px"
      :append-to-body="true"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      center
      :before-close="handleClose">
      <span>您已是会员，请到我的会员续费或升级！</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="dialogVisible = false; $router.push('/member/index')">确 定</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
import { buyInfo, buyPage } from '@/api/member/member';
import buyDialog from './componets/buyDialog';
export default {
  name: 'buyVip',
  components: {
    buyDialog
  },
  data() {
    return {
      data: [],
      priceList: [],
      isBuyDialog: false,
      dialogVisible: false,
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
    };
  },
  mounted() {
    // buyInfo().then(res => {
    //   console.log(res);
    // });
    this.buyPage();
  },
  methods: {

    orginPrice(val) {
      switch (val) {
      case 'VIP月':
        return '299.00';
      case 'VIP年':
        return '2999.00';
      case '高级VIP月': 
        return '499.00';
      case '高级VIP年':
        return '4999.00';
      case '至尊VIP月':
        return '999.00';
      case '至尊VIP年':
        return '9999.00';
      default: '';
      }
    },

    buyPage() {
      buyInfo().then(res => {
        const obj = new Array(res.data.data.memberLevelInfoListVoList[0].functionList.length);
        this.priceList = res.data.data.memberLevelInfoListVoList;
        this.dialogVisible = !res.data.data.currentIsDefaultMember;
        res.data.data.memberLevelInfoListVoList.map(item => {
          item.functionList.map((s, i) => {
            obj[i + 1] = {
              ...obj[i + 1],
              [item.name]: s.frequency + s.unitName,
              functionName: s.functionName
            } ;
          });
        });
        this.data = obj;
      });
    },
    handlePrice(index, name) {
      
      this.isBuyDialog = true;
      this.title = name;
      this.priceLists = this.priceList[index].priceList.map(item => {
        return {
          ...item,
          orginPrice: this.orginPrice(`${this.priceList[index].defaultRoleName}${item.unitName}`)
        };
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
</style>
