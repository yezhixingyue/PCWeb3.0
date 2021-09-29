<template>
  <section class="mp-place-order-panel-element-group-setup-comp-wrap">
    <div v-show="List.length === 0 || showTop">
      <span class="blue-span" v-show="List.length === 0 && !hideCtrl" @click="onAddClick" :class="{disabled:disabled}"
        >+ 添加</span
      >
    </div>
    <ul :class="{'y-display': !IsHorizontalDisplay, hideCtrl: hideCtrl}">
      <li
        v-for="(item, index) in List"
        :key="item.key"
        :class="{ f: index === 0 }"
      >
        <div>
          <ElementTypeComp
            v-for="(it) in Property.ElementList"
            :key="it.ID"
            :needInit="needInit"
            :Property="it"
            :value="getItemValue(index, it)"
            :isDisabled='disabled'
            @input="onItemValueChange(index, it, $event)"
            @interaction="onTriggerInteractionClick"
            :AffectedPropList='getChildUseAffectedPropList(it, index)'
            :class="{canError: errorElementID === it.ID && (index === errorIndex || errorIndex === 'all')}"
          />
          <ul class="ctrl" :class="{fillWidth:fillWidth}" v-if="!hideCtrl" v-show="!disabled">
            <li class="f" >
              <div @click="onDelClick(index)" v-show="List.length > minLength">
                <i class="iconfont icon-shanchu is-pink"></i>
                <span>删除</span>
              </div>
            </li>
            <li v-show="fillWidth || (index === List.length - 1 && List.length < maxLength)">
              <span
                class="blue-span"
                @click="onAddClick"
                v-show="index === List.length - 1 && List.length < maxLength"
                >+ 添加</span
              >
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
import QuotationClassType from '@/store/Quotation/QuotationClassType';
import { getCombineAffectedPropList } from '@/store/Quotation/EffectiveControlList';
import ElementTypeComp from './ElementTypeComp';

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
    needInit: { // 弃用 不再需要从组件这里初始化部分数据
      type: Boolean,
      default: true,
    },
    fillWidth: {
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
    AffectedPropList: { // 受到交互影响的元素组列表
      type: Array,
      default: () => [],
    },
    subGroupAffectedPropList: { // 受到子交互影响的元素组列表
      type: Array,
      default: () => [],
    },
  },
  components: {
    ElementTypeComp,
  },
  computed: {
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
  },
  data() {
    return {
      // List: [],
      disabled: false,
    };
  },
  methods: {
    onAddClick() {
      if (this.disabled) return;
      const temp = QuotationClassType.getGroupItemSubmitData(this.Property, true);
      this.List = [...this.List, temp];
      this.$emit('changeValidate');
      this.onTriggerInteractionClick();
    },
    onDelClick(index) {
      this.List = this.List.filter((it, i) => i !== index);
      this.$emit('changeValidate');
      this.onTriggerInteractionClick();
    },
    onItemValueChange(lv1Index, it, value) {
      const temp = JSON.parse(JSON.stringify(this.value));
      const t = temp[lv1Index].List.find(_it => _it.ElementID === it.ID);
      if (t) t.CustomerInputValues = value;
      this.List = temp;
    },
    getItemValue(index, it) {
      const t = this.List[index].List.find(_it => _it.ElementID === it.ID);
      return t ? t.CustomerInputValues : {};
    },
    getChildUseAffectedPropList(it, index) {
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
          margin-left: 25px;
          &.fillWidth {
            width: 120px;
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
                top: -1px;
              }
              &:hover {
                > span {
                  color: #585858;
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
            width: 4em;
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
              width: 88px !important;
              padding-right: 12px;
              white-space: nowrap;
            }
            &:last-of-type {
              margin-bottom: 0;
            }
          }
          > ul.ctrl {
            position: absolute;
            right: 0;
            bottom: -2px;
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
  }
}
</style>
