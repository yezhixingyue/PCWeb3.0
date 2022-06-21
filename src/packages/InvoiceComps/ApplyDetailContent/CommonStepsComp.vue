<template>
  <ul class="mp-common-steps-comp-wrap" :class="{allCompleted:allCompleted}">
    <li v-for="(it, i) in list" :key="i" :class="{completed: it.completed, active: it.active && !it.completed}">
      <div class="content">
        <p class="top" :class="{visible: it.completed && i === list.length - 1}">{{it.activeTitle}}</p>
        <div class="icon">
          <i :class="it.icon"></i>
        </div>
        <p>{{it.title}}</p>
        <p v-if="it.completed || it.active">{{it.date}}</p>
      </div>
      <div class="right" v-if="i < list.length - 1">
        <span class="text" :class="{visible: it.active && !it.completed}">{{it.activeTitle}}</span>
        <span class="line"></span>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    allCompleted() { // 是否全部完成， 此时最后一个步骤的上方会显示文字
      return this.list.length > 0 && this.list[this.list.length - 1].completed;
    },
  },
};
</script>
<style lang='scss'>
@import "@/assets/css/var.scss";
ul.mp-common-steps-comp-wrap {
  padding-top: 15px;
  white-space: nowrap;
  > li {
    display: inline-block;
    vertical-align: top;
    color: #989898;
    > div {
      display: inline-block;
      vertical-align: top;
      text-align: center;
      font-size: 13px;
      padding-top: 0px;
      &.content {
        min-width: 109px;
        > div.icon {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: inline-block;
          box-sizing: border-box;
          border: 1px solid #989898;
          background: #fff;
          > i {
            line-height: 28px;
          }
        }
        > p {
          margin-top: 10px;
          &.top {
            visibility: hidden;
            margin-top: 0;
            margin-bottom: 10px;
            &.visible {
              visibility: visible;
            }
          }
        }
      }
      &.right {
        padding-top: 13px;
        .text {
          visibility: hidden;
          &.visible {
            visibility: visible;
          }
        }
        .line {
          display: block;
          width: 220px;
          height: 4px;
          background: #eee;
          border-radius: 2px;
          margin: 0 -23px;
          margin-top: 10px;
          position: relative;
          &::after {
            content: '';
            left: 0;
            top: 0;
            bottom: 0;
            width: 0;
            position: absolute;
            background: $--color-primary;
            border-radius: 2px;
          }
        }
      }
    }
    &.completed, &.active {
      color: $--color-primary;
      > .content {
        > div.icon {
          border-color: $--color-primary;
          background: $--color-primary;
          color: #fff;
        }
      }
      > .right .line::after {
        width: 100%;
      }
    }
    &.active > .right .line::after {
      width: 50%;
    }
  }
  // &.allCompleted {
  //   padding-top: 35px;
  // }
}
</style>
