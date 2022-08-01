import { InvoiceMakeUpStatusEnums } from '../../packages/InvoiceComps/enums';
import CommonClassType from '../CommonClassType';

export default class InvoiceMakeupListConditionClass extends CommonClassType { // 或可考虑类继承 去继承公共类中筛选及对日期处理等方法
  Page = 1

  PageSize = 10

  OrderStatus = ''

  ProductClassID = []

  DateType = 'curMonth'

  OrderTime = {
    First: '',
    Second: '',
  }

  MakeupStatus = InvoiceMakeUpStatusEnums.canMakeup.ID

  KeyWords = ''

  constructor(_MakeupStatus) {
    super();
    if (_MakeupStatus || _MakeupStatus === 0) {
      this.MakeupStatus = _MakeupStatus;
    }
  }
}
