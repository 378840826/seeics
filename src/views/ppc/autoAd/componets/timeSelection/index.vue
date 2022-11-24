<template>
  <table id="table" style="width: 100%; border-collapse: collapse;position: relative;" border="1" >
    <div v-show="isShow" class="divs"></div>
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
      <tr><th v-for="(item, idx) in times" :key="item" style="width: 37px">{{idx}}</th></tr>
    </thead>

    <tbody ref="tableRef" @mouseup="mouseup" class="tbody">
      
      <!-- <td v-for="item in times" :key="item">{{item}}</td> -->
      <tr
        v-for="item in tabels"
        :key="item.week"
      >
        <td style="textAlign: center;">{{item.week}}</td>
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
      px: 0,
      isShow: true
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
      this.startCellIndex = e.target.cellIndex;
      this.startRowIndex = e.target.parentNode.rowIndex;
      this.isShow = true;
      const div = document.querySelector('.divs');
      console.log(e.layerY + 44, e.layerX)
      div.style.top = `${e.layerY + 45}px`;
      div.style.left = `${e.layerX - 2}px`;
      div.style.background = 'rgba(0,0,0,.2)';
      this.py = e.layerY; this.px = e.layerX;
      this.$refs.tableRef.addEventListener('mousemove', this.mousemove);
      
    },

    mouseup(e) {
   
      const div = document.querySelector('.divs');
      div.style.width = '0px'; div.style.height = '0px'; 
      this.isShow = false;
      this.$refs.tableRef.removeEventListener('mousemove', this.mousemove, false);

      this.endCellIndex = e.target.cellIndex;
      this.endRowIndex = e.target.parentNode.rowIndex;
      const start = this.startCellIndex > this.endCellIndex ? this.endCellIndex : this.startCellIndex;
      const end = this.endCellIndex < this.startCellIndex ? this.startCellIndex : this.endCellIndex;
      const startRow = this.startRowIndex > this.endRowIndex ? this.endRowIndex : this.startRowIndex;
      const endRow = this.endRowIndex < this.startRowIndex ? this.startRowIndex : this.endRowIndex;
      const data = [];
      this.tdDom.forEach(item => {
        if ((item.cellIndex >= start && item.parentNode.rowIndex >= startRow)
          && (item.cellIndex <= end && item.parentNode.rowIndex <= endRow)) {
          if (item.style.background === 'rgba(175, 216, 255, 0.5)') {

            item.style.background = '';
          } else {
            item.style.background = 'rgb(175 216 255 / 50%)';
          }
        }
      });
      this.tdDom.forEach(item => {
        if (item.style.background === 'rgba(175, 216, 255, 0.5)') {
          data.push({
            row: item.parentNode.rowIndex - 1,
            idx: item.cellIndex - 1
          });
        }
      });

      this.data = selectData(data);
    },

    mousemove(e) {
      if (!e.target.cellIndex || e.target.parentNode.rowIndex < 2) {
        const div = document.querySelector('.divs');
        div.style.width = '0px'; div.style.height = '0px'; 
        this.isShow = false;
        this.$refs.tableRef.removeEventListener('mousemove', this.mousemove, false);
      }

      const div = document.querySelector('.divs');
      const endY = e.layerY;
      const endX = e.layerX;
   

      if (this.py > e.layerY && this.px > e.layerX) {
        
        div.style.height = `${this.py - endY}px`;
        div.style.width = `${this.px - endX}px`;
        div.style.top = `${endY + 44}px`;
        div.style.left = `${endX + 2}px`;

      } else if (this.py < endY && this.px < endX) {
        
        div.style.height = `${endY - this.py}px`;
        div.style.width = `${endX - this.px}px`;
        div.style.top = `${this.py + 42}px`;
        div.style.left = `${this.px}px`;

      } else if (this.py > endY && this.px < endX) {

        div.style.top = `${endY + 44}px`;
        div.style.left = `${this.px - 2}px`;
        div.style.height = `${this.py - endY}px`;
        div.style.width = `${endX - this.px}px`;

      } else if (this.py < endY && this.px > endX) {

        div.style.top = `${this.py + 42}px`;
        div.style.left = `${endX}px`;
        div.style.height = `${endY - this.py}px`;
        div.style.width = `${this.px - endX}px`;
      }
    }


  }
};
</script>

<style lang="scss" scoped>
  .tbody {
    position: relative;
  }

  .divs {
    position: absolute;
    top: 44;
    left: 0;
    border: 1px solid #2f99fd;
  }
</style>