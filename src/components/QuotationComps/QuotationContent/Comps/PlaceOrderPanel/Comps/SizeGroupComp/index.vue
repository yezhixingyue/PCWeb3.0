<template>
  <section class="mp-place-order-panel-form-item-size-group-comp-wrap">
    <CanFreeCreateSelectComp
      v-show="
        !isCustomize &&
        (CustomerSizeList.length > 0 || !Property.AllowCustomerCustomize)
      "
      v-model="ID"
      :options="CustomerSizeList"
    />
    <CustomizeSizeGroupComp
      v-show="isCustomize"
      v-model="List"
      class="customize"
      :ElementList="Property.GroupInfo.ElementList"
      :errorElementID="errorElementID"
    />
    <el-checkbox
      v-model="isCustomize"
      v-if="
        Property.AllowCustomerCustomize &&
        Property.SizeList.length > 0
      "
      >自定义</el-checkbox
    >
  </section>
</template>

<script>
import { mapState } from 'vuex';
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
    CustomerSizeList() {
      return (
        this.Property?.SizeList?.filter((it) => !it.HiddenToCustomer) || []
      );
    },
    isCustomize: {
      get() {
        return this.value.isCustomize;
      },
      set(isCustomize) {
        this.$emit('input', { ...this.value, isCustomize });
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
