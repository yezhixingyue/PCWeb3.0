<template>
  <section class="mp-pc-place-order-upload-and-submit-comp-wrap">
    <header class="bg-gray"></header>
    <div class="comp-title float" v-show="!isSpotGoods">
      <span class="left is-bold">印刷内容</span>
    </div>
    <div class="content">
      <ul v-show="!isSpotGoods">
        <li class="file-content-box">
          <span class="title gray">文件内容：</span>
          <el-input
           v-model.trim="fileContent"
           maxlength="130"
           show-word-limit
           placeholder="1.请填写文件中“具有明显特征”的名称；2.此名称不作为最终制作要求，请正确点选制作要求；"></el-input>
        </li>
        <li class="design-document">
          <DesignDocumentPopoverComp />
        </li>
        <li class="upload-box">
          <UploadComp4BreakPoint ref='UploadComp4BreakPoint' :validateFunc='getProductPriceLocal'
            :shouldUpload='!isSpotGoods'
            :msgTitle='title' @fillFileContent='fillFileContent'
            :successFunc="successFunc" @saveFile2Store='saveFile2Store' />
        </li>
        <li v-for="it in FileList" :key="it.key" v-show="it.display">
          <UploadItem :required='it.IsRequired' :FileInfo='it.File' />
        </li>
        <!-- <li>
          <UploadItem />
        </li> -->
      </ul>
      <div class="submit-btn-wrap">
        <el-button class="button-title-pink" @click="onSave2TheCar">
          <i class="iconfont icon-jiarugouwuche" ></i>加入购物车</el-button>
        <el-button type="danger" @click="onSubmitOrder">直接下单</el-button>
        <ComputedResultComp
          :ProductQuotationResult='ProductQuotationResult' :showExpressCost='true' :selectedCoupon='selectedCoupon' />
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import UploadComp4BreakPoint from '@/components/common/UploadComp/UploadComp4BreakPoint.vue';
import ComputedResultComp from '../../ProductQuotationContentComps/NewPcComps/ComputedResultComp.vue';
import DesignDocumentPopoverComp from './DesignDocumentPopoverComp.vue';
import UploadItem from './UploadItem.vue';

export default {
  components: {
    UploadComp4BreakPoint,
    ComputedResultComp,
    DesignDocumentPopoverComp,
    UploadItem,
  },
  props: {
    isSpotGoods: {
      type: Boolean,
      default: false,
    },
    asyncInputchecker: {
      type: Function,
      default: () => {},
    },
    getCheckResult: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    ...mapState('Quotation', ['selectedCoupon', 'ProductQuotationResult', 'addressInfo4PlaceOrder', 'FileList']),
    coupon() {
      if (!this.ProductQuotationResult) return '';
      if (!this.selectedCoupon) return '';
      if (this.ProductQuotationResult.CurrentCost >= this.selectedCoupon.MinPayAmount) {
        return this.selectedCoupon.Amount;
      }
      return '';
    },
    Cost() {
      if (!this.ProductQuotationResult) return '';
      if (!this.selectedCoupon) return this.ProductQuotationResult.CurrentCost;
      if (this.ProductQuotationResult.CurrentCost >= this.selectedCoupon.MinPayAmount) {
        const num = +(this.ProductQuotationResult.CurrentCost - this.selectedCoupon.Amount).toFixed(2);
        return num > 0 ? num : 0;
      }
      return this.ProductQuotationResult.CurrentCost;
    },
  },
  data() {
    return {
      fileContent: '',
      title: '', // 用于弹窗标题显示   下单 | 添加购物车   后面自动添加失败2字
      type: '',
    };
  },
  methods: {
    successFunc({ compiledName, FileSize }) {
      if (this.type === 'placeOrder') {
        const callBack = () => {
          this.$store.commit('Quotation/setCurPayInfo2Code', null);
          this.$router.push('/OrderPreCreate');
        };
        this.$store.dispatch('Quotation/getOrderPreCreate', { compiledName, fileContent: this.fileContent, callBack });
      } else if (this.type === 'saveCar') {
        this.$store.dispatch('Quotation/getQuotationSave2Car', { compiledName, fileContent: this.fileContent, FileSize });
      }
    },
    async onSubmitOrder() {
      this.title = '下单';
      this.type = 'placeOrder';
      await this.$refs.UploadComp4BreakPoint.saveFile2Store();
    },
    async onSave2TheCar(evt) {
      let { target } = evt;
      if (target.nodeName === 'SPAN') {
        target = evt.target.parentNode;
      } else if (target.nodeName === 'I') {
        target = evt.target.parentNode.parentNode;
      }
      target.blur();
      this.title = '添加';
      this.type = 'saveCar';
      await this.$refs.UploadComp4BreakPoint.handleElUpload();
    },
    fillFileContent(name) {
      this.fileContent = name;
    },
    async getProductPriceLocal() { // 校验函数  用来判断是否可以进行下单
      const bool = await this.getCheckResult();
      if (!bool) {
        const scrollHandler = () => {
          const app = document.getElementById('app');
          if (app) {
            this.utils.animateScroll(app.scrollTop, 0, num => {
              app.scrollTop = num;
            });
          }
        };
        this.messageBox.failSingleError({
          title: `${this.title}失败`, msg: '产品参数设置有问题，请检查', successFunc: scrollHandler, failFunc: scrollHandler,
        });
        return false;
      }
      if (!this.fileContent && !this.isSpotGoods) return '请输入文件内容';
      if (!this.addressInfo4PlaceOrder || !this.addressInfo4PlaceOrder.Address.Address.Consignee) return '请选择配送地址';
      const asyncInputchecker = await this.asyncInputchecker();
      if (!asyncInputchecker) return '有内容未识别，请先识别或清除';
      if (this.addressInfo4PlaceOrder.OutPlate && this.addressInfo4PlaceOrder.OutPlate.Second) {
        const reg = /(^\d{18}$)|(^\d{19}$)|(^\d{6}-\d{15}$)/;
        if (!reg.test(this.addressInfo4PlaceOrder.OutPlate.Second)) {
          return '平台单号格式不正确';
        }
      }
      return true;
    },
    saveFile2Store(file) {
      this.$store.commit('Quotation/setOrderFile4PreCreateData', file);
    },
  },
  mounted() {
    this.$store.dispatch('Quotation/getFileTypeList');
  },
};
</script>

<style lang='scss'>
.mp-pc-place-order-upload-and-submit-comp-wrap {
  > .content {
    margin-top: 22px;
    > ul {
      border-bottom: 1px solid #eee;
      > li {
        margin-bottom: 30px;
        &.file-content-box {
          margin-bottom: 8px;
          > .el-input {
            width: 700px;
            > input {
              height: 30px;
              font-size: 13px;
              line-height: 26px\0;
              width: 100%;
              &::placeholder {
                font-size: 12px;
              }
            }
          }
          > .title {
            margin-right: 7px;
          }
        }
        &.upload-box {
          text-align: right;
        }
        &.design-document {
          padding-left: 78px;
        }
      }
    }
    > .price-wrap {
      height: 165px;
      text-align: right;
      > .price-box {
        height: 100%;
        overflow: hidden;
        display: inline-block;
        > div {
          padding-top: 33px;
          > p {
            line-height: 33px;
            &.final-price {
              margin-top: 6px;
            }
          }
          &.price-left {
            float: left;
          }
          &.price-right {
            float: right;
            margin-left: 10px;
            > p {
              min-width: 80px;
            }
          }
        }
      }
    }
    > .submit-btn-wrap {
      padding-bottom: 80px;
      margin-top: 60px;
      position: relative;
      > button {
        width: 140px;
        height: 40px;
        padding: 0;
        line-height: 38px;
        font-size: 15px;
        > span > i {
          font-size: 19px;
          vertical-align: middle;
          margin-right: 14px;
          position: relative;
          top: -3px;
        }
        & + button {
          margin-left: 40px;
        }
      }
      > div {
       position: absolute;
       top: 0;
       left: 360px;
      }
    }
    // > p {
    //   position: relative;
    //   top: 5px;
    // }
  }
}
</style>
