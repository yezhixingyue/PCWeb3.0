<template>
  <section v-if="_MaterialList.length > 0">
    <MaterialSingleSelector :list='showList' v-model="selectedMaterial" hiddenOption />
    <HelpTipsComp :tipsData='MaterialTipsData' :title="label" />
  </section>
</template>

<script>
// 该组件暂不支持数据还原 及 指定默认物料功能，后续需要时再补充(订单编辑等功能) - 默认物料功能可以通过顺序调整至第一个实现（排序目前仅支持一级大类排序）
import HelpTipsComp from '@/components/QuotationComps/PlaceOrderComps/HelpTipsComp';
import { mapGetters } from 'vuex';
import MaterialSingleSelector from './MaterialSingleSelector.vue';

export default {
  props: {
    MaterialList: {
      type: Array,
      default: () => [],
    },
    value: {
      type: String,
      default: '',
    },
    AffectedPropList: {
      // 受到交互影响的工艺列表
      type: Array,
      default: () => [],
    },
    MaterialTipsData: {
      type: Object,
      default: null,
    },
    label: {
      type: String,
      default: '物料',
    },
  },
  components: {
    MaterialSingleSelector,
    HelpTipsComp,
  },
  computed: {
    ...mapGetters('Quotation', ['affectedMaterialByInteraction']),
    hiddenMatarialList() { // 隐藏物料列表  Operator 21 禁用    22 隐藏    23 必选
      if (this.AffectedPropList.length === 0) return [];
      if (this.AffectedPropList[0].Operator === 22 && this.AffectedPropList[0].OptionList.length > 0) {
        return this.AffectedPropList[0].OptionList;
      }
      return [];
    },
    disabledMatarialList() { // 隐藏物料列表  Operator 21 禁用    22 隐藏    23 必选
      if (this.AffectedPropList.length === 0) return [];
      if (this.AffectedPropList[0].Operator === 21 && this.AffectedPropList[0].OptionList.length > 0) {
        const lastList = this.AffectedPropList[0].OptionList;
        return lastList;
      }
      return [];
    },
    localMaterialList() {
      if (!Array.isArray(this.MaterialList)) return [];
      return this.MaterialList.map(it => ({ ...it, List: it.List.filter(_it => !_it.HiddenToCustomer) })).filter(it => it.List.length > 0);
    },
    _MaterialList() {
      const list = [];
      this.localMaterialList.forEach(it => {
        const _list = it.List.map(m => ({
          ...m,
          Type: {
            ID: it.ID,
            Name: it.Name,
            ElementList: m.ElementList,
            UnionShowList: it.UnionShowList,
          },
        }));
        list.push(..._list);
      });
      const sortList = list.sort((a, b) => {
        const AIndex = a.Index || a.Index === 0 ? a.Index : 999;
        const BIndex = b.Index || b.Index === 0 ? b.Index : 999;
        return AIndex - BIndex;
      });
      return sortList;
    },
    showList() {
      const list = [];
      // const showLabel = true; // 是否显示属性名称，如 克重、颜色等
      const getNameByElementList = _list => { // 给予一个元素列表，获取该列表名称
        const _Name = _list.map(_it => {
          const _label = !_it.IsNameHidden ? _it.Name || '' : '';
          const _value = _it.DisplayContent || '';
          const _unit = _it.Unit || '';
          return `${_label}${_label ? ':' : ''}${_value}${_unit}`;
        }).join(' ');
        return _Name || ' ';
      };
      // const _showLenList = this.localMaterialList.map(it => it.UnionShowList.length);
      // const showRootClass = [...new Set(_showLenList)].length > 1;
      const showRootClass = this.localMaterialList.length > 1;
      this._MaterialList.filter(it => !this.hiddenMatarialList.includes(it.ID)).forEach(lv1 => {
        const { Type, ID } = lv1;
        const { UnionShowList, Name, ElementList } = Type;
        // 1. 寻找已有相同分类
        let t1 = list.find(it => it.ID === (showRootClass ? Type.ID : 'Type'));
        if (!t1) { // 2.如果没有则添加
          const temp = {
            ID: showRootClass ? Type.ID : 'Type',
            Name,
            children: [],
          };
          list.push(temp);
        }
        // 3. 重新寻找一遍 此时肯定会找着
        t1 = list.find(it => it.ID === (showRootClass ? Type.ID : 'Type'));
        if (t1) {
          if (UnionShowList.length === 0) {
            const item = {
              ID,
              Name: getNameByElementList(ElementList),
              disabled: this.disabledMatarialList.includes(ID),
            };
            t1.children.push(item);
          } else {
            let _list;
            UnionShowList.forEach((_unionShowArr, i) => {
              const _ElementList = [];
              _unionShowArr.forEach(_id => {
                const t = ElementList.find(_E => _E.ID === _id);
                if (t) _ElementList.push(t);
              });
              const _Name = getNameByElementList(_ElementList);
              const _ItemID = i < UnionShowList.length - 1 ? `${JSON.stringify(_unionShowArr)}${_Name}` : ID;
              const tempList = _list || t1.children;
              let target = tempList.find(_it => _it.ID === _ItemID);
              if (!target) {
                const _item = {
                  ID: _ItemID,
                  Name: _Name,
                  disabled: i === UnionShowList.length - 1 ? this.disabledMatarialList.includes(ID) : false,
                };
                if (i < UnionShowList.length - 1) _item.children = [];
                const arr1 = _item.Name.match(/\d+(\.\d+)?/g);
                if (arr1 && arr1.length > 0 && 0) {
                  const lastIndex = tempList.findIndex(_it => {
                    const arr2 = _it.Name.match(/\d+(\.\d+)?/g);
                    if (arr2 && arr2.length > 0) {
                      return arr1[arr1.length - 1] > arr2[arr2.length - 1];
                    }
                    return false;
                  });
                  if (lastIndex > -1) {
                    tempList.splice(lastIndex, 0, _item);
                  } else {
                    tempList.push(_item);
                  }
                } else {
                  tempList.push(_item);
                }
              }
              target = tempList.find(_it => _it.ID === _ItemID);
              _list = target.children;
            });
          }
        }
      });
      const getIsDisabled = arr => arr.filter(it => !it.disabled).length === 0;
      const setListDisabled = item => {
        if (item.children && !item.children[0].children) {
          const _item = item;
          _item.disabled = getIsDisabled(item.children);
          _item.lastList = [...item.children];
        } else {
          item.children.forEach(it => setListDisabled(it));
          const _item = item;
          _item.disabled = getIsDisabled(item.children);
          _item.lastList = item.children.reduce((prev, next) => ({ lastList: [...prev.lastList, ...next.lastList] }), { lastList: [] }).lastList;
        }
      };
      list.forEach(it => setListDisabled(it));
      return list;
    },
    selectedMaterial: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
        if (this.affectedMaterialByInteraction) {
          this.$nextTick(() => {
            this.$emit('triggerInteraction');
          });
        }
      },
    },
    curMaterialList() {
      if (!this.showList) return [];
      const t = this.showList.find(it => it.lastList.map(_it => _it.ID).includes(this.value));
      return t ? t.lastList : [];
    },
  },
  data() {
    return {
    };
  },
  methods: {
    handleInterAction(list) {
      if (!Array.isArray(list) || list.length === 0) return;
      if (list.includes(this.value)) {
        // let t = this.curMaterialList.find(it => it.disabled && it.ID !== this.value && !list.includes(it.ID));
        // if (!t) t = this._MaterialList.find(it => !it.HiddenToCustomer && it.ID !== this.value && !list.includes(it.ID));
        // this.selectedMaterial = t ? t.ID : '';
        this.selectedMaterial = '';
      }
    },
  },
  watch: {
    disabledMatarialList: {
      handler(val) {
        this.handleInterAction(val);
      },
      immediate: true,
    },
    hiddenMatarialList: {
      handler(val) {
        this.handleInterAction(val);
      },
      immediate: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.selectedMaterial) {
        let t = this.curMaterialList.find(it => it.disabled && it.ID !== this.value && !this.disabledMatarialList.includes(it.ID));
        if (!t) t = this._MaterialList.find(it => !it.HiddenToCustomer && it.ID !== this.value && !this.hiddenMatarialList.includes(it.ID));
        this.selectedMaterial = t ? t.ID : '';
      }
    });
  },
};
</script>
<style lang='scss'>
</style>
