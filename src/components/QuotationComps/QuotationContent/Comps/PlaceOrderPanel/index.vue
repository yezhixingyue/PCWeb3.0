<template>
  <section
    v-if="placeData"
    class="mp-place-order-page-place-order-panel-comp-container"
  >
    <div
      class="setting-error is-pink"
      v-if="!placeData.TypeList || placeData.TypeList.length === 0"
    >
      <i class="el-icon-warning"></i>
      <span>产品未设置元素，请到产品管理中设置产品元素 ！</span>
    </div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="place-order-ruleForm"
      v-else
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
      />
    </el-form>
  </section>
</template>

<script>
import { mapState } from 'vuex';
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
  },
  components: {
    FormItem,
  },
  computed: {
    ...mapState('Quotation', [
      'ProductElementTypeList',
      'ProductDisplayPropertyTypeList',
    ]),
  },
  data() {
    return {
      ruleForm: {},
      rules: {},
    };
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
    }
  }
}
</style>
