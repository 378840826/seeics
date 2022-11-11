<template>
  <el-dialog
    title="添加否定关键词"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    :close-on-press-escape="false"
    destroy-on-close
    @close="cancel"
    v-loading="loading"
    top="1vh"
    width="80%">

    <el-form label-width="160px" :model="form" ref="form" :rules="rules" hide-required-asterisk>

      <el-form-item v-if="!treeSelectedKey.campaignId">
        <template slot="label">
          <div style="display: flex;">
            <span>广告活动投放类型:</span>
            <span class="msg">*</span>
          </div>
        </template>
        <el-select
          v-model="groupType"
          @change="queryCampaignList(false, '', '', true)"
          size="small">
          <el-option :value="''" label="自动投放" />
          <el-option :value="'keyword'" label="关键词投放"/>
        </el-select>
      </el-form-item>
      
      <el-form-item prop="campaignId">
        <template slot="label">
          <div style="display: flex;">
            <span>选择广告活动：</span>
            <span class="msg">*</span>
          </div>
        </template>
        <el-select
          v-model="form.campaignId"
          @change="handleGroup"
          filterable
          reserve-keyword
          remote
          :remote-method="remoteMethod"
          :loading="campaignLoading"
          v-loadmore="loadmore"
          @focus="searchCampaign = '';
            searchCampaignList = [];"
          placeholder="请选择广告活动"
          :disabled="treeSelectedKey.campaignId"
          size="small"
          class="autocomplete"
          style="width: 400px">
          <el-option
            v-for="item in !searchCampaign ? campaignList : searchCampaignList"
            :key="item.id"
            :value="item.id"
            :label="item.label"
            class="box2"
          />
        </el-select>
      </el-form-item>

      <el-form-item v-if="dialogType === 'group' || treeSelectedKey.groupId" prop="groupId">
        <template slot="label">
          <div style="display: flex;">
            <span>选择广告组：</span>
            <span class="msg">*</span>
          </div>
        </template>
        <el-select
          v-model="form.groupId"
          :filterable="groupList.length"
          reserve-keyword
          :remote="groupList.length"
          :remote-method="remoteMethodGroup"
          :loading="groupLoading"
          v-loadmore="loadmoreGroup"
          @focus="
            searchGroup = '';
            searchGroupList = [];"
          placeholder="请选择广告组"
          size="small"
          style="width: 400px">
          <el-option
            v-for="item in !searchGroup ? groupList : searchGroupList"
            :key="item.id"
            :value="item.id"
            :label="item.label"
            class="box2"
          />
        </el-select>
      </el-form-item>

      <div class="content">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="建议否定" name="suggest">
            <deny-keyword-table
              ref="denyKeyword"
              :marketplace="marketplace"
              :forms.sync="form"
              :dialogType="dialogType"
            />
          </el-tab-pane>

          <el-tab-pane label="输入关键词" name="input">
            <div style="textAlign: center">
              <el-input
                type="textarea"
                :rows="2"
                :placeholder="'请输入否定关键词，每行一个，回车换行；'"
                v-model="textarea"
                @header-click="handleAllDelete"
                @input="handleTextarea"
                @blur="handleTextareaBlur"
                class="textarea">
              </el-input>

              <div style="marginTop: 6px">
                <el-radio
                  v-model="ntMatchType"
                  v-for="(value, key) in NegativeKeywordMatchTypeNameDict"
                  :key="key"
                  :label="key"
                >{{value}}</el-radio>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>

      </div>

    </el-form>

    <el-dialog
      :visible.sync="textareaDialogVisible"
      append-to-body
      :show-close="false"
      width="500px"
      center
      top="40vh"
      @close="handleClose"
      destroy-on-close>
      <div>
        {{`关键词${repetition.join('、')}`}}已存在，无需重复添加
      </div>
      
      <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="textareaDialogVisible = false">取 消{{max}}</el-button>
          <el-button
            type="primary"
            size="small"
            @click="textareaDialogVisible = false; textarea = ''; textareaArr = []; repetition = []">确 定</el-button>
      </span>
    </el-dialog>

    <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="saveBtn">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>

import denyKeywordTable from './conponent/table.vue';
import {
  queryGroupList,
  getGroupList,
  getDenyCampaignList,
  createNegativeKeyword,
  getDenyGroupList
} from '@/api/ppc/adManage';
import { NegativeKeywordMatchTypeNameDict } from '../../utils/dict';

export default {

  name: 'createDenyKeyword',

  components: {
    denyKeywordTable,
  },

  props: {
    dialogVisible: {
      type: Boolean,
      require: true
    },
    mwsStoreId: {
      type: String,
      required: true,
    },
    storeId: {
      type: String,
      required: true, 
    },
    marketplace: {
      type: String,
      required: true, 
    },
    dialogType: {
      type: String,
      require: true,
    },
    treeSelectedKey: {
      type: Object
    }
  },
  
  data() {
    return {
      NegativeKeywordMatchTypeNameDict,
      form: {
        campaignId: '',
        groupId: '',
        storeId: this.storeId,
      },
      campaignLoading: false,
      groupLoading: false,
      loading: false,
      searchCampaign: '',
      searchGroup: '',
      campaignList: [],
      searchCampaignList: [],
      searchGroupList: [],
      groupList: [],
      data: [],
      total: 0,
      searchTotal: 0,
      groupTotal: 0,
      groupSearchTotal: 0,
      page: {
        size: 20,
        current: 1,
      },
      searchPage: {
        size: 20,
        current: 1,
      },
      groupPage: {
        size: 20,
        current: 1,
      },
      groupSearchPage: {
        size: 20,
        current: 1,
      },
      rules: {
        campaignId: [{ required: true, message: '请选择广告活动', trigger: 'blur' }],
        groupId: [{ required: true, message: '请选择广告组', trigger: 'blur' }],
      },
      activeName: 'suggest',
      textarea: '',
      textareaArr: [],
      repetition: [],
      ntMatchType: 'negativePhrase',
      textareaDialogVisible: false,
      groupType: '',
    };
  },

  directives: {
    'loadmore': {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
        SELECTWRAP_DOM.addEventListener('scroll', function () {
          const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
          if (condition) {
            binding.value();
          }
        }, true);
      }
    }
  },

  watch: {
    'form.campaignId': {
      handler() {
        (this.dialogType === 'group' || this.treeSelectedKey.groupId) && this.getGroupList(false, '', this.treeSelectedKey.groupId ? this.treeSelectedKey.groupId : null);
      }
    }
  },

  mounted() {
    queryGroupList({
      size: 20,
      current: 1
    }, {
      campaignId: this.treeSelectedKey.campaignId,
      storeId: this.storeId,
      marketplace: this.marketplace
    }).then(res => {
      const data = res.data.data.page.records;
      this.queryCampaignList(false, data.filter(item => item.campaignState !== 'archived' && item.campaignTargetType !== 'manual').length
        && data.filter(item => item.campaignState !== 'archived' && item.campaignTargetType !== 'manual')[0].campaignName || '',
      data.filter(item => item.campaignState !== 'archived' && item.campaignTargetType !== 'manual').length
      && data.filter(item => item.campaignState !== 'archived' && item.campaignTargetType !== 'manual')[0].campaignId || '');
    });
  },


  methods: {

    repetit(arr) {
      let res = [];
      const hasObj = {};
      res = arr.reduce((total, next) => {
        const filterKey = next.id;
        hasObj[filterKey] ? '' : hasObj[filterKey] = true && total.push(next);
        return total;
      }, []);
      return res;
    },

    loadmore() {
      const result = !this.searchCampaign ?
        this.page.size * this.page.current : this.searchPage.size * this.searchPage.current;
      const total = !this.searchCampaign ? this.total : this.searchTotal;
      if (result < total) { //加载全部出来 停止请求
        !this.searchCampaign ? this.page.current ++ : this.searchPage.current ++;
        this.queryCampaignList(true);
      }  
    },

    loadmoreGroup() {
      const result = !this.searchGroup ?
        this.groupPage.size * this.groupPage.current : this.groupSearchPage.size * this.groupSearchPage.current;
      const total = !this.searchGroup ? this.groupTotal : this.groupSearchTotal;
      if (result < total) { //加载全部出来 停止请求
        !this.searchGroup ? this.groupPage.current ++ : this.groupSearchPage.current ++;
        this.getGroupList(true);
      }  
    },

    cancel() {
      this.$emit('update:dialogVisible', false);
    },

    queryCampaignList(flag, name, id, type) {
      getDenyCampaignList({
        current: !this.searchCampaign ? this.page.current : this.searchPage.current,
        size: !this.searchCampaign ? this.page.size : this.searchPage.size,
      }, {
        adStoreId: this.storeId,
        name: this.searchCampaign || name,
        groupType: this.treeSelectedKey.campaignId ? '' : this.groupType,
      }).then(res => {

        if (res.data.code === 200) {
          this.campaignLoading = false;
          const data = res.data.data.records.map(item => {
            return {
              value: item.campaignId,
              id: item.campaignId,
              label: item.name
            };
          });
          if (this.searchCampaign) {
            this.searchTotal = res.data.data.total;
            if (this.searchTotal > this.searchPage.current * this.searchPage.size) {
              this.searchCampaignList = this.searchCampaignList.concat(data);
              this.searchCampaignList = this.repetit(this.searchCampaignList);
            } else {
              this.searchCampaignList = data;
            }
            return;
          }
          this.total = res.data.data.total;
          this.data = this.data.concat(res.data.data.records);
          if (type) {
            this.campaignList = this.data.map(item => {
              return {
                value: item.campaignId,
                id: item.campaignId,
                label: item.name
              };
            });
          }
          this.data = this.repetit(this.data);
          this.campaignList = this.data.map(item => {
            return {
              value: item.campaignId,
              id: item.campaignId,
              label: item.name
            };
          });
          
          if (!flag) { //非预加载赋值
            this.form.campaignId = id || this.campaignList.length && this.campaignList[0].id || '';
          }

          if (name) {
            this.queryCampaignList(true);
          }
        }
      }).catch(() => {
        this.campaignLoading = false;
      });
    },

    getGroupList(flag, name, id) {
      getDenyGroupList(
        {
          name: this.searchGroup || name,
          campaignId: this.form.campaignId,
          groupType: 'keyword',
          size: 20,
          current: 1
        }).then(res => {
      // getGroupList({
      //   current: !this.searchGroup ? this.groupPage.current : this.groupSearchPage.curren,
      //   size: !this.searchGroup ? this.groupPage.size : this.groupSearchPage.size,
      // },
      // {
      //   name: this.searchGroup || name,
      //   campaignIds: [this.form.campaignId].filter(Boolean),
      //   groupIds: id && [Number(id)] || [],
      //   targetingMode: this.treeSelectedKey.targetingType === 'auto' ? '' : 'keyword',
      //   states: ['enabled', 'paused'] }).then(res => {
        if (res.data.code === 200) {
          this.groupLoading = false;

          if (!res.data.data.records.length) {
            this.$message({
              type: 'error',
              message: '无数据'
            });
          }

          const data = res.data.data.records.map(item => {
            return {
              value: item.id,
              id: item.id,
              label: item.name
            };
          });
          
          if (this.searchGroup) {
            this.groupSearchTotal = res.data.data.total;
            if (this.groupSearchTotal > this.groupSearchPage.current * this.groupSearchPage.size) {
              this.searchGroupList = this.searchGroupList.concat(data);
              this.searchGroupList = this.repetit(this.searchGroupList);
            } else {
              this.searchGroupList = data;
            }
            return;
          }

          this.groupTotal = res.data.data.total;
          if (!flag) { //非预加载赋值
            this.groupList = data;
            this.form.groupId = this.groupList.length && Number(id) || this.groupList.length && this.groupList[0].id || '';
          } else {
            this.groupList = this.groupList.concat(data);
            this.groupList = this.repetit(this.groupList);
          }

          if (name || id) {
            this.getGroupList(true);
          }
        }
      });
    },

    remoteMethod(val) {
      this.searchCampaign = val;
      this.campaignLoading = true;
      this.searchCampaignList = [];
      this.searchPage.current = 1;
      this.queryCampaignList();
    },

    remoteMethodGroup(val) {
      this.searchGroup = val;
      this.groupLoading = true;
      this.searchGroupList = [];
      this.groupSearchPage.current = 1;
      this.getGroupList();
    },

    msg() {
      if (this.dialogType === 'group' && !this.form.groupId) {
        this.$message({
          type: 'error',
          message: '请选择广告组'
        });
        return true;
      } else if (this.activeName === 'suggest' && !this.$refs.denyKeyword.getField().length) {
        this.$message({
          type: 'error',
          message: '请选择关键词'
        });
        return true;
      } else if (this.activeName === 'input' && !this.textareaArr.filter(Boolean).length) {
        this.$message({
          type: 'error',
          message: '请输入否定关键词'
        });
        return true;
      }
      
    },

    saveBtn() {
      if (this.msg()) {
        return;
      } else if (this.handleTextareaBlur()) {
        return;
      }

      const textareaArr = this.textareaArr.map(item => {
        return {
          keywordText: item,
          matchType: this.ntMatchType
        };
      });

      createNegativeKeyword({
        ...this.form,
        negativeKeywordItemRoList: this.activeName === 'suggest' ? this.$refs.denyKeyword.getField() : textareaArr.filter(item => item.keywordText)
      }, this.dialogType).then(res => {
        if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: '添加否定关键词成功'
          });
          this.$emit('success');
          this.dialogVisible = false;
        }
      });
    },

    handleTextarea(value) {
      const maxLines = 1000;
      let valueArr = value.split(/\r\n|\r|\n/);
      const arr = [];
      valueArr.map((item, idx) => {
    
        if (item.length > 80) {
          this.$message({
            type: 'error',
            message: `第${idx + 1}行关键词已超过80个字符`
          });
          arr.push(item);
        }
      });

      this.disabled = arr.length;
      if (valueArr.length > maxLines) {
        valueArr = valueArr.slice(0, maxLines);
        value = valueArr.join('\n');
        this.textarea = value;
      }
      this.textareaArr = valueArr;
    },

    handleTextareaBlur() {
      this.repetition = [];
      const arr = new Map();
      const kong = [];
      let flag = false;
      const index = [];

      for (let i = 0; i < this.textareaArr.length; i ++) {
        if (this.textareaArr[i].trim() !== '') {
          if (this.textareaArr[i].length > 80) {
            index.push(i + 1);
            flag = true;
          }

          if (arr.has(this.textareaArr[i])) {
            arr.set(this.textareaArr[i], arr.get(this.textareaArr[i]) + 1);
          } else {
            arr.set(this.textareaArr[i], 0);
          }
        } else {
          kong.push(i);
        }
      }

      if (flag) {
        this.$message({
          type: 'error',
          message: `第${index.join('、')}行关键词已超过80个字符`
        });
        return true;
      }

      kong.length && kong.sort((a, b) => b - a).forEach(item => {
        this.textareaArr.splice(item, 1);
        this.textarea = this.textareaArr.join('\n');
      });

      for (const [key, value] of arr) {
        if (value > 0) {
          this.repetition.push(key);
        }
      }

      if (this.repetition.length) {
        this.textareaDialogVisible = true;
        return true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .msg {
    color: #ff4d4f;
    font-size: 20px;
    font-family: SimSun,sans-serif;
    content: "*";
    display: block;
    widows: 10px;
  }

  .box2 {
    width: 400px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .box2:hover {
    text-overflow:inherit;
    overflow: visible;
    white-space: pre-line;
  }
  
  .content {
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 6px
  }

  .textarea {
    width: 400px;
  }

  ::v-deep .el-textarea__inner {
    min-height: 350px !important;
    max-height: 350px;
  }
</style>

