<template>
  <el-form-item :label="label" prop="name"
   v-if="target && !hidden"
   :label-width='labelWidth'
   class="mp-place-order-panel-form-item-comp-wrap"
   :class="{isNormalGroup:isNormalGroup}">
    <ElementTypeComp v-if="curTypeName==='元素'" :Property='target' hiddenLabel />
    <ElementGroupTypeComp v-if="isNormalGroup" :Property='target' />
    <SizeGroupComp v-if="curTypeName==='元素组' && !target.ElementList && target.SizeList" :Property='target' />
    <MaterialTypeComp v-if="curTypeName==='物料'" :MaterialList='target.filter(it => !it.HiddenToCustomer)' />
    <CraftTypeComp v-if="curTypeName==='工艺'"
     :CraftData='target'
     :CraftList='placeData.CraftList || []'
     :CraftConditionList='placeData.CraftConditionList || []' />
  </el-form-item>
</template>

<script>
import { mapState } from 'vuex';
import ElementTypeComp from './ElementTypeComp.vue';
import ElementGroupTypeComp from './ElementGroupTypeComp.vue';
import SizeGroupComp from './SizeGroupComp/index.vue';
import MaterialTypeComp from './MaterialTypeComp/index.vue';
import CraftTypeComp from './CraftTypeComp/index.vue';

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
    SizeGroupComp,
    MaterialTypeComp,
    CraftTypeComp,
  },
  computed: {
    ...mapState('Quotation', ['ProductDisplayPropertyTypeList']),
    curTypeName() {
      const t = this.ProductDisplayPropertyTypeList.find(it => it.ID === this.itemData.Type);
      return t ? t.Name : '';
    },
    isNormalGroup() {
      return this.curTypeName === '元素组' && this.target.ElementList;
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
      let str = '';
      if (this.curTypeName === '物料') str = this.placeData.MaterialDisplayName || '物料';
      if (this.target.Name) str = this.target.Name;
      if (this.target.GroupInfo?.Name) str = this.target.GroupInfo.Name;
      if (Object.prototype.toString.call(this.target) === '[object Object]' && this.target.IsNameHidden) {
        str = '';
      }
      return str ? `${str}：` : '';
    },
    labelWidth() {
      // return this.label.length > 5 ? `${this.label.length + 0}em` : '100px';
      return '100px';
    },
    hidden() {
      if (Object.prototype.toString.call(this.target) === '[object Object]') {
        return this.target.HiddenToCustomer;
      }
      return false;
    },
  },
  data() {
    return {

    };
  },
};
</script>
<style lang='scss'>
.mp-place-order-panel-form-item-comp-wrap {
  > label {
    white-space: nowrap;
  }
  > .el-form-item__content {
    > .mp-place-order-panel-element-group-setup-comp-wrap {
      margin-left: -100px;
      > ul {
        > li {
          > div {
            &:first-of-type {
              > label {
                width: 88px;
                padding-right: 12px;
                white-space: nowrap;
              }
            }
          }
        }
      }
      > div {
        margin-left: 106px;
        margin-bottom: 4px;
        height: 30px;
      }
    }
  }
  &.isNormalGroup > label {
    font-weight: 700;
    color: #333 !important;
  }
}
</style>
