<template>
  <ul v-if="CraftData" class="mp-place-order-panel-comp-craft-type-list-comp-wrap">
    <CraftItemComp v-for="it in localCraftList" :key="it.ID" :Craft='it' :value='getCraftValue(it)' @change='onCraftItemChange($event, it)' />
  </ul>
</template>

<script>
import CraftItemComp from './CraftItemComp.vue';

export default {
  props: {
    CraftData: {
      type: Object,
      default: null,
    },
    CraftList: {
      type: Array,
      default: () => [],
    },
    CraftConditionList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CraftItemComp,
  },
  computed: {
    localCraftList() {
      if (!this.CraftData || !Array.isArray(this.CraftData.List) || this.CraftList.length === 0) return [];
      return this.CraftList.filter(it => this.CraftData.List.includes(it.ID) && !it.HiddenToCustomer);
    },
  },
  data() {
    return {
      selectedCraftList: [],
    };
  },
  methods: {
    getCraftValue(itemData) {
      return this.selectedCraftList.find(it => it.CraftID === itemData.ID) || null;
    },
    onCraftItemChange(e, item) {
      const temp = this.selectedCraftList.filter(it => it.CraftID !== item.ID);
      if (e) temp.push(e);
      this.selectedCraftList = temp;
    },
  },
};
</script>
<style lang='scss'>
.mp-place-order-panel-comp-craft-type-list-comp-wrap {
  margin-bottom: -15px;
  padding-left: 5px;
}
</style>
