<template>
  <section class="mp-pc-order-detail-page-progress-comp-wrap">
    <header class="section-title">订单跟踪</header>
    <ul class="content mp-scroll-wrap">
      <li v-for="(item, i) in progressData" :key="item.OperateTime + i" :class="item.ShowFocus?'active':''">
        <div class="point-box">
          <span class="point-item"></span>
          <span class="line" v-if="i < progressData.length - 1"></span>
        </div>
        <span class="date">{{item.OperateTime | format2MiddleLangTypeDate}}</span>
        <el-tooltip popper-class="table-item" :content="item.Description" placement="top-start">
          <span class="progress-text">{{item.Description}}</span>
        </el-tooltip>
        <el-progress
         :percentage="item.FinishPercent" ></el-progress>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  props: {
    OrderID: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      progressData: null,
    };
  },
  async mounted() {
    if (!this.OrderID) return;
    // this.$emit('setProgressDataCompleted', false);
    const res = await this.api.getOrderProgress(this.OrderID);
    this.$emit('setProgressDataCompleted', true);
    if (res.data.Status === 1000) {
      this.progressData = res.data.Data.filter(it => it.FinishPercent !== 0 || it.ShowFocus).reverse();
    }
  },
};
</script>

<style lang='scss'>
.mp-pc-order-detail-page-progress-comp-wrap {
  > ul.content {
    padding-left: 100px;
    padding-top: 50px;
    padding-bottom: 95px;
    margin-right: 6px;
    max-height: 225px;
    overflow-y: auto;
    > li {
      > .point-box {
        display: inline-block;
        vertical-align: top;
        > .point-item {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          display: block;
          position: relative;
          &::after {
            content: '';
            width: 9px;
            height: 9px;
            position: absolute;
            background-color: #e6e6e6;
            border-radius: 50%;
            left: 3px;
            top: 3px;
          }
        }
        > .line {
          width: 1px;
          height: 60px;
          background-color: #eee;
          display: block;
          margin-left: 7px;
          margin-top: -3px;
          margin-bottom: -3px;
        }
      }
      > span {
        display: inline-block;
        color: #888;
        &.date {
          margin-left: 40px;
          margin-right: 30px;
          font-size: 12px;
        }
        &.progress-text {
          font-weight: 700;
          font-size: 14px;
          width: 100px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 60px;
        }
      }
      > .el-progress {
        display: inline-block;
        vertical-align: top;
        margin-top: -2px;
        width: 220px;
        position: relative;
        > .el-progress-bar {
          width: 220px;
          height: 5px;
          padding: 0;
          > .el-progress-bar__outer {
            height: 5px !important;
            border-radius: 3px;
            background-color: #e6e6e6;
            > .el-progress-bar__inner {
              border-radius: 3px;
              background-image: linear-gradient(90deg, #35dff9 0%, #62f9d5 100%);
              opacity: 0.6;
            }
          }
        }
        > .el-progress__text {
          position: absolute;
          display: block;
          top: 20px;
          font-size: 12px !important;
          color: #888;
          right: 0;
        }
      }
      &.active {
        > .point-box {
          > .point-item {
            background-color: rgba($color: #428dfa, $alpha: 0.25);
            &::after {
              background-color: #428dfa;
            }
          }
        }
        > span {
          color: #333;
        }
        > .el-progress > .el-progress-bar > .el-progress-bar__outer > .el-progress-bar__inner {
          background-image: linear-gradient(90deg, #428dfa 0%,#26bcf9 100%);
          opacity: 1;
        }
      }
    }
  }
}
</style>
