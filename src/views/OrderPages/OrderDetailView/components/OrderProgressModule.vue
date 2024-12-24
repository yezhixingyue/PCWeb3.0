<template>
  <section class="mp-pc-order-detail-page-progress-module-comp-wrap module">
    <header>
      <img src="../../../../assets/images/order-detail/progress.png" alt="">
      <span>订单进度</span>
    </header>
    <main v-loading="OrderProgress.loading"  class="content mp-scroll-wrap">
      <ul class="list">
        <li v-for="(item, i) in curProgressData" :key="item.OperateTime + i" :class="item.ShowFocus?'active':''">
          <div class="point-box">
            <span class="point-item"></span>
            <span class="line" v-if="i < curProgressData.length - 1"></span>
          </div>
          <span class="date">{{item.OperateTime | format2MiddleLangTypeDate}}</span>
          <el-tooltip popper-class="table-item" :content="item.Description" placement="top-start" :visible-arrow='false'>
            <span class="progress-text">{{item.Description}}</span>
          </el-tooltip>
          <span v-show="item.FinishPercent || item.FinishPercent === 0">{{ item.FinishPercent }}%</span>
        </li>
      </ul>
    </main>
  </section>
</template>

<script>
export default {
  props: {
    OrderProgress: {
      type: Object,
      default: null,
    },
  },
  computed: {
    curProgressData() {
      return this.OrderProgress.dataList;
    },
  },
};
</script>

<style lang='scss'>
.mp-pc-order-detail-page-progress-module-comp-wrap {
  > main.content {
    margin-right: 6px;
    height: 648px;
    overflow-y: auto;
    margin-top: 10px;
    padding-top: 6px !important;
    padding-right: 2px !important;
    li {
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
          height: 65px;
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
          margin-left: 15px;
          margin-right: 15px;
          font-size: 12px;
        }
        &.progress-text {
          font-weight: 700;
          font-size: 14px;
          width: 70px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 10px;
          vertical-align: -2px;
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
          color: #585858;
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
