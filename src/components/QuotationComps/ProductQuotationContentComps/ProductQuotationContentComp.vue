<template>
  <article class="mp-quotation-product-quotation-content-wrap">
    <section class="left-place">
      <article v-if="placeData" v-loading="isFetchingPartProductData">
        <div class="content" :key="placeData.ProductID">
          <section
            class="content-title"
            v-if="curProductShowNameInfo && curProductShowNameInfo.length === 3"
          >
            <div>
              <span class="blue-v-line">{{ curProductShowNameInfo[0] }}</span>
              <span>{{ curProductShowNameInfo[1] }}</span>
              <span>-</span>
              <span>{{ curProductShowNameInfo[2] }}</span>
            </div>
            <span @click="onHomeDetailClick" v-if="asideIntroData" class="span-title-blue">产品说明
              <i class="el-icon-d-arrow-right"></i>
            </span>
          </section>
          <SwiperClassifyComp />
          <section class="count-model-box">
            <!-- 数量 -->
            <ProductCountComp
              :option="countOption"
              :remark="obj2GetProductPrice.ProductParams.Unit"
              v-model.trim="ProductAmount"
            />
            <HelpTipsComp :title="`${curProductShowNameInfo[2]}`" :tipsData='countTipsData' />
            <ProductCountComp
              v-if="obj2GetProductPrice.ProductParams.AllowMultyKind"
              remark="款"
              title="款数"
              v-model.trim="KindCount"
            />
          </section>

          <!-- 属性 -->
          <attributes-comp :partID='null' v-model="AttributeList" />

          <!-- 联拼行列数及是否允许多款联拼 -->
          <multy-kind-makeup
            :AllowMultyKindMakeup="
              obj2GetProductPrice.ProductParams.AllowMultyKindMakeup
            "
            :maxColCount="
              obj2GetProductPrice.ProductParams.MaxMakeupColumnNumber
            "
            :maxRowCount="obj2GetProductPrice.ProductParams.MaxMakeupRowNumber"
          />

          <!-- :list="obj2GetProductPrice.ProductParams.PropertyList"
          @change="changeAttributes" -->
          <!-- 必选工艺 -->
          <craft-list-comp
            title="必选工艺"
            v-if="RequiredCraft"
            :selectedArr="obj2GetProductPrice.ProductParams.CraftList2Req.First"
            @setCraftList="setProductParamsCraftList"
            :data="RequiredCraft"
          />
          <!-- 可选工艺 -->
          <craft-list-comp
            title="可选工艺"
            v-if="notRequiredCraft"
            :selectedArr="obj2GetProductPrice.ProductParams.CraftList2Req.First"
            @setCraftList="setProductParamsCraftList"
            :data="notRequiredCraft"
          />
          <!-- 部件列表组件 -->
          <PartComps :PartList="obj2GetProductPrice.ProductParams.PartList" />
        </div>

        <section class="coupon-calculate-price-wrap">
          <header>
            <el-button
              type="primary"
              @click.native="go2GetProductPrice"
              :loading="isGettingPrice"
              class="get-price-btn"
            >
              <template v-if="isGettingPrice"> 计算中</template>
              <template v-else>计算价格</template>
            </el-button>
            <ComputedResultComp
              :ProductQuotationResult="ProductQuotationResult"
              :selectedCoupon="selectedCoupon"
              v-if="!priceGetErrMsg"
            />
            <div class="result center" v-if="priceGetErrMsg">
              <span class="is-pink">{{ priceGetErrMsg }}</span>
            </div>
            <div
              class="result center"
              v-if="
                !priceGetErrMsg && !ProductQuotationResult && !isGettingPrice
              "
            >
              <span
                class="gray no-cursor is-font-12"
                v-if="selectedCoupon"
                @click.stop="null"
                >已选择满 {{ selectedCoupon.MinPayAmount }}元减{{
                  selectedCoupon.Amount
                }}元
                <i class="is-pink"> {{ couponConditionText }}</i>
              </span>
            </div>
          </header>
          <footer>
            <el-collapse v-model="activeNames" @change="handleChange">
              <el-collapse-item name="1">
                <template slot="title">
                  <el-button
                    class="button-title-pink is-font-13"
                    @click="onBtnClick"
                  >
                    使用优惠券<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </template>
                <section class="coupon-wrap">
                  <header>
                    <span>激活优惠券：</span>
                    <el-input
                      v-model.trim="computedCouponCode2Add"
                      placeholder="请输入优惠券激活码"
                    ></el-input>
                    <el-button
                      type="primary"
                      :disabled="!computedCouponCode2Add"
                      @click="getCouponActivate"
                      >激活</el-button
                    >
                    <!-- <i class="span-title-blue">不使用优惠券</i> -->
                  </header>
                  <ul
                    class="coupon-list mp-scroll-wrap"
                    v-if="couponList.length > 0"
                  >
                    <li
                      class="float"
                      v-for="item in couponList"
                      :key="item.CouponCode"
                      @click="addCouponCode(item)"
                      :class="{
                        selected:
                          selectedCoupon &&
                          item.CouponCode === selectedCoupon.CouponCode,
                      }"
                    >
                      <div class="header">
                        <span>
                          <i class="is-font-14">¥</i>
                          <i class="is-bold is-font-30">{{ item.Amount }}</i>
                        </span>
                        <span class="is-font-12">
                          满<i class="is-font-14">{{ item.MinPayAmount }}</i
                          >元可用
                        </span>
                      </div>
                      <div class="content is-font-12">
                        <p>
                          <span>限产品：</span>
                          <el-tooltip
                            class="item"
                            effect="dark"
                            :enterable="false"
                            placement="top-start"
                          >
                            <ul slot="content">
                              <li
                                v-for="(it, i) in item.ProductString.split(
                                  '\n'
                                )"
                                :key="i"
                              >
                                {{ it }}
                              </li>
                            </ul>
                            <span class="product">{{
                              item.ProductString
                            }}</span>
                          </el-tooltip>
                        </p>
                        <p>
                          <span>有效期至：</span>
                          <span>{{
                            item.ValidEndTime | format2MiddleLangTypeDate
                          }}</span>
                        </p>
                      </div>
                      <div class="aside">点击选择</div>
                      <!-- <el-tooltip class="item" effect="dark" content="点击取消" placement="top"> -->
                      <div class="icon-box"></div>
                      <!-- </el-tooltip> -->
                    </li>
                  </ul>
                  <footer v-else>
                    <span>当前无可用优惠券,</span>
                    <span
                      @click="handleGoToCouponCenter"
                      class="span-title-blue"
                      >前往领券中心</span
                    >
                    <!-- <span  v-if="isOpenCouponCenter" @click="fetchCouponList">
                      <i style="margin: 0 8px">|</i>
                      <span class="span-title-blue">已领取优惠券</span>
                    </span> -->
                  </footer>
                </section>
              </el-collapse-item>
            </el-collapse>
          </footer>
        </section>
      </article>
      <AddShowChangeComp ref="AddShowChangeComp" />
      <OrderSubmitComp
        @handleMapPosition="handleMapPosition"
        :isSpotGoods="placeData.IsSpotGoods"
      />
    </section>
    <AsideIntroComp
     :asideAboutData='asideAboutData'
     :asideIntroData='asideIntroData'
     :isError='getAboutIsError'
     :productName='placeData.ProductName'
     @getProductAsideIntroData='getProductAsideIntroData'
     />
  </article>
</template>

<script>
import {
  mapState, mapGetters, mapMutations, mapActions,
} from 'vuex';
import tipEnums from '@/assets/js/utils/tipEnums';
import MultyKindMakeup from '@/components/QuotationComps/ProductQuotationContentComps/NewPcComps/MultyKindMakeup.vue';
import AttributesComp from '@/components/QuotationComps/ProductQuotationContentComps/NewPcComps/AttributesComp.vue';
import CraftListComp from '@/components/QuotationComps/ProductQuotationContentComps/NewPcComps/CraftListComp.vue';
import PartComps from '@/components/QuotationComps/ProductQuotationContentComps/NewPcComps/PartComps.vue';
import { productJumpUrl } from '@/assets/js/setup';
import HelpTipsComp from '@/components/QuotationComps/PlaceOrderComps/HelpTipsComp.vue';
import ProductCountComp from './NewPcComps/ProductCountComp.vue';
import ComputedResultComp from './NewPcComps/ComputedResultComp.vue';
import AddShowChangeComp from '../PlaceOrderComps/AddShowChangeComp.vue';
import OrderSubmitComp from '../PlaceOrderComps/OrderSubmitComp.vue';
import SwiperClassifyComp from './NewPcComps/SwiperClassifyComp.vue';
import AsideIntroComp from '../PlaceOrderComps/AsideIntroComp.vue';

export default {
  props: ['placeData'],
  components: {
    ProductCountComp,
    MultyKindMakeup,
    AttributesComp,
    CraftListComp,
    PartComps,
    AddShowChangeComp,
    OrderSubmitComp,
    ComputedResultComp,
    SwiperClassifyComp,
    AsideIntroComp,
    HelpTipsComp,
  },
  computed: {
    // eslint-disable-next-line max-len
    ...mapState('Quotation', [
      'obj2GetProductPrice',
      'ProductQuotationResult',
      'curProductClass',
      'curProductID',
      'selectedCoupon',
      'addressInfo4PlaceOrder',
      'isFetchingPartProductData',
    ]),
    ...mapGetters('Quotation', ['curProductShowNameInfo']),
    ...mapState('common', ['customerInfo']),
    // 数量下拉列表数据
    countOption() {
      if (
        !this.obj2GetProductPrice.ProductParams.RecommendNumberList
        || this.obj2GetProductPrice.ProductParams.RecommendNumberList.length === 0
      ) return [];
      // { text: 40, value: 40 }
      return this.obj2GetProductPrice.ProductParams.RecommendNumberList.map(
        (item) => ({
          text: item,
          value: item,
        }),
      );
    },
    computedCouponCode2Add: {
      get() {
        return this.couponCode2Add;
      },
      set(newVal) {
        this.couponCode2Add = newVal.replace(/[^\w]/g, '');
      },
    },
    // 活动价格
    promotePrice() {
      if (!this.ProductQuotationResult || this.priceGetErrMsg) return '';
      return +(
        this.ProductQuotationResult.OriginalCost
        - this.ProductQuotationResult.CurrentCost
      ).toFixed(2);
    },
    // 产品数量
    ProductAmount: {
      get() {
        return this.obj2GetProductPrice.ProductParams.ProductAmount;
      },
      set(newVal) {
        this.setProductParams(['ProductAmount', `${newVal}`]);
      },
    },
    // 产品款数
    KindCount: {
      get() {
        return this.obj2GetProductPrice.ProductParams.KindCount;
      },
      set(newVal) {
        let _str = newVal;
        if (newVal.length > 9) _str = '';
        this.setProductParams(['KindCount', `${_str}`]);
      },
    },
    RequiredCraft() {
      if (this.obj2GetProductPrice.ProductParams.CraftList.length === 0) return null;
      const _data = this.obj2GetProductPrice.ProductParams.CraftList.find(
        (it) => it.ChoiceType === 2,
      );
      return _data;
    },
    notRequiredCraft() {
      if (this.obj2GetProductPrice.ProductParams.CraftList.length === 0) return null;
      const _data = this.obj2GetProductPrice.ProductParams.CraftList.find(
        (it) => it.ChoiceType === 1,
      );
      return _data;
    },
    coupon() {
      if (!this.ProductQuotationResult) return 0;
      if (!this.selectedCoupon) return 0;
      if (
        this.ProductQuotationResult.CurrentCost
        >= this.selectedCoupon.MinPayAmount
      ) {
        return this.selectedCoupon.Amount;
      }
      return 0;
    },
    // Cost() {
    //   if (!this.ProductQuotationResult) return '';
    //   if (!this.selectedCoupon) return this.ProductQuotationResult.CurrentCost;
    //   if (this.ProductQuotationResult.CurrentCost >= this.selectedCoupon.MinPayAmount) {
    //     const num = +(this.ProductQuotationResult.CurrentCost - this.selectedCoupon.Amount).toFixed(2);
    //     return num > 0 ? num : 0;
    //   }
    //   return this.ProductQuotationResult.CurrentCost;
    // },
    couponConditionText() {
      if (!this.ProductQuotationResult) return '( 点击 计算价格 查看是否可使用 )';
      if (!this.coupon) return '(尚未满足使用条件)';
      return '';
    },
    // 产品属性
    AttributeList: {
      get() {
        return this.obj2GetProductPrice.ProductParams.PropertyList;
      },
      set([data, index, type]) {
        // // console.log("setProductParamsPropertyList", data);
        this.setProductParamsPropertyList([index, data, type]);
      },
    },
    watchAddInfoChange() {
      if (!this.addressInfo4PlaceOrder) return null;
      return this.addressInfo4PlaceOrder.Address.Express;
    },
    countTipsData() {
      if (!this.placeData || !this.placeData.TipsDetail) return null;
      const { BaseTips } = this.placeData.TipsDetail;
      if (!BaseTips || BaseTips.length === 0) return null;
      const _arr = BaseTips.filter(it => it.Type === tipEnums.Number);
      if (_arr.length === 0) return null;
      const t = _arr.find(it => !it.Part);
      if (!t) return null;
      return t;
    },
  },
  data() {
    return {
      curDefaultID: '',
      activeNames: [],
      couponList: [],
      // selectedCoupon: null,
      priceGetErrMsg: '',
      couponCode2Add: '',
      isCouponGet: false, // 是否已获取优惠券列表数据
      isGettingPrice: false,
      asideAboutData: null, // 侧边栏推荐产品数据
      asideIntroData: null,
      getAboutIsError: false,
      isOpenCouponCenter: false,
    };
  },
  methods: {
    // eslint-disable-next-line max-len
    ...mapMutations('Quotation', [
      'setProductParams',
      'setProductParamsPropertyList',
      'setProductParamsCraftList',
    ]),
    ...mapActions('Quotation', ['getProductPrice']),
    ...mapActions('common', ['getCraftRelationList']),
    handleMapPosition(cb) {
      // // console.log(cb, 'cb func ----');
      this.$refs.AddShowChangeComp.handleSetPositionOnMap(cb);
    },
    async go2GetProductPrice() {
      this.getProductPriceLocal();
    },
    async getProductPriceLocal() {
      this.priceGetErrMsg = '';
      this.isGettingPrice = true;
      const msg = await this.getProductPrice('报价');
      this.isGettingPrice = false;
      if (msg === true) {
        // this.$router.push('/offerResult');
      } else if (typeof msg === 'string') {
        // this.$message.singleError('报价失败', msg, null);
        this.priceGetErrMsg = msg;
        // this.messageBox.failSingleError({ title: '报价失败', msg });
      }
    },
    handleSpecClick(item) {
      const { DefaultID } = item;
      if (this.curDefaultID === DefaultID) return;
      this.curDefaultID = DefaultID;
      this.$store.commit('Quotation/setDefaultProductInfo', item);
      // // console.log(1223332131);
      // this.$forceUpdate();
    },
    handleChange(list, bool) {
      if (list.length === 0) return; // 关闭
      if (!bool && this.couponList.length > 0) return;
      if (this.isCouponGet && !this.isOpenCouponCenter) return;
      const _obj = { UseStatus: 0 };
      _obj.Product = {
        ClassID: this.curProductClass.First,
        TypeID: this.curProductClass.Second,
        ProductID: this.curProductID,
      };
      setTimeout(async () => {
        const res = await this.api.getCouponList(_obj);
        if (res.data.Status !== 1000) return;
        this.couponList = res.data.Data;
        this.isCouponGet = true;
      }, 200);
    },
    fetchCouponList() {
      this.handleChange([1], true);
      this.isOpenCouponCenter = false;
    },
    onBtnClick(evt) {
      let { target } = evt;
      if (target.nodeName === 'SPAN') {
        target = evt.target.parentNode;
      } else if (target.nodeName === 'I') {
        target = evt.target.parentNode.parentNode;
      }
      target.blur();
    },
    async getCouponActivate() {
      if (!this.couponCode2Add) return;
      if (this.couponCode2Add.length !== 10) {
        this.messageBox.warnSingleError({
          title: '激活失败',
          msg: '请输入10位优惠券码',
        });
        return;
      }
      await this.$store.dispatch('common/getCustomerDetail');
      if (!this.customerInfo) return;
      const { CustomerID } = this.customerInfo;
      const ProductID = this.curProductID;
      const CouponCode = this.couponCode2Add;
      const _obj = { CustomerID, ProductID, CouponCode };
      const res = await this.api.getCouponActivate(_obj);
      if (res.data.Status !== 1000) return;
      this.couponCode2Add = '';
      this.messageBox.successSingle({
        title: '激活成功',
        // successFunc: () => this.handleChange([1], true),
        successFunc: () => {
          this.couponList.push(res.data.Data);
        },
      });
    },
    addCouponCode(item) {
      if (
        !this.selectedCoupon
        || this.selectedCoupon.CouponCode !== item.CouponCode
      ) {
        // this.selectedCoupon = item;
        this.$store.commit('Quotation/setSelectedCoupon', item);
      } else {
        // this.selectedCoupon = null;
        this.$store.commit('Quotation/setSelectedCoupon', null);
      }
    },
    handleGoToCouponCenter() {
      // this.$router.push('/mySetting/couponCenter');
      window.open('/#/mySetting/couponCenter');
      this.isOpenCouponCenter = true;
    },
    async getProductAsideIntroData() {
      const { ProductID } = this.placeData;
      let bool = true;
      this.asideAboutData = null;
      this.getAboutIsError = false;
      const res = await this.api.getProductIntroDetail(ProductID).catch(() => { bool = false; });
      if (bool && res && res.data.Status === 1000) {
        this.asideAboutData = res.data.Data;
      } else {
        this.getAboutIsError = true;
      }
    },
    onHomeDetailClick() {
      window.open(`${productJumpUrl}product?productID=${this.placeData.ProductID}`);
    },
  },
  mounted() {
    if (this.countOption.length > 0 && !this.ProductAmount) {
      const _count = this.countOption[0].value;
      this.setProductParams(['ProductAmount', `${_count}`]);
    }
    this.getCraftRelationList();
    // if (this.data) this.getProductAsideIntroData(this.data.ProductID);
  },
  watch: {
    countOption(newVal) {
      if (newVal.length > 0) {
        this.setProductParams(['ProductAmount', `${newVal[0].value}`]);
      }
    },
    obj2GetProductPrice: {
      handler() {
        this.$store.commit('Quotation/setProductQuotationResult', null);
      },
      deep: true,
    },
    watchAddInfoChange() {
      this.$store.commit('Quotation/setProductQuotationResult', null);
    },
    placeData: {
      handler(val) {
        if (!val || typeof val !== 'object') return;
        const { ProductID, TipsDetail } = val;
        if (!ProductID || !TipsDetail) return;
        this.asideIntroData = null;
        const { BaseTips } = TipsDetail;
        if (BaseTips && BaseTips.length > 0) {
          const t = BaseTips.find(it => it.Type === tipEnums.Product);
          if (t) this.asideIntroData = t;
        }
        this.getProductAsideIntroData();
      },
      immediate: true,
    },
    curProductID() {
      this.priceGetErrMsg = '';
    },
  },
};
</script>

<style lang="scss">
.mp-quotation-product-quotation-content-wrap {
  width: 1200px;
  margin: 25px auto 30px;
  font-size: 14px;
  color: #585858;
  overflow: hidden;

  > section.left-place {
    display: inline-block;
    vertical-align: top;
    width: 920px;
    margin-right: 25px;
    background-color: #fff;
    padding: 30px;
    padding-bottom: 15px;
    box-sizing: border-box;
    padding-bottom:9999px;
    margin-bottom:-9999px;
    > article > .content {
      > .content-title {
        > div {
          color: #333;
          font-weight: 700;
          margin-bottom: 30px;
          display: inline-block;
          vertical-align: top;
          max-width: 720px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          > .blue-v-line {
            margin-right: 6px;
          }
        }
        > span {
          display: inline-block;
          vertical-align: top;
          // width: 80px;
          margin-left: 15px;
          text-align: right;
          // color: #888;
          font-size: 13px;
          transition: color 0.05s ease-in-out;
          cursor: pointer;
          user-select: none;
          padding-top: 2px;
          // &:hover {
          //   color:mix(#428dfa, #fff, 80%);
          // }
          // &:active {
          //   color: #428dfa
          // }
        }
      }
      > .count-model-box {
        > div {
          display: inline-block;
          margin-bottom: 22px;
          & + div {
            margin-left: 80px;
          }
        }
      }
      // ------------------------------- ⬇ 公共样式
      .title {
        min-width: 6em;
        text-align: right;
        display: inline-block;
      }
      .gray {
        color: #888;
      }
      .el-input {
        width: unset;
        width: auto\0;
      }
      input {
        width: 140px;
        height: 30px;
        line-height: 28px;
        margin-left: 5px;
        margin-right: 10px;
        padding: 0 20px 0 10px;
      }
      .el-input__suffix {
        right: 10px;
      }
      .remark {
        font-size: 12px;
      }
      .el-radio-group {
        margin-left: 5px;
      }
      // ------------------------------- ⬆
    }
    > article {
      // margin-top: -5px;
      > .coupon-calculate-price-wrap {
        position: relative;
        > header {
          text-align: left;
          // margin-top: 38px;
          // margin-bottom: 22px;
          position: absolute;
          top: 0px;
          left: 165px;
          > .result {
            display: inline-block;
            margin-right: 6px;
            line-height: 33px;
            // white-space: nowrap;
            white-space: normal;
            position: absolute;
            left: 160px;
            top: 2px;
            // height: 100px;
            width: 538px;
            > span,
            > div > span {
              margin-right: 20px;
              // white-space: nowrap;
              float: left;
              &.no-margin {
                margin: 0;
              }
              &.mg-left {
                margin-left: -10px;
              }
            }
            // display: flex;
            // align-items: center;
            // flex-wrap: wrap;
            > div {
              // display: inline-block;
              // white-space: nowrap;
              white-space: normal;
              display: flex;
              flex-wrap: wrap;
              overflow: hidden;
            }
            > em {
              margin-right: 18px;
            }
            &.center::before {
              content: "";
              display: inline-block;
              height: 100%;
              vertical-align: middle;
              margin-right: -0.25em; /* Adjusts for spacing */
            }
          }
          > button {
            position: absolute;
            width: 120px;
            padding: 0;
            height: 40px;
            line-height: 38px;
            margin-right: 28px;
            padding-right: 4px;
            vertical-align: top;
            top: 0;
            > i {
              font-size: 16px;
              vertical-align: -1px;
            }
          }
          .ml-0 {
            margin-left: -12px;
            margin-right: 12px !important;
          }
        }
        > footer {
          > .el-collapse {
            border: none;
            > .el-collapse-item {
              > div {
                &::after {
                  content: "";
                  display: block;
                  clear: both;
                }
                > .el-collapse-item__header {
                  text-align: right;
                  // justify-content: flex-end;
                  display: inline-block;
                  border: none;
                  float: left;
                  cursor: unset;
                  margin-bottom: 10px;
                  height: 66px;
                  line-height: 66px;
                  > span {
                    display: inline;
                    color: #888;
                    cursor: unset;
                  }
                  > button {
                    display: inline-block;
                    border-radius: 5px;
                    height: 40px;
                    width: 120px;
                    line-height: 28px;
                    padding: 0;
                    vertical-align: top;
                    // margin-right: 28px;
                    padding-left: 8px;
                    > span > i {
                      transition: 0.2s;
                    }
                  }
                  > i {
                    display: none;
                  }
                  &.is-active > button > span > i {
                    transform: rotate(180deg);
                  }
                }
              }
              .el-collapse-item__wrap {
                border: none;
                // padding-top: 35px;
                > .el-collapse-item__content {
                  padding: 0;
                  > .coupon-wrap {
                    > header {
                      margin-bottom: 50px;
                      margin-top: 35px;
                      text-align: center;
                      // .span-title-blue {
                      //   display: inline-block;
                      //   &::before {
                      //     content: '';
                      //     display: inline-block;
                      //     height: 23px;
                      //     width: 1px;
                      //     background-color: #428dfa;
                      //     margin: 0 15px 0px 35px;
                      //     vertical-align: middle;
                      //   }
                      // }
                      > .el-input {
                        width: 300px;
                        > input {
                          height: 30px;
                          line-height: 26px\0;
                        }
                      }
                      > span {
                        color: #888;
                        margin-right: 6px;
                      }
                      > button {
                        height: 30px;
                        width: 70px;
                        line-height: 28px;
                        padding: 0;
                        margin-left: 20px;
                      }
                    }
                    > .coupon-list {
                      padding: 0 8px;
                      // display: flex;
                      max-height: 322px;
                      overflow-y: auto;
                      // margin-left: -26px;
                      > li {
                        width: 240px;
                        height: 135px;
                        box-shadow: 0px 5px 7px 1px rgba(238, 238, 238, 0.7);
                        border-radius: 5px;
                        overflow: hidden;
                        position: relative;
                        display: inline-block;
                        margin: 0 18px 20px;
                        user-select: none;
                        cursor: pointer;
                        > .header {
                          width: 100%;
                          height: 60px;
                          background-color: #9399ff;
                          padding: 5px 20px 0;
                          // padding-bottom: 10px;
                          box-sizing: border-box;
                          color: #fff;
                          float: left;
                          span.is-font-12 {
                            vertical-align: 28%;
                            margin-left: 23px;
                          }
                        }
                        > .content {
                          padding: 10px 20px 0;
                          overflow: hidden;
                          > p {
                            > span {
                              color: #888;
                              vertical-align: top;
                              &.product {
                                color: #585858;
                                max-width: 160px;
                                display: inline-block;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                              }
                            }
                            white-space: nowrap;
                            line-height: 27px;
                          }
                        }
                        > .aside {
                          position: absolute;
                          top: 0;
                          right: 0;
                          bottom: 0;
                          width: 40px;
                          writing-mode: vertical-rl;
                          padding: 28px 8px 12px 0;
                          box-sizing: border-box;
                          font-size: 14px;
                          color: #fff;
                          background-color: rgba($color: #428dfa, $alpha: 0.6);
                          text-align: justify;
                          text-justify: distribute-all-lines;
                          text-align-last: justify;
                          cursor: pointer;
                          display: none;
                          user-select: none;
                          z-index: 9;
                          transition: 2s;
                          &:hover {
                            background-color: rgba($color: #428dfa, $alpha: 0.72);
                          }
                          &:active {
                            background-color: rgba($color: #428dfa, $alpha: 0.88);
                          }
                        }
                        > .icon-box {
                          width: 40px;
                          height: 42px;
                          position: absolute;
                          right: 0;
                          bottom: 0;
                          display: none;
                          cursor: pointer;
                          background: url("../../../assets/images/coupon-selected.png")
                            no-repeat right bottom / 100% 100%;
                          &:hover {
                            opacity: 0.75;
                            // width: 42px;
                            // height: 43px;
                            // transform: scale(1.05);
                          }
                        }
                        &:hover > .aside {
                          display: block;
                        }
                        &.selected {
                          > .icon-box {
                            display: block;
                          }
                          &:hover > .aside {
                            display: none;
                          }
                        }
                      }
                    }
                    > footer {
                      text-align: center;
                      color: #989898;
                      font-size: 12px;
                      padding: 30px;
                      padding-top: 10px;
                      line-height: 20px;
                      > .span-title-blue {
                        margin-left: 6px;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    > section {
      > .bg-gray {
        width: 1200px;
        height: 15px;
        margin: 15px -30px 0;
        // background-color: rgb(245, 245, 245);
      }
      > .comp-title {
        height: 40px;
        width: 920px;
        margin: 0 -30px;
        border-bottom: 1px dashed #eee;
        line-height: 39px;
        box-sizing: border-box;
        padding: 0 22px;
        padding-right: 30px;
        > .left {
          float: left;
        }
        > .right {
          float: right;
        }
        position: relative;
        &::before {
          height: 100%;
          width: 2px;
          background-color: #428dfa;
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
        }
      }
    }
  }
}
</style>
