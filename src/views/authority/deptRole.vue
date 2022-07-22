<!-- 机构角色 -->
<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               ref="crud"
               v-model="form"
               :permission="permissionList"
               :before-open="beforeOpen"
               @row-del="rowDel"
               @row-update="rowUpdate"
               @row-save="rowSave"
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
                   v-if="permission.role_delete"
                   plain
                   @click="handleDelete">删 除
        </el-button>
        <el-button size="small"
                   icon="el-icon-setting"
                   @click="handleRole"
                   v-if="userInfo.role_name.includes('admin')"
                   plain>权限设置
        </el-button>
      </template>
      <!-- 编辑成员 -->
      <template slot-scope="{row,index}" slot="menu">
          <el-button
            type="text"
            icon="el-icon-edit"
            size="small"
            plain
            @click="handleClickEditMember(row, index)"
          >
            编辑成员
          </el-button>
      </template>
    </avue-crud>
    <el-dialog title="角色权限配置"
               append-to-body
               :visible.sync="box"
               width="345px">
      <el-tabs type="border-card">
        <el-tab-pane label="菜单权限">
          <el-tree :data="menuGrantList"
                   show-checkbox
                   node-key="id"
                   ref="treeMenu"
                   :default-checked-keys="menuTreeObj"
                   :props="props">
          </el-tree>
        </el-tab-pane>
        <el-tab-pane label="数据权限">
          <el-tree :data="dataScopeGrantList"
                   show-checkbox
                   node-key="id"
                   ref="treeDataScope"
                   :default-checked-keys="dataScopeTreeObj"
                   :props="props">
          </el-tree>
        </el-tab-pane>
        <el-tab-pane label="接口权限">
          <el-tree :data="apiScopeGrantList"
                   show-checkbox
                   node-key="id"
                   ref="treeApiScope"
                   :default-checked-keys="apiScopeTreeObj"
                   :props="props">
          </el-tree>
        </el-tab-pane>
      </el-tabs>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="box = false">取 消</el-button>
        <el-button type="primary"
                   @click="submit">确 定</el-button>
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
              @clear="handleClearMemberSelected"
            >
              <div class="check_all">
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
import {
  add,
  getList,
  getRole,
  getRoleTreeById,
  grant,
  grantTree,
  remove,
  update,
  getMemberOwnedRole,
  getMemberNotOwnedRole,
  modifyMemberOfRole,
  getMemberOwnedMenu,
} from '@/api/system/deptRole';
import { mapGetters } from 'vuex';
// import website from '@/config/website';

export default {
  data() {
    return {
      form: {},
      box: false,
      props: {
        label: 'title',
        value: 'key'
      },
      menuGrantList: [],
      dataScopeGrantList: [],
      apiScopeGrantList: [],
      apiGrantList: [],
      menuTreeObj: [],
      dataScopeTreeObj: [],
      apiScopeTreeObj: [],
      selectionList: [],
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      option: {
        tip: false,
        simplePage: true,
        searchShow: true,
        searchMenuSpan: 6,
        tree: true,
        border: true,
        index: true,
        selection: true,
        viewBtn: true,
        dialogWidth: 900,
        dialogClickModal: false,
        menuWidth: 300,
        column: [
          {
            label: '角色名称',
            prop: 'roleName',
            search: true,
            span: 24,
            rules: [
              {
                required: true,
                message: '请输入角色名称',
                trigger: 'blur'
              }
            ]
          },
          // {
          //   label: '所属租户',
          //   prop: 'tenantId',
          //   type: 'tree',
          //   dicUrl: '/api/blade-system/tenant/select',
          //   addDisplay: false,
          //   editDisplay: false,
          //   viewDisplay: website.tenantMode,
          //   span: 24,
          //   props: {
          //     label: 'tenantName',
          //     value: 'tenantId'
          //   },
          //   hide: !website.tenantMode,
          //   search: website.tenantMode,
          //   rules: [{
          //     required: true,
          //     message: '请输入所属租户',
          //     trigger: 'click'
          //   }]
          // },
          {
            label: '角色别名',
            prop: 'roleAlias',
            search: true,
            span: 24,
            rules: [
              {
                required: true,
                message: '请输入角色别名',
                trigger: 'blur'
              }
            ]
          },
          {
            label: '上级角色',
            prop: 'parentId',
            dicData: [],
            type: 'tree',
            hide: true,
            span: 24,
            props: {
              label: 'title'
            },
            rules: [
              {
                required: false,
                message: '请选择上级角色',
                trigger: 'click'
              }
            ]
          },
          {
            label: '成员数量',
            prop: 'userCount',
            type: 'number',
            span: 24,
            addDisplay: false,
            editDisplay: false,
          },
          {
            label: '角色排序',
            prop: 'sort',
            type: 'number',
            span: 24,
            rules: [
              {
                required: true,
                message: '请输入角色排序',
                trigger: 'blur'
              }
            ]
          }
        ]
      },
      data: [],
      // 编辑成员弹窗
      member: {
        visible: false,
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
    };
  },
  computed: {
    ...mapGetters(['userInfo', 'permission']),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.role_add, false),
        viewBtn: this.vaildData(this.permission.role_view, false),
        delBtn: this.vaildData(this.permission.role_delete, false),
        editBtn: this.vaildData(this.permission.role_edit, false)
      };
    },
    ids() {
      const ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);

      });
      return ids.join(',');
    },
    idsArray() {
      const ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids;
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
    initData(roleId){
      getRoleTreeById(roleId).then(res => {
        const column = this.findObject(this.option.column, 'parentId');
        column.dicData = res.data.data;
      });
    },
    submit() {
      const menuList = this.$refs.treeMenu.getCheckedKeys();
      const dataScopeList = this.$refs.treeDataScope.getCheckedKeys();
      const apiScopeList = this.$refs.treeApiScope.getCheckedKeys();
      grant(this.idsArray, menuList, dataScopeList, apiScopeList).then(() => {
        this.box = false;
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
        this.onLoad(this.page);
      });
    },
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
    beforeOpen(done, type) {
      if (['add', 'edit'].includes(type)) {
        this.initData(this.form.id);
      }
      done();
    },
    handleRole() {
      if (this.selectionList.length !== 1) {
        this.$message.warning('只能选择一条数据');
        return;
      }
      this.menuTreeObj = [];
      this.dataScopeTreeObj = [];
      this.apiScopeTreeObj = [];
      grantTree()
        .then(res => {
          this.dataScopeGrantList = res.data.data.dataScope;
          this.apiScopeGrantList = res.data.data.apiScope;
          // 获取菜单权限树（不用 grantTree获取的 menu）
          getMemberOwnedMenu().then(res => {
            this.menuGrantList = res.data.data.menu;
            getRole(this.ids).then(res => {
              this.menuTreeObj = res.data.data.menu;
              this.dataScopeTreeObj = res.data.data.dataScope;
              this.apiScopeTreeObj = res.data.data.apiScope;
              this.box = true;
            });
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
        this.data = res.data.data;
        this.loading = false;
        this.selectionClear();
      });
    },

    // 点击编辑成员按钮
    handleClickEditMember(row) {
      this.member.roleId = row.id;
      this.member.visible = true;
      const params = {
        roleId: row.id,
      };
      // 获取成员表格和待选成员
      getMemberOwnedRole(params).then(res => {
        const list = res.data.data;
        this.member.originalData.tableList = [...list];
        this.member.showData.tableList = [...list];
      });
      getMemberNotOwnedRole(params).then(res => {
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
        roleId: this.member.roleId,
        addIds,
        removeIds,
      };
      modifyMemberOfRole(params).then(res => {
        this.$message.success(res.data.message || '操作成功');
        this.member.visible = false;
        this.onLoad(this.page);
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

<style scoped lang="scss">
.member_dialog-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;

}

.input-filter_name {
  width: 200px;
}

.check_all {
  padding: 3px 10px;
  display: flex;
  justify-content: flex-end;
}
</style>
