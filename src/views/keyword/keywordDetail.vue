<template>
  <el-card class="mian">
    <el-row :gutter="24">
      <el-col :span="6">
        <Title :title="'综合评分表'"/>
         <el-table
          style="width: 100%;background: linear-gradient(180deg, #000318 0%, #03093D 100%);"
          :data="data"
          border
          height='528'
          class="Mytable"
          :span-method="objectSpanMethod"
        >
          <el-table-column label="序号" type="index" align="center" width= "44"/>
          <el-table-column label="评分选项" prop="column" align="left" width= "155"/>
          <el-table-column label="分值" prop="score" align="left" width= "50"/>
          <el-table-column label="星级，满分十级"  align="left" min-width="200">
            <template slot-scope="{row}">
               <el-rate
                  disabled
                  text-color="rgba(254, 178, 70, 1)RGBA"
                  :max=row.score
                >
                </el-rate>
            </template>
          </el-table-column>
          <el-table-column label="分数" prop="props" align="center" width= "106">
            <template slot-scope="{row}">
              <div style="fontSize: 40px; color: #01E3E3; font-family: MicrosoftYaHei; line-height: 52px">{{total}}</div>
            </template>
          </el-table-column>
        </el-table>
        <div class="div1"></div>
        <div class="div2"></div>
      </el-col>
      <el-col :span="4">
        <Title :title="'AC关键字'"/>
        <bar-chart :chartData="acKeywordMap(acKeyword)" ratio :title="'AC关键字'" :height="'528px'"/>
        <div class="div1"></div>
        <div class="div2"></div>
      </el-col>
      <el-col :span="14">
        <Title :title="'评论星级'" :width="'800px'"/>
        <bar-chart :chartData="listDataMap(reviewStar)" :title="'评论数量区间个数'" :height="'528px'"/>
        <div class="div1"></div>
        <div class="div2"></div>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="12">
        <Title :title="'评论数量'"/>
        <bar-chart :chartData="listDataMap(reviewCountVo.countCommentsRangeMap)" italic :title="'评论数量区间个数'" :height="'398px'"/>
      </el-col>
      <el-col :span="12">
        <Title :title="'价格分布图'"/>
        <bar-chart :chartData="price(listingPriceList)" italic :types="'scatter'" :height="'398px'"/>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="4">
        <Title :title="'卖家数量'"/>
        <bar-chart :chartData="hijacker(hijackerVo)" ratio :height="'368px'"/>
      </el-col>
      <el-col :span="20">
        <Title :title="'大类排名'"/>
        <bar-chart :chartData="listDataMap(bigRankingMap)" italic :height="'368px'"/>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="12">
        <Title :title="'小类排名'"/>
        <bar-chart :chartData="listDataMap(smallRankingMap)" :height="'398px'"/>
      </el-col>
      <el-col :span="12">
        <Title :title="'变体数量区间个数'"/>
        <bar-chart :chartData="listDataMap(variationRangeMap)" italic :height="'398px'"/>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="5">
        <Title :title="'发货方式'"/>
        <bar-chart :chartData="fulfillmentChannelMap(fulfillmentChannel)" ratio :height="'398px'"/>
      </el-col>
      <el-col :span="9">
        <Title :title="'图片数量'"/>
        <bar-chart :chartData="listDataMap(imageNumber)" :height="'398px'"/>
      </el-col>
      <el-col :span="5">
        <Title :title="'相关视频'"/>
        <bar-chart :chartData="videoMap(video)" ratio :height="'398px'"/>
      </el-col>
      <el-col :span="5">
        <Title :title="'EBC图文品牌'"/>
        <bar-chart :chartData="ebsMap(EBC)" ratio :height="'398px'"/>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="20">
        <Title :title="'ASIN距今发布时间'"/>
        <bar-chart :chartData="listDataMap(timeQuantum)" italic :height="'398px'"/>
      </el-col>
      <el-col :span="4">
        <Title :title="'卖家'"/>
        <bar-chart :chartData="sellerMap(seller)" ratio :height="'398px'"/>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="6">
        <Title :title="'各国占总比'"/>
        <bar-chart :chartData="countryMap(country)" ratio :height="'398px'"/>
      </el-col>
      <el-col :span="18">
        <Title :title="'30天反馈'"/>
        <bar-chart :chartData="listDataMap(feedback)" ratio italic :height="'398px'"/>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="12">
        <Title :title="'品牌'"/>
        <bar-chart :chartData="brandMap(brand)" italic :height="'398px'"/>
      </el-col>
      <el-col :span="12">
        <Title :title="'颜色'"/>
        <bar-chart :chartData="colorMap(color)" italic :height="'398px'"/>
      </el-col>
    </el-row>
  </el-card>
    
</template>

<script>
import * as echarts from 'echarts';
import BarChart from '../../components/echarts/BarChart.vue';
import Title from '../../components/echarts/title.vue';
import { getDetial } from '@/api/keyword/keyword';

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
        data1: [46.96, 56.98],
        days: ['34', '46']
      },
      reviewCountVo: {},
      listingPriceList: [],
      hijackerVo: {},
      bigRankingMap: {},
      smallRankingMap: {},
      variationRangeMap: {},
      fulfillmentChannel: {},
      imageNumber: {},
      video: {},
      EBC: {},
      timeQuantum: {},
      seller: {},
      country: {},
      feedback: {},
      acKeyword: {},
      reviewStar: {},
      color: {},
      brand: {},
      // value: 3,
      data: [],
      total: 0
    };
  },
  mounted(){
    // this.getDetial(this.id);
  },
  watch: {
    '$route.query': {
      immediate: true, // 第一次的数据，也要当做是一种变化
      // 处理函数（不能修改名字） handler('新的值'，'旧的值')
      handler(value) {
        this.getDetial(value.detailId);
      },
    }
  },
  methods: {
    getDetial(id) {
      getDetial(id).then(res => {
        this.total = 0;
        this.reviewCountVo = res.data.data['reviewCountVo'];
        this.listingPriceList = res.data.data['listingPriceList'].sort((a, b) => a.listingPrice - b.listingPrice);
        this.hijackerVo = res.data.data['hijackerVo'];
        this.bigRankingMap = res.data.data['rankingVo'].bigRankingMap;
        this.smallRankingMap = res.data.data['rankingVo'].smallRankingMap;
        this.variationRangeMap = res.data.data['variationVo'].variationRangeMap;
        this.fulfillmentChannel = res.data.data['fulfillmentChannelVo'];
        this.imageNumber = res.data.data['imageCountVo'].haveImageNumberMap;
        this.video = res.data.data['listingVideoVo'];
        this.EBC = res.data.data['hasEbcVo'];
        this.timeQuantum = res.data.data['firstDateVo'].timeQuantumMap;
        this.seller = res.data.data['sellerVo'];
        this.country = res.data.data['companyAddressVo'];
        this.feedback = res.data.data['thirtyDaysFeedbackVo'].thirtyDaysFeedbackMap;
        this.acKeyword = res.data.data['acKeywordVo'];
        this.reviewStar = res.data.data['reviewStarVo'].commentsRangeMap;
        this.color = res.data.data['colorList'];
        this.brand = res.data.data['brandNameVo'].brandNameCountList;
        this.data = res.data.data['tableScores'].map(item => {
          this.total += item.score;
          return item;
        });
      });
    },
    objectOrder(obj) { //排序的函数
      const newkey = Object.keys(obj).sort(); //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组，这行是最重要的代码！
      const newObj = {};//创建一个新的对象，用于存放排好序的键值对
      for (let i = 0; i < newkey.length; i ++) { //遍历newkey数组
        newObj[newkey[i]] = obj[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
      }
      return newObj;//返回排好序的新对象
    },
    listDataMap(obj) {
      const chartData = {
        days: [],
        data1: []
      };
      for (const key in obj) {
        chartData.days.push(key);
        chartData.data1.push(obj[key]);
      }
      return chartData;
    },
    price(arr) {
      const chartData = {
        days: [],
        data1: []
      };
      arr.length && arr.forEach(item => {
        chartData.days.push(item.listingPrice);
        chartData.data1.push(item.priceCount);
      });
      return chartData;
    },
    hijacker(obj) {
      const chartData = {
        days: ['1', '大于1'],
        data1: [],
        data2: []
      };
      for (const key in obj) {
        if (key === 'greaterOneRate' || key === 'oneRate') {
          chartData.data1.push(obj[key]);
        }
        if (key === 'oneCount' || key === 'greaterOneCount') {
          chartData.data2.push(obj[key]);
        }
      }
      return chartData;
    },
    fulfillmentChannelMap(obj) {
      const chartData = {
        days: [],
        data1: [],
        data2: []
      };
      for (const key in obj) {
        if (key === 'amazonRate' || key === 'fbaRate' || key === 'fbmRate') {
          chartData.data1.push(obj[key].toFixed(2));
        }
        if (key === 'amazonCount' || key === 'fbaCount' || key === 'fbmCount') {
          chartData.data2.push(obj[key]);
        }
      }
      chartData.days = ['Amazon', 'FBA', 'FBM'];
      return chartData;
    },
    videoMap(obj) {
      const chartData = {
        days: ['视频数量', '无视频数量'],
        data1: [],
        data2: []
      };
      for (const key in obj) {
        if (key === 'haveVideoRate' || key === 'notHaveVideoRate') {
          chartData.data1.push(obj[key].toFixed(2));
        }
        if (key === 'haveVideoCount' || key === 'notHaveVideoCount') {
          chartData.data2.push(obj[key]);
        }
      }
      return chartData;
    },
    ebsMap(obj) {
      const chartData = {
        days: ['EBC图文数量', '无EBC图文数量'],
        data1: [],
        data2: []
      };
      for (const key in obj) {
        if (key === 'haveEbcRate' || key === 'notHaveEbcRate') {
          chartData.data1.push(obj[key].toFixed(2));
        }
        if (key === 'haveEbcCount' || key === 'notHaveEbcCount') {
          chartData.data2.push(obj[key]);
        }
      }
      return chartData;
    },
    sellerMap(obj) {
      const chartData = {
        days: ['Amazon占总比', '自发货占总比'],
        data1: [],
        data2: []
      };
      for (const key in obj) {
        if (key === 'amazonRate' || key === 'otherRate') {
          chartData.data1.push(obj[key].toFixed(2));
        }
        if (key === 'amazonCount' || key === 'otherCount') {
          chartData.data2.push(obj[key]);
        }
      }
      return chartData;
    },
    countryMap(obj) {
      const chartData = {
        days: ['US占ASIN总数比值', 'CN占ASIN总数比值', '其他占ASIN总数比值'],
        data1: [],
        data2: []
      };
      for (const key in obj) {
        if (key === 'usRate' || key === 'cnRate' || key === 'otherRate') {
          chartData.data1.push(obj[key].toFixed(2));
        }
        if (key === 'usCount' || key === 'cnCount' || key === 'otherCount') {
          chartData.data2.push(obj[key]);
        }
      }
      return chartData;
    },
    acKeywordMap(obj) {
      const chartData = {
        days: ['AC关键词个数', '无AC关键词个数'],
        data1: [],
        data2: []
      };
      for (const key in obj) {
        if (key === 'haveRate' || key === 'notHaveRate') {
          chartData.data1.push(obj[key].toFixed(2));
        }
        if (key === 'haveCount' || key === 'notHaveCount') {
          chartData.data2.push(obj[key]);
        }
      }
      return chartData;
    },
    colorMap(arr) {
      const chartData = {
        days: [],
        data1: []
      };
      arr.length && arr.map(item => {
        chartData.days.push(item.color);
        chartData.data1.push(item.colorCount);
      });
      return chartData;
    },
    brandMap(arr) {
      const chartData = {
        days: [],
        data1: []
      };
      arr.length && arr.map(item => {
        chartData.days.push(item.brandName);
        chartData.data1.push(item.appearCount);
      });
      return chartData;
    },
    // 合并列 
    objectSpanMethod({ columnIndex }) {
      if (columnIndex === 4) {
        return {
          rowspan: this.data.length,
          colspan: 1
        };
      }
    },
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
