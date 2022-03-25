<template>
  <div>
  <third-register></third-register>
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
          <el-input v-model="formInline.searchKeyword" placeholder="请输入需要分析的关键词"
          ></el-input>
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
        <span class="formspan">页</span>
        <el-button class="download" @click="download">下载可视化模板</el-button>
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
        <template slot="searchKeyword" slot-scope="scope">
        
          <div>
            {{scope.row.searchKeyword}}
          </div>
          <div v-if="scope.row.crawlingSearchResultCount && scope.row.crawlingSearchResultPageSize && scope.row.status === 'COMPLETED'">
            <span style="color: 'black'">
              关键词搜索结果超过{{scope.row.crawlingSearchResultCount}}个，免费显示搜索结果前2页（每页可能{{scope.row.crawlingSearchResultPageSize}}个，以实际导出为准）
            </span>            
          </div>
        </template>
        <template  slot="menu" slot-scope="scope">
          <div v-if="scope.row.status === 'COMPLETED' && scope.row.excelUrl" class="derivedresultbtn">
            <a :href="`/api${scope.row.excelUrl}`" download>导出分析结果</a>
            <span class="analysisaginspan" @click="analysiskeywords(scope.row.id, scope.row.recordTime)">重新分析</span>
            <div>
              <span class="erroecolor">{{scope.row.failurePromptStr}}</span>
            </div>
          </div>
          <div v-else-if="scope.row.status === 'ANALYZE_FAILED'" class="derivedresultbtn">
            <el-button type="info">分析失败</el-button>
            <span class="analysisaginspan" @click="analysiskeywords(scope.row.id)">重试</span>
            <div>
              <span class="erroecolor">{{scope.row.failurePromptStr}}</span>
            </div>
          </div>
          <div v-else-if="scope.row.status === 'COMPLETED' && !scope.row.excelUrl" class="derivedresultbtn">
            <el-button type="info">分析失败</el-button>
            <div>
              <span class="erroecolor">该关键词没有找到相关商品</span>
            </div>
            <div>
              <span class="erroecolor">{{scope.row.failurePromptStr}}</span>
            </div>
                         
          </div>
          <div v-else class="derivedresultbtn">
            <el-progress
              :percentage="scope.row.progress*100"
              :format="format"
              :text-inside="true"
              :stroke-width="30"
            ></el-progress>
            <div>
              <span class="erroecolor">{{scope.row.failurePromptStr}}</span>
            </div>
          </div> 
          <div
            v-if="scope.row.status === 'COMPLETED' && scope.row.excelUrl"
            class="derivedresultbtn"
            style="marginTop: 5px"
          >
            <div
              class="avuecrudclass" 
              v-if="scope.row.wordFrequencyProgress === null && scope.row.wordFrequencyProgress !== '1.00'"
            >
              <a 
                v-if="!scope.row.loading" 
                @click="wordStatistics(scope.row.id)"
              >
                生成标题词频 <i :class="scope.row.loading ? 'el-icon-loading' : ''"></i>
              </a>
              <a v-else>生成标题词频 <i :class="'el-icon-loading'"></i></a>
            </div>
            <el-progress 
              v-else-if="scope.row.wordFrequencyProgress !== '1.00'" 
              :percentage="scope.row.wordFrequencyProgress*100" 
              :format="wordFormat" 
              :text-inside="true" 
              :stroke-width="30"
            ></el-progress>
            <a v-else :href="`/api${scope.row.wordFrequencyExcelUrl}`" download>导出标题词频</a>
            <!-- <span class="analysisaginspan" @click="detail(scope.row.id)">详情</span> -->
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
import { getkeywordList, analysiskeyword, wordStatistics, download, keyWordReset } from '@/api/keyword/keyword';


export default {
 
  data() {
    return {
      formInline: {
        searchCountry: 'US',
        searchKeyword: '',
        searchTopPage: '2',
      },
      user: {},
      data: [],
      dialogVisible: false, //两周内是否搜索过弹框
      desc: false, //排序值
      timer: null, //定时器名称
      restnum: 10, //今日剩余数据
      derivedresult: true, //导出分析结果按钮，
      failanalysis: false, //分析失败按钮，
      analysisproccess: false, //正在分析按钮，还要考虑过程，应该是对象
      results: false, //词频分析定时器
      result: false, //关键词分析定时器
      id: '',
      page: {
        total: 0,
        //pagerCount: 5,
        currentPage: 1,
        layout: 'total, sizes, prev, pager, next, jumper',
        pageSize: 10,
        pageSizes: [10, 20, 30, 50],
        //background:false,
      },
      option: {
        emptyText: '没有找到相关商品，请重新查询',
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
        column: [
          {
            label: '更新时间',
            prop: 'recordTime',
            sortable: true, //排序
            width: 200,
            //slot:true
          },
          {
            label: '站点',
            prop: 'searchCountry',
            width: 283,
          },
          {
            label: '关键词',
            prop: 'searchKeyword',
            // width:700,
            slot: true,            
          },
          {
            label: '操作',
            prop: 'menu',
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
      return percentage === 100 ? '导出分析报告' : `正在分析${parseInt(percentage)}%`;
    },
    wordFormat(percentage) {
      return percentage === 100 ? '导出标题词频' : `正在生成${parseInt(percentage)}%`;
    },
    wordStatistics(id) {
      wordStatistics(id).then(res => {
        this.id = id;
        if (res.status === 200) {
          this.getkeywordLists();
        }
      });
    },
    //关闭两星期弹框
    refeshList(){
      this.dialogVisible = false;
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
        if (res.data.code === 200){
          //分页数据
          this.page.currentPage = res.data.data.page.current;
          this.page.pageSize = res.data.data.page.size;
          this.page.total = res.data.data.page.total;
          //表格数据
          this.data = res.data.data.page.records;
          //剩余次数数据
          this.restnum = res.data.data.todayFeeSearchCount;
          //添加成功，清空关键词
          // this.formInline.searchKeyword = ''; 
        }
        //判断已分析关键词
        this.data.filter(item => {
          if (item.isRepeat) {
            console.log(item.id);
            const inter = setInterval(() => {
              keyWordReset(item.id).then(res => {
                if (res.status === 200) {
                  clearInterval(inter);
                  this.getkeywordLists();
                }
              });
            }, 30000);
          }
        });
        //有定时器先关掉定时器
        this.timer && this.clearTimer();
        //判断是否要加定时器
        this.result = this.data.some((item) => item.status === 'ANALYZING');
        this.results = this.data.some(item => item.wordFrequencyProgress && item.wordFrequencyProgress !== '1.00');
        //加定时器
        if (this.results) {
          setTimeout(() => {
            this.getkeywordLists();
          }, 1000);
        }
        const arr = this.data.filter( item => item && item.id === this.id);
        if (arr.length > 0 && !arr[0].wordFrequencyProgress) { //添加loading效果
          this.data = this.data.map(item => {
            if (item.id === arr[0].id) {
              item.loading = true;
            }
            return item;
          });
          setTimeout(() => {
            this.getkeywordLists();
          }, 1500);
        }
        if (this.result){
          this.timer = setTimeout(() => {
            this.getkeywordLists();
          }, 60000);
        }
      });
    },
    //清除定时器
    clearTimer() {
      clearTimeout(this.timer);
      this.timer = null;
    },
    //发起关键词分析
    analysiskeywords(id, time){
      //判断次数
      // if(this.restnum <=0 ){
      //    this.$message.error('今日免费次数已用完');
      //     return;
      // }
      //关键词输入框是否为空
      if (!id){
        if (!this.formInline.searchKeyword){
          this.$message.error('请输入关键词');
          return;
        }
      }
      //前端判断时间是否为两周内  

      if (Date.parse(time) <= Date.now() + 14 * 24 * 60 * 60 * 1000){

        //弹确认框
        this.$confirm(`距上次分析时间${time}间隔较短，确认重新分析？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //依旧发请求
          analysiskeyword(this.formInline, id).then(res => {
            if (res.data.msg === '您已经搜索过该关键词，请在搜索结果中操作'){       
            //弹框提箱
              this.dialogVisible = true;
              return;           
            }
            if (res.data.code === 200 ){
            //刷新页面
              this.getkeywordLists();
            }
          });
          //清空关键词
          this.formInline.searchKeyword = '';
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消分析'
          });          
        });

        
      } else {
        analysiskeyword(this.formInline, id).then(res => {
          if (res.data.msg === '您已经搜索过该关键词，请在搜索结果中操作'){       
            //弹框提箱
            this.dialogVisible = true;
            return;           
          }
          if (res.data.code === 200 ){
            //刷新页面
            this.getkeywordLists();
          }
        });
        //清空关键词
        this.formInline.searchKeyword = '';
      }
    },
    detail (id) {
      console.log(id);
      // wordStatistics(id).then(res => console.log(res))
      // this.$router.push({path: "/keywordDetail/index", query: {detailId: id}});
      // this.$router.push({path: `/keyword/detail`});
      
    },
    //下载模板
    download () {
      const loading = this.$loading({
        lock: true,
        text: '正在下载模板...',
        spinner: 'el-icon-loading'
      });
      download().then(res => {
        if (res.status === 200) {
          const content = res.data;
          // const http = res.data.data.replace("http","https")
          // window.location.href = http
          loading.close();
          const blob = new Blob([content], { type: 'application/vnd.ms-excel' });
          const fileName = `${this.$t('可视化模板') }.xlsx`;
          if ('download' in document.createElement('a')) { //非IE下载
            const elink = document.createElement('a');
            elink.download = fileName;
            elink.style.display = 'none';
            elink.href = URL.createObjectURL(blob);
            elink.setAttribute('download', `${this.$t('可视化模板') }.xlsx`);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href);
            document.body.removeChild(elink);
          } else { //IE10+下载
            navigator.msSaveBlob(blob, fileName);
          }
        }
      });
    }  
  },
  watch: {
    'formInline.searchTopPage'(){
      if (this.formInline.searchTopPage > 2){
        this.$alert('付费用户专享，暂未开放', '提示', {
          confirmButtonText: '取消',
          callback: () => {
            this.formInline.searchTopPage = 2;           
          }
        });
      }
    },
    results: {
      handler(val) {
        if (!val) {
          this.getkeywordLists();
        }
      },
      deep: true,
      immediate: false,
    },
    result: {
      handler(val) {
        if (!val) {
          this.getkeywordLists();
        }
      },
      deep: true,
      immediate: false,
    },
  },
  beforeDestroy(){
    this.timer && this.clearTimer();
  },
  destroyed() {
    this.timer && this.clearTimer();
  },
};
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
  a:hover {
    cursor:pointer;
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
.formspan {
  font-size: 12px;
  line-height: 40px;
}
.download {
      margin: 0 0px 0 40px;
}
</style>