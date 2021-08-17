<template>
  <li class="mp-place-order-panel-comp-craft-type-item-comp-wrap">
    <ShowProductBtn
      @click.native="handleClick"
      :title="Craft.ShowName"
      :disabled="false"
      :isActive="!!value"
    />
    <CraftContentSetupDialog :visible.sync='visible' :Craft='Craft' :setupData='value' @submit="handleDialogSubmit" />
  </li>
</template>

<script>
import ShowProductBtn from '@/components/QuotationComps/SMComps/ShowProductBtn.vue';
import CraftContentSetupDialog from './CraftContentSetupDialog.vue';

export default {
  props: {
    Craft: {
      type: Object,
      default: () => ({}),
    },
    value: {
      type: Object,
      default: null,
    },
  },
  components: {
    ShowProductBtn,
    CraftContentSetupDialog,
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    handleClick() {
      if (this.Craft.ElementList.length === 0 && this.Craft.GroupList.length === 0) {
        // 无元素和元素组工艺
        if (this.value) {
          this.$emit('change', null);
        } else {
          this.$emit('change', { CraftID: this.Craft.ID, ElementList: [], GroupList: [] });
        }
        return;
      }
      this.visible = true;
    },
    handleDialogSubmit(e) {
      console.log('handleDialogSubmit', e);
    },
  },
};
</script>
<style lang='scss'>
.mp-place-order-panel-comp-craft-type-item-comp-wrap {
  display: inline-block;
  margin-right: 25px;
  margin-bottom: 15px;
  > .mp-show-product-btn-wrap {
    min-width: 90px;
    box-sizing: border-box;
    line-height: 26px;
    &.active {
      border-color: #428dfa;
      color: #428dfa;
    }
  }
}
</style>
