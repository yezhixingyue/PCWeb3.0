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
  },
  components: {
    CanFreeCreateSelectComp,
    CustomizeSizeGroupComp,
  },
  data() {
    return {
      sizeValID: '', // AllowCustomerCustomize 允许客户自定义
      mode: this.Property.IsCheckedCustomerCustomize, // 也需要存放在仓库中
      customizeList: [],
    };
  },
  computed: {
    ...mapState('Quotation', ['isOrderRestore']),
    CustomerSizeList() {
      return this.Property?.SizeList?.filter(it => !it.HiddenToCustomer) || [];
    },
  },
  mounted() {
    if (!this.isOrderRestore) {
      // 非还原  执行数据初始化
      if (this.CustomerSizeList.length > 0) {
        this.sizeValID = this.CustomerSizeList[0].ID;
      }
    }
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
