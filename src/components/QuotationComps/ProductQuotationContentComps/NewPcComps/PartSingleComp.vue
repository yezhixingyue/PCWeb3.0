<!--
 * @Describe: 部件 mp-duotation-content-comps-part-comp-wrap
 * @FilePath: /src/components/QuotationComps/ProductQuotationContentComps/NewPcComps/PartSingleComp.vue
-->
<template>
  <MpCollapseComp
    class="mp-duotation-content-part-comp-wrap"
    v-show="!canHidePartComponent"
    :h="h"
  >
    <template #header v-if="!showTitle">
      <header>
        <span class="header-title point" ref="headerTitle">
          // {{ data.PartName }}{{ indexLv2 > 0 ? '-' +(indexLv2 + 1) : "" }}
          <HelpTipsComp :tipsData="tipsData" :title='data.PartName' />
        </span>
        <span class="line" :style='headerWidth'></span>
      </header>
    </template>

    <div v-if="show" class="comp-content-wrap">
      <!-- 数量 物料-->
      <section class="part-count-material-box"
        v-show="!(data.MinNumber && data.MinNumber === data.MaxNumber) || data.MaterialList.length > 1">
        <single-input-comp
          title="数量"
          :remark="data.Unit"
          :minNum="data.MinNumber"
          :maxNum="data.MaxNumber"
          v-model.lazy="PartAmount"
          :disabled="!data.PartAmount.Second"
        />
        <HelpTipsComp v-show="!(data.MinNumber && data.MinNumber === data.MaxNumber)"
         :tipsData="countTipsData" :title='`${data.PartName}数量`' />

        <!-- 物料与物料品牌 -->
        <MaterialComp
          title="物料"
          v-model="PartMaterial"
          v-if="data.MaterialList.length > 1"
          :option="data.MaterialList"
          :disabled="!data.Material.Second"
          :data='data'
          :partTitle='data.PartName'
        />
      </section>

      <!-- 属性 -->
      <attributes-comp :partID='data.PartID' v-model="PartAttributeList" />

      <!-- 尺寸组 -->
      <size-group-comp
        :title="data.SizeGroup.GroupName"
        v-if="data.SizeGroup"
        :SizeGroup="data.SizeGroup"
        :SizeList="data.SizeList"
        :remark="sizeGroupRemark"
        v-model="PartSizeGroup"
        :disabled="!data.Size.Second"
        :SizePropertyList="data.SizePropertyList"
        :AllowCustomSize='data.AllowCustomSize'
        :CheckedCustomSize='data.CheckedCustomSize'
        :data='data'
        :partTitle='data.PartName'
      />

      <!-- 印刷属性 -->
      <print-type-list-comps :partID='data.PartID' v-model="PartPrintTypeList" />
      <!-- <attributes-comp v-model="PartPrintTypeList" /> -->

      <!-- 印刷属性组 -->
      <attributes-group-comp
        v-model="PartPrintPropertyGroupList"
        :partID='data.PartID'
        @addPropertyGroup="
          data => addPartPrintPropertyGroupList([indexLv1, indexLv2, data])
        "
        @delPropertyGroup="
          data => delPartPrintPropertyGroupList([indexLv1, indexLv2, data])
        "
      />

      <!-- 属性组 -->
      <attributes-group-comp
        v-model="PartPropertyGroupList"
        :partID='data.PartID'
        @addPropertyGroup="
          data => addPartPropertyGroupList([indexLv1, indexLv2, data])
        "
        @delPropertyGroup="
          data => delPartPropertyGroupList([indexLv1, indexLv2, data])
        "
      />

      <!-- 必选工艺 -->
      <craft-list-comp
        title="必选工艺"
        v-if="RequiredCraft"
        :selectedArr="data.PartCraftList2Req.First"
        @setCraftList="
          data => setPartProductParamsCraftList([indexLv1, indexLv2, data])
        "
        :data="RequiredCraft"
        :partData="data"
      />

      <!-- 可选工艺 -->
      <craft-list-comp
        title="可选工艺"
        v-if="notRequiredCraft"
        :selectedArr="data.PartCraftList2Req.First"
        @setCraftList="
          data => setPartProductParamsCraftList([indexLv1, indexLv2, data])
        "
        :data="notRequiredCraft"
        :partData="data"
        @setCraftstate="
          data => setCraftItemDisabled4Part([indexLv1, indexLv2, data])
        "
      />
      <section class="menu-box">
        <div class="del-btn">
          <span v-if="canDel" @click.stop="handleDelClick" class="iconfont icon-shanchu is-pink" >
            <i class="menu-item-sm is-font-13">删除</i>
          </span>
        </div>
        <div class="line"></div>
        <div class="add-btn">
          <span v-if="showAddBtn" @click.stop="handleAddClick">
            <i class="span-title-blue">+ 添加{{data.PartName}}</i>
          </span>
        </div>
      </section>
    </div>

    <!-- <template #will-not-collapse></template> -->
  </MpCollapseComp>
</template>

<script>
/* eslint-disable max-len */
import MpCollapseComp from '@/components/QuotationComps/SMComps/MpCollapseComp.vue';
import SingleInputComp from '@/components/QuotationComps/ProductQuotationContentComps/NewPcComps/SingleInputComp.vue';
import AttributesComp from '@/components/QuotationComps/ProductQuotationContentComps/NewPcComps/AttributesComp.vue';
import SizeGroupComp from '@/components/QuotationComps/ProductQuotationContentComps/NewPcComps/SizeGroupComp.vue';
import AttributesGroupComp from '@/components/QuotationComps/ProductQuotationContentComps/NewPcComps/AttributesGroupComp.vue';
import CraftListComp from '@/components/QuotationComps/ProductQuotationContentComps/NewPcComps/CraftListComp.vue';
import PrintTypeListComps from '@/components/QuotationComps/ProductQuotationContentComps/NewPcComps/PrintTypeListComps.vue';
import { mapState, mapMutations } from 'vuex';
import tipEnums from '@/assets/js/utils/tipEnums';

import MaterialComp from '@/components/QuotationComps/ProductQuotationContentComps/NewPcComps/MaterialComp.vue';
import HelpTipsComp from '@/components/QuotationComps/PlaceOrderComps/HelpTipsComp.vue';

export default {
  components: {
    MpCollapseComp,
    SingleInputComp,
    AttributesComp,
    MaterialComp,
    SizeGroupComp,
    AttributesGroupComp,
    CraftListComp,
    PrintTypeListComps,
    HelpTipsComp,
  },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    // 代表当前部件数据在整个数据中的位置，第一级索引位
    indexLv1: {
      type: Number,
    },
    // 代表当前部件数据在整个数据中的位置，第二级索引位
    indexLv2: {
      type: Number,
    },
    /**
     * 是否可以删除部件 -- 按钮是否显示
     */
    canDel: {
      type: Boolean,
      default: true,
    },
    showAddBtn: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState('Quotation', ['obj2GetProductPrice']),
    showTitle() {
      if (
        this.obj2GetProductPrice.ProductParams.PartList.length === 1
        && this.obj2GetProductPrice.ProductParams.PartList[0].PartList.length
          === 1
        && this.data.MinUsePart === 1
        && this.data.MaxUsePart === 1
      ) {
        return true;
      }
      return false;
    },
    PartAmount: {
      get() {
        return this.data.PartAmount.First;
      },
      set(newVal) {
        this.setQuotationPartPlainInfo([this.indexLv1, this.indexLv2, 'PartAmount', `${newVal}`]);
      },
    },
    PartMaterial: {
      get() {
        return this.data.Material.First;
      },
      set(newVal) {
        // console.log(newVal);
        this.setQuotationPartPlainInfo([this.indexLv1, this.indexLv2, 'Material', `${newVal}`]);
      },
    },
    PartMaterialBrand: {
      get() {
        return this.data.MaterialBrand.First;
      },
      set(newVal) {
        this.setQuotationPartPlainInfo([this.indexLv1, this.indexLv2, 'MaterialBrand', `${newVal}`]);
      },
    },
    PartAttributeList: {
      get() {
        return this.data.PropertyList;
      },
      set([data, index, type]) {
        this.setQuotationPartPropertyList([this.indexLv1, this.indexLv2, index, data, type]);
      },
    },
    sizeGroupRemark() {
      const _list = this.data.SizeGroup.PropertyList;
      const _arr = _list.map(it => it.PropertyName);
      const _unitID = _list[0].Unit;
      let _unit;
      if (_unitID === 13) _unit = 'mm';
      else _unit = this.$utils.getUnit(_unitID);
      _arr.push(_unit);
      return _arr;
    },
    // 尺寸
    PartSizeGroup: {
      get() {
        return this.data.Size.First;
      },
      set([newVal, sizelist]) {
        this.setQuotationPartPlainInfo([this.indexLv1, this.indexLv2, 'Size', `${newVal}`]);
        this.setQuotationPartSizePropertyList([this.indexLv1, this.indexLv2, sizelist]);
      },
    },
    PartPrintTypeList: {
      get() {
        return this.data.PrintTypeList;
      },
      set([data, index]) {
        this.setQuotationPartPrintPropertyList([this.indexLv1, this.indexLv2, index, data]);
      },
    },
    PartPrintPropertyGroupList: {
      get() {
        return this.data.PrintPropertyGroupList;
      },
      set([[value, index3, type], index1, index2]) {
        this.setPrintPropertyGroupList([this.indexLv1, this.indexLv2, index1, index2, index3, value, type]);
      },
    },
    PartPropertyGroupList: {
      get() {
        return this.data.PropertyGroupList;
      },
      set([[value, index3, type], index1, index2]) {
        this.setPropertyGroupList([this.indexLv1, this.indexLv2, index1, index2, index3, value, type]);
      },
    },
    RequiredCraft() {
      if (this.data.CraftList.length === 0) return null;
      const _data = this.data.CraftList.find(it => it.ChoiceType === 2);
      return _data;
    },
    notRequiredCraft() {
      if (this.data.CraftList.length === 0) return null;
      const _data = this.data.CraftList.find(it => it.ChoiceType === 1);
      return _data;
    },
    canHidePartComponent() {
      return (
        this.data.MinNumber
        && this.data.MinNumber === this.data.MaxNumber
        && this.data.MaterialList.length === 0
        && this.data.BrandList.length === 0
        && this.PartAttributeList.length === 0
        && !this.data.SizeGroup
        && this.PartPrintTypeList.length === 0
        && this.PartPrintPropertyGroupList.length === 0
        && this.PartPropertyGroupList.length === 0
        && !this.RequiredCraft
        && !this.notRequiredCraft
      );
    },
    tipsData() {
      if (!this.obj2GetProductPrice || !this.obj2GetProductPrice.ProductParams || !this.obj2GetProductPrice.ProductParams.TipsDetail) return null;
      const { BaseTips } = this.obj2GetProductPrice.ProductParams.TipsDetail;
      if (!BaseTips || BaseTips.length === 0 || !this.data) return null;
      const _arr = BaseTips.filter(it => it.Type === tipEnums.Part);
      if (_arr.length === 0) return null;
      const { PartID } = this.data;
      if (!PartID) return null;
      const t = _arr.find(it => it.Part.ID === PartID);
      if (!t) return null;
      return t;
    },
    countTipsData() {
      if (!this.obj2GetProductPrice || !this.obj2GetProductPrice.ProductParams || !this.obj2GetProductPrice.ProductParams.TipsDetail) return null;
      const { BaseTips } = this.obj2GetProductPrice.ProductParams.TipsDetail;
      if (!BaseTips || BaseTips.length === 0 || !this.data) return null;
      const _arr = BaseTips.filter(it => it.Type === tipEnums.Number);
      if (_arr.length === 0) return null;
      const { PartID } = this.data;
      if (!PartID) return null;
      const t = _arr.find(it => it.Part && it.Part.ID === PartID);
      if (!t) return null;
      return t;
    },
  },
  data() {
    return {
      show: true,
      h: 0,
      headerWidth: { width: '800px' },
    };
  },
  methods: {

    ...mapMutations('Quotation', ['setQuotationPartPlainInfo', 'setQuotationPartPropertyList', 'setQuotationPartSizePropertyList', 'setQuotationPartPrintPropertyList', 'setPrintPropertyGroupList', 'setPropertyGroupList', 'setPartProductParamsCraftList',

      'addPartPrintPropertyGroupList', 'addPartPropertyGroupList', 'delPartProductParamsPartList', 'delPartPrintPropertyGroupList', 'delPartPropertyGroupList', 'setCraftItemDisabled4Part',
    ]),
    handleDelClick() {
      // console.log(this.indexLv1, this.indexLv2);
      this.delPartProductParamsPartList([this.indexLv1, this.indexLv2]);
      // // console.log(this.$forceUpdate);
      // setTimeout(() => {
      //   this.$forceUpdate();
      // }, 0);
    },
    handleAddClick() {
      this.$emit('handleAddPart');
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.$refs.headerTitle) return;
      const w = 1140 - this.$refs.headerTitle.offsetWidth - 2;
      this.headerWidth = { width: `${w}px` };
    });
  },
};
</script>

<style lang="scss">
.mp-duotation-content-part-comp-wrap {
  > header {
    margin-top: 28px;
    margin-bottom: 20px;
    .header-title {
      font-size: 14px;
      font-weight: 700;
      color: #333;
      padding-right: 10px;
    }
    // .line {
    //   height: 1px;
    //   display: inline-block;
    //   background-color: #eee;
    //   vertical-align: middle;
    // }
  }
  > .comp-content-wrap {
    > section {
      margin-bottom: 22px;
      &.menu-box {
        text-align: right;
        .line {
          height: 1px;
          width: 100%;
          background-color: #eee;
          margin: 12px 0 16px 0;
        }
        .del-btn > span > i {
          margin-left: 6px;
          vertical-align: -1px;
        }
        .add-btn > span > i {
          font-size: 13px;
        }
      }
      &.part-count-material-box {
        > section {
          display: inline-block;
          // &.mp-pc-material-comp-wrap {
          //   margin-left: 80px;
          // }
        }
      }
      &.mp-duotation-content-comps-single-input-comp-wrap {
        margin-right: 80px;
      }
    }
  }
}
</style>
