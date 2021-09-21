<template>
  <section class="mp-place-order-panel-form-item-size-group-comp-wrap">
    <CanFreeCreateSelectComp
      v-show="
        !isCustomize &&
        (CustomerSizeList.length > 0 || !Property.AllowCustomer)
      "
      v-model="ID"
      :options="CustomerSizeList"
      :isDisabled='isDisabled'
      :DisabledOptionList='DisabledOptionList'
      @blur="onTriggerInteractionClick"
    />
    <CustomizeSizeGroupComp
      v-show="isCustomize"
      v-model="List"
      class="customize"
      :isDisabled='isDisabled'
      :ElementList="Property.GroupInfo.ElementList"
      :errorElementID="errorElementID"
      @triggerInteraction='onTriggerInteractionClick'
    />
    <el-checkbox
      v-model="isCustomize"
      v-if="
        Property.AllowCustomer &&
        Property.SizeList.length > 0
      "
      >自定义</el-checkbox
    >
  </section>
</template>

<script>
import { mapState } from 'vuex';
import InterAction from '@/store/Quotation/Interaction';
import CanFreeCreateSelectComp from '../ElementDisplayTypeComps/CanFreeCreateSelectComp.vue';
import CustomizeSizeGroupComp from './CustomizeSizeGroupComp.vue';

export default {
  props: {
    Property: {
      type: Object,
      required: true,
    },
    value: {
      type: Object,
      default: () => ({}),
    },
    errorElementID: {
      type: String,
      default: '',
    },
    AffectedPropList: {
      // 受到交互影响的尺寸属性列表
      type: Array,
      default: () => [],
    },
  },
  components: {
    CanFreeCreateSelectComp,
    CustomizeSizeGroupComp,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState('Quotation', ['isOrderRestore']),
    DisabledOptionList() { // 禁用的选项
      return InterAction.getDisabledOptionList(this.AffectedPropList);
    },
    HiddenOptionList() { // 隐藏的选项
      return InterAction.getHiddenedOptionList(this.AffectedPropList);
    },
    CustomerSizeList() {
      return (
        this.Property?.SizeList?.filter((it) => !it.HiddenToCustomer && !this.HiddenOptionList.includes(it.ID)) || []
      );
    },
    isCustomize: {
      get() {
        return this.value.isCustomize;
      },
      set(isCustomize) {
        this.$emit('input', { ...this.value, isCustomize });
        this.onTriggerInteractionClick();
      },
    },
    ID: {
      get() {
        return this.value.ID;
      },
      set(ID) {
        this.$emit('input', { ...this.value, ID });
      },
    },
    List: {
      get() {
        return this.value.List;
      },
      set(List) {
        this.$emit('input', { ...this.value, List });
      },
    },
    isDisabled() {
      if (Array.isArray(this.AffectedPropList) && this.AffectedPropList.length > 0) {
        return InterAction.getDisabledOrNot(this.AffectedPropList);
      }
      return false;
    },
  },
  methods: {
    onTriggerInteractionClick(e) {
      this.$nextTick(() => {
        this.$emit('triggerInteraction', e);
      });
    },
    handleInterAction(list) {
      if (!Array.isArray(list) || list.length === 0) return;
      if (list.includes(this.value.ID)) { // 常规尺寸无默认值
        this.$emit('input', { ...this.value, ID: '' });
      }
    },
  },
  watch: {
    DisabledOptionList: {
      handler(val) {
        this.handleInterAction(val);
      },
      immediate: true,
    },
    HiddenOptionList: {
      handler(val) {
        this.handleInterAction(val);
      },
      immediate: true,
    },
  },
  mounted() {
    // if (!this.isOrderRestore) { // 弃用
    //   // 非还原  执行数据初始化
    //   if (this.CustomerSizeList.length > 0) {
    //     this.ID = this.CustomerSizeList[0].ID;
    //   }
    // }
  },
};
</script>
<style lang='scss'>
.mp-place-order-panel-form-item-size-group-comp-wrap {
  > ul.customize {
    display: inline-block;
    > li {
      display: inline-block;
    }
  }
}
</style>
