<template>
  <el-form-item :label="label" :prop="propName"
   v-if="target && !hidden && showFormItem"
   :label-width='labelWidth'
   :rules="[
      { validator: validateFormItem, trigger: 'change' }
    ]"
   class="mp-place-order-panel-form-item-comp-wrap"
   :class="{isNormalGroup:isNormalGroup}">
    <ElementTypeComp v-if="curTypeName==='元素'" :Property='target' hiddenLabel v-model="itemValue" />
    <ElementGroupTypeComp v-if="isNormalGroup" :Property='target' v-model="itemValue" :showTop='!!label' @changeValidate='onChangeValidate'
     :errorElementID='errorElementID' :errorIndex='errorIndex' />
    <SizeGroupComp v-if="curTypeName==='元素组' && !target.ElementList && target.SizeList"
     :Property='target' v-model="itemValue" :errorElementID='errorElementID' />
    <MaterialTypeComp v-if="curTypeName==='物料'" :MaterialList='target.filter(it => !it.HiddenToCustomer)' v-model="itemValue" />
    <CraftTypeComp
     v-if="curTypeName==='工艺'"
     v-model="itemValue"
     :CraftData='target'
     :CraftList='placeData.CraftList || []'
     :CraftConditionList='placeData.CraftConditionList || []' />
  </el-form-item>
</template>

<script>
import { mapState } from 'vuex';
import {
  checkElement, checkElementGroup, checkSizeGroup, checkCraft,
} from '@/store/Quotation/Checker';
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
    ...mapState('Quotation', ['ProductDisplayPropertyTypeList', 'obj2GetProductPrice']),
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
        return this.target.HiddenToCustomer || (this.target.GroupInfo && this.target.GroupInfo.HiddenToCustomer);
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
              value = this.submitData.Material?.ID || '';
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
        console.log('formItem itemValue 触发改变', val);
        // console.log('itemValue', this.curTypeName, val, this.obj2GetProductPrice.ProductParams);
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
  },
  data() {
    return {
      errorElementID: '',
      errorIndex: '',
    };
  },
  methods: {
    validateFormItem(rule, value, callback) {
      this.errorElementID = '';
      this.errorIndex = '';
      if (this.curTypeName === '元素') {
        const res = checkElement(this.itemValue, this.target);
        if (res && typeof res === 'string') {
          callback(new Error(res));
          return;
        }
      }
      if (this.curTypeName === '元素组' && this.isNormalGroup) {
        const res = checkElementGroup(this.itemValue, this.target);
        if (res && typeof res === 'object' && res.msg) {
          this.errorElementID = res.ElementID;
          this.errorIndex = res.index;
          callback(new Error(res.msg));
          return;
        }
      }
      if (this.curTypeName === '元素组' && !this.isNormalGroup) { // 尺寸组
        const res = checkSizeGroup(this.itemValue, this.target);
        if (res && typeof res === 'object' && res.msg) {
          this.errorElementID = res.ElementID;
          callback(new Error(res.msg));
          return;
        }
      }
      if (this.curTypeName === '工艺') { // 尺寸组
        if (Array.isArray(this.placeData.CraftConditionList) && this.placeData.CraftConditionList.length > 0) {
          const res = checkCraft(this.itemValue, this.target, this.placeData.CraftConditionList, this.placeData.CraftList);
          if (res && typeof res === 'string') {
            callback(new Error(res));
            return;
          }
        }
      }
      callback();
    },
    onChangeValidate() { // 重新单独校验
      this.$emit('changeValidate', this.propName);
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
