<template>
  <ul
    v-if="CraftData"
    class="mp-place-order-panel-comp-craft-type-list-comp-wrap"
  >
    <CraftItemComp
      v-for="it in localCraftList"
      :key="it.ID"
      :Craft="it"
      :PartID='PartID'
      :PartIndex='PartIndex'
      :value="getCraftValue(it)"
      :CraftTipsDataList='CraftTipsDataList'
      :AffectedPropList='getCraftAffectedPropList(it.ID)'
      :ChildSubControlList='ChildSubControlList'
      :PartAffectedPropList='PartAffectedPropList'
      @change="onCraftItemChange($event, it)"
    />
  </ul>
</template>

<script>
import { mapGetters } from 'vuex';
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
    AffectedPropList: {
      // 受到交互影响的工艺列表
      type: Array,
      default: () => [],
    },
    ChildSubControlList: { // 子交互列表
      type: Array,
      default: () => [],
    },
    PartID: {
      type: String,
      default: '',
    },
    PartIndex: {
      type: Number,
      default: 0,
    },
    PartAffectedPropList: { // 部件子交互生效属性控制信息列表
      type: Array,
      default: null,
    },
    CraftTipsDataList: { // 工艺提示列表
      type: Array,
      default: () => [],
    },
  },
  components: {
    CraftItemComp,
  },
  computed: {
    ...mapGetters('Quotation', ['affectedCraftIDsByInteraction']),
    localCraftList() {
      if (
        !this.CraftData
        || !Array.isArray(this.CraftData.List)
        || this.CraftList.length === 0
      ) return [];
      return this.CraftList.filter(
        (it) => this.CraftData.List.includes(it.ID) && !it.HiddenToCustomer,
      );
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
    return {};
  },
  methods: {
    getCraftValue(itemData) {
      return (
        this.selectedCraftList.find((it) => it.CraftID === itemData.ID) || null
      );
    },
    onCraftItemChange(e, item, needInterAction = true) {
      let temp = this.selectedCraftList.filter((it) => it.CraftID !== item.ID);
      let bool = true;
      if (e) {
        // 也可能是编辑 也可能是添加 此时需做单选工艺处理 即判断其是否在单选工艺列表中 如果是则在添加的时候清除掉同组其它的工艺
        if (
          Array.isArray(this.CraftConditionList)
          && this.CraftConditionList.length > 0
        ) {
          const t = this.CraftConditionList.find((it) => it.List.includes(e.CraftID));
          if (t) {
            temp = temp.filter((it) => !t.List.includes(it.CraftID));
            bool = false; // 必选工艺会影响到交互条件
          }
        }
        temp.push(e);
      }
      this.selectedCraftList = temp;
      if (needInterAction && (this.affectedCraftIDsByInteraction.includes(item.ID) || !bool)) {
        const target = !bool ? undefined : item;
        this.$nextTick(() => {
          this.$emit('triggerInteraction', target);
        });
      }
    },
    getCraftAffectedPropList(ID) {
      if (!Array.isArray(this.AffectedPropList) || this.AffectedPropList.length === 0) return [];
      return this.AffectedPropList.filter(it => it.Property && it.Property.Craft && it.Property.Craft.ID === ID);
    },
  },
  // watch: {
  //   AffectedPropList(val) {
  //     console.log('监听到变化（工艺属性列表）AffectedPropList：', val);
  //   },
  // },
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
