<template>
  <el-dialog
    title="添加否定商品"
    :visible.sync="dialogVisible"
    :append-to-body="true"
    :close-on-press-escape="false"
    destroy-on-close
    @close="cancel"
    v-loading="loading"
    width="700px">
    <el-form label-width="160px" :model="form" ref="form" :rules="rules" hide-required-asterisk>

      <!-- <el-form-item v-if="!this.treeSelectedInfo.campaignId">
        <template slot="label">
          <div style="display: flex;">
            <span>广告活动投放类型：</span>
            <span class="msg">*</span>
          </div>
        </template>
        <el-select size="small">
          <el-option label="自动投放" />
          <el-option label="商品投放"/>
        </el-select>
      </el-form-item> -->

      <el-form-item v-if="!this.treeSelectedInfo.campaignId" prop="campaignId">
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

    <el-form-item v-if="!treeSelectedInfo.groupId" prop="groupId">
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
          no-match-text="无数据"
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
    </el-form>
    
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="ASIN" name="asin">
        <el-input
          type="textarea"
          :rows="2"
          :placeholder="'请输入ASIN，每行一个，回车换行'"
          v-model="textarea"
          @header-click="handleAllDelete"
          @input="handleTextarea"
          style="marginLeft: 10px; width: 640px">
        </el-input>
      </el-tab-pane>

      <el-tab-pane label="品牌" name="brand">
        <div style="height: 300px">功能开发中...</div>
      </el-tab-pane>
    </el-tabs>
    
    <span v-if="activeName === 'asin'" slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 定</el-button>
    </span>

    <el-dialog
      :visible.sync="msgDialogVisible"
      append-to-body
      :show-close="false"
      width="500px"
      center
      top="40vh"
      @close="handleClose"
      destroy-on-close>
      <div>
        <div v-if="msg.length">{{msg.join('、')}}添加成功；</div>
        <div v-if="repetition.length">{{repetition.join('、')}}已存在，无需重复添加；</div>
        <div v-if="fail.length">{{fail.join('、')}}添加失败，请检查ASIN是否有误；</div>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button size="small" 
            @click="msgDialogVisible = false; msg = []; repetition = []; fail = []">取 消{{max}}</el-button>
          <el-button
            type="primary"
            size="small"
            @click="handleCreate">确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>

import { createDenyTargeting, getGroupList, queryCampaignSelectList } from '@/api/ppc/adManage';

export default {

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
    treeSelectedInfo: {
      type: Object,
    }
  },

  data() {
    return {
      groupLoading: false,
      campaignLoading: false,
      searchGroup: '',
      groupList: [],
      searchGroupList: [],
      form: { groupId: '', campaignId: '', targetingType: 'manua' },
      activeName: 'asin',
      textarea: '',
      textareaArr: [],
      msgDialogVisible: false,
      repetition: [],
      fail: [],
      msg: [],
      data: [],
      campaignList: [],
      searchCampaignList: [],
      searchCampaign: '',
      total: 0,
      searchTotal: 0,
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

  mounted() {
    // console.log(this.treeSelectedInfo)
    !this.treeSelectedInfo.campaignId && this.queryCampaignList(false, '', '');
    !this.treeSelectedInfo.groupId && this.getGroupList();
  },

  watch: {
    'form.campaignId': {
      handler() {
        this.getGroupList(false, '', '');
      }
    }
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

    queryCampaignList(flag, name, id) {
      queryCampaignSelectList({
        current: !this.searchCampaign ? this.page.current : this.searchPage.current,
        size: !this.searchCampaign ? this.page.size : this.searchPage.size,
      }, {
        marketplace: this.marketplace,
        adStoreId: this.storeId,
        name: this.searchCampaign || name,
        states: ['enabled', 'paused'],
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
          this.campaignList = this.campaignList.concat(data);
          this.campaignList = this.repetit(this.campaignList);

          if (!flag) { //非预加载赋值
            this.form.campaignId = id || this.campaignList.length && this.campaignList[0].id || this.treeSelectedInfo.campaignId && this.campaignList[0].id || '';
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
      getGroupList({
        current: !this.searchGroup ? this.groupPage.current : this.groupSearchPage.curren,
        size: !this.searchGroup ? this.groupPage.size : this.groupSearchPage.size,
      },
      { name: this.searchGroup || name,
        campaignIds: [this.treeSelectedInfo.campaignId ?
          this.treeSelectedInfo.campaignId : this.form.campaignId].filter(Boolean),
        targetingMode: this.treeSelectedInfo.targetingType === 'auto' ? '' : 'targeting',
        states: ['enabled', 'paused'] }).then(res => {

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
              value: item.groupId,
              id: item.groupId,
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
            this.form.groupId = id || this.groupList.length && this.groupList[0].id || !this.treeSelectedInfo.campaignId && this.groupList[0].id || '';
          } else {
            this.groupList = this.groupList.concat(data);
            this.groupList = this.repetit(this.groupList);
          }

          if (name) {
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

    handleTextarea(value) {
      const maxLines = 1000;
      let valueArr = value.split(/\r\n|\r|\n/);

      if (valueArr.length > maxLines) {
        valueArr = valueArr.slice(0, maxLines);
        value = valueArr.join('\n');
        this.textarea = value;
      }
      this.textareaArr = valueArr;
    },

    handleSave() {
      const res = /^[A-Za-z0-9]+$/;
      const arr = new Map();
      const kong = [];

      for (let i = 0; i < this.textareaArr.length; i ++) {
        if (this.textareaArr[i].trim() !== '') {

          if (res.test(this.textareaArr[i]) && this.textareaArr[i].length === 10) {
            this.msg.push(this.textareaArr[i]);
            this.msg = [...new Set(this.msg)];
            if (arr.has(this.textareaArr[i])) {
              arr.set(this.textareaArr[i], arr.get(this.textareaArr[i]) + 1);
            } else {
              arr.set(this.textareaArr[i], 0);
            }
          } else {
            if (!res.test(this.textareaArr[i])) {
              this.fail.push(this.textareaArr[i]);
              this.fail = [...new Set(this.fail)];
            } else if (this.textareaArr[i].length !== 10) {
              this.fail.push(this.textareaArr[i]);
              this.fail = [...new Set(this.fail)];
            }
          }
        } else {
          kong.push(i);
        }
      }

      for (const [key, value] of arr) {
        if (value > 0) {
          this.repetition.push(key);
        }
      }

      kong.length && kong.sort((a, b) => b - a).forEach(item => {
        this.textareaArr.splice(item, 1);
        this.textarea = this.textareaArr.join('\n');
      });

      if (!this.treeSelectedInfo.groupId && !this.form.groupId) {
        return this.$message({
          type: 'error',
          message: '请选择广告组'
        });
      }

      if (this.fail.length || this.repetition.length) {
        this.msgDialogVisible = true;
      } else {
        if (!this.textareaArr.length) {
          this.$message({
            type: 'error',
            message: '请输入否定ASIN',
          });
          return;
        }

        const param = this.textareaArr.map(item => {
          return {
            asin: item
          };
        });

        createDenyTargeting({
          storeId: this.storeId,
          campaignId: this.treeSelectedInfo.campaignId,
          groupId: this.treeSelectedInfo.groupId || this.form.groupId,
          negativeTargetingAsinList: param,
        }).then(res => {

          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '添加否定商品成功'
            });
            this.$emit('success');
            this.$emit('update:dialogVisible', false);
          }

        });
      }  
    },

    handleCreate() {
      const res = /^[A-Za-z0-9]+$/;
      const param = [];
      const arr = new Map();
      this.textareaArr.map(item => {
        if (res.test(item) && item.length === 10) {
          if (arr.has(item)) {
            arr.set(item, arr.get(item) + 1);
          } else {
            arr.set(item, 0);
          }
        }
      });

      for (const [key] of arr) {
        param.push({
          asin: key
        });
      }
      if (!param.length) {
        this.msgDialogVisible = false;
        this.$message({
          type: 'error',
          message: `ASIN：${this.fail.join('、')}的格式有误，请重新输入` 
        });
        this.fail = [];
        return;
      }

      createDenyTargeting({
        storeId: this.storeId,
        campaignId: this.treeSelectedInfo.campaignId,
        groupId: this.treeSelectedInfo.groupId || this.form.groupId,
        negativeTargetingAsinList: param,
      }).then(res => {

        if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: '添加否定商品成功'
          });
          this.msgDialogVisible = false;
          this.$emit('success');
          this.$emit('update:dialogVisible', false);
        }

      });
    }
  },
};

</script>

<style lang="scss" scoped>
  ::v-deep .el-textarea__inner {
    min-height: 300px !important;
    max-height: 300px;
  }
  ::v-deep .el-dialog__body {
    padding: 0px 20px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }
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
</style>