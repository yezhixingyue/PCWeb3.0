<template>
  <section class="mp-c-batch-upload-page-wrap">
    <header>
      <div class="content">
        <ProductFilterComp v-model="Product" :disabled='canSelectList.length > 0' @change="onProductFilterChange" />
        <p class="tips-box">
          <i class="el-icon-warning"></i>
          <span>上传说明：多产品上传文件名必须携带产品名称。   单产品上传不需要携带产品名称，所有上传文件视同选定产品。</span>
        </p>
      </div>
    </header>
    <main>
      <div class="content">
        <div class="workbench">
          <AddressChangeComp :customer='customer' @change="handleAddressChange" @validAddChange='handleValidAddChange' />
          <FailListComp :failedList='failedList' />
          <FileSelectComp @change="handleFileChange" :disabled='!canSelectFile' :accept='accept' :selectTitle='selectTitle' ref="oFileBox" />
        </div>
        <MainTableComp
          ref="oTableWrap"
          :list='successedList'
          class="table"
          :multipleSelection='multipleSelection'
          :checkAllDisabled='canSelectList.length === 0'
          :accept='accept'
          @itemRemove='handleItemRemove'
          @itemUpload='handleItemUpload'
          @multipleSelect='handleMultipleSelect'
          @droped='onDroped' />
        <QrCodeForPayDialogComp v-model="QrCodeVisible" :payInfoData="payInfoData" @success='handlePaidSuccess' payType='21' showPayGroup showPayDescription />
        <PreCreateDialog :visible.sync="preCreateVisible" :PreCreateData="PreCreateData" :OriginList='preCreateOriginDataList' @submit="onOrderSubmit" />
      </div>
    </main>
    <footer>
      <div class="content" v-if="!isFootFixed">
        <BatchUploadFooterComp
          :productCost='productCost'
          :expressCost='expressCost'
          :allCost='allCost'
          :showPrice='successedList.length > 0'
          :failedList='failedList'
          :canSelectList='canSelectList'
          :multipleSelection='multipleSelection'
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
            :showPrice='successedList.length > 0'
            :failedList='failedList'
            :canSelectList='canSelectList'
            :multipleSelection='multipleSelection'
            @uploadSelected='handleUploadSelected'
            @removeSelected='handleRemoveSelected'
            @checkAll='handleCheckAll'
            @clearSuccess='handleClearSuccess'
            :address='address'
            />
        </div>
      </footer>
    </transition>
  </section>
</template>

<script>
// import CustomerSelectComp from '@/components/BatchUploadComps/Header/CustomerSelectComp.vue';
import AddressChangeComp from '@/components/BatchUploadComps/Header/AddressChangeComp.vue';
import ProductFilterComp from '@/components/BatchUploadComps/Main/ProductFilterComp.vue';
import FileSelectComp from '@/components/BatchUploadComps/Main/FileSelectComp.vue';
import FailListComp from '@/components/BatchUploadComps/Main/FailListComp.vue';
import MainTableComp from '@/components/BatchUploadComps/Main/MainTableComp/index.vue';
import BatchUploadFooterComp from '@/components/BatchUploadComps/Footer/BatchUploadFooterComp.vue';
import BatchUploadClass from '@/assets/js/ClassType/BatchUploadClass';
import QrCodeForPayDialogComp from '@/components/common/QrCodeForPayDialogComp';
import PreCreateDialog from '@/components/BatchUploadComps/PreCreateDialog/index.vue';
import { mapState } from 'vuex';

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
    ProductFilterComp, // 产品筛选组件
    FailListComp, // 错误列表弹窗
    FileSelectComp, // 文件上传选择组件
    MainTableComp, // 主体表格组件
    /**
     * 页面底部组件
     */
    BatchUploadFooterComp, // 底部组件
    QrCodeForPayDialogComp,

    PreCreateDialog, // 预下单弹窗
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
    };
  },
  computed: {
    ...mapState('common', ['customerInfo', 'ScrollInfo']),
    ...mapState('Quotation', ['RiskWarningTipsTypes']),
    customer() {
      return this.customerInfo;
    },
    canSelectFile() { // 是否允许选择产品（）
      if (!this.Product.ProductID && this.Product.isSingle) return false;
      if (!this.customer || !this.customer.CustomerID || !this.address || !this.address.Address) return false;
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
      return this.getPrice('ExpressCost', this.successedList);
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
    handleValidAddChange(onlyAddChange) {
      if (!this.successedList || this.successedList.length === 0) return;
      BatchUploadClass.getFreightCalculateAfterValidAddressChange(this.successedList, this.basicObj, onlyAddChange);
    },
    /**
     * 中上部区域： 文件选择相关
     */
    handleFileChange(fileList) { // 选中文件 并对其后续进行处理 （注：每次选中文件都清空掉上次选中文件）
      if (!this.canSelectFile) return;
      this.handleFileParing(fileList);
    },
    async handleFileParing(fileList) { // 处理文件解析 并生成处理成功列表 及 处理失败列表
      const result = await BatchUploadClass.getFileParingResult(fileList, this.basicObj);
      if (!result) {
        this.failedList = [];
        this.successedList = [];
        return;
      }
      const { failedList, successedList } = result;
      this.failedList = failedList;
      this.successedList = successedList;
      if (failedList.length > 0) {
        this.messageBox.warnSingleError({ title: `共有${failedList.length}个文件报价失败`, msg: '请在按钮左侧查看具体错误信息' });
      }
    },
    /**
     * 下部区域： 文件上传、删除、选择等操作
     */
    handleMultipleSelect(val) { // 表格中复选框选中文件
      this.multipleSelection = val;
    },
    onDroped(e) {
      if (this.$refs.oFileBox?.$refs?.onFileSelector?.onDrop) {
        this.$refs.oFileBox.$refs.onFileSelector.onDrop(e);
      }
    },
    handleCheckAll(bool) { // 处理底部复选框选中事件
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
        this.$message.success('已清除');
      }
    },
    handleRemoveSelected() { // 删除选中文件
      if (this.successedList.length === 0 || this.multipleSelection.length === 0) return;
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
    handleSubmitSuccess(list, resp) { // 创建订单成功后的回调函数，打开支付窗口
      this.cbToClearSuccessItem(list);
      this.preCreateVisible = false;
      this.$store.dispatch('common/getCustomerFundBalance'); // 重新获取客户余额信息
      if (resp) {
        this.payInfoData = resp;
        this.QrCodeVisible = true;
        this.handleBalance(resp);
      } else {
        this.messageBox.successSingle({ title: '下单成功' });
      }
    },
    handlePaidSuccess() {
      this.messageBox.successSingle({ title: '下单并支付成功' });
      this.$store.dispatch('common/getCustomerFundBalance'); // 重新获取客户余额信息
    },
    async handleBatchUploadFiles(list) { // 执行单个文件上传或批量上传 （使用同一个方法） -- 在最终下单前 在客户界面 需进行预下单弹窗确认
      // 预下单
      this.preCreateOriginDataList = [];
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
  },
  async created() {
    const accept = await BatchUploadClass.getFileSuffixList();
    if (accept) this.accept = accept;
  },
  mounted() {
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
      padding-top: 30px;
      height: 115px;
      width: 1200px;
      margin: 0 auto;
      box-sizing: border-box;
      border-top: 1px dashed #eee;
      .tips-box {
        margin-top: 16px;
        width: 700px;
      }
    }
  }
  > main {
    background-color: #fff;
    margin-top: 20px;
    display: block;
    > div.content {
      width: 1200px;
      margin: 0 auto;
      > div.workbench {
        position: relative;
        padding: 15px 0;
        height: 100px;
        box-sizing: border-box;
        .upload-btn.mp-c-batch-upload-page-file-select-comp-wrap {
          position: absolute;
          right: 0;
          bottom: 22px;
          border-radius: 3px;
        }
        .mp-pc-place-order-address-show-and-change-wrap > .content > ul > li {
          color: #999;
          .express-box .title{
            color: #999;
          }
        }
        .mp-c-batch-upload-page-failed-list-comp-wrap {
          position: absolute;
          right: 140px;
          bottom: 30px;
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
}
</style>
