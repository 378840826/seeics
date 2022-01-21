<template>
    <div id="echartss" style="width: 50%;height: 50%" ref="echart"></div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  name: 'keywordDetail',
  data () {
    return {
      id: this.$route.query.detailId
    }
  },
  mounted(){
    console.log(this.$refs.echart)
    this.drawLine();
  },
  methods: {
    drawLine(){
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(this.$refs.echart)
        // 绘制图表
        myChart.setOption({
            backgroundColor: '#000000',
            title: { 
              text: this.id,
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
<style scoped>
  #avue-view {
    background-color: black;
    
  }
</style>
