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
    value: {},
  },
  components: {
    CraftItemComp,
  },
  computed: {
    localCraftList() {
      if (!this.CraftData || !Array.isArray(this.CraftData.List) || this.CraftList.length === 0) return [];
      return this.CraftList.filter(it => this.CraftData.List.includes(it.ID) && !it.HiddenToCustomer);
    },
    selectedCraftList: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  data() {
    return {
    };
  },
  methods: {
    getCraftValue(itemData) {
      return this.selectedCraftList.find(it => it.CraftID === itemData.ID) || null;
    },
    onCraftItemChange(e, item) {
      let temp = this.selectedCraftList.filter(it => it.CraftID !== item.ID);
      if (e) { // 也可能是编辑 也可能是添加 此时需做单选工艺处理 即判断其是否在单选工艺列表中 如果是则在添加的时候清除掉同组其它的工艺
        if (Array.isArray(this.CraftConditionList) && this.CraftConditionList.length > 0) {
          const t = this.CraftConditionList.find(it => it.List.includes(e.CraftID));
          if (t) {
            temp = temp.filter(it => !t.List.includes(it.CraftID));
          }
        }
        temp.push(e);
      }
      this.selectedCraftList = temp;
    },
  },
};
</script>
<style lang='scss'>
.mp-place-order-panel-comp-craft-type-list-comp-wrap {
  margin-bottom: -15px;
  padding-left: 5px;
  .mp-show-product-btn-wrap {
    color: #585858;
  }
}
</style>
