<template>
    <div :style="{width: width, height: height}" ref="echart" id="chart"><div></div><div></div></div>
</template>

<script>
import * as echarts from 'echarts';
import chartResize from './echartSize'
export default {
  name: 'keywordDetail',
  mixins: [chartResize],
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '560px'
    },
    chartData: {
      type: Object,
      require: true
    },
    title: {
      type: String,
      default: ''
    },
    types: {
      type: String,
      default: 'bar'
    }
  },
  data () {
    return {
      id: this.$route.query.detailId,
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOption(val)
      }
    }
  },
  mounted(){
    this.$nextTick(() => {
      console.log(this.chartData)
      this.initChart()
    })
    // this.drawLine();
  },
  methods: {
      initChart() {
      this.chart = echarts.init(this.$el)
      this.setOption(this.chartData)
    },
    setOption({days, data1}) {
      this.chart.setOption({
            backgroundColor: 'rgba(255,255,255,0)',
            title: { 
              text: this.title,
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
              data: days,
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
                // formatter: '{value}%'
              },
              splitLine: {
                show: true,
                lineStyle:{
                  color: ['	#8E8E8E'],
                  width: 1,
                  type: 'dashed'
                }
              }
            }
          ],
          series: [
            {
              // name: '',
              type: this.types,
              barWidth: '40%',
              stack: 'Total',
              symbolSize: 16,
              data: data1,
            //   itemStyle: {
            //     color: function(key) {
            //       let col = [new echarts.graphic.LinearGradient(0, 0, 1, 0, [{offset: 0, color: '#fff2cc'},  {offset: 1, color: '#993300'}, ]),
            //                  new echarts.graphic.LinearGradient(0, 0, 1, 0, [{offset: 0, color: '	#F0FFF0'},  {offset: 1, color: '#006633'}, ])]
            //       return col[key.dataIndex]
            //     }
            //   },
            //   label: {
            //     show: true,
            //     position: 'top',
            //     formatter: 'c'
            //   }
            }
          ]
        })
    },
    drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(this.$refs.echart)
        // 绘制图表
        myChart.setOption({
            backgroundColor: '#000000',
            title: { 
              text: this.title,
              x: 'center', 
              y: '17px',
              textStyle: {
                fontSize: '26',
                fontWeight: 100,
                color: '#ffffff',
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
                lineStyle:{
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
                  let col = [new echarts.graphic.LinearGradient(0, 0, 1, 0, [{offset: 0, color: '#fff2cc'},  {offset: 1, color: '#993300'}, ]),
                             new echarts.graphic.LinearGradient(0, 0, 1, 0, [{offset: 0, color: '	#F0FFF0'},  {offset: 1, color: '#006633'}, ])]
                  return col[key.dataIndex]
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
}
</script>
<style lang="scss" scoped>
  #avue-view {
    background-color: black;
  }
  #chart {
    background: linear-gradient(180deg, #000318 0%, #03093D 100%);
    position: relative;
    
  }
  .span1 {
      position: absolute;
				right: -5px;
				bottom: -5px;
				padding: 15px;
				border-style: solid;
				border-color: rebeccapurple;
				border-width: 0 5px 5px 0;
    }
</style>
