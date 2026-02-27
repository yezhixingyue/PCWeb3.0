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
      <div>
        <span v-if="data.showLine" class="line"></span>
        <span>{{ data.expressDetail }}</span>
        <span v-if="data.operator" class="operator"
          ><i>/</i>{{ data.operator }}</span
        >
      </div>
      <div v-if="data.Pics && data.Pics.length > 0" class="express-pics-wrap">
        <span class="blue-span">查看签收图片</span>
        <el-image :src="imgSrc" :preview-src-list="data.Pics" :close-on-press-escape="false" />
      </div>
    </section>
  </li>
</template>

<script>
const imgSrc = require('@/assets/images/arrow.png');

export default {
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      imgSrc,
    };
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
    width: 360px;
    margin-right: -70px;
    line-height: 22px;
    margin-top: -5px;
    margin-bottom: 12px;
    text-align: left;
    display: inline-block;
    vertical-align: top;
    position: relative;
    > div > .line {
      height: calc(100% + 8px);
      position: absolute;
      width: 1px;
      background-color: #eee;
      left: -30px;
      top: 16px;
      z-index: 9;
    }
    &.active > div > .line {
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

    .express-pics-wrap {
      .el-image {
        margin-left: -72px;
        width: 72px;
        height: 20px;
        position: relative;
        top: 5px;
      }
      .el-image__inner.el-image__preview, .el-image__error {
        opacity: 0;
      }

      .is-gray {
        user-select: none;
        opacity: 0.7;
      }
    }

  }
  &.active {
    color: $--color-text-primary;
  }
}
</style>
