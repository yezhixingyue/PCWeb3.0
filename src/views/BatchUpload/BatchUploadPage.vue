<template>
  <section class="mp-c-batch-upload-page-wrap">
    <header>
      <div class="content">
        <AddressChangeComp
          :ExpressTip='ExpressTip'
          :customer='customer'
          :UseSameAddress='UseSameAddress'
          :switchUseSameAddDisabled='canSelectList.length > 0'
          @changeUseSameAddress='onChangeUseSameAddress'
          @change="handleAddressChange"
          @validAddChange='handleValidAddChange'
          @popperVisible='handlePopperVisible'
        />
      </div>
    </header>
    <main>
      <div class="content">
        <div class="upload-btn-box">
          <FileSelectComp @change="handleFileChange" v-show="customer" :disabled="!canSelectFile || !isLegal" :accept='accept'
           :selectTitle='selectTitle' ref="oFileBox" />
          <el-checkbox v-show="customer" class="legal" v-model="isLegal" label="">印刷内容合法</el-checkbox>
          <span v-show="customer" class="blue-span agreement" @click="legalVisible = true">查看“承印品协议书”</span>
          <FailListComp :failedList='failedList' />
        </div>
        <MainTableComp
          ref="oTableWrap"
          :list='successedList'
          class="table"
          :multipleSelection='multipleSelection'
          :checkAllDisabled='canSelectList.length === 0'
          :accept='accept'
          :subExpressList='subExpressList'
          :UseSameAddress='UseSameAddress'
          :ShowProductDetail='ShowProductDetail'
          :disabled="!isLegal"
          @itemRemove='handleItemRemove'
          @itemUpload='handleItemUpload'
          @multipleSelect='handleMultipleSelect'
          @droped='onDroped' />
        <QrCodeForPayDialogComp v-model="QrCodeVisible" :payInfoData="payInfoData" @success='handlePaidSuccess' payType='21' showPayGroup showPayDescription>
          <div class="pay-info-box">
            <span>本次支付包含 <i>{{ successResult.number }}</i> 个已成功上传的订单</span>
            <span v-if="successResult.errNum">；另有 <i>{{ successResult.errNum }}</i> 个订单上传失败，请稍候再试。</span>
          </div>
        </QrCodeForPayDialogComp>
        <PreCreateDialog
         :visible.sync="preCreateVisible"
         :subExpressList='subExpressList'
         :PreCreateData="PreCreateData"
         :OriginList='preCreateOriginDataList'
         @submit="onOrderSubmit"
         >
        </PreCreateDialog>
      </div>
    </main>
    <footer>
      <div class="content" v-if="!isFootFixed">
        <BatchUploadFooterComp
          :productCost='productCost'
          :expressCost='expressCost'
          :allCost='allCost'
          :count="successedList.length"
          :canSelectList='canSelectList'
          :multipleSelection='isLegal ? multipleSelection : []'
          :UseSameAddress='UseSameAddress'
          @uploadSelected='handleUploadSelected'
          @removeSelected='handleRemoveSelected'
          @checkAll='handleCheckAll'
          @clearSuccess='handleClearSuccess'
          :address='address'
          />
      </div>
    </footer>
    <transition name="el-fade-in-linear">
      <footer  v-if="isFootFixed" class="floating">
        <div class="content">
          <BatchUploadFooterComp
            :productCost='productCost'
            :expressCost='expressCost'
            :allCost='allCost'
            :count="successedList.length"
            :failedList='failedList'
            :canSelectList='canSelectList'
            :multipleSelection='isLegal ? multipleSelection : []'
            :UseSameAddress='UseSameAddress'
            @uploadSelected='handleUploadSelected'
            @removeSelected='handleRemoveSelected'
            @checkAll='handleCheckAll'
            @clearSuccess='handleClearSuccess'
            :address='address'
          />
        </div>
      </footer>
    </transition>
    <LegalAgreementDialog v-model="legalVisible"  />
  </section>
</template>

<script>
// import CustomerSelectComp from '@/components/BatchUploadComps/Header/CustomerSelectComp.vue';
import AddressChangeComp from '@/packages/BatchUploadComps/Header/AddressChangeComp.vue';
// import ProductFilterComp from '@/components/BatchUploadComps/Main/ProductFilterComp.vue';
import FileSelectComp from '@/packages/FileSelectComp';
import FailListComp from '@/packages/BatchUploadComps/Main/FailListComp';
import MainTableComp from '@/components/BatchUploadComps/Main/MainTableComp/index.vue';
import BatchUploadFooterComp from '@/packages/BatchUploadComps/Footer/BatchUploadFooterComp';
import BatchUploadClass from '@/assets/js/ClassType/BatchUploadClass';
import ShowProductDetail from '@/store/Quotation/ShowProductDetail';
import { mapState, mapGetters } from 'vuex';
import QrCodeForPayDialogComp from '../../packages/QrCodeForPayDialogComp';
import PreCreateDialog from '../../packages/PreCreateDialog';
import LegalAgreementDialog from '../../components/common/AgreementComps/LegalAgreementDialog.vue';

export default {
  name: 'OrderBatchUploadPage',
  components: {
    /**
     * 页面头部组件
     */
    // CustomerSelectComp, // 客户选择组件(后台)
    AddressChangeComp, // 配送信息修改组件
    /**
     * 页面主体组件
     */
    // ProductFilterComp, // 产品筛选组件
    FailListComp, // 错误列表弹窗
    FileSelectComp, // 文件上传选择组件
    MainTableComp, // 主体表格组件
    /**
     * 页面底部组件
     */
    BatchUploadFooterComp, // 底部组件
    QrCodeForPayDialogComp,

    PreCreateDialog, // 预下单弹窗
    LegalAgreementDialog,
  },
  data() {
    return {
      Terminal: 1,
      OrderType: 2, // 2 是自助
      Position: 255, // 255 是自助上传
      // customer: null,
      address: null,
      accept: '.cdr,.jpg,.jpeg,.tiff,.tif,.rar,.zip,.pdf, .7z',
      failedList: [], // 解析失败的文件列表 -- 错误信息展示尚未完成  后续处理 ！！！
      successedList: [], // 解析成功的文件列表
      multipleSelection: [], // 文件选中列表
      QrCodeVisible: false,
      payInfoData: null,
      IsBatchUpload: true,
      Product: {
        isSingle: false,
        ClassID: '',
        TypeID: '',
        ProductID: '',
      },
      isFootFixed: false,
      preCreateVisible: false,
      preCreateOriginDataList: [], // 预下单原始列表数据，预下单确认后使用该列表数据生成订单
      PreCreateData: null, // 预下单数据（服务器返回数据）
      UseSameAddress: false,
      ShowProductDetail,
      isLegal: true,
      legalVisible: false,
      ExpressTip: '',
      successResult: { // 上传文件及订单提交相关结果
        number: 0,
        errNum: 0,
      },
    };
  },
  computed: {
    ...mapState('common', ['customerInfo', 'ScrollInfo']),
    ...mapState('Quotation', ['RiskWarningTipsTypes']),
    ...mapGetters('common', ['subExpressList']),
    customer() {
      return this.customerInfo;
    },
    canSelectFile() { // 是否允许选择产品（）
      if (!this.Product.ProductID && this.Product.isSingle) return false;
      if (!this.customer || !this.customer.CustomerID) return false;
      if (!this.UseSameAddress) return true;
      if (!this.address || !this.address.Address) return false;
      const { Address, AddressID, Express } = this.address.Address;
      if (!Express || (!Express.First && Express.First !== 0) || (!Express.Second && Express.Second !== 0)) return false;
      if (!AddressID) {
        if (!Address) return false;
        const {
          Latitude, Longitude, Mobile, AddressDetail, Consignee, ExpressArea,
        } = Address;
        if (!Latitude || !Longitude || !Mobile || !AddressDetail || !Consignee || !ExpressArea) return false;
        const { RegionalID, CityID, CountyID } = ExpressArea;
        if ((!RegionalID && RegionalID !== 0) || (!CityID && CityID !== 0) || (!CountyID && CountyID !== 0)) return false;
      }
      return true;
    },
    selectTitle() {
      if (!this.canSelectFile) {
        return '1.应先设置好收货地址与配送方式；\r\n2.单产品上传时，必须选中具体产品。';
      }
      return '';
    },
    productCost() { // 产品总费用
      return this.getPrice('CurrentCost', this.successedList);
    },
    expressCost() { // 运费总费用
      // return this.getPrice('ExpressCost', this.successedList);
      return 0;
    },
    allCost() { // 全部总费用
      return +((+this.productCost + +this.expressCost).toFixed(2));
    },
    basicObj() { // 基础对象信息
      const temp = {
        CustomerID: this.customer.CustomerID,
        Address: BatchUploadClass.getAddress4SubmitFromEditObj(this.address),
        Terminal: this.Terminal,
        ProductID: this.Product.ProductID && this.Product.isSingle ? this.Product.ProductID : '',
        PayInFull: false,
        OrderType: this.OrderType, // 2 是自助
        Position: this.Position, // 255 是自助上传
        IsBatchUpload: this.IsBatchUpload,
        IgnoreRiskLevel: this.RiskWarningTipsTypes.All,
        UseSameAddress: this.UseSameAddress,
      };
      return temp;
    },
    canSelectList() { // 可选上传列表
      if (this.successedList && this.successedList.length > 0) {
        return this.successedList.filter(it => it.orderStatus !== 'success');
      }
      return [];
    },
    scrollChange() {
      return this.ScrollInfo.scrollTop + this.ScrollInfo.scrollHeight + this.ScrollInfo.offsetHeight;
    },
  },
  methods: {
    /**
     * 顶部区域： 客户信息与地址相关
     */
    handleCustomerChange(data) { // 选中客户 --- 此时应清空已解析订单列表
      this.customer = data;
      this.handleCheckAll(false);
      this.successedList = [];
      this.failedList = [];
    },
    onProductFilterChange([key, val]) { // 产品筛选发生改变 -- 同上：清空已解析订单列表
      if (!key) return;
      this.Product[key] = val;
      this.handleCheckAll(false);
      this.successedList = [];
      this.failedList = [];
    },
    handlePaid(allAmount) { // 完成充值处理
      if (this.customer && this.customer.FundInfo) {
        this.customer.FundInfo.Amount = allAmount;
      }
    },
    handleAddressChange(address) { // 设置地址信息 --- 检查是否已有解析过的文件（解析成功且待上传） 如果有根据特定改变内容去改变列表价格 -- 待定
      this.address = address;
    },
    onChangeUseSameAddress(val) { // 切换使用相同和不同地址
      this.handleCheckAll(false);
      this.successedList = [];
      this.failedList = [];
      this.UseSameAddress = val;
    },
    // eslint-disable-next-line no-unused-vars
    handleValidAddChange(onlyAddChange) {
      // if (!this.successedList || this.successedList.length === 0) return;
      // BatchUploadClass.getFreightCalculateAfterValidAddressChange(this.successedList, this.basicObj, onlyAddChange);
    },
    handlePopperVisible(bool) {
      this.$store.dispatch('common/setIsPopperVisibleAsync', bool);
    },
    /**
     * 中上部区域： 文件选择相关
     */
    handleFileChange(fileList) { // 选中文件 并对其后续进行处理 （注：每次选中文件都清空掉上次选中文件）
      if (!this.canSelectFile || !this.isLegal) return;
      if (fileList.length + this.successedList.length > 100) {
        this.messageBox.failSingleError({ title: '文件选择失败', msg: '一次最多不能超过100个文件' });
        return;
      }
      this.handleFileParing(fileList);
    },
    async handleFileParing(fileList) { // 处理文件解析 并生成处理成功列表 及 处理失败列表
      const temp = {
        successedList: this.successedList,
        failedList: this.failedList,
      };
      const result = await BatchUploadClass.getFileParingResult(fileList, this.basicObj, temp);
      if (!result) {
        // this.failedList = [];
        // this.successedList = [];
        return;
      }
      const { failedList, successedList } = result;

      if (failedList.length > 0) {
        if (successedList.length === 0 && failedList.length === 1) {
          this.messageBox.failSingleError({ title: '解析失败', msg: failedList[0].error });
        } else {
          const text = temp.failedList.length > 0 || temp.successedList.length > 0 ? '本次' : '';
          this.messageBox.warnSingleError({ title: `${text}共有${failedList.length}个文件报价失败`, msg: '请在按钮右侧查看具体错误信息' });
        }
      }
      const _successedList = successedList.map(it => ({ ...it, Express: it.result.Express || it.Express }));
      this.failedList.push(...failedList);
      this.successedList.push(..._successedList);
    },
    /**
     * 下部区域： 文件上传、删除、选择等操作
     */
    handleMultipleSelect(val) { // 表格中复选框选中文件
      if (!this.isLegal) return;
      this.multipleSelection = val;
    },
    onDroped(e) {
      if (this.$refs.oFileBox?.$refs?.onFileSelector?.onDrop) {
        this.$refs.oFileBox.$refs.onFileSelector.onDrop(e);
      }
    },
    handleCheckAll(bool) { // 处理底部复选框选中事件
      if (!this.isLegal) return;
      if (this.$refs.oTableWrap && this.$refs.oTableWrap.$refs.multipleTable) {
        if (bool) { // 全选
          this.$refs.oTableWrap.$refs.multipleTable.toggleAllSelection();
        } else { // 清空
          this.$refs.oTableWrap.$refs.multipleTable.clearSelection();
        }
      }
    },
    handleUploadSelected() { // 上传选中文件
      if (this.successedList.length === 0 || this.multipleSelection.length === 0) return;
      // 需要筛选掉已上传成功的文件（已失败文件待定）
      this.handleBatchUploadFiles(this.multipleSelection);
    },
    handleClearSuccess() { // 清除已上传订单
      const list = this.successedList.filter(it => it.orderStatus === 'success').map(it => it.key);
      if (list.length > 0) {
        list.forEach(it => {
          const i = this.successedList.findIndex(_it => _it.key === it);
          if (i > -1) {
            this.successedList.splice(i, 1);
          }
        });
        // this.$message.success('已清除');
      }
      this.failedList = [];
    },
    handleRemoveSelected() { // 删除选中文件
      if (this.successedList.length === 0 || this.multipleSelection.length === 0 || !this.isLegal) return;
      this.messageBox.warnCancelBox({
        title: '确定删除选中订单吗 ?',
        msg: '删除后不可恢复',
        successFunc: () => {
          this.successedList = this.successedList.filter(it => !this.multipleSelection.includes(it));
        },
      });
    },
    handleItemRemove(item) { // 单个文件删除
      let msg = '删除后不可恢复';
      if (item && item.result && item.result.ProductParams?.Attributes?.DisplayName) {
        msg = `产品：[ ${item.result.ProductParams.Attributes.DisplayName} ]`;
      }
      this.messageBox.warnCancelBox({
        title: '确定删除该订单吗 ?',
        msg,
        successFunc: () => {
          const i = this.successedList.findIndex(_it => _it.key === item.key);
          if (i > -1) {
            this.successedList.splice(i, 1);
          }
        },
      });
    },
    handleItemUpload(item) { // 单个文件上传 this.basicObj
      this.handleBatchUploadFiles([item]);
    },
    cbToClearSuccessItem(list) { // 上传成功后从已选列表中删除上传成功选项
      if (this.$refs.oTableWrap && this.$refs.oTableWrap.$refs.multipleTable && this.multipleSelection.length > 0) {
        list.forEach(it => {
          this.$refs.oTableWrap.$refs.multipleTable.toggleRowSelection(it, false);
        });
      }
    },
    handleBalance(obj) {
      const { FundBalance, FundBeanNumber } = obj;
      const temp = {};
      if (typeof FundBalance === 'number') {
        temp.FundBalance = FundBalance;
      }
      if (typeof FundBeanNumber === 'number') {
        temp.FundBeanNumber = FundBeanNumber;
      }
      this.$store.commit('common/setCustomerBalance', temp);
    },
    handleSubmitSuccess(list, resp, errLen) { // 创建订单成功后的回调函数，打开支付窗口
      this.cbToClearSuccessItem(list);
      this.preCreateVisible = false;
      this.$store.dispatch('common/getCustomerFundBalance'); // 重新获取客户余额信息

      this.successResult.number = list.length;
      this.successResult.errNum = errLen;

      if (resp) {
        this.payInfoData = resp;
        this.QrCodeVisible = true;
        this.handleBalance(resp);
        return;
      }

      const msg = errLen ? `共有${list.length}个订单下单成功，另有${errLen}个订单文件上传失败` : undefined;
      this.messageBox.successSingle({ title: '下单成功', msg });

      // if (resp) {
      //   this.payInfoData = resp;
      //   this.QrCodeVisible = true;
      //   this.handleBalance(resp);
      // } else {
      //   const title = errLen ? `除${errLen}个订单文件上传失败外，共${list.length}个订单下单成功` : '下单成功';
      //   this.messageBox.successSingle({ title });
      // }
    },
    handlePaidSuccess() {
      this.messageBox.successSingle({ title: '下单并支付成功' });
      this.$store.dispatch('common/getCustomerFundBalance'); // 重新获取客户余额信息
    },
    async handleBatchUploadFiles(list) { // 执行单个文件上传或批量上传 （使用同一个方法） -- 在最终下单前 在客户界面 需进行预下单弹窗确认
      const _usePreCreate = false; // 是否使用预下单

      if (!_usePreCreate) { // 不使用预下单
        const temp = {
          ...this.basicObj,
          PayInFull: true,
          UsePrintBean: false,
        };
        BatchUploadClass.BatchUploadFiles(list, temp, this.handleSubmitSuccess);

        return;
      }

      // 预下单
      this.preCreateOriginDataList = [];
      const t = list.find(it => it.uploadStatus === 'fail' && it.error === '文件找不到');
      if (t) {
        const msg = list.length === 1 ? '文件找不到，请删除该行并重新选择文件上传' : '部分文件找不到，请删除该行并重新选择文件上传';
        this.messageBox.failSingleError({ title: '上传失败', msg });
        return;
      }
      const _PreData = await BatchUploadClass.getPreOrderCreate(list, this.basicObj);
      if (!_PreData) return;
      this.handleBalance(_PreData);
      this.PreCreateData = _PreData;
      this.preCreateOriginDataList = list;
      this.preCreateVisible = true;
    },
    onOrderSubmit({ OriginList, PayInFull, UsePrintBean }) { // 最终确认下单
      this.preCreateVisible = false;
      const temp = {
        ...this.basicObj,
        PayInFull,
        UsePrintBean,
      };
      BatchUploadClass.BatchUploadFiles(OriginList, temp, this.handleSubmitSuccess);
    },
    /**
     * 辅助函数
     */
    getPrice(key, list) { // 获取产品费用或运费的总和
      if (list && list.length > 0) {
        const num = list.map(it => (it.result && it.result[key] ? it.result[key] : 0)).filter(it => it).reduce((prev, next) => +prev + +next, 0);
        return +(num.toFixed(2));
      }
      return '';
    },
    async getExpressTip() {
      const resp = await this.api.getExpressTip().catch(() => null);
      if (resp && resp.data.Status === 1000) {
        this.ExpressTip = resp.data.Data;
      }
    },
  },
  watch: {
    scrollChange() {
      const { scrollTop, scrollHeight, offsetHeight } = this.ScrollInfo;
      const difference = scrollHeight - offsetHeight;
      if (difference - 165 - scrollTop > 0) this.isFootFixed = true;
      else this.isFootFixed = false;
    },
    successedList() {
      this.handlePageHeightChangeAfterDataChange();
    },
    customer: {
      handler() {
        if (this.customer?.PermissionInfo?.BatchUpload === false) {
          this.$router.replace('/placeOrder');
        }
      },
      immediate: true,
    },
  },
  async created() {
    this.getExpressTip();
    const accept = await BatchUploadClass.getFileSuffixList();
    if (accept) this.accept = accept;
  },
  mounted() {
    this.$store.dispatch('common/getExpressList');
    this.handlePageHeightChangeAfterDataChange = (() => { // 数据变化后对页面高度数据的重置处理 -- 选中文件解析过后 及 文件删除后调用 (直接监听列表数据变化)
      const oApp = document.getElementById('app');
      return () => {
        this.$nextTick(() => {
          if (!oApp) return;
          const { scrollTop, scrollHeight, offsetHeight } = oApp;
          this.$store.commit('common/setScrollInfo', { scrollTop, scrollHeight, offsetHeight });
        });
      };
    })();
  },
};
</script>
<style lang='scss'>
.mp-c-batch-upload-page-wrap {
  width: 100%;
  min-height: 800px;
  background-color: #f5f5f5;
  // margin: 0 auto;
  // overflow: hidden;
  // padding: 0 10px;
  box-sizing: border-box;
  font-size: 12px;
  color: #585858;
  position: relative;
  > header {
    background-color: #fff;
    > .content {
      padding: 0px;
      height: 115px;
      width: 1200px;
      margin: 0 auto;
      box-sizing: border-box;
      border-top: 1px dashed #eee;
      padding: 15px 0;
      padding-top: 12px;
      height: 200px;
      .mp-pc-place-order-address-show-and-change-wrap > .content.isBatchUploadUse > ul {
        margin: 0;
        margin-top: 7px;
        > li {
          color: #999;
          margin-top: 0px;
          .express-box .title{
            color: #999;
          }
        }
      }
      .el-radio-button__orig-radio:disabled:checked + .el-radio-button__inner {
        background-color: #a1c6fd !important;
        color: #fff;
        border-color: #a1c6fd !important;
      }
    }
  }
  > main {
    background-color: #fff;
    margin-top: 15px;
    display: block;
    padding-top: 8px;
    > div.content {
      width: 1200px;
      margin: 0 auto;
      > .upload-btn-box {
        padding-top: 5px;
        padding-bottom: 12px;
        > span {
          display: inline-block;
          &.upload-btn {
            margin-right: 20px;
          }
        }

        .legal {
          .el-checkbox__label {
            font-size: 13px;
            color: #585858;
          }
        }

        .agreement {
          margin: 0 15px;
          font-size: 13px;
          text-decoration: underline;
          margin-right: 25px;
        }
      }
      > .table {
        min-height: 515px;
      }
    }
  }
  > footer {
    background-color: #fff;
    height: 60px;
    padding-top: 11px;
    box-sizing: border-box;
    // box-shadow: 0px 9px 38px 0px rgba(211, 211, 211, 0.54);
    div.content {
      width: 1200px;
      margin: 0 auto;
    }
  }
  > footer.floating {
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #fff;
    z-index: 10;
    padding-top: 10px;
    right: 0px;
    box-shadow: 0px 0px 14px 7px rgba(136, 136, 136, 0.3);
    > div {
      width: 1200px;
      margin: 0 auto;
      position: relative;
      left: -8px;
    }
  }

  .pay-info-box {
    background-color: #FFEBF0;
    line-height: 33px;
    margin-top: 16px;
    color: #ff3769;
    font-size: 12px;
    font-weight: 700;
    padding: 0 20px;
    min-width: 350px;
    display: inline-block;

    i {
      font-size: 16px;
    }
  }
}
</style>
