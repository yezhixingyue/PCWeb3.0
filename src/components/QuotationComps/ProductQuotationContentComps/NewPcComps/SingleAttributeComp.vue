<template>
  <section v-show="shouldShow" class="mp-pc-quotation-sm-comp-single-att-comp-wrap">
    <span class="title gray">{{title}}：</span>

    <!-- 4种表现形式 -->

    <!-- 1 单输入框 -->
    <template v-if="ValueType === 1">
      <el-input v-model.trim="inpValue" key="type-1"  @focus='onFocus' :disabled='disabled' ></el-input>
      <span v-if="ValueType === 1 && remark" class="gray remark">{{remark}}</span>
    </template>

    <!-- 2 可输入下拉框 -->
    <el-dropdown
      v-else-if="ValueType === 2 && AllowUserDefinedOption"
      trigger="click"
      @command='onCommand'
      key="type-2"
      placement='bottom'
      :disabled='disabled'
     >
      <el-input class="select-and-white-inp" v-model.trim="CustomizedValue"
       :disabled='disabled' maxlength="20" @focus='onFocus' suffix-icon="el-icon-caret-bottom">
      </el-input>
      <el-dropdown-menu slot="dropdown" class="count-model-comp-dropdown-wrap mp-scroll-wrap">
        <el-dropdown-item
          v-for="item in optionList"
          :key='item[defaultProps.value]'
          :class="`${item[defaultProps.value]}` === `${inpValue}` ? 'active' : ''"
          :command='item'
         >
         {{item[defaultProps.text]}}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <!-- 3. 不允许自定义单选框 -->
    <el-radio-group
      v-model="inpValue" key="type-3" :disabled='disabled'
      v-else-if="ValueType === 2 && !AllowUserDefinedOption && optionList.length < 4 && !isCraftUse">
      <el-radio v-for="item in optionList" :key="item[defaultProps.value]"
       :label="item[defaultProps.value]">{{item[defaultProps.text]}}</el-radio>
    </el-radio-group>

    <!-- 4. 不允许自定义下拉框 -->
    <el-select v-model="inpValue" v-else key="type-4" :disabled='disabled'>
      <el-option
        v-for="item in optionList"
        :key="item[defaultProps.value]"
        :label="item[defaultProps.text]"
        :value="item[defaultProps.value]">
      </el-option>
    </el-select>
    <HelpTipsComp :title="title" :tipsData='tipsData' />
  </section>
</template>

<script>
import { getRelevanceInTargetValue } from '@/store/Quotation/QuotationClassType';
import tipEnums from '@/assets/js/utils/tipEnums';
import HelpTipsComp from '@/components/QuotationComps/PlaceOrderComps/HelpTipsComp.vue';
import { mapState } from 'vuex';

export default {
  model: {
    prop: 'value',
    event: 'changeFunc',
  },
  components: {
    HelpTipsComp,
  },
  props: {
    ValueType: { // 属性输入类型: 只可输入、可输可选
      type: Number,
      default: 0,
    },
    PropertyID: {},
    partID: {},
    option: { // 选择项列表 ValueType值为2时有该值
      type: Array,
      default: () => [],
    },
    value: { // v-model绑定值
      required: true,
    },
    title: {
      type: String,
      default: '标题',
    },
    remark: { // 备注信息，通常用于传递单位值，如毫米、个等
      type: String,
      default: '张',
    },
    defaultProps: { // 默认属性键名
      type: Object,
      default: () => ({
        text: 'text',
        value: 'value',
      }),
    },
    /**
     * 属性关联信息
     */
    RelevanceInformation: {},
    disabled: {},
    CustomizedOptionValue: {
      default: '',
    },
    /**
     * 工艺使用，其为工艺弹窗开闭状态
     */
    watch2Dia: {
      type: Boolean,
      default: false,
    },
    AllowUserDefinedOption: { // 是否允许自定义
      type: Boolean,
      default: false,
    },
    /**
     * 是否由工艺组件调用
     */
    isCraftUse: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState('Quotation', ['obj2GetProductPrice']),
    inpValue: {
      get() {
        return this.value;
      },
      set(newVal) {
        if (!this.ValueType && this.ValueType !== 0) {
          this.$emit('changeFunc', newVal);
          return;
        }
        if (this.ValueType === 1) {
          const _val = newVal.replace(/[^\d.]/g, '');
          this.$emit('changeFunc', [_val, false]);
          return;
        }
        this.$emit('changeFunc', [newVal, false]);
      },
    },
    CustomizedValue: {
      get() {
        if (this.CustomizedOptionValue || this.inputType === 'CustomizedValue') return this.CustomizedOptionValue;
        const _t = this.optionList.find(it => it[this.defaultProps.value] === this.value);
        if (_t) return _t[this.defaultProps.text];
        return '';
      },
      set(newVal) {
        // const _val = newVal.replace(/[^\d.]/g, '');
        this.inputType = 'CustomizedValue';
        this.$emit('changeFunc', [newVal, true]);
      },
    },
    tipsData() {
      if (!this.obj2GetProductPrice || !this.PropertyID
       || !this.obj2GetProductPrice.ProductParams || !this.obj2GetProductPrice.ProductParams.TipsDetail) return null;
      const { BaseTips } = this.obj2GetProductPrice.ProductParams.TipsDetail;
      if (!BaseTips || BaseTips.length === 0) return null;
      const _arr = BaseTips.filter(it => it.Type === tipEnums.Property);
      if (_arr.length === 0) return null;
      const t = _arr.find(it => {
        const key = it.Property && it.Property.ID === this.PropertyID;
        if (!key) return false;
        return (!this.partID && !it.Part) || (it.Part && it.Part.ID === this.partID);
      });
      if (!t) return null;
      // console.log(t, BaseTips);
      return t;
    },
    watchTarget() {
      if (!this.RelevanceInformation) return null;
      return getRelevanceInTargetValue(
        this.obj2GetProductPrice.ProductParams,
        this.RelevanceInformation,
      );
    },
    shouldShow() {
      if (!this.RelevanceInformation) return true;
      return (
        !(
          this.RelevanceInformation.length === 1
          && this.RelevanceInformation[0].Type === 1
          && this.RelevanceInformation[0].Compare === 1
          && this.ValueType === 1
        )
        || (this.ValueType === 2 && this.optionList.length === 1)
      );
    },
    optionList() {
      if (this.ValueType === 2 && this.RelevanceInformation) {
        const _list = [];
        this.RelevanceInformation.forEach((Relevance, i) => {
          // 属性关联结果数组  --- 取交集
          const _val = this.watchTarget[i];
          if (Relevance.MasterProperty.OptionList.includes(_val)) {
            _list.push(Relevance.RelevanceProperty.OptionList);
          }
        });
        if (_list.length > 0) {
          const _l = _list.reduce((Summary, key) => key.filter(it => Summary.includes(it)), _list[0]);
          const _resList = this.option.filter(it => _l.includes(it.OptionID));
          if (_resList.length > 0) {
            if (!_l.includes(this.inpValue)) {
              this.$emit('changeFunc', [_resList[0].OptionID, false]);
            }
          } else {
            this.$emit('changeFunc', ['', false]);
          }
          return _resList;
        }
        return this.option;
      }
      return this.option;
    },
  },
  methods: {
    onCommand(e) {
      const newVal = e[this.defaultProps.value];
      this.inputType = 'option';
      if (!this.ValueType && this.ValueType !== 0) {
        this.$emit('changeFunc', newVal);
      } else {
        // console.log(newVal, e);
        this.$emit('changeFunc', [newVal, false]);
        this.$emit('changeFunc', ['', true]);
      }
    },
    onFocus(e) {
      e.target.select();
    },
    initIsSelectedInp() {
      // eslint-disable-next-line max-len
      if (this.option.length > 0 && !this.CustomizedOptionValue) {
        this.isSelectedInp = false;
      } else if (this.ValueType === 2) {
        this.isSelectedInp = true;
        this.isCustomizedOptionValue = true;
      } else {
        this.isSelectedInp = true;
        this.isCustomizedOptionValue = false;
      }
    },
  },
  data() {
    return {
      inputType: 'option',
    };
  },
  watch: {
    watchTarget: {
      handler(newVal) {
        if (!this.shouldShow) {
          // 属性关联类型为 其值和主属性值应该保持相同  所以此时可以隐藏该属性 在主属性修改时自动对其进行修改
          if (typeof newVal[0] === 'object') {
            if (newVal[0].Compare && newVal[0].Compare === 1) {
              this.$emit('changeFunc', [newVal[0].val, false]);
            }
          } else {
            this.$emit('changeFunc', [newVal[0], false]);
          }
        }
      },
      immediate: true,
    },
    option(newVal) {
      if (!newVal) return;
      this.initIsSelectedInp();
    },
    watch2Dia() { // 作用? 关闭窗口时
      if (!this.isSelectedInp && this.inputType !== 'CustomizedValue') {
        // console.log('changeFunc', 'watch2Dia');
        this.$emit('changeFunc', [
          '',
          !this.isSelectedInp && this.ValueType === 2,
        ]);
      }
    },
  },
  created() {
    if (!this.option) return;
    this.initIsSelectedInp();
  },
};
</script>

<style lang='scss'>
.mp-pc-quotation-sm-comp-single-att-comp-wrap {
  margin-right: 30px !important;
  // margin-bottom: 8px !important;
  .select-and-white-inp {
    .el-input__suffix {
      .el-input__icon {
        line-height: 30px;
      }
    }
  }
  .el-radio {
    margin-right: 20px;
  }
}

</style>
