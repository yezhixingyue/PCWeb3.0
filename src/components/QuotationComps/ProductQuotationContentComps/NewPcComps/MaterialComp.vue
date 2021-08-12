<template>
  <section class="mp-pc-material-comp-wrap">
    <span class="title gray">{{title}}：</span>
    <el-select v-model="lv1Val">
      <el-option
        v-for="(item, i) in optionList1"
        :key="item + i"
        :label="item"
        :value="item">
      </el-option>
    </el-select>
    <el-select v-model="inpValue" v-show="optionList2.length > 1 || optionList2[0].Name">
      <el-option
        v-for="item in optionList2"
        :key="item.MaterialID"
        :label="item.Name"
        :value="item.MaterialID">
      </el-option>
    </el-select>
    <HelpTipsComp :title="partTitle + '' + title" :tipsData='tipsData' />
  </section>
</template>

<script>
/* eslint-disable prefer-destructuring */
import tipEnums from '@/assets/js/utils/tipEnums';
import HelpTipsComp from '@/components/QuotationComps/PlaceOrderComps/HelpTipsComp.vue';
import { mapState } from 'vuex';

export default {
  model: {
    prop: 'value',
    event: 'changeFunc',
  },
  components: {
    HelpTipsComp,
  },
  props: {
    option: { // 选择项列表
      type: Array,
      default: () => [],
    },
    data: {},
    partTitle: {},
    value: { // v-model绑定值
      required: true,
    },
    title: {
      type: String,
      default: '标题',
    },
    disabled: {},
  },
  data() {
    return {
      option1: '',
    };
  },
  computed: {
    ...mapState('Quotation', ['obj2GetProductPrice']),
    inpValue: {
      get() {
        return this.value;
      },
      set(newVal) {
        this.$emit('changeFunc', newVal);
      },
    },
    optionObj() {
      const _list = this.option.map(it => {
        const { KindName } = it.Kind;
        const Name = it.Name.replace(KindName, '');
        return { MaterialID: it.MaterialID, Name: [KindName, Name] };
        // return { Name, MaterialID: it.MaterialID, KindName };
      });
      // .map(it => {
      //   console.log(it);
      // const r = /^\D+\d+\D+$/;
      // if (r.test(it.Name)) {
      //   const _arr1 = it.Name.trim().split('');
      //   const _arr2 = _arr1.filter(sub => !!sub);
      //   const reg = /\d/;
      //   const i = _arr2.findIndex(subIt => reg.test(subIt));
      //   const _t1 = _arr2.slice(0, i).join('');
      //   const _s1 = _arr2.slice(i).join('');

      //   return { ...it, Name: [_t1, _s1] };
      // }
      // return { ...it, Name: [it.Name, ''] };
      // });
      const _obj = {};
      _list.forEach(item => {
        if (!item.Name || item.Name.length !== 2) return;
        const _k = item.Name[0];
        const _v = { ...item, Name: item.Name[1] };
        if (!_obj[_k]) _obj[_k] = [];
        _obj[_k].push(_v);
      });
      return _obj;
    },
    optionList1() {
      const _list = Object.keys(this.optionObj);
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      if (!this.lv1Val) this.lv1Val = _list[0];
      return _list;
    },
    optionList2() {
      if (!this.lv1Val) return [];
      return this.optionObj[this.lv1Val];
    },
    lv1Val: {
      get() {
        return this.option1;
      },
      set(newVal) {
        if (newVal === this.option1) return;
        this.option1 = newVal;
        const _v = this.optionObj[newVal][0].MaterialID;
        this.$emit('changeFunc', _v);
      },
    },
    tipsData() {
      if (!this.obj2GetProductPrice
       || !this.obj2GetProductPrice.ProductParams || !this.obj2GetProductPrice.ProductParams.TipsDetail) return null;
      const { BaseTips } = this.obj2GetProductPrice.ProductParams.TipsDetail;
      if (!BaseTips || BaseTips.length === 0 || !this.data) return null;
      const _arr = BaseTips.filter(it => it.Type === tipEnums.Material);
      if (_arr.length === 0) return null;
      const { PartID } = this.data;
      if (!PartID) return null;
      const t = _arr.find(it => it.Part.ID === PartID);
      if (!t) return null;
      return t;
    },
  },
};
</script>

<style lang='scss'>
.mp-pc-material-comp-wrap {
  > .el-select + .el-select {
    margin-left: 8px;
  }
}
</style>
