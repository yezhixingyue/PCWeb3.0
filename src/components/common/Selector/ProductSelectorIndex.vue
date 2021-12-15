<template>
  <ul class="mp-pc-order-product-select-wrap">
    <li class="text" v-if="!hiddenLabel">
      <span>产品：</span>
    </li>
    <li class="first-select-box">
      <select-comp
        :title="first"
        :size='size'
        :useOrigin='useOrigin'
        :options='largeProduct'
        :disabled='disabled'
        :placeholder='!hasAll ? level1EmptyLabel : "请选择"'
        :defaultProps='{label: "ClassName",value: "ID"}'
        @handleChange="handleSwitch1" />
    </li>
    <li>
      <select-comp
        :title="second"
        :size='size'
        :useOrigin='useOrigin'
        :options='midProduct'
        :disabled='disabled'
        :defaultProps='{label: "ClassName",value: "ID"}'
        :placeholder='!hasAll ? level2EmptyLabel : "请选择"'
        @handleChange="handleSwitch2" />
    </li>
    <li>
      <select-comp
        :title="third"
        :size='size'
        :useOrigin='useOrigin'
        :options='productThirdList'
        :disabled='disabled'
        :defaultProps='{label: "ProductName",value: "ProductID"}'
        :placeholder='!hasAll ? level3EmptyLabel : "请选择"'
        @handleChange="handleSwitch3" />
    </li>
  </ul>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import SelectComp from '../SelectComp.vue';

export default {
  components: {
    SelectComp,
  },
  props: {
    ClassID: {
      default: '',
      required: true,
    },
    TypeID: {
      default: '',
      required: true,
    },
    ProductID: {
      // default: '',
      required: true,
    },
    changePropsFunc: {
      type: Function,
      default: () => {},
    },
    /**
     * 每个值对应的修改时的路径类型列表
     */
    typeList: {
      type: Array,
      default: () => [],
    },
    requestFunc: {
      type: Function,
      default: () => {},
    },
    hiddenLabel: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'mini',
    },
    useOrigin: {
      type: Boolean,
      default: false,
    },
    level1EmptyLabel: {
      type: String,
      default: '不限',
    },
    level2EmptyLabel: {
      type: String,
      default: '不限',
    },
    level3EmptyLabel: {
      type: String,
      default: '不限',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    hasAll: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState('Quotation', ['productClassify', 'productNames']),
    largeProduct() {
      const arr = this.hasAll ? [{ ID: '', ClassName: this.level1EmptyLabel }] : [];
      if (this.productClassify.length > 0) {
        const tempArr = this.productClassify.filter((item) => item.Level === 1);
        return [...arr, ...tempArr];
      }
      return arr;
    },
    midProduct() {
      const arr = this.hasAll ? [{ ID: '', ClassName: this.level2EmptyLabel }] : [];
      const id = this.first;
      if (id) {
        const tempArr = this.productClassify.filter((item) => item.ParentID === id);
        return [...arr, ...tempArr];
      }
      return arr;
    },
    first: {
      get() {
        return this.ClassID;
      },
      set(newVal) {
        if (newVal === this.ClassID) return;
        this.changePropsFunc([this.typeList[0], newVal]);
        this.requestFunc();
      },
    },
    second: {
      get() {
        return this.TypeID;
      },
      set(newVal) {
        if (newVal === this.TypeID) return;
        this.changePropsFunc([this.typeList[1], newVal]);
        this.requestFunc();
      },
    },
    third: {
      get() {
        return this.ProductID;
      },
      set(newVal) {
        if (newVal === this.ProductID) return;
        this.changePropsFunc([this.typeList[2], newVal]);
        this.requestFunc();
      },
    },
    productThirdList() {
      const _arr = this.productNames.filter(it => {
        const t = it.ClassifyList.find(_it => _it.Type === 2);
        if (t) {
          return t.FirstLevel.ID === this.first && t.SecondLevel.ID === this.second;
        }
        return false;
      }).filter(it => it).map(it => ({ ProductID: it.ID, ProductName: it.ShowName }));
      return this.hasAll ? [{ ProductID: '', ProductName: this.level3EmptyLabel }, ..._arr] : [..._arr];
    },
  },
  methods: {
    // ...mapActions('common', ['getproductClassify', 'getProductThird', 'getAllproductNames']),
    ...mapActions('Quotation', ['getProductClassify']),
    // onMidSelect(arr) {
    //   this.setProductClass2(arr);
    //   if (arr[0]) this.getProductThird();
    // },
    handleSwitch1(e) {
      if (e === this.first) return;
      this.changePropsFunc([this.typeList[1], '']);
      this.changePropsFunc([this.typeList[2], '']);
      this.first = e;
      // this.TypeID = '';
      // this.ProductID = '';
      this.products = [{ ProductID: '', ProductName: this.level3EmptyLabel }];
    },
    handleSwitch2(e) {
      if (e === this.second) return;
      this.changePropsFunc([this.typeList[2], '']);
      this.second = e;
      // this.ProductID = '';
      // this.getProductThird();
    },
    handleSwitch3(e) {
      if (e === this.third) return;
      this.third = e;
    },
    // async getProductThird() {
    //   // 获取产品列表数据
    //   const _obj = {};
    //   _obj.ProductClass = {
    //     First: this.first,
    //     Second: this.second,
    //   };
    //   _obj.FieldType = 1;
    //   const res = await this.api.getproductClassifys(_obj);
    //   if (res.data.Status === 1000)
    //     this.products = [{ ProductID: '', ProductName: '不限' }, ...res.data.Data];
    // },
  },
  mounted() {
    // this.getproductClassify();
    // this.getAllproductNames();
    this.getProductClassify();
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
 .mp-pc-order-product-select-wrap{
   display: inline-block;
   > li {
      margin-right: 15px;
      display: inline-block;
      &.text {
        font-size: 14px;
        color: #585858;
        font-weight: 600;
        line-height: 25px;
        width: 5em;
        text-align: right;
        > span {
          line-height: 18px;
        }
      }
      > .el-select.mp-common-select-comp-wrap {
        > .el-input > input {
          color: #585858;
          font-size: 14px;
        }
      }
      .el-input__inner {
        width: 120px;
      }
      &.first-select-box .el-input__inner{
        width: 120px;
      }
    }
 }
</style>
