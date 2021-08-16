<template>
  <ul class="mp-place-order-panel-size-group-customise-comp-containner">
    <li
      v-for="(it, i) in ElementList"
      :key="it.ID"
      :class="{ active: i === activeIndex || ElementValues[i] }"
      ref="oLis"
    >
      <span
        @click="onLabelClick(i)"
        class="label"
        :class="{ fixed: it.Type === 1, n: it.Type === 2 && i > 0 }"
        >{{ it.Name }}<i v-if="it.Type === 2">：</i></span
      >
      <el-input
        size="mini"
        v-if="it.Type === 1"
        @focus="onFocus(i)"
        @blur="onBlur"
        maxlength="9"
        :value="ElementValues[i]"
        @input="onInput($event, it)"
      ></el-input>
      <CanFreeCreateSelectComp
        v-if="it.Type === 2"
        :AllowCreate="it.OptionAttribute.AllowCustomer"
        :value="ElementValues[i]"
        @input="onInput($event, it)"
        :options="it.OptionAttribute.OptionList"
      />
      <!-- <ElementTypeComp :Property='it' :value="ElementValues[i]" @input="onInput($event, it)" hiddenLabel /> -->
      <span
        class="unit"
        v-if="
          it.Unit &&
          ((isSameUnit && i === ElementList.length - 1) || !isSameUnit)
        "
        >{{ it.Unit }}</span
      >
      <i v-if="i < ElementList.length - 1">×</i>
    </li>
  </ul>
</template>

<script>
// import ElementTypeComp from '@/components/QuotationComps/QuotationContent/Comps/PlaceOrderPanel/Comps/ElementTypeComp';
import CanFreeCreateSelectComp from '../ElementDisplayTypeComps/CanFreeCreateSelectComp.vue';

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
  },
  components: {
    CanFreeCreateSelectComp,
    // ElementTypeComp,
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
  },
  methods: {
    onFocus(index) {
      this.activeIndex = index;
    },
    onBlur() {
      this.activeIndex = '';
    },
    getValue(it) {
      const t = this.value.find((_it) => _it.ElementID === it.ID);
      if (t) {
        if (it.Type === 1) return t.CustomerInputValues[0].Value;
        if (it.Type === 2) return t.CustomerInputValues[0].Name || t.CustomerInputValues[0].ID;
      }
      return '';
    },
    onInput(e, item) {
      console.log(e);
      let value = e.trim();
      if (item.Type === 1) value = value.replace(/[^\d]/g, '');
      let type = '';
      if (item.Type === 1) type = 'isValue';
      if (item.Type === 2) {
        if (item.OptionAttribute?.AllowCustomer) {
          const options = item.OptionAttribute?.OptionList?.filter(
            (it) => !it.HiddenToCustomer,
          ) || [];
          const _t = options.find((it) => it.ID === e);
          if (_t) type = 'isID';
          else type = 'isName';
        } else {
          type = 'isID';
        }
      }

      const temp = JSON.parse(JSON.stringify(this.value));
      const t = temp.find((it) => it.ElementID === item.ID);
      // 可能需要赋值Value（输入框）  也可能需要赋值ID（下列选项时） 也可能赋值给Name(下列选框自定义时)  是哪种展示形式需要进行判断  需要提前判断出来
      if (t) {
        t.CustomerInputValues[0].Value = '';
        t.CustomerInputValues[0].ID = '';
        t.CustomerInputValues[0].Name = '';
        if (type === 'isValue') t.CustomerInputValues[0].Value = value;
        if (type === 'isName') t.CustomerInputValues[0].Name = value;
        if (type === 'isID') t.CustomerInputValues[0].ID = value;
      } else {
        const _obj = {
          Value: '',
          ID: '',
          Name: '',
        };
        if (type === 'isValue') _obj.Value = value;
        if (type === 'isName') _obj.Name = value;
        if (type === 'isID') _obj.ID = value;
        temp.push({ ElementID: item.ID, CustomerInputValues: [_obj] });
      }
      this.$emit('input', temp);
    },
    onLabelClick(i) {
      const t = this.ElementList[i];
      if (t.Type !== 1) return;
      this.$refs.oLis[i].getElementsByTagName('input')[0].focus();
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
    > .el-input {
      > input {
        width: 90px !important;
        border: none;
        border-bottom: 1px solid rgb(229, 229, 229);
        border-radius: 0;
        padding-left: 18px !important;
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
    }
    > i {
      margin: 0 10px;
    }
    &.active {
      > .fixed {
        left: 2px;
        top: -5px;
        font-size: 12px;
      }
    }
  }
}
</style>
