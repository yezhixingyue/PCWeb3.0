<template>
  <div class="mp-product-detail-common-comp-wrap" v-if="productData">
    <!-- 产品名称 -->
    <section class="title">
      <span class="left-title-line"
        >{{ curProductShowNameInfo[0] }}-{{ curProductShowNameInfo[1] }}-<i>{{
          curProductShowNameInfo[2]
        }}</i></span
      >
    </section>
    <!-- 数量 款数 -->
    <section class="num-count-wrap">
      <div>
        <span class="is-gray">数量：</span>
        <span>{{ productData.ProductAmount }}{{ productData.Unit }}</span>
      </div>
      <div v-if="productData.KindCount > 0">
        <span class="is-gray">款数：</span>
        <span>{{ productData.KindCount }}款</span>
      </div>
    </section>
    <!-- 联拼行列数及是否允许多款联拼 -->
    <section
      class="multy-kind-makeup-wrap"
      v-if="
        productData.MakeupRowNumber > 1 || productData.MakeupColumnNumber > 1
      "
    >
      <div>
        <span class="is-gray">联拼行数：</span>
        <span>{{ productData.MakeupRowNumber }}行</span>
      </div>
      <div v-if="productData.KindCount > 0">
        <span class="is-gray">联拼列数：</span>
        <span>{{ productData.MakeupColumnNumber }}列</span>
      </div>
    </section>
    <!-- 属性 -->
    <section
      v-if="productData.PropertyList.length > 0"
      class="product-attributes-wrap"
    >
      <div v-for="item of productData.PropertyList" :key="item.PropertyID">
        <span class="is-gray">{{ item.PropertyName }}：</span>
        <span v-if="item.ValueType === 1"
          >{{ item.CustomerInputValue }}
          {{
            item.UserDefinedUnit
              ? item.UserDefinedUnit
              : $utils.getUnit(item.Unit)
          }}</span
        >
        <span v-else-if="item.ValueType === 2">
          {{ geAttrValue(item) }}
        </span>
      </div>
    </section>
    <!-- 必选工艺 -->
    <ProductCraftShowComps
      v-if="productData.CraftList.length > 0"
      :craftList="
        getCraftList(
          productData.CraftList,
          productData.CraftList2Req.First,
          'require'
        )
      "
    />
    <!-- 可选工艺 -->
    <ProductCraftShowComps
      title="可选工艺"
      v-if="productData.CraftList.length > 0"
      :craftList="
        getCraftList(
          productData.CraftList,
          productData.CraftList2Req.First,
          'noRequire'
        )
      "
    />
    <!-- 产品部件展示 -->
    <ProductPartShowComp
      v-for="partData of productData.PartList"
      :key="partData.PartID"
      :partDataList="partData.PartList"
      :totalData="productData"
    />
  </div>
</template>

<script>
import ProductCraftShowComps from '@/components/QuotationComps/ProductDetailComps/ProductCraftShowComps.vue';
import ProductPartShowComp from '@/components/QuotationComps/ProductDetailComps/ProductPartShowComp.vue';
import { mapGetters } from 'vuex';

export default {
  props: {
    productData: {
      type: Object,
      default: null,
    },
  },
  components: {
    ProductCraftShowComps,
    ProductPartShowComp,
  },
  computed: {
    ...mapGetters('Quotation', ['curProductShowNameInfo']),
  },
  methods: {
    geAttrValue(item) {
      if (item.CustomizedOptionValue) return item.CustomizedOptionValue;
      if (item.CustomerInputValue && item.OptionList.length > 0) {
        const _t = item.OptionList.find(
          _it => _it.OptionID === item.CustomerInputValue,
        );
        return _t.Value;
      }
      return item.CustomerInputValue;
    },
    getCraftList(list1, list2, type) {
      let _target;
      if (type === 'require') {
        _target = list1.find(it => it.ChoiceType === 2);
      } else {
        _target = list1.find(it => it.ChoiceType === 1);
      }
      if (!_target || !_target.CraftList) return [];
      const _idList = _target.CraftList.map(it => it.CraftID);
      return list2.filter(it => _idList.includes(it.CraftID));
    },
  },
};
</script>

<style lang="scss">
// @import "@/assets/css/Common/var.scss";
.mp-product-detail-common-comp-wrap {
  background-color: #fff;
  width: 100%;
  padding: 12.5px;
  padding-bottom: 35px;
  font-size: 13px;
  box-sizing: border-box;
  > section {
    // color: $--color-text-primary;
    margin: 12.5px 0;
    &.num-count-wrap,
    &.multy-kind-makeup-wrap {
      display: flex;
      > div:first-of-type {
        width: 130px;
      }
    }
    &.title {
      font-size: 14px;
      // color: $--color-dark;
      margin-bottom: 18px !important;
      // height: 20px;
      // line-height: 20px;
      > span {
        > i {
          font-size: 15px;
          font-weight: 700;
        }
      }
    }
  }
  .product-attributes-wrap {
    display: flex;
    > div {
      min-width: 100px;
      margin-right: 30px;
    }
  }
}
</style>
