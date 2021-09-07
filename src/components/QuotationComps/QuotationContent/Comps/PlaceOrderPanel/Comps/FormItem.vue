<template>
  <el-form-item :label="label" :prop="propName"
   v-if="target && !hidden && showFormItem"
   :label-width='labelWidth'
   :rules="[
      { validator: validateFormItem, trigger: 'change' }
    ]"
   class="mp-place-order-panel-form-item-comp-wrap"
   :class="{isNormalGroup:isNormalGroup}">
    <!-- 元素 -->
    <ElementTypeComp v-if="curTypeName==='元素'" :Property='target' hiddenLabel v-model="itemValue"
     :AffectedPropList='localAffectedPropList' @blur="onTriggerInteractionClick" />
    <!-- 元素组 -->
    <ElementGroupTypeComp v-if="isNormalGroup" :Property='target' v-model="itemValue" :showTop='!!label' @changeValidate='onChangeValidate'
     :errorElementID='errorElementID' :errorIndex='errorIndex' :AffectedPropList='localAffectedPropList'
     @triggerInteraction='onTriggerInteractionClick' />
     <!-- 尺寸 -->
    <SizeGroupComp v-if="curTypeName==='元素组' && !target.ElementList && target.SizeList" :AffectedPropList='localAffectedPropList'
     :Property='target' v-model="itemValue" :errorElementID='errorElementID' @triggerInteraction='onTriggerInteractionClick' />
     <!-- 物料 -->
    <MaterialTypeComp v-if="curTypeName==='物料'" @triggerInteraction='onTriggerInteractionClick'
     :AffectedPropList='localAffectedPropList' :MaterialList='target.filter(it => !it.HiddenToCustomer)' v-model="itemValue"/>
    <!-- 工艺 -->
    <CraftTypeComp
     v-if="curTypeName==='工艺'"
     v-model="itemValue"
     :CraftData='target'
     :CraftList='placeData.CraftList || []'
     :AffectedPropList='localAffectedPropList'
     :CraftConditionList='placeData.CraftConditionList || []'
     @triggerInteraction='onTriggerInteractionClick' />
  </el-form-item>
</template>

<script>
import { mapState } from 'vuex';
import {
  checkElement, checkElementGroup, checkSizeGroup, checkCraft,
} from '@/store/Quotation/Checker';
import InterAction from '@/store/Quotation/Interaction';
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
    ElementTypeComp,
    ElementGroupTypeComp,
    SizeGroupComp,
    MaterialTypeComp,
    CraftTypeComp,
  },
  computed: {
    ...mapState('Quotation', ['ProductDisplayPropertyTypeList', 'obj2GetProductPrice', 'PropertiesAffectedByInteraction']),
    curTypeName() {
      const t = this.ProductDisplayPropertyTypeList.find(it => it.ID === this.itemData.Type);
      return t ? t.Name : '';
    },
    isNormalGroup() {
      return !!(this.curTypeName === '元素组' && this.target.ElementList && this.target.ElementList.length > 0);
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
        return this.target.HiddenToCustomer || (this.target.GroupInfo && this.target.GroupInfo.HiddenToCustomer) || this.AffectedHidden;
      }
      return false;
    },
    itemValue: {
      get() {
        let value;
        let t;
        if (this.curTypeName) {
          switch (this.curTypeName) {
            case '元素':
              if (Array.isArray(this.submitData.ElementList)) {
                t = this.submitData.ElementList.find(it => it.ElementID === this.itemData.Property.ID);
                if (t) value = t.CustomerInputValues;
              }
              break;
            case '元素组': // 元素组  也可能为尺寸
              if (Array.isArray(this.submitData.GroupList)) {
                t = this.submitData.GroupList.find(it => it.GroupID === this.itemData.Property.ID);
                if (t) value = t.List;
              }
              if (!t && this.placeData.SizeGroup.GroupInfo.ID === this.itemData.Property?.ID) value = this.submitData.Size;
              break;
            case '物料':
              value = this.submitData.MaterialID || '';
              break;
            case '工艺':
              value = this.submitData.CraftList || [];
              break;
            case '工厂': // 工厂隐藏
              // value = this.placeData.FactoryList;
              break;
            default:
              break;
          }
        }
        return value;
      },
      set(val) {
        // console.log('formItem itemValue 触发改变', val);
        let type = this.curTypeName;
        if (type === '元素组' && !this.target.ElementList && this.target.SizeList) type = '尺寸组';
        this.$store.commit('Quotation/setObj2GetProductPriceProductParams', [this.PartID, this.PartIndex, type, this.itemData.Property.ID, val]);
        if (this.curTypeName === '工艺') {
          this.$emit('changeValidate', this.placeData.CraftGroupList.map(it => it.Name));
        }
      },
    },
    showFormItem() { // 判断在什么时候隐藏该子项目
      if (this.curTypeName === '物料' && this.target.filter(it => !it.HiddenToCustomer).length === 0) {
        return false;
      }
      return true;
    },
    propName() {
      if (!this.target) return 'propName';
      if (this.target.Name) return this.target.Name;
      if (this.target.GroupInfo) return this.target.GroupInfo.Name || 'propName';
      return 'propName';
    },
    localAffectedPropList() {
      if (!Array.isArray(this.PropertiesAffectedByInteraction) || this.PropertiesAffectedByInteraction.length === 0) return [];
      return this.PropertiesAffectedByInteraction.filter(({ Property }) => {
        const isSamePart = (!this.PartID && !Property.Part) || (this.PartID && Property.Part && Property.Part.ID === this.PartID);
        if (!isSamePart) return false;
        const isSameTarget = this.getIsSameTarget(Property);
        return isSameTarget;
      });
    },
    AffectedHidden() {
      if (this.localAffectedPropList.length > 0) {
        if (this.curTypeName === '元素') { // 是否元素隐藏
          return InterAction.getIsHiddenOrNot(this.localAffectedPropList);
        }
        if (this.curTypeName === '元素组') { // 是否元素组和尺寸组隐藏
          const _AffectedPropList = this.localAffectedPropList
            .filter((_it) => _it.Property && !_it.Property.Element && _it.Property.Group && !_it.Property.FixedType && _it.Property.FixedType !== 0);
          if (_AffectedPropList.length === 1) {
            return _AffectedPropList[0].Operator === 22;
          }
        }
      }
      return false;
    },
  },
  data() {
    return {
      errorElementID: '',
      errorIndex: '',
    };
  },
  methods: {
    validateFormItem(rule, value, callback) {
      if (this.AffectedHidden) { // 如果该项目隐藏了，则直接通过验证
        callback();
        return;
      }
      this.errorElementID = '';
      this.errorIndex = '';
      if (this.curTypeName === '元素') {
        const res = checkElement(this.itemValue, this.target, this.localAffectedPropList);
        if (res && typeof res === 'string') {
          callback(new Error(res));
          return;
        }
      }
      if (this.curTypeName === '元素组' && this.isNormalGroup) {
        const res = checkElementGroup(this.itemValue, this.target, this.localAffectedPropList);
        if (res && typeof res === 'object' && res.msg) {
          this.errorElementID = res.ElementID;
          this.errorIndex = res.index;
          callback(new Error(res.msg));
          return;
        }
      }
      if (this.curTypeName === '元素组' && !this.isNormalGroup) { // 尺寸组
        const res = checkSizeGroup(this.itemValue, this.target, this.localAffectedPropList);
        if (res && typeof res === 'object' && res.msg) {
          this.errorElementID = res.ElementID;
          callback(new Error(res.msg));
          return;
        }
      }
      if (this.curTypeName === '工艺') { // 工艺
        const res = checkCraft(this.itemValue, this.target, this.placeData.CraftConditionList, this.placeData.CraftList, this.localAffectedPropList);
        if (res && typeof res === 'string') {
          callback(new Error(res));
          return;
        }
      }
      callback();
    },
    onChangeValidate() { // 重新单独校验
      this.$emit('changeValidate', this.propName);
    },
    getIsSameTarget(Property) {
      if (this.curTypeName === '元素' && Property.Type === 3 && Property.Element) {
        return Property.Element.ID === this.target.ID;
      }
      if (this.curTypeName === '元素组' && Property.Type === 2 && Property.Group) {
        return Property.Group.ID === this.target.ID;
      }
      if (this.curTypeName === '工艺' && Property.Type === 4 && Property.Craft) {
        return this.target.List.includes(Property.Craft.ID);
      }
      if (this.curTypeName === '物料' && Property.Type === 5) {
        return true;
      }
      if (this.curTypeName === '元素组' && !this.target.ElementList && this.target.SizeList && Property.Type === 6) {
        return true;
      }
      return false;
    },
    onTriggerInteractionClick() {
      this.$store.commit('Quotation/setPropertiesAffectedByInteraction');
    },
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
    .el-form-item__error {
      margin-left: 6px;
      white-space: nowrap;
    }
  }
  &.isNormalGroup > label {
    font-weight: 700;
    color: #333 !important;
  }
  &.el-form-item--mini .el-form-item__error {
    padding-top: 2px;
  }
}
</style>
