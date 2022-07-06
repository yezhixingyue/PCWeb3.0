import Mock from 'mockjs';

export default (e) => {
  const DataNumber = 29;
  const condition = JSON.parse(e.body);
  let count = 10;
  let OrderID = 100385916;
  if (condition) {
    const { Page, PageSize, IsAllowInvoice } = condition;
    if (Page && PageSize) {
      count = PageSize;
      if (Math.ceil(DataNumber / PageSize) <= Page) {
        count = (DataNumber % PageSize > 0) || DataNumber === 0 ? DataNumber % PageSize : PageSize;
      }
      if (!IsAllowInvoice) {
        OrderID = 100285916;
      }
      OrderID += Page * 10;
    }
  }
  console.log(condition);
  const label = `Data|${count}`;
  const temp = Mock.mock({
    Status: 1000,
    Message: '',
    DataNumber,
    VersionCode: 0,
    [label]: [
      {
        'OrderID|+1': OrderID,
        OriginalID: 0,
        InvoiceCategoryName: '宣传印刷品',
        'ProductName|1': ['测试下单', '普通不干胶', '文件处理产品', '工艺系列'],
        'Number|500-8000': 0,
        Unit: '张/款',
        'KindCount|1-50': 0,
        'FinalPrice|1-2000': 0,
        PaidPrintBean: 0,
        ReducedAmount: 0,
        RefundAmount: 0,
        'InvoiceAmount|1-1800': 0,
        FinishTime: '@date("yyyy-MM-ddTHH:mm:ss")',
        ProduceTime: '2022-06-07T07:43:16.968Z',
        OrderTime: '2022-06-07T07:43:16.968Z',
        OrderStatus: 10,
        'NotAllowReason|1': ['订单未完成', '超过有效期', '补印单', '已申请开票'],
        CustomerID: '00000000-0000-0000-0000-000000000000',
        ProductID: '00000000-0000-0000-0000-000000000000',
        ProductClassID: 0,
        ProductTypeID: 0,
        CompanyID: 0,
        IsAllowInvoice: condition.IsAllowInvoice,
      },
    ],
  });

  return temp;
};
