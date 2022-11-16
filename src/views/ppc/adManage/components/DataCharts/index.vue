<!-- 数据分析弹窗 -->
<template>
<el-dialog 
  :visible="visible" 
  :append-to-body="true" 
  @close="handleCancel"
  custom-class="_adManage-data_charts-dialog"
  width="1340px"
  top="12vh"
>
  <div slot="title">
    {{ pageNameDict[pageType] }}数据分析
    <TitlePath :namePath="namePath" />
  </div>
  <div class="content">
    <div class="menu" v-loading="loading.statistic">
      <el-collapse v-model="expandNames">
        <el-collapse-item
          v-for="menu in menuList"
          :key="menu.name"
          :title="menu.name" 
          :name="menu.name"
        >
          <div
            v-for="sub in menu.subMenu" 
            :key="sub.key" 
            class="menu-item"
            @click="handleMenuSelect(sub.key)"
          >
            <div
              v-if="selectedKeys.includes(sub.key)" 
              class="selected_line"
              :style="{ backgroundColor: colors[selectedKeys.findIndex(s => s === sub.key)] }"
            ></div>
            <div>
              <div class="name main" :style="{ color: colors[selectedKeys.findIndex(s => s === sub.key)] }">
                {{ sub.name }}
              </div>
              <div class="value" :style="{ color: colors[selectedKeys.findIndex(s => s === sub.key)] }">
                {{ sub.value }}
              </div>
            </div>
            <div>
              <div>
                <span class="name">上期：</span>
                <span class="last_cycle-value">{{ sub.lastCycleValue }}</span>
              </div>
              <div>
                <span class="name">环比：</span>
                <span
                  class="ratio" 
                  :class="{
                    'ratio-down': sub.ringRatioNumber < 0,
                    'ratio-up': sub.ringRatioNumber > 0,
                  }"
                >{{ sub.ringRatioNumber > 0 ? `+${sub.ringRatio}` : sub.ringRatio }}</span>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="charts-content">
      <div class="toolbar">
        <div>
          <el-radio-group v-model="chartsType" size="mini">
            <el-radio-button label="chart">图</el-radio-button>
            <el-radio-button label="table">表</el-radio-button>
          </el-radio-group>
          <el-button
            v-show="chartsType === 'table'" 
            @click="handleDownload"
            class="btn-download" 
            size="mini"
          >下载</el-button>
        </div>
        <div>
          统计周期：
          <el-radio-group v-model="statisticalMethod" size="mini">
            <el-radio-button label="day">日</el-radio-button>
            <el-radio-button label="week">周</el-radio-button>
            <el-radio-button label="month">月</el-radio-button>
          </el-radio-group>
          <div class="date_picker-container">
            <DatePicker :defaultValue="dateRange" @change="handleDateRangeChange" />
          </div>
        </div>
      </div>
      <div class="charts">
        <div v-show="chartsType === 'chart'">
          <div ref="refChart" class="refChart"></div>
        </div>
        <div v-show="chartsType === 'table'">
          <el-table
            :data="chartsData"
            v-loading="loading.charts"
            tooltip-effect="dark"
            empty-text="没有查询到数据，请修改查询条件"
            border
            max-height="602px"
            class="charts-table"
            size="mini"
          >
            <el-table-column
              prop="date"
              label="日期"
              width="110"
            >
            </el-table-column>
            <template v-for="item in commonColOption">
              <el-table-column
                :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                :width="item.width - 12"
              >
                <span slot-scope="{row}">{{ item.formatter(row[item.prop]) }}</span>
              </el-table-column>
            </template>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</el-dialog>
</template>

<script>
import TitlePath from './TitlePath';
import DatePicker from './DatePicker';
import * as echarts from 'echarts';
import { getDateRangeForKey } from '@/util/date';
import { nameDict, pageNameDict, downloadATag } from './util';
import { getValueLocaleString as format, getCommonColOption } from '../../utils/fun';
import {
  queryAnalyseStatistic,
  queryAnalyseList,
  downloadAnalysisTable,
} from '@/api/ppc/adManage';

// 默认日期范围
const defaultDateRange = getDateRangeForKey(30);

export default {
  props: {
    pageType: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
    rowData: {
      type: Object,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    namePath: {
      type: Array,
      required: true,
    },
  },

  components: {
    TitlePath,
    DatePicker,
  },

  created() {
    this.getStatisticData();
    this.getChartsData();
  },

  data() {
    return {
      pageNameDict,
      // 展开的
      expandNames: ['销售表现', '投入回报', '流量转化'],
      // 菜单选中的数据块
      selectedKeys: ['sales', 'spend'],
      // 左侧统计数据
      statisticData: {},
      // 右侧图表选择 chart table
      chartsType: 'chart',
      // 统计周期
      statisticalMethod: 'day',
      // 日期范围
      dateRange: defaultDateRange,
      // 图表数据
      chartsData: [],
      colors: ['#49B5FF', '#FFC175'],
      loading: {
        statistic: false,
        charts: false,
      },
    };
  },

  computed: {
    // 表格列
    commonColOption() {
      return getCommonColOption(this.currency);
    },

    // 折线图需要的全部数据格式化
    lineData() {
      const result = {};
      this.chartsData.map(data => {
        // 每一个数据都存到对应的数组中
        Object.keys(nameDict).map(key => {
          result[key] ? result[key].push(data[key]) : result[key] = [data[key]];
        });
      });
      return result;
    },

    // chart 的 series 配置
    series() {
      const series = [];
      this.selectedKeys.map((key, index) => {
        series.push({
          name: nameDict[key],
          data: this.lineData[key],
          type: 'line',
          smooth: true,
          yAxisIndex: index,
        });
      });
      return series;
    },

    // chart 的 xAxis 配置
    xAxis() {
      const data = this.chartsData.map(item => item.date);
      return {
        type: 'category',
        axisLine: {
          lineStyle: { color: '#ccc' },
        },
        axisTick: {
          lineStyle: { color: '#ccc' },
          inside: true,
        },
        axisLabel: { color: '#666' },
        boundaryGap: false,
        data,
      };
    },

    // chart 的 yAxis 配置
    yAxis() {
      const yAxisItem = {
        name: '',
        type: 'value',
        position: 'left',
        splitLine: {
          // 横向虚线
          lineStyle: { type: 'dotted', color: '#c1c1c1' },
        },
        // 不显示 y 轴线和刻度线
        axisLine: { show: false },
        axisTick: { show: false },
      };  
      const yAxisList = [yAxisItem];
      // 两个 y 轴
      this.selectedKeys.forEach((key, index) => {
        const currencyKeys = ['sales', 'cpc', 'cpa', 'spend'];
        const percentKeys = ['acos', 'ctr', 'conversionsRate'];
        // 格式化 y 轴的数值,货币或百分比
        const formatter = (value) => {
          let formatterResult = `${value}`;
          if (currencyKeys.includes(key)) {
            formatterResult = `${this.currency}${value}`;
          } else if (percentKeys.includes(key)) {
            formatterResult = `${value}%`;
          }
          return formatterResult;
        };
        yAxisList[index] = {
          ...yAxisItem,
          position: index ? 'right' : 'left',
          axisLabel: {
            formatter,
            color: this.colors[index],
          },
        };
      });
      return yAxisList;
    },

    // 左侧统计数据
    menuList() {
      return [
        {
          name: '销售表现',
          subMenu: [
            {
              name: `销售额(${this.currency})`,
              key: 'sales',
              value: format({ value: this.statisticData.sales, isFraction: true }),
              lastCycleValue: format({ value: this.statisticData.stageIaSales, isFraction: true }),
              ringRatio: format({ value: this.statisticData.salesRingRatio, suffix: '%', isFraction: true }),
              ringRatioNumber: Number(this.statisticData.salesRingRatio),
            }, {
              name: '订单量',
              key: 'orderNum',
              value: format({ value: this.statisticData.orderNum }),
              lastCycleValue: format({ value: this.statisticData.stageIaOrderNum }),
              ringRatio: format({ value: this.statisticData.orderNumRingRatio, suffix: '%', isFraction: true }),
              ringRatioNumber: Number(this.statisticData.orderNumRingRatio),
            },
          ],
        }, {
          name: '投入回报',
          subMenu: [
            {
              name: `CPC(${this.currency})`,
              key: 'cpc',
              value: format({ value: this.statisticData.cpc, isFraction: true }),
              lastCycleValue: format(
                { value: this.statisticData.stageIaCpc, prefix: this.currency, isFraction: true }
              ),
              ringRatio: format({ value: this.statisticData.cpcRingRatio, suffix: '%', isFraction: true }),
              ringRatioNumber: Number(this.statisticData.cpcRingRatio),
            }, {
              name: `CPA(${this.currency})`,
              key: 'cpa',
              value: format({ value: this.statisticData.cpa, isFraction: true }),
              lastCycleValue: format(
                { value: this.statisticData.stageIaCpa, prefix: this.currency, isFraction: true }
              ),
              ringRatio: format({ value: this.statisticData.cpaRingRatio, suffix: '%', isFraction: true }),
              ringRatioNumber: Number(this.statisticData.cpaRingRatio),
            }, {
              name: 'ACoS',
              key: 'acos',
              value: format({ value: this.statisticData.acos, suffix: '%', isFraction: true }),
              lastCycleValue: format(
                { value: this.statisticData.stageIaAcos, suffix: '%', isFraction: true }
              ),
              ringRatio: format({ value: this.statisticData.acosRingRatio, suffix: '%', isFraction: true }),
              ringRatioNumber: Number(this.statisticData.acosRingRatio),
            }, {
              name: `Spend(${this.currency})`,
              key: 'spend',
              value: format({ value: this.statisticData.spend, isFraction: true }),
              lastCycleValue: format(
                { value: this.statisticData.stageIaSpend, prefix: this.currency, isFraction: true }
              ),
              ringRatio: format({ value: this.statisticData.spendRingRatio, suffix: '%', isFraction: true }),
              ringRatioNumber: Number(this.statisticData.spendRingRatio),
            }, {
              name: 'RoAS',
              key: 'roas',
              value: format({ value: this.statisticData.roas, isFraction: true }),
              lastCycleValue: format(
                { value: this.statisticData.stageIaRoas, isFraction: true }
              ),
              ringRatio: format({ value: this.statisticData.roasRingRatio, suffix: '%', isFraction: true }),
              ringRatioNumber: Number(this.statisticData.roasRingRatio),
            },
          ],
        }, {
          name: '流量转化',
          subMenu: [
            {
              name: 'Impressions',
              key: 'impressions',
              value: format({ value: this.statisticData.impressions }),
              lastCycleValue: format(
                { value: this.statisticData.stageIaImpressions }
              ),
              ringRatio: format({ value: this.statisticData.impressionsRingRatio, suffix: '%', isFraction: true }),
              ringRatioNumber: Number(this.statisticData.impressionsRingRatio),
            }, {
              name: 'Clicks',
              key: 'clicks',
              value: format({ value: this.statisticData.clicks }),
              lastCycleValue: format({ value: this.statisticData.stageIaClicks }),
              ringRatio: format({ value: this.statisticData.clicksRingRatio, suffix: '%', isFraction: true }),
              ringRatioNumber: Number(this.statisticData.clicksRingRatio),
            }, {
              name: 'CTR',
              key: 'acos',
              value: format({ value: this.statisticData.acos, suffix: '%', isFraction: true }),
              lastCycleValue: format(
                { value: this.statisticData.stageIaAcos, suffix: '%', isFraction: true }
              ),
              ringRatio: format({ value: this.statisticData.acosRingRatio, suffix: '%', isFraction: true }),
              ringRatioNumber: Number(this.statisticData.acosRingRatio),
            }, {
              name: '转化率',
              key: 'conversionsRate',
              value: format({ value: this.statisticData.conversionsRate, suffix: '%', isFraction: true }),
              lastCycleValue: format(
                { value: this.statisticData.stageIaConversionsRate, suffix: '%', isFraction: true }
              ),
              ringRatio: format({ value: this.statisticData.conversionsRateRingRatio, suffix: '%', isFraction: true }),
              ringRatioNumber: Number(this.statisticData.conversionsRateRingRatio),
            }, 
          ],
        }, 
      ];
    },
  },

  updated() {
    this.initChart();
  },

  methods: {
    // 获取 tooltip 中显示的格式
    formatTooltipValue(name, value) {
      const suffix = ['ACoS', 'CTR', '转化率'].includes(name) ? '%' : '';
      const prefix = ['销售额', 'CPC', 'CPA', 'Spend'].includes(name) ? this.currency : '';
      const isFraction = !['订单量', 'Impressions', 'Clicks'].includes(name);
      return format({ value, suffix, isFraction, prefix });
    },

    // 自定义 tooltip 中的 class
    getTooltipClass(className) {
      return `_adManage-data_charts-tooltip-${className}`;
    },

    // 初始化 chart
    initChart() {
      this.chart = echarts.init(this.$refs.refChart);
      this.chart.setOption({
        showLoading: this.loading.charts,
        grid: { top: 30, right: 70 },
        tooltip: {
          trigger: 'axis',
          textStyle: {
            color: '#333',
            lineHeight: 24,
          },
          // 设置白底和阴影
          backgroundColor: '#fff',
          extraCssText: 'box-shadow: 0px 3px 13px 0px rgba(231, 231, 231, 0.75);',
          enterable: true,
          // tooltip 自定义格式
          formatter: params => {
            let paramsList = [];
            if (params instanceof Array){
              paramsList = [...params];
            } else {
              paramsList = [params];
            }
            const time = params[0].axisValue;
            const items = paramsList.map(item => {
              return `
                <div key=${item.seriesName}>
                  <div class=${this.getTooltipClass('item')}>
                    <span class=${this.getTooltipClass('marker')} style="background: ${item.color}"}></span>
                    <span class=${this.getTooltipClass('title')}>${item.seriesName}：</span>
                    ${ this.formatTooltipValue(item.seriesName, item.value) }
                  </div>
                </div>
              `;
            }).join('');
            const html = `
              <div class=${this.getTooltipClass('container')}>
                <div class=${this.getTooltipClass('time')}>${time}</div>
                ${items}
              </div>  
            `;
            return html;
          },
        },
        legend: {
          left: 'center',
          bottom: 0,
          itemGap: 40,
          textStyle: { color: '#666', fontSize: 14 }, 
        },
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        series: this.series,
        color: this.colors,
      }, true);
    },
  
    // 获取左侧统计数据
    getStatisticData() {
      // this.loading.statistic = true;
      const params = {
        adStoreId: this.rowData.adStoreId,
        campaignType: 'sp',
        entityId: this.rowData.entityId,
        statisticalMethod: this.statisticalMethod,
        startTime: this.dateRange[0],
        endTime: this.dateRange[1],
        // adStoreId: '1525058887367471105',
        // entityId: 170297908687341,
      };
      queryAnalyseStatistic(this.pageType, params).then(res => {
        this.statisticData = res.data.data;
      }).finally(() => {
        this.loading.statistic = false;
      });
    },

    // 获取折线图(和表格)数据
    getChartsData() {
      this.loading.charts = true;
      const params = {
        adStoreId: this.rowData.adStoreId,
        campaignType: 'sp',
        entityId: this.rowData.entityId,
        statisticalMethod: this.statisticalMethod,
        startTime: this.dateRange[0],
        endTime: this.dateRange[1],
        // adStoreId: '1525058887367471105',
        // entityId: 170297908687341,
      };
      queryAnalyseList(this.pageType, params).then(res => {
        this.chartsData = res.data.data.records;
      }).finally(() => {
        this.loading.charts = false;
      });
    },

    // 左侧菜单点击
    handleMenuSelect(key) {
      // 点击已经选中的，取消选中（只有一个时不取消）
      const keys = [...this.selectedKeys];
      if (keys.includes(key)) {
        if (keys.length === 2) {
          keys.splice(keys.indexOf(key), 1);
          this.selectedKeys = keys;
        }
      } else if (keys.length === 2) {
        // 最多选中两个，选中两个时，去掉前面一个，再增加当前
        keys.splice(0, 1);
        keys.push(key);
        this.selectedKeys = keys;
      } else {
        // 只有一个选中时，增加当前选中
        keys.push(key);
        this.selectedKeys = keys;
      }
      // 显示图
      this.chartsType === 'table' && (this.chartsType = 'chart');
    },

    // 日期范围变化
    handleDateRangeChange(val) {
      this.dateRange = val;
      this.getStatisticData();
      this.getChartsData();
    },

    // 下载表格
    handleDownload() {
      const params = {
        adStoreId: this.rowData.adStoreId,
        campaignType: 'sp',
        entityId: this.rowData.entityId,
        statisticalMethod: this.statisticalMethod,
        startTime: this.dateRange[0],
        endTime: this.dateRange[1],
        // adStoreId: '1525058887367471105',
        // entityId: 170297908687341,
      };
      downloadAnalysisTable(this.pageType, params)
        .then(res => {
          // 如果没有返回文件
          if (res.headers['content-type'].includes('application/json')) {
            this.$message.error('匹配不到结果，请修改筛选条件');
            return;
          }
          const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
          const blobUrl = window.URL.createObjectURL(blob);
          const fileName = res.headers['content-disposition'].split(';')[1].split('filename=')[1];
          downloadATag(blobUrl, window.decodeURIComponent(fileName));
        })
        .catch(err => {
          console.error('导出发生错误:', err);
        });
    },

    // 取消
    handleCancel() {
      this.$emit('update:visible', false);
    },
  },


  watch: {
    // 统计周期类型变化
    statisticalMethod() {
      // 左侧汇总的数据，选择 周 月 时，会加上前后两天所在的 周 月 的数据，所以需要重新查询
      this.getStatisticData();
      this.getChartsData();
    },
  },
};
</script>

<style scoped lang="scss">
  @import "./index.scss";
</style>

<style lang="scss">
._adManage-data_charts-dialog {
  .el-dialog__header {
    border-bottom: 1px solid #EBEEF5;
  }

  .el-dialog__body {
    padding: 0 20px 20px 20px;
  }

  .el-collapse-item__header {
    font-weight: 700;
  }

  .el-collapse-item__wrap {
    border: none;
  }

  .el-collapse {
    border-top: none;
  }
}

// 折线图的 tooltip
._adManage-data_charts-tooltip-container {
  padding: 4px 8px;
  font-size: 12px;

  ._adManage-data_charts-tooltip-time {
    color: #999;
    text-align: left;
  }

  ._adManage-data_charts-tooltip-item {
    display: flex;
    align-items: center;
    color: #333;
  }

  ._adManage-data_charts-tooltip-title {
    color: #666;
  }

  ._adManage-data_charts-tooltip-marker {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 6px;
    margin-right: 10px;
  }
}
</style>
