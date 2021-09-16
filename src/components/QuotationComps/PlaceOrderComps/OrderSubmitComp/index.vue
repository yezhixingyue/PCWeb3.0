<template>
  <section class="mp-pc-place-order-upload-and-submit-comp-wrap">
    <header class="bg-gray"></header>
    <div class="comp-title float" v-show="!isSpotGoods">
      <span class="left is-bold">印刷内容</span>
    </div>
    <div class="content">
      <ul v-show="!isSpotGoods">
        <li class="file-content-box">
           <el-form :model="{ fileContent: fileContent }" ref="contentValidateForm" label-width="86px"  size="mini" hide-required-asterisk>
            <el-form-item
              label="文件内容："
              prop="fileContent"
              :rules="[
                { required: true, message: '请输入文件内容'},
              ]"
            >
              <el-input
                v-model.trim="fileContent"
                maxlength="130"
                show-word-limit
                placeholder="1.请填写文件中“具有明显特征”的名称；2.此名称不作为最终制作要求，请正确点选制作要求；"></el-input>
            </el-form-item>
          </el-form>
        </li>
        <li class="design-document">
          <DesignDocumentPopoverComp />
        </li>
        <!-- <li class="upload-box">
          <UploadComp4BreakPoint ref='UploadComp4BreakPoint' :validateFunc='getProductPriceLocal'
            :shouldUpload='!isSpotGoods'
            :msgTitle='title' @fillFileContent='fillFileContent'
            :successFunc="successFunc" @saveFile2Store='saveFile2Store' />
        </li> -->
        <li class="file-list-box">
          <FileListForm :FileList='FileList' ref="FileForm" @fillFileContent='fillFileContent' />
        </li>
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
// import UploadComp4BreakPoint from '@/components/common/UploadComp/UploadComp4BreakPoint.vue';
import ComputedResultComp from '../../ProductQuotationContentComps/NewPcComps/ComputedResultComp.vue';
import DesignDocumentPopoverComp from './DesignDocumentPopoverComp.vue';
import FileListForm from './FileListForm';

export default {
  components: {
    // UploadComp4BreakPoint,
    ComputedResultComp,
    DesignDocumentPopoverComp,
    FileListForm,
  },
  props: {
    // isSpotGoods: { // 改成内部使用 -- 根据是否有印刷文件来确定 3.0不再有该内容
    //   type: Boolean,
    //   default: false,
    // },
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
    isSpotGoods() {
      if (!Array.isArray(this.FileList) || this.FileList.length === 0) return true;
      const t = this.FileList.find(it => it.File && it.File.IsPrintFile);
      return !t;
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
        // const callBack = () => {
        //   this.$store.commit('Quotation/setCurPayInfo2Code', null);
        //   this.$router.push('/OrderPreCreate');
        // };
        // this.$store.dispatch('Quotation/getOrderPreCreate', { compiledName, fileContent: this.fileContent, callBack });
      } else if (this.type === 'saveCar') {
        this.$store.dispatch('Quotation/getQuotationSave2Car', { compiledName, fileContent: this.fileContent, FileSize });
      }
    },
    async onSubmitOrder() { // 直接下单
      this.title = '下单';
      this.type = 'placeOrder';
      const result = await this.handleSummaryChecker(); // 总校验是否通过
      if (!result) return;
      const callBack = () => {
        this.$store.commit('Quotation/setCurPayInfo2Code', null);
        this.$router.push('/OrderPreCreate');
      };
      this.$store.dispatch('Quotation/getOrderPreCreate', { compiledName: '', fileContent: this.fileContent, callBack });
    },
    async onSave2TheCar(evt) { // 加入购物车
      let { target } = evt;
      if (target.nodeName === 'SPAN') {
        target = evt.target.parentNode;
      } else if (target.nodeName === 'I') {
        target = evt.target.parentNode.parentNode;
      }
      target.blur();
      this.title = '添加';
      this.type = 'saveCar';
      const result = await this.handleSummaryChecker(); // 总校验是否通过
      if (!result) return;
      this.$refs.FileForm.submitAll();
      // await this.$refs.UploadComp4BreakPoint.handleElUpload();
    },
    fillFileContent(name) {
      this.fileContent = name;
    },
    async getProductPriceLocal() { // 校验函数  用来判断是否可以进行下单
      const res = await this.OrderPanelChecker();
      if (!res) return false;
      if (!this.fileContent && !this.isSpotGoods) return '[ 文件内容 ] 中，请输入文件内容';
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
    async FileChecker() { // 获取文件校验结果信息
      const [bool, obj] = await this.$refs.FileForm.validate();
      return bool ? '' : Object.values(obj).map(it => it[0].message).reverse();
    },
    async OrderPanelChecker() { // 下单面板校验及返回页面顶部处理
      const bool = await this.getCheckResult();
      if (bool !== true) {
        const scrollHandler = () => {
          // const app = document.getElementById('app');
          // if (app) {
          //   this.utils.animateScroll(app.scrollTop, 0, num => {
          //     app.scrollTop = num;
          //   });
          // }
          const backDom = document.getElementsByClassName('el-backtop')[0];
          if (backDom) backDom.click();
        };
        this.messageBox.failSingleError({
          title: `${this.title}失败`, msg: bool, successFunc: scrollHandler, failFunc: scrollHandler,
        });
        return false;
      }
      return true;
    },
    async FileContentChecker() {
      const res = await this.$refs.contentValidateForm.validate().catch(() => {});
      if (!res && !this.isSpotGoods) return '[ 文件内容 ] 中，请输入文件内容';
      return '';
    },
    AddressInfoChecker() {
      if (!this.addressInfo4PlaceOrder || !this.addressInfo4PlaceOrder.Address.Address.Consignee) return '请选择配送地址';
      return '';
    },
    async OutPlateChecker() {
      const asyncInputchecker = await this.asyncInputchecker();
      if (!asyncInputchecker) return '[ 识别内容 ] 中，有内容未识别，请先识别或清除';
      if (this.addressInfo4PlaceOrder.OutPlate && this.addressInfo4PlaceOrder.OutPlate.Second) {
        const reg = /(^\d{18}$)|(^\d{19}$)|(^\d{6}-\d{15}$)/;
        if (!reg.test(this.addressInfo4PlaceOrder.OutPlate.Second)) {
          return '平台单号格式不正确';
        }
      }
      return '';
    },
    async handleSummaryChecker() { // 总校验检查，返回最终校验结果 boolean
      // 1. 验证下单面板参数是否设置正确
      // 2. 校验收货信息是否正确
      // 3. 验证文件内容是否输入 (或可与文件校验互换)
      // 4. 校验必传文件是否上传及文件最大尺寸限制
      // 5. 全部通过则完成验证 返回true
      // ----------------------------------------   !!!

      // 1. 单独校验下单面板参数是否正确，不正确则返回至页面顶部
      const bool = await this.OrderPanelChecker();

      // 2. 对剩余部分进行统一校验
      let list = await Promise.all([
        this.AddressInfoChecker(), // 地址
        this.OutPlateChecker(), // 平台单号
        this.FileContentChecker(), // 文件内容
        this.FileChecker(), // 文件上传
      ]);
      list = list.filter(it => it).map(it => (Array.isArray(it) ? it : [it])).filter(it => it.length > 0).reduce((a, b) => [...a, ...b], []); // 错误信息列表
      if (list.length > 0 && bool) {
        this.messageBox.failSingleError({ title: `${this.title}失败`, msg: list });
        return false;
      }
      if (!bool) return false;
      return true;
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
          margin-bottom: 0px;
          .el-input {
            width: 700px;
            > input {
              height: 30px;
              font-size: 13px;
              line-height: 26px\0;
              width: 100%;
              &::placeholder {
                font-size: 12px;
                line-height: 24px;
                letter-spacing: 0.5px;
              }
            }
          }
          .el-form-item__label {
            font-size: 14px;
            padding-right: 2px;
            width: 72px !important;
            color: #888;
          }
          .el-form-item__content {
            margin-left: 80px !important;
          }
          .el-form-item--mini.el-form-item {
            margin-bottom: 18px;
          }
        }
        &.upload-box {
          text-align: right;
        }
        &.design-document {
          padding-left: 80px;
        }
        &.file-list-box {
          padding-bottom: 10px;
          padding-top: 5px;
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

.mp-file-upload-tips-popover-wrap {
  margin: 0 2px;
  > header {
    font-size: 16px;
    padding-left: 10px;
    height: 32px;
    border-bottom: 1px solid #eee;
    padding-top: 3px;
    padding-bottom: 1px;
    > i {
      width: 19px;
      height: 18px;
      vertical-align: text-bottom;
      display: inline-block;
      margin-right: 10px;
      background: url('../../../../assets/images/upload-tip.png') no-repeat center center/100% 100%;
    }
  }
  > ul {
    padding-top: 17px;
    padding-left: 10px;
    padding-bottom: 20px;
    > li {
      > p {
        font-size: 12px;
        color: #585858;
        padding: 5px 0;
        line-height: 14px;
      }
      > span {
        display: block;
        color: #888;
        font-size: 12px;
        line-height: 14px;
        padding: 5px 0;
      }
    }
  }
}
</style>
