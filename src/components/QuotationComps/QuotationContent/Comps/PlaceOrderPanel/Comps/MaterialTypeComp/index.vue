<template>
  <section v-if="MaterialList.length > 0">
    <MaterialSingleSelector :list='showList' v-model="selectedMaterial" hiddenOption />
  </section>
</template>

<script>
// 该组件暂不支持数据还原 及 指定默认物料功能，后续需要时再补充(订单编辑等功能) - 默认物料功能可以通过顺序调整至第一个实现（排序目前仅支持一级大类排序）
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
  },
  components: {
    MaterialSingleSelector,
  },
  computed: {
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
    showList() {
      const list = [];
      // const showLabel = true; // 是否显示属性名称，如 克重、颜色等
      const getNameByElementList = _list => { // 给予一个元素列表，获取该列表名称
        const _Name = _list.map(_it => {
          const _label = !_it.IsNameHidden ? _it.Name || '' : '';
          const _value = _it.DisplayContent || '';
          const _unit = _it.Unit || '';
          return `${_label}${_value}${_unit}`;
        }).join(' ');
        return _Name;
      };
      this.MaterialList.filter(it => !this.hiddenMatarialList.includes(it.ID)).forEach(lv1 => {
        const { Type, ID } = lv1;
        const { UnionShowList, Name, ElementList } = Type;
        // 1. 寻找已有相同分类
        let t1 = list.find(it => it.ID === Type.ID);
        // let t1 = list.find(it => it.ID === 'Type');
        if (!t1) { // 2.如果没有则添加
          const temp = {
            ID: Type.ID,
            // ID: 'Type',
            Name,
            children: [],
          };
          list.push(temp);
        }
        // 3. 重新寻找一遍 此时肯定会找着
        t1 = list.find(it => it.ID === Type.ID);
        // t1 = list.find(it => it.ID === 'Type');
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
              const _Name = getNameByElementList(ElementList.filter(_it => _unionShowArr.includes(_it.ID)));
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
                tempList.push(_item);
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
        } else {
          item.children.forEach(it => setListDisabled(it));
          const _item = item;
          _item.disabled = getIsDisabled(item.children);
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
      },
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
