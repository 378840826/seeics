<template>
  <div>
  <third-register></third-register>
  <el-card>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" :rules="asinRules">
        <el-form-item>
          <el-select v-model="formInline.searchCountry" @change="selectState">
            <el-option label="美国" value="US"></el-option>
            <el-option label="加拿大" value="CA"></el-option>
            <el-option label="日本" value="JP"></el-option>
            <el-option label="德国" value="DE"></el-option>
            <el-option label="意大利" value="IT"></el-option>
            <el-option label="法国" value="FR"></el-option>
            <el-option label="西班牙" value="ES"></el-option>
            <el-option label="英国" value="UK"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item  class="inputclass" prop="asin">
          <el-input
            v-model="formInline.asin"
            placeholder="输入需要分析的ASIN"
            maxlength="10"
          ></el-input>
        </el-form-item> 
        <el-form-item label="请选择模板：">
          <el-select v-model="formInline.attachId">
            <el-option v-for="item in selectData" :label="item.name" :value="item.id" :key="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item> 
          <el-popover
            :ref="'popover'"
            placement="bottom"
            title="导入关键词"
            width="300"
            :visible-arrow= "false"
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
                    @change="importChange"
                    id="file"
                    v-if="isrefresh"
                    style="visibility: hidden; width: 1px"
                  />
                </label>
                <a @click="download">下载模板</a>
                <div slot="tip" class="el-upload__tip">{{fileName ? fileName : '未选择文件'}}</div>
              </div>
            </div>
            <div class="submitBtn">
              <el-button size="mini" type="text" @click="$refs.popover.doClose()">取消</el-button>
              <el-button type="primary" size="mini" @click="submit" :disabled="fileName ? false : true">确定</el-button>
            </div>
            <el-button type="primary" size="mini" slot="reference" @click="visible = !visible">导入关键词</el-button>
          </el-popover> 
        </el-form-item>  
        <el-form-item>
          <el-button
           type="primary"
           size="mini"
           @click="analysiskeywords()"
           style="margin-left: 30px;"
          :disabled="formInline.attachId && formInline.asin ? false : true">分析</el-button>
        </el-form-item>
      </el-form>
      <div class="warningtext">
      <!-- {{analyzeNum.usr ? '' : '今日还剩' + analyzeNum.freeTimes + '次免费分析机会，支持爬取关键词还剩' + analyzeNum.number + '个；'}} -->
      </div>
      <div style="marginBottom: 10px">
        <el-popover
          ref="popovers"
          placement="bottom-start"
          title="监控频率"
          width="150"
          trigger="click">
          <el-radio-group v-model="modelRadio" @change="radioChange">
            <el-radio class="radio" v-for="item in radioOption" :label="item.label" :key="item.label">{{item.title}}</el-radio>
          </el-radio-group>
          <div class="radioBtn">
            <el-button size="mini" @click="$refs.popovers.doClose()">取消</el-button>
            <el-button type="primary" size="mini" @click="monitoring">确定</el-button>
          </div>
          <el-button 
            slot="reference" 
            size="mini" 
            :disabled="checkList.length ? false : true">监控频率</el-button>
        </el-popover>
        <el-button size="mini" :disabled="checkList.length ? false : true" 
          style="marginLeft: 30px"
          @click="batchStart"
        >批量开启</el-button>
        <el-button size="mini" :disabled="checkList.length && pauseCheck.length ? false : true" 
          style="marginLeft: 30px"
          @click="batchPause"
        >批量暂停</el-button>
      </div>
      <el-popover
        placement="bottom-start"
        ref="filterPopover"
      >
        <el-form :model="filters" ref="filterRef">
         
        </el-form>
        <div style="textAlign: center">
          <el-button @click="filterBtn" type="primary" size="mini">全局应用</el-button>
          <el-button size="mini" @click="$refs.filterPopover.doClose()">取消</el-button>
        </div>
        <!-- <el-button slot="reference" size="mini">全局筛选</el-button> -->
      </el-popover>
      <div class="avuecrudclass">
      <el-table
        ref="multipleTable"
        :data="data"
        tooltip-effect="black"
        style="width: 100%"
        border
        emptyText="没有找到相关商品，请重新查询"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column 
          v-for="item in column"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
          :align="item.align"
          :sortable="item.sortable"
          :width="item.width"
        />
        <el-table-column
          label="监控频率"
          width="200"
          prop="cycle"
          align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.cycle">每{{scope.row.cycle}}天自动更新</div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="230"
          align="center">
           <template slot-scope="scope">
           <div
            v-if="scope.row.status === 'COMPLETED' && scope.row.crawlingProgress === '1.00'" class="derivedresultbtn"
          >
            <div class="export">
              <a @click="downloadKeyword(scope.row)">导出分析结果</a>
              <el-button :ref="'btn_'+scope.row.id" class="btn" type="text" icon="el-icon-loading"></el-button>
            </div>
            <!-- <span class="analysisaginspan" 
            @click="analysiskeywords(scope.row.id, scope.row.crawlingCompleteTime)">重新分析</span> -->
            <el-popover
              placement="bottom"
              title="更新关键词"
              width="300"
              :visible-arrow= "false"
              trigger="click"
              :ref="'popover-'+scope.row.id"
              @click.stop="isShowWhole = false"
              @hide ="importHide(scope.row.id)"
            >
            <div class="importLy">
              <span style="line-height: 30px;">选择文件：</span>
              <div style="width: 200px">
                <label style="width: 0px; height: 30px">
                  <span class="selectFile">+选择文件</span>
                  <input
                   type="file"
                   :ref="'file'+scope.row.id" accept="xlsx"
                   v-if="updateIsrefresh" @change="updateChange(scope.row.id)" 
                   :id="'file'+scope.row.id" 
                   style="visibility: hidden; width: 1px"
                   />
                </label>
                <a @click="download">下载模板</a>
                <div
                  slot="tip"
                  class="el-upload__tip"
                >
                {{scope.row.updateFileName || updateFileName || scope.row.searchKeyword +'关键词.xlsx'}}
                </div>
              </div>
            </div>
            <div class="submitBtn">
              <el-button size="mini" type="text" @click="close(scope.row.id)">取消</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="updateKeyword(scope.row)"
                :disabled="scope.row.formData || updateFile.url ? false : true"
              >
                确定
              </el-button>
            </div>
            <el-button type="text" size="mini" slot="reference">更新关键词</el-button>
            </el-popover>
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
          <div v-else-if="scope.row.status !== 'COMPLETED' && !scope.row.excelUrl" class="derivedresultbtn">
            <el-progress
              :percentage="scope.row.crawlingProgress*100"
              :format="format"
              :text-inside="true"
              :stroke-width="30"
            ></el-progress>
            <div>
              <span class="erroecolor">{{scope.row.failurePromptStr}}</span>
            </div>
          </div> 
          <div
            v-if="scope.row.status === 'COMPLETED' && scope.row.crawlingProgress === '1.00'" 
            class="derivedresultbtn" style="marginTop: 5px"
          >
          </div>
        </template>
        </el-table-column>
      </el-table>
      <div class="block" style="textAlign: right">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="page.pageSizes"
        :page-size="page.pageSize"
        :layout="page.layout"
        :total="page.total">
      </el-pagination>
      </div>
    </div>
  </el-card>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="30%"
    center=true
    append-to-body=true
  >
    <span>您已经搜索过该ASIN，请在搜索结果中操作</span>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="refeshList">确 定</el-button>
    </span>
  </el-dialog>
  <el-dialog
    :visible.sync="dialogImport"
    width="30%"
    center=true
    append-to-body=true
  >
    <span>{{`附件管理有“${fileName}”同名文件，建议点击去删除先在附件管理删除再进行上传，或点击取消自行重命名文件再上传，或者点击自动重命名则文件名称为“${renameFile}”；`}}</span>
    <span slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
    <el-button @click="reImport">自动重命名</el-button>
    <el-button type="primary" @click="toDelete">去删除</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
const toke = JSON.parse(localStorage.getItem('saber-token'));
import { getkeywordList, analysiskeyword, wordStatistics, download, exportKeyword, selectFile, analyzeItme, updateKeyword, imports, monitoring, batchPause, batchStart } from '@/api/ranking/ranking';
import { downloadFile } from '@/util/util';
export default {
  name: 'asinRanking',
  data() {
    return {
      myHeaders: {
        Authorization: 'Basic c2FiZXI6c2FiZXJfc2VjcmV0',
        'Blade-Auth': toke.content
      },
      visible: false,
      formData: '',
      reFormData: '',
      popover: this.$refs.popover,
      analyzeNum: {
        freeTimes: 0,
        number: 0,
        usr: ''
      },
      file: {
        name: '',
        attachId: ''
      },
      updateFile: {},
      isrefresh: true, //强制跟新
      updateIsrefresh: true,
      closeFile: {},
      updateFileName: '',
      fileName: '',
      renameFile: '',
      formInline: {
        searchCountry: 'US',
        asin: '',
        searchTopPage: '2',
        attachId: '',
      },
      asinRules: {
        asin: [
          { pattern: /^[a-zA-Z0-9]{10}$/, message: 'ASIN不支持中文，支持10位纯数字或字母组合；', trigger: 'change' }
        ],
      },
      radioOption: [
        {
          label: 7,
          title: '每7天自动更新'
        },
        {
          label: 14,
          title: '每14天自动更新'
        },
        {
          label: 21,
          title: '每21天自动更新'
        },
        {
          label: 30,
          title: '每30天自动更新'
        },
      ],
      modelRadio: 7,
      selectData: [1],
      filters: {
        limax: '',
        limin: '',
        keyMax: '',
        keyMin: '',
      },
      user: {},
      data: [],
      checkList: [], //选择框
      pauseCheck: [], //判断选中是否有监控记录
      dialogVisible: false, //两周内是否搜索过弹框
      dialogImport: false,
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
      column: [
        {
          label: '更新时间',
          prop: 'searchTime',
          sortable: true, //排序
          width: 200,
          align: 'center'
          //slot:true
        },
        {
          label: '站点',
          prop: 'searchCountry',
          width: 100,
          align: 'center'
        },
        {
          label: 'ASIN',
          prop: 'searchKeyword',
          align: 'center'        
        },
        {
          label: '关键词模板名称',
          prop: 'originalName',
          align: 'center',
          width: 200,
          
        },
      ],
      attachForm: {},
    };
  },
  mounted() {
    this.getSelect();
    this.getkeywordLists();
  },
  methods: {
    monitoring() {
      monitoring({
        cycle: this.modelRadio,
        attachIdList: this.checkList,
        searchCountry: this.formInline.searchCountry,
        searchTopPage: this.formInline.searchTopPage
      }).then(res => {
        if (res.data.success) {
          this.$message({
            type: 'success',
            message: '设置监控频率成功'
          });
          this.$refs.popovers.doClose();
        }
      });
    },
    radioChange(e) {
      this.modelRadio = e;
    },
    //批量暂停
    batchPause() {
      batchPause({
        attachIdList: this.checkList,
        searchCountry: this.formInline.searchCountry,
        searchTopPage: this.formInline.searchTopPage
      }).then(res => {
        if (res.data.success) {
          this.$message({
            type: 'success',
            message: '监控批量暂停成功'
          });
          this.getkeywordLists();
        }
      });
    },
    //批量开启
    batchStart() {
      batchStart({
        attachIdList: this.checkList,
        searchCountry: this.formInline.searchCountry,
        searchTopPage: this.formInline.searchTopPage
      }).then(res => {
        if (res.data.success) {
          this.$message({
            type: 'success',
            message: '监控批量开启成功'
          });
          this.getkeywordLists();
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg
          }); 
        }
      });
    },
    filterBtn() {
      console.log(this.filters);
    },
    importChange() {
      const files = document.getElementById('file').files[0];
      if (!files) {
        return;
      }
      //自动重命名上传
      const arr = [];
      this.selectData.map(item => {
        if (item.name.indexOf(files.name.slice(0, -5)) !== -1) {
          arr.push(item);
        }
      });
      this.renameFile = arr.length > 0 && `${arr[0].name.slice(0, -5)}-副本(${arr.length + 1}).xlsx`;
      const reFormData = new FormData();
      reFormData.append('file', files, this.renameFile);
      this.reFormData = reFormData;
    
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
    updateChange(id) {
      const files = document.getElementById(`file${id}`).files[0];
      if (!files) {
        return;
      }
      const arr = [];
      this.selectData.map(item => {
        if (item.name.indexOf(files.name.slice(0, -5)) !== -1) {
          arr.push(item);
        }
      });
      this.updateFileName = arr.length > 0 ? `${arr[0].name.slice(0, -5)}-副本(${arr.length + 1}).xlsx` : files.name;
      const formData = new FormData();
      arr.length > 0 ? formData.append('file', files, `${arr[0].name.slice(0, -5)}-副本(${arr.length + 1}).xlsx`) : formData.append('file', files);
      this.data.map(item => {
        if (item.id === id) {
          item.formData = formData;
          item.updateFileName = arr.length > 0 ? `${arr[0].name.slice(0, -5)}-副本(${arr.length + 1}).xlsx` : files.name;
        }
      });
      this.updateIsrefresh = this.updateIsrefresh ? false : true;
      this.$nextTick(() => {
        this.updateIsrefresh = this.updateIsrefresh ? false : true;
      });
    },
    btn(id) {
      this.$refs[`btn_${id}`].$el.style.display = 'none';
    },
    submit() {
      imports(this.formData).then(res => {
        if (res.data.success) {
          this.$message({
            type: 'success',
            message: '导入关键词成功!'
          });
          this.getSelect(1);
          setTimeout(() => {
            this.getkeywordLists();
          }, 500);
        } else {
          this.fileName = res.data.data;
          this.dialogImport = true;
        }
      });
      this.fileName = '';
      this.$refs.popover.doClose();
      // this.$refs['popover-'+id].doClose()
    },
    //自动重命名上传
    reImport() {
      imports(this.reFormData).then( res => {
        if (res.data.success) {
          this.$message({
            type: 'success',
            message: '导入关键词成功!'
          });
          this.getSelect(1);
          setTimeout(() => {
            this.getkeywordLists();
          }, 500);
        }
      });
      this.fileName = '';
      this.renameFile = '';
      this.dialogImport = false;
    },
    //去删除
    toDelete() {
      this.$router.push({
        name: '附件管理',
        params: {
          fileName: this.fileName,
        }
      });
    },
    //取消清空
    cancel() {
      this.fileName = '';
      this.renameFile = '';
      this.dialogImport = false;
    },
    close(id) {
      this.updateFileName = '';
      this.$refs[`popover-${id}`].doClose();
    },
    importHide() {
      this.updateFileName = '';
      this.updateFile = {};
    },
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
    handleSizeChange(pageSize){
      this.page.pageSize = pageSize;
      this.getkeywordLists();
    },
    //currentpage 变化
    handleCurrentChange(currentPage){
      this.page.currentPage = currentPage;  
      this.getkeywordLists();
    },
    //切换国家
    selectState() {
      this.getkeywordLists();
    },
    //获取表格数据
    getkeywordLists(){
      // analyzeItme().then(res => {
      //   this.analyzeNum = res.data.data;
      // });
      getkeywordList(this.page.currentPage, this.page.pageSize, this.formInline).then(res => {
        if (res.data.code === 200){
          //分页数据
          this.page.currentPage = res.data.data.current;
          this.page.pageSize = res.data.data.size;
          this.page.total = res.data.data.total;
          //表格数据
          this.data = res.data.data.records;
          //剩余次数数据
          this.restnum = res.data.data.todayFeeSearchCount;
          //添加成功，清空关键词
          // this.formInline.asin = ''; 
        }
        //判断已分析关键词
        //有定时器先关掉定时器
        this.timer && this.clearTimer();
        //判断是否要加定时器
        this.result = this.data.some((item) => item.status === 'ANALYZING');
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
        if (!this.formInline.asin){
          this.$message.error('请输入ASIN');
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
          this.formInline.asin = '';
          
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
        this.formInline.asin = '';
      }
    },
    handleSelectionChange(list) {
      const arr = [];
      const pauseArr = [];
      if (list.length) {
        list.map(item => {
          arr.push(item.attachId);
          if (item.cycle) {
            pauseArr.push(item.cycle);
          }
        });
      } else {
        arr.splice(0, arr.length);
        pauseArr.splice(0, pauseArr.length);
      }
      this.modelRadio = pauseArr[0] || 7;
      this.pauseCheck = pauseArr;
      this.checkList = arr;
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
          const fileName = `${this.$t('ASIN-关键词排名导出模板') }.xlsx`;
          downloadFile(content, fileName);
          setTimeout(() => {
            loading.close();
          }, 2000);
        }
      }).catch(() => {
        loading.close();
      });
    },
    downloadKeyword(row) {
      this.$refs[`btn_${row.id}`].$el.style.display = 'block';
      exportKeyword(row.id).then(res => {
        if (res.status === 200) {
          const content = res.data;
          const fileName = `${this.$t(`${row.searchCountry}_rank_${row.searchKeyword}`) }.xlsx`;
          downloadFile(content, fileName);
          setTimeout(() => {
            this.$refs[`btn_${row.id}`].$el.style.display = 'none';
          }, 2000);
        } else {
          this.$refs[`btn_${row.id}`].$el.style.display = 'none';
        }
      }).catch(() => {
        this.$refs[`btn_${row.id}`].$el.style.display = 'none';
      });  
    },
    //获取选择文件
    getSelect(flag) {
      selectFile().then(res => {
        const defalutData = {
          name: '请先选择模板',
          id: ''
        };
        if (res.data.code === 200) {
          res.data.data.unshift(defalutData);
          this.selectData = res.data.data;
          this.formInline.attachId = flag ? res.data.data.slice(-1)[0].id : '';
        }
      });
    },
    //更新模板
    updateKeyword (data) {
      imports(
        data.formData
      ).then(res => {
        if (res.data.code === 200) {
          this.data.map(item => {
            if (item.originId) {
              this.$refs[`upload-${item.originId}`]._data.uploadFiles = [];
            }
            if (item.id === data.id) {
              delete item.formData;
              delete item.updateFileName;
            }
          });
          this.$refs[`popover-${data.id}`].doClose();
          this.getSelect(1);
          setTimeout(() => {
            this.getkeywordLists();
          }, 500);
          this.$message({
            type: 'success',
            message: '更新关键词成功!'
          });
          this.updateFileName = '';
          this.updateFile = {};
        }
      });
    },
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
    'formInline.attachId'() {
      this.page.currentPage = 1;
      this.getkeywordLists();
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
  .el-table th {
    background-color: #fafafa;
    padding: 8px 0;
    color: rgba(0,0,0,.85);
    word-break: break-word;
  }
  .el-table .cell {
    word-break: break-all;
    line-height: 23px;
    padding: 0;
  }
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
  .el-button {
    // height: 30px;
    // padding: 0 20px;
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
  .el-form-item__error {
    color: #F56C6C;
    font-size: 12px;
    line-height: 1;
    padding-top: 7px;
    position: absolute;
    top: 100%;
    left: 0;
    background: #ffffff;
  }
  .el-form-item .el-input__inner {
    height: 30px;
    line-height: 30px;
    width: 160px;
    font-size: 12px;
  }
}
 
.avuecrudclass {
  .analysisaginspan {
    display: inline-block;
    color: #409EFF;
    margin-left: 0;

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
  height: 24px;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: #FF3332;
  line-height: 24px;
  margin-left: 175px;
}
.derivedresultbtn {
  div{
    display: inline-block;
    margin-right: 24px;
    a{
      font-size: 12px;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      width: 97px;
      background: #409EFF;
      color: #fff;
      text-align: center;
      border-radius: 1px;
    }
    a:hover {
      cursor:pointer;
    }
    ::v-deep .el-button {
      border-radius: 1px;
      width: 100px;
      font-size: 12px;
    }
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
.export {
  width: 97px;
  height: 30px;
  position: relative;
  div {
    position: absolute;
  }
  .btn {
    position: absolute;
    color: black;
    background: #fff;
    opacity: 0.5;
    top: 0;
    display: none;
  }
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
.radio {
  line-height: 30px;
  margin-left: 10px;
}
.radioBtn {
  text-align: center;
  margin-top: 10px;

  .el-button {
    height: 24px;
    padding: 0 20px;
  }
}
.block {
  text-align: right;
  padding: 25px 0 0 20px;
}

</style>