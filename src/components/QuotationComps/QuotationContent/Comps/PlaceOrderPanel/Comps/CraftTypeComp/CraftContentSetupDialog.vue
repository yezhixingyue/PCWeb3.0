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
    <main v-if="localSetupData && showMain">
      <el-form
        :model="craftForm"
        ref="craftForm"
        label-width="100px"
        class="place-order-ruleForm"
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
            :Property="it"
            :value="craftForm[it.ID].Value"
            :AffectedPropList='getElementAffectedPropList(it)'
            @input="handleElementChange($event, it)"
          />
        </el-form-item>
        <el-form-item
          v-for="it in GroupList"
          :key="it.ID"
          :label="it.Name && !it.IsNameHidden ? `${it.Name}：` : ''"
          :prop="it.ID"
          :rules="[{ validator: validateCraftValueItem, trigger: 'change' }]"
          class="group"
        >
          <ElementGroupTypeComp
            :Property="it"
            fillWidth
            :errorElementID='errorElementID'
            :errorIndex='errorIndex'
            :showTop='it.Name && !it.IsNameHidden'
            :value="craftForm[it.ID].Value"
            :AffectedPropList='it.AffectedPropList'
            @input="handleGroupChange($event, it)"
            @changeValidate='onChangeValidate(it.ID)'
          />
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
import { checkElement, checkElementGroup } from '@/store/Quotation/Checker';
import QuotationClassType from '@/store/Quotation/QuotationClassType';
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
  },
  components: {
    ElementTypeComp,
    ElementGroupTypeComp,
  },
  computed: {
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
      const list = this.Craft?.GroupList?.filter(it => !it.HiddenToCustomer)
        .map(it => ({ ...it, AffectedPropList: this.getGroupAffectedPropList(it) }))
        .filter(it => this.getClearedHiddenItemData(it));
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
      if (this.AffectedPropList.length === 0) return [];
      return this.AffectedPropList.filter((it) => it.Property && it.Property.Craft && it.Property.Element && !it.Property.Group);
    },
    GroupAffectedPropList() {
      if (this.AffectedPropList.length === 0) return [];
      return this.AffectedPropList.filter((it) => it.Property && it.Property.Craft && it.Property.Group);
    },
  },
  data() {
    return {
      localSetupData: null,
      showMain: false,
      errorElementID: '',
      errorIndex: '',
    };
  },
  methods: {
    onSubmit() {
      this.$refs.craftForm.validate((bool) => {
        if (bool) this.$emit('submit', this.localSetupData);
      });
    },
    generateInitSetupData() { // 生成及初始化设置数据
      if (this.Craft) {
        this.localSetupData = QuotationClassType.getCraftItemSubmitData(
          this.Craft,
        );
      }
    },
    onOpen() {
      if (!this.setupData) this.generateInitSetupData();
      else {
        // 如果有服务器数据编辑还原操作的时候必须考虑排序的问题
        this.localSetupData = JSON.parse(JSON.stringify(this.setupData));
      }
      this.showMain = true;
    },
    onClosed() {
      this.showMain = false;
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
    handleElementChange(CustomerInputValues, el) {
      const t = this.localSetupData.ElementList.find(
        (it) => it.ElementID === el.ID,
      );
      if (t) {
        t.CustomerInputValues = CustomerInputValues;
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
    validateCraftValueItem(rule, value, callback) {
      this.errorElementID = '';
      this.errorIndex = '';
      if (value) {
        const { ID, Type, Value } = value;
        if (Type === 'Element') {
          const target = this.ElementList.find(it => it.ID === ID);
          if (target) {
            const res = checkElement(Value, target);
            if (res && typeof res === 'string') {
              callback(new Error(res));
              return;
            }
          }
        }
        if (Type === 'Group') {
          const target = this.GroupList.find(it => it.ID === ID);
          if (target) {
            const res = checkElementGroup(Value, target);
            if (res && typeof res === 'object' && res.msg) {
              this.errorElementID = res.ElementID;
              this.errorIndex = res.index;
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
      const { AffectedPropList } = it;
      const _AffectedPropList = AffectedPropList.filter((_it) => _it.Property && !_it.Property.Element && _it.Property.Group);
      if (_AffectedPropList.length === 1) {
        return _AffectedPropList[0].Operator !== 22;
      }
      return true;
    },
  },
};
</script>
<style lang='scss'>
.el-dialog__wrapper {
  > .el-dialog.set-craft-dia.mp-place-order-panel-comp-craft-type-item-dialog-comp-wrap {
    width: unset;
    width: auto\0;
    min-width: 520px;
    display: table;
    border-radius: 5px;
    > .el-dialog__header {
      > header {
        height: 14px;
        line-height: 14px;
      }
    }
    > .el-dialog__body {
      margin-left: 20px;
      margin-right: 35px;
      padding-bottom: 25px;
      margin-left: 15px\0;
      margin-right: 15px\0;
      > main {
        .mp-place-order-content-element-type-show-item-comp-wrap {
          > label {
            width: unset;
          }
        }
        // .mp-place-order-panel-element-group-setup-comp-wrap {
        //   margin-left: 5px;
        // }
        .mp-place-order-panel-element-group-setup-comp-wrap {
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
