<template>
  <div>
    <el-table
      :data="data"
      border
      :header-cell-style="headerStyle"
    >
      <el-table-column
        prop="timeScope"
        :render-header="timeScope"
      >
        <template slot-scope="scope">
          <el-select
            v-if="scope.row.timeLimit !== '自定义时间范围'"
            v-model="scope.row.timeLimit"
            @change="handleTimeScope($event, scope.$index)"
            size="mini">
            <el-option
              v-for="(key, idx) in timeScopeList"
              :key="key"
              :label="key"
              :value="key"
            />
          </el-select>

          <div v-else-if="scope.row.timeLimit === '自定义时间范围'">
            <el-select
              v-model="scope.row.startTime"
              size="mini"
              style="width: 140px; marginRight: 10px"
            >
              <el-option
                v-for="(key, idx) in timeList"
                :key="key"
                :label="key"
                :value="key"
                
              />
            </el-select>

            <el-select
              v-model="scope.row.endTime"
              size="mini"
              style="width: 140px"
            >
              <el-option
                v-for="(key, idx) in timeList"
                :key="key"
                :label="key"
                :value="key"
                :disabled="Number(scope.row.startTime.split(':').filter(Boolean).length && scope.row.startTime.split(':')[0] || 0)
                  >= Number(key.split(':').filter(Boolean).length && key.split(':')[0] || 0)"
              />
            </el-select>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="竞价调整"
      >
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.adjustTheValue"
            style="width: 140px"
            size="mini"
          >
            <el-option
              v-for="item in bidAdjustList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>

          <el-select
            v-model="scope.row.rule"
            style="width: 140px"
            size="mini"
          >
            <el-option
              v-for="item in flaotList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column
        label="竞价策略"
      >
      </el-table-column>

      <el-table-column
        label="操作"
        width="60"
      >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

import { timeList, timeScopeList, bidAdjustList, flaotList } from '../dict';
export default {
  
  data() {
    return {
      timeList,
      bidAdjustList,
      flaotList,
      timeScopeList: ['自定义时间范围', ...timeScopeList],
      headerStyle: {
        color: '#232f3f',
        fontSize: '12px',
        backgroundColor: '#fafafa',
      },
      data: [
        {
          startTime: '',
          endTime: '',
          timeLimit: ''
        }
      ],
      value: ''
    };
  },

  watch: {
    data: {
      handler(val) {
        // console.log(val)
        // console.log(val[0].timeLimit.split('，')[1].split('-')[0].trim())
      },
      deep: true
    }
  },

  methods: {
    timeScope() {
      return <div><span style="padding: 1px 3px;font-weight: 600;background: rgba(51,153,255,.2);border-radius: 1px;">站点当地时间</span>范围</div>;
    },

    handleTimeScope(val, index) {
      if (val !== '自定义时间范围') {
        this.data[index].startTime = this.data[index].timeLimit.split('，')[1].split('-')[0].trim();
        this.data[index].endTime = this.data[index].timeLimit.split('，')[1].split('-')[1].trim();
      } else {
        this.data[index].startTime = '';
        this.data[index].endTime = '';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  
</style>