<template>
  <section class="mp-place-order-panel-form-item-size-group-comp-wrap">
    <CanFreeCreateSelectComp v-show="!mode && CustomerSizeList.length > 0" v-model="sizeValID" :options='CustomerSizeList' />
    <CustomizeSizeGroupComp v-show="mode||CustomerSizeList.length===0" v-model="customizeList" class="customize" :ElementList='Property.GroupInfo.ElementList'/>
    <el-checkbox  v-model="mode" v-if="Property.AllowCustomerCustomize && Property.GroupInfo.ElementList.length > 0">自定义</el-checkbox>
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
  },
  components: {
    CanFreeCreateSelectComp,
    CustomizeSizeGroupComp,
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapState('Quotation', ['isOrderRestore']),
    CustomerSizeList() {
      return this.Property?.SizeList?.filter(it => !it.HiddenToCustomer) || [];
    },
    mode: {
      get() {
        return this.value.isCustomize;
      },
      set(isCustomize) {
        this.$emit('input', { ...this.value, isCustomize });
      },
    },
    sizeValID: {
      get() {
        return this.value.ID;
      },
      set(ID) {
        this.$emit('input', { ...this.value, ID });
      },
    },
    customizeList: {
      get() {
        return this.value.List;
      },
      set(List) {
        this.$emit('input', { ...this.value, List });
      },
    },
  },
  mounted() {
    // if (!this.isOrderRestore) {
    //   // 非还原  执行数据初始化
    //   if (this.CustomerSizeList.length > 0) {
    //     this.sizeValID = this.CustomerSizeList[0].ID;
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
