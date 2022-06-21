// import { InvoiceTypeEnums } from './enums';
import CommonClassType from '../CommonClassType';

export default class InvoiceSearchListConditionClass extends CommonClassType {
  Page = 1

  PageSize = 10

  InvoiceType = ''

  InvoiceStatus = ''

  InvoiceApplyTime = {
    First: '',
    Second: '',
  }

  DateType = 'curMonth'

  KeyWords = ''
}
