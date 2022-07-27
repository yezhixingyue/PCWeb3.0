<template>
  <div class="mp-common-comps-ep-cascader-comp-wrap" :class="{'show-line':showLine}">
    <label class="title">{{title}}：</label>
    <el-popover
      placement="bottom-start"
      popper-class="mp-common-comps-ep-cascader-comp-popper-wrap"
      trigger="manual"
      ref="oPop"
      transition="el-zoom-in-top"
      v-model="visible">
      <el-button slot="reference" :style="`width:${fiexdWidth ? fiexdWidth + 'px' : ''}`"
       size="small" class="btn" @click="open" :class="{active:visible}">{{label.join(' / ')||'不限'}}</el-button>
      <div class="display-content" v-clickoutside="close">
        <ListComp
          v-for="(it, i) in cascaderList"
          :key="it.key"
          :list="it.list"
          :activeIds="activeIds"
          :selectedIds="value"
          :withEmpty="withEmpty"
          :defaultProps="defaultProps"
          @hoverItem="e => onItemHover(i, e)"
          @itemClick="onItemClick"
        />
        <div class="empty" v-if="cascaderList.length === 0">
          <span>暂无数据</span>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
import Clickoutside from 'element-ui/src/utils/clickoutside';
import ListComp from './ListComp.vue';
import { debounce } from '../../assets/js/utils/throttle';

export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Array,
      default: () => [],
    },
    withEmpty: {
      type: Boolean,
      default: true,
    },
    showLine: { // 显示样式
      type: Boolean,
      default: true,
    },
    defaultProps: {
      type: Object,
      default: () => ({
        ID: 'ID',
        Name: 'ClassName',
        children: 'children',
      }),
    },
    fiexdWidth: { // 是否固定宽度 如果传的有值则使用固定宽度
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: '产品',
    },
  },
  components: {
    ListComp,
  },
  directives: {
    Clickoutside,
  },
  data() {
    return {
      visible: false,
      activeIds: [],
      cascaderList: [],
      popWrap: null,
      initialLeft: 0,
    };
  },
  computed: {
    localList() {
      return this.withEmpty ? [{ [this.defaultProps.ID]: '', [this.defaultProps.Name]: '不限' }, ...this.list] : this.list;
    },
    label() {
      let curList = this.localList;
      return this.value.reduce((arr, id) => {
        const t = curList.find(it => it[this.defaultProps.ID] === id);
        if (t) {
          arr.push(t[this.defaultProps.Name]);
        }
        curList = t ? t[this.defaultProps.children] || [] : [];
        return arr;
      }, []);
    },
  },
  methods: {
    close() {
      this.visible = false;
    },
    open() {
      this.visible = true;
      this.setInitState();
    },
    getInitialLeft() {
      const oBtn = document.querySelector('.mp-common-comps-ep-cascader-comp-wrap .btn');
      if (!oBtn) return;
      const result = oBtn.getBoundingClientRect();
      if (result) {
        this.initialLeft = result.left;
      }
    },
    async handleLeftChange() { // 处理左右位置的变化
      if (!this.popWrap) {
        this.popWrap = document.querySelector('.mp-common-comps-ep-cascader-comp-popper-wrap');
      }
      if (!this.popWrap) return;
      await this.$nextTick();
      if (!this.initialLeft) {
        this.getInitialLeft();
      }
      if (!this.initialLeft) return;
      const totalWidth = this.popWrap.offsetWidth + this.initialLeft;
      const maxDisplayWidth = window.innerWidth;
      let dis = this.initialLeft;
      if (totalWidth > maxDisplayWidth) {
        dis = this.initialLeft - (totalWidth - maxDisplayWidth) - 10;
        if (dis < 0) dis = 0;
      }
      this.popWrap.style.left = `${dis}px`;
    },
    setInitState() { // 设置初始状态
      if (this.visible) {
        this.cascaderList = [{ list: this.localList, key: Math.random().toString(16).slice(-10) }];
        if (this.value.length > 0) {
          this.activeIds = [...this.value];
          this.value.forEach(id => {
            const t = this.cascaderList[this.cascaderList.length - 1].list.find(_it => _it[this.defaultProps.ID] === id);
            if (t && t[this.defaultProps.children]) {
              const list = t[this.defaultProps.children];
              if (list.length > 0) {
                this.cascaderList.push({ list: t[this.defaultProps.children], key: Math.random().toString(16).slice(-10) });
              }
            }
          });
          // 此处处理left值的变化
          this.handleLeftChange();
        }
      }
    },
    onItemHover(index, it) {
      if (this.activeIds[index] === it[this.defaultProps.ID]) {
        this.activeIds = [...this.activeIds.slice(0, index), it[this.defaultProps.ID]];
        return;
      }
      this.activeIds = [...this.activeIds.slice(0, index), it[this.defaultProps.ID]];
      this.cascaderList.splice(index + 1);
      const t = this.cascaderList[this.cascaderList.length - 1].list.find(_it => _it[this.defaultProps.ID] === it[this.defaultProps.ID]);
      if (t && t[this.defaultProps.children]) {
        const list = t[this.defaultProps.children];
        if (list.length > 0) {
          this.cascaderList.push({ list: t[this.defaultProps.children], key: Math.random().toString(16).slice(-10) });
        }
        // 此处处理left值的变化
        this.handleLeftChange();
      } else if (it[this.defaultProps.ID] === '' && this.withEmpty) {
        this.handleLeftChange();
      }
    },
    onItemClick() {
      let _val = [...this.activeIds];
      if (_val.length === 1 && _val[0] === '') _val = [];
      if (JSON.stringify(_val) === JSON.stringify(this.value)) {
        this.close();
        return;
      }
      this.$emit('input', _val);
      this.$emit('change', _val);
      this.close();
      this.$nextTick(() => {
        window.dispatchEvent(new Event('resize'));
      });
    },
    handleResizeEventBind() {
      window.addEventListener('resize', this.onresize);
    },
    handleResizeEventRemove() {
      window.removeEventListener('resize', this.onresize);
    },
  },
  watch: {
    list() {
      this.setInitState();
    },
  },
  mounted() {
    this.onresize = debounce(this.getInitialLeft, 50);
    this.handleResizeEventBind();
  },
  beforeDestroy() {
    this.handleResizeEventRemove();
  },
  activated() {
    this.handleResizeEventBind();
  },
  deactivated() {
    this.handleResizeEventRemove();
  },

};
</script>
<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-common-comps-ep-cascader-comp-wrap {
  white-space: nowrap;
  display: inline-block;
  > .title {
    text-align: right;
    color: #444;
    font-size: 14px;
    font-weight: 700;
    min-width: 5em;
    display: inline-block;
    margin-right: 10px;
  }
  .btn {
    font-size: 13px;
    color: #444;
    min-width: 114px;
    text-align: left;
    border-radius: 4px;
    position: relative;
    box-sizing: border-box;
    line-height: 26px;
    padding: 0 26px 0 13px;
    transition: border-color 0.5s !important;
    height: 30px;
    background: #fff;
    &::after {
      content: "";
      position: absolute;
      background: url('../images/arrowbottom.png') no-repeat center;
      background-size: 100% 100%;
      height: 9px;
      width: 11px;
      right: 10px;
      top: 11px;
      background: none;
      border: 5px solid #eee;
      width: 0;
      height: 0;
      border-top-width: 6px;
      border-bottom-width: 0px;
      border-color: rgba($color: #000000, $alpha: 0);
      border-top-color: rgba($color: #000000, $alpha: 0.3);
      border-radius: 2px;
    }
    &:hover {
      border-color: #aaa;
      background: #fff;
    }
    &.active {
      border-color: $--color-primary;
    }
    > span {
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      display: inline-block;
      vertical-align: middle;
    }
  }
  &.show-line {
    .btn {
      height: auto;
      height: unset;
      border-left: none;
      border-right: none;
      border-top: none;
      border-radius: 0;
      line-height: 22px;
      padding: 0 7px 0 5px;
      padding-right: 19px;
      &::after {
        top: 7px;
        right: 4px;
      }
    }
  }
}
.mp-common-comps-ep-cascader-comp-popper-wrap {
  padding: 0;
  border: 1px solid #e4e7ed;
  .display-content {
    font-size: 14px;
    white-space: nowrap;
    .el-scrollbar {
      display: inline-block;
      vertical-align: top;
      border-right: 1px solid #e4e7ed;
      &:last-of-type {
        border-right: none;
      }
      .el-scrollbar__wrap {
        min-height: 204px;
        max-height: 260px;
        .el-scrollbar__view > ul {
          padding: 6px 0;
          > li {
            padding-left: 20px;
            padding-right: 30px;
            position: relative;
            height: 34px;
            > span.label {
              display: inline-block;
              padding: 5px 10px;
              line-height: 24px;
              min-width: 129px;
              box-sizing: border-box;
              overflow: hidden;
              white-space: nowrap;
            }
            > i.el-icon-arrow-right {
              position: absolute;
              right: 10px;
              top: 10px;
            }
            > i.el-icon-check {
              position: absolute;
              left: 10px;
              top: 10px;
            }
            &.selected {
              color: darken($color: $--color-primary, $amount: 10);
            }
            &.active, &:hover {
              color: $--color-primary;
              > span.label {
                font-weight: 700;
              }
            }
            &:hover {
              cursor: pointer;
              background-color: lighten($color: $--color-primary, $amount: 40);
            }
          }
        }
      }
    }
    > .empty {
      color: #989898;
      font-size: 13px;
      padding: 10px 15px;
      min-width: 129px;
    }
  }
}
</style>
