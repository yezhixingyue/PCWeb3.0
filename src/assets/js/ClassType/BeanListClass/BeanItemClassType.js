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

  TodayBuyMaxNumber = 0

  IsTomorrowBuyable = 0

  _EndTime = ''

  _bgImg = null

  _description = ''

  constructor(itemData) {
    if (itemData) {
      const {
        ID, BeanID, EndTime, BeanNumber, Price, TotalNumber, BuyMaxNumber, TodayBuyMaxNumber, IsTomorrowBuyable,
      } = itemData; // 总份数  客户可购买总份数  当日限购份数  已购买份数  当日已购买份数

      this.ID = ID;
      this.BeanID = BeanID;
      this.EndTime = EndTime;
      this.BeanNumber = BeanNumber;
      this.Price = Price;
      this.TotalNumber = TotalNumber;
      this.BuyMaxNumber = BuyMaxNumber;
      this.TodayBuyMaxNumber = TodayBuyMaxNumber;
      this.IsTomorrowBuyable = IsTomorrowBuyable;

      this._EndTime = EndTime && EndTime.length >= 10 ? `${EndTime.slice(0, 10)}日` : (EndTime || '售完为止');
      const t = _bgImgList.find(it => BeanNumber <= it.maxBeanNumber);
      if (t) {
        this._bgImg = t.img;
      }
      let _TotalNumberText = '';
      let _BuyMaxNumberText = '';
      if (TotalNumber && typeof +TotalNumber === 'number' && !Number.isNaN(+TotalNumber)) {
        _TotalNumberText = `一共 ${TotalNumber} 份`;
      }
      if (BuyMaxNumber && typeof +BuyMaxNumber === 'number' && !Number.isNaN(+BuyMaxNumber)) {
        _BuyMaxNumberText = `每个客户限购 ${BuyMaxNumber} 份，售完为止`;
      }
      if (_TotalNumberText && _BuyMaxNumberText && TotalNumber === BuyMaxNumber) {
        _BuyMaxNumberText = '先到先得，售完为止';
      }
      // 一共 10份，每个客户限购 10份，售完为止
      this._description = `${_TotalNumberText}${_TotalNumberText && _BuyMaxNumberText ? '，' : ''}${_BuyMaxNumberText}`;
    }
  }
  // 是否已售完状态通过计算属性获取（TodayBuyMaxNumber === 0时为已售完）
  // 已过期状态同上 ---  无已过期状态
}
