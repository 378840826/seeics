<template>
  <el-form :model="formInline">
  <el-row>
    <el-col :span="5">
      <div >
        <el-scrollbar>
          <basic-container >
            <!-- <div class="selectBox"> -->
        <el-form-item v-model="formInline.searchCountry">
        <el-select class="select" v-model="formInline.searchCountry" size="small">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
            >
            </el-option>
        </el-select>
        </el-form-item>
      <!-- </div> -->
          <avue-tree class="box" ref="tree" :option="treeOption" :data="treeData" @node-click="nodeClick">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span :id="data.id">{{ data.title }}</span>
            </span>
          </avue-tree>
          </basic-container>
        </el-scrollbar>
      </div>
    </el-col>
    <el-col :span="19">
      <basic-container>
        <!-- <el-header class="header" style="height: 124px;"> -->
            <el-row class="button">
              <el-button 
                v-for="item in deptCategory" 
                :key="item.text" :class="{active: active == item.text}" 
                @click="onClick(item)"
                size="small"
              >{{item.text}}</el-button>
            </el-row>   
            <el-row style="marginTop: 20px">
              <el-form-item v-model="formInline.searchKeyword">
                <el-col :span="15" class="searchBox">
                  <el-autocomplete
                    :popper-append-to-body="false"
                    placeholder="输入分类名称，快速定位分类"
                    size="small"
                    class="autocomplete"
                    v-model="formInline.searchKeyword"
                    :fetch-suggestions="querySearchAsync"
                    @select="handleSelect"
                  >
                    <template slot-scope="{ item }">
                      <div class="box2">
                        <div>{{ item.value }}</div>
                        <span class="span" style=" color: #ccc">in {{item.fullName}}</span>
                      </div>
                      
                    </template>
                  </el-autocomplete>
                  <el-button size="mini" class="searchBtn" type="primary" icon="el-icon-search" @click="analyze">搜索</el-button>
                </el-col>
              </el-form-item>
            </el-row>
        <!-- </el-header> -->
        <!-- <el-main> -->
          <div class="avuecrudclass">
            <avue-crud 
              :option="option" 
              v-model="user"
              :data="data" 
              :page.sync="page"
              @size-change="sizeChange"
              @current-change="currentChange"
              @sort-change="sortChange"
              @on-load="getAnalyzeLists"
              >
              <!-- <template slot="name" slot-scope="scope" >
                <div>{{scope}}</div>
              </template> -->
              <template  slot="menu" slot-scope="scope">
                <div v-if="scope.row.status === 'COMPLETED' && scope.row.excelUrl" class="derivedresultbtn">
                  <a :href="`/api${scope.row.excelUrl}`" download>导出分析结果</a>
                  <span class="analysisaginspan" @click="analysiskeywords(scope.row, scope.row.crawlingCompleteTime)">重新分析</span>
                  <div>
                    <span class="erroecolor">{{scope.row.failurePromptStr}}</span>
                  </div>
                </div>
                <div v-else-if="scope.row.status === 'ANALYZE_FAILED'" class="derivedresultbtn">
                  <el-button type="info" class="failBtn">分析失败</el-button>
                  <span class="analysisaginspan" @click="analysiskeywords(scope.row)">重试</span>
                  <div>
                    <span class="erroecolor">{{scope.row.failurePromptStr}}</span>
                  </div>
                </div>
                <div v-else-if="scope.row.status === 'COMPLETED' && !scope.row.excelUrl" class="derivedresultbtn">
                  <el-button type="info" class="failBtn">分析失败</el-button>
                  <div>
                    <span class="erroecolor">该关键词没有找到相关商品</span>
                  </div>
                  <div>
                    <span class="erroecolor">{{scope.row.failurePromptStr}}</span>
                  </div>
                              
                </div>
                <div v-else class="derivedresultbtn">
                  <el-progress :percentage="scope.row.progress*100" :format="format" :text-inside="true" :stroke-width="30"></el-progress>
                  <div>
                    <span class="erroecolor">{{scope.row.failurePromptStr}}</span>
                  </div>
                </div> 
                <div v-if="scope.row.status === 'COMPLETED' && scope.row.excelUrl" class="derivedresultbtn" style="marginTop: 5px">
                  <div  v-if="scope.row.wordFrequencyProgress === null && scope.row.wordFrequencyProgress !== '1.00'">
                    <a v-if="!scope.row.loading" @click="wordStatistics(scope.row.id)" >生成标题词频 <i :class="scope.row.loading ? 'el-icon-loading' : ''"></i></a>
                    <a v-else>生成标题词频 <i :class="'el-icon-loading'"></i></a>
                  </div>
                  <el-progress v-else-if="scope.row.wordFrequencyProgress !== '1.00'" :percentage="scope.row.wordFrequencyProgress*100" :format="wordFormat" :text-inside="true" :stroke-width="30"></el-progress>
                  <a v-else :href="`/api${scope.row.wordFrequencyExcelUrl}`" download>导出标题词频</a>
                  <!-- <span class="analysisaginspan" @click="detail(scope.row.id)">详情</span> -->
              </div>
              </template>
            </avue-crud>
          </div>
        <!-- </el-main> -->
    </basic-container>
  </el-col>
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
</el-row>

</el-form>
</template>

<script>
import { analyzeTree, analyzeSearch, analyzePage, analyze, keyWordAnalyze } from '@/api/listAnalyze/listAnalyze';
export default {
  data() {
    return {
      options: [
        {
          value: 'US',
          label: '美国',
          disabled: false,
        },
        {
          value: 2,
          label: '加拿大',
          disabled: true,
        },
        {
          value: 3,
          label: '英国',
          disabled: true,
        },
        {
          value: 4,
          label: '法国',
          disabled: true,
        },
        {
          value: 5,
          label: '意大利',
          disabled: true,
        },
        {
          value: 6,
          label: '西班牙',
          disabled: true,
        },
        {
          value: 7,
          label: '德国',
          disabled: true,
        }
      ],
      formInline:{
        searchCountry: 'US',
        deptCategory: 'NR',
        searchTopPage: "2",
        searchKeyword: '',
      },
      analyzeData: {
        url: '',
        fullName: '',
      },
      treeData: [],
      treeOption: {
        nodeKey: 'id',
        defaultExpandedKeys: [], //选中默认展开
        highlightCurrent: true, //选中高亮
        currentNoedKey: '',
        accordion: true,
        lazy: true,
        treeLoad: this.treeLoad,
        addBtn: false,
        menu: false,
        size: 'small',
        props: {
          labelText: '标题',
          label: 'title',
          value: 'value',
          children: 'children',
          isLeaf: true
        }
      },
      value: 1, //下拉框默认选择
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf'
      },
      deptCategory: [
        {
          text: 'New Releases',
          value: 'NR'
        },
        {
          text: 'Best Sellers',
          value: 'BS'
        },
        {
          text: 'Movers&shakers',
          value: 'MS'
        },
        {
          text: 'Most wished For',
          value: 'MWF'
        },
        {
          text: 'Gift ldeas',
          value: 'GI'
        },
      ],
      node: null,
      data: [],
      searchValue: '',
      restaurants: [], //模糊搜索存储
      active: 'New Releases', //按钮高亮默认选中
      timer: null, //定时器
      dialogVisible: false,
      user:{},
      page:{
        total: 0,
        //pagerCount: 5,
        currentPage: 1,
        layout: 'total, sizes, prev, pager, next, jumper',
        pageSize: 10,
        pageSizes: [10, 20, 30, 50],
        //background:false,
      },
      option:{
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
            slot: true
          },
          {
            label: '站点',
            prop: 'searchCountry',
            width: 283,
          },
          {
            label: '分类',
            prop: 'fullName',
            // width:700,
            slot: true,            
          },
          {
            label: '操作',
            prop: 'menu',
            align: 'left',
            width: 230,
            fixed: 'right'
          },
        ]
      },
      nodehad: [], //存储树节点
      resolvehad: [],
      parentId: 0,
      result: true,
      results: true,
    };
  },
  mounted() {
    const box = document.querySelector('.box');
    box.scrollTo(0, 0);
  },
  watch: {
    results: {
      handler(val) {
        if (!val) {
          this.getAnalyzeLists();
        }
      },
    deep: true,
    },
    result:{
      handler(val) {
        if (!val) {
          this.getAnalyzeLists();
        }
      },
      deep: true,
    }
  },
  methods: {
    treeLoad (node, resolve, text) {
      if (node.level === 0) {
        this.parentId = 0;
        this.nodehad = node; //这里是关键！在data里面定义一个变量，将node.level == 0的node存起来
        this.resolvehad = resolve; //同上，把node.level == 0的resolve也存起来
      } else {
        this.parentId = node.data.id;
      }
      analyzeTree({ parentId: this.parentId, deptCategory: text || this.formInline.deptCategory }).then(res => {
        resolve(res.data.data.map(item => {
          return {
            ...item,
            leaf: !item.hasChildren
          };
        }));
      });
    },
    format(percentage) {
        return percentage === 100 ? '导出分析报告' : `正在分析${parseInt(percentage)}%`;
    },
    wordFormat(percentage) {
        return percentage === 100 ? '导出标题词频' : `正在生成${parseInt(percentage)}%`;
    },
    //关闭两星期弹框
    refeshList(){
      this.dialogVisible=false;
      this.formInline.searchKeyword = '';
      this.getAnalyzeLists();
    },
    //pagesize变化
    sizeChange(pageSize){
      this.page.pageSize = pageSize;
    },
    //currentpage 变化
    currentChange(currentPage){
      this.page.currentPage = currentPage;  
    },
    //获取分页
    getAnalyzeLists(){
      analyzePage(this.page.currentPage, this.page.pageSize, this.formInline).then(res => {
          if(res.data.code === 200){
          //分页数据
          this.page.currentPage = res.data.data.page.current;
          this.page.pageSize = res.data.data.page.size;
          this.page.total = res.data.data.page.total;
          //表格数据
          this.data = res.data.data.page.records;
          //添加成功，清空关键词
          // this.formInline.searchKeyword = ''; 
        }
        //判断已分析关键词
        // this.data.filter(item => {
        //   if (item.isRepeat) {
        //     console.log(item.id)
        //    let inter = setInterval(() => {
        //       keyWordReset(item.id).then(res => {
        //         if (res.status === 200) {
        //           clearInterval(inter)
        //           this.getkeywordLists()
        //         }
        //       })
        //     }, 30000)
        //   }
        // })
        //有定时器先关掉定时器
        this.timer && this.clearTimer();
        //判断是否要加定时器
        this.result = this.data.some((item) => item.status === 'ANALYZING');
        this.results = this.data.some(item => item.wordFrequencyProgress && item.wordFrequencyProgress !== '1.00');
        //加定时器
        if (this.results) {
          setTimeout(() =>{
            this.getAnalyzeLists();
          }, 1000);
        }
        const arr = this.data.filter( item => item && item.id === this.id);
        if (arr.length > 0 && !arr[0].wordFrequencyProgress) { //添加loading效果
          this.data = this.data.map(item => {
            if (item.id === arr[0].id) {
              item.loading = true;
            }
            return item;
          })
          setTimeout(() => {
            this.getAnalyzeLists();
          }, 1500);
        }
        if (this.result){
          this.timer = setTimeout(()=>{
            this.getAnalyzeLists();
          }, 60000);
        }
      });
    },
    //清除定时器
    clearTimer() {
			clearTimeout(this.timer);
			this.timer = null;
		},
    //词频分析
    wordStatistics(id) {
      keyWordAnalyze(id).then(res => {
        this.id = id;
        if (res.status === 200) {
          this.getAnalyzeLists();
        }
      });
    },
    //重新分析
    analysiskeywords(row,time){
      //判断次数
      // if(this.restnum <=0 ){
      //    this.$message.error('今日免费次数已用完');
      //     return;
      // }
      //关键词输入框是否为空
      if (!row.id){
        if (!this.formInline.searchKeyword){
          this.$message.error('请输入关键词');
          return;
        }
      }
      //前端判断时间是否为两周内  
      //参数
      const params = {
        searchCountry: row.searchCountry,
        searchKeyword: row.searchKeyword,
        searchTopPage: row.searchTopPage,
        url: row.url,
        fullName: row.fullName,
        deptCategory: row.deptCategory
      };
      if (Date.parse(time) <= Date.now() + 14 * 24 * 60 * 60 * 1000){

        //弹确认框
        this.$confirm(`距上次分析时间${time}间隔较短，确认重新分析？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //依旧发请求
          analyze(params, row.id).then(res => {
            console.log(res)
            if (res.data.msg === '您已经搜索过该关键词，请在搜索结果中操作'){       
              //弹框提箱
              console.log(res)
              this.dialogVisible = true;
              return;           
            }
            if (res.data.code === 200 ){
              //刷新页面
              this.getAnalyzeLists();
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
        analyze(params, row.id).then(res => {
          if (res.data.msg === '您已经搜索过该关键词，请在搜索结果中操作'){       
            //弹框提箱
            this.dialogVisible = true;
            return;           
          }
          if (res.data.code === 200 ){
            //刷新页面
            this.getAnalyzeLists();
          }
        });
          //清空关键词
          this.formInline.searchKeyword = '';
      }
    },
    nodeClick(node) {
      this.formInline.searchKeyword = node.title;
      this.analyzeData.url = node.url;
      this.analyzeData.fullName = node.fullName;
    },
    onClick(item) {
      this.nodehad.childNodes = []; //把存起来的node的子节点清空，不然会界面会出现重复树！
      this.treeOption.defaultExpandedKeys = [];
      this.treeLoad(this.nodehad, this.resolvehad, item.value);
      this.formInline.searchKeyword = '';
      this.active = item.text;
      this.formInline.deptCategory = item.value;
      this.getAnalyzeLists();
    },
    querySearchAsync(queryString, cb) {
      if (queryString) {
        analyzeSearch({
          ...this.formInline,
          searchKeyword: queryString
        }).then( res => {
          this.restaurants = res.data.data.map( itme => {
            return {
              value: itme.deptName,
              fullName: itme.fullName,
              ...itme
            };
          });
          const restaurants = this.restaurants;
          cb(restaurants);
        });
      }
    },
    handleSelect(val) {
      if (val) {
        this.analyzeData = {
          url: val.url,
          fullName: val.fullName,
        }
        this.treeOption.defaultExpandedKeys = val.ancestors.split(','); //默认展开ID
        //定位到可视化区域
        this.repetition(val);
      }
    },
    //递归重复调用
    repetition(val) {
      const box = document.querySelector('.box');
      // box.scrollTop = 0;
      const boxs = document.getElementById(`${val.deptId}`);
      if (boxs) {
        //选中高亮
        // setTimeout(() => {
          this.treeOption.currentNoedKey = val.deptId;
          this.$refs.tree.setCurrentKey(val.deptId);
        // }, 1000)
        
        //定位到可视化区域
        box.scrollTop = boxs.offsetTop;
      } else {
        setTimeout(() => {
          this.repetition(val);
        }, 1000);
      }
    },
    analyze() {
      analyze(Object.assign(this.formInline, this.analyzeData)).then( res => {
        console.log(res)
        if (res.data.msg === '您已经搜索过该类目，请在搜索结果中操作') {
          this.dialogVisible = true;
          return;  
        }
        if (res.data.success) {
          this.formInline.searchKeyword = '';
          this.getAnalyzeLists();
        }
      });
    },
  },
}
</script>
<style lang="scss" scoped>
  ::v-deep {
    .avue-crud__menu {
      min-height: 0px;
    }

    .avue-tree__filter {
      display: none;
    }
    .el-autocomplete-suggestion li {
      border-bottom: 1px #E4E7ED solid;
      line-height: 20px;
    }
    .el-autocomplete-suggestion__wrap {
      max-height: 430px;
    }
    .el-tree-node__label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .el-tree-node__label:hover {
      text-overflow:inherit;
      overflow: visible;
      white-space: pre-line;
    }
    .el-progress-bar__outer {
      border-radius: 1px;
      width: 100px;
    }
    .el-progress-bar__inner {
      border-radius: 1px;
    }
  }
  .aside {
    width: 416px !important;
    border-right: #E0E0E0 1px solid;
    box-sizing: border-box;
  }
  .container {
    height: 90vh;
    width: 90vw;
    margin: 8px;
    padding: 0 !important;
    background: #fff;
    border-radius: 4px;
  }
  .selectBox {
      height: 70px;
      width: 415px;
      border-bottom: #E0E0E0 1px solid;
      display: flex;
      justify-content: center;
      align-items: center;
  }
  .select {
    width: 100%;
  }
  .tree {
    margin-left: 10px;
  }
  .searchBox {
    .autocomplete {
      width: 70%;
      margin-right: 10px;
    }
    .box2 {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .box2:hover {
      text-overflow:inherit;
      overflow: visible;
      white-space: pre-line;
    }
  }
  .active {
    color: #fff;
    background-color: #409EFF;
  }
  .avuecrudclass {
  //  padding: 0 20px;
    min-height: 28vh;
    .analysisaginspan {
      display: inline-block;
      color: #409EFF;

      &:hover {
        cursor: pointer;
      }
    }
    .failBtn {
      height: 30px;
      padding: 0 20px;
      margin-right: 30px;
    }
    ::v-deep .el-card__body {
      padding: 0px;
    }
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
  .box {
    // height: 800px;
    max-height: 80vh;
    overflow: scroll;
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
    overflow-x: hidden;
    overflow-y: auto;
    
  }
  .custom-tree-node {
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .box::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
</style>