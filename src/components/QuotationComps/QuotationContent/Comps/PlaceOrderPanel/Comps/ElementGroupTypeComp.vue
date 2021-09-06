<template>
  <section class="mp-place-order-panel-element-group-setup-comp-wrap">
    <div v-show="List.length === 0 || showTop">
      <span class="blue-span" v-show="List.length === 0" @click="onAddClick" :class="{disabled:disabled}"
        >+ 添加</span
      >
    </div>
    <ul>
      <li
        v-for="(item, index) in List"
        :key="item.key"
        :class="{ f: index === 0 }"
      >
        <ElementTypeComp
          v-for="(it) in Property.ElementList"
          :key="it.ID"
          :needInit="needInit"
          :Property="it"
          :value="getItemValue(index, it)"
          :isDisabled='disabled'
          @input="onItemValueChange(index, it, $event)"
          :AffectedPropList='getChildUseAffectedPropList(it)'
          :class="{canError: errorElementID === it.ID && (index === errorIndex || errorIndex === 'all')}"
        />
        <ul class="ctrl" :class="{fillWidth:fillWidth}" v-if="!(List.length === minLength && List.length === maxLength)" v-show="!disabled">
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
      </li>
    </ul>
  </section>
</template>

<script>
import QuotationClassType from '@/store/Quotation/QuotationClassType';
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
    AffectedPropList: { // 受到交互影响的工艺列表
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
      if (this.disabled || this.AffectedPropList.length === 0) return [];
      return this.AffectedPropList.filter((it) => it.Property && it.Property.Element && it.Property.Group);
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
    },
    onDelClick(index) {
      this.List = this.List.filter((it, i) => i !== index);
      this.$emit('changeValidate');
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
    getChildUseAffectedPropList(it) {
      return this.ChildUseAffectedPropList.filter((_it) => _it.Property && _it.Property.Element.ID === it.ID);
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
      margin-top: 10px;
      &.f {
        margin-top: 0;
      }
    }
  }
  > div {
    margin-left: 6px;
  }
}
</style>
