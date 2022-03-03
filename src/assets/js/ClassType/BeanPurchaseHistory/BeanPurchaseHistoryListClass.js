import CommonClassType from '@/store/CommonClassType';
import api from '../../../../api';
import ConditionForPurchaseHistory from './ConditionForPurchaseHistory';

export default class BeanPurchaseHistoryListClass {
  condition = new ConditionForPurchaseHistory()

  dataList = []

  dataListNumber = 0

  loading = false

  /**
   * 设置筛选条件
   *
   * @param {*} [[key1, key2], value]
   * @memberof BeanPurchaseHistoryListClass
   */
  setCondition([[key1, key2], value]) {
    if (key2) this.condition[key1][key2] = value;
    else this.condition[key1] = value;
  }

  /**
   * 设置列表数据及总数量
   *
   * @param {*} [list, count]
   * @memberof BeanPurchaseHistoryListClass
   */
  setDateList([list, count]) {
    this.dataList = list;
    if (typeof count === 'number') this.dataListNumber = count;
  }

  /**
   * 获取列表数据
   *
   * @param {number} [Page=1]
   * @memberof BeanPurchaseHistoryListClass
   */
  async getDataList(Page = 1) {
    this.setCondition([['Page', ''], Page]);
    this.setDateList([[], undefined]);
    CommonClassType.setDate(this.condition, 'CreateDate');
    const temp = CommonClassType.filter(this.condition, true);
    this.loading = true;
    const resp = await api.getPrintBeanRechargeList(temp).catch(() => null);
    this.loading = false;
    if (resp && resp.data.Status === 1000) {
      this.setDateList([resp.data.Data, resp.data.DataNumber]);
    }
  }
}
