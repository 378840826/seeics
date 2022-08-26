<template>
  <div>
  <third-register></third-register>
  <el-card>
      <el-form 
        :inline="true" 
        :model="formInline"
        :rules="rules"
        class="demo-form-inline">
        <el-form-item>
          <el-select v-model="formInline.searchCountry" size="small" @change="selectState">
            <el-option label="美国" value="US"></el-option>
            <el-option label="英国" value="UK"></el-option>
            <el-option label="加拿大" value="CA"></el-option>
            <el-option label="法国" value="FR"></el-option>
            <el-option label="意大利" value="IT"></el-option>
            <el-option label="德国" value="DE"></el-option>
            <el-option label="日本" value="JP"></el-option>
            <el-option label="西班牙" value="ES"></el-option>
            <el-option label="澳洲" value="AU"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item  class="inputclass">
          <el-input v-model="formInline.searchKeyword" size="small" placeholder="请输入需要分析的关键词"
          ></el-input>
        </el-form-item>       
        <el-form-item>
          <el-button type="primary" size="small" @click="analysiskeywords()">分析</el-button>
        </el-form-item>
        <el-form-item label="亚马逊搜索结果前: ">
          <el-select v-model="formInline.searchTopPage" size="small" class="pageselectclass">
            <el-option label="2" value="2"></el-option>
            <el-option label="4" value=4 ></el-option>
            <el-option label="6" value=6 ></el-option>
            <el-option label="8" value=8 ></el-option>
            <el-option label="10" value=10 ></el-option>
          </el-select>
          
        </el-form-item>

        <el-form-item>
          <span>页</span>
          <el-button class="download" size="small" @click="download">下载可视化模板</el-button>
        </el-form-item>
        
        <el-form-item>
          <el-date-picker
            v-model="date"
            size="small"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
          </el-date-picker>
        </el-form-item>
 
        <el-form-item prop="inputMsg">
          <range-input
            label="综合评分："
            :valueFilter="valueFilter"
            :score.sync="score" 
            :msg.sync="msg"
          />
        </el-form-item>
       
        <el-form-item>

          <el-popover
            placement="bottom"
            width="100"
            trigger="click"
            @click.stop="isShowWhole = false"
            @show="globalCheckAll = globalChecked.length ===  4 ? true : false"
            v-model="popoverVisible">
            <p>分词：
              <el-checkbox
                v-model="globalCheckAll" 
                @change="globalHandleCheckAllChange">全选</el-checkbox>
            </p>
            <el-checkbox-group v-model="globalChecked" @change="globalHandleCheckedCitiesChange">
              <el-checkbox v-for="item in keywordNums" :label="item.value" :key="item.label">{{item.label}}</el-checkbox>
            </el-checkbox-group>
            <div style="text-align: center;">
              <el-button size="mini" type="primary" 
                @click="overallBtn" style="height: 24px; margin: 10px; fontSize: 10px; padding: 3px 4px 3px 4px;" 
                :disabled="globalChecked.length ? false : true">全局应用</el-button>
              <el-button size="mini" @click="popoverVisible = false"
                style="height: 24px; margin: 0; fontSize: 10px; padding: 3px 4px 3px 4px;">取消</el-button>
            </div>
            <el-button type="text" slot="reference">词频选项</el-button>
          </el-popover>

            <el-popover
            :ref="'popover'"
            placement="bottom"
            title="导入关键词"
            width="300"
            :visible-arrow= "false"
            @click.stop="isShowWhole = false"
            trigger="click"
            >
            <div class="importLy">
              <span>选择文件：</span>
              <div>
                <label style="width: 0px; height: 30px">
                  <span class="selectFile">+选择文件</span>
                  <input
                    type="file"
                    accept="xlsx"
                    @change="batchImport"
                    id="batchFile"
                    v-if="isrefresh"
                    style="visibility: hidden; width: 1px"
                  />
                </label>
                <a @click="batchDownload">下载模板</a>
                <div slot="tip" class="el-upload__tip">{{fileName ? fileName : '未选择文件'}}</div>
              </div>
            </div>
            <div class="submitBtn">
              <el-button size="mini" type="text" @click="$refs.popover.doClose()">取消</el-button>
              <el-button type="primary" size="mini" @click="submit" :disabled="fileName ? false : true">确定</el-button>
            </div>
            <el-button type="primary" size="small" slot="reference" @click="visible = !visible">导入关键词</el-button>
          </el-popover>
        </el-form-item>

        <el-form-item>
           <el-button type="primary" size="small" @click="handleFilter" :disabled="isFiletBtn">筛选</el-button>
        </el-form-item>
        
        <el-form-item>
           <el-button type="primary" size="small" @click="handleReset">重置</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="small" @click="batchExport" :disabled="!batchParams.length">批量导出综合评分</el-button>
        </el-form-item>
        
      </el-form>
      <!-- <div class="warningtext">今日还剩{{restnum}}次免费搜索机会</div> -->

      
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
        @selection-change="selectionChange"
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
            <a @click="analyzeDownload(scope.row)">导出分析结果</a>
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
            <!-- <span
              v-if="scope.row.wordFrequencyProgress === null && scope.row.wordFrequencyProgress !== '1.00'"
              class="derivedresultbtn"
            > -->
              <!-- <a 
                 v-if="scope.row.wordFrequencyProgress === null && scope.row.wordFrequencyProgress !== '1.00'"
                @click="wordStatistics(scope.row)"
              >
                生成标题词频 <i :class="scope.row.loading ? 'el-icon-loading' : ''"></i>
              </a>
              <a v-else>生成标题词频 <i :class="'el-icon-loading'"></i></a>
            </span>
            <span v-else-if="scope.row.wordFrequencyProgress !== '1.00'" class="derivedresultbtn" >
              <el-progress 
                :percentage="scope.row.wordFrequencyProgress*100" 
                :format="wordFormat" 
                :text-inside="true" 
                :stroke-width="30"
                width="100"
              ></el-progress>
            </span>
            
            <a v-else :href="`/api${scope.row.wordFrequencyExcelUrl}`" download>导出标题词频</a> -->
            <a @click="wordStatistics(scope.row)">导出标题词频</a>
            <el-popover
              :ref="'popover_'+scope.row.id"
              placement="bottom"
              width="100"
              :visible-arrow= "false"
              trigger="click"
              @click.stop="isShowWhole = false"
              @show="popoverShow(scope.row.id)"
              @hide="popoverHide"
              >
              <p>分词：
                <el-checkbox
                  :ref="`checkbox${scope.row.id}`"
                  v-model="checkAll" 
                  @change="handleCheckAllChange(!isCheck, scope.row.id)">全选</el-checkbox>
              </p>
              
              <el-checkbox-group v-model="scope.row.optionStr" @change="handleCheckedCitiesChange" :ref="'check' + scope.row.id">
                <el-checkbox v-for="item in keywordNums" :label="item.value" :key="item.label">{{item.label}}</el-checkbox>
              </el-checkbox-group>
              <span style="fontSize: 8px; color: red" v-if="checkeds.length < 1">当前选项为空！默认全局选项</span>
              <div style="text-align: center;">
                <el-button size="mini" type="primary" @click="useBtn(scope.row)" class="popoverBtn" style="margin: 10px;" :disabled="checkeds.length < 1 ? true : false">此处应用</el-button>
                <el-button size="mini" @click="opent(scope.row.id)" class="popoverBtn">取消</el-button>
              </div>
              <span class="analysisaginspan" type="text" slot="reference" style="margin: 0">修改词频选项</span>
        </el-popover>
            <span class="analysisaginspan" @click="detail(scope.row)">详情</span>
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

    <el-dialog
      title="付费会员专属"
      :visible.sync="memberVisible"
      width="30%"
      center=true
      append-to-body=true
    >
      <span>点击【取消】返回当前页，点击【升级会员】，跳转到我的会员页面</span>
      <span slot="footer" class="dialog-footer">
      <el-button @click="memberVisible = false">取 消</el-button>
      <el-button type="primary" @click="$router.push('/member/index')">升级会员</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { 
  getkeywordList,
  analysiskeyword,
  wordStatistics,
  download,
  keyWordReset,
  keywordOptions,
  analyzeDownload,
  overallOption,
  getGlobalOption,
  batchAnalyze,
  batchDownload,
  batchExport } from '@/api/keyword/keyword';
import { downloadFile, setPageSetup, getPageSetup } from '@/util/util';
import RangeInput from '@/components/range-input';
import dayjs from 'dayjs';

export default {

  components: {
    RangeInput
  },
 
  data() {
    const checkDefaultBid = (rule, value, callback) => {
      if (this.formInline.inputMsg) {
        this.isFiletBtn = true;
        return callback(new Error('最大值必须大于最小值'));
      } else if (!this.score.min && this.score.max) {
        this.isFiletBtn = true;
        return callback(new Error('请输入最小值'));
      } else if (this.score.min && !this.score.max) {
        this.isFiletBtn = true;
        return callback(new Error('请输入最大值'));
      // eslint-disable-next-line no-else-return
      } else {
        this.isFiletBtn = false;
      }
    };
    return {
      formInline: {
        searchCountry: 'US',
        searchKeyword: '',
        searchTopPage: '2',
        inputMsg: false,
      },
      formData: '',
      user: {},
      data: [],
      popoverVisible: false, //词频选项框
      globalCheckAll: false,
      checkAll: false,
      isCheck: false,
      isIndeterminate: true,
      globalChecked: [1],
      checkedCities: [4, 1],
      formerChecke: [],
      checkeds: [],
      keywordNums: [
        { 
          value: 1,
          label: '1个单词' 
        },
        {
          value: 2,
          label: '2个单词'
        }, 
        { 
          value: 3, 
          label: '3个单词' 
        }, 
        { 
          value: 4, 
          label: '4个单词' 
        }
      ],
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
        pageSize: getPageSetup(this.$router.history.current.path) || 10,
        pageSizes: [10, 20, 30, 50, 100],
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
        selection: true,
        tip: false,
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
            label: '综合评分',
            prop: 'aggregateScore',
            width: 90
          },
          {
            label: '操作',
            prop: 'menu',
            align: 'left',
            fixed: 'right',
            width: 230,
          },
        ]
      },

      // 筛选 批量导出导入参数
      memberVisible: false, //跳转会员
      msg: false,
      isFiletBtn: false,
      isrefresh: true,
      reFormData: null,
      fileName: '',
      score: { min: '', max: '' },
      batchParams: [],
      date: '',
      dataValue: {
        startingTime: '',
        endTime: ''
      },
      pickerOptions: {
        shortcuts: [{
          text: '本周',
          onClick(picker) {
            const end = dayjs().endOf('week').format();
            const start = dayjs().startOf('week').format();
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '本月',
          onClick(picker) {
            const end = dayjs().endOf('months').format();
            const start = dayjs().startOf('months').format();
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '上周',
          onClick(picker) {
            const end = dayjs().add(-1, 'week').endOf('week').format();
            const start = dayjs().add(-1, 'week').startOf('week').format();
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '上月',
          onClick(picker) {
            const end = dayjs().add(-1, 'months').endOf('months').format();
            const start = dayjs().add(-1, 'months').startOf('months').format();
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近7天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近30天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近60天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 60);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近90天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近180天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近365天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '今年',
          onClick(picker) {
            const end = dayjs().endOf('year').format();
            const start = dayjs().startOf('year').format();
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '上年',
          onClick(picker) {
            const end = dayjs().add(-1, 'year').endOf('year').format();
            const start = dayjs().add(-1, 'year').startOf('year').format();
            picker.$emit('pick', [start, end]);
          }
        }],
        disabledDate: (item) => {
          return item.getTime() > Date.now(); //当日前禁用判断语句 item.getTime() < Date.now() - 8.64e7
        }
      },
      rules: {
        inputMsg: [
          { validator: checkDefaultBid },
        ]
      } 
    };
    
  },
  mounted(){  
    this.getGlobalOption();
    this.getkeywordLists();
  },
  methods: {
    //获取全局选项
    getGlobalOption() {
      getGlobalOption().then(res => {
        if (res.data.code === 200) {
          this.globalChecked = res.data.data;
        }
      });
    },
    // 全局选项
    overallBtn() {
      this.popoverVisible = false;
      overallOption({ combingRules: this.globalChecked }).then(res => {
        if (res.data.code === 200) {
          this.getGlobalOption();
          this.getkeywordLists();
        }
      });
    },
    handleCheckAllChange(val, id) {
      this.isCheck = !this.isCheck;
      if (this.$refs[`checkbox${id}`].value) {
        this.$refs[`check${id}`].$children[0].model = [];
        this.checkeds = [];
      } else {
        this.$refs[`check${id}`].$children[0].model = [1, 2, 3, 4];
        this.checkeds = [1, 2, 3, 4];
      }
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      this.checkeds = value;
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.keywordNums.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.keywordNums.length;
    },
    globalHandleCheckAllChange(val) {
      this.globalChecked = val ? [1, 2, 3, 4] : [];
      this.isIndeterminate = false;
    },
    globalHandleCheckedCitiesChange(value) {
      const checkedCount = value.length;
      this.globalCheckAll = checkedCount === this.keywordNums.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.keywordNums.length;
    },
    opent(id) {
      // this.checkedCities = this.formerChecke;
      this.$refs[`popover_${id}`].doClose();
    },
    useBtn(row) {
      this.$refs[`popover_${row.id}`].doClose();
    },
    popoverShow(id) {
      this.checkAll = this.$refs[`check${id}`].$children[0].model.length === 4 ? true : false;
      this.checkeds = this.data.filter(item => item.id === id)[0].optionStr;
    },
    popoverHide() {
      // this.checkAll = false;
      // this.checkedCities = this.formerChecke;
    },
    format(percentage) {
      return percentage === 100 ? '导出分析报告' : `正在分析${parseInt(percentage)}%`;
    },
    wordFormat(percentage) {
      return percentage === 100 ? '导出标题词频' : `正在生成${parseInt(percentage)}%`;
    },
    wordStatistics(row) {
      // wordStatistics(id).then(res => {
      //   this.id = id;
      //   if (res.status === 200) {
      //     this.getkeywordLists();
      //   }
      // });
      const params = [];
      for (const i of this.data) {
        if (i.id === row.id) {
          params.push(i.optionStr);
        }
      }
      keywordOptions({
        id: row.id,
        combingRules: this.checkeds.sort((a, b) => b - a).join(',') 
        || params[0].join(',')
        || this.globalChecked.join(','),
        isAsc: false,
      }).then( res => {
        if (res.status === 200) {
          this.getkeywordLists();
          const content = res.data;
          const fileName = `${this.$t(`${row.searchCountry}_analyze_frequency_${row.searchKeyword}`)}.xlsx`;
          downloadFile(content, fileName);
          this.$refs[`popover_${row.id}`].doClose();
          // setTimeout(() => {
          this.checkeds = [];
          // }, 100);
          
        }
        // downloadFile(res.data, row.searchKeyword);
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
    //切换国家
    selectState() {
      this.getkeywordLists();
    },
    //获取表格数据
    getkeywordLists(){
      const params = {
        current: this.page.currentPage,
        size: this.page.pageSize,
        searchCountry: this.formInline.searchCountry,
        ...this.dataValue,
        startingTime: this.dataValue.startingTime || null,
        endTime: this.dataValue.endTime || null,
        minimum: this.score.min || null,
        maximum: this.score.max || null
      };

      getkeywordList(params).then(res => {
        if (res.data.code === 200){
          //分页数据
          this.page.currentPage = res.data.data.page.current;
          this.page.pageSize = res.data.data.page.size;
          this.page.total = res.data.data.page.total;
          //表格数据
          this.data = res.data.data.page.records.map(item => {
            return {
              ...item,
              optionStr: item.optionStr || this.globalChecked
            };
          });
          //剩余次数数据
          this.restnum = res.data.data.todayFeeSearchCount;
          //添加成功，清空关键词
          // this.formInline.searchKeyword = ''; 
        }
        //判断已分析关键词
        this.data.filter(item => {
          if (item.isRepeat) {
            // console.log(item.id);
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
    detail (row) {
      // wordStatistics(id).then(res => console.log(res))
      this.$router.push({ path: '/keywordDetail/index', query: { detailId: row.id, name: `${row.searchKeyword}详情`, total: row.aggregateScore } });  
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
          loading.close();
          const fileName = `${this.$t('可视化模板')}.xlsx`;
          downloadFile(content, fileName);
        }
      }).catch(() => {
        loading.close();
      });
    },
    //导出分析
    analyzeDownload(row) {
      analyzeDownload(row.id).then(res => {
        const content = res.data;
        const fileName = `${this.$t(`${row.searchCountry}_analyze_${row.searchKeyword}`) }.xlsx`;
        downloadFile(content, fileName);
      });
    },

    // 批量分析
    batchExport() {
      batchExport(this.batchParams).then(res => {
        if (res.status === 200) {
          const content = res.data;
          const fileName = `${this.$t(Date.now()) }.xlsx`;
          downloadFile(content, fileName);
        }
      });
    },

    //下载模板
    batchDownload () {
      const loading = this.$loading({
        lock: true,
        text: '正在下载模板...',
        spinner: 'el-icon-loading'
      });
      batchDownload().then(res => {
        if (res.status === 200) {
          const content = res.data;
          const fileName = `${this.$t('关键词导入模板') }.xlsx`;
          downloadFile(content, fileName);
          setTimeout(() => {
            loading.close();
          }, 2000);
        }
      }).catch(() => {
        loading.close();
      });
    },

    batchImport() {
      const files = document.getElementById('batchFile').files[0];
      if (!files) {
        return;
      }
    
      //正常上传
      this.fileName = files.name;
      const formData = new FormData();
      formData.append('file', files);
      this.formData = formData;
      this.isrefresh = this.isrefresh ? false : true;
      this.$nextTick(() => {
        this.isrefresh = this.isrefresh ? false : true;
      });
    },

    submit() {
      batchAnalyze(this.formInline.searchCountry, this.formData).then(res => {
        if (res.data.msg === '付费会员专属') {
          this.memberVisible = true;
        } else if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: '批量导入成功'
          });
          this.getkeywordLists();
        } else if (res.data.msg === '导入模板有误，请选择有效模板') {
          this.$message({
            type: 'error',
            message: res.data.msg,
          });
        }
        this.$refs.popover.doClose();
      });
    },

    valueFilter(value) {
      if (typeof Number(value) === 'number' && !isNaN(Number(value))) {
        return value.split('.')[0];
      // eslint-disable-next-line no-else-return
      } else {
        return '';
      }
    },

    selectionChange(val) {
      this.batchParams = val.map(item => {
        return {
          searchKeyword: item.searchKeyword,
          aggregateScore: item.aggregateScore
        };
      });
    },

    handleFilter() {
      this.getkeywordLists();
    },

    handleReset() {
      this.date = '';
      this.dataValue.startingTime = '';
      this.dataValue.endTime = '';
      this.score.max = '';
      this.score.min = '';
      this.getkeywordLists();
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
    'page.pageSize': {
      handler(val) {
        setPageSetup(this.$router.history.current.path, val);
      },
      deep: true
    },
    date: {
      handler(val) {
        if (val) {
          this.dataValue.startingTime = dayjs(val[0]).format('YYYY-MM-DD HH:mm:ss');
          this.dataValue.endTime = dayjs(val[1]).format('YYYY-MM-DD HH:mm:ss');
        }
      },
      deep: true
    },
    msg: {
      handler(val) {
        this.formInline.inputMsg = val;
      },
      deep: true
    }
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
  .el-form-item__error {
    left: 140px;
  }
  .el-progress-bar__outer {
    border-radius: 1px;
    width: 100px;
    margin-right: 30px;
    display: inline-block;
  }
  .el-progress {
    position: relative;
    line-height: 1;
    display: inline-block;
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
  .el-button {
    height: 30px;
    padding: 0 20px;
    // margin-right: 30px;
  }
  .avue-crud__pagination {
    padding-bottom: 0px;
  }
  .avue-crud__pagination .el-input__inner {   
    width: 100%;
  }
  .el-form-item {
    margin-bottom: 15px;
    padding: 0 10px 0px 0px;
  }
  .el-form-item__label {
    font-size: 12px;
  }
  .el-progress-bar__inner {
    text-align: center;
  }
}
.el-checkbox-group {
    font-size: 0;
    margin: -10px 0px 0px 47px;
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
.popoverBtn {
  height: 24px;
  margin: 0;
  font-size: 10px;
  padding: 3px 4px 3px 4px;
}
.selectFile {
  color: #409EFF;
  font-size: 14px;
  cursor: pointer;
}

.importLy {
  display: flex;
  justify-self:space-between;
  height: 70px;

  span {
    line-height: 30px;
  }
  .selectFile {
    padding: 5px;
    border-radius: 2px;
    background: #409EFF;
    color: #fff;
    font-size: 12px;
  }

  div {
    width: 200px;

    a {
      margin-left: 50px;
      color: #409EFF;
    }

    a:hover {
      cursor:pointer;
    }

    .el-upload__tip {
      height: 26px;
      line-height: 26px;
      margin: 10px 0 0 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.submitBtn {
  text-align: center;
  margin: 0;

  .el-button {
    height: 30px;
    padding: 0 20px;
  }
}
</style>