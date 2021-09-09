<template>
  <ul v-if="PartData && placeData && DisplayPartData" class="mp-place-order-panel-part-form-comp-containner">
    <li v-if="PartData.List.length === 0">
      <p class="single">
        <label>// {{PartName}} <span class="blue-span" @click="onPartAddClick(0)">+ 添加</span></label>
      </p>
    </li>
    <li v-for="(it, i) in PartData.List" :key="it.key">
      <p>
        <label>// {{PartName}}{{i > 0 ? ` - ${i + 1}` : ''}}</label>
      </p>
      <PlaceOrderPanel :PartID='PartData.PartID' :PartIndex='i' :placeData='DisplayPartData' :submitData='it' ref='oPartPanelArray' />
      <!-- <div class="ctrl" v-if="!(hiddenDelete && hiddenAdd)"> -->
      <div class="ctrl">
        <div v-if="!hiddenDelete">
          <span class="del" @click='onPartRemoveClick(i)'><i class="iconfont icon-shanchu is-pink"></i> 删除</span>
        </div>
        <hr>
        <div v-if="!hiddenAdd">
          <span class="blue-span" @click="onPartAddClick(i)">+ 添加{{PartName}}</span>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import QuotationClassType, { getRequiredCraftListAndSubControlList } from '@/store/Quotation/QuotationClassType';
import PlaceOrderPanel from './PlaceOrderPanel';

export default {
  props: {
    placeData: {
      type: Object,
      default: null,
    },
    PartData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    PlaceOrderPanel,
  },
  computed: {
    DisplayPartData() {
      if (!this.placeData) return null;
      const { PartID } = this.PartData;
      if (PartID) {
        const t = this.placeData.PartList.find(it => it.ID === PartID);
        if (t) return t;
      }
      return null;
    },
    PartName() {
      return this.DisplayPartData ? this.DisplayPartData.Name : '';
    },
    maxLength() {
      if (!this.DisplayPartData || !this.DisplayPartData.UseTimes) return Infinity;
      const { MaxValue } = this.DisplayPartData.UseTimes;
      return MaxValue || Infinity;
    },
    minLength() {
      if (!this.DisplayPartData || !this.DisplayPartData.UseTimes) return 1;
      const { MinValue } = this.DisplayPartData.UseTimes;
      return MinValue || MinValue === 0 ? MinValue : 1;
    },
    hiddenDelete() {
      return this.PartData.List.length <= this.minLength;
    },
    hiddenAdd() {
      return this.PartData.List.length >= this.maxLength;
    },
  },
  methods: {
    onPartRemoveClick(i) {
      this.$store.commit('Quotation/setObj2GetProductPriceProductParamsPartChange', [this.PartData.PartID, i]);
    },
    onPartAddClick(i) {
      const { requiredCraftList, subControlList } = getRequiredCraftListAndSubControlList(this.placeData);
      const _item = QuotationClassType.getPartSubmitData(this.DisplayPartData, requiredCraftList, subControlList);
      if (!_item) return;
      const item = { ..._item, key: Math.random().toString(36).slice(-10) };
      this.$store.commit('Quotation/setObj2GetProductPriceProductParamsPartChange', [this.PartData.PartID, i, item]);
    },
    async onSubmitCheck() {
      if (this.$refs.oPartPanelArray) {
        const resultList = await Promise.all(this.$refs.oPartPanelArray.map(it => it.$refs.ruleForm.validate().catch(() => {})));
        const len1 = resultList.length;
        const len2 = resultList.filter(_it => _it).length;
        return len1 === len2;
      }
      return true;
      // return this.$refs.oPartPanelArray.$refs.ruleForm.validate();
    },
  },
};
</script>
<style lang='scss'>
.mp-place-order-panel-part-form-comp-containner {
  > li {
    padding-top: 15px;
    > p {
      font-weight: 700;
      position: relative;
      line-height: 20px;
      font-size: 14px;
      color: #333;
      // &::before {
      //   position: absolute;
      //   content: '';
      //   top: 9.5px;
      //   right: 0;
      //   left: 0;
      //   height: 1px;
      //   // background: linear-gradient(to right, #eee, #eee 5px, transparent 1px, transparent);
      //   // background-size: 6px 100%;
      // }
      > label {
        display: inline-block;
        padding-left: 28px;
        padding-right: 12px;
        position: relative;
        background-color: #fff;
        &::before {
          position: absolute;
          content: '';
          width: 6px;
          height: 6px;
          background: #FFC450;
          border-radius: 50%;
          left: 10px;
          top: 6px;
        }
        > span {
          margin-left: 12px;
          font-weight: 400;
          font-size: 13px;
        }
      }
      &.single {
        padding-bottom: 15px;
      }
    }
    > section {
      padding-top: 12px;
    }
    > div.ctrl {
      padding-top: 1px;
      > div {
        text-align: right;
        > span {
          font-size: 13px;
          &.del {
            color: #aaa;
            cursor: pointer;
            user-select: none;
            transition: color 0.05s ease-in-out;
            &:hover {
              color: #585858;
            }
            > i {
              position: relative;
              top: -1px;
              margin-right: 2px;
            }
          }
        }
      }
      > hr {
        background-color: #eee;
        border: none;
        height: 1px;
        margin-top: 14px;
        margin-bottom: 10px;
      }
      padding-bottom: 28px;
    }
  }
}
</style>
