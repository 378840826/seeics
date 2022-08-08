<template>
  <el-card class="mian" id="mian">
    <!-- <el-row :gutter="20" id="top">
      <el-col  style="width: 850px"> -->
      <div class="tableBox" style="width: 850px; margin: auto; margin-bottom: 10px;">
        <Title :title="'综合评分表'"/>
         <div style="display: flex; maxHeight: 528px">
           <div style=" width: 100%; minHeight: 40px; background: #09233A;">
             <p class="th" v-resize="DomResize">
              <span style="width: 7%; height: 100%; textAlign: center;">序号</span>
              <span style="width: 27%; height: 100%; textAlign: center;">评分选项</span>
              <span style="width: 8%; height: 100%; textAlign: center;">分值</span>
              <span style="width: 25%; height: 100%; textAlign: center;">星级，满分十级</span>
              <span style="width: 33%; height: 100%;textAlign: center; display: block">分数</span>
             </p>
           </div>
         </div>
         <div class="tabel" :style="{height: thWidth === '80px' ? '448px' : '550px'}">
           <div style=" width: 70%; height: 100%">
             <p v-for="(item, index) in data" :key="item.props" class="column" style=" width: 100%; display: flex;">
                <span class="span" style="width: 10%; textAlign: center;">{{index + 1}}</span>
                <a 
                  @click="hanlderColumn(item.props)" 
                  class="span column" style="width: 40%; textAlign: center; cursor: pointer;">{{item.column}}
                  <el-tooltip>
                    <div slot="content">
                       <div v-for="item in  strSplit(item.tip)" :key="item">{{item}}</div>
                    </div>
                    <span class="el-icon-question"></span>
                  </el-tooltip>
                </a>
                <span class="span" style="width: 10%; textAlign: center;">{{item.score}}</span>
                <span style="width: 40%" class="block">
                   <a class="a" v-for="i in item.score" :key="i">⭐</a>
                </span>
             </p>
           </div>
           <div class="total">
              <!-- {{total}} -->
              <div>
                 <div style="textAlign: center; fontSize: 20px; color: #01E3E3">
                   {{$route.query.name.split('详情')[0]}}</div>
                 <div style="textAlign: center; fontSize: 50px; color: #01E3E3">{{total}}</div>
                 
                 <div style="fontSize: 30px;" >评估建议：</div>
                 <div style="fontSize: 30px;" v-if="total >= 120 && total <= 150">强烈建议进入</div>
                 <div style="fontSize: 30px" v-else-if="total >= 90 && total <= 120">建议进入</div>
                 <div style="fontSize: 30px" v-else-if="total >= 60 && total <= 90">可以进入</div>
                 <div style="fontSize: 30px" v-else-if="total < 60">不建议进入</div>
              </div>
           </div>
         </div>
        <div class="div1"></div>
        <div class="div2"></div>
      </div>
      <!-- </el-col>
    </el-row> -->
    <el-row :gutter="24">
        <el-col :span="9" id="acKeyword">
        <Title :title="'AC关键字'"/>
        <bar-chart :chartData="acKeywordMap(acKeyword)" ratio :title="'AC关键字'" :height="'528px'"/>
        <div class="div1"></div>
        <div class="div2"></div>
      </el-col>
      <el-col :span="15" id="reviewStar">
        <Title :title="'评论星级'" :width="'800px'"/>
        <bar-chart :chartData="listDataMap(reviewStar)" :title="'评论数量区间个数'" italic :height="'528px'"/>
        <div class="div1"></div>
        <div class="div2"></div>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="12" id="reviewCount">
        <Title :title="'评论数量'"/>
        <bar-chart 
          :chartData="listDataMap(reviewCountVo.countCommentsRangeMap)" italic :title="'评论数量区间个数'" :height="'398px'"/>
        <div class="div1"></div>
        <div class="div2"></div>
      </el-col>
      <el-col :span="12" id="hijacker">
        <Title :title="'价格分布图'"/>
        <bar-chart :chartData="price(listingPriceList)" italic :types="'scatter'" :height="'398px'"/>
        <div class="div1"></div>
        <div class="div2"></div>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="9" id="hijacker">
        <Title :title="'卖家数量'"/>
        <bar-chart :chartData="hijacker(hijackerVo)" ratio :height="'368px'"/>
        <div class="div1"></div>
        <div class="div2"></div>
      </el-col>
      <el-col :span="15" id="ranking">
        <Title :title="'大类排名'"/>
        <bar-chart :chartData="listDataMap(bigRankingMap)" italic :height="'368px'"/>
        <div class="div1"></div>
        <div class="div2"></div>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="12" id="ranking">
        <Title :title="'小类排名'"/>
        <bar-chart :chartData="listDataMap(smallRankingMap)" italic :height="'398px'"/>
        <div class="div1"></div>
        <div class="div2"></div>
      </el-col>
      <el-col :span="12" id="variation">
        <Title :title="'变体数量区间个数'"/>
        <bar-chart :chartData="listDataMap(variationRangeMap)" italic :height="'398px'"/>
        <div class="div1"></div>
        <div class="div2"></div>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="9" id="fulfillmentChannel">
        <Title :title="'发货方式'"/>
        <bar-chart :chartData="fulfillmentChannelMap(fulfillmentChannel)" ratio :height="'398px'"/>
        <div class="div1"></div>
        <div class="div2"></div>
      </el-col>
      <el-col :span="15" id="imageCount">
        <Title :title="'图片数量'"/>
        <bar-chart :chartData="listDataMap(imageNumber)" :height="'398px'"/>
        <div class="div1"></div>
        <div class="div2"></div>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="15" id="firstDate">
        <Title :title="'ASIN距今发布时间'"/>
        <bar-chart :chartData="listDataMap(timeQuantum)" italic :height="'398px'"/>
        <div class="div1"></div>
        <div class="div2"></div>
      </el-col>
      <el-col :span="9" id="seller">
        <Title :title="'卖家'"/>
        <bar-chart :chartData="sellerMap(seller)" ratio :height="'398px'"/>
        <div class="div1"></div>
        <div class="div2"></div>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="9" id="companyAddress">
        <Title :title="'各国占总比'"/>
        <bar-chart :chartData="countryMap(country)" ratio :height="'398px'"/>
        <div class="div1"></div>
        <div class="div2"></div>
      </el-col>
      <el-col :span="15" id="thirtyDaysFeedback">
        <Title :title="'30天反馈'"/>
        <bar-chart :chartData="listDataMap(feedback)" ratio italic :height="'398px'"/>
        <div class="div1"></div>
        <div class="div2"></div>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="9" id="listingVideo">
        <Title :title="'相关视频'"/>
        <bar-chart :chartData="videoMap(video)" ratio :height="'398px'"/>
        <div class="div1"></div>
        <div class="div2"></div>
      </el-col>
      <el-col :span="15">
        <Title :title="'颜色'"/>
        <bar-chart :chartData="colorMap(color)" italic :height="'398px'"/>
        <div class="div1"></div>
        <div class="div2"></div>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="15" id="brandName">
        <Title :title="'品牌'"/>
        <bar-chart :chartData="brandMap(brand)" italic :height="'398px'"/>
        <div class="div1"></div>
        <div class="div2"></div>
      </el-col>
      <el-col :span="9" id="hasEbc">
        <Title :title="'EBC图文品牌'"/>
        <bar-chart :chartData="ebsMap(EBC)" ratio :height="'398px'"/>
        <div class="div1"></div>
        <div class="div2"></div>
      </el-col>
    </el-row>
    <a @click="returnTop"  class="returnTop">返回顶部</a>
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
      total: 0,
      thWidth: '',
      tipList: { //n/表示换行符
        acKeyword: 'AC关键词是被亚马逊判定为拥有一定权重的搜索词，获取到AC关键词的ASIN是被判定为某个时段内综合表现最好的ASIN，n/可以对这些AC关键词再次进行反查，并围绕该AC关键词进行选品。',
        reviewStar: `Review评分高的占比较多的类目，一般表明供应链比较完善，产品质量以及售后服务较好；n/
                    Review评分低的占比较多的类目，一般表明产品质量有比较大的问题或者不能解决消费者端的实际需求；n/
                    Review评分高低的占比不相上下的类目，一般表明产品质量并不是这个类目的消费者购买产品的最主要考虑因素。`,
        reviewCount: `若review数量多的卖家占大多数，则表明该类目大卖实力比较强，进场难度大；n/
                    若review数量少的卖家占大多数，则表明该类目可能是新兴类目，卖家的实力均不是太强，进场难度小；n/
                    若review数量多与少的卖家数量差不多，则表明该类目还有一定发展潜力，进场难度一般。`,
        hijacker: `跟卖数量较多的链接，适合专门做跟卖的卖家进场；n/
                  卖数量较少甚至没有的链接，证明该品牌大概率是已经完成了品牌注册的卖家，不适合进行跟卖。`,
        ranking: `一般来说，若排名靠前的卖家数量较多，证明该类目竞争程度很高，不太适合中小卖家进场；n/
                若排名靠后的卖家数量较多，证明该类目竞争程度很低，适合中小卖家进场；n/
                若排名情况比较均衡，证明该类目竞争程度不高，也适合中小卖家进场。`,
        variation: `变体数量一定程度上代表某个卖家的综合实力。n/
                  一般来说，若变体数量多的卖家占多数，表明对中小卖家不太友好，对手的综合实力比较强；n/
                  若变体数量少的卖家占多数，表明该类还有较大空间，非常适合中小卖家进场；`,
        fulfillmentChannel: `发货方式有三种——FBM、FBA、AMZn/
                            一般来说，FBM占比较高的类目，市场潜力巨大，进入难度相对较低，非常适合中小卖家；n/
                            FBA占比较高的类目，市场发展得比较充分，进入难度一般；n/
                            AMZ占比较高的类目，均是亚马逊官方供应商（VC账号），表明该类产品的供应链非常成熟，不太适合一般卖家进场。`,
        imageCount: `比较完善的listing一般是主副图7张。n/
                    一般来说，若图片数量≥6的listing数量较多，表明该类目的产品链接质量较高，优化比较到位，进场难度较大；n/
                    若图片数量＜6的listing数量较多，表明该类目的产品链接质量普遍较低，优化不到位，经常难度较低。`,
        listingVideo: `比较完善的listing一般是主副图7张，还有另外一种，是主副图6张+视频。n/
                      一般来说，若listing有视频的数量较多，表明该类目的产品链接质量较高，优化比较到位，进场难度较大；n/
                      若listing无视频的数量较多，表明该类目的产品链接质量普遍较低，优化不到位，经常难度较低。`,
        hasEbc: `一般来说，EBC（A+）listing数量较多的话，表明优化比较到位，listing质量偏高，这种类目进入的难度较大；n/
                反之，EBC（A+）listing数量较少的话，表明优化还不是很到位，listing质量偏低，进入难度较小。`,
        brandName: `一般来说，如果某个品牌出现的频次较高，表明该类目极有可能被它所垄断，中小卖家不容易进入；n/
                    如果各个品牌出现的频次都是较低，且比较分散，表明该类目尚未有巨头出现，适合中小卖家进入。`,
        firstDate: `首次发布时间是指，该ASIN首次在亚马逊在售的时间。n/
                    一般来说，若该类竞品的发布时间大部分都比较久（2年及以上），表明该类产品的权重已被老卖家占据，不利于新卖家进场；n/
                    若该类竞品的发布时间大部分都比较新（2年以内），表明该类产品是新兴类目，大部分都是新卖家，同样也适合后来的新卖家进场。`,
        seller: `一般来说，若显示的是Amazon的占比较多，表明该类目多数是由亚马逊官方（VC）销售，对自发货和打算发FBA的卖家不太友好，进入难度大；n/
                若显示的是第三方品牌卖家的占比较多，表明该类目多数是第三方品牌卖家在销售，相对来说，进入难度小。`,
        companyAddress: `一般来说，若外国卖家占比较多，表明该类目中国商品可能不太受欢迎（或者由于技术、政治等原因无法销售），中国卖家就要谨慎一些对待这类产品；n/
                        若中国卖家占比较多，表明该类目的产品无论哪国生产，消费者都无所谓，且大概率没有技术、政治等问题，这种就比较适合中国卖家进入。`,
        thirtyDaysFeedback: `一般来说，若30天feedback计数多的listing占比较高，表明这些卖家最近的销量都比较不错，量比较大，他们占的权重也相对较高，不太适合中小卖家进入；n/
                            若30天feedback计数少的listing占比较高，表明销量情况一般，所占权重也较低，比较适合中小卖家进入。`
      }
    };
  },
  mounted(){
    document.querySelector('#avue-view').addEventListener('scroll', () => {
      const top = document.querySelector('#avue-view').scrollTop;
      const returnTop = document.querySelector('.returnTop');
      if (top > 20) {
        returnTop.style.display = 'block';
      } else {
        returnTop.style.display = 'none';
      }
    });
  },
  destroyed() {
    window.onresize = null;
    
  },
  watch: {
    '$route.query': {
      immediate: true, // 第一次的数据，也要当做是一种变化
      // 处理函数（不能修改名字） handler('新的值'，'旧的值')
      handler(value) {
        this.getDetial(value.detailId);
      },
    },
  },
  directives: {
    resize: { // 指令的名称
      bind(el, binding) { // el为绑定的元素，binding为绑定给指令的对象
        let width = '', height = '';
        function isReize() {
          const style = document.defaultView.getComputedStyle(el);
          if (width !== style.width || height !== style.height) {
            binding.value({ width: style.width, height: style.height }); // 关键(这传入的是函数,所以执行此函数)
          }
          width = style.width;
          height = style.height;
        }
        el.__vueSetInterval__ = setInterval(isReize, 300);
      },
      unbind(el) {
        clearInterval(el.__vueSetInterval__);
      }
    }
  },
  methods: {
    returnTop() {
      document.querySelector('#avue-view').scrollTop = 0;
    },
    strSplit(str) { //处理提示语数据
      return str.split('n/').filter(Boolean);
    },
    hanlderColumn(name) {
      document.querySelector('#avue-view').scrollTop = document.getElementById(name).parentNode.offsetTop - 50;
    },
    DomResize(data) {
      const { height } = data;
      this.thWidth = height;
    },
    getDetial(id) {
      getDetial(id).then(res => {
        this.total = 0;
        this.empty();
        this.data = [];
        if (res.data.data) {
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
            if (this.tipList[item.props]) {
              item.tip = this.tipList[item.props];
            }
            return item;
          }).sort((a, b) => b.score - a.score);
        }
      });
    },
    objectOrder(obj) { //排序的函数
    //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组，这行是最重要的代码！
      const newkey = Object.keys(obj).sort(); 
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

    empty() {
      this.reviewCountVo = {};
      this.listingPriceList = [];
      this.hijackerVo = {};
      this.bigRankingMap = {};
      this.smallRankingMap = {};
      this.variationRangeMap = {};
      this.fulfillmentChannel = {};
      this.imageNumber = {};
      this.video = {};
      this.EBC = {};
      this.timeQuantum = {};
      this.seller = {};
      this.country = {};
      this.feedback = {};
      this.acKeyword = {};
      this.reviewStar = {};
      this.color = {};
      this.brand = {};
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
  .returnTop {
    display:none;
    position:fixed;
    bottom: 30px;
    right: 20px;
    width:40px;
    text-align:center;
    cursor: pointer;
    border-radius: 4px;
    color: #9AA8D4;
    background:rgb(213, 214, 224);
  }
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
  .th {
    color: #9AA8D4;
    margin: 0;
    line-height: 40px;
    width: 100%; 
    display: flex;
    font-size: 14px;
    padding: 0px 0px 0px 3px;
  }
  .feng {
    margin: auto;
  }
  .column {
    color: #9AA8D4;
    margin: 0;
    border-bottom: 1px solid rgba(8, 18, 81, 1);
    .span {
      display: block;
      padding: 3px 4px;
      border-left: 1px solid rgba(8, 18, 81, 1);
      line-height: 28px;
      box-sizing: border-box;
    }
    .column {
      color: #9AA8D4;
    }
    .block {
      display: block;
      border-left: 1px solid rgba(8, 18, 81, 1);
      border-right: 1px solid rgba(8, 18, 81, 1);
      box-sizing: border-box;
      padding: 3px 4px;
      // display: flex;
      .a {
      display: block;
      float: left;
    }
    }
    
  }
  .tabel {
    width: 100%;
    background: linear-gradient(180deg, #000318 0%, #03093D 100%); 
    display: flex;
    // overflow: scroll;
  }
  .total {
    // font-size: 40px; 
    // color: #01E3E3; 
    width: 30%;
    font-family: MicrosoftYaHei;
    margin: auto;
    div {
      font-size: 30px; 
      color: #9AA8D4;
      text-align: center; 
      font-size: 20px; color: #01E3E3
    }
  }
  .tableBox {
    position: relative;
    .div1 {
      position: absolute;
      right: 0px;
      bottom: 0px;
          padding: 4px;
          border-style: solid;
          border-color: rgba(14, 65, 206, 1);
          border-width: 0 1px 1px 0;
    }
    .div2 {
      position: absolute;
      left: 0px;
          bottom: 0px;
          padding: 4px;
          border-style: solid;
          border-color: rgba(14, 65, 206, 1);
          border-width: 0 0 1px 1px;
    }
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
