import getEnumList from '../../utils/getEnumList';

export const BillBoughtStatusEnums = {
  NoPay: {
    ID: 1,
    Name: '未支付',
  },
  HavePay: {
    ID: 2,
    Name: '已支付',
  },
  Cancled: {
    ID: 255,
    Name: '已取消',
  },
};

export const BillBoughtStatusEnumList = getEnumList(BillBoughtStatusEnums);

export default class ConditionForPurchaseHistory {
  CreateDate = {
    First: '',
    Second: '',
  }

  DateType = 'today'

  Page = 1

  PageSize = 12

  Status = ''
}
