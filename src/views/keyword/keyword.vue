<template>
  <div>
  <el-card>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="formInline.searchCountry">
            <el-option label="美国" value="US"></el-option>
            <el-option label="英国" value="EN" disabled></el-option>
            <el-option label="加拿大" value="CA" disabled></el-option>
            <el-option label="法国" value="FR" disabled></el-option>
            <el-option label="意大利" value="SP" disabled></el-option>
            <el-option label="德国" value="GE" disabled></el-option>
          </el-select>
        </el-form-item>
        <el-form-item  class="inputclass">
          <el-input v-model="formInline.searchKeyword" placeholder="请输入需要分析的关键词"></el-input>
        </el-form-item>       
        <el-form-item>
          <el-button type="primary" @click="analysiskeywords()">分析</el-button>
        </el-form-item>
        <el-form-item label="亚马逊搜索结果前: ">
          <el-select v-model="formInline.searchTopPage" class="pageselectclass">
            <el-option label="2" value="2"></el-option>
            <el-option label="4" value=4 ></el-option>
            <el-option label="6" value=6 ></el-option>
            <el-option label="8" value=8 ></el-option>
            <el-option label="10" value=10 ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="warningtext">今日还剩{{restnum}}次免费搜索机会</div>
      <div class="avuecrudclass">
      <avue-crud 
        :data="data" 
        :option="option" 
        v-model="user"
        :page.sync="page"
        @size-change="sizeChange"
        @current-change="currentChange"
        @sort-change="sortChange"
        @on-load="getkeywordLists"
        >
        <template slot="name" slot-scope="scope" >
          <div>{{scope}}</div>
        </template>
        <template slot="keyword" slot-scope="scope">
          <div>{{scope.row.keyword}}</div>
          <div>
            <span v-if="scope.row.searchResultOverCount > 2" class="erroecolor">
              关键词搜索数量超过{{scope.row.searchResultOverCount}}个，免费显示搜索结果前2页(每页显示{{scope.row.searchResultPageSize}}个)
            </span>            
          </div>
        </template>
        <template  slot="menu" slot-scope="scope">
          <div v-if="scope.row.status === 'COMPLETED' && scope.row.excelUrl" class="derivedresultbtn">
            <a :href="scope.row.excelUrl" download>导出分析结果</a>
            <span class="analysisaginspan" @click="analysiskeywords(scope.row.id)">重新分析</span>            
          </div>
          <div v-else-if="scope.row.status === 'ANALYZE_FAILED'" class="derivedresultbtn">
            <el-button type="info">分析失败</el-button>
            <span class="analysisaginspan" @click="analysiskeywords(scope.row.id)">重试</span>            
          </div>
          <div v-else-if="scope.row.status === 'COMPLETED' && !scope.row.excelUrl" class="derivedresultbtn">
            <el-button type="info">分析失败</el-button>
            <div>
              <span class="erroecolor">该关键词没有找到相关商品</span>
            </div>
                         
          </div>
          <div v-else class="derivedresultbtn">
            <el-progress :percentage="scope.row.progress*100" :format="format" :text-inside="true" :stroke-width="30"></el-progress>                       
          </div> 
        </template>       
      </avue-crud>
    </div>
  </el-card>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="30%"
    center=true
    append-to-body=true
  >
    <span>您已经搜索过该关键词，请在搜索结果中操作</span>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="refeshList">确 定</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
import { getkeywordList, analysiskeyword } from "@/api/keyword/keyword";

export default {
 
  data() {
      return {
        formInline:{
          searchCountry: "US",
          searchKeyword: "",
          searchTopPage: "2"
        },
        user:{},
        data: [],
        /** 
        data: [
          {
            id: '01',
            freshtime:'2021-11-03',
            site:'美国',
            keyword:'关键词1',
            status: 'ANALYZE_FAILED',
            searchResultOverCount: 3,
            searchResultPageSize: 16,    
          }, {
            id: '02',
            freshtime:'2021-11-05',
            site:'美国',
            keyword:'关键词2',
            status: 'COMPLETED',
            excelUrl: 'https://az-file-2021.oss-cn-shenzhen.aliyuncs.com/Outerbox/1a4fee82-a8f7-4ca7-9d21-5411e58fb173.pdf'
          },{
            id: '03',
            freshtime:'2021-11-02',
            site:'美国',
            keyword:'关键词2',
            status: 'COMPLED',
            progress: 0.3,
          },{
            id: '04',
            freshtime:'2021-11-05',
            site:'美国',
            keyword:'关键词2',
            status: 'COMPLETED',
            excelUrl: ''
          },
        ],
        */
        dialogVisible: false,//两周内是否搜索过弹框
        desc: false,//排序值
        timer: null,//定时器名称
        restnum: 10,//今日剩余数据
        derivedresult: true,//导出分析结果按钮，
        failanalysis: false,//分析失败按钮，
        analysisproccess:false,//正在分析按钮，还要考虑过程，应该是对象
        page:{
          total: 0,
          //pagerCount: 5,
          currentPage: 1,
          layout: "total, sizes, prev, pager, next, jumper",
          pageSize: 10,
          pageSizes: [10,20,30,50],
          //background:false,
        },
        option:{
          emptyText: '没有找到相关商品，请重新查询',
          addBtn: false,
          border:true,
          columnBtn:false,
          refreshBtn:false,
          saveBtn:false,
          updateBtn:false,
          cancelBtn:false,
          delBtn:false,
          menu:false,
          editBtn:false,
          align:'center',
          menuAlign:'left',
          rowKey:'id',
          column:[
             {
              label:'更新时间',
              prop:'recordTime',
              sortable:true,//排序
              width: 200,
              //slot:true
            },
            {
              label:'站点',
              prop:'searchCountry',
              //width:283,
            },
            {
              label:'关键词',
              prop:'searchKeyword',
              width:700,
              slot:true,            
            },
            {
              label:'操作',
              prop:'menu',
              align: 'left',
              width: 230,
            },
          ]
        },
      };
  },
  mounted(){
     this.getkeywordLists();
  },
  methods: {
    format(percentage) {
        return percentage === 100 ? '导出分析报告' : `正在分析${percentage}%`;
    },
    //关闭两星期弹框
    refeshList(){
      this.dialogVisible=false;
      this.getkeywordLists();
    },
    //pagesize变化
    sizeChange(pageSize){
      this.page.pageSize = pageSize;
      this.getkeywordLists();
    },
    //currentpage 变化
    currentChange(currentPage){
      this.page.currentPage = currentPage;
      this.getkeywordLists();     
    },
    //获取表格数据
    getkeywordLists(){
      getkeywordList(this.page.currentPage, this.page.pageSize).then(res => {
          if(res.data.code === 200){
          //分页数据
          this.page.currentPage = res.data.data.page.current;
          this.page.pageSize = res.data.data.page.size;
          this.page.total = res.data.data.page.total;
          //表格数据
          this.data = res.data.data.page.records;
          //剩余次数数据
          this.restnum = res.data.data.todayFeeSearchCount;
          //添加成功，清空关键词
          this.formInline.searchKeyword = ''; 

          //判断是否要加定时器
          const result = this.data.some((item)=>item.status === "ANALYZING");
          //加定时器
          if(result){
            setTimeout(()=>{
              this.getkeywordLists();
            },60000);
          }
        }
      });
    },
    //清除定时器
    clearTimer() {
			clearInterval(this.timer);
			this.timer = null;
		},
    //发起关键词分析
    analysiskeywords(id){
      //判断次数
      if(this.restnum <=0 ){
         this.$message.error('今日免费次数已用完');
          return;
      }
      //关键词输入框是否为空
      if(!id){
        if(!this.formInline.searchKeyword){
          this.$message.error('请输入关键词');
          return;
        }
      }
      analysiskeyword(this.formInline,id).then(res => {
        if(res.data.code === 400 ){
          //刷新页面
          if(res.data.msg === '您已搜索过该关键词，请在搜索结果中操作'){
          //弹框提箱
          this.dialogVisible = true;
          return;          
          }
        }
        if(res.data.code === 200 ){
          //刷新页面
          this.getkeywordLists();
        }
      })
      //清空关键词
      this.formInline.searchKeyword = '';
    },
  },
  watch:{
    'formInline.searchTopPage'(){
      if(this.formInline.searchTopPage  > 2){
        this.$alert('付费用户专享，暂未开放', '提示', {
          confirmButtonText: '取消',
          callback: () => {
            this.formInline.searchTopPage = 2;           
          }
        });
      }
    }
  },
  beforeDestroy(){
    this.timer && this.clearTimer();
  }
}
</script>

<style lang="scss" scoped>

::v-deep {
  .el-progress-bar__outer {
    border-radius: 1px;
    width: 100px;
  }
  .el-progress-bar__inner {
    border-radius: 1px;
  }
  .el-card__body {
    padding: 20px;
    height: 100%;
  }
  .avue-crud__menu {
    min-height: 0px;
  }
  .el-input__inner {
    height: 30px;
    line-height: 30px;
    width: 160px;
    font-size: 12px;
  }
  .el-button {
    height: 30px;
    padding: 0 20px;
    margin-right: 30px;
  }
  .avue-crud__pagination {
    padding-bottom: 0px;
  }
  .avue-crud__pagination .el-input__inner {   
    width: 100%;
  }
  .el-form-item {
    margin-bottom: 0px;
  }
  .el-form-item__label {
    font-size: 12px;
  }
  .el-progress-bar__inner {
    text-align: center;
  }
}
.avuecrudclass {
  .analysisaginspan {
    display: inline-block;
    color: #409EFF;

    &:hover {
      cursor: pointer;
    }
  }
  ::v-deep .el-card__body {
    padding: 0px;
  }
}
.pageselectclass {
  ::v-deep .el-input__inner {
    width: 100px;
    //margin-left: 30px;
  }
}
.inputclass {
  margin-left: 0;
  ::v-deep .el-input__inner {
    width: 316px;
    margin-left: -11px;
  }
}
.warningtext {
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #FF3332;
  line-height: 24px;
  margin-left: 175px;
}
.derivedresultbtn {
  a{
    display: inline-block;
    height: 30px;
    line-height: 30px;
    width: 100px;
    background: #409EFF;
    color: #fff;
    text-align: center;
    border-radius: 1px;
    margin-right: 30px;
  }
  ::v-deep .el-button {
    border-radius: 1px;
    width: 100px;
    font-size: 12px;
    //margin-left: 30px;
  }  
}
.erroecolor {
  color: #FF3332;
}
</style>