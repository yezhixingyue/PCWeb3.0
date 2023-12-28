/* eslint-disable max-len */
// eslint-disable-next-line import/no-cycle
import instance from '@/api/axios';

const api = {
  /* 登录注册部分 与 账号相关等 api
  ----------------------------------------------------------------------------------- */
  getLogin(data) { // POST /Api/Customer/Login
    return instance.post('/Api/Customer/Login', data, { closeLoading: true });
  },
  getThirdLoginOAuth(data) { // /Api/ThirdLogin/OAuth  获取授权
    return instance.post('/Api/ThirdLogin/OAuth', data);
  },
  getThirdLoginBind(data) { // POST /Api/ThirdLogin/Bind 绑定
    return instance.post('/Api/ThirdLogin/Bind', data);
  },
  getThirdLoginUnBind(thirdType) { // PUT /Api/ThirdLogin/UnBind 解绑
    return instance.put('/Api/ThirdLogin/UnBind', null, { params: { thirdType } });
  },
  getSmsCode(Mobile, Type = 0) {
    return instance.post('/Api/Sms/Send', { Mobile, Type });
  },
  getApiSaveRecord(data) { // 埋点记时上报
    return instance.post('/Api/SaveRecord', data, { closeLoading: true, closeTip: true }); // 该接口不应配置tracking为true
  },
  // /Api/Address/Search GET请求，参数address
  getAddressSearch(address) {
    return instance.get('/Api/Address/Search', { params: { address } });
  },
  getCaptcha(data) { // 图片验证码
    // eslint-disable-next-line object-curly-newline
    const { closeLoading, width, height, fontSize } = data;
    return instance.get(`/Api/Captcha?width=${width}&height=${height}&fontSize=${fontSize}`, { closeLoading });
  },
  // 验证图片验证码 并获取短信信息 POST /Api/Sms/Send/VerificationCode { "Mobile": "string", "Code": "string", "Type": 0 } 注册为0
  getVerificationCode(data) {
    return instance.post('/Api/Sms/Send/VerificationCode', data);
  },
  getReg(data) { // POST /Api/Customer/Reg
    return instance.post('/Api/Customer/Reg', data, { closeLoading: true });
  },
  getCheckCode(data) { // 验证重置短信息
    return instance.post('/Api/FindPassword/CheckCode', data);
  },
  getResetPassword(data) { // 重置密码
    return instance.post('/Api/FindPassword/ResetPassword', data);
  },
  getCustomerChangeMobile(data) { // POST /Api/Customer/ChangeMobile  修改手机号
    return instance.post('/Api/Customer/ChangeMobile', data);
  },
  getCustomerChangePassword(data) { // PUT /Api/Customer/ChangePassword
    return instance.put('/Api/Customer/ChangePassword', data);
  },
  getCustomerAccountList() { // GET /Api/Customer/AccountList 获取子账号列表
    return instance.get('/Api/Customer/AccountList');
  },
  getCustomerEditSubAccount(data) { // POST /Api/Customer/EditSubAccount 添加编辑子账号
    return instance.post('/Api/Customer/EditSubAccount', data);
  },
  getCustomerRemoveAccount(accountID) { // DELETE /Api/Customer/RemoveAccount 子账号删除
    return instance.delete(`/Api/Customer/RemoveAccount?accountID=${accountID}`);
  },
  getCustomerRemoveAddress(addressID) { // DELETE /Api/Customer/RemoveAddress 收货地址删除
    return instance.delete(`/Api/Customer/RemoveAddress?addressID=${addressID}`);
  },
  getCustomerSetDefaultAddress(data) { // PUT /Api/Customer/SetDefaultAddress  设置客户默认收货地址
    return instance.put('/Api/Customer/SetDefaultAddress', data);
  },
  getCustomerAddress(data) { // POST /Api/Customer/Address 客户收货地址设置
    return instance.post('/Api/Customer/Address', data);
  },

  /* 产品报价及下单部分api
  ----------------------------------------------------------------------------------- */
  getProductClassify() { // 获取产品分类
    return instance.post('/Api/Constant/VersionValid', { Key: 2 }, { closeLoading: true });
  },
  getProductLists(data = {}) { // 获取列表头部产品第三级列表
    return instance.post('/Api/Product/List', {
      FieldType: 1,
      ...data,
      TakeOrderWay: 2,
    }, { closeLoading: true });
  },
  getProductDetail([productID, closeLoading]) { // 根据产品ID获取到产品详细信息  GET /Api/Product/Detail  productID
    return instance.get(
      `/Api/Product/Detail?productID=${productID}&includeTips=${true}`,
      { closeLoading },
    );
  },
  getProductIntroDetail(productID) { // GET /Api/Product/GetProductDetail  获取下单时 右侧侧边栏 推荐列表
    return instance.get(`/Api/Product/Introduce?productID=${productID}`, { closeLoading: true });
  },
  getProductPrice(data) { // 价格信息计算  POST /Api/Calculate/ProductPrice
    // return instance.post('/Api/Calculate/ProductPrice', { Terminal: 1, ...data }, { closeLoading: true });
    return instance.post('/Api/Calculate/ProductPrice', { Terminal: 1, ...data }, { tracking: true });
  },
  getOrderPreCreate(data) { // POST /Api/Order/PreCreate  直接下单 - 预下单
    const { closeTip } = data;
    return instance.post('/Api/Order/PreCreate', data, { closeTip });
  },
  getQuotationSave(data) { // POST /Api/Quotation/Save  保存购物车
    return instance.post('/Api/Quotation/Save', { Terminal: 1, ...data });
  },
  CreateOrderFromPreCreate(data, config = { closeLoading: true, closeTip: true }) { // POST /Api/Order/Create
    return instance.post('/Api/Order/Create', { Terminal: 1, ...data }, { ...config, tracking: true });
  },
  getPayResult(payCode, type) { // GET /Api/PaymentOrder/PayResult 查询付款结果
    if (!type) return instance.get(`/Api/PaymentOrder/PayResult?payCode=${payCode}`);
    return instance.get(`/Api/PaymentOrder/PayResult?payCode=${payCode}&type=${type}`);
  },
  getAnalysisOutPlateNo(outPlateNo) { // 解析电商平台单号收件人信息   GET /Api/Analysis/OutPlateNo
    return instance.get('/Api/Analysis/OutPlateNo', { params: { outPlateNo } });
  },

  /* 优惠券部分api
  ----------------------------------------------------------------------------------- */
  getCouponList(data) { // POST /Api/Customer/CouponList  下单界面使用
    return instance.post('/Api/Customer/CouponList', { FieldType: 3, OrderType: 2, ...data });
  },
  getMyCoupon(data) { // POST /Api/Customer/MyCoupon    --- UseStatus：  0 未使用  1 已使用  2 已过期    获取带状态对应条数的优惠券列表
    return instance.post('/Api/Customer/MyCoupon', { FieldType: 1, OrderType: 2, ...data });
  },
  getCouponActivate(data) { // POST /Api/Coupon/Activate    优惠券激活
    return instance.post('/Api/Coupon/Activate', data);
  },
  getCouponRemove(couponCode) { // DELETE /Api/Customer/Coupon/Remove 优惠券删除
    return instance.delete(`/Api/Customer/Coupon/Remove?couponCode=${couponCode}`);
  },
  getCouponReceiveableList(Page, PageSize) { // GET /Api/Coupon/ReceiveableList  获取可领取优惠券列表
    return instance.get(`/Api/Coupon/ReceiveableList?Page=${Page}&PageSize=${PageSize}`);
  },
  getCouponReceive(data) { // POST /Api/Coupon/Receive 优惠券领取
    return instance.post('/Api/Coupon/Receive', data);
  },

  /* 客户信息 配送方式 等公共部分api
  ----------------------------------------------------------------------------------- */
  getCustomerDetail() { // GET /Api/Customer/Detail  客户基础信息
    return instance.get('/Api/Customer/Detail', { closeLoading: true });
  },
  getExpressList() { // 获取配送方式
    return instance.get('/Api/Express/List', { closeLoading: true });
  },
  getNoticeList() { // GET /Api/Notice/List  获取公告列表   showNumber 默认10条
    return instance.get('/Api/Notice/List', { closeLoading: true, params: { showNumber: 3 } });
  },
  getAddressIDList(data) { // 查询地址ID
    return instance.get(`/Api/District/List?parentID=${data}`, { closeLoading: true });
  },
  getCustomerFundBalance() { // GET /Api/Customer/FundBalance 获取账号资金余额
    return instance.get('/Api/Customer/FundBalance', { closeLoading: true });
  },
  getCustomerApplyAuthentication(data) { // POST /Api/Customer/ApplyAuthentication 申请认证
    return instance.post('/Api/Customer/ApplyAuthentication', data);
  },
  // 申请认证(新)
  authenticationApply(data) {
    return instance.post('/Api/Company/Authentication/Apply', data);
  },
  getCustomerRecharge(data) { // POST /Api/Customer/Recharge 客户充值
    return instance.post('/Api/Customer/Recharge', data);
  },
  getExpressValidList(data) { // POST /Api/Express/ValidList 查询可用物流列表
    return instance.post('/Api/Express/ValidList', data, { closeLoading: true });
  },
  getExpressUseableCompanyList(data) { // POST /Api/Express/UseableCompanyList  获取可用快递和物流公司列表
    return instance.post('/Api/Express/UseableCompanyList', data, { closeLoading: true });
  },
  getExpressTip() { // POST /Api/Express/Tip  获取物流公司可用快递
    return instance.get('/Api/Express/Tip');
  },
  getFileTypeList() { // /Api/FileType/List 获取文件对应列表
    return instance.get('/Api/FileType/List');
  },
  /* 图片与文件上传api
   ----------------------------------------------------------------------------------- */
  // type 图片类型 为1时为营业执照会打水印
  uploadImage(data, type) { // 图片上传  POST /Api/Upload/Image
    const formData = new FormData();
    formData.append('file', data);
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return instance.post(`/Api/Upload/Image?type=${type}`, formData, config);
  },
  UploadBigImgNormal(data, uniqueName, onUploadProgressFunc) { // 非断点上传方式上传文件
    const formData = new FormData();
    formData.append('file', data);
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onUploadProgressFunc && onUploadProgressFunc,
    };
    return instance.post(`/Api/Upload/WholeFile?uniqueName=${uniqueName}`, formData, config);
  },
  getUploadedProgress(uniqueName) { // 获取断点续传文件已上传的位置  GET /Api/FileNode
    return instance.get(`/Api/FileNode?uniqueName=${uniqueName}`, { closeLoading: true });
  },
  UploadFileBreakpointResume(data, uniqueName, first, last, length, onUploadProgressFunc) { // 断点续传上传文件 /Api/Upload/File
    const formData = new FormData();
    formData.append('file', data);
    const config = {
      headers: {
        'Content-Range': `bytes ${first}-${last}/${length}`,
      },
      onUploadProgress: onUploadProgressFunc && onUploadProgressFunc,
    };
    return instance.post(`/Api/Upload/File?uniqueName=${uniqueName}`, formData, config);
  },

  /* 购物车部分 api
   ----------------------------------------------------------------------------------- */
  getQuotationList() { // GET /Api/Quotation/List 获取购物车数据列表
    return instance.get('/Api/Quotation/List', { params: { terminal: 1 } });
  },
  getQuotationRemove({ preOrderID, closeTip }) { // DELETE /Api/Quotation/Remove
    return instance.delete(`/Api/Quotation/Remove?preOrderID=${preOrderID}`, { closeTip });
  },

  /* 账单部分 api
   ----------------------------------------------------------------------------------- */
  getCustomerFundBill(data) { // /Api/Customer/FundBill 获取账单流水
    return instance.post('/Api/Customer/FundBill', data);
  },
  getCustomerFundBillExcel(data) { // /Api/Customer/FundBill 获取账单流水
    return instance.post('/Api/Customer/FundBillExcel', data, { responseType: 'arraybuffer' });
  },
  /* 订单部分 api
   ----------------------------------------------------------------------------------- */
  getCustomerOrderList(data) { // POST /Api/Customer/OrderList 获取订单列表
    return instance.post('/Api/Customer/OrderList', data, { tracking: true });
  },
  getOrderProgress(OrderID, closeLoading = false) { // GET /Api/Order/Progress  订单进度
    return instance.get('/Api/Order/Progress', { params: { OrderID }, closeLoading });
  },
  getOrderPackageList(OrderID, closeLoading = false) { // GET /Api/Order/PackageList  包裹列表
    return instance.get('/Api/Order/PackageList', { params: { OrderID }, closeLoading });
  },
  getOrderPackages(OrderID, closeLoading = false) { // GET /Api/Order/Packages 包裹列表(新)
    return instance.get('/Api/Order/Packages', { params: { OrderID }, closeLoading });
  },
  getOrderDetail(OrderID, closeLoading = false) { // GET /Api/Order/Detail  获取订单详情
    return instance.get('/Api/Order/Detail', { params: { OrderID }, closeLoading });
  },
  // DELETE /Api/Order/Cancle?orderID=100368895  订单取消
  getOrderCancle(OrderID) {
    return instance.delete(`/Api/Order/Cancle?orderID=${OrderID}`);
  },
  getCustomerOrderList4Excel(data) { // 导出客户订单列表 POST /Api/Customer/OrderExcel
    return instance.post('/Api/Customer/OrderExcel', data, { responseType: 'arraybuffer' });
  },
  getPackageProgress(packageID, expressID) { // GET /Api/Package/ExpressProgress 通过包裹号查询包裹配送进度
    return instance.get(`/Api/Package/ExpressProgress?packageID=${packageID}&expressID=${expressID}`, { closeLoading: true });
  },

  /* 文件批量上传api
  ----------------------------------------------------------------------------------- */
  getFileNameAnalysis(data) { // POST /Api/FileName/Analysis 文件名解析
    return instance.post('/Api/FileName/Analysis', data, { closeLoading: true, closeTip: true });
  },
  getFileSuffixList() { // /Api/File/SuffixList 获取批量上传支持的文件格式
    return instance.get('/Api/File/SuffixList', { closeLoading: true });
  },
  getOrderCreate(data, closeLoading = true) { // POST /Api/Order/Create 提交下单
    return instance.post('/Api/Order/Create', data, { closeLoading, tracking: true });
  },
  getFreightCalculate(data) { // POST /Api/Freight/Calculate 有效地址或配送方式发生变化时重新计算解析条目的运费价格
    return instance.post('/Api/Freight/Calculate', data, { closeLoading: true, closeTip: true });
  },

  /* 售后单部分 api
   ----------------------------------------------------------------------------------- */
  //  已弃用
  // getAfterSalesList(data) { // POST /Api/AfterSales/List 获取售后单列表
  //   return instance.post('/Api/AfterSales/List', data);
  // },
  getOrderAfterSaleList(data) { // POST /Api/OrderAfterSale/List  获取售后记录
    return instance.post('/Api/OrderAfterSale/List', data);
  },
  getServiceDetail(afterSaleCode) { // POST /Api/OrderAfterSale/ServiceDetail  获取售后详情
    return instance.get(`/Api/OrderAfterSale/ServiceDetail?afterSaleCode=${afterSaleCode}`);
  },
  getAfterSaleOrderList(data) { // POST /Api/AfterSaleOrder/List  获取售后申请列表
    return instance.post('/Api/AfterSaleOrder/List', data);
  },
  getApplyQuestionList() { // POST /Api/OrderAfterSale/ApplyQuestionList  获取客户申请售后问题分类列表
    return instance.get('/Api/OrderAfterSale/ApplyQuestionList');
  },
  getApplyQuestionApply(data) { // POST /Api/OrderAfterSale/Apply  售后申请
    return instance.post('/Api/OrderAfterSale/Apply', data);
  },
  getCancleApply(code) { // POST /Api/OrderAfterSale/CancleApply  取消售后申请
    return instance.put(`/Api/OrderAfterSale/CancleApply?afterSaleCode=${code}`);
  },
  getSolutionQuestionList() { // POST /Api/OrderAfterSale/SolutionQuestionList  获取售后常见问题分类列表
    return instance.get('/Api/OrderAfterSale/SolutionQuestionList');
  },
  getServiceLableList() { // POST /Api/OrderAfterSale/ServiceLableList  获取服务标签
    return instance.get('/Api/OrderAfterSale/ServiceLableList', { closeLoading: true });
  },
  getOrderAfterSaleEvaluateDetail(afterSaleCode) { // POST /Api/OrderAfterSale/EvaluateDetail  获取售后评价
    return instance.get(`/Api/OrderAfterSale/EvaluateDetail?afterSaleCode=${afterSaleCode}`, { closeLoading: true });
  },
  getOrderAfterSaleEvaluate(data) { // POST /Api/OrderAfterSale/EvaluateDetail  设置售后评价
    return instance.post('/Api/OrderAfterSale/Evaluate', data);
  },
  // 新售后不需要导出功能了
  // getServiceListData2Excel(data) { // POST /Api/AfterSales/Excel
  //   return instance.post('/Api/AfterSales/Excel', data, { responseType: 'arraybuffer' });
  // },

  /* 未付款订单部分 api
   ----------------------------------------------------------------------------------- */
  getUnpayList() { // 获取未付款单列表 POST /Api/Customer/UnpaidList
    return instance.post('/Api/Customer/UnpaidList', {});
  },
  getUnpayOrderCancle({ PayCode, isAddPrepare, closeTip }) { // 未付款单取消
    return instance.put(`/Api/PaymentOrder/Cancle?PayCode=${PayCode}&isAddPrepare=${isAddPrepare}`, { closeTip });
  },
  getOrderPrePay(data) { // POST /Api/Order/PrePay  直接下单 - 预下单
    const { closeTip } = data;
    return instance.post('/Api/Order/PrePay', data, { closeTip });
  },
  getPaymentOrderCreate(data) { // POST /Api/PaymentOrder/Create  直接下单 - 最终下单支付
    const { closeTip } = data;
    return instance.post('/Api/PaymentOrder/Create', data, { closeTip });
  },

  /* 客户设置api
   ----------------------------------------------------------------------------------- */
  getCustomConfigSave(data) { // POST /Api/CustomConfig/Save  设置客户接收短信提醒
    return instance.post('/Api/CustomConfig/Save', data);
  },

  /* 问题反馈api
   ----------------------------------------------------------------------------------- */
  getQuestionList() {
    return instance.get('/Api/OrderAfterSale/ApplyQuestionList');
  },
  // 已弃用 getAfterSalesApply   getAfterSalesApplyList   getAfterSalesCancle
  /*
  getAfterSalesApply(data) { // POST /Api/AfterSales/Apply 售后申请 问题反馈
    return instance.post('/Api/AfterSales/Apply', data);
  },
  getAfterSalesApplyList(data) { // POST /Api/AfterSales/ApplyList 获取售后申请列表
    return instance.post('/Api/AfterSales/ApplyList', data);
  },
  getAfterSalesCancle(applyCode) { // PUT /Api/AfterSales/Cancle 取消问题反馈
    return instance.put(`/Api/AfterSales/Cancle?applyCode=${applyCode}`);
  },
  */
  /* 印豆相关api
   ----------------------------------------------------------------------------------- */
  getShopPrintBeanList() { // GET /Api/Shop/PrintBean/List  商城-印豆购买列表
    return instance.get('/Api/Shop/PrintBean/List');
  },
  getShopPrintBeanBuy(data) { // POST /Api/Shop/PrintBean/Buy   商城-印豆购买
    return instance.post('/Api/Shop/PrintBean/Buy', data);
  },
  getCustomerBalance() { // 获取余额及印豆余额  /Api/Customer/Balance
    return instance.get('/Api/Customer/Balance', { closeLoading: true });
  },
  getPrintBeanRechargeList(data) { // POST /Api/PrintBean/Recharge/List  印豆购买记录列表
    return instance.post('/Api/PrintBean/Recharge/List', data);
  },
  getPrintBeanRechargeCancle(payCode) { // Delate请求 /Api/PrintBean/Recharge/Cancle 参数：payCode//付款单号  取消印豆购买条目
    return instance.delete('/Api/PrintBean/Recharge/Cancle', { params: { payCode } });
  },
  /* 发票相关 api
   ----------------------------------------------------------------------------------- */
  getOrderInvoiceList(condition) { // POST /Api/OrderInvoice/List  获取开票订单列表
    return instance.post('/Api/OrderInvoice/List', condition);
  },
  // getInvoiceOrderSelect(data) { // POST /Api/Invoice/OrderSelect  提交发票开具订单
  //   return instance.post('/Api/Invoice/OrderSelect', data);
  // },
  getInvoiceMakeoutCombine(data) { // 'POST /Api/Invoice/UseCategory'  合并开票 --- 临时使用 -- 接口地址会更改
    return instance.post('/Api/Invoice/UseCategory', data);
  },
  getInvoiceEnterpriseDetail() { // GET /Api/InvoiceEnterprise/Detail  发票企业信息 -- 包含审核状态
    return instance.get('/Api/InvoiceEnterprise/Detail');
  },
  getInvoiceHistoryDetail() { // GET /Api/InvoiceHistory/Detail  获取历史开票收票人信息
    return instance.get('/Api/InvoiceHistory/Detail');
  },
  getInvoiceSave(data) { // POST /Api/Invoice/Save   提交发票开具
    return instance.post('/Api/Invoice/Save', data);
  },
  getInvoiceList(condition) { // POST /Api/Invoice/List  发票查询列表数据
    return instance.post('/Api/Invoice/List', condition);
  },
  getInvoiceDetail(invoiceID) { // GET /Api/Invoice/Detail    发票详情
    return instance.get('/Api/Invoice/Detail', { params: { invoiceID } });
  },
  // 获取认证信息 (新)
  getAuthenticationInfo(ID) {
    return instance.get(`/Api/Company/Authentication/Info?customerID=${ID}`);
  },

  // getInvoiceCancel(invoiceID) { // GET /Api/Invoice/Cancel  取消
  //   return instance.get('/Api/Invoice/Cancel', { params: { invoiceID } });
  // },

};

export default api;
