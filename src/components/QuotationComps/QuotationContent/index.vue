<template>
  <article class="mp-quotation-product-quotation-content-wrap">
    <section class="left-place">
      <article v-if="placeData" v-loading="isFetchingPartProductData">
        <div class="content" :key="placeData.ProductID">
          <section
            class="content-title"
            v-if="curProductShowNameInfo && curProductShowNameInfo.length === 3"
          >
            <div class="left">
              <div>
                <span class="blue-v-line">{{ curProductShowNameInfo[0] }}</span>
                <span>{{ curProductShowNameInfo[1] }}</span>
                <span>-</span>
                <span>{{ curProductShowNameInfo[2] }}</span>
              </div>
              <span @click="onHomeDetailClick" v-if="asideIntroData" class="span-title-blue">产品说明
                <i class="el-icon-d-arrow-right"></i>
              </span>
            </div>
            <div class="right is-gray" v-if="placeData.Remark" :title="placeData.Remark">
              <img src="@/assets/images/m.png" alt="">
              <!-- <span v-html="placeData.Remark.replaceAll(/\s/g, '&nbsp;')"></span> -->
              <pre>{{placeData.Remark}}</pre>
            </div>
          </section>
          <SwiperClassifyComp />
          <PlaceOrderPanel ref="oProductPanel" :placeData='placeData' :submitData='obj2GetProductPrice.ProductParams' :PartBaseTips='ProductBaseTips' />
          <template v-if='!isSetupError'>
            <PartComp ref="oPartPanels" v-for="item in obj2GetProductPrice.ProductParams.PartList" :key="item.PartID" :PartData='item' :placeData='placeData' />
          </template>
        </div>

        <section class="coupon-calculate-price-wrap">
            <el-collapse :value="activeNames">
              <el-collapse-item name="1" disabled>
                  <!-- 按钮区域 -->
                  <header slot="title" class="btns-box">
                    <el-button class="button-title-pink is-font-13" @click="onCouponUseClick">
                      <template>使用优惠券</template>
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-button type="primary" @click.native="go2GetProductPrice" :loading="isGettingPrice" class="get-price-btn" :disabled='isSetupError'>
                      <template v-if="isGettingPrice"> 计算中</template>
                      <template v-else>计算价格</template>
                    </el-button>
                    <!-- 价格展示区域 -->
                    <ComputedResultComp :ProductQuotationResult="ProductQuotationResult" :selectedCoupon="selectedCoupon" v-if="!priceGetErrMsg" />
                    <!-- 错误 或 优惠券选择信息显示区域 -->
                    <div class="err-or-selected-coupon-info-box">
                      <span class="is-pink error-msg"  v-if="priceGetErrMsg"
                       :title="priceGetErrMsg.length > 41 ? priceGetErrMsg : ''">{{ priceGetErrMsg }}</span>
                      <span class="gray no-cursor is-font-12"
                        v-if="selectedCoupon && !priceGetErrMsg && !ProductQuotationResult && !isGettingPrice"
                        @click.stop
                        >已选择满 {{ selectedCoupon.MinPayAmount }}元减{{ selectedCoupon.Amount }}元
                        <i class="is-pink"> {{ couponConditionText }}</i>
                      </span>
                    </div>
                    <TipsBox />
                  </header>
                <!-- 优惠展示与激活、选择区域 -->
                <section class="coupon-wrap">
                  <header>
                    <span>激活优惠券：</span>
                    <el-input v-model.trim="computedCouponCode2Add" placeholder="请输入优惠券激活码"></el-input>
                    <el-button type="primary" :disabled="!computedCouponCode2Add" @click="getCouponActivate">激活</el-button
                    >
                  </header>
                  <ul class="coupon-list mp-scroll-wrap" v-if="couponList.length > 0">
                    <li
                     v-for="item in couponList"
                     :key="item.CouponCode"
                     @click="addCouponCode(item)"
                     :class="{ selected: selectedCoupon && item.CouponCode === selectedCoupon.CouponCode }"
                    >
                      <div class="header">
                        <span>
                          <i class="is-font-14">¥</i>
                          <i class="is-bold is-font-30">{{ item.Amount }}</i>
                        </span>
                        <span class="is-font-12">
                          满<i class="is-font-14">{{ item.MinPayAmount }}</i>元可用
                        </span>
                      </div>
                      <div class="content is-font-12">
                        <p>
                          <span>限产品：</span>
                          <el-tooltip class="item" :enterable="false" placement="top-start">
                            <ul slot="content">
                              <li v-for="(it, i) in item.ProductString.split('\n')" :key="i">{{it}}</li>
                            </ul>
                            <span class="product">{{item.ProductString}}</span>
                          </el-tooltip>
                        </p>
                        <p>
                          <span>有效期至：</span>
                          <span>{{ item.ValidEndTime | format2MiddleLangTypeDate }}</span>
                        </p>
                      </div>
                      <div class="aside">点击选择</div>
                      <div class="icon-box"></div>
                    </li>
                  </ul>
                  <footer v-else>
                    <span>当前无可用优惠券,</span>
                    <span
                      @click="handleGoToCouponCenter"
                      class="span-title-blue"
                      >前往领券中心</span
                    >
                  </footer>
                </section>
              </el-collapse-item>
            </el-collapse>
        </section>
      </article>
      <ConsigneeAddressSetpComp
       ref="oConsigneeAddressSetpComp"
       :disabled="isUploading"
       :watchClearVal='curProductID'
       :customerInfo='customerInfo'
       :ExpressList='ExpressList'
       @changeAddressInfo="setAddressInfo4PlaceOrder"
       @changeDefaultSelectAddress='changeSelectedAdd'
       />
      <OrderSubmitComp
        :asyncInputchecker='asyncInputchecker'
        :isSpotGoods="placeData.IsSpotGoods"
        :getCheckResult='getCheckResult'
        ref="oSubmitBox"
        @clearAdd='clearAdd'
      />
    </section>
    <AsideIntroComp
     :asideAboutData='asideAboutData'
     :asideIntroData='asideIntroData'
     :isError='getAboutIsError'
     :productName='placeData.ShowName'
     @getProductAsideIntroData='getProductAsideIntroData'
     />
  </article>
</template>

<script>
import anime from 'animejs/lib/anime.es';
import {
  mapState, mapGetters, mapActions,
} from 'vuex';
import tipEnums from '@/assets/js/utils/tipEnums';
import { homeUrl } from '@/assets/js/setup';
import ComputedResultComp from './Comps/ComputedResultComp.vue';
// import AddShowChangeComp from '../PlaceOrderComps/AddShowChangeComp.vue';
import ConsigneeAddressSetpComp from '../PlaceOrderComps/ConsigneeAddressSetpComp/index.vue';
import OrderSubmitComp from '../PlaceOrderComps/OrderSubmitComp/index.vue';
import SwiperClassifyComp from './Comps/SwiperClassifyComp.vue';
import AsideIntroComp from '../PlaceOrderComps/AsideIntroComp.vue';
import PlaceOrderPanel from './Comps/PlaceOrderPanel/index.vue';
import PartComp from './Comps/PartComp.vue';
import TipsBox from './Comps/TipsBox.vue';

export default {
  props: ['placeData'],
  components: {
    // AddShowChangeComp,
    OrderSubmitComp,
    ComputedResultComp,
    SwiperClassifyComp,
    AsideIntroComp,
    PlaceOrderPanel,
    PartComp,
    ConsigneeAddressSetpComp,
    TipsBox,
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
      'successNum',
      'isUploading',
    ]),
    ...mapGetters('Quotation', ['curProductShowNameInfo']),
    ...mapState('common', ['customerInfo', 'ExpressList']),
    computedCouponCode2Add: {
      get() {
        return this.couponCode2Add;
      },
      set(newVal) {
        this.couponCode2Add = newVal.replace(/[^\w]/g, '');
      },
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
    couponConditionText() {
      if (!this.ProductQuotationResult) return '( 点击 计算价格 查看是否可使用 )';
      if (!this.coupon) return '(尚未满足使用条件)';
      return '';
    },
    watchAddInfoChange() {
      if (!this.addressInfo4PlaceOrder) return null;
      return this.addressInfo4PlaceOrder.Address.Express;
    },
    isSetupError() { // 是否有配置上的错误
      if (!this.placeData) return true;
      return false;
    },
    ProductBaseTips() {
      if (!this.placeData || !this.placeData.TipsDetail || !this.placeData.TipsDetail.BaseTips || this.placeData.TipsDetail.BaseTips.length === 0) return [];
      const _arr = this.placeData.TipsDetail.BaseTips.filter(it => !it.Part && it.Type !== tipEnums.Product);
      if (_arr.length === 0) return [];
      return _arr;
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
    ...mapActions('Quotation', ['getProductPrice']),
    transformErrorObj(obj) {
      // return Object.values(obj).map(it => `[ 产品 - ${it[0].field} ] 中，${it[0].message}`);
      return Object.values(obj).map(it => `${it[0].message}`);
    },
    async getCheckResult() {
      return new Promise((resolve) => {
        this.$refs.oProductPanel.$refs.ruleForm.validate(async (bool, obj) => {
          const arr = [];
          console.log(obj);
          arr.push(bool || this.transformErrorObj(obj));
          if (this.$refs.oPartPanels) {
            const partCheckList = await Promise.all(this.$refs.oPartPanels.map(oPart => oPart.onSubmitCheck()));
            arr.push(...partCheckList);
          }
          const list = arr.filter(it => it !== true).reduce((prev, next) => [...prev, ...next], []);
          resolve(list.length === 0 ? true : list);
        });
      });
    },
    async go2GetProductPrice() { // 计算价格
      // 校验
      const res = await this.getCheckResult();
      // 如果验证通过 执行算价
      if (res === true) this.getProductPriceLocal();
      else {
        const scrollHandler = () => {
          const oFirstErrorDom = document.getElementsByClassName('el-form-item__error')[0];
          if (oFirstErrorDom && oFirstErrorDom.parentElement) {
            const { top } = oFirstErrorDom.parentElement.getBoundingClientRect();
            if (top - 130 < 0) { // 在视野外 需要滚动至上方
              const oApp = document.getElementById('app');
              if (oApp) {
                const willToTop = oApp.scrollTop + top - 200 > 0 ? oApp.scrollTop + top - 200 : 0;
                // this.utils.animateScroll(oApp.scrollTop, willToTop, num => {
                //   oApp.scrollTop = num;
                // });
                anime({
                  targets: oApp,
                  scrollTop: willToTop,
                  duration: 400,
                  easing: 'easeInOutSine',
                });
              }
            }
          }
        };
        console.log(res);
        this.messageBox.failSingleError({
          title: '报价失败', msg: res, successFunc: scrollHandler, failFunc: scrollHandler,
        });
      }
    },
    async getProductPriceLocal() {
      this.priceGetErrMsg = '';
      this.isGettingPrice = true;
      this.$store.commit('Quotation/setRiskWarningTips', { origin: '', tipsList: '' });
      const fileContent = this.$refs.oSubmitBox ? this.$refs.oSubmitBox.fileContent : '';
      const msg = await this.getProductPrice(fileContent);
      this.isGettingPrice = false;
      if (msg === true) {
        // this.$router.push('/offerResult');
      } else if (typeof msg === 'string') {
        this.priceGetErrMsg = msg;
      }
    },
    handleChange(list) {
      if (list.length === 0) return; // 关闭
      if (this.isCouponGet && !this.isOpenCouponCenter) return;
      const _obj = { UseStatus: 0 };
      _obj.Product = {
        ClassID: this.curProductClass.First,
        TypeID: this.curProductClass.Second,
        ProductID: this.curProductID,
      };
      this.couponList = [];
      setTimeout(async () => {
        const res = await this.api.getCouponList(_obj).catch(() => null);
        if (!res || res.data.Status !== 1000) return;
        this.couponList = res.data.Data;
        this.isCouponGet = true;
      }, 200);
    },
    onCouponUseClick(evt) { // 使用优惠券按钮点击事件
      let { target } = evt;
      if (target.nodeName === 'SPAN') {
        target = evt.target.parentNode;
      } else if (target.nodeName === 'I') {
        target = evt.target.parentNode.parentNode;
      }
      target.blur();
      if (this.activeNames.length === 0) this.activeNames = ['1'];
      else this.activeNames = [];
      this.handleChange(this.activeNames);
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
        this.$store.commit('Quotation/setSelectedCoupon', item);
      } else {
        this.$store.commit('Quotation/setSelectedCoupon', null);
      }
    },
    handleGoToCouponCenter() {
      window.open('/#/mySetting/couponCenter');
      this.isOpenCouponCenter = true;
    },
    async getProductAsideIntroData() {
      const { ID } = this.placeData;
      let bool = true;
      this.asideAboutData = null;
      this.getAboutIsError = false;
      const res = await this.api.getProductIntroDetail(ID).catch(() => { bool = false; });
      if (bool && res && res.data.Status === 1000) {
        this.asideAboutData = res.data.Data;
      } else {
        this.getAboutIsError = true;
      }
    },
    onHomeDetailClick() {
      window.open(`${homeUrl}product/${this.placeData.ID}.html`);
    },
    // 下面为配送地址相关
    async asyncInputchecker() {
      const resp = await this.$refs.oConsigneeAddressSetpComp.inputChecker();
      return resp;
    },
    clearAdd() {
      this.$refs.oConsigneeAddressSetpComp.initCurAddIndex();
    },
    setAddressInfo4PlaceOrder(data) {
      this.$store.commit('Quotation/setAddressInfo4PlaceOrder', data);
    },
    changeSelectedAdd(data) {
      this.$store.commit('common/changeSelectedAdd', data);
    },
  },
  created() {
    this.$store.dispatch('common/getExpressList');
  },
  watch: {
    obj2GetProductPrice: {
      handler() {
        this.$store.commit('Quotation/setProductQuotationResult', null);
        this.priceGetErrMsg = '';
        this.$store.commit('Quotation/setRiskWarningTips', { origin: '', tipsList: '' });
      },
      deep: true,
    },
    watchAddInfoChange() {
      this.$store.commit('Quotation/setProductQuotationResult', null);
    },
    placeData: {
      handler(val) {
        if (!val || typeof val !== 'object') return;
        this.isCouponGet = false;
        this.isOpenCouponCenter = false;
        this.activeNames = [];
        const { ID, TipsDetail } = val;
        if (!ID || !TipsDetail) return;

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
    successNum() {
      this.isCouponGet = false;
      this.isOpenCouponCenter = false;
      this.activeNames = [];
    },
  },
};
</script>

<style lang="scss">
.mp-quotation-product-quotation-content-wrap {
  width: 1200px;
  margin: 25px auto 30px;
  margin-top: 0;
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
    padding-top: 22px;
    box-sizing: border-box;
    padding-bottom:9999px;
    margin-bottom:-9999px;
    > article > .content {
      padding-bottom: 25px;
      > .content-title {
        overflow: hidden;
        margin-bottom: 28px;
        height: 30px;
        line-height: 30px;
        display: flex;
        align-items: center;
        width: 100%;
        // justify-content: space-between;
        > div.left {
          float: left;
          flex: 1;
          display: flex;
          height: 100%;
          overflow: hidden;
          min-width: 360px;
          > div {
            color: #333;
            font-weight: 700;
            display: inline-block;
            vertical-align: top;
            overflow: hidden;
            max-width: 600px;
            white-space: nowrap;
            text-overflow: ellipsis;
            flex: 0 1 auto;
            > .blue-v-line {
              margin-right: 6px;
              &::before {
                vertical-align: middle;
              }
            }
          }
          > span {
            flex: none;
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
            padding: 0 6px;
            // &:hover {
            //   color:mix(#428dfa, #fff, 80%);
            // }
            // &:active {
            //   color: #428dfa
            // }
          }
        }
        > div.right {
          float: right;
          flex: none;
          > img {
            vertical-align: middle;
            margin-right: 12px;
          }
          > pre {
            display: inline-block;
            &::before {
              content: '|  ';
              margin-right: 6px;
            }
          }
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
      > .coupon-calculate-price-wrap {
        > .el-collapse {
          border: none;
          > .el-collapse-item {
            > div {
              > .el-collapse-item__header {
                text-align: left;
                display: inline-block;
                border: none;
                cursor: unset;
                margin-bottom: 10px;
                min-height: 66px;
                height: auto;
                .btns-box {
                  > button {
                    display: inline-block;
                    border-radius: 5px;
                    height: 40px;
                    width: 120px;
                    padding: 0;
                    vertical-align: top;
                    margin-right: 32px;
                    margin-left: 0;
                    > span > i {
                      transition: 0.2s;
                      margin-left: 8px;
                    }
                    > i {
                      font-size: 16px;
                      vertical-align: -1px;
                    }
                    &:first-of-type {
                      padding-left: 4px;
                    }
                  }
                  .err-or-selected-coupon-info-box {
                    display: inline-block;
                    vertical-align: top;
                    line-height: 26px;
                    white-space: nowrap;
                    height: 28px;
                    padding: 6px 0;
                    > span {
                      vertical-align: middle;
                      max-width: 540px;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      display: inline-block;
                    }
                  }
                }
                &.is-active > header > button > span > i {
                  transform: rotate(180deg);
                }
                .el-icon-arrow-right {
                  display: none;
                }
                .mp-quotation-content-tips-box-comp-wrap {
                  margin-top: 15px;
                }
              }
            }
            .el-collapse-item__wrap {
              border: none;
              > .el-collapse-item__content {
                padding: 0;
                > .coupon-wrap {
                  > header {
                    margin-bottom: 50px;
                    margin-top: 35px;
                    text-align: center;
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
                    max-height: 322px;
                    overflow-y: auto;
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

    > section {
      > .bg-gray {
        width: 1200px;
        height: 15px;
        margin: 15px -30px 0;
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
          height: 24px;
          line-height: 24px;
          margin-top: 6px;
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

    .mp-pc-place-order-address-show-and-change-wrap > .content > ul > li > div.express-box .el-input .el-input__inner {
      height: 28px;
    }
  }
  .el-input.is-disabled .el-input__inner {
    background-color: #f8f8f8;
    border-color: #eee;
  }
  .mp-quotation-content-tips-box-comp-wrap {
    padding-top: 10px;
  }
}
</style>
