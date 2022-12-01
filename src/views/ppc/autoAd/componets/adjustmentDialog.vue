<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      :append-to-body="true"
      width="1100px"
      center
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleClose"
      top="1vh"
    >
      <h3 slot="title" style="text-align: start; margin: 0">分时调价</h3>

      <h3>基础设置</h3>

      <el-form :model="form" ref="form" label-width="100px" :rules="rule" class="demo-ruleForm">

            <el-form-item
              label="广告活动"
            >
              <el-input
                v-model="form.campaignName"
                size="mini"
                class="label-width"
                disabled/>
            </el-form-item>

            <el-form-item
              label="规则名称"
              prop="templateName"
            >
              <el-input
                v-model="form.templateName"
                placeholder="请输入规则名称"
                size="mini"
                class="label-width"/>
            </el-form-item>

        <el-form-item
          prop="status"
        >
          <span slot="label">规则状态<el-tooltip placement="top-start">
              <div slot="content" class="explain" style="width: 450px">
                <p>自动化规则/操作对应的状态：</p>
                <p>运行中，指规则正在执行，且支持随时暂停或归档的状态；</p>
                <p>已暂停，指规则不再执行，但支持随时启用的状态；</p>
                <p>已归档，指规则不再执行，且不支持被启用的状态，仅部分自动化规则支持归档；</p>
              失效，指由于套餐到期、店铺解绑、活动被暂停/归档而导致的中间状态，规则失效后将不再执行，您仍可以创建/编辑规则，当套餐续费或活动被启用后，规则将从“失效”状态恢复为正常状态</div>
              <span class="el-icon-question" style="line-height: 40px;"></span>
            </el-tooltip>
          </span>
          <el-select
            v-model="form.status"
            size="mini"
            class="label-width"
          >
            <el-option
              label="运行中"
              value="runing"
            />
            <el-option
              label="已暂停"
              value="stop"
            />
          </el-select>
        </el-form-item>

          <el-form-item
            label="自动化模板"
          >
            <el-select
              v-model="form.autoTemplateId"
              @change="handleTemplate"
              size="mini"
              class="label-width"
            >
              <el-option
                v-for="item in autoTempalteList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>

           <span style="marginLeft: 10px">
            去<el-button type="text" @click="$router.push('/ppc/automation-template')">设置</el-button>
            自动化模板</span>
          </el-form-item>

        <h3>规则范围</h3>

        <el-form-item
          label-width="70px"
        >
          <span slot="label">调价频率</span>
          <el-select
            v-model="form.executionFrequency"
            @change="handleFrequency"
            size="mini"
            class="label-width"
          >
            <el-option label="每天" value="每天"/>
            <el-option label="每周" value="每周"/>
            <el-option label="工作日" value="工作日"/>
            <el-option label="周末" value="周末"/>
          </el-select>
        </el-form-item>

      </el-form>

      <p style="display: flex;line-height: 20px"><span class="msg">*</span>调价规则：</p>
      <div v-if="isJustment">
        <el-collapse
          v-if="form.executionFrequency !== '每天'"
          v-model="activeNames"
          @change="handleChange"
          style="borderTop: none; borderBottom: none">
          <el-collapse-item
              v-for="(item, index) in weekListFormat()"
              :key="item.week"
              :title="item.week"
              :name="item.week"
              class="ditto"
            >
              <el-button
                v-if="index"
                @click="handleDitto(item.week, index)"
                size="mini"
                type="primary"
                class="is-ditto">同上</el-button>
              <adjustemnt-tabel
                :ref="'table_' + index"
                :rowData="rowData"
                :week="item.week"
                :timeSelect.sync="timeObj[item.week]"
              />
          </el-collapse-item>
        </el-collapse>

        <adjustemnt-tabel
          v-else
          ref="table_everyday"
          :rowData="rowData"
          :timeSelect.sync="timeObj['每天']"
        />
      </div> 

      <div style="padding: 10px 0">
        <span>日期范围：</span>
        <el-date-picker
          v-model="form.startTime"
          style="width: 150px"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions"
          size="mini">
        </el-date-picker>
        <span style="margin: 0 6px;color: #d9d9d9;width: 12px;">—</span>
        <el-date-picker
          v-model="form.endTime"
          style="width: 150px"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions2"
          size="mini">
        </el-date-picker>
      </div>   

      <timeSelection
        :timeSelect.sync="timeObj"
        :echoTimeSelect.sync="echoTimeSelect"
        :executionFrequency.sync="form.executionFrequency"
      />
      <div class="explain">
        <p>操作要点</p>
        <p>1. 每个自动化标签最多支持一种自动化操作。</p>
        <p>2. 您手动输入各种竞价时，请确认数值符合亚马逊规定；当调整竞价值超出亚马逊的最值限制时，我们将会按亚马逊要求的最值进行调整。</p>
        <p>3. 同一个广告活动下，同类型的广告自动化规则不可重复应用同一个自动化模板。</p>
        <p>4.策略只在起止时间的调整时段内生效，非调整时段将自动恢复为原始竞价。</p>
        <p>5.策略会按照【竞价策略】上下调整对象的竞价，不设置则选择调整对象的原始竞价为基础竞价。</p>
        <p>6.使用分时调整竞价过程中，如果在广告管理-关键词/商品投放/投放组列表页手动修改竞价，执行调整预算会以最后手动修改的竞价为原竞价。</p>
        <p>7. 请注意时间段不能重叠，不能超过但可以小于自然日的24小时。</p>
        <p>规则执行</p>
        <p>1. 广告自动化按照广告所在站点当地时间执行。</p>
        <p>2. 规则确认后，站点当地时间第二天00:00开始执行对应的自动化操作。</p>
        <p>3. 自动化操作可能因为接口或网络原因有10分钟左右的延迟。</p>
        <p>4. 每个时间段中，第二个钟点的值不包含准点值，比如：00:00 - 06:00，05:59:59为结束时间。</p>
        <p>5. 超过10分钟未修改成功的竞价，默认维持修改前的竞价。</p>
        <p>备注信息</p>
        <p>1、广告自动化的数据范围排除最近3天，如最近14天，实际指第17-4天。 </p>
        <p>2、原始竞价，指您的广告数据初次在系统更新时记录的竞价；或通过您手动调整、思意-智能广告-投放“自动竞价”操作修改的竞价。您可以在广告管理-关键词/商品投放/投放组列表界面查看原始竞价。</p>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="$emit('update:dialogVisible', false)">取 消</el-button>
        <el-button size="mini" type="primary" @click="save">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {
  getAutomationList,
  templateDetail,
  createTemplate,
  templateUpdate,
} from '@/api/ppc/autoAd';
import adjustemntTabel from './adjustmentTabel.vue';
import { weekList, stateDict } from '../dict';
import timeSelection from './timeSelection';
import { weekNumberToChinese, formatS } from './timeSelection/ulit';
import dayjs from 'dayjs';

export default {

  components: {
    adjustemntTabel,
    timeSelection,
  },
  
  props: {
    dialogVisible: {
      type: Boolean,
      require: true,
    },
    rowData: {
      type: Object,
      require: true,
    },
    echo: {
      type: Object,
    }
  },

  data() {
    return {
      weekList,
      stateDict,
      executionFrequency: '每天',
      form: {
        status: 'runing',
        autoTemplateId: '',
        templateName: '',
        executionFrequency: '每天',
        campaignName: this.rowData.name,
        startTime: '',
        endTime: '',
      },
      activeNames: [],
      autoTempalteList: [],
      rule: {
        templateName: [
          { required: true, message: '请输入规则名称', trigger: 'blur' },
          { max: 50, message: '请输入不超过50个字符的名称', trigger: 'change' }
        ],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
      },
      echoData: {},
      isJustment: true,
      timeObj: {
        星期一: [],
        星期二: [],
        星期三: [],
        星期四: [],
        星期五: [],
        星期六: [],
        星期天: [],
        每天: [],
      },
      timeSelect: [],
      echoTimeSelect: [],
      pickerOptions: {
        disabledDate: (date) => {
          return date.getTime() < Date.now() - 8.64e7;
        }
      },
      pickerOptions2: {
        disabledDate: (date) => {
          const day = new Date(this.form.startTime);    
          return date.getTime() <= day.getTime() + 24 * 60 * 60 * 1000 - 8.64e7;
        }
      },
    };
  },

  mounted() {
    // console.log(this.rowData)
    
    getAutomationList({
      templateType: '分时调价',
    }).then(res => {
      const obj = [{
            value: '',
            label: '无'
          }];
          this.autoTempalteList = [...obj, ...res.data.data.map(item => {
            return {
              value: item.id,
              label: item.templateName
            };
          })];
    });

    this.rowData.adjustmentTemplateVoList.length && this.rowData.adjustmentTemplateVoList[0].id
    && this.templateDetail(this.rowData.adjustmentTemplateVoList[0].id);
  },

  watch: {
    'form.executionFrequency': {
      handler(val) {
        this.activeNames = [this.activeNamesFormat(val)];
      },
      deep: true,
    },
    timeObj: {
      handler(val) {
        // console.log(val)
      },
      deep: true
    },
    // echoTimeSelect: {
    //   handler(val) {
    //     console.log(val);
    //     // console.log(this.getField())
    //     const arr = [];
    //     val.map(item => {
    //       // console.log(item.week)
          
    //       this.getField().map(s => {
            
    //         if (weekNumberToChinese(Number(item.week) - 1) === s.week) {

    //           if (!s.startTime || !s.endTime) {
    //             arr.push({
    //               ...s,
    //               endTime: item.endTime,
    //               startTime: item.startTime,
    //               timeLimit: '自定义时间范围',
    //             })

    //           } else {
    //             console.log(s.startTime === item.startTime && s.endTime === item.endTime, )
    //             if (s.startTime === item.startTime && s.endTime === item.endTime) {
    //               console.log(s, item)
    //               arr.push(s);
    //             } else if (s.startTime === item.startTime && s.endTime !== item.endTime) {
    //               // console.log(item, s)
    //               arr.push({
    //                 ...s,
    //                 endTime: item.endTime,
    //                 startTime: item.startTime,
    //                 timeLimit: '自定义时间范围',
    //               });
    //               // console.log(arr)
    //             } else if (s.startTime !== item.startTime && s.endTime === item.endTime) {
    //               arr.push({
    //                 ...s,
    //                 endTime: item.endTime,
    //                 startTime: item.startTime,
    //                 timeLimit: '自定义时间范围',
    //               });

    //             }
    //           }
              
    //         }
            
    //       });
    //     });
    //     this.echoField({adCampaignInfos: arr});

    //   },
    //   deep: true,
    // }
  },

  methods: {
    weekNumberToChinese,
    formatS,
    weekListFormat() {
      if (this.form.executionFrequency === '每周') {
        return weekList;
      } else if (this.form.executionFrequency === '工作日') {
        return weekList.filter(item => item.type !== 'weekend');
      } else {
        return weekList.filter(item => item.type === 'weekend');
      }
    },

    activeNamesFormat(val) {
      if (val === '每周') {
        return '星期一';
      } else if (val === '工作日') {
        return '星期一';
      } else {
        return '星期六';
      }
    },

    handleTemplate(val) {
      console.log(val)
      this.form.templateName = this.autoTempalteList.filter(item => item.value === val)[0].label;
    },

    handleDitto(val, idx) {

      const ditto = this.$refs['table_' + (idx - 1)][0].getField().map(item => {
        return {
          ...item,
          id: '',
        };
      });
      this.$refs['table_' + idx][0].ditto(ditto);
    },

    handleFrequency(val) {

      this.isJustment = this.isJustment ? false : true;
      this.$nextTick(() => {
        this.isJustment = this.isJustment ? false : true;
      });

      if (Object.keys(this.echoData).length && val === this.echoData.adjustmentFrequency) {
        setTimeout(() => {
          this.echoField(this.echoData);
        }, 10)
      }

      Object.keys(this.timeObj).forEach(item => {
        this.timeObj[item] = [];
      })
    },

    getField() {
      let params = [];
      if (this.form.executionFrequency === '每天') {
        params = this.$refs['table_everyday'].getField();
      } else if (this.form.executionFrequency === '每周') {
        params = [];
        for (let i = 0; i < 7; i ++) {
          params = params.concat(this.$refs[`table_${i}`][0].getField());
        }
      } else if (this.form.executionFrequency === '工作日') {
         params = [];
        for (let i = 0; i < 5; i ++) {
          params = params.concat(this.$refs[`table_${i}`][0].getField());
        }
      } else if (this.form.executionFrequency === '周末') {
        params = [];
        for (let i = 0; i < 2; i ++) {
          params = params.concat(this.$refs[`table_${i}`][0].getField());
        }
      }
      return params;
    },

    save() {
      const msg = [];
      const map = new Map();
      const repetition = {

      };
      const repetitionMsg = new Map();
      this.getField().map((item, index) => {
        if (!item.timeLimit) {
          msg.push(true);
        } else if (item.timeLimit === '自定义时间范围' && (!item.startTime || !item.endTime)) {
          msg.push(true);
        } else if (!item.bidType || item.bidType === '固定竞价' && !item.bid) {
          msg.push(true);
        } else if (item.rule && (!item.adjustTheValue || !item.bidLimitValue)) {
          msg.push(true);
        }

        if (item.week) {
          map.set(item, item.week);
        } else {
          map.set(item, '每天');
        }
      });

      for (const [key, val] of map) {

        if (val === '星期一') {
          const arr = formatS(key.startTime, key.endTime);
          arr.splice(arr.length - 1, arr[arr.length -1] === '23:00' ? 0 : 1);
          repetition[val] = [...repetition[val] || '', ...arr];
        } else if (val === '星期二') {
          const arr = formatS(key.startTime, key.endTime);
          arr.splice(arr.length - 1, arr[arr.length -1] === '23:00' ? 0 : 1);
          repetition[val] = [...repetition[val] || '', ...arr];
        } else if (val === '星期三') {
          const arr = formatS(key.startTime, key.endTime);
          arr.splice(arr.length - 1, arr[arr.length -1] === '23:00' ? 0 : 1);
          repetition[val] = [...repetition[val] || '', ...arr];
        } else if (val === '星期四') {
          const arr = formatS(key.startTime, key.endTime);
          arr.splice(arr.length - 1, arr[arr.length -1] === '23:00' ? 0 : 1);
          repetition[val] = [...repetition[val] || '', ...arr];
        } else if (val === '星期五') {
          const arr = formatS(key.startTime, key.endTime);
          arr.splice(arr.length - 1, arr[arr.length -1] === '23:00' ? 0 : 1);
          repetition[val] = [...repetition[val] || '', ...arr];
        } else if (val === '星期六') {
          const arr = formatS(key.startTime, key.endTime);
          arr.splice(arr.length - 1, arr[arr.length -1] === '23:00' ? 0 : 1);
          repetition[val] = [...repetition[val] || '', ...arr];
        } else if (val === '星期天') {
          const arr = formatS(key.startTime, key.endTime);
          arr.splice(arr.length - 1, arr[arr.length -1] === '23:00' ? 0 : 1);
          repetition[val] = [...repetition[val] || '', ...arr];
        } else if (val === '每天') {
          const arr = formatS(key.startTime, key.endTime);
          arr.splice(arr.length - 1, arr[arr.length -1] === '23:00' ? 0 : 1);
          repetition[val] = [...repetition[val] || '', ...arr];
        }
      }
      
      for (const key in repetition) {
        repetition[key].map(item => {
          if (repetitionMsg.has(`${item}${key}`)) {
            repetitionMsg.set(`${item}${key}`, repetitionMsg.get(`${item}${key}`) + 1);
          } else {
            repetitionMsg.set(`${item}${key}`, 1);
          }

        })
      }
      
      const res = [];
      for (const [key, val] of repetitionMsg) {
        if (val > 1) {
          res.push(key);
        }
      }

      let flag;
      this.$refs.form.validate(s => {
        flag = s;
      });

      if (res.length) {
        this.$message({
          type: 'error',
          message: '调价规则时间范围不能重叠'
        });
        return;
      }

      if (!flag) {
        return;
      }

      if (msg.length) {
        return this.$message({
          type: 'error',
          message: '请将规则条件填写完整'
        });
      }

      const param = {
          campaignId: this.rowData.campaignId,
          templateName: this.form.templateName,
          adjustmentFrequency: this.form.executionFrequency,
          automatedOperation: '分时调价',
          templateType: '分时调价',
          marketplace: this.rowData.marketplace,
          status: this.form.status,
          adCampaignInfos: this.getField(),
          id: this.rowData.adjustmentTemplateVoList.length && this.rowData.adjustmentTemplateVoList[0].id || '',
          startTime: this.form.startTime && dayjs(this.form.startTime).format('YYYY-MM-DD HH:mm:ss') || '',
          endTime: this.form.endTime && dayjs(this.form.endTime).format('YYYY-MM-DD HH:mm:ss') || '',
        }

      if (this.rowData.adjustmentTemplateVoList.length) {

        templateUpdate(param).then(res => {
          this.$emit('update:dialogVisible', false);
          this.$emit('succes');
        })

      } else {

        createTemplate(param).then(res => {
          this.$emit('update:dialogVisible', false);
          this.$emit('succes');
        })
      }

    },

    templateDetail(id) {
      templateDetail({ id, campaignId: this.rowData.campaignId }).then(res => {
        // console.log( this.$refs)
        this.form.executionFrequency = res.data.data.adjustmentFrequency;
        this.form.templateName = res.data.data.templateName;
        this.form.status = res.data.data.status;
        this.form.endTime = res.data.data.endTime;
        this.form.startTime = res.data.data.startTime;
        this.echoData = res.data.data;
        setTimeout(() => {
          this.echoField(res.data.data);
        }, 10)

      })
    },

    echoField(echo) {
      const week1 = [];
      const week2 = [];
      const week3 = [];
      const week4 = [];
      const week5 = [];
      const week6 = [];
      const week7 = [];
      const everyDay = [];

      if (!echo.adCampaignInfos.length) {
        return;
      }

      echo.adCampaignInfos.map(item => {
        if (item.week === '星期一') {
          week1.push(item);
        } else if (item.week === '星期二') {
          week2.push(item);
        } else if (item.week === '星期二') {
          week2.push(item);
        } else if (item.week === '星期三') {
          week3.push(item);
        } else if (item.week === '星期四') {
          week4.push(item);
        } else if (item.week === '星期五') {
          week5.push(item);
        } else if (item.week === '星期六') {
          week6.push(item);
        } else if (item.week === '星期天') {
          week7.push(item);
        } else {
          everyDay.push(item);
        }
      });

      if (this.form.executionFrequency === '每天') {
        this.$refs['table_everyday'].echoField(everyDay);
      } else if (this.form.executionFrequency === '每周') {
        this.$refs[`table_${0}`][0].echoField(week1);
        this.$refs[`table_${1}`][0].echoField(week2);
        this.$refs[`table_${2}`][0].echoField(week3);
        this.$refs[`table_${3}`][0].echoField(week4);
        this.$refs[`table_${4}`][0].echoField(week5);
        this.$refs[`table_${5}`][0].echoField(week6);
        this.$refs[`table_${6}`][0].echoField(week7);
      } else if (this.form.executionFrequency === '工作日') {
        this.$refs[`table_${0}`][0].echoField(week1);
        this.$refs[`table_${1}`][0].echoField(week2);
        this.$refs[`table_${2}`][0].echoField(week3);
        this.$refs[`table_${3}`][0].echoField(week4);
        this.$refs[`table_${4}`][0].echoField(week5);
      } else if (this.form.executionFrequency === '周末') {
        // console.log( this.$refs['table_0'])
        this.$refs[`table_${0}`][0].echoField(week6);
        this.$refs[`table_${1}`][0].echoField(week7);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .label-width {
    width: 250px;
  }

  .collapse {
    padding: 12px 0 0;
    height: 26px;
  }

  ::v-deep .el-collapse-item__header {
    width: 250px;
    background: rgba(51,153,255,.6);
    color: #fff;
    border: none;
    height: 26px;
    border-radius: 2px;
    margin-bottom: 10px;
    padding: 0px 0px 0px 10px;
  }

  ::v-deep .el-collapse-item__wrap {
    border: none;
  }

  .ditto {
    position: relative;
  }

  .is-ditto {
    position: absolute;
    top: 0;
    left: 270px;
  }

  .msg {
    color: #ff4d4f;
    font-size: 20px;
    // font-family: SimSun,sans-serif;
    content: "*";
    display: block;
    widows: 10px;
    padding-right: 4px;
  }

  ::v-deep .el-dialog__body{
    padding: 0px 25px 30px;
    max-height: 80vh;
    overflow: hidden;
    overflow-y: auto;
  }

  .explain {
    margin-top: 10px;
    p {
      margin: 0;
    }
  }

  ::v-deep .el-form-item__label {
    text-align: start;
  }
</style>
