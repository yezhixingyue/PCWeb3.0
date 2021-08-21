<template>
  <li class="mp-place-order-panel-comp-craft-type-item-comp-wrap">
    <ShowProductBtn
      @click.native="handleClick"
      :title="craftTitle"
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
    craftTitle() {
      return this.getCraftContentName();
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
    getElementValueText(CustomerInputValues, Element) {
      console.log(CustomerInputValues, Element);
      if (!CustomerInputValues || CustomerInputValues.length === 0 || !Element) return '';
      if (CustomerInputValues.length === 1) {
        const [{ ID, Name, Value }] = CustomerInputValues;
        if (Element.Type === 3) { // 开关
          if (Element.SwitchAttribute && `${Element.SwitchAttribute.OpenValue}` === Value) return Element.Name;
        }
        if (Element.Type === 1 && Value) { // 数值
          return `${Value}${Element.Unit}`;
        }
        if (Element.Type === 2 && Element.OptionAttribute && Element.OptionAttribute.IsRadio && Element.OptionAttribute.OptionList) {
          if (ID) {
            const t = Element.OptionAttribute.OptionList.find(_it => _it.ID === ID);
            if (t) return t.Name;
          }
          if (Name) return Name;
        }
      }
      if (Element.Type === 2 && Element.OptionAttribute && !Element.OptionAttribute.IsRadio && Element.OptionAttribute.OptionList) {
        const ids = CustomerInputValues.map(it => it.ID).filter(it => it);
        if (ids.length > 0) {
          const names = ids.map(id => Element.OptionAttribute.OptionList.find(it => it.ID === id)).filter(it => it);
          return names.join('，');
        }
      }
      return '';
    },
    getGroupValueText(List, Group) {
      if (List.length > 1) return `${Group.Name}${List.length}处`;
      if (List.length === 1) {
        const item = List[0];
        const arr = [];
        item.List.forEach(({ ElementID, CustomerInputValues }) => {
          const t = Group.ElementList.find(_it => _it.ID === ElementID);
          if (t) {
            const text = this.getElementValueText(CustomerInputValues, t);
            if (text) arr.push(text);
          }
        });
        if (arr.length > 0) return `${Group.Name} [ ${arr.join(' ')} ]`;
      }
      return '';
    },
    getCraftContentName() {
      if (!this.Craft) return '工艺';
      if (!this.value) return this.Craft.Name;
      const { ElementList, GroupList } = this.value;
      if ((!Array.isArray(ElementList) || ElementList.length === 0) && (!Array.isArray(GroupList) || GroupList.length === 0)) return this.Craft.Name;
      const ElContent = [];
      const GroupContent = [];
      if (Array.isArray(ElementList) && ElementList.length > 0) {
        ElementList.forEach(it => {
          const t = this.Craft.ElementList.find(_it => _it.ID === it.ElementID);
          if (t) {
            const text = this.getElementValueText(it.CustomerInputValues, t);
            if (text) ElContent.push(text);
          }
        });
      }
      if (Array.isArray(GroupList) && GroupList.length > 0) {
        GroupList.forEach(it => {
          const t = this.Craft.GroupList.find(_it => _it.ID === it.GroupID);
          if (t) {
            const text = this.getGroupValueText(it.List, t);
            if (text) GroupContent.push(text);
          }
        });
      }
      if (ElContent.length > 0 || GroupContent.length > 0) {
        return `${this.Craft.Name} ${ElContent.join(' ')} ${GroupContent.join('')}`;
      }
      return this.Craft.Name;
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
