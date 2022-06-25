<template>
  <section class="mp-pc-comps-multiple-selector-comp-wrap" v-clickoutside="handleBodyEventEmit">
    <label v-if="label" class="l" :style="`line-height:${h}px`">{{label}}：</label>
    <header @click.stop="switchVisiblt" :class="{visible:visible}" :style="`height:${h}px;min-width:${minWidth}px;max-width:${maxWidth}px;`">
      <!-- 为空时展示 -->
      <span class="placeholder" v-if="selectedList.length === 0">{{placeholder}}</span>
      <div class="list" :style="`max-width:${maxWidth - 45}px`">
        <span v-for="it in selectedList" :key="it[defaultProps.value]">
          <em>{{it[defaultProps.label]}}</em>
          <i class="el-icon-close" @click.stop="onLabelItemRemoveClick(it)"></i>
        </span>
      </div>
      <span class="aside"><i></i></span>
    </header>
    <transition name="el-zoom-in-top">
    <!-- <el-collapse-transition> -->
      <div class="popper mp-scroll-wrap" :class="{'has-l': label}" v-show="visible" :style="`top:${h + 3}px;min-width:${minWidth}px`" @click.stop ref="oPopper">
        <span v-if="options.length === 0" class="empty">暂无数据</span>
        <ul>
          <li v-for="it in options" :key="it[defaultProps.value]" @click.self="onItemClick(it)">
            <span @click.self="onItemClick(it)">{{it[defaultProps.label]}}</span>
            <el-checkbox :value="value.includes(it[defaultProps.value])" @change="onItemClick(it)"></el-checkbox>
          </li>
        </ul>
      </div>
    <!-- </el-collapse-transition> -->
    </transition>
  </section>
</template>

<script>
import Clickoutside from 'element-ui/src/utils/clickoutside';

export default {
  directives: {
    Clickoutside,
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Array,
      default: () => [],
    },
    defaultProps: {
      type: Object,
      default: () => ({
        label: 'Name',
        value: 'ID',
      }),
    },
    nowrap: { // 默认不会换行
      type: Boolean,
      default: true,
    },
    size: {
      type: String,
      default: 'small',
    },
    label: {
      type: String,
      default: '产品类别',
    },
    placeholder: {
      type: String,
      default: '不限',
    },
    h: {
      type: Number,
      default: 32,
    },
    minWidth: {
      type: Number,
      default: 200,
    },
    maxWidth: {
      type: Number,
      default: 300,
    },
  },
  computed: {
    localValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
    selectedList() {
      const list = this.value.map(id => this.options.find(it => it[this.defaultProps.value] === id)).filter(it => it);
      return list;
    },
  },
  data() {
    return {
      visible: false,
      temp: [],
    };
  },
  methods: {
    switchVisiblt() {
      this.visible = !this.visible;
      if (this.visible) {
        // 展开
        this.temp = [...this.value];
        if (this.$refs.oPopper) {
          this.$nextTick(() => {
            this.handleScrollTop();
          });
        }
      } else {
        const getStringify = arr => {
          const temp = [...arr].sort((a, b) => a - b);
          return JSON.stringify(temp);
        };
        if (getStringify(this.temp) !== getStringify(this.value)) {
          this.$emit('change', this.value);
        }
      }
    },
    onItemClick(it) {
      const id = it[this.defaultProps.value];
      const list = this.value.includes(id) ? this.value.filter(_id => _id !== id) : [...this.value, id];
      this.localValue = list;
    },
    onLabelItemRemoveClick(it) {
      this.onItemClick(it);
      if (!this.visible) {
        this.$nextTick(() => {
          this.$emit('change', this.value);
        });
      }
    },
    handleBodyEventEmit() {
      if (!this.visible) return;
      this.switchVisiblt();
    },
    handleScrollTop() {
      if (this.value.length === 0) {
        this.$refs.oPopper.scrollTop = 0;
      } else {
        const lastId = this.value[this.value.length - 1];
        const i = this.options.findIndex(it => it[this.defaultProps.value] === lastId);
        if (i > -1) {
          const h = (i + 1) * 38 + 5;
          if (h <= 280) {
            this.$refs.oPopper.scrollTop = 0;
          } else {
            this.$refs.oPopper.scrollTop = h - 280;
          }
        }
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-pc-comps-multiple-selector-comp-wrap {
  display: inline-block;
  position: relative;
  vertical-align: top;
  > label.l {
    min-width: 5em;
    display: inline-block;
    vertical-align: top;
    font-weight: 700;
    color: #585858;
    text-align: right;
    margin-right: 4px;
  }
  > header {
    display: inline-block;
    border: 1px solid #e5e5e5;
    min-width: 200px;
    border-radius: 4px;
    cursor: pointer;
    box-sizing: border-box;
    line-height: 30px;
    padding: 0 30px 0 13px;
    position: relative;
    &:hover {
      border-color: #aaa;
      transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    }
    > .placeholder {
      color: #585858;
    }
    > .aside {
      position: absolute;
      width: 30px;
      height: 100%;
      right: 0;
      top: 0;
      text-align: center;
      color: #aaa;
      padding-top: 1px;
      i {
        display: inline-block;
        width: 13px;
        height: 13px;
        background: url(../../../assets/images/arrow.png) no-repeat center center/100% 100%;
      }

    }
    > div.list {
      display: inline-block;
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      vertical-align: top;
      > span {
        display: inline-block;
        height: 22px;
        line-height: 22px;
        border: 1px solid #eee;
        border-radius: 5px;
        padding: 0 5px;
        padding-right: 4px;
        background-color: #f8f8f8;
        color: #989898;
        > i {
          margin-left: 7px;
          color: #aaa;
          transition: 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
          &:hover {
            color: #585858
          }
        }
        & + span {
          margin-left: 6px;
        }
        > em {
          transition: 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
          &:hover {
            color: #585858
          }
        }
      }
    }
    &.visible {
      border-color: #428dfa;
    }
  }
  > div.popper {
    position: absolute;
    min-height: 40px;
    min-width: 100%;
    z-index: 99;
    background: #fff;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    border: solid 1px #E4E7ED;
    padding: 5px 10px;
    padding-right: 0;
    box-sizing: border-box;
    left: 4px;
    display: inline-block;
    white-space: nowrap;
    max-height: 280px;
    overflow-y: auto;
    overflow-y: overlay;
    &.has-l {
      left: 5em;
      left: calc(5em + 4px);
    }
    > .empty {
      font-size: 12px;
      color: #aaa;
      line-height: 24px;
    }
    > ul {
      > li {
        line-height: 17px;
        border-bottom: 1px solid #eee;
        padding: 10px 5px;
        padding-right: 40px;
        color: #444;
        position: relative;
        cursor: pointer;
        &:hover {
          background-color: #f6f6f6;
        }
        > .el-checkbox {
          position: absolute;
          right: 15px;
        }
      }
    }
  }
}
</style>
