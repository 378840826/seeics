<template>
  <div>
  <third-register></third-register>
  <el-card>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" :rules="asinRules">
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
                <!-- <el-upload
                  class="upload-demo"
                  ref="upload"
                  :headers="myHeaders"
                  action="/api/blade-resource/oss/endpoint/put-file-attach"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :on-success="success"
                  :on-change="change"
                  :show-file-list="false"
                  >
                    <el-button slot="trigger" size="mini" type="primary">+选择文件</el-button>
                    
                    
                </el-upload> -->
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
          :disabled="formInline.attachId ? false : true">分析</el-button>
        </el-form-item>
      </el-form>
      <div class="warningtext">
      <!-- {{analyzeNum.usr ? '' : '今日还剩' + analyzeNum.freeTimes + '次免费分析机会，支持爬取关键词还剩' + analyzeNum.number + '个；'}} -->
      </div>
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
        <template  slot="menu" slot-scope="scope">
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
                <!-- <el-upload
                  class="upload-demo"
                  :headers="myHeaders"
                  :ref="'upload-'+scope.row.id"
                  action="/api/blade-resource/oss/endpoint/put-file-attach"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :on-change="change"
                  :on-success="updateSuccess"
                  :show-file-list="false"
                >
                    <el-button slot="trigger" size="small">+选择文件</el-button>
                    <a @click="download">下载模板</a>
                    <div slot="tip" 
                      class="el-upload__tip"
                    >
                      {{scope.row.originalName || updateFileName || scope.row.searchKeyword +'关键词.xlsx'}}
                    </div>
                </el-upload> -->
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
                {{scope.row.originalName || updateFileName || scope.row.searchKeyword +'关键词.xlsx'}}
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
import { getkeywordList, analysiskeyword, wordStatistics, download, exportKeyword, selectFile, analyzeItme, updateKeyword, imports } from '@/api/ranking/ranking';
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
      selectData: [],
      user: {},
      data: [],
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
            prop: 'searchTime',
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
            label: 'ASIN',
            prop: 'searchKeyword',
            // width: 700,
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
      attachForm: {},
    };
  },
  mounted() {
    this.getSelect();
  },
  methods: {
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
      })
      this.updateFileName = arr.length > 0 ? `${arr[0].name.slice(0, -5)}-副本(${arr.length + 1}).xlsx` : files.name;
      const formData = new FormData();
      arr.length > 0 ? formData.append('file', files, `${arr[0].name.slice(0, -5)}-副本(${arr.length + 1}).xlsx`) : formData.append('file', files);
      this.data.map(item => {
        if (item.id === id) {
          item.formData = formData;
          item.originalName = arr.length > 0 ? `${arr[0].name.slice(0, -5)}-副本(${arr.length + 1}).xlsx` : files.name;
        }
      });
      this.updateIsrefresh = this.updateIsrefresh ? false : true;
      this.$nextTick(() => {
        this.updateIsrefresh = this.updateIsrefresh ? false : true;
      });
    },
    btn(id) {
      this.$refs['btn_'+id].$el.style.display = 'none';
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
      this.$refs['popover-'+id].doClose();
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
    sizeChange(pageSize){
      this.page.pageSize = pageSize;
    },
    //currentpage 变化
    currentChange(currentPage){
      this.page.currentPage = currentPage;  
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
          analysiskeyword(this.formInline,id).then(res => {
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
          const blob = new Blob([content], { type: 'application/vnd.ms-excel' });
          const fileName = `${this.$t('ASIN-关键词排名导出模板') }.xlsx`;
          if ('download' in document.createElement('a')) { //非IE下载
            const elink = document.createElement('a');
            elink.download = fileName;
            elink.style.display = 'none';
            elink.href = URL.createObjectURL(blob);
            elink.setAttribute('download', `${this.$t('ASIN-关键词排名导出模板') }.xlsx`);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href);
            document.body.removeChild(elink);
          } else { //IE10+下载
            navigator.msSaveBlob(blob, fileName);
          }
          setTimeout(() => {
            loading.close();
          }, 2000);
        }
      });
    },
    downloadKeyword(row) {
      this.$refs['btn_'+row.id].$el.style.display = 'block';
      exportKeyword(row.id).then(res => {
        if (res.status === 200) {
          const content = res.data;
          const blob = new Blob([content], { type: 'application/vnd.ms-excel' });
          const fileName = `${this.$t(`${row.searchCountry}_${row.searchKeyword}`) }.xlsx`;
          if ('download' in document.createElement('a')) { //非IE下载
            const elink = document.createElement('a');
            elink.download = fileName;
            elink.style.display = 'none';
            elink.href = URL.createObjectURL(blob);
            elink.setAttribute('download', `${this.$t(`${row.searchCountry}_${row.searchKeyword}`) }.xlsx`);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href);
            document.body.removeChild(elink);
          } else { //IE10+下载
            navigator.msSaveBlob(blob, fileName);
          }
          setTimeout(() => {
            this.$refs['btn_'+row.id].$el.style.display = 'none';
          }, 2000);
        } else {
          this.$refs['btn_'+row.id].$el.style.display = 'none';
        }
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
              delete item.originalName;
            }
          });
          this.$refs['popover-'+data.id].doClose();
          this.getkeywordLists();
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
</style>