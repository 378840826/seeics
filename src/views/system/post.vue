<!-- 岗位管理 -->
<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page.sync="page"
               :permission="permissionList"
               :before-open="beforeOpen"
               v-model="form"
               ref="crud"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @row-del="rowDel"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.post_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot-scope="{row}"
                slot="category">
        <el-tag>{{row.categoryName}}</el-tag>
      </template>
      <template slot="menuLeft">
        <el-button size="small"
                   icon="el-icon-setting"
                   @click="handleClickRoleSet"
                   :loading="roleBtnLoading"
                   plain>角色配置
        </el-button>
        <el-button size="small"
                   icon="el-icon-setting"
                   @click="handleClickStoreSet"
                   :loading="storeBtnLoading"
                   plain>店铺权限
        </el-button>
      </template>
      <!-- 编辑成员 -->
      <template slot-scope="{row,index}" slot="menu">
          <el-button type="text"
                     icon="el-icon-edit"
                     size="small"
                     @click="handleClickEditMember(row, index)"
                     plain>编辑成员
          </el-button>
      </template>
    </avue-crud>

    <!-- 角色分配弹窗 -->
    <el-dialog title="岗位角色配置"
               append-to-body
               :visible.sync="roleVisible"
               width="345px">
      <el-tree :data="roleList"
               show-checkbox
               node-key="id"
               ref="treeRole"
               :default-checked-keys="roleTreeObj"
               :props="roleProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 店铺权限弹窗 -->
    <el-dialog title="岗位店铺权限配置"
               append-to-body
               :visible.sync="storeVisible"
               width="500px">
      <el-checkbox :indeterminate="isStoreIndeterminate"
                   v-model="storeCheckAll" 
                   @change="handleStoreCheckAllChange">全选
      </el-checkbox>
      <el-checkbox-group v-model="storeChecked" @change="handleCheckedStoreChange" class="checkbox-group">
        <el-checkbox v-for="store in storeList" :label="store.id" :key="store.id">
          {{ store.marketplace }}-{{ store.storeName }}
        </el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="storeVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitStore">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑成员弹窗  -->
    <el-dialog
      title="编辑成员"
      :visible.sync="member.visible"
      :append-to-body="true"
    >
      <div>
        <div class="member_dialog-toolbar">
          <div>
            添加成员：
            <el-select
              v-model="member.selectedIds"
              placeholder="请选择成员"
              filterable
              multiple
              clearable
              tags
              collapse-tags
              :no-data-text="未找到相关数据"
              size="small"
              class="select"
              popper-class="select-popper"
              @clear="handleClearMemberSelected"
            >
              <div class="seeics-check_all">
                <el-checkbox
                  v-model="member.checkedAll"
                  @change="handleMemberCheckAllChange"
                >全选</el-checkbox>
              </div>
              <el-option
                v-for="item in member.showData.optionsList"
                :key="item.id"
                :label="item.realName"
                :value="item.id"
              />
            </el-select>
            <el-button type="primary" size="small" @click="handleAddMember">添 加</el-button>
          </div>
          
          <el-input
            placeholder="搜索姓名"
            v-model="member.filterName"
            size="small"
            class="input-filter_name"
          />
        </div>
        <el-table
          :data="showMemberList"
          style="width: 100%"
        >
          <el-table-column label="姓名" prop="realName" />
          <el-table-column label="手机号" prop="phone" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                @click="handleClickDel(scope.row)"
                type="text"
                size="small"
              >移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer">
        <el-button
          size="small"
          @click="member.visible = false"
        >取 消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="handleSaveMember"
        >保 存</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
import { getList, getDetail, add, update, remove } from '@/api/system/post';
// 权限改造新增的接口
import {
  getStoreList,
  getPostStore,
  modifyPostStore,
  getRoleList,
  getPostRole,
  modifyPostRole,
  getMemberOwnedPost,
  getMemberNotOwnedPost,
  modifyMemberOfPost,
} from '@/api/system/post';

import { mapGetters } from 'vuex';
import website from '@/config/website';

export default {
  data() {
    return {
      form: {},
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      // 角色配置弹窗
      roleVisible: false,
      roleBtnLoading: false,
      roleList: [],
      roleTreeObj: [],
      roleProps: {
        label: 'roleName',
        value: 'id'
      },
      // 店铺权限弹窗
      storeVisible: false,
      storeBtnLoading: false,
      storeList: [],
      storeChecked: [],
      storeCheckAll: false,
      isStoreIndeterminate: false,
      // 编辑成员弹窗
      member: {
        visible: false,
        postId: '',
        // 搜索姓名输入框
        filterName: '',
        selectedIds: [],
        // 下拉框是否全选
        checkedAll: false,
        // 原始的表格和下拉框数据(点击保存前，数据库的数据)
        originalData: {
          optionsList: [],
          tableList: [],
        },
        // 操作后的表格和下拉框数据(保存时提交给后端的数据)
        showData: {
          optionsList: [],
          tableList: [],
        },
      },
      option: {
        height: 'auto',
        calcHeight: 30,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        viewBtn: true,
        selection: true,
        dialogClickModal: false,
        menuWidth: 300,
        column: [
          {
            label: '所属租户',
            prop: 'tenantId',
            type: 'tree',
            dicUrl: '/api/blade-system/tenant/select',
            addDisplay: false,
            editDisplay: false,
            viewDisplay: website.tenantMode,
            span: 24,
            props: {
              label: 'tenantName',
              value: 'tenantId'
            },
            hide: !website.tenantMode,
            rules: [{
              required: true,
              message: '请输入所属租户',
              trigger: 'click'
            }]
          },
          {
            label: '岗位类型',
            prop: 'category',
            type: 'select',
            dicUrl: '/api/blade-system/dict/dictionary?code=post_category',
            props: {
              label: 'dictValue',
              value: 'dictKey'
            },
            dataType: 'number',
            slot: true,
            search: true,
            rules: [{
              required: true,
              message: '请选择岗位类型',
              trigger: 'blur'
            }]
          },
          {
            label: '岗位编号',
            prop: 'postCode',
            search: true,
            rules: [{
              required: true,
              message: '请输入岗位编号',
              trigger: 'blur'
            }]
          },
          {
            label: '岗位名称',
            prop: 'postName',
            search: true,
            rules: [{
              required: true,
              message: '请输入岗位名称',
              trigger: 'blur'
            }]
          },
          {
            label: '岗位排序',
            prop: 'sort',
            type: 'number',
            rules: [{
              required: true,
              message: '请输入岗位排序',
              trigger: 'blur'
            }]
          },
          {
            label: '岗位描述',
            prop: 'remark',
            type: 'textarea',
            span: 24,
            minRows: 6,
            hide: true,
          },
        ]
      },
      data: []
    };
  },
  computed: {
    ...mapGetters(['permission']),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.post_add, false),
        viewBtn: this.vaildData(this.permission.post_view, false),
        delBtn: this.vaildData(this.permission.post_delete, false),
        editBtn: this.vaildData(this.permission.post_edit, false)
      };
    },
    ids() {
      const ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(',');
    },
    // 全部店铺的 id 数组
    storeIds() {
      return this.storeList.map(item => item.id);
    },
    // 编辑成员弹窗列表，列表筛选后的成员
    showMemberList() {
      const filterName = this.member.filterName;
      const list = this.member.showData.tableList;
      if (filterName === '') {
        return list;
      }
      const showList = [];
      list.forEach(item => {
        if (item.realName.includes(filterName)) {
          showList.push(item);
        }
      });
      return showList;
    },
  },
  methods: {
    rowSave(row, done, loading) {
      add(row).then(() => {
        this.onLoad(this.page);
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
        done();
      }, error => {
        window.console.log(error);
        loading();
      });
    },
    rowUpdate(row, index, done, loading) {
      update(row).then(() => {
        this.onLoad(this.page);
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
        done();
      }, error => {
        window.console.log(error);
        loading();
      });
    },
    rowDel(row) {
      this.$confirm('确定将选择数据删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: 'success',
            message: '操作成功!'
          });
        });
    },
    handleDelete() {
      if (this.selectionList.length === 0) {
        this.$message.warning('请选择至少一条数据');
        return;
      }
      this.$confirm('确定将选择数据删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return remove(this.ids);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: 'success',
            message: '操作成功!'
          });
          this.$refs.crud.toggleSelection();
        });
    },
    beforeOpen(done, type) {
      if (['edit', 'view'].includes(type)) {
        getDetail(this.form.id).then(res => {
          this.form = res.data.data;
        });
      }
      done();
    },
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    onLoad(page, params = {}) {
      this.loading = true;
      getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
      });
    },

    // 点击权限设置(角色分配)
    handleClickRoleSet() {
      if (this.selectionList.length !== 1) {
        this.$message.warning('只能选择一条数据');
        return;
      }
      this.roleBtnLoading = true;
      this.roleTreeObj = [];
      // 获取全部角色
      getRoleList({}).then(res => {
        this.roleList = res.data.data;
        const params = {
          postId: this.selectionList[0].id,
        };
        // 获取当前岗位拥有的角色
        getPostRole(params).then(res => {
          this.roleTreeObj = res.data.data.map(item => item.id);
          this.roleVisible = true;
        }).finally(() => {
          this.roleBtnLoading = false;
        });
      });
    },

    // 提交角色分配
    submitRole() {
      const roleIds = this.$refs.treeRole.getCheckedKeys();
      const params = {
        postId: this.selectionList[0].id,
        addIds: roleIds,
      };
      modifyPostRole(params).then(() => {
        this.roleVisible = false;
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
      });
    },

    // 点击店铺权限(店铺分配)
    handleClickStoreSet() {
      if (this.selectionList.length !== 1) {
        this.$message.warning('只能选择一条数据');
        return;
      }
      this.storeBtnLoading = true;
      this.storeChecked = [];
      // 获取全部店铺
      getStoreList().then(res => {
        const list = res.data.data.sort((a, b) => a.storeName.localeCompare(b.storeName));
        this.storeList = list;
        const params = {
          postId: this.selectionList[0].id,
        };
        // 获取当前岗位拥有的店铺
        getPostStore(params).then(res => {
          const storeIds = res.data.data.map(item => item.id);
          this.storeChecked = storeIds;
          this.storeVisible = true;
          this.handleCheckedStoreChange(storeIds);
        }).finally(() => {
          this.storeBtnLoading = false;
        });
      });
    },

    // 提交店铺分配
    submitStore() {
      const params = {
        postId: this.selectionList[0].id,
        addIds: this.storeChecked,
      };
      modifyPostStore(params).then(() => {
        this.storeVisible = false;
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
      });
    },

    // 点击勾选店铺
    handleCheckedStoreChange(value) {
      // 设置全选框的状态
      const checkedCount = value.length;
      this.storeCheckAll = checkedCount === this.storeList.length;
      this.isStoreIndeterminate = checkedCount > 0 && checkedCount < this.storeList.length;
    },

    // 点击勾选全选店铺
    handleStoreCheckAllChange(value) {
      this.storeChecked = value ? this.storeIds : [];
      this.isStoreIndeterminate = false;
    },

    // 点击编辑成员按钮
    handleClickEditMember(row) {
      this.member.postId = row.id;
      this.member.visible = true;
      const params = {
        postId: row.id,
      };
      // 获取成员表格和待选成员
      getMemberOwnedPost(params).then(res => {
        const list = res.data.data;
        this.member.originalData.tableList = [...list];
        this.member.showData.tableList = [...list];
      });
      getMemberNotOwnedPost(params).then(res => {
        const list = res.data.data;
        this.member.originalData.optionsList = [...list];
        this.member.showData.optionsList = [...list];
      });
    },

    // 编辑成员弹窗-下拉框全选用户
    handleMemberCheckAllChange(checked) {
      if (checked) {
        this.member.selectedIds = this.member.showData.optionsList.map(item => item.id);
      } else {
        this.member.selectedIds = [];
      }
    },


    // 编辑成员弹窗-点击添加用户
    handleAddMember() {
      const ids = this.member.selectedIds;
      if (!ids.length) {
        this.$message.warning('请选择要添加的成员');
        return;
      }
      // 清空下拉框选中
      this.member.selectedIds = [];
      // 通过 ids 找出用户数据
      const selectedList = ids.map(id => {
        return this.member.showData.optionsList.find(item => item.id === id);
      });
      // 添加到表格
      this.member.showData.tableList.unshift(...selectedList);
      // 从下拉框中删除
      const optionsList = [];
      this.member.showData.optionsList.forEach(item => !ids.includes(item.id) && optionsList.push(item));
      this.member.showData.optionsList = optionsList;
    },

    // 编辑成员弹窗-点击移除用户
    handleClickDel(row) {
      // 添加到下拉框选项中
      const member = this.member.showData.tableList.find(item => item.id === row.id);
      this.member.showData.optionsList.unshift(member);
      // 从 tableList 中删除
      const index = this.member.showData.tableList.findIndex(item => item.id === row.id);
      this.member.showData.tableList.splice(index, 1);
    },

    // 编辑成员弹窗-点击保存
    handleSaveMember() {
      const showIds = this.member.showData.tableList.map(item => item.id);
      const originalIds = this.member.originalData.tableList.map(item => item.id);
      const addIds = showIds.filter(id => !originalIds.includes(id));
      const removeIds = originalIds.filter(id => !showIds.includes(id));
      const params = {
        postId: this.member.postId,
        addIds,
        removeIds,
      };
      modifyMemberOfPost(params).then(res => {
        this.$message.success(res.data.message || '操作成功');
        this.member.visible = false;
      });
    },
  },

  watch: {
    // 添加成员勾选变动时
    'member.selectedIds'(ids) {
      // 全选框状态
      if (ids.length === this.member.showData.optionsList.length) {
        this.member.checkedAll = true;
      } else {
        this.member.checkedAll = false;
      }
    },
  },
};
</script>

<style scoped>
.checkbox-group {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 300px;
  overflow: auto;
}

.member_dialog-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;

}

.input-filter_name {
  width: 200px;
}

.seeics-check_all {
  padding: 3px 10px;
  display: flex;
  justify-content: flex-end;
}
</style>
