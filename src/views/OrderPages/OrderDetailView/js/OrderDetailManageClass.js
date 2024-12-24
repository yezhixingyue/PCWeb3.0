import api from '@/api';
import ThumbnailManageClass from './ThumbnailManageClass';

export default class OrderDetailManageClass {
  currentRow = null

  OrderDetail = null

  /** 快递单列表  { BillNo: string; PackageID: number; ExpressID: string }[] */
  BillNoList = []

  loading = false

  /** 预览数据 */
  Thumbnail = null

  /** 订单进度数据 */
  OrderProgress = {
    dataList: null,
    loading: false,
  }

  constructor(currentRow) {
    this.currentRow = currentRow;
  }

  async _getOrderDetailData() {
    if (!this.currentRow) return null;

    const resp = await api.getOrderDetail(this.currentRow.OrderID, true).catch(() => null);

    if (resp && resp.data.Status === 1000) {
      const OrderDetail = resp.data.Data;

      this.Thumbnail = new ThumbnailManageClass(OrderDetail);

      return OrderDetail;
    }

    return null;
  }

  async _getOrderBillNoList() {
    let _list = [];

    if (this.currentRow && [80, 200].includes(this.currentRow.Status)) {
      const res = await api.getOrderPackages(this.currentRow.OrderID, true).catch(() => null);

      if (res && res.data.Status === 1000 && res.data.Data) {
        const { ExpressBillType, BackPackageInfos, PackageBills } = res.data.Data;

        if (ExpressBillType === 0 && BackPackageInfos) {
          _list = BackPackageInfos
            .filter(it => it.Logistics && it.Logistics.BillNo)
            .map(it => ({
              BillNo: it.Logistics.BillNo,
              PackageID: it.ID,
              ExpressID: it.Logistics.ID,
              PackageNumber: 1,
            }));
        }

        if (ExpressBillType === 1 && PackageBills) {
          _list = PackageBills.filter(it => !!it.BillNo).map(it => ({
            BillNo: it.BillNo,
            PackageID: it.PackageID,
            ExpressID: it.ID,
            PackageNumber: it.ChildBillNo.length > 1 ? it.ChildBillNo.length : 1,
          }));
        }
      }
    }

    return _list;
  }

  async getOrderDetail() {
    this.loading = true;
    const [OrderDetail, BillNoList] = await Promise.all([this._getOrderDetailData(), this._getOrderBillNoList()]);
    this.loading = false;

    this.OrderDetail = OrderDetail;
    this.BillNoList = BillNoList;
  }

  async getProgressData() { // 获取进度条数据
    if (!this.currentRow) return;

    this.OrderProgress.loading = true;
    const res = await api.getOrderProgress(this.currentRow.OrderID, true).catch(() => null);
    this.OrderProgress.loading = false;

    if (res && res.data.Status === 1000) {
      this.OrderProgress.dataList = res.data.Data.filter(it => it.FinishPercent !== 0 || it.ShowFocus).reverse();
    }
  }

  init() {
    this.getOrderDetail();
    this.getProgressData();
  }
}
