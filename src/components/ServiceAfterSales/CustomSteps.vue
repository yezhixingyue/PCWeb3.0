<template>
  <div class="steps">
    <div class="width-container" :style="`width:${230*stepList.length}px;`">
      <div class="steps-box">
        <el-progress :percentage="percentage" :show-text="false"></el-progress>
        <span class="text" :style="`right:${100-percentage}%;transform: translate(${percentage>=100?'-26px':'-10px'}, 0);`">{{underway}}</span>
      </div>
      <div class="step-list">
        <div class="step-item" v-for="(item, i) in stepList" :key="i">
          <i class="iconfont icon-a-gantanhao2" :style="`color:${i+1 <= stepsNumber? '#428dfa':'#efefef'};`"></i>
          <p>{{item.text}}</p>
        </div>
        <!-- <div class="step-item">
          <i class="el-icon-share"></i>
          <p>进行中</p>
        </div>
        <div class="step-item">
          <i class="el-icon-share"></i>
          <p>服务单已取消</p>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    stepsNumber: { // 当前所在步最小为 1
      type: Number,
      require: true,
    },
    stepList: {
      // 步骤列表
      type: Array,
      default: () => [{ text: 'q', iconClass: '' }, 'b', 'c'],
      // {
      //   stepName: 每一步的步骤名
      // }
    },
    underway: {
      type: String,
      default: '处理中',
    },
  },
  computed: {
    // 计算进度条进度百分比
    percentage() {
      // 求进度条每步走多少百分比
      const stepPercentage = 100 / (this.stepList.length - 1);
      // 求半步需要走的百分比
      const halfStepPercentage = stepPercentage / 2;
      // 求出当前步需要走的百分比
      if (this.stepsNumber === this.stepList.length) return stepPercentage * (this.stepsNumber - 1);
      if (this.stepsNumber > this.stepList.length) return stepPercentage * (this.stepList.length - 1);
      return stepPercentage * (this.stepsNumber - 1) + halfStepPercentage;
    },
  },
};
</script>
<style lang="scss">
.steps{
  // display: flex;
  height: 65px;
  padding: 10px;
  overflow-y: auto;
  > .width-container{
    position: relative;
    padding: 0 1.5em;
    margin-top: 1em;
    > .steps-box{
      position: relative;
      >.text{
        position: absolute;
        top: -0.8em;
      }
      .el-progress{
        width: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        height: 2em;
      }
    }
  }
  .step-list{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    // transform: translate(0, -1em);
    .step-item{
      position: relative;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      width: 3em;
      i{
        transform: scale(1.001,1.001);
        font-size: 2em;
        border-radius: 50%;
        background-color: #fff;
        color: red;
      }
      p{
        position: absolute;
        transform: translate(0, 30px);
        text-align: center;
        left: -50%;
        width: 6em;
      }
    }
  }
}
</style>
