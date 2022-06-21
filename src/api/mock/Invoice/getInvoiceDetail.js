import Mock from 'mockjs';

export default (e) => {
  const condition = JSON.parse(e.body);
  console.log(condition, e, e.url.split('=')[1]);
  const temp = Mock.mock({
    Status: 1000,
    Message: '',
    DataNumberz: 1,
    VersionCode: 0,
    Data: {
      InvoiceID: e.url.split('=')[1] || '8',
      'InvoiceStatus|1': [0, 10, 20, 30, 40],
      InvoiceAmount: 600000,
      InvoiceCategoryName: '宣传印刷品',
      'InvoiceTypeName|1': ['增值税专用发票', '电子普通发票'],
      CreateTime: '2022-06-07T07:43:16.968Z', // 提交申请时间
      OperateTime: '2022-06-07T07:43:16.968Z',
      'ReceiverName|1': ['张三', '李四', '王五', '赵六'],
      'ReceiverProvinceName|1': ['河南省'],
      'ReceiverCityName|1': ['郑州市'],
      'ReceiverCountyName|1': ['金水区', '二七区', '中原区'],
      ReceiverAddress: '花园路国基路花园SOHU',
      ReceiverContactWay: '13500001111',
      ExpressCompany: '顺丰',
      ExpressNumber: '123456789012345',
      'EnterpriseName|1': ['郑州印刷公司', '郑州名片之家电子商务有限公司', '影印设计'],
      CreditCode: 'BX1984319413134',
      RegisteredAddress: '郑州市金水区国基路花园路交叉口东100米',
      RegisteredTelephone: '0371-62540377',
      'OpeningBank|1': ['中国银行', '中国农业银行', '中国工商银行'],
      BankAccount: '111111111',
      EnterpriseStatus: 0,
      MakingTime: '2022-06-07T08:43:16.968Z', // 开票中时间
      MakedTime: '2022-06-07T09:43:16.968Z', // 开票完成时间
      MailedTime: '2022-06-07T17:43:16.968Z', // 邮寄完成时间
      RejectTime: '2022-06-07T17:43:16.968Z', // 驳回时间
      'InvoiceType|1': [1, 2],
      'InvoiceMainBody|1': [1, 2],
      Opinion: '您所填写的资质与工商数据对比，该资质税号审核不一致，请核实',
      ReceiverMail: '12345@163.com',
      PersonalName: '个人',
    },
  });

  return temp;
};
