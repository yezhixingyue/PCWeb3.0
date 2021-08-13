<template>
  <el-form-item :label="label" prop="name" v-if="target">
    <ElementTypeComp v-if="curTypeName==='元素'" :Property='target' hiddenLabel />
    <ElementGroupTypeComp v-if="curTypeName==='元素组'" :Property='target' />
    <MaterialTypeComp v-if="curTypeName==='物料'" />
    <CraftTypeComp v-if="curTypeName==='工艺'" />
  </el-form-item>
</template>

<script>
import { mapState } from 'vuex';
import ElementTypeComp from './ElementTypeComp.vue';
import ElementGroupTypeComp from './ElementGroupTypeComp.vue';
import MaterialTypeComp from './MaterialTypeComp.vue';
import CraftTypeComp from './CraftTypeComp.vue';

export default {
  props: {
    itemData: {
      type: Object,
      default: () => ({}),
    },
    placeData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    ElementTypeComp,
    ElementGroupTypeComp,
    MaterialTypeComp,
    CraftTypeComp,
  },
  computed: {
    ...mapState('Quotation', ['ProductDisplayPropertyTypeList']),
    curTypeName() {
      const t = this.ProductDisplayPropertyTypeList.find(it => it.ID === this.itemData.Type);
      return t ? t.Name : '';
    },
    target() {
      let targetProp;
      if (this.curTypeName) {
        switch (this.curTypeName) {
          case '元素':
            targetProp = this.placeData.ElementList.find(it => it.ID === this.itemData.Property.ID);
            break;
          case '元素组': // 元素组  也可能为尺寸
            targetProp = this.placeData.GroupList.find(it => it.ID === this.itemData.Property.ID);
            if (!targetProp && this.placeData.SizeGroup.GroupInfo.ID === this.itemData.Property.ID) targetProp = this.placeData.SizeGroup;
            break;
          case '物料':
            targetProp = this.placeData.MaterialList || [];
            break;
          case '工艺':
            targetProp = this.placeData.CraftGroupList.find(it => it.ID === this.itemData.Property.ID);
            break;
          case '工厂': // 工厂隐藏
            targetProp = this.placeData.FactoryList;
            break;
          default:
            break;
        }
      }

      return targetProp || null;
    },
    label() {
      if (this.curTypeName === '物料') return this.placeData.MaterialDisplayName || '物料';
      if (this.target.Name) return this.target.Name;
      if (this.target.GroupInfo?.Name) return this.target.GroupInfo.Name;
      return '';
    },
  },
  data() {
    return {

    };
  },
};
</script>
<style lang='scss'>
</style>
