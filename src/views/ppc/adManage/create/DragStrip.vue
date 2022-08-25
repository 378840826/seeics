<template>
  <div>

  <div class="bas" style="display: flex;    position: relative;">
    <div class="round1"
      ref="round1"
    ></div>
    <div class="round" 
      ref="round"
    ></div>
    <hr style="width: 216px"/>
    <hr ref="hr" class="hr"/>
    <span style="marginLeft: 20px">
        {{min}}-{{max}}星
    </span>
    
    </div>
    <div style="width: 220px; display: flex;justify-content: space-between;margin-left: 2px">
      <span>0</span>
      <span>1</span>
      <span>2</span>
      <span>3</span>
      <span>4</span>
      <span>5</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      round2: null,
      round3: null,
      hr: null,
      min: 0,
      max: 1,
    };
  },

  mounted() {
    this.round2 = this.$refs.round;
    this.round3 = this.$refs.round1;
    this.hr = this.$refs.hr;
    const _this = this;
    this.hr.style.left = `${this.round3.offsetLeft}px`;
    this.hr.style.width = `${this.round2.offsetLeft - this.round3.offsetLeft}px`;

    _this.round2.onmousedown = (e) => {
      const et = document.querySelector('.bas');
      const x = e.clientX - _this.round2.offsetLeft;
      et.onmousemove = (e) => {
        e.stopPropagation();
        const w = e.clientX - x;

        this.round2.style.left = `${this.round3.offsetLeft + 40 > w ? this.round3.offsetLeft + 40 : w}px`;
        this.round2.style.left = `${w < 40 && 40 || w > 210 && 210}px`;
        this.hr.style.width = `${this.round2.offsetLeft - this.round3.offsetLeft}px`; //高亮进度条长度
        this.offsetLeft1 = this.round2.offsetLeft;
        
        if (this.round2.offsetLeft >= 40 && this.round2.offsetLeft < 80) {
          this.max = 1;
        } else if (this.round2.offsetLeft >= 80 && this.round2.offsetLeft < 120) {
          this.max = 2;
        } else if (this.round2.offsetLeft >= 120 && this.round2.offsetLeft < 160) {
          this.max = 3;
        } else if (this.round2.offsetLeft >= 160 && this.round2.offsetLeft < 200) {
          this.max = 4;
        } else if (this.round2.offsetLeft >= 200 && this.round2.offsetLeft <= 216) {
          this.max = 5;
        }
      };

      et.onmouseup = () => {
        et.onmousemove = null;
      };
      et.mouseout = () => {
        et.onmousemove = null;
      };
    };

    _this.round3.onmousedown = (e) => {
      const et = document.querySelector('.bas');
      const x = e.clientX - _this.round3.offsetLeft;
      et.onmousemove = (e) => {
        e.stopPropagation();
        const w = e.clientX - x;

        this.round3.style.left = `${this.round2.offsetLeft - 40 < w ? this.round2.offsetLeft - 40 : w}px`;
        this.round3.style.left = `${w < 0 && 0}px`;
        this.hr.style.width = `${this.round2.offsetLeft - this.round3.offsetLeft}px`; //高亮进度条长度
        this.hr.style.left = this.round3.style.left; //高亮进度条位置

        if (this.round3.offsetLeft >= 0 && this.round3.offsetLeft < 40) {
          this.min = 0;
        } else if (this.round3.offsetLeft >= 40 && this.round3.offsetLeft < 80) {
          this.min = 1;
        } else if (this.round3.offsetLeft >= 80 && this.round3.offsetLeft < 120) {
          this.min = 2;
        } else if (this.round3.offsetLeft >= 120 && this.round3.offsetLeft < 160) {
          this.min = 3;
        } else if (this.round3.offsetLeft >= 160 && this.round3.offsetLeft <= 200) {
          this.min = 4;
        }
      };

      et.onmouseup = () => {
        et.onmousemove = null;
      };
      et.mouseout = () => {
        et.onmousemove = null;
      };
    };
  },
};
</script>

<style lang="scss" scoped>
  .bas {
    line-height: 32px;
    align-items: center;
  }
  .round1 {
    //   width: 6px;
    //   height: 6px;
      border: 8px solid cornflowerblue;
      border-radius: 8px;
      position: absolute;
      z-index: 10;
    }

    .round {
    //   width: 6px;
    //   height: 6px;
      border: 8px solid cornflowerblue;
      border-radius: 8px;
      position: absolute;
      left: 40px;
      z-index: 10;
      ;
    }

    .hr {
      width: 0;
      position: absolute;
      border: none; 
      height: 3px; background-color: cornflowerblue
    }
</style>
