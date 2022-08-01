import Mock from 'mockjs';

export default () => {
  const temp = Mock.mock({
    Status: 1000,
    Message: '',
    DataNumber: 10000,
    VersionCode: 0,
    'Data|3': [
      {
        'InvoiceCategoryID|+1': 100001,
        CategoryName: '宣传印刷品',
        CategoryUnit: '张',
        'InvoiceAmount|1-1800': 0,
        'Number|1-50': 0,
        'FinalPrice|1-2000': 0,
      },
    ],
  });
  return temp;
};
