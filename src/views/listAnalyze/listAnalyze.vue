<template>
  <el-form :model="formInline">
  <el-row>
    <el-col :span="5">
      <div >
        <el-scrollbar>
          <basic-container >
            <!-- <div class="selectBox"> -->
        <el-form-item v-model="formInline.searchCountry">
        <el-select class="select" v-model="formInline.searchCountry" @change="change" size="small">
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
            <avue-tree class="box" :option="treeOption" :data="treeData" @node-click="nodeClick" default-expand-all/>
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
                  @input="onChange"
                >
                  <template slot-scope="{ item }">
                    <div class="box2">
                      <div>{{ item.value }}</div>
                      <span class="span" style=" color: #ccc">in {{item.fullName}}</span>
                    </div>
                    
                  </template>
                </el-autocomplete>
                <el-button size="mini" class="searchBtn" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
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
            <template slot="name" slot-scope="scope" >
              <div>{{scope}}</div>
            </template>
            <template  slot="menu" slot-scope="scope">
              <div v-if="scope.row.status === 'COMPLETED' && scope.row.excelUrl" class="derivedresultbtn">
                <a :href="`/api${scope.row.excelUrl}`" download>导出分析结果</a>
                <span class="analysisaginspan" @click="analysiskeywords(scope.row.id, scope.row.crawlingCompleteTime)">重新分析</span>
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
                <el-progress :percentage="scope.row.progress*100" :format="format" :text-inside="true" :stroke-width="30"></el-progress>
                <div>
                  <span class="erroecolor">{{scope.row.failurePromptStr}}</span>
                </div>
              </div> 
              <div v-if="scope.row.status === 'COMPLETED' && scope.row.excelUrl" class="derivedresultbtn" style="marginTop: 5px">
                <div class="avuecrudclass" v-if="scope.row.wordFrequencyProgress === null && scope.row.wordFrequencyProgress !== '1.00'">
                  <a v-if="!scope.row.loading" @click="wordStatistics(scope.row.id)" >生成标题词频 <i :class="scope.row.loading ? 'el-icon-loading' : ''"></i></a>
                  <a v-else>生成标题词频 <i :class="'el-icon-loading'"></i></a>
                </div>
                <el-progress v-else-if="scope.row.wordFrequencyProgress !== '1.00'" :percentage="scope.row.wordFrequencyProgress*100" :format="wordFormat" :text-inside="true" :stroke-width="30"></el-progress>
                <a v-else :href="`/api${scope.row.wordFrequencyExcelUrl}`" download>导出标题词频</a>
                <span class="analysisaginspan" @click="detail(scope.row.id)">详情</span>
            </div>
            </template>
          </avue-crud>
         </div>
      <!-- </el-main> -->
  </basic-container>
  </el-col>
</el-row>
</el-form>
</template>

<script>
import { analyzeTree, analyzeSearch, analyzePage } from '@/api/listAnalyze/listAnalyze';
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
      treeData: [],
      treeOption: {
        nodeKey: 'id',
        lazy: true,
        treeLoad: function (node, resolve) {
          const parentId = (node.level === 0) ? 0 : node.data.id;
          console.log(node)
          analyzeTree(parentId).then(res => {
            resolve(res.data.data.map(item => {
              return {
                ...item,
                leaf: !item.hasChildren
              }
            }))
          });
        },
        addBtn: false,
        menu: false,
        size: 'small',
        props: {
          labelText: '标题',
          label: 'title',
          value: 'value',
          children: 'children'
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
          value: 'MSF'
        },
        {
          text: 'most wished',
          value: 'MW'
        },
        {
          text: 'Gift ldeas',
          value: 'GL'
        },
      ],
      node: null,
      data: [],
      searchValue: '',
      restaurants: [], //模糊搜索存储
      active: 'New Releases', //按钮高亮默认选中
      user:{},
      page:{
        total: 0,
        //pagerCount: 5,
        currentPage: 1,
        layout: 'total, sizes, prev, pager, next, jumper',
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
            slot:true
          },
          {
            label:'站点',
            prop:'searchCountry',
            width:283,
          },
          {
            label:'分类',
            prop:'searchKeyword',
            // width:700,
            slot:true,            
          },
          {
            label:'操作',
            prop:'menu',
            align: 'left',
            width: 230,
            // fixed:true
          },
        ]
      },
    }
  },
  mounted() {
    this.getAnalyzeLists()
  },
  methods: {
    focus() {
      const input = document.querySelector('.input');
      const box = document.querySelector('.searchTip');
      const w = input.clientWidth;
      const j = input.getBoundingClientRect().left;
      box.style.width = w + 'px';
      box.style.display = 'block'
      console.log(w, j)
    },
    blur() {
      const box = document.querySelector('.searchTip');
      box.style.display = 'none'
    },
    change(e) {
        console.log(this.value)
    },
    //获取分页
    getAnalyzeLists() {
      analyzePage({
        current: this.page.currentPage,
        size: this.page.pageSize,
        searchCountry: this.formInline.searchCountry,
        searchTopPage: this.formInline.searchTopPage,
        deptCategory: this.formInline.deptCategory
      }).then( res => {
        if (res.data.code === 200) {
          this.page.pageSize = res.data.data.page.size;
          this.page.currentPage = res.data.data.page.current;
          this.page.total = res.data.data.page.total;
          this.data = res.data.data.page.records;
        }
      })
    },
    //重新分析
    analysiskeywords(row) {
      console.log(row)
    },
    nodeClick(node) {
      console.log(node.title)
      this.formInline.searchKeyword = node.title;
    },
    handleNodeClick(data, children) {
        console.log(data,children)
    },
    onClick(item) {
      this.active = item.text;
      this.formInline.deptCategory = item.value;
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
              fullName: itme.fullName
            }
          });
          const restaurants = this.restaurants;
          // const results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
          cb(restaurants);
        });
      }
    },
    createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
    },
    handleSelect(val) {
      console.log(val)
      const arr = [];
      analyzeTree(0).then(res => {
        console.log(res)
        res.data.data.map( item => {
          // return {
          //   ...item,
          //   leaf: !item.hasChildren
          // }
          arr.push({
            ...item,
            leaf: !item.hasChildren
          })
        })
        console.log(arr)
      })
      analyzeTree(10).then(res => {
        console.log(res)
      })
    },
    onChange(e) {
      console.log(e)
    },
    search() {
      this.formInline.searchKeyword = '';
      // analyzeSearch(this.formInline).then( res => {
      //   this.data = res.data.data;
      // })
      console.log(this.treeData)
    }
   
  }
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
  min-height: 30vh;
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
.box::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

  // .el-scrollbar {
  //   // height: 100%;
  // }

  // .box .el-scrollbar__wrap {
  //   overflow: scroll;
  // }

</style>