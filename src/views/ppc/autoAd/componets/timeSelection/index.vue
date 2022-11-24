<template>
  <table id="table" style="width: 100%; border-collapse: collapse;" border="1" >
    <thead>
      
      <tr>
        <th :rowSpan="2">时间</th>
      <template v-for="item in times" @contextmenu="handleContexMenu">
        <th
          v-if="item === '06:00'"
          :colspan="6"
          :key="item">00:00 - 06:00</th>
        <th
          v-if="item === '12:00'"
          :colspan="6"
          :key="item">06:00 - 12:00</th>
          <th
          v-if="item === '18:00'"
          :colspan="6"
          :key="item">12:00 - 18:00</th>
          <th
          v-if="item === '23:00'"
          :colspan="6"
          :key="item">18:00 - 24:00</th>
      </template>
       
      </tr>
      <tr><th v-for="(item, idx) in times" :key="item">{{idx}}</th></tr>
    </thead>

    <tbody ref="tableRef" @mouseup="mouseup" class="tbody">
      <!-- <td v-for="item in times" :key="item">{{item}}</td> -->
      <tr
        v-for="item in tabels"
        :key="item.week"
      >
        <td>{{item.week}}</td>
        <td
          v-for="item in item.select"
          :key="item"
          :aria-checked="times[item]"
          style="height: 40px"
        >
          <!-- {{item}} -->
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>

import { times } from '../../dict';
import { format, timeData, weekTransition, weekNumberToChinese, timeFormat, selectData } from './ulit';

export default {
//   components: { table },
  data() {
    return {
      times,
      tabels: this.timeData(),
      tdDom: [],
      startCellIndex: 0,
      startRowIndex: 0,
      endCellIndex: 0,
      endRowIndex: 0,
      data: [],
      py: 0,
      px: 0
    };
  },

  mounted() {
    const ref = this.$refs.tableRef;
    // ref.removeEventListener('mousedown', mouseDown);
    // ref.removeEventListener('mouseup', mouseUp);
    // ref.addEventListener('mousedown', mouseDown);
    // ref.addEventListener('mouseup', mouseUp);

    //rowIndex cellIndex

    this.tdDom = document.querySelectorAll('#table td:not(:first-child');
    console.log(this.tdDom)
    this.$refs.tableRef.addEventListener('selectstart', function(e){
      e.preventDefault();
    });
    
    ref.addEventListener('mousedown', this.mousedown);


  },

  methods: {
    format,
    timeData,
    weekTransition,
    weekNumberToChinese,
    timeFormat,
    selectData,
    handleContexMenu(val) {
    //   console.log(val)
    },

    mousedown(e) {
      console.log(e);
      this.startCellIndex = e.target.cellIndex;
      this.startRowIndex = e.target.parentNode.rowIndex;
      // this.py = e.layerY;
      // this.px = e.layerX;
      // const div = document.createElement('div');
      // div.className = 'divs'
      // div.style.position = 'absolute';
      // div.style.top = `${e.layerY}px`;
      // div.style.left = `${e.layerX}px`;
      // div.style.width ="10px";
      // // div.style.height ="10px";
      // div.style.border = '1px solid #ccc';
      // div.addEventListener('selectstart', function(e) {
      //   e.preventDefault();
      // });
      // document.querySelector('.tbody').appendChild(div);
      this.$refs.tableRef.addEventListener('mousemove', this.mousemove);
      // e.target.style.background = 'red';
    },

    mouseup(e) {
      // const div = document.querySelector('.divs');
      // console.log((e.layerX - this.px) + 'px')
      // div.style.width = (e.layerX - this.px - 1) + 'px';
      // div.style.height = (e.layerY - this.py - 1) + 'px';
      // document.querySelector('.tbody').removeChild(div);
      this.$refs.tableRef.removeEventListener('mousemove', this.mousemove, false);
      // this.py = 0; this.px = 0;
      this.endCellIndex = e.target.cellIndex;
      this.endRowIndex = e.target.parentNode.rowIndex;
      // console.log(e)
      const data = [];
      this.tdDom.forEach(item => {
        if ((item.cellIndex >= this.startCellIndex && item.parentNode.rowIndex >= this.startRowIndex)
          && (item.cellIndex <= this.endCellIndex && item.parentNode.rowIndex <= this.endRowIndex)) {
          
          if (item.style.background === 'red') {

            item.style.background = '';
          } else {
            item.style.background = 'red';
          }
        }
      });
      this.tdDom.forEach(item => {
        if (item.style.background === 'red') {
          data.push({
            row: item.parentNode.rowIndex,
            idx: item.cellIndex
          });
        }
      });

      this.data = selectData(data);
    },

    mousemove(e) {
    //   console.log(e)
      // const div = document.querySelector('.divs');
      // console.log((e.layerX - this.px) + 'px')
      // div.style.width = (e.layerX - this.px) + 'px';
      // div.style.height = (e.layerY - this.py) + 'px';
    }


  }
};
</script>

<style lang="scss" scoped>
  .tbody {
    position: relative;
  }
</style>