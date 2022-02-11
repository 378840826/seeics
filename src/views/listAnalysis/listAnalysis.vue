<template>
  <el-container class="container">
    <el-aside class="aside">
      <div class="selectBox">
        <el-select class="select" v-model="value" @change="change" size="mini">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            >
            </el-option>
        </el-select>
      </div>
      <div class="tree">
        <p>分类</p>
        <el-tree
          :data="data"
          :props="defaultProps"
          :filter-node-method="filterNode"
          ref="tree"
          lazy="true"
          :load="treeLoad"
          @node-click="handleNodeClick"
        >
        </el-tree>
      </div>
      
    </el-aside>
    <el-container>
       <el-header class="header" style="height: 124px;">
          <el-row class="button">
            <el-button 
              v-for="item in list" 
              :key="item.text" :class="{active: active == item.text}" 
              @click="onClick(item.text)"
              size="small"
            >{{item.text}}</el-button>
          </el-row>   
          <el-row class="searchBox">
            <el-autocomplete
              placeholder="输入分类名称，快速定位分类"
              size="small"
              style="width: 500px; marginRight: 10px"
              v-model="searchValue"
              :fetch-suggestions="querySearchAsync"
              @select="handleSelect"
            />
            <el-button size="mini" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          </el-row>
       </el-header>
      <el-main>
        <div class="avuecrudclass">
      <avue-crud 
      
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
            <!-- <span class="analysisaginspan" @click="detail(scope.row.id)">详情</span> -->
        </div>
        </template>
      </avue-crud>
    </div>
      </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  data() {
    return {
      options: [
        {
          value: 1,
          label: '美国'
        },
        {
          value: 2,
          label: '加拿大'
        },
        {
          value: 3,
          label: '英国'
        },
        {
          value: 4,
          label: '法国'
        },
        {
          value: 5,
          label: '意大利'
        },
        {
          value: 6,
          label: '西班牙'
        },
        {
          value: 7,
          label: '德国'
        }
      ],
      value: 1, //下拉框默认选择
      data: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, 
        {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }
        ],
        defaultProps: {
          children: 'children',
          label: 'label',
          isLeaf: 'leaf'
        },
        list: [
          {
            text: 'New Releases'
          },
          {
            text: 'Best Sellers'
          },
          {
            text: 'Movers&shakers'
          },
          {
            text: 'most wished'
          },
          {
            text: 'Gift ldeas'
          },
        ],
        node: null,
        searchValue: '',
        restaurants: [{ "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
          { "value": "三全鲜食（北新泾店）1", "address": "长宁区新渔路144号" },
          { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },], //模糊搜索存储
        active: 'New Releases', //按钮高亮默认选中
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
              label:'分类',
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
    }
  },
  methods: {
    change(e) {
        console.log(this.value)
    },
    treeLoad(node, resolve) {

    },
    handleNodeClick(data, children) {
        console.log(data,children)
    },
    onClick(name) {
      this.active = name
    },
    querySearchAsync(queryString, cb) {
        var restaurants = this.restaurants
        console.log(queryString, cb)
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

          cb(results);
        
    },
    createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
    },
    search() {
      this.searchValue = ''
    }
   
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep {
    .avue-crud__menu {
      min-height: 0px;
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
    width: 366px;
    height: 20px;
    text-align: center;
    margin: 0 15px;
  }
  .tree {
    margin-left: 10px;
  }
  .header {
    height: 124px !important;
    .button {
      margin-top: 20px;
    }
    .searchBox {
      margin-top: 18px;
    }
  }
  .active {
    color: #fff;
    background-color: #409EFF;
  }
  .avuecrudclass {
   padding: 0 20px;
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
</style>