import getEnumList from '../../utils/getEnumList';

export const BillTypeEnums = {
  PrintBean: {
    ID: 0,
    Name: '印豆账单',
  },
  FundCash: {
    ID: 1,
    Name: '现金余额账单',
  },
  Credit: { // 未使用
    ID: 2,
    Name: '欠款额账单',
  },
};

export const BillTypeEnumList = getEnumList(BillTypeEnums);

export default class ConditionForBillList {
  Date = {
    First: '',
    Second: '',
  }

  DateType = 'today'

  Page = 1

  PageSize = 12

  Type = ''

  BillType = BillTypeEnums.FundCash.ID
}
