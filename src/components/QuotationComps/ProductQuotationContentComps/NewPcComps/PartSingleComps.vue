<template>
  <article class="mp-duotation-content-part-comps-wrap">
    <part-single-comp
      v-for="(item, i) of PartData.PartList"
      :key="item.singlePartID"
      :indexLv1="index"
      :indexLv2="i"
      :data="item"
      :canDel="PartData.AllowChangePartNumber && PartData.PartList.length > PartData.PartList[0].MinUsePart"
      @handleAddPart="handleAddPart"
      :showAddBtn='PartData.PartList[0] && PartData.PartList[0].MaxUsePart
        && (PartData.PartList[0].MaxUsePart > PartData.PartList.length || PartData.PartList[0].MaxUsePart === -1)
        && PartData.AllowChangePartNumber'
    />
    <div v-if="localPartData && PartData.PartList.length === 0" class="add-box">
      <span class="header-title point is-bold">// {{localPartData.PartName}}</span>
      <div class="add-btn">
        <span class="span-title-blue" @click="handleAddPart">+ 添加{{localPartData.PartName}}</span>
      </div>
    </div>
  </article>
</template>

<script>
import { mapMutations } from 'vuex';
import PartSingleComp from '@/components/QuotationComps/ProductQuotationContentComps/NewPcComps/PartSingleComp.vue';

export default {
  props: {
    PartData: {
      type: Object,
      default: () => ({}),
    },
    // 代表当前部件数据在整个数据中的位置，从而可定位到
    index: {
      type: Number,
    },
  },
  components: {
    PartSingleComp,
  },
  methods: {
    ...mapMutations('Quotation', ['addPartProductParamsPartList', 'delPartProductParamsPartList']),
    handleAddPart() {
      const _temp = {
        ...this.localPartData,
        singlePartID: this.PartData.PartID + (`${Math.random()}`).replace('.', ''),
      };
      this.addPartProductParamsPartList([this.index, _temp]);
    },
  },
  data() {
    return {
      localPartData: null,
    };
  },
  mounted() {
    this.localPartData = JSON.parse(JSON.stringify(this.PartData.PartList[0]));
    if (this.PartData.PartList.length === 1 && this.PartData.PartList[0].MinUsePart === 0) {
      this.delPartProductParamsPartList([this.index, 0]);
    }
  },
};
</script>

<style lang="scss">
.mp-duotation-content-part-comps-wrap {
  > .add-box {
    padding: 10px 0 0px 0;
    > .header-title {
      padding-left: 6px;
      color: #333;
      display: block;
      padding-bottom: 8px;
    }
    > .add-btn {
      text-align: right;
      border-top: 1px dashed #eee;
      padding-top: 8px;
      > .span-title-blue {
        font-size: 13px;
      }
    }
  }
  padding-bottom: 10px;
  &:last-of-type {
    > .add-box {
      padding-bottom: 30px;
    }
  }
}
</style>
