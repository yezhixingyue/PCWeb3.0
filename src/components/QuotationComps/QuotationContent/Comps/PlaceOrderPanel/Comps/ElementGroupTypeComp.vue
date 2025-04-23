<template>
  <section class="mp-place-order-panel-element-group-setup-comp-wrap">
    <div v-show="minLength !== maxLength || showTop">
      <span class="blue-span is-font-13" v-show="!hideCtrl" @click="onAddClick" :class="{disabled:List.length >= maxLength || disabled}">
        <!-- <template v-if="List.length >= maxLength">已达次数上限</template>
        <template v-else>+ 添加{{Property.Name || ''}}</template> -->
        <template>+ 添加{{Property.Name || ''}}</template>
      </span>
    </div>
    <ul :class="{'y-display': !IsHorizontalDisplay, hideCtrl: hideCtrl}" ref="groupContent">
      <li
        v-for="(item, index) in List"
        :key="item.key"
        :class="{ f: index === 0 }"
      >
        <div>
          <ElementTypeComp
            v-for="(it) in Property.ElementList"
            :key="it.ID + item.key"
            :Property="it"
            :value="getItemValue(index, it)"
            :isDisabled='disabled'
            :CtrlZIndex='CtrlZIndex'
            :PropTipsDataList='PropTipsDataList'
            @input="onItemValueChange(index, it, $event)"
            @interaction="onTriggerInteractionClick"
            :isError="errorElementID === it.ID && (index === errorIndex || errorIndex === 'all')"
            :AffectedPropList='getChildUseAffectedPropList(it, index)'
            :class="{canError: errorElementID === it.ID && (index === errorIndex || errorIndex === 'all')}"
          />
          <ul class="ctrl" :class="{fillWidth:fillWidth}" v-if="!hideCtrl" v-show="!disabled">
            <li class="f" >
              <div @click="onDelClick(index)" v-show="List.length > minLength || fillWidth" :class="{isDisabled: List.length <= minLength}">
                <i class="iconfont icon-shanchu is-pink"></i>
                <span>删除</span>
              </div>
            </li>
            <!-- <li v-show="fillWidth || (index === List.length - 1 && List.length < maxLength)">
              <span
                class="blue-span"
                @click="onAddClick"
                v-show="index === List.length - 1 && List.length < maxLength"
                >+ 添加</span
              >
            </li> -->
          </ul>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
import QuotationClassType from '@/store/Quotation/QuotationClassType';
import { getCombineAffectedPropList } from '@/store/Quotation/EffectiveControlList';
import { mapGetters } from 'vuex';
import ElementTypeComp from './ElementTypeComp.vue';

export default {
  props: {
    Property: {
      type: Object,
      required: true,
    },
    value: {
      type: Array,
      default: () => [],
    },
    fillWidth: {
      type: Boolean,
      default: false,
    },
    CtrlZIndex: {
      type: Boolean,
      default: false,
    },
    showTop: {
      type: Boolean,
      default: true,
    },
    errorElementID: {
      type: String,
      default: '',
    },
    errorIndex: {},
    errorMsg: {},
    AffectedPropList: { // 受到交互影响的元素组列表
      type: Array,
      default: () => [],
    },
    subGroupAffectedPropList: { // 受到子交互影响的元素组列表
      type: Array,
      default: () => [],
    },
    PropTipsDataList: { // 所在部件所有属性提示列表数据
      type: Array,
      default: () => [],
    },
    isCraftUse: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ElementTypeComp,
  },
  computed: {
    ...mapGetters('Quotation', ['affectedElementGroupIDsByInteraction']),
    maxLength() {
      if (!this.Property || !this.Property.UseTimes) return Infinity;
      const { MaxValue } = this.Property.UseTimes;
      return MaxValue || Infinity;
    },
    minLength() {
      if (!this.Property || !this.Property.UseTimes) return 1;
      const { MinValue } = this.Property.UseTimes;
      return MinValue || MinValue === 0 ? MinValue : 1;
    },
    List: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
    OwnUseAffectedPropList() {
      // 自身交互限制  可能为隐藏或者禁用 目前该数组最多只有一个
      if (this.AffectedPropList.length === 0) return [];
      return this.AffectedPropList.filter((it) => it.Property && !it.Property.Element && it.Property.Group);
    },
    ChildUseAffectedPropList() {
      if (this.List.length === 0) return null;
      return this.List.map((group, i) => {
        if (this.disabled) return [];
        if (this.AffectedPropList.length === 0 && !Array.isArray(this.subGroupAffectedPropList) && !this.subGroupAffectedPropList[i]) return [];
        const _AffectedPropList = this.AffectedPropList || [];
        const _subGroupAffectedPropList = this.subGroupAffectedPropList[i] || [];
        const combineList = getCombineAffectedPropList(_AffectedPropList, _subGroupAffectedPropList); // 合并交互与子交互
        return combineList.filter((it) => it.Property && it.Property.Element && it.Property.Group);
      });
    },
    IsHorizontalDisplay() { // 是否横轴（水平）展示
      if (this.Property) return this.Property.IsHorizontalDisplay;
      return true;
    },
    hideCtrl() {
      return this.maxLength === this.minLength;
    },
    watchError() {
      return this.errorIndex + this.errorMsg;
    },
  },
  data() {
    return {
      // List: [],
      disabled: false,
    };
  },
  methods: {
    onAddClick() {
      if (this.disabled || this.List.length >= this.maxLength) return;
      const temp = QuotationClassType.getGroupItemSubmitData(this.Property, true);
      this.List = [...this.List, temp];
      this.$emit('changeValidate');
      if (this.affectedElementGroupIDsByInteraction.includes(this.Property.ID)) {
        this.onTriggerInteractionClick();
      }
    },
    onDelClick(index) {
      if (this.List.length <= this.minLength) return;
      this.value[index].List.forEach((it, i) => {
        this.$emit('groupItemChange', [index, i, {}]);
      });
      this.$nextTick(() => {
        this.List = this.List.filter((it, i) => i !== index);
        this.$emit('changeValidate');
        if (this.affectedElementGroupIDsByInteraction.includes(this.Property.ID)) {
          this.onTriggerInteractionClick();
        }
      });
    },
    onItemValueChange(lv1Index, it, value) {
      let temp = {};
      const index = this.value[lv1Index].List.findIndex(_it => _it.ElementID === it.ID);
      if (index > -1) {
        temp = { ...this.value[lv1Index].List[index] };
        const {
          CustomerInputValues, disabledByInteraction, hiddenByInteraction, DisabledValue,
        } = value;
        temp.CustomerInputValues = CustomerInputValues;
        temp.disabledByInteraction = disabledByInteraction;
        temp.hiddenByInteraction = hiddenByInteraction;
        temp.DisabledValue = DisabledValue;
        this.$emit('groupItemChange', [lv1Index, index, temp]);
      }
    },
    getItemValue(index, it) {
      const t = this.List[index].List.find(_it => _it.ElementID === it.ID);
      return t ? t.CustomerInputValues : {};
    },
    getChildUseAffectedPropList(it, index) {
      if (!this.ChildUseAffectedPropList) return [];
      return this.ChildUseAffectedPropList[index].filter((_it) => _it.Property && _it.Property.Element.ID === it.ID);
    },
    onTriggerInteractionClick() { // 触发交互
      this.$nextTick(() => {
        this.$emit('triggerInteraction');
      });
    },
  },
  watch: {
    OwnUseAffectedPropList: {
      handler(newVal) { // 元素组自身交互 目前只考虑长度为1的情况，因为目前对一个元素组只允许设置一条交互，隐藏或者禁用 --- 元素组隐藏已在上一级进行处理
        if (newVal.length === 1) {
          const { Operator } = newVal[0]; // Operator 21 禁用    22 隐藏    23 必选
          if (Operator === 21) {
            this.disabled = true;
          } else {
            this.disabled = false;
          }
        } else {
          this.disabled = false;
        }
      },
      immediate: true,
    },
    ChildUseAffectedPropList: {
      handler(newVal, oldVal) {
        if (!this.isCraftUse
        || ((!newVal || newVal.length === 0) && (!oldVal || oldVal.length === 0))
        || JSON.stringify(newVal) === JSON.stringify(oldVal)) return;
        this.$emit('changeValidate');
      },
      immediate: true,
    },
    // watchError: {
    //   handler(val) {
    //     this.$nextTick(() => {
    //       const targetDom = this.$refs.groupContent && this.$refs.groupContent.querySelector('.canError .element-type-content');
    //       if (targetDom) {
    //         if (this.errorMsg && val !== 'all') {
    //           targetDom.dataset.contentBefore = this.errorMsg;
    //         } else {
    //           targetDom.dataset.contentBefore = '';
    //         }
    //       }
    //     });
    //   },
    //   immediate: true,
    // },
  },
};
</script>
<style lang='scss'>
.mp-place-order-panel-element-group-setup-comp-wrap {
  > ul {
    > li {
      > div {
        > .ctrl {
          display: inline-block;
          margin-left: 45px;
          &.fillWidth {
            width: 95px;
          }
          > li {
            display: inline-block;
            // width: 45px;
            > div {
              display: inline-block;
              cursor: pointer;
              > span {
                color: #aaa;
                margin-left: 9px;
                user-select: none;
                transition: color 0.1s ease-in-out;
              }
              > i {
                position: relative;
                top: 0.5px;
              }
              &:hover {
                > span {
                  color: #585858;
                }
              }
              &.isDisabled {
                pointer-events: none;
                > span, > i {
                  color: #cbcbcb !important;
                }
              }
            }
            &.f {
              > div {
                padding-right: 24px;
              }
            }
          }
        }
        .mp-place-order-content-element-type-show-item-comp-wrap {
          > label.el-title {
            // min-width: 4em;
            > i {
              font-weight: 700;
            }
          }
        }
      }
      margin-top: 10px;
      &.f {
        margin-top: 0;
      }
    }
    &.y-display {
      > li {
        > div {
          display: inline-block;
          position: relative;
          padding-right: 160px;
          > .mp-place-order-content-element-type-show-item-comp-wrap {
            display: block;
            margin-bottom: 10px;
            > label.el-title {
              // width: 88px !important;
              // padding-right: 12px;
              white-space: nowrap;
            }
            &:last-of-type {
              margin-bottom: 0;
            }
          }
          > ul.ctrl {
            position: absolute;
            right: 0;
            bottom: 12px;
            width: 120px;
          }
        }
      }
      &.hideCtrl {
        > div {
          padding-right: 0;
        }
      }
    }
  }
  > div {
    margin-left: 6px;
    > span.disabled {
      color: #aaa !important;
      cursor: not-allowed;
      pointer-events: none;
      &:hover {
        opacity: 1;
      }
    }
  }
}
.mp-place-order-panel-form-item-comp-wrap > .el-form-item__content > .mp-place-order-panel-element-group-setup-comp-wrap > ul.y-display label.el-title {
  width: 88px !important;
  padding-right: 12px;
}
</style>
