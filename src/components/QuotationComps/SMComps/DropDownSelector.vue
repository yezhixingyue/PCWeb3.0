<!--
 * @Describe: 报价部分 下拉选框
 * @FilePath: /src/components/QuotationComps/SMComps/DropDownSelector.vue
-->
<template>
  <el-select
    v-model="valueComp"
    placeholder=""
    :disabled="disabled"
    v-if="option.length > 0"
    popper-class="mp-phone-dropdown-select-popper-class"
    class="mp-duotation-sm-comps-drop-down-wrap"
  >
    <el-option
      v-for="(item, i) in option"
      :key="item[defaultProps.value] + '' + i"
      :label="item[defaultProps.text]"
      :value="item[defaultProps.value]"
    >
    </el-option>
  </el-select>
</template>

<script>
export default {
  model: {
    prop: 'inpValue',
    event: 'handleInput',
  },
  props: {
    inpValue: {},
    option: {
      type: Array,
      default: () => [],
    },
    defaultProps: {
      type: Object,
      default: () => ({
        text: 'text',
        value: 'value',
      }),
    },
    disabled: {},
  },
  components: {
    // MpCollapseComp
  },
  directives: {
    mpclose(el, binding) {
      if (binding.value) {
        document.addEventListener('click', binding.value, false);
      }
    },
  },
  data() {
    return {
      value: '',
      show: false,
      toUp: false,
    };
  },
  computed: {
    valueComp: {
      get() {
        if (!this.inpValue && this.inpValue !== 0) return '';
        const _target = this.option.find(it => `${it[this.defaultProps.value]}` === `${this.inpValue}`);
        if (_target) return _target[this.defaultProps.value];
        return this.inpValue;
      },
      set(newVal) {
        // alert("valueComp");
        this.$emit('handleInput', newVal); // newVal为option中对应value值
      },
    },
  },
  methods: {
    onClick(item) {
      this.valueComp = item[this.defaultProps.value];
      this.show = false;
    },
    mpClose(e) {
      if (this.show && e.target !== this.$refs.dropDom) {
        this.show = false;
      }
    },
    // 折叠动作
    onTitleClick() {
      const totalHeight = document.body.clientHeight;
      const toTopHeight = this.$refs.dropDom.getBoundingClientRect().top;
      const selfHeight = this.$refs.dropDom.offsetHeight;
      const num = totalHeight - toTopHeight - selfHeight;
      if (num <= 300 && toTopHeight >= 300) this.toUp = true;
      this.show = !this.show;
      const oWrap = document.querySelector(
        '.mp-duotation-content-comps-craft-list-wrap .van-dialog__content',
      );
      if (!this.show || !oWrap) return;
      // eslint-disable-next-line no-shadow
      this.utils.animateScroll(oWrap.scrollTop, oWrap.scrollHeight, num => {
        oWrap.scrollTop = num;
      });
    },
  },
};
</script>

<style lang="scss">
// @import "@/assets/css/Common/var.scss";
.mp-duotation-sm-comps-drop-down-wrap {
  width: 100%;
  height: 30px;
  border-radius: 5px;
  // border: 1px solid $--border-color-2;
  box-sizing: border-box;
  line-height: 30px;
  // padding: 0 8px;
  position: relative;
  font-size: 13px;
  // > .title {
  //   position: relative;
  //   height: 100%;
  //   white-space: nowrap;
  //   overflow: hidden;
  //   text-overflow: ellipsis;
  //   line-height: 30px;
  //   font-size: 13px;
  //   color: $--color-blue;
  //   &::after {
  //     content: "";
  //     width: 14px;
  //     height: 8px;
  //     position: absolute;
  //     background: url("../../../assets/images/funddown.png") no-repeat
  //       center/100% 100%;
  //     right: 3px;
  //     top: 50%;
  //     transition: 0.2s;
  //     transform: translateY(-50%);
  //   }
  //   &.active {
  //     &::after {
  //       transform: translateY(-50%) rotate(180deg);
  //     }
  //   }
  // }
  // > section {
  //   // width: 120%;
  //   > .list-content {
  //     border: 1px solid $--border-color-2;
  //     box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.2);
  //     background-color: $--color-white;
  //     z-index: 9;
  //     position: absolute;
  //     left: 0;
  //     // right: 0;
  //     border-radius: 5px;
  //     margin-top: 5px;
  //     padding: 3px 0;
  //     box-sizing: border-box;
  //     max-height: 236px;
  //     min-width: 100%;
  //     overflow-x: auto;
  //     max-width: calc(100vw - 20px);
  //     > div.lists {
  //       overflow-y: auto;
  //       max-height: 100%;
  //       width: calc(100% - 1px);
  //       > span {
  //         height: 38px;
  //         padding: 0 8px;
  //         display: flex;
  //         white-space: nowrap;
  //         align-items: center;
  //         &.active {
  //           background-color: $--bg-color;
  //           color: $--color-blue;
  //           font-weight: 700;
  //         }
  //       }
  //     }
  //     > .picker-arrow {
  //       position: absolute;
  //       top: -12px;
  //       left: 30px;
  //       width: 0;
  //       height: 0;
  //       border: 6px solid transparent;
  //       border-bottom-color: $--border-color-2;
  //     }

  //     > .picker-arrow::after {
  //       position: absolute;
  //       left: -6px;
  //       top: 1px;
  //       content: "";
  //       display: block;
  //       width: 0;
  //       height: 0;
  //       border: 6px solid transparent;
  //       border-bottom-color: #fff;
  //       border-top-width: 0;
  //     }
  //     &.toUp {
  //       bottom: calc(100% + 8px);
  //       > .picker-arrow {
  //         bottom: -12px;
  //         top: unset;
  //         transform: rotate(180deg);
  //       }
  //     }
  //   }
  // }

  // &.active {
  //   border: 1px solid $--color-blue;
  // }
  transition: border-color 0.3s;
  > div.el-input {
    height: 100%;
    > input {
      height: 100%;
      padding-left: 8px;
      line-height: 28px;
      font-size: 13px;
    }
  }
}
.el-select-dropdown__item.selected {
  background-color: rgb(245, 247, 250);
}
.el-select-dropdown {
  // transition: none;
  .el-scrollbar {
    transition: none;
    // height: 280px;
    > .el-select-dropdown__wrap {
      .el-scrollbar__view {
        > .el-select-dropdown__item {
          height: 30px;
          line-height: 33px !important;
        }
      }
    }
  }
}
.el-input.is-disabled .el-input__inner {
  opacity: 0.5;
}
.mp-phone-dropdown-select-popper-class {
  z-index: 3000 !important;
  // transition: 10s;
}
.el-zoom-in-center-enter-active,
.el-zoom-in-center-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
  // transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1),
  //   opacity 300ms cubic-bezier(0.23, 1, 0.32, 1);
}
.el-zoom-in-center-enter,
.el-zoom-in-center-leave-active {
  opacity: 0;
  transform: scaleX(0);
}

.el-zoom-in-top-enter-active,
.el-zoom-in-top-leave-active {
  opacity: 1;
  transform: scaleY(1);
  // transition: $--md-fade-transition;
  transform-origin: center top;
  // transition: none;
  // transition: transform 150ms cubic-bezier(0.23, 0.8, 0.38, 0.7),
  //   opacity 150ms cubic-bezier(0.23, 0.8, 0.38, 0.7);
  transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
}
.el-zoom-in-top-enter,
.el-zoom-in-top-leave-active {
  opacity: 0;
  transform: scaleY(0);
}
</style>
