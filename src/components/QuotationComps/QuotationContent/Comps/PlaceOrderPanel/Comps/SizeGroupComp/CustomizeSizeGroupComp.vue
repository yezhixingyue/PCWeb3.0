<template>
  <ul class="mp-place-order-panel-size-group-customise-comp-containner">
    <li
      v-for="(it, i) in ElementList"
      :key="it.ID"
      :class="{ active: i === activeIndex || ElementValueActiveList[i] }"
      ref="oLis"
    >
      <span
        @click="onLabelClick(i)"
        class="label"
        :class="{ fixed: it.Type === 1, n: it.Type === 2 && i > 0 }"
        >{{ it.Name }}<i v-if="it.Type === 2">：</i></span
      >
      <ElementTypeComp :class="{canError: errorElementID === it.ID}" :isDisabled='isDisabled' @interaction="handleInteraction"
       @focus="onFocus(i)" @blur="onBlur" isNumberic :Property='it'  :value="ElementValues[i]" @input="onInput($event, it)" hiddenLabel />
      <i v-if="i < ElementList.length - 1">×</i>
    </li>
  </ul>
</template>

<script>
import ElementTypeComp from '@/components/QuotationComps/QuotationContent/Comps/PlaceOrderPanel/Comps/ElementTypeComp';
// import CanFreeCreateSelectComp from '../ElementDisplayTypeComps/CanFreeCreateSelectComp.vue';

export default {
  props: {
    ElementList: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Array,
      default: () => [],
    },
    errorElementID: {
      type: String,
      default: '',
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    // CanFreeCreateSelectComp,
    ElementTypeComp,
  },
  data() {
    return {
      activeIndex: '',
    };
  },
  computed: {
    isSameUnit() {
      // 是否单位全部相同
      const units = this.ElementList.map((it) => it.Unit);
      const list = [];
      units.forEach((it) => {
        if (!list.includes(it)) list.push(it);
      });
      return list.length === 1;
    },
    ElementValues() {
      return this.ElementList.map((it) => this.getValue(it));
    },
    ElementValueActiveList() {
      return this.ElementValues.map(it => this.getIsActive(it));
    },
  },
  methods: {
    onFocus(index) {
      this.activeIndex = index;
    },
    onBlur() {
      this.activeIndex = '';
    },
    handleInteraction() {
      this.$emit('triggerInteraction');
    },
    getValue(it) {
      const t = this.value.find((_it) => _it.ElementID === it.ID);
      // if (t) {
      //   if (it.Type === 1) return t.CustomerInputValues[0]?.Value || '';
      //   if (it.Type === 2) return t.CustomerInputValues[0]?.Name || t.CustomerInputValues[0]?.ID || '';
      // }
      return t?.CustomerInputValues || [];
    },
    onInput(e, item) {
      const temp = JSON.parse(JSON.stringify(this.value));
      const t = temp.find((it) => it.ElementID === item.ID);
      if (t) {
        t.CustomerInputValues = e;
      } else {
        temp.push({ ElementID: item.ID, CustomerInputValues: e });
      }
      this.$emit('input', temp);
    },
    onLabelClick(i) {
      const t = this.ElementList[i];
      if (t.Type !== 1) return;
      this.$refs.oLis[i].getElementsByTagName('input')[0].focus();
    },
    getIsActive(list) {
      if (!list || list.length === 0) return false;
      const [{ Name, ID, Value }] = list;
      return Name || ID || Value;
    },
  },
};
</script>
<style lang='scss'>
.mp-place-order-panel-size-group-customise-comp-containner {
  display: inline-block;
  margin-right: 20px;
  height: 30px;
  > li {
    display: inline-block;
    position: relative;
    .mp-erp-number-type-element-option-display-input-comp,
    .mp-erp-number-type-element-display-input-comp {
      input {
        width: 80px !important;
        border: none;
        border-bottom: 1px solid rgb(229, 229, 229);
        border-radius: 0;
        padding-left: 10px !important;
        padding-right: 4px !important;
        &:focus {
          border-color: #428dfa;
        }
      }
    }
    > .label {
      font-size: 14px;
      color: #888;
      &.fixed {
        height: 14px;
        line-height: 14px;
        top: 8px;
        transition: 0.25s;
        position: absolute;
        left: 12px;
        z-index: 9;
      }
      &.n {
        margin-left: 5px;
      }
    }
    > .unit {
      color: #888;
      margin-right: 6px;
      font-size: 12px;
    }
    > i {
      margin: 0 12px;
      color: #585858;
    }
    &.active {
      > .fixed {
        left: -3px;
        top: -5px;
        font-size: 12px;
      }
    }
  }
}
</style>
