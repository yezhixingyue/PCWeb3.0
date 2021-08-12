<!--
 * @Describe: 尺寸组
 * @FilePath: /src/components/QuotationComps/ProductQuotationContentComps/NewPcComps/SizeGroupComp.vue
-->

<template>
  <section
    class="mp-duotation-content-comps-count-wrap"
    v-show="isShowComp"
    v-if="SizeGroup && SizeGroup.PropertyList.length > 0"
  >
    <!-- <section-comp-header :title="SizeGroup.GroupName" :remark="remark" /> -->
    <span class="title gray">{{ SizeGroup.GroupName }}：</span>
    <div class="count-content">
      <drop-down-selector
        v-if="!isSelectedInp && SizePropertyList.length > 0"
        :option="SizeList"
        :disabled="disabled"
        v-model="inpValue"
        :style="`width: ${selectInpTextLen}px`"
        :defaultProps="{ text: 'SizeName', value: 'SizeID' }"
      />
      <ul class="size-inp-wrap" v-if="AllowCustomSize && !(!isSelectedInp && SizePropertyList.length > 0)">
        <template v-for="(it, i) in SizeGroup.PropertyList">
          <size-group-single-input-comp
            :key="it.PropertyID"
            :index="i"
            :sizeData="it"
            :sizeInputValueList="sizeInputValueList"
            @change="handleInputChange"
            :maxLen="SizeGroup.PropertyList.length - 1"
          />
          <li
            class="symbol-box"
            :key="it.PropertyID + i"
            v-if="i !== SizeGroup.PropertyList.length - 1"
          >
            ×
          </li>
        </template>
        <!-- <li class="gray">{{ remark[2] }}</li> -->
        <li class="gray" v-if="remark && remark.length > 0">{{ remark[remark.length - 1] }}</li>
      </ul>
    </div>
    <HelpTipsComp :title="partTitle + '' + SizeGroup.GroupName" :tipsData='tipsData' />
    <check-box-single
      v-show="showCheckBox && SizeList.length > 0 && AllowCustomSize"
      :default="CheckedCustomSize || SizeList.length === 0 || isSelectedInp"
      @change="handleCheckChange"
    /><!-- 此处change事件改变时需要清除inpVal值为空，后面添加 -->
  </section>
</template>

<script>
import CheckBoxSingle from '@/components/QuotationComps/SMComps/CheckBoxSingle.vue';
import DropDownSelector from '@/components/QuotationComps/SMComps/DropDownSelector.vue';
import { getRelevanceInTargetValue } from '@/store/Quotation/QuotationClassType';
import { mapState } from 'vuex';
import tipEnums from '@/assets/js/utils/tipEnums';
import HelpTipsComp from '@/components/QuotationComps/PlaceOrderComps/HelpTipsComp.vue';

import SizeGroupSingleInputComp from './SizeGroupSingleInputComp.vue';

export default {
  components: {
    CheckBoxSingle,
    HelpTipsComp,
    // BaseNumInput,
    DropDownSelector,
    // SectionCompHeader,
    SizeGroupSingleInputComp,
  },
  model: {
    prop: 'value',
    event: 'changeFunc',
  },
  props: {
    /**
     * 复选框默认状态属性,及 默认要展示哪个组件
     */
    CheckedCustomSize: {
      type: Boolean,
      default: false,
    },
    data: {},
    partTitle: {},
    /**
     * 该组件负责处理的值
     */
    value: {
      required: true,
    },
    // /**
    //  * 处理方法
    //  */
    // changeFunc: {
    //   type: Function,
    //   required: true
    // },
    /**
     * 标题
     */
    title: {
      type: String,
      default: '数量',
    },
    /**
     * 备注信息
     */
    remark: {
      type: Array,
    },
    /**
     * 是否展示复选框
     */
    showCheckBox: {
      type: Boolean,
      default: true,
    },
    SizeGroup: {
      type: Object,
      default: () => ({}),
    },
    SizeList: {
      type: Array,
      default: () => [],
    },
    /**
     * 已选择的值列表
     */
    SizePropertyList: {
      type: Array,
      default: () => [],
    },
    disabled: {},
    AllowCustomSize: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isSelectedInp: false,
      sizeInputValueList: [],
      curSelectedSize: '',
      initSizePropertyListLen: 0,
    };
  },
  computed: {
    ...mapState('Quotation', ['obj2GetProductPrice']),
    inpValue: {
      get() {
        return this.value;
      },
      set(newVal) {
        const _target = this.SizeList.find(it => it.SizeID === newVal);
        if (!_target) return;
        const _list = _target.ValueList.map(it => ({
          PropertyID: it.First,
          CustomerInputValue: it.Second,
        }));
        this.$emit('changeFunc', [newVal, _list]);
      },
    },
    selectInpTextLen() {
      if (!this.value) return 155;
      let len = 155;
      const t = this.SizeList.find(it => it.SizeID === this.value);
      if (t) {
        len = t.SizeName.length * 14;
        if (t.SizeName.length <= 5) len += 30;
        else if (t.SizeName.length < 13) len += 22;
        // else len += 6;
      }
      return len < 155 ? 155 : len;
    },
    tipsData() {
      if (!this.obj2GetProductPrice
       || !this.obj2GetProductPrice.ProductParams || !this.obj2GetProductPrice.ProductParams.TipsDetail) return null;
      const { BaseTips } = this.obj2GetProductPrice.ProductParams.TipsDetail;
      if (!BaseTips || BaseTips.length === 0 || !this.data) return null;
      const _arr = BaseTips.filter(it => it.Type === tipEnums.Size);
      if (_arr.length === 0) return null;
      const { PartID } = this.data;
      if (!PartID) return null;
      const t = _arr.find(it => it.Part.ID === PartID);
      if (!t) return null;
      return t;
    },
    watchTarget() {
      const _arr = [];
      this.SizeGroup.PropertyList.forEach(it => {
        if (!it.RelevanceInformation) return;
        const _t = getRelevanceInTargetValue(
          this.obj2GetProductPrice.ProductParams,
          it.RelevanceInformation,
        );
        if (_t.length === 0) return;
        const obj = {};
        obj.PropertyID = it.PropertyID;
        obj.value = _t;

        _arr.push(obj);
      });
      return _arr.length === 0 ? null : _arr;
    },
    isShowComp() {
      if (
        !this.watchTarget
        || this.watchTarget.length !== this.SizeGroup.PropertyList.length
      ) {
        return true;
      }
      // 一个watchTarget中的项代表了一个需要等同于另外一个部件中的尺寸属性，如果其长度等于该尺寸组中的总数量，说明其每个尺寸属性都受控于外部某一个属性，此时该组件可隐藏,当返回false
      return false;
    },
  },
  methods: {
    handleInputChange([data, index]) {
      this.sizeInputValueList[index] = data;
      this.$emit('changeFunc', ['', [...this.sizeInputValueList]]);
    },
    handleCheckChange(e) {
      this.isSelectedInp = e;
      // ----------------------------------;
      if (this.SizeList.length === 0) {
        return;
      }
      if (e) {
        this.curSelectedSize = this.inpValue;
        const _t = this.SizeList.find(it => it.SizeID === this.inpValue);
        if (_t) {
          this.sizeInputValueList = _t.ValueList.map(it => ({
            CustomerInputValue: '',
            PropertyID: it.First,
          }));
          this.$emit('changeFunc', ['', [...this.sizeInputValueList]]);
        }
      } else {
        let _target = this.SizeList[0];
        if (this.curSelectedSize) {
          _target = this.SizeList.find(
            it => it.SizeID === this.curSelectedSize,
          );
        }
        const _list = _target.ValueList.map(it => ({
          PropertyID: it.First,
          CustomerInputValue: it.Second,
        }));
        this.$emit('changeFunc', [_target.SizeID, _list]);
      }
    },
    init() {
      this.initSizePropertyListLen = this.SizePropertyList.length;
      if (this.SizePropertyList.length > 0 || this.CheckedCustomSize) {
        if (this.SizePropertyList.length > 0) this.sizeInputValueList = this.SizePropertyList;
        if (this.value === '') this.isSelectedInp = true;
      } else {
        if (this.SizeList.length === 0) {
          this.isSelectedInp = true;
          return;
        }
        const _target = this.SizeList[0];
        const _list = _target.ValueList.map(it => ({
          PropertyID: it.First,
          CustomerInputValue: it.Second,
        }));
        this.$emit('changeFunc', [_target.SizeID, _list]);
        this.sizeInputValueList = _list;
      }
    },
  },
  watch: {
    watchTarget: {
      handler(newVal) {
        this.$nextTick(() => {
          if (!newVal || newVal.length === 0) return;
          const _list = [];
          newVal.forEach(it => {
            const itemData = {
              CustomerInputValue: it.value[0].val,
              PropertyID: it.PropertyID,
            };
            _list.push(itemData);
          });
          const arr = [..._list];
          this.$emit('changeFunc', ['', arr]);
          this.sizeInputValueList = arr;
        });
      },
      immediate: true,
    },
    // SizePropertyList: {
    //   handler(newVal) {
    //     this.sizeInputValueList = newVal;
    //   },
    //   immediate: true
    // }
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss">
.mp-duotation-content-comps-count-wrap {
  height: 30px;
  width: 100%;
  .count-content {
    display: inline-block;
    input {
      // min-width: 140px;
      width: calc(100%  - 15px) !important;
      // width: unset !important;
    }
    .size-box input{
        width: 90px !important;
        min-width: 80px;
        border: none;
        border-bottom: 1px solid #eee;
        border-radius: 0;
        &:focus {
          border-color: #428dfa;
        }
        transition: 0.32s;
      }
    > .size-inp-wrap {
      > li {
        display: inline-block;
      }
    }
  }
  > label {
    margin-left: 30px;
  }
}
</style>
