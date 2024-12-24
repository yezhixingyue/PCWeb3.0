<template>
  <component :is="tagName">
    <OrderDetailDisplayItem :ShowData='ProductShowData' />
    <OrderDetailDisplayItem v-for="(it, i) in PartShowDataList" :ShowData='it' :key="it.Name" :class="{border: i > 0}" showBorder />
  </component>
</template>

<script>
import ShowProductDetail from '@/store/Quotation/ShowProductDetail';
import OrderDetailDisplayItem from '@/packages/OrderDetailDisplayItem';

export default {
  props: {
    tagName: {
      type: String,
      default: 'div',
    },
    OrderDetail: {
      type: Object,
      default: null,
    },
  },
  components: {
    OrderDetailDisplayItem,
  },
  computed: {
    ProductShowData() {
      let Name = this.OrderDetail?.ProductParams?.Attributes?.DisplayName || '产品名称';
      if (Array.isArray(this.OrderDetail?.ProductParams?.Attributes?.ClassList)) {
        const t = this.OrderDetail.ProductParams.Attributes.ClassList.find(it => it.Type === 2);
        if (t && t.SecondLevel?.Name) {
          Name = `${t.SecondLevel.Name}-${Name}`;
        }
        if (t && t.FirstLevel?.Name) {
          Name = `${t.FirstLevel.Name}-${Name}`;
        }
      }
      if (this.OrderDetail?.ProductParams?.Attributes?.DisplayOrderList && this.OrderDetail.ProductParams.Attributes.DisplayOrderList.length > 0) {
        return {
          Name,
          ContentList: ShowProductDetail.getDisplayContentFromPartDataByDetailData(
            this.OrderDetail.ProductParams.Attributes.DisplayOrderList, this.OrderDetail.ProductParams,
          ),
          Type: 'product',
        };
      }
      return {
        Name,
        ContentList: [],
        Type: 'product',
      };
    },
    PartList() {
      if (!this.OrderDetail) return [];
      if (!this.OrderDetail.ProductParams) return [];
      return this.OrderDetail.ProductParams.PartList;
    },
    PartShowDataList() {
      const arr = [];
      this.PartList.forEach(it => {
        if (Array.isArray(it.List)) {
          it.List.forEach((part, index) => {
            const ContentList = ShowProductDetail.getDisplayContentFromPartDataByDetailData(it.Attributes.DisplayOrderList, part);
            const Name = it.List.length > 1 ? `${it.Attributes.Name}${index + 1}` : it.Attributes.Name;
            const temp = {
              Name,
              Type: 'Part',
              ContentList: ContentList || [],
            };
            arr.push(temp);
          });
        }
      });
      return arr;
    },
  },
};
</script>
