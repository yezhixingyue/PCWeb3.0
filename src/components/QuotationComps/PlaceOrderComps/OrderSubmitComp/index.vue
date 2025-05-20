<template>
  <section class="mp-pc-place-order-upload-and-submit-comp-wrap">
    <header class="bg-gray"></header>
    <div class="comp-title float print-content" v-show="!(isSpotGoods && FileList.length === 0)">
      <span class="left is-bold">印刷内容</span>
      <el-checkbox class="legal ft-13" v-model="isLegal" label="">印刷内容合法</el-checkbox>
      <span class="blue-span" @click="legalVisible = true">查看“承印品协议书”</span>
      <div class="select-credential">
        <p>
          <el-radio-group :value="radio" @input="selectTrademark">
            <el-radio :label="1" >无注册商标</el-radio>
            <el-radio :label="2" >带注册商标</el-radio>
          </el-radio-group>
        </p>
        <p class="credential-name">
          <span v-if="SelectCertificate" @click="checkClick()" :title="SelectCertificate.CertificateName"
          style="display: flex; align-items: center; cursor: pointer;">
            <img src="@/assets/images/img-icon.png" alt="">
            <p>{{SelectCertificate.CertificateName}}</p>
          </span>
        </p>
        <p class="reselection">
          <span v-if="SelectCertificate" @click="reselect"
          style="display: flex; align-items: center; cursor: pointer;">
            <img src="@/assets/images/select-icon.png" alt=""> 重新选择
          </span>
        </p>
        <el-image-viewer
          :showViewer.sync='showViewer'
          :PreviewSrc="PreviewSrc"
        />
        <SelectCertificateDialog :SelectCertificate="SelectCertificate" :visible.sync="SelectCertificateVisible" @submit="SelectCertificateSubmit" top="2%"/>
      </div>
    </div>
    <div class="content">
      <ul v-if="FileList && FileList.length > 0">
        <li class="file-content-box" v-show="!isSpotGoods">
           <el-form :model="ruleForm" ref="contentValidateForm" label-width="86px" @submit.native.prevent
            size="mini" hide-required-asterisk :disabled='isUploading || !isLegal'>
            <el-form-item
              label="文件内容："
              prop="fileContent"
              class="file-content"
              :rules="[
                { validator: handleFileContentvalidator },
                { max: 130, message: '文件内容不能超过130个字'},
                { pattern: /\S+/, message: '文件内容不能全部为空格'},
              ]"
            >
              <el-input
                v-model="ruleForm.fileContent"
                maxlength="130"
                show-word-limit
                placeholder="1.请填写文件中“具有明显特征”的名称；2.此名称不作为最终制作要求，请正确点选制作要求；"></el-input>
              <div class="design-document" v-show="!isSpotGoods">
                <DesignDocumentPopoverComp :disabled='isUploading  || !isLegal' />
              </div>
            </el-form-item>
            <el-form-item
              label="传稿人电话："
              prop="FileAuthorMobile"
              :disabled='isUploading  || !isLegal'
              :rules="[
                { pattern: phoneRegxp, message: '传稿人电话格式不正确'},
              ]"
            >
              <el-input
                v-model.trim="ruleForm.FileAuthorMobile"
                maxlength="20"
                placeholder="请输入传稿人电话，方便核对问题订单"></el-input>
            </el-form-item>
          </el-form>
        </li>
        <!-- <li class="design-document" v-show="!isSpotGoods">
          <DesignDocumentPopoverComp :disabled='isUploading  || !isLegal' />
        </li> -->
        <li class="file-list-box">
          <FileListForm :FileList='FileList' ref="FileForm" @fillFileContent='fillFileContent' :disabled='isUploading  || !isLegal' :CustomerID='CustomerID' />
        </li>
      </ul>
      <div class="submit-btn-wrap">
        <el-button class="button-title-pink" :class="{disabled:!isLegal || (isUploading && uploadType === 'create')}"
         @click="onSave2TheCar" :loading="isUploading && uploadType === 'car'"
         :disabled="!isLegal || (isUploading && uploadType === 'create')">
          <template v-if="!(isUploading && uploadType === 'car')"><i class="iconfont icon-jiarugouwuche" ></i>加入购物车</template>
          <span v-else class="l">文件上传中...</span>
        </el-button>
        <el-button type="danger" @click="onSubmitOrder" :loading="isUploading && uploadType === 'create'"
         :disabled="!isLegal || (isUploading && uploadType === 'car')">{{submitText}}</el-button>
        <ComputedResultComp
          :ProductQuotationResult='ProductQuotationResult' showExpressCost :selectedCoupon='selectedCoupon' />
      </div>
      <div class="tips-box-wrap">
        <TipsBox />
      </div>
      <SubmitConfirmDialog :visible.sync="visible" :OrderPreData='OrderPreData' top="2%"
       isSubmitType :requestObj='requestObj' :FileCount='FileCount' @submit="handleSubmit" />
      <Dialog2Pay @close='handleCodeDialogClose' />
      <LegalAgreementDialog v-model="legalVisible"  />
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import { Loading } from 'element-ui';
import { imgUrl } from '@/assets/js/setup';
import ElImageViewer from '@/components/common/ImageViewer.vue';
import Dialog2Pay from '@/components/QuotationComps/PreCreateComps/Dialog2Pay.vue';
import TipsBox from '@/components/QuotationComps/QuotationContent/Comps/TipsBox';
// import ComputedResultComp from '../../ProductQuotationContentComps/NewPcComps/ComputedResultComp.vue';
import ComputedResultComp from '@/components/QuotationComps/QuotationContent/Comps/ComputedResultComp';
import DesignDocumentPopoverComp from './DesignDocumentPopoverComp.vue';
import FileListForm from './FileListForm/index.vue';
import SubmitConfirmDialog from './SubmitConfirmDialog/index.vue';
import LegalAgreementDialog from '../../../common/AgreementComps/LegalAgreementDialog.vue';
import SelectCertificateDialog from './SelectCertificateDialog.vue';

export default {
  components: {
    ComputedResultComp,
    DesignDocumentPopoverComp,
    FileListForm,
    SubmitConfirmDialog,
    SelectCertificateDialog,
    Dialog2Pay,
    TipsBox,
    LegalAgreementDialog,
    ElImageViewer,
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
    ...mapState('Quotation', [
      'selectedCoupon', 'ProductQuotationResult', 'addressInfo4PlaceOrder',
      'FileList', 'isUploading', 'curProductID', 'RiskWarningTipsTypes', 'curProductInfo2Quotation',
    ]),
    ...mapState('common', ['customerInfo', 'keepOrderData']),
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
    CustomerID() {
      return this.customerInfo && this.customerInfo.Account && this.customerInfo.Account.CustomerID ? this.customerInfo.Account.CustomerID : '';
    },
    CustomerMobile() {
      return this.customerInfo && this.customerInfo.Account && this.customerInfo.Account.Mobile ? this.customerInfo.Account.Mobile : '';
    },
  },
  data() {
    return {
      radio: 1,
      SelectCertificateVisible: false,
      title: '', // 用于弹窗标题显示   下单 | 添加购物车   后面自动添加失败2字
      visible: false,
      OrderPreData: null,
      requestObj: null,
      FileCount: 0,
      submitText: '直接下单',
      loadingInstance: null,
      uploadType: '',
      phoneRegxp: /^\d{11}$|^\d{7,12}$|^\d{3,4}-\d{6,8}$/,
      ruleForm: {
        fileContent: '',
        FileAuthorMobile: '',
      },
      isLegal: true, // 印刷内容是合法的
      legalVisible: false,
      SelectCertificate: null, // 选择的证书
      imgUrl,
      showViewer: false,
      PreviewSrc: null,
    };
  },
  methods: {
    async onSubmitOrder() { // 直接下单
      this.title = '下单';
      this.OrderPreData = null;
      this.requestObj = null;
      const result = await this.handleSummaryChecker(); // 总校验是否通过
      if (!result) return;
      const { fileContent, FileAuthorMobile } = this.ruleForm;
      const SelectCertificate = this.SelectCertificate?.CertificateID || '';
      const resp = await this.$store.dispatch(
        'Quotation/getOrderPreCreate',
        {
          compiledName: '', fileContent, FileAuthorMobile, SelectCertificate,
        },
      );
      if (resp) {
        if (Array.isArray(resp)) {
          const [PreCreateData, requestObj] = resp;
          this.OrderPreData = PreCreateData;
          this.requestObj = requestObj;
          this.FileCount = this.getFileCount();
          if (PreCreateData.RiskList && PreCreateData.RiskList.length > 0) {
            const tipsList = PreCreateData.RiskList.filter(it => it.First === 3).map(it => it.Second);
            if (tipsList.length > 0) this.$store.commit('Quotation/setRiskWarningTips', { origin: 'place', tipsList });
            const msgArray = PreCreateData.RiskList.filter(it => it.First === 2).map(it => it.Second);
            if (msgArray.length > 0) {
              this.messageBox.warnCancelBox({
                title: '注意',
                msg: [...msgArray, '继续下单吗？'],
                confirmButtonText: '是',
                cancelButtonText: '否',
                closeOnClickModal: false,
                successFunc: async () => {
                  this.$store.dispatch('common/setIsPopperVisibleAsync', false);
                  this.visible = true;
                },
                failFunc: () => {
                  this.OrderPreData = null;
                  this.requestObj = null;
                },
              });
            } else {
              this.$store.dispatch('common/setIsPopperVisibleAsync', false);
              this.visible = true;
            }
          } else {
            this.$store.dispatch('common/setIsPopperVisibleAsync', false);
            this.visible = true;
          }
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
      if (!FileList || FileList.includes(false)) return;
      // 完成后 提交
      // 打开支付弹窗
      if (FileList.length > 0) {
        const list = FileList.filter(it => it.List && it.List.length > 1);
        if (list.length > 0) {
          for (let i = 0; i < list.length; i += 1) {
            const _list = list[i].List.map(_it => _it.UniqueName);
            const len1 = _list.length;
            const len2 = [...new Set(_list)].length;
            if (len1 > len2) {
              this.messageBox.failSingleError({ title: '下单失败', msg: '存在重复文件（名称不同但文件相同），请检查' });
              return;
            }
          }
        }
      }
      // 下面执行加购提交操作
      const callBack = ({ Coupon } = {}) => {
        this.setRuleFormInit();
        this.scrollToTop();
        this.SelectCertificate = null;
        this.radio = 1;
        // 清除优惠券
        if (Coupon && Coupon.CouponCode) this.$emit('removeCoupon', Coupon.CouponCode);
      };
      const { fileContent, FileAuthorMobile } = this.ruleForm;
      const callbackOnError = this.handleSubmitOrJoinCarError;
      const SelectCertificate = this.SelectCertificate?.CertificateID || '';
      await this.$store.dispatch('Quotation/getQuotationSave2Car', {
        FileList, fileContent, FileAuthorMobile, callBack, callbackOnError, SelectCertificate,
      });
    },
    handleSubmitOrJoinCarError() { // 加入购物车及预下单失败（未设置）后的处理函数 暂无用 不做处理
    },
    scrollToTop() {
      this.$nextTick(() => {
        this.$store.commit('Quotation/setRiskWarningTips', { origin: '', tipsList: '' });
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
          lock: false,
          spinner: '文件上传中',
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
    handleFileContentvalidator(rule, value, callback) { // 文件内容验证，如果没有上传印刷文件则允许为空，否则为必填
      if (value) {
        callback();
        return;
      }
      if (!this.isSpotGoods) {
        const printFile = this.FileList.find(it => it.IsPrintFile);
        if (printFile) {
          const list = this.$refs.FileForm.getAllFileList();
          if (Array.isArray(list)) {
            const t = list.find(it => it.ID === printFile.ID);
            if (t && t.fileList.length > 0) {
              callback(new Error('请输入文件内容'));
              return;
            }
          }
        }
      }
      callback();
    },
    getFileCount() {
      let count = 0;
      if (this.FileList.length > 0) {
        count = this.$refs.FileForm.getFileCount();
      }
      return count;
    },
    fillFileContent(name) {
      // if (!this.fileContent) this.fileContent = name;
      this.ruleForm.fileContent = name;
    },
    async getProductPriceLocal() { // 校验函数  用来判断是否可以进行下单
      const res = await this.OrderPanelChecker();
      if (!res) return false;
      if (!this.ruleForm.fileContent && !this.isSpotGoods) return '请输入文件内容';
      if (this.ruleForm.FileAuthorMobile && !this.phoneRegxp.test(this.ruleForm.FileAuthorMobile)) return '传稿人电话格式不正确';
      if (!this.addressInfo4PlaceOrder || !this.addressInfo4PlaceOrder.Address.Address.Consignee) return '请选择配送地址';
      const asyncInputchecker = await this.asyncInputchecker();
      if (!asyncInputchecker) return '有内容未识别，请先识别或清除';
      if (this.addressInfo4PlaceOrder.OutPlate && this.addressInfo4PlaceOrder.OutPlate.Second) {
        const reg = /(^\d{12}$)|(^\d{19}$)|(^\d{6}-\d{15}$)|(^\d{12}$)/;
        if (!reg.test(this.addressInfo4PlaceOrder.OutPlate.Second)) {
          return '平台单号格式不正确';
        }
      }
      return true;
    },
    async FileChecker() { // 获取文件校验结果信息
      if (!this.$refs.FileForm) return '';
      const [bool, obj] = await this.$refs.FileForm.validate();
      return bool ? '' : Object.values(obj).map(it => it[0].message).reverse();
    },
    async OrderPanelChecker() { // 下单面板校验及返回页面顶部处理
      const bool = await this.getCheckResult();
      if (bool !== true) {
        let dom = document.getElementsByClassName('el-form-item__error')[0];
        if (dom) dom = dom.parentElement;
        const complete = () => {
          const oInputWrap = dom.getElementsByClassName('mp-erp-number-type-element-display-input-comp')[0];
          if (oInputWrap) {
            const oInputDom = oInputWrap.getElementsByClassName('el-input__inner')[0];
            if (oInputDom) {
              oInputDom.focus();
            }
          }
        };
        const cb = () => {
          this.utils.handleScrollAfterGetPriceFailed(dom, 130, 0, complete);
        };
        this.messageBox.failSingleError({
          title: `${this.title}失败`, msg: bool, successFunc: cb, failFunc: cb,
        });
        return false;
      }
      return true;
    },
    async FileContentChecker() {
      if (!this.$refs.contentValidateForm) return '';
      const res = await this.$refs.contentValidateForm.validate().catch(() => {});
      if (!res && !this.isSpotGoods) {
        if (!this.ruleForm.fileContent) return '请输入文件内容';
        if (this.ruleForm.fileContent && this.ruleForm.fileContent.length > 130) return '[ 文件内容 ] 字数不能超过130个字';
        if (this.ruleForm.FileAuthorMobile && !this.phoneRegxp.test(this.ruleForm.FileAuthorMobile)) return '传稿人电话格式不正确';
        if (!/\S+/.test(this.ruleForm.fileContent)) return '文件内容不能全部为空格';
        return '文件内容输入有误，请检查';
      }
      return '';
    },
    AddressInfoChecker() {
      if (!this.addressInfo4PlaceOrder || !this.addressInfo4PlaceOrder.Address.Address.Consignee) return '请选择配送地址';
      if (!this.addressInfo4PlaceOrder.Address.Express.First || !this.addressInfo4PlaceOrder.Address.Express.Second) return '请选择配送方式，如果没有可用配送方式时请切换配送地址';
      return '';
    },
    async OutPlateChecker() {
      const asyncInputchecker = await this.asyncInputchecker();
      if (!asyncInputchecker) return '[ 识别内容 ] 中，有内容未识别，请先识别或清除';
      if (this.addressInfo4PlaceOrder.OutPlate && this.addressInfo4PlaceOrder.OutPlate.Second) {
        const reg = /(^\d{12}$)|(^\d{19}$)|(^\d{6}-\d{15}$)|(^\d{12}$)/;
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
        if (list.length > 1) {
          list = list.filter(it => it).map((it, i) => `${i + 1}、${it}`);
          list.unshift('错误：');
        }
        this.messageBox.failSingleError({ title: `${this.title}失败`, msg: list });
        return false;
      }
      if (!bool) return false;
      // this.$store.commit('Quotation/setRiskWarningTips', { origin: '', tipsList: '' });
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
      if (FileList.length > 0) {
        const list = FileList.filter(it => it.List && it.List.length > 1);
        if (list.length > 0) {
          for (let i = 0; i < list.length; i += 1) {
            const _list = list[i].List.map(_it => _it.UniqueName);
            const len1 = _list.length;
            const len2 = [...new Set(_list)].length;
            if (len1 > len2) {
              this.messageBox.failSingleError({ title: '下单失败', msg: '存在重复文件（名称不同但文件相同），请检查' });
              return;
            }
          }
        }
      }
      this.$store.commit('Quotation/setIsShow2PayDialog', true);
      const cb = () => {
        // this.$store.dispatch('common/getCustomerFundBalance');
        this.setRuleFormInit();
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
          failFunc: () => this.$store.commit('Quotation/setIsShow2PayDialog', false),
        });
      });
    },
    handleSuccessFunc() {
      this.setRuleFormInit();
      this.$emit('clearAdd');
      this.scrollToTop();
    },
    handleCodeDialogClose(isPaid) {
      if (!isPaid) {
        this.messageBox.warnSingleError({
          title: '订单已生成',
          msg: '请到未付款单中查看',
          // successFunc: () => { this.handleSuccessFunc(true); },
          successFunc: this.handleSuccessFunc,
          failFunc: this.handleSuccessFunc,
          // showCancelButton: true,
          // confirmButtonText: '前往未付款单',
        });
        if (!this.keepOrderData) {
          const _obj = JSON.parse(JSON.stringify(this.curProductInfo2Quotation));
          this.$store.commit('Quotation/setCurProductInfo2Quotation', { data: _obj, onlyClearParams: true });
        }
      } else {
        this.handleSuccessFunc();
      }
    },
    setRuleFormInit() {
      this.ruleForm.fileContent = '';
      if (!this.ruleForm.FileAuthorMobile) this.ruleForm.FileAuthorMobile = this.CustomerMobile;
      // if (this.$refs.contentValidateForm) this.$refs.contentValidateForm.resetFields();
      if (this.$refs.FileForm) this.$refs.FileForm.clearAllFile();
    },
    selectTrademark(e) {
      if (e === 2) {
        // 弹框选择商标
        this.SelectCertificateVisible = true;
      } else {
        this.SelectCertificate = null;
        this.radio = e;
      }
    },
    SelectCertificateSubmit(Data) {
      this.SelectCertificate = Data;
      this.radio = 2;
    },
    reselect() {
      this.SelectCertificateVisible = true;
    },
    checkClick(url) {
      const tempList = this.SelectCertificate.CertificatePics.map(it => imgUrl + it);
      const index = tempList.findIndex(it => it === url);
      this.PreviewSrc = [...tempList.slice(index), ...tempList.slice(0, index)];
      this.showViewer = true;
    },
  },
  mounted() {
    // this.$store.dispatch('Quotation/getFileTypeList');
  },
  watch: {
    curProductID: {
      handler() {
        this.setRuleFormInit();
      },
      immediate: true,
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
              padding-right: 65px;
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
            // width: 72px !important;
            color: #888;
          }
          .el-form-item__content {
            margin-left: 80px !important;
          }
          .el-form-item--mini.el-form-item {
            margin-bottom: 18px;
          }
          .el-form-item__error {
            padding-left: 8px;
          }
          .file-content {
            padding-bottom: 20px;
            .el-form-item__content {
              position: relative;
              .design-document {
                position: absolute;
              }
              .el-form-item__error {
                padding-left: 120px;
                padding-top: 8px;
              }
            }
          }
        }
        &.upload-box {
          text-align: right;
        }
        .design-document {
          padding-left: 15px;
          height: 22px;
          > span {
            position: relative;
          }
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
            line-height: 29px;
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
      margin-top: 48px;
      position: relative;
      > button {
        width: 140px;
        height: 40px;
        padding: 0;
        line-height: 38px;
        font-size: 15px;
        margin-right: 25px;
        margin-left: 0;
        > span > i {
          font-size: 19px;
          vertical-align: middle;
          margin-right: 14px;
          position: relative;
          top: -3px;
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
        &:last-of-type {
          margin-right: 32px;
        }

        &.button-title-pink.disabled {
          background-color: #fff !important;
          color: #ff9bb4 !important;
          border-color: #ff9bb4 !important;
        }
      }
      // > div {
      //  position: absolute;
      //  top: 0;
      //  left: 335px;
      //  width: 525px;
      // }
    }
    > .tips-box-wrap {
      padding-top: 20px;
      padding-bottom: 60px;
    }
  }

  .print-content {
    position: relative;
    .legal {
      margin: 0 15px;
      position: relative;
      top: 1px;
      margin-left: 38px;
      .el-checkbox__label {
        font-size: 13px;
        color: #585858;
      }
    }
    .blue-span {
      position: relative;
      top: 1px;
      font-size: 13px;
      text-decoration: underline;
    }
    .select-credential{
      float: right;
      display: flex;
      height: 100%;
      img{
        margin-right: 5px;
      }
      .reselection{
        font-size: 14px;
        width: 76px;
        display: flex;
        align-items: center;
        color: #AEAEAE;
      }
      .credential-name{
        width: 164px;
        box-sizing: border-box;
        padding-right: 20px;
        align-items: center;
        color: #428DFA;
        p{
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .el-radio-group{
        .el-radio{
          margin-right: 20px;
          .el-radio__label{
            padding-left: 5px;
          }
        }
      }
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
