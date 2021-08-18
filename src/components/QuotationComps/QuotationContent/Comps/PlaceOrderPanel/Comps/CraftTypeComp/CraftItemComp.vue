<template>
  <li class="mp-place-order-panel-comp-craft-type-item-comp-wrap">
    <ShowProductBtn
      @click.native="handleClick"
      :title="Craft.ShowName"
      :disabled="false"
      :isActive="!!value"
    />
    <template
      v-if="value && !withoutContent"
    >
      <i class="iconfont icon-bianji is-cyan" @click="handleEditClick"></i>
    </template>
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
  computed: {
    withoutContent() {
      return this.Craft.ElementList.length === 0 && this.Craft.GroupList.length === 0;
    },
  },
  methods: {
    handleClick() {
      if (this.value) {
        this.$emit('change', null);
        return;
      }
      if (this.withoutContent) {
        // 无元素和元素组工艺
        this.$emit('change', { CraftID: this.Craft.ID, ElementList: [], GroupList: [] });
        return;
      }
      this.visible = true;
    },
    handleDialogSubmit(e) {
      this.$emit('change', e);
      this.visible = false;
    },
    handleEditClick() {
      this.visible = true;
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
  > i {
    display: inline-block;
    width: 24px;
    height: 24px;
    background-color: rgb(245, 245, 245);
    border-radius: 50%;
    line-height: 24px;
    text-align: center;
    margin-left: 10px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 700;
  }
}
</style>
