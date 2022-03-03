const bgImg1 = require('@/assets/images/bean-item-1.png');
const bgImg2 = require('@/assets/images/bean-item-2.png');
const bgImg3 = require('@/assets/images/bean-item-3.png');

const _bgImgList = [
  { maxBeanNumber: 1000, img: bgImg1 },
  { maxBeanNumber: 2000, img: bgImg2 },
  { maxBeanNumber: Infinity, img: bgImg3 },
];

export default class BeanItemClassType {
  ID = ''

  BeanID = ''

  EndTime = ''

  BeanNumber = 0

  Price = 0

  TotalNumber = 0

  BuyMaxNumber = 0

  EverydayBuyMaxNumber = 0

  _EndTime = ''

  _bgImg = null

  _description = ''

  constructor(itemData) {
    if (itemData) {
      const {
        ID, BeanID, EndTime, BeanNumber, Price, TotalNumber, BuyMaxNumber, EverydayBuyMaxNumber,
      } = itemData;

      this.ID = ID;
      this.BeanID = BeanID;
      this.EndTime = EndTime;
      this.BeanNumber = BeanNumber;
      this.Price = Price;
      this.TotalNumber = TotalNumber;
      this.BuyMaxNumber = BuyMaxNumber;
      this.EverydayBuyMaxNumber = EverydayBuyMaxNumber;

      this._EndTime = EndTime && EndTime.length >= 10 ? `${EndTime.slice(0, 10)}日` : (EndTime || '售完为止');
      const t = _bgImgList.find(it => BeanNumber <= it.maxBeanNumber);
      if (t) {
        this._bgImg = t.img;
      }
      let _TotalNumberText = '';
      let _BuyMaxNumberText = '';
      if (TotalNumber && typeof +TotalNumber === 'number' && !Number.isNaN(+TotalNumber)) {
        _TotalNumberText = `总份数：${TotalNumber}`;
      }
      if (BuyMaxNumber && typeof +BuyMaxNumber === 'number' && !Number.isNaN(+BuyMaxNumber)) {
        _BuyMaxNumberText = `最大可购买份数：${BuyMaxNumber}`;
      }
      this._description = `${_TotalNumberText}${_TotalNumberText && _BuyMaxNumberText ? '；' : ''}${_BuyMaxNumberText}`;
    }
  }
  // 是否已售完状态通过计算属性获取（EverydayBuyMaxNumber === 0时为已售完）
  // 已过期状态同上 ---  无已过期状态
}
