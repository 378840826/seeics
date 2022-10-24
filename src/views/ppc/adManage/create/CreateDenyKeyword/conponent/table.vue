<template>
  <div>
    <el-row type="flex" justify="space-between">
      <el-col :span="11">
        
        <div style="display: flex; justify-content: space-between;">
          <div style="width: 250px; display: flex; lineHeight: 30px">
            <span>匹配方式：</span>
            <el-checkbox-group
              v-model="typem"
              @change="getSuggestKeyword()"
              style="width: 150px">
                <el-checkbox label="exact">精准</el-checkbox>
                <el-checkbox label="phrase">词组</el-checkbox>
            </el-checkbox-group>
          </div>
        
          <el-button
            @click="handleSelectAll"
            type="text" 
            size="small" 
            style="paddingRight: 36px;fontSize: 14px">全选</el-button>
        </div>

        <el-table
          :data="dataSource"
          border
          :header-cell-style="{padding: '10px 0',
            fontWeight: '400',
            color: '#000000',
            backgroundColor: '#FAFAFA'}"
          :empty-text="dialogType === 'group' ? '未查询到建议关键词，请重新选择广告组' : '未查询到建议关键词'"
          height="300px"
        >
          <el-table-column
            v-for="item in column"
            :key="item.prop"
            :label="item.label"
            :prop="item.prop"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span v-if="scope.column.label === '匹配方式'">
                {{scope.row.matchType && NegativeKeywordMatchTypeNameDict[scope.row.matchType] || '——'}}
              </span>
              <span
                v-else-if="scope.column.label === '30天转化率'">
                  {{scope.row.conversionsRate && scope.row.conversionsRate + "%" || '——'}}
                </span>
              <span v-else>{{scope.row[scope.column.property] || '——' }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            width="100px"
          >
            <template slot-scope="{row}">
              <el-button
                v-show="!row.checked"
                type="text"
                @click="add(row)"
                style="padding: 0">选 择</el-button>
              <el-button
                v-show="row.checked"
                :disabled="row.checked"
                type="text"
                size="small"
                style="padding: 0; margin: 0">已 选</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>

      <el-col :span="11">

        <div style="marginBottom: 1px">
          <el-button
            size="small"
            @click="batchDelete"
            :disabled="!checkedData.length"
            style="fontSize: 14px"
          >批量删除</el-button>

          <el-select
            v-model="matchType"
            @change="batchMatchType"
            size="small"
            placeholder="投放方式"
            :disabled="!checkedData.length"
            style="marginLeft: 10px">
            <el-option
              v-for="(value, key) in NegativeKeywordMatchTypeNameDict"
              :key="value"
              :value="key"
              :label="value"
            />
          </el-select>

        </div>

        <el-table
          :data="selectData"
          border
          :header-cell-style="{padding: '10px 0',
            fontWeight: '400',
            color: '#000000',
            backgroundColor: '#FAFAFA'}"
          height="300px"
          empty-text="请选择建议关键词或手动输入关键词添加"
          @selection-change="handleSelect"
          row-class-name="tableRowClassName"
        >
          
          <el-table-column
            type="selection"
            fixed="left"
            width="50px"/>

          <el-table-column
            v-for="item in column"
            :key="item.prop"
            :label="item.label"
            :prop="item.prop"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                v-if="scope.column.label === '30天转化率'">
                {{scope.row.conversionsRate && scope.row.conversionsRate + "%" || '——'}}
              </span>
              <el-dropdown v-else-if="scope.column.label === '匹配方式'" placement="bottom" @command="templateStutes">
              <span>{{NegativeKeywordMatchTypeNameDict[scope.row.matchType]}}
                <i class="el-icon-edit table-edit-icon"></i>
              </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item 
                    v-for="(value, key) in NegativeKeywordMatchTypeNameDict" 
                    :key="key" 
                    :command="{ matchType: key, index: scope.$index}"
                    :value="key"
                    :class="{'selected':scope.row.matchType === key}">{{value}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <span v-else>{{scope.row[scope.column.property] || '——' }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleDelete(scope.$index, scope.row)"
                style="padding: 0">删 除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[20, 50, 100]"
        :page-size="page.size"
        :current-page="page.current"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
  </div>
</template>

<script>

import { NegativeKeywordMatchTypeNameDict } from '../../../utils/dict';
import { getSuggestKeyword } from '@/api/ppc/adManage';

export default {
  name: 'table',
  props: {
    marketplace: {
      type: String,
    },
    forms: {
      type: Object,
      require: true,
    },
    dialogType: {
      type: String,
      require: true,
    },
  },

  data() {
    return {
      dataSource: [],
      selectData: [],
      checkedData: [],
      typem: ['exact'],
      matchType: '',
      NegativeKeywordMatchTypeNameDict,
      column: [
        {
          label: '关键词',
          prop: 'keywordText',
        },
        {
          label: '匹配方式',
          prop: 'matchType',
        },
        {
          label: '30天Clicks',
          prop: 'clicks',
        },
        {
          label: '30天订单',
          prop: 'orders',
        },
        {
          label: '30天转化率',
          prop: 'conversionsRate',
        }
      ],
      page: {
        size: 20,
        current: 1
      },
      total: 0,
    };
  },

  watch: {
    forms: {
      handler() {
        this.getSuggestKeyword();
      },
      deep: true,
    } 
  },

  methods: {

    getField() {
      const res = this.selectData.map(item => {
        return {
          keywordText: item.keywordText,
          matchType: item.matchType
        };
      });
      return res;
    },

    getSuggestKeyword() {
      getSuggestKeyword(this.page, {
        ...this.forms,
        matchType: this.typem,
      }).then(res => {

        //已选关键词默认禁选
        const arr = this.selectData.length && this.selectData.map(item => item.keywordText) || [];

        this.dataSource = res.data.data.records.map(item => {
          if (arr.includes(item.keywordText)) {
            item.checked = true;
          } else {
            item.checked = false;
          }
          return item;
        });
        this.total = res.data.data.total;
      });
    },

    add(row) {
      const arr = this.selectData.length && this.selectData.map(item => item.keywordText) || [];
      if (!arr.includes(row.keywordText)) {
        this.selectData.unshift(JSON.parse(JSON.stringify(row)));
        this.dataSource.forEach(item => {
          if (item.keywordText === row.keywordText) {
            item.checked = true;
          }
        });
      }
    },

    handleSelectAll() {
      const arr = this.selectData.length && this.selectData.map(item => item.keywordText) || [];
      this.dataSource.forEach(item => {
        if (!arr.includes(item.keywordText)) {
          item.checked = true;
          this.selectData.unshift(JSON.parse(JSON.stringify(item)));
        }
      });
    },

    handleDelete(index, row) {
      this.selectData.splice(index, 1);
      this.dataSource.forEach(item => {
        if (item.keywordText === row.keywordText) {
          item.checked = false;
        }
      });
    },

    handleSelect(param) {
      this.checkedData = param;
    },
    
    batchDelete() {
      const arr = this.checkedData.map(item => item.keywordText) || [];

      this.selectData = this.selectData.filter(item => !arr.includes(item.keywordText));

      this.dataSource.forEach(item => {
        if (arr.includes(item.keywordText)) {
          item.checked = false;
        }
      });
    },

    batchMatchType(val) {
      const arr = this.checkedData.map(item => item.keywordText) || [];

      this.selectData.forEach(item => {
        if (arr.includes(item.keywordText)) {
          item.matchType = val;
        }
      });
    },

    templateStutes(val) {
      this.selectData[val.index].matchType = val.matchType;
    },

    handleCurrentChange(val) {
      this.page.current = val;
      this.getSuggestKeyword();
    },

    handleSizeChange(val) {
      this.page.size = val;
      this.getSuggestKeyword();
    },
  }
};
</script>

<style lang="scss" scoped>
  .selected {
    color:#409EFF;
  }
  
  .table-edit-icon {
    display: none;
  }

  .tableRowClassName:hover {
    .table-edit-icon {
      display: inherit;
    }
  }
</style>
