// 规则
export const regulations = [
  {
    title: '会员等级都有哪些？',
    details: [
      '·  个体门店会员包含轻享会员、一星会员、二星会员、三星会员、四星会员、五星会员  ·',
      '·  每个会员等级可享受不同的权益，包括会员等级活动、会员等级专属优惠券、会员专属服务客服等众多服务  ·',
      '·  会员以账户为维度评定，同一客户的不同账户不能合并数据评级  ·',
    ],
  },
  {
    title: '会员如何升级？',
    details: [
      '·  会员评级每月一次，最低为轻享会员，最高为五星会员  ·',
      '·  五星会员为最高等级  ·',
    ],
  },
  {
    title: '为什么会员会降级？',
    details: [
      '·  账户消费金额、订单数量等连续3个月达不到账户当前会员等级时，次月会员等级评定时，账户会获得此前三个月内最高的会员等级  ·',
      '·  同一账号订单多、消费多则升级快，订单少、消费少则容易掉级  ·',
    ],
  },
];
// 会员权益
const rightsAndInterestMenuS = {
  productDiscount: {
    name: '产品优惠',
    massage: '解释',
    backgroundImage: '产品优惠.png',
  },
  memberDayCoupon: {
    name: '会员日优惠券',
    massage: '解释',
    backgroundImage: '会员日优惠券.png',
  },
  anniversaryCoupon: {
    name: '周年庆优惠券',
    massage: '解释',
    backgroundImage: '周年庆优惠券.png',
  },
  specimen: {
    name: '样品',
    massage: '解释',
    backgroundImage: '样品.png',
  },
  dedicatedService: {
    name: '专属客服',
    massage: '解释',
    backgroundImage: '专属客服.png',
  },
  interestBeanPrinting: {
    name: '印豆权益',
    massage: '解释',
    backgroundImage: '印豆权益.png',
  },
  factoryVisit: {
    name: '厂区参观',
    massage: '解释',
    backgroundImage: '厂区参观.png',
  },
  invitedEvent: {
    name: '特邀活动',
    massage: '解释',
    backgroundImage: '特邀活动.png',
  },
};
// 会员详情信息
export default [
  {
    index: 0,
    name: '轻享会员',
    // 权益
    rightsAndInterests: [
      rightsAndInterestMenuS.productDiscount,
      rightsAndInterestMenuS.memberDayCoupon,
      rightsAndInterestMenuS.anniversaryCoupon,
    ],

  },
  {
    index: 1,
    name: '一星会员',
    // 权益
    rightsAndInterests: [
      rightsAndInterestMenuS.productDiscount,
      rightsAndInterestMenuS.memberDayCoupon,
      rightsAndInterestMenuS.anniversaryCoupon,
      rightsAndInterestMenuS.specimen,
    ],
  },
  {
    index: 2,
    name: '二星会员',
    // 权益
    rightsAndInterests: [
      rightsAndInterestMenuS.productDiscount,
      rightsAndInterestMenuS.memberDayCoupon,
      rightsAndInterestMenuS.anniversaryCoupon,
      rightsAndInterestMenuS.specimen,
    ],
  },
  {
    index: 3,
    name: '三星会员',
    // 权益
    rightsAndInterests: [
      rightsAndInterestMenuS.productDiscount,
      rightsAndInterestMenuS.memberDayCoupon,
      rightsAndInterestMenuS.anniversaryCoupon,
      rightsAndInterestMenuS.specimen,
      rightsAndInterestMenuS.dedicatedService,
    ],
  },
  {
    index: 4,
    name: '四星会员',
    // 权益
    rightsAndInterests: [
      rightsAndInterestMenuS.productDiscount,
      rightsAndInterestMenuS.memberDayCoupon,
      rightsAndInterestMenuS.anniversaryCoupon,
      rightsAndInterestMenuS.specimen,
      rightsAndInterestMenuS.dedicatedService,
    ],
  },
  {
    index: 5,
    name: '五星会员',
    // 权益
    rightsAndInterests: [
      rightsAndInterestMenuS.productDiscount,
      rightsAndInterestMenuS.memberDayCoupon,
      rightsAndInterestMenuS.anniversaryCoupon,
      rightsAndInterestMenuS.specimen,
      rightsAndInterestMenuS.dedicatedService,
      rightsAndInterestMenuS.interestBeanPrinting,
      rightsAndInterestMenuS.factoryVisit,
      rightsAndInterestMenuS.invitedEvent,
    ],
  },
];
