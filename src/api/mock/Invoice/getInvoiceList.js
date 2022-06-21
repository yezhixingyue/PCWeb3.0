import Mock from 'mockjs';

export default (e) => {
  const DataNumber = 112;
  const condition = JSON.parse(e.body);
  let count = 10;
  let InvoiceID = 100385916;
  if (condition) {
    const { Page, PageSize } = condition;
    if (Page && PageSize) {
      count = PageSize;
      if (Math.ceil(DataNumber / PageSize) <= Page) {
        count = (DataNumber % PageSize > 0) || DataNumber === 0 ? DataNumber % PageSize : PageSize;
      }
      InvoiceID += Page * 10;
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
        'InvoiceID|+1': InvoiceID,
        InvoiceCategoryName: '宣传印刷品',
        'InvoiceTitle|1': ['三河湾信息科技', '个人', '影印设计', '郑州名片之家电子商务有限公司'],
        'InvoiceType|1-2': 1,
        'InvoiceAmount|1-2000': 0,
        CreateTime: '2022-06-07T07:43:16.968Z',
        OperateTime: '2022-06-07T07:43:16.968Z',
        'InvoiceStatus|0-4': 10,
      },
    ],
  });

  return temp;
};
