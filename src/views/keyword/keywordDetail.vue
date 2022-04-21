<template>
  <el-card class="mian">
    <!-- <div id="echartss" style="width: 50%;height: 50%" ref="echart"></div> -->
    <el-row :gutter="24">
      <el-col :span="6">
        <Title :title="'综合评分表'"/>
         <el-table
          style="width: 100%;background: linear-gradient(180deg, #000318 0%, #03093D 100%);"
          :data="data"
          border
          height='528'
          class="Mytable"
        >
          <el-table-column label="序号" prop="id" align="center" width= "44"/>
          <el-table-column label="评分选项" prop="id" align="left" width= "155"/>
          <el-table-column label="分值" prop="id" align="left" width= "43"/>
          <el-table-column label="星级，满分十级" prop="xi" align="left" width= "183">
            <template slot-scope="{row}">
               <el-rate
                  disabled
                  text-color="rgba(254, 178, 70, 1)RGBA"
                  :max=row.xi
                >
                </el-rate>
            </template>
          </el-table-column>
          <el-table-column label="分数" prop="id" align="left" width= "106"/>
        </el-table>
        <div class="div1"></div>
        <div class="div2"></div>
      </el-col>
      <el-col :span="4">
        <Title :title="'AC关键字'"/>
        <bar-chart :chartData="chartData" :title="'AC关键字'" :height="'528px'"/>
        <div class="div1"></div>
        <div class="div2"></div>
      </el-col>
      <el-col :span="14">
        <Title :title="'评论星级'" :width="'800px'"/>
        <bar-chart :chartData="chartData" :title="'评论数量区间个数'" :types="'scatter'" :height="'528px'"/>
        <div class="div1"></div>
        <div class="div2"></div>
      </el-col>
    </el-row>
    <el-row v-for="item in list" :key="item.height" :gutter="24">
       <el-col v-for="i in item.children" :key="i.title" :span="i.span">
          <Title :title="i.title"/>
          <bar-chart :chartData="chartData" :height="i.height"/>
          <div class="div1"></div>
          <div class="div2"></div>
        </el-col>
    </el-row>
    <!-- <el-row :gutter="24">
      <el-col :span="12">
        <Title :title="'评论数量'"/>
        <bar-chart :chartData="chartData" :title="'评论数量区间个数'" :height="'398px'"/>
      </el-col>
      <el-col :span="12">
        <Title :title="'价格分布图'"/>
        <bar-chart :chartData="chartData" :types="'scatter'" :height="'398px'"/>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="4">
        <Title :title="'卖家数量'"/>
        <bar-chart :chartData="chartData" :height="'368px'"/>
      </el-col>
      <el-col :span="20">
        <Title :title="'大类排名'"/>
        <bar-chart :chartData="chartData" :types="'scatter'" :height="'368px'"/>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="12">
        <Title :title="'小类排名'"/>
        <bar-chart :chartData="chartData" :height="'398px'"/>
      </el-col>
      <el-col :span="12">
        <Title :title="'变体数量区间个数'"/>
        <bar-chart :chartData="chartData" :types="'scatter'" :height="'398px'"/>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="5">
        <Title :title="'发货方式'"/>
        <bar-chart :chartData="chartData" :height="'398px'"/>
      </el-col>
      <el-col :span="9">
        <Title :title="'图片数量'"/>
        <bar-chart :chartData="chartData" :types="'scatter'" :height="'398px'"/>
      </el-col>
      <el-col :span="5">
        <Title :title="'相关视频'"/>
        <bar-chart :chartData="chartData" :types="'scatter'" :height="'398px'"/>
      </el-col>
      <el-col :span="5">
        <Title :title="'EBC图文品牌'"/>
        <bar-chart :chartData="chartData" :types="'scatter'" :height="'398px'"/>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="20">
        <Title :title="'ASIN距今发布时间'"/>
        <bar-chart :chartData="chartData" :height="'398px'"/>
      </el-col>
      <el-col :span="4">
        <Title :title="'卖家'"/>
        <bar-chart :chartData="chartData" :types="'scatter'" :height="'398px'"/>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="6">
        <Title :title="'各国占总比'"/>
        <bar-chart :chartData="chartData" :height="'398px'"/>
      </el-col>
      <el-col :span="18">
        <Title :title="'30天反馈'"/>
        <bar-chart :chartData="chartData" :types="'scatter'" :height="'398px'"/>
      </el-col>
    </el-row> -->
  </el-card>
    
</template>

<script>
import * as echarts from 'echarts';
import BarChart from '../../components/echarts/BarChart.vue';
import Title from '../../components/echarts/title.vue';

export default {
  name: 'keywordDetail',
  components: {
    BarChart,
    Title,
  },
  data () {
    return {
      id: this.$route.query.detailId,
      chartData: {
        days: ['11.21', '11.22', '11.23', '11.24', '11.25', '11.26', '11.27'],
        data1: [100, 120, 161, 134, 105, 160, 165]
      },
      // value: 3,
      data: [
        {
          id: 12
        },
        {
          id: 96,
          xi: 9
        }
      ],
      list: [
        {
          height: '398px',
          children: [
            {
              title: '评论数量',
              span: 12,
              height: '398px',
            },
            {
              title: '价格分布图',
              span: 12,
              height: '398px',
            }
          ]
        },
        {
          height: '368px',
          children: [
            {
              title: '卖家数量',
              span: 4,
              height: '368px',
            },
            {
              title: '大类排名',
              span: 20,
              height: '368px',
            }
          ]
        },
        {
          height: '398px',
          children: [
            {
              title: '小类排名',
              span: 12,
              height: '398px',
            },
            {
              title: '变体数量区间个数',
              span: 12,
              height: '398px',
            }
          ]
        },
        {
          height: '398px',
          children: [
            {
              title: '发货方式',
              span: 5,
              height: '398px',
            },
            {
              title: '图片数量',
              span: 9,
              height: '398px',
            },
            {
              title: '相关视频',
              span: 5,
              height: '398px',
            },
            {
              title: 'EBC图文品牌',
              span: 5,
              height: '398px',
            }
          ]
        },
        {
          height: '398px',
          children: [
            {
              title: 'ASIN距今发布时间',
              span: 20,
              height: '398px',
            },
            {
              title: '卖家',
              span: 4,
              height: '398px',
            }
          ]
        },
        {
          height: '398px',
          children: [
            {
              title: '各国占总比',
              span: 6,
              height: '398px',
            },
            {
              title: '30天反馈',
              span: 18,
              height: '398px',
            }
          ]
        },
      ]
    };
  },
  mounted(){
    console.log(this.$refs.echart);
    // this.drawLine();
  },
  methods: {
    drawLine(){
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(this.$refs.echart);
      // 绘制图表
      myChart.setOption({
        backgroundColor: '#000000',
        title: { 
          text: this.id,
          x: 'center', 
          y: '17px',
          textStyle: {
            fontSize: '14',
            fontWeight: 100,
            color: '#8BA6CF',
          },
        },
        tooltip: {
          show: false,
          // trigger: 'axis',
          // axisPointer: {
          //   type: 'shadow'
          // }
        },
        xAxis: [
          {
            // type: 'category',
            data: ['AC关键词分析个数', '无关AC关键词分析个数'],
            // axisTick: {
            //   alignWithLabel: true
            // }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              show: true,
              formatter: '{value}%'
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['	#8E8E8E'],
                width: 1,
                type: 'solid'
              }
            }
          }
        ],
        series: [
          {
            // name: '',
            type: 'bar',
            barWidth: '40%',
            data: [19, 52],
            itemStyle: {
              color: function(key) {
                const col = [new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#fff2cc' }, { offset: 1, color: '#993300' }]),
                  new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '	#F0FFF0' }, { offset: 1, color: '#006633' }])];
                return col[key.dataIndex];
              }
            },
            label: {
              show: true,
              position: 'top',
              formatter: '{c}%'
            }
          }
        ]
      });
    }
  }
};
</script>
<style lang="scss" scoped>
  .mian {
    width: 99%;
    margin: auto;
    background-color: rgba(0, 1, 16, 1);
  }
  .title {
    width: 338px;
    height: 40px;
    background: linear-gradient(270deg, #000110 0%, #043492 100%);
  }
  ::v-deep {
    .el-table th>.cell {
      padding-left: 0px;
      padding-right: 0px;
    }
    .el-table .cell {
      padding-right: 0px;
    }
    /* 删除表格下最底层的横线 */
    .el-table::before {
      left: 0;
      bottom: 0;
      width: 100%;
      height: 0px;
    }
    /*最外层透明*/
.el-table, .el-table__expanded-cell{
    background-color: transparent;
}
/* 表格内背景颜色 */
.el-table th,
.el-table tr,
.el-table td {
    background-color: transparent;
}
.el-table td, .el-table th.is-leaf {
    border: 1px solid rgba(8, 18, 81, 1);
}
  .el-table--border, .el-table--group{
    border: none;
  }
  .el-table__header-wrapper th:nth-last-of-type(2){
    // border-right: none;
  }
  .el-table--border td:nth-last-of-type(1){
    // border-right: none;
  }
  .el-table--border::after, .el-table--group::after{
    width: 0;
  }
  .el-table__body tr.hover-row > td.el-table__cell {
    background-color: transparent;
  }
  .el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: transparent;
  }
  .el-rate__icon {
    font-size: 18px;
    margin-right: 0px;
    color: #C0C4CC;
    -webkit-transition: .3s;
    transition: .3s;
}
.el-col {
  position: relative;
  .div1 {
    position: absolute;
    right: 10px;
    bottom: 0px;
				padding: 4px;
				border-style: solid;
				border-color: rgba(14, 65, 206, 1);
				border-width: 0 1px 1px 0;
  }
  .div2 {
    position: absolute;
    left: 10px;
				bottom: 0px;
				padding: 4px;
				border-style: solid;
				border-color: rgba(14, 65, 206, 1);
				border-width: 0 0 1px 1px;
  }
}
}
  
</style>
