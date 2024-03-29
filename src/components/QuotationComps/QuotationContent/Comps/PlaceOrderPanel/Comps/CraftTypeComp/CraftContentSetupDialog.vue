<template>
  <el-dialog
    :visible.sync="localVisible"
    :title="dialogTitle"
    custom-class="set-craft-dia mp-place-order-panel-comp-craft-type-item-dialog-comp-wrap"
    v-dialogDrag
    @open="onOpen"
    @closed="onClosed"
  >
    <header slot="title">
      <i class="iconfont icon-shezhi is-primary-blue"></i>
      <span>{{ dialogTitle }}</span>
    </header>
    <main v-if="localSetupData && showMain" class="mp-scroll-wrap">
      <el-form
        :model="craftForm"
        ref="craftForm"
        label-width="100px"
        class="craft-dialog-ruleForm"
        size="mini"
      >
        <el-form-item
          v-for="it in ElementList"
          :key="it.ID"
          :label="it.Name && !it.IsNameHidden ? `${it.Name}：` : ''"
          :prop="it.ID"
          :rules="[{ validator: validateCraftValueItem, trigger: 'change' }]"
        >
          <ElementTypeComp
            hiddenLabel
            CtrlZIndex
            :Property="it"
            :value="craftForm[it.ID].Value"
            :AffectedPropList='getElementAffectedPropList(it)'
            @interaction="getLocalAffectedPropList"
            @input="handleElementChange($event, it)"
          />
          <template slot="error" slot-scope="row">
            <div class='el-form-item__error' :title="row.error">{{row.error}}</div>
          </template>
        </el-form-item>
        <el-form-item
          v-for="(it, i) in GroupList"
          :key="it.ID"
          :label="it.Name && !it.IsNameHidden ? `${it.Name}：` : ''"
          :prop="it.ID"
          :rules="[{ validator: validateCraftValueItem, trigger: 'change' }]"
          class="group"
          :class="{hasError: errorIndex || errorIndex === 0}"
        >
          <ElementGroupTypeComp
            :Property="it"
            fillWidth
            CtrlZIndex
            isCraftUse
            :errorElementID='errorElementID'
            :errorIndex='errorIndex'
            :errorMsg='errorMsg'
            :showTop='it.Name && !it.IsNameHidden'
            :value="craftForm[it.ID].Value"
            :AffectedPropList='AffectedPropLists[i]'
            :subGroupAffectedPropList='subGroupAffectedPropLists[i]'
            @input="handleGroupChange($event, it)"
            @changeValidate='onChangeValidate(it.ID)'
            @triggerInteraction='getSubGroupAffectedPropLists'
            @groupItemChange='handleGroupItemChange($event, it)'
            :class="{fixedWidth:fixedWidth}"
          />
          <template slot="error" slot-scope="row">
            <div class='el-form-item__error' :title="row.error">{{row.error}}</div>
          </template>
        </el-form-item>
      </el-form>
    </main>
    <footer>
      <el-button type="primary" @click="onSubmit">确定</el-button>
      <el-button @click="localVisible = false">取消</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex';
import { checkElement, checkElementGroup } from '@/store/Quotation/Checker';
import QuotationClassType from '@/store/Quotation/QuotationClassType';
import InterAction from '@/store/Quotation/Interaction';
import { getPropertiesAffectedByInteraction, getCombineAffectedPropList } from '@/store/Quotation/EffectiveControlList';
import ElementTypeComp from '../ElementTypeComp.vue';
import ElementGroupTypeComp from '../ElementGroupTypeComp.vue';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    Craft: {
      type: Object,
      default: () => ({}),
    },
    setupData: {
      type: Object,
      default: null,
    },
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
  },
  components: {
    ElementTypeComp,
    ElementGroupTypeComp,
  },
  computed: {
    ...mapState('Quotation', ['curProductInfo2Quotation', 'obj2GetProductPrice']),
    localVisible: {
      get() {
        return this.visible;
      },
      set(bool) {
        this.$emit('update:visible', bool);
      },
    },
    dialogTitle() {
      return this.Craft && this.Craft.ShowName
        ? `${this.Craft.ShowName}参数设置`
        : '工艺参数设置';
    },
    ElementList() {
      return this.Craft?.ElementList?.filter(it => !it.HiddenToCustomer) || [];
    },
    GroupList() {
      const list = this.Craft?.GroupList?.filter(it => !it.HiddenToCustomer).filter((it, i) => this.getClearedHiddenItemData(it, i));
      return list || [];
    },
    craftForm() {
      const temp = {};
      const data = this.localSetupData;
      this.ElementList.forEach(it => {
        temp[it.ID] = {
          Value: this.getElementVal(it, data),
          ID: it.ID,
          Type: 'Element',
        };
      });
      this.GroupList.forEach(it => {
        temp[it.ID] = {
          Value: this.getGroupVal(it, data),
          ID: it.ID,
          Type: 'Group',
        };
      });
      return temp;
    },
    ElementAffectedPropList() {
      if (this.localAffectedPropList.length === 0) return [];
      return this.localAffectedPropList.filter((it) => it.Property && it.Property.Craft && it.Property.Element && !it.Property.Group);
    },
    GroupAffectedPropList() {
      if (this.localAffectedPropList.length === 0) return [];
      return this.localAffectedPropList.filter((it) => it.Property && it.Property.Craft && it.Property.Group);
    },
    fixedWidth() { // 是否定宽（超过3个定宽）
      const t = this.GroupList.find(it => it.ElementList.filter(_it => !_it.HiddenToCustomer).length > 3);
      return !!t;
    },
  },
  data() {
    return {
      localSetupData: null,
      showMain: false,
      errorElementID: '',
      errorIndex: '',
      errorMsg: '',
      AffectedPropLists: [],
      subGroupAffectedPropLists: [],
      localAffectedPropList: [], // 弹窗内使用本地交互列表，以实现实时响应数据
    };
  },
  methods: {
    onSubmit() {
      this.$refs.craftForm.validate((bool) => {
        if (bool) {
          // const obj = this.generateSubmitSetupData();
          this.$emit('submit', this.localSetupData);
          this.onTriggerInteractionClick();
        }
      });
    },
    generateInitSetupData() { // 生成及初始化设置数据
      if (this.Craft) {
        this.localSetupData = QuotationClassType.getCraftItemSubmitData(
          this.Craft,
          this.ChildSubControlList,
        );
      }
    },
    generateSubmitSetupData() {
      const ElementList = InterAction.setElementListClear4Craft(this.localSetupData.ElementList, this.ElementAffectedPropList);
      const GroupList = InterAction.setElementGroupListClear4Craft(this.localSetupData.GroupList, this.GroupAffectedPropList);
      return { ...this.localSetupData, ElementList, GroupList };
    },
    onOpen() {
      if (!this.setupData) this.generateInitSetupData();
      else {
        // 如果有服务器数据编辑还原操作的时候必须考虑排序的问题
        this.localSetupData = JSON.parse(JSON.stringify(this.setupData));
      }
      this.showMain = true;
      this.getSubGroupAffectedPropLists();
    },
    onClosed() {
      this.showMain = false;
      this.errorElementID = '';
      this.errorIndex = '';
      this.errorMsg = '';
    },
    getElementVal({ ID }, data) {
      const t = data.ElementList.find(
        (it) => it.ElementID === ID,
      );
      return t ? t.CustomerInputValues : [];
    },
    getGroupVal({ ID }, data) {
      const t = data.GroupList.find((it) => it.GroupID === ID);
      return t ? t.List : [];
    },
    handleElementChange({
      CustomerInputValues, disabledByInteraction, hiddenByInteraction, DisabledValue,
    }, el) {
      const t = this.localSetupData.ElementList.find(
        (it) => it.ElementID === el.ID,
      );
      if (t) {
        t.CustomerInputValues = CustomerInputValues;
        t.disabledByInteraction = disabledByInteraction;
        t.hiddenByInteraction = hiddenByInteraction;
        t.DisabledValue = DisabledValue;
      }
    },
    handleGroupChange(List, group) {
      const t = this.localSetupData.GroupList.find(
        (it) => it.GroupID === group.ID,
      );
      if (t) {
        t.List = List;
      }
    },
    handleGroupItemChange(Value, group) {
      const t = this.localSetupData.GroupList.find(
        (it) => it.GroupID === group.ID,
      );
      if (t) {
        const [lv1Index, index, temp] = Value;
        const {
          CustomerInputValues, disabledByInteraction, hiddenByInteraction, DisabledValue,
        } = temp;
        t.List[lv1Index].List[index].CustomerInputValues = CustomerInputValues;
        t.List[lv1Index].List[index].disabledByInteraction = disabledByInteraction;
        t.List[lv1Index].List[index].hiddenByInteraction = hiddenByInteraction;
        t.List[lv1Index].List[index].DisabledValue = DisabledValue;
      }
    },
    validateCraftValueItem(rule, value, callback) {
      this.errorElementID = '';
      this.errorIndex = '';
      this.errorMsg = '';
      if (value) {
        const { ID, Type, Value } = value;
        if (Type === 'Element') {
          const target = this.ElementList.find(it => it.ID === ID);
          if (target) {
            const list = this.getElementAffectedPropList(target);
            const res = checkElement({ values: Value, prop: target, AffectedPropList: list });
            if (res && typeof res === 'string') {
              callback(new Error(res));
              return;
            }
          }
        }
        if (Type === 'Group') {
          const index = this.GroupList.findIndex(it => it.ID === ID);
          if (index >= 0) {
            const res = checkElementGroup({
              valueList: Value,
              prop: this.GroupList[index],
              AffectedPropList: this.AffectedPropLists[index],
              subGroupAffectedPropList: this.subGroupAffectedPropLists[index],
            }); // 此处需要修改为合并后的
            if (res && typeof res === 'object' && res.msg) {
              this.errorElementID = res.ElementID;
              this.errorIndex = res.index;
              this.errorMsg = res.msg;
              callback(new Error(res.msg));
              return;
            }
          }
        }
      }
      callback();
    },
    onChangeValidate(key) {
      this.$nextTick(() => {
        this.$refs.craftForm.validateField(key);
      });
    },
    getElementAffectedPropList(el) { // 获取元素受影响交互列表
      if (this.ElementAffectedPropList.length === 0) return [];
      return this.ElementAffectedPropList.filter(it => it.Property?.Element?.ID === el.ID);
    },
    getGroupAffectedPropList(group) { // 获取元素组受影响的交互列表
      if (this.GroupAffectedPropList.length === 0) return [];
      return this.GroupAffectedPropList.filter(it => it.Property?.Group?.ID === group.ID);
    },
    getClearedHiddenItemData(it) {
      const AffectedPropList = this.getGroupAffectedPropList(it);
      const _AffectedPropList = AffectedPropList.filter((_it) => _it.Property && !_it.Property.Element && _it.Property.Group);
      if (_AffectedPropList.length === 1) {
        return _AffectedPropList[0].Operator !== 22;
      }
      return true;
    },
    onTriggerInteractionClick() { // 工艺index统一处理
    },
    getAffectedPropList() { // 获取工艺元素组交互数据 -----  此处需要修改为合并后的全部交互数据
      this.AffectedPropLists = this.GroupList.map(it => this.getGroupAffectedPropList(it));
    },
    getSubGroupAffectedPropLists() { // 获取工艺元素组子交互数据
      this.getLocalAffectedPropList();
      this.subGroupAffectedPropLists = this.GroupList.map(it => {
        const t = this.localSetupData.GroupList.find(_it => _it.GroupID === it.ID);
        if (t && t.SubControlList) {
          const { SubControlList } = t;
          const { curProductInfo2Quotation } = this;
          const _list = t.List.map(_it => ({ CraftList: [{ GroupList: [{ GroupID: t.GroupID, List: [_it] }], CraftID: this.Craft.ID }] }))
            .map(_it => getPropertiesAffectedByInteraction({ ProductParams: _it, curProductInfo2Quotation, SubControlList }));
          return _list;
        }
        return [];
      });
    },
    getLocalAffectedPropList() {
      // 替换对象
      // const obj = this.generateSubmitSetupData();
      const obj = { ...this.localSetupData };
      const temp = JSON.parse(JSON.stringify(this.obj2GetProductPrice.ProductParams));
      let target;
      if (!this.PartID) {
        if (!temp.CraftList) temp.CraftList = [];
        target = temp.CraftList;
      } else {
        target = temp.PartList.find(it => it.PartID === this.PartID);
        if (target && target.List && target.List[this.PartIndex]) {
          if (!target.List[this.PartIndex].CraftList) target.List[this.PartIndex].CraftList = [];
          target = target.List[this.PartIndex].CraftList;
        }
      }
      if (!target) return;
      const i = target.findIndex(it => it.CraftID === obj.CraftID);
      if (i > -1) target.splice(i, 1, obj);
      else target.push(obj);
      const list = QuotationClassType.getPropertiesAffectedByInteraction({ ProductParams: temp, curProductInfo2Quotation: this.curProductInfo2Quotation })
        .filter(it => it && it.Property && it.Property.Craft && it.Property.Craft.ID === this.Craft.ID && (it.Property.Element || it.Property.Group));
      const _PartAffectedPropList = this.PartAffectedPropList
        .filter(it => it && it.Property && it.Property.Craft && it.Property.Craft.ID === this.Craft.ID && (it.Property.Element || it.Property.Group));
      const CombineAffectedByInteraction = getCombineAffectedPropList(list, _PartAffectedPropList);
      if (Array.isArray(CombineAffectedByInteraction)) {
        this.localAffectedPropList = CombineAffectedByInteraction.filter(({ Property }) => {
          const isSamePart = (!this.PartID && !Property.Part) || (this.PartID && Property.Part && Property.Part.ID === this.PartID);
          if (!isSamePart) return false;
          return true;
        });
      }
      this.getAffectedPropList();
    },
  },
};
</script>
<style lang='scss'>
.el-dialog__wrapper {
  > .el-dialog.set-craft-dia.mp-place-order-panel-comp-craft-type-item-dialog-comp-wrap {
    width: unset;
    width: auto\0;
    min-width: 570px;
    display: table;
    border-radius: 5px;
    > .el-dialog__header {
      > header {
        height: 14px;
        line-height: 14px;
      }
    }
    > .el-dialog__body {
      margin-left: 10px;
      margin-right: 5px;
      padding-bottom: 25px;
      margin-left: 15px\0;
      margin-right: 15px\0;
      max-width: 1200px;
      > main {
        max-height: 420px;
        overflow-y: scroll;
        padding-right: 20px;
        .mp-place-order-content-element-type-show-item-comp-wrap {
          > label {
            width: unset;
          }
        }
        // .mp-place-order-panel-element-group-setup-comp-wrap {
        //   margin-left: 5px;
        // }
        .craft-dialog-ruleForm {
          > div.el-form-item {
            > label {
              padding-right: 0;
            }
            &.is-error > .el-form-item__content > .mp-place-order-panel-element-group-setup-comp-wrap .el-input__inner,
            &.is-error > .el-form-item__content > .mp-place-order-panel-form-item-size-group-comp-wrap .el-input__inner,
            &.is-error .mp-place-order-panel-comp-craft-type-item-comp-wrap .el-input__inner{
              border-color: rgb(229, 229, 229) !important;
            }
            &.is-error > .el-form-item__content > .mp-place-order-panel-element-group-setup-comp-wrap .canError .el-input__inner,
            &.is-error > .el-form-item__content > .mp-place-order-panel-form-item-size-group-comp-wrap .canError .el-input__inner {
              border-color: #ff3769 !important;
            }
          }
        }
        .el-form-item__content > .mp-place-order-panel-element-group-setup-comp-wrap{
          margin-bottom: -10px;
        }
        .mp-place-order-panel-element-group-setup-comp-wrap {
          margin-left: -100px;
          > ul {
            > li {
              > div {
                > div {
                  margin-bottom: 12px;
                  margin-right: 15px;
                  // min-width: 243px;
                  // text-align: right;
                  &:first-of-type {
                    > label {
                      width: 100px;
                      // padding-right: 12px;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    }
                  }
                  // &.isNameHide {
                  //   min-width: 150px;
                  // }
                  > div {
                    text-align: left;
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
          &.fixedWidth > ul > li > div > div {
            > label {
              width: 100px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
        .group {
          > label {
            font-weight: 700;
            color: #333 !important;
          }
        }
        .el-form-item__label {
          white-space: nowrap;
        }
      }
      > footer {
        text-align: center;
        margin-top: 58px;
        > button {
          height: 35px;
          width: 120px;
          line-height: 33px;
          padding: 0;
          & + button {
            margin-left: 45px;
          }
        }
      }
    }
  }
}
</style>
