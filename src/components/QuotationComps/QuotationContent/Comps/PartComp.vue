<template>
  <ul v-if="PartData && placeData && DisplayPartData" class="mp-place-order-panel-part-form-comp-containner">
    <li v-if="PartData.List.length === 0">
      <div class="single p-title">
        <label>// {{PartName}}</label>
        <hr>
        <p>
          <span class="blue-span" @click="onPartAddClick(0)">+ 添加{{PartName}}</span>
        </p>
      </div>
    </li>
    <li v-for="(it, i) in PartData.List" :key="it.key">
      <div class="p-title">
        <!-- <label>// {{PartName}}{{i > 0 ? ` - ${i + 1}` : ''}}</label> -->
        <label>// {{PartName}}{{i > 0 ? `${i + 1}` : ''}}</label>
        <HelpTipsComp :tipsData='tipsData' :title="PartName" />
      </div>
      <PlaceOrderPanel :PartID='PartData.PartID' :PartIndex='i'
       :placeData='DisplayPartData' :PartBaseTips='PartBaseTips' :submitData='it' ref='oPartPanelArray' />
      <!-- <div class="ctrl" v-if="!(hiddenDelete && hiddenAdd)"> -->
      <div class="ctrl">
        <div v-if="!hiddenDelete">
          <span class="del" @click='onPartRemoveClick(i)'><i class="iconfont icon-shanchu is-pink"></i> 删除</span>
        </div>
        <hr>
        <div v-if="!hiddenAdd" v-show="i === PartData.List.length - 1">
          <span class="blue-span" @click="onPartAddClick(i)">+ 添加{{PartName}}</span>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import QuotationClassType, { getRequiredCraftListAndSubControlList } from '@/store/Quotation/QuotationClassType';
import HelpTipsComp from '@/components/QuotationComps/PlaceOrderComps/HelpTipsComp';
import tipEnums from '@/assets/js/utils/tipEnums';
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
    HelpTipsComp,
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
    tipsData() {
      if (!this.placeData || !this.placeData.TipsDetail || !this.placeData.TipsDetail.BaseTips || this.placeData.TipsDetail.BaseTips.length === 0) return null;
      const _arr = this.placeData.TipsDetail.BaseTips.filter(it => it.Type === tipEnums.Part);
      if (_arr.length === 0) return null;
      const t = _arr.find(it => it.Part.ID === this.PartData.PartID);
      if (!t) return null;
      return t;
    },
    PartBaseTips() {
      if (!this.placeData || !this.placeData.TipsDetail || !this.placeData.TipsDetail.BaseTips || this.placeData.TipsDetail.BaseTips.length === 0) return [];
      const _arr = this.placeData.TipsDetail.BaseTips.filter(it => it.Part && it.Part.ID === this.PartData.PartID && it.Type !== tipEnums.Part);
      if (_arr.length === 0) return [];
      return _arr;
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
    transformErrorObj(obj) {
      // return Object.values(obj).map(it => `[ 部件${this.PartName} - ${it[0].field} ] 中，${it[0].message}`);
      return Object.values(obj).map(it => `${it[0].message}`);
    },
    async onSubmitCheck() { // 部件提交校验
      const checkItem = (ruleForm) => new Promise((resolve) => {
        ruleForm.validate((bool, obj) => {
          resolve(bool || this.transformErrorObj(obj));
        });
      });
      if (!this.$refs.oPartPanelArray) return true;
      let resultList = await Promise.all(this.$refs.oPartPanelArray.map(async it => {
        const res = await checkItem(it.$refs.ruleForm);
        return res;
      }));
      resultList = resultList.filter(it => it !== true).reduce((prev, next) => [...prev, ...next], []);
      return resultList.length === 0 ? true : resultList;
    },
  },
};
</script>
<style lang='scss'>
.mp-place-order-panel-part-form-comp-containner {
  > li {
    padding-top: 15px;
    > div.p-title {
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
        width: 100%;
        > hr {
          background-color: #eee;
          border: none;
          height: 1px;
          margin-top: 14px;
          margin-bottom: 10px;
        }
        > p {
          text-align: right;
          font-size: 13px;
          font-weight: 400;
        }
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
      padding-bottom: 8px;
    }
  }
}
</style>
