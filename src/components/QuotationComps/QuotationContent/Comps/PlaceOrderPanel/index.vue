<template>
  <section
    v-if="placeData"
    class="mp-place-order-page-place-order-panel-comp-container"
  >
    <!-- <div
      class="setting-error is-pink"
      v-if="!PartID && (!placeData.FactoryList || placeData.FactoryList.length === 0)"
    >
      <i class="el-icon-warning"></i>
      <span>当前产品未设置工厂，请到产品管理中设置工厂 ！</span>
    </div> -->
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      label-width="100px"
      class="place-order-ruleForm"
      size="mini"
    >
      <FormItem
        v-for="it in placeData.DisplayList"
        :key="it.key"
        :itemData="it"
        :PartID='PartID'
        :PartIndex='PartIndex'
        :placeData="placeData"
        :submitData="submitData"
        :PartBaseTips='PartBaseTips'
        :PartAffectedPropList='PartAffectedPropList'
        @changeValidate='handleChangeValidate'
        @partInteraction='getPartAffectedPropList'
      />
    </el-form>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import { getPropertiesAffectedByInteraction } from '@/store/Quotation/EffectiveControlList';
import FormItem from './Comps/FormItem.vue';

export default {
  props: {
    placeData: {
      type: Object,
      default: null,
    },
    submitData: {
      type: Object,
      default: () => ({}),
    },
    PartID: {
      type: String,
      default: '',
    },
    PartIndex: {
      type: Number,
      default: 0,
    },
    PartBaseTips: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    FormItem,
  },
  computed: {
    ...mapState('Quotation', [
      'ProductElementTypeList',
      'ProductDisplayPropertyTypeList',
      'curProductInfo2Quotation',
    ]),
  },
  data() {
    return {
      ruleForm: {},
      rules: {},
      PartAffectedPropList: [],
    };
  },
  methods: {
    handleChangeValidate(key) {
      this.$refs.ruleForm.validateField(key);
    },
    getPartAffectedPropList() {
      const SubControlList = this.submitData?.SubControlList || [];
      this.PartAffectedPropList = getPropertiesAffectedByInteraction(this.submitData, this.curProductInfo2Quotation, SubControlList);
    },
  },
  mounted() {
    this.getPartAffectedPropList();
  },
};
</script>
<style lang='scss'>
.mp-place-order-page-place-order-panel-comp-container {
  .setting-error {
    padding-top: 20px;
    padding-bottom: 80px;
    > span {
      font-size: 12px;
      margin-left: 10px;
    }
    > i {
      font-size: 16px;
      vertical-align: -2px;
    }
  }
  .place-order-ruleForm {
    > .el-form-item {
      > label.el-form-item__label {
        color: #888;
        font-size: 14px;
      }
      .el-title {
        font-size: 14px;
      }
      &.is-error > .el-form-item__content > .mp-place-order-panel-element-group-setup-comp-wrap .el-input__inner,
      &.is-error > .el-form-item__content .mp-place-order-panel-size-group-customise-comp-containner .el-input__inner,
      &.is-error .mp-place-order-panel-comp-craft-type-item-comp-wrap .el-input__inner{
        border-color: rgb(229, 229, 229) !important;
      }
      &.is-error > .el-form-item__content > .mp-place-order-panel-element-group-setup-comp-wrap .canError .el-input__inner,
      &.is-error > .el-form-item__content .mp-place-order-panel-size-group-customise-comp-containner .canError .el-input__inner {
        border-color: #ff3769 !important;
      }
    }
  }
}
</style>
