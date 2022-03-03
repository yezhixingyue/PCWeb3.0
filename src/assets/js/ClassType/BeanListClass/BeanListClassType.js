import api from '../../../../api';
import ConditionForBeanList from './ConditionForBeanList';
import BeanItemClassType from './BeanItemClassType';

export default class BeanListClassType {
  BeanList = []

  BeanListNumber = 0

  Condition = new ConditionForBeanList()

  loading = false

  /**
   * 获取列表数据
   *
   * @memberof BeanListClassType
   */
  async getBeanList() {
    this.BeanList = [];
    this.loading = true;
    const resp = await api.getShopPrintBeanList().catch(() => null);
    this.loading = false;
    // 完成赋值
    if (resp && resp.data.Status === 1000) {
      // this.Condition.Page = 1;
      this.BeanList = resp.data.Data.map(it => new BeanItemClassType(it));
      this.BeanListNumber = resp.data.Data.length;
    }
  }
}
