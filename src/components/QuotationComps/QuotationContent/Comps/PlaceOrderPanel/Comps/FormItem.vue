<template>
  <el-form-item :label="label" :prop="propName"
   v-if="target && !hidden && showFormItem"
   v-show="showGroup"
   :label-width='labelWidth'
   :rules="[
      { validator: validateFormItem, trigger: 'change' }
    ]"
   class="mp-place-order-panel-form-item-comp-wrap"
   :class="{isNormalGroup:isNormalGroup}">
    <!-- 元素 -->
    <ElementTypeComp v-if="curTypeName==='元素'" :Property='target' hiddenLabel v-model="itemValue"
     :AffectedPropList='localAffectedPropList' @interaction="onTriggerInteractionClick" />
    <!-- 元素组 -->
    <ElementGroupTypeComp v-if="isNormalGroup" :Property='target' v-model="itemValue" :showTop='!!label' @changeValidate='onChangeValidate'
     :errorElementID='errorElementID' :errorIndex='errorIndex' :AffectedPropList='localAffectedPropList' :subGroupAffectedPropList='subGroupAffectedPropList'
     @triggerInteraction='onTriggerInteractionClick' @groupItemChange='handleGroupItemChange' />
     <!-- 尺寸 -->
    <SizeGroupComp v-if="curTypeName==='尺寸组'" :AffectedPropList='localAffectedPropList'
     :Property='target' v-model="itemValue" :errorElementID='errorElementID' @triggerInteraction='onTriggerInteractionClick' />
     <!-- 物料 -->
    <MaterialTypeComp v-if="curTypeName==='物料'" @triggerInteraction='onTriggerInteractionClick'
     :AffectedPropList='localAffectedPropList' :MaterialList='target' v-model="itemValue"/>
    <!-- 工艺 -->
    <CraftTypeComp
     v-if="curTypeName==='工艺'"
     v-model="itemValue"
     :CraftData='target'
     :CraftList='placeData.CraftList || []'
     :AffectedPropList='localAffectedPropList'
     :CraftConditionList='placeData.CraftConditionList || []'
     :ChildSubControlList='submitData.ChildSubControlList'
     :PartID='PartID'
     :PartIndex='PartIndex'
     :PartAffectedPropList='PartAffectedPropList'
     @triggerInteraction='onTriggerInteractionClick' />
  </el-form-item>
</template>

<script>
import { mapState } from 'vuex';
import {
  checkElement, checkElementGroup, checkSizeGroup, checkCraft,
} from '@/store/Quotation/Checker';
import InterAction from '@/store/Quotation/Interaction';
import { getPropertiesAffectedByInteraction, getCombineAffectedPropList } from '@/store/Quotation/EffectiveControlList';
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
    PartAffectedPropList: { // 部件子交互生效属性控制信息列表
      type: Array,
      default: null,
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
    ...mapState('Quotation', ['ProductDisplayPropertyTypeList', 'obj2GetProductPrice', 'PropertiesAffectedByInteraction', 'curProductInfo2Quotation']),
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
          case '元素组':
            targetProp = this.placeData.GroupList.find(it => it.ID === this.itemData.Property.ID);
            break;
          case '尺寸组':
            targetProp = this.placeData.SizeGroup;
            break;
          case '物料':
            targetProp = this.placeData.TypeList || [];
            break;
          case '工艺':
            targetProp = this.placeData.CraftGroupList.find(it => it.ID === this.itemData.Property.ID);
            if (targetProp) targetProp = JSON.parse(JSON.stringify(targetProp));
            if (targetProp && targetProp.List && targetProp.List.length > 0) {
              targetProp.List = targetProp.List
                .map(it => this.placeData.CraftList.find(_it => _it.ID === it))
                .filter(it => it && !it.HiddenToCustomer)
                .map(it => it.ID);
              if (targetProp.List.length === 0) targetProp = null;
            } else {
              targetProp = null;
            }
            break;
          case '工厂': // 工厂隐藏
            // targetProp = this.placeData.FactoryList;
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
              // if (!t && this.placeData.SizeGroup.GroupInfo.ID === this.itemData.Property?.ID) value = this.submitData.Size;
              break;
            case '尺寸组':
              value = this.submitData.Size;
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
        const type = this.curTypeName;
        // if (type === '元素组' && !this.target.ElementList && this.target.SizeList) type = '尺寸组';
        this.$store.commit('Quotation/setObj2GetProductPriceProductParams',
          [this.PartID, this.PartIndex, type, this.itemData.Property ? this.itemData.Property.ID : '', val]);
        if (this.curTypeName === '工艺') {
          this.$emit('changeValidate', this.placeData.CraftGroupList.map(it => it.Name));
        }
        if (type === '元素组') {
          this.getSubGroupAffectedPropList();
        }
      },
    },
    showFormItem() { // 判断在什么时候隐藏该子项目
      if (this.curTypeName === '物料' && this.target.filter(it => !it.HiddenToCustomer).length === 0) {
        return false;
      }
      return true;
    },
    showGroup() {
      if (this.curTypeName === '元素组') {
        if (this.target) {
          const t = this.target.ElementList.find(it => !it.HiddenToCustomer);
          return !!t;
        }
      }
      return true;
    },
    propName() {
      if (!this.target) return 'propName';
      if (this.target.Name) return this.target.Name;
      if (this.target.GroupInfo) return this.target.GroupInfo.Name || 'propName';
      return 'propName';
    },
    CraftAffectedPropList() { // 工艺子交互
      if (this.curTypeName === '工艺') {
        const list = this.submitData.ChildSubControlList.filter(it => it.CraftID && this.target.List.includes(it.CraftID));
        return list;
      }
      return [];
    },
    localAffectedPropList() {
      // this.PartAffectedPropList // 部件子交互生效属性控制信息列表    合并1 -- 部件子交互
      // this.subGroupAffectedPropList  合并2 -- 元素组子交互  ------------- 不能在此处合并 或可使用数组形式？
      // this.CraftAffectedPropList  合并3 -- 工艺子交互
      const CombineAffectedByInteraction = getCombineAffectedPropList(this.PropertiesAffectedByInteraction, this.PartAffectedPropList);
      if (!Array.isArray(CombineAffectedByInteraction) || CombineAffectedByInteraction.length === 0) return [];
      return CombineAffectedByInteraction.filter(({ Property }) => {
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
        if (this.curTypeName === '元素组' || this.curTypeName === '尺寸组') { // 是否元素组和尺寸组隐藏
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
      subGroupAffectedPropList: [],
    };
  },
  methods: {
    delay(duration = 10) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, duration);
      });
    },
    async validateFormItem(rule, value, callback) {
      await this.delay();
      this.$nextTick(() => {
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
          const res = checkElementGroup(this.itemValue, this.target, this.localAffectedPropList, this.subGroupAffectedPropList);
          if (res && typeof res === 'object' && res.msg) {
            this.errorElementID = res.ElementID;
            this.errorIndex = res.index;
            callback(new Error(res.msg));
            return;
          }
        }
        if (this.curTypeName === '尺寸组') { // 尺寸组
          const res = checkSizeGroup(this.itemValue, this.target, this.localAffectedPropList);
          if (res && typeof res === 'object' && res.msg) {
            this.errorElementID = res.ElementID;
            callback(new Error(res.msg));
            return;
          }
        }
        if (this.curTypeName === '工艺') { // 工艺
          const res = checkCraft(this.itemValue, this.target, this.placeData.CraftConditionList, this.placeData.CraftList,
            this.localAffectedPropList, this.CraftAffectedPropList, this.curProductInfo2Quotation);
          if (res && typeof res === 'string') {
            callback(new Error(res));
            return;
          }
        }
        callback();
      });
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
      if (this.curTypeName === '尺寸组' && !this.target.ElementList && this.target.SizeList && Property.Type === 6) {
        return true;
      }
      return false;
    },
    getSubGroupAffectedPropList() { // 元素组子交互
      if (this.isNormalGroup && Array.isArray(this.submitData.ChildSubControlList) && Array.isArray(this.submitData.GroupList)) {
        const list = this.submitData.ChildSubControlList.filter(it => !it.CraftID && it.GroupID === this.target.ID);
        // return list;
        const t = this.submitData.GroupList.find(it => it.GroupID === this.itemData.Property.ID);
        if (t) {
          const _list = t.List.map((it) => ({ GroupList: [{ GroupID: t.GroupID, List: [it] }] }))
            .map(it => getPropertiesAffectedByInteraction(it, this.curProductInfo2Quotation, list));
          // console.log(list, _list);
          this.subGroupAffectedPropList = _list;
          return;
        }
      }
      this.subGroupAffectedPropList = [];
    },
    onTriggerInteractionClick() {
      this.$store.commit('Quotation/setPropertiesAffectedByInteraction');
      this.$emit('partInteraction');
      this.getSubGroupAffectedPropList();
      // this.$nextTick(() => {
      //   this.onChangeValidate();
      // });
    },
    handleGroupItemChange(Value) {
      this.$store.commit('Quotation/setObj2GetProductPriceProductParamsGroupItem',
        [this.PartID, this.PartIndex, this.itemData.Property ? this.itemData.Property.ID : '', Value]);
      this.$emit('changeValidate', this.placeData.CraftGroupList.map(it => it.Name));
    },
  },
  watch: {
    localAffectedPropList(newVal, oldVal) {
      // console.log(newVal, oldVal);
      if ((!newVal || newVal.length === 0) && (!oldVal || oldVal.length === 0)) return;
      this.onChangeValidate();
    },
  },
  mounted() {
    this.getSubGroupAffectedPropList();
  },
};
</script>
<style lang='scss'>
.mp-place-order-panel-form-item-comp-wrap {
  // overflow: hidden;
  > label {
    white-space: nowrap;
  }
  > .el-form-item__content {
    > .mp-place-order-panel-element-group-setup-comp-wrap {
      margin-left: -100px;
      > ul {
        > li {
          > div > div {
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
      max-width: 740px;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  &.isNormalGroup > label {
    font-weight: 700;
    color: #333 !important;
  }
  &.el-form-item--mini .el-form-item__error {
    padding-top: 1px;
    line-height: 14px;
  }
}
</style>
