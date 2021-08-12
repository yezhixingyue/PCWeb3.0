<template>
  <li
    class="order-list-progress-item-mini"
    :class="data.isNewest ? 'active' : ''"
  >
    <section class="left-title-wrap">
      <span class="year-box">{{ data.year }}</span>
      <span class="aftertime-box">{{ data.afterTime }}</span>
    </section>
    <section :class="data.isNewest ? 'md-point-wrap active' : 'md-point-wrap'">
      <span class="express-point"></span>
    </section>
    <section :class="data.isNewest ? 'right-progress-wrap active' : 'right-progress-wrap'">
      <span v-if="data.showLine" class="line"></span>
      <span>{{ data.expressDetail }}</span>
      <span v-if="data.operator" class="operator"
        ><i>/</i>{{ data.operator }}</span
      >
    </section>
  </li>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.order-list-progress-item-mini {
  color: $--color-text-table-time;
  font-size: 12px;
  .left-title-wrap {
    width: 240px;
    display: inline-block;
    vertical-align: top;
    text-align: right;
    .aftertime-box {
      margin-left: 8px;
    }
  }
  .md-point-wrap {
    width: 15px;
    margin: 0 22px;
    min-height: 39px;
    display: inline-block;
    position: relative;
    vertical-align: top;
    height: 100%;
    > .express-point {
      height: 15px;
      width: 15px;
      border-radius: 50%;
      background-color: #fff;
      display: block;
      position: relative;
      &::after {
        content: "";
        width: 9px;
        height: 9px;
        background-color: $--border-color-light;
        border-radius: 50%;
        position: absolute;
        left: 3px;
        top: 3px;
      }
    }
    &.active {
      > .express-point {
        background-color: rgba(66, 141, 250, 0.3);
        position: relative;
        &::after {
          background-color: #428dfa;
        }
      }
    }
  }
  .right-progress-wrap {
    width: 380px;
    margin-right: -70px;
    line-height: 22px;
    margin-top: -5px;
    margin-bottom: 12px;
    text-align: left;
    display: inline-block;
    vertical-align: top;
    position: relative;
    > .line {
      height: calc(100% + 8px);
      position: absolute;
      width: 1px;
      background-color: #eee;
      left: -30px;
      top: 16px;
      z-index: 9;
    }
    &.active > .line {
      height: calc(100% + 6px);
      top: 20px;
    }
    .title {
      font-size: 14px;
      font-weight: 600;
      margin-right: 10px;
    }
    .operator {
      margin-left: 10px;
      > i {
        margin-right: 8px;
      }
    }
  }
  &.active {
    color: $--color-text-primary;
  }
}
</style>
