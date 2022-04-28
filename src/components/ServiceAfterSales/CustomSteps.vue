<template>
  <div class="steps">
    <div class="width-container" :style="`width:${230*(stepList.length-1)}px;`">
      <div class="steps-box">
        <el-progress :stroke-width="2" :percentage="percentage" :show-text="false"></el-progress>
        <span class="steps-text"
        :style="`right:${100-(percentage >= 100 ? 100 : percentage)}%;transform: translate(50%, ${percentage>=100?'-10px':'0'});`">{{underway}}</span>
      </div>
      <div class="step-list">
        <div class="step-item" v-for="(item, i) in stepList" :key="i">
          <div class="image-p" :class="{'not':i+1 > stepsNumber}">
            <!-- 动态绑定src 会转换为base64 -->
            <template v-if="item.type === 1"> <!-- 如果是提交申请 --->
              <img v-if="i+1 > stepsNumber" src="@/assets/images/stepsImg/submit-applications.png" alt="">
              <img v-else src="@/assets/images/stepsImg/submit-applications-action.png" alt="">
            </template>
            <template v-if="item.type === 10"> <!-- 如果是处理中 --->
              <img v-if="i+1 > stepsNumber" src="@/assets/images/stepsImg/being-processed.png" alt="">
              <img v-else src="@/assets/images/stepsImg/being-processed-action.png" alt="">
            </template>
            <template v-if="item.type === 20"> <!-- 如果是退款中 --->
              <img v-if="i+1 > stepsNumber" src="@/assets/images/stepsImg/refund.png" alt="">
              <img v-else src="@/assets/images/stepsImg/refund-action.png" alt="">
            </template>
            <template v-if="item.type === 255"> <!-- 如果是处理完成 --->
              <img v-if="i+1 > stepsNumber" src="@/assets/images/stepsImg/figure-out.png" alt="">
              <img v-else src="@/assets/images/stepsImg/figure-out-action.png" alt="">
            </template>
          </div>
          <p>{{item.text}}</p>
        </div>
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
  height: 53px;
  padding: 1px 0 0 7px;
  // overflow-y: hidden;
  > .width-container{
    position: relative;
    padding: 0 1.5em;
    > .steps-box{
      position: relative;
      >.steps-text{
        position: absolute;
        top: -0.8em;
        color: #428dfa;
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
      .image-p{
        width: 30px;
        height: 30px;
        border-radius: 50%;
        overflow: hidden;
        box-sizing: border-box;
        background-color: #428dfa;
        border: 1px solid #428dfa;
        img{
          transform: scale(1.001,1.001);
          width: 16px;
          height: 18px;
          padding: 6px 6px;
          z-index: 9999;
        }
      }
      .not{
          background-color: #fff;
          border: 1px solid #ccc;
      }
      p{
        position: absolute;
        transform: translate(0, 30px);
        text-align: center;
        left: -50%;
        width: 6em;
        color: #428dfa;
      }
    }
  }
}
</style>
