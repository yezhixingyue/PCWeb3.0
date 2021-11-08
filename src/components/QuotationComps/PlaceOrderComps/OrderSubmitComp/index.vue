<template>
  <section class="mp-pc-place-order-upload-and-submit-comp-wrap">
    <header class="bg-gray"></header>
    <div class="comp-title float" v-show="!(isSpotGoods && FileList.length === 0)">
      <span class="left is-bold">印刷内容</span>
    </div>
    <div class="content">
      <ul >
        <li class="file-content-box" v-show="!isSpotGoods">
           <el-form :model="{ fileContent: fileContent }" ref="contentValidateForm" label-width="86px"
            size="mini" hide-required-asterisk :disabled='isUploading'>
            <el-form-item
              label="文件内容："
              prop="fileContent"
              :rules="[
                { required: true, message: '请输入文件内容'},
                { max: 130, message: '文件内容不能超过130个字'},
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
        <li class="design-document" v-show="!isSpotGoods">
          <DesignDocumentPopoverComp :disabled='isUploading' />
        </li>
        <li class="file-list-box">
          <FileListForm :FileList='FileList' ref="FileForm" @fillFileContent='fillFileContent' :disabled='isUploading' />
        </li>
      </ul>
      <div class="submit-btn-wrap">
        <el-button class="button-title-pink" @click="onSave2TheCar" :loading="isUploading && uploadType === 'car'"
         :disabled="isUploading && uploadType === 'create'">
          <template v-if="!(isUploading && uploadType === 'car')"><i class="iconfont icon-jiarugouwuche" ></i>加入购物车</template>
          <span v-else class="l">文件上传中...</span>
        </el-button>
        <el-button type="danger" @click="onSubmitOrder" :loading="isUploading && uploadType === 'create'"
         :disabled="isUploading && uploadType === 'car'">{{submitText}}</el-button>
        <ComputedResultComp
          :ProductQuotationResult='ProductQuotationResult' :showExpressCost='true' :selectedCoupon='selectedCoupon' />
      </div>
      <div class="tips-box-wrap">
        <TipsBox />
      </div>
      <SubmitConfirmDialog :visible.sync="visible" :OrderPreData='OrderPreData' :requestObj='requestObj' :FileCount='FileCount' @submit="handleSubmit" />
      <Dialog2Pay @close='handleCodeDialogClose' />
    </div>
  </section>
</template>

<script>
import anime from 'animejs/lib/anime.es';
import { mapState } from 'vuex';
import { Loading } from 'element-ui';
import Dialog2Pay from '@/components/QuotationComps/PreCreateComps/Dialog2Pay.vue';
import TipsBox from '@/components/QuotationComps/QuotationContent/Comps/TipsBox';
// import ComputedResultComp from '../../ProductQuotationContentComps/NewPcComps/ComputedResultComp.vue';
import ComputedResultComp from '@/components/QuotationComps/QuotationContent/Comps/ComputedResultComp';
import DesignDocumentPopoverComp from './DesignDocumentPopoverComp.vue';
import FileListForm from './FileListForm/index.vue';
import SubmitConfirmDialog from './SubmitConfirmDialog/index.vue';

export default {
  components: {
    ComputedResultComp,
    DesignDocumentPopoverComp,
    FileListForm,
    SubmitConfirmDialog,
    Dialog2Pay,
    TipsBox,
  },
  props: {
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
    ...mapState('Quotation', ['selectedCoupon', 'ProductQuotationResult', 'addressInfo4PlaceOrder', 'FileList', 'isUploading', 'curProductID']),
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
      const t = this.FileList.find(it => it.IsPrintFile);
      return !t;
    },
  },
  data() {
    return {
      fileContent: '',
      title: '', // 用于弹窗标题显示   下单 | 添加购物车   后面自动添加失败2字
      visible: false,
      OrderPreData: null,
      requestObj: null,
      FileCount: 0,
      submitText: '直接下单',
      loadingInstance: null,
      uploadType: '',
    };
  },
  methods: {
    async onSubmitOrder() { // 直接下单
      this.title = '下单';
      this.OrderPreData = null;
      this.requestObj = null;
      const result = await this.handleSummaryChecker(); // 总校验是否通过
      if (!result) return;
      const resp = await this.$store.dispatch('Quotation/getOrderPreCreate', { compiledName: '', fileContent: this.fileContent });
      if (resp) {
        if (Array.isArray(resp)) {
          const [PreCreateData, requestObj] = resp;
          this.OrderPreData = PreCreateData;
          this.requestObj = requestObj;
          this.FileCount = this.getFileCount();
          this.visible = true;
        } else {
          // console.log('页面提示返回数据', resp); // 不做处理
        }
      }
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
      const result = await this.handleSummaryChecker(); // 总校验是否通过
      if (!result) return;
      this.uploadType = 'car';
      const FileList = await this.handleFileUpload();
      if (!FileList) return;
      // 下面执行加购提交操作
      const callBack = () => {
        this.fileContent = '';
        this.$refs.contentValidateForm.resetFields();
        this.scrollToTop();
      };
      await this.$store.dispatch('Quotation/getQuotationSave2Car', { FileList, fileContent: this.fileContent, callBack });
    },
    scrollToTop() {
      this.$nextTick(() => {
        this.$store.commit('Quotation/setRiskWarningTips', { origin: '', tips: '' });
        const backDom = document.getElementsByClassName('el-backtop')[0];
        if (backDom) backDom.click();
      });
    },
    // ----------------------------- 处理文件上传，生成文件上传对象
    async handleFileUpload() {
      // 1. 判断当前产品是否可以无文件提交 FileList
      let FileList;
      if (this.FileList.length === 0) { // 无文件上传，可以直接提交
        FileList = [];
      } else {
        // 2. 判断当前文件是否必须上传 --- 在提交方法中完成：当不必须上传且未传文件时，直接返回true
        this.$store.commit('Quotation/setIsUploading', true);
        this.loadingInstance = Loading.service({
          lock: true,
          spinner: '123',
          background: 'rgba(255, 255, 255, 0.1)',
        });
        const _FileList = await this.$refs.FileForm.submitAll(); // 执行文件上传 ------------- bool处还应返回文件解析名称 --- 然后生成文件上传格式对象，加入到提交对象中 -- 后面完成
        this.$store.commit('Quotation/setIsUploading', false);
        this.loadingInstance.close();
        if (Array.isArray(_FileList)) { // 文件上传通过，可以提交
          // 生成提交对象并返回
          FileList = _FileList;
        }
      }
      return FileList;
    },
    getFileCount() {
      let count = 0;
      if (this.FileList.length > 0) {
        count = this.$refs.FileForm.getFileCount();
      }
      return count;
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
    async FileChecker() { // 获取文件校验结果信息
      const [bool, obj] = await this.$refs.FileForm.validate();
      return bool ? '' : Object.values(obj).map(it => it[0].message).reverse();
    },
    async OrderPanelChecker() { // 下单面板校验及返回页面顶部处理
      const bool = await this.getCheckResult();
      if (bool !== true) {
        const scrollHandler = () => {
          const oFirstErrorDom = document.getElementsByClassName('el-form-item__error')[0];
          if (oFirstErrorDom && oFirstErrorDom.parentElement) {
            const { top } = oFirstErrorDom.parentElement.getBoundingClientRect();
            if (top - 130 < 0) { // 在视野外 需要滚动至上方
              const oApp = document.getElementById('app');
              if (oApp) {
                const willToTop = oApp.scrollTop + top - 200 > 0 ? oApp.scrollTop + top - 200 : 0;
                anime({
                  targets: oApp,
                  scrollTop: willToTop,
                  duration: 500,
                  easing: 'easeInOutQuad',
                });
              }
            }
          }
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
      if (!res && !this.isSpotGoods) {
        if (!this.fileContent) return '[ 文件内容 ] 中，请输入文件内容';
        if (this.fileContent && this.fileContent.length > 130) return '[ 文件内容 ] 字数不能超过130个字';
      }
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
      this.$store.commit('Quotation/setRiskWarningTips', { origin: '', tips: '' });
      return true;
    },
    async handleSubmit(data) { // 创建订单
      // 关闭弹窗
      this.visible = false;
      // 上传文件
      this.submitText = '文件上传中...';
      this.uploadType = 'create';
      const FileList = await this.handleFileUpload();
      this.submitText = '直接下单';
      if (!FileList || FileList.includes(false)) return;
      // 完成后 提交
      // 打开支付弹窗
      this.$store.commit('Quotation/setIsShow2PayDialog', true);
      const cb = () => {
        this.$store.dispatch('common/getCustomerFundBalance');
        this.fileContent = '';
        this.$refs.contentValidateForm.resetFields();
        this.$refs.FileForm.clearAllFile();
        this.$emit('clearAdd');
        this.scrollToTop();
      };
      const temp = { ...data, List: [{ ...data.List[0], FileList }] };
      if (!temp.List[0].Content) delete temp.List[0].Content;
      const _obj = { temp, cb, isFormOrder: true }; // isFormOrder 区分来自下单 或 购物车
      await this.$store.dispatch('Quotation/placeOrderFromPreCreate', _obj).catch((...args) => {
        const error = args[0];
        this.messageBox.handleLoadingError({
          title: '下单失败',
          error,
          successFunc: () => this.$store.commit('Quotation/setIsShow2PayDialog', false),
        });
      });
    },
    handleSuccessFunc() {
      this.fileContent = '';
      this.$refs.contentValidateForm.resetFields();
      this.$refs.FileForm.clearAllFile();
      this.$emit('clearAdd');
      this.scrollToTop();
    },
    handleCodeDialogClose(isPaid) {
      if (!isPaid) {
        this.messageBox.warnSingleError({
          title: '订单已生成',
          msg: '请到未付款单中查看',
          successFunc: this.handleSuccessFunc,
          failFunc: this.handleSuccessFunc,
        });
      } else {
        this.handleSuccessFunc();
      }
    },
  },
  mounted() {
    this.$store.dispatch('Quotation/getFileTypeList');
  },
  watch: {
    curProductID() {
      this.fileContent = '';
      this.$refs.contentValidateForm.resetFields();
    },
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
        .info-text {
          padding-bottom: 10px;
          font-size: 13px;
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
          margin-left: 25px;
        }
        .el-icon-loading {
          font-size: 17px;
        }
        .l {
          font-size: 14px;
          vertical-align: bottom;
        }
        &.el-button.is-loading {
          &:before {
            background-color: rgba(0,0,0,0);
          }
          font-size: 14px;
        }
      }
      > div {
       position: absolute;
       top: 0;
       left: 335px;
       width: 525px;
      }
    }
    > .tips-box-wrap {
      padding-top: 22px;
      padding-bottom: 80px;
    }
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
