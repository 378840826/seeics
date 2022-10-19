<template>
  <div>
    <el-row>
      <el-col>
        <el-table
          :data="data"
          border
        >
          <el-table-column
            v-for="item in column"
            :key="item.prop"
            :label="item.label"
            :prop="item.prop"
            :slot="item.slot"
          >
            <template slot="30天转化率" slot-scope="scope">
              {{scope['30天转化率'] }}%
            </template>
          </el-table-column>
        </el-table>
      </el-col>

      <el-col>
        
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  data() {
    return {
      data: [{
        keyword: '1',
        type: '2',
        ['30天转化率']: 30
      }],
      column: [
        {
          label: '关键词',
          prop: 'keyword',
        },
        {
          label: '匹配方式',
          prop: 'type',
        },
        {
          label: '30天Clicks',
          prop: 'clicks',
        },
        {
          label: '30天订单',
          prop: '30天订单',
        },
        {
          label: '30天转化率',
          prop: '30天转化率',
          slot: true,
        }
      ]
    };
  },
};
</script>
