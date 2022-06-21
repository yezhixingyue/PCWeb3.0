import getEnumList from '../../assets/js/utils/getEnumList';

/**
 * 开具发票列表订单可开票类型枚举值  全部|可开票
 */
export const InvoiceMakeUpStatusEnums = {
  canMakeup: {
    ID: 1,
    Name: '可开票订单',
  },
  all: {
    ID: 2,
    Name: '不可开票订单',
  },
};

/**
 * 发票类型枚举值
 */
export const InvoiceTypeEnums = {
  normal: {
    ID: 1,
    Name: '电子普通发票',
  },
  special: {
    ID: 2,
    Name: '增值税专用发票',
  },
};

/**
 * 发票抬头枚举值
 */
export const InvoiceTitleEnums = {
  personal: {
    ID: 1,
    Name: '个人',
  },
  enterprise: {
    ID: 2,
    Name: '企业',
  },
};

/**
 * 发票开具状态枚举值
 */
export const InvoiceStatusEnums = {
  pendingCheck: {
    ID: 0,
    Name: '待审核',
    Step: 0,
  },
  rejected: {
    ID: 40,
    Name: '被驳回',
    Step: 1,
  },
  makingUp: {
    ID: 10,
    Name: '开票中',
    Step: 2,
  },
  haveMaked: {
    ID: 20,
    Name: '已开票',
    Step: 3,
  },
  haveToMail: {
    ID: 30,
    Name: '已邮寄',
    Step: 4,
  },
  canceled: { // 该状态已废弃
    ID: 254,
    Name: '已取消',
    Step: '?',
  },
};

export const EnterpriseCheckStatusEnums = {
  checking: {
    ID: 0,
    Name: '审核中',
  },
  rejected: {
    ID: 10,
    Name: '被驳回',
  },
  passed: {
    ID: 20,
    Name: '审核通过',
  },
};

export const InvoiceMakeUpStatusEnumList = getEnumList(InvoiceMakeUpStatusEnums);
export const InvoiceTypeEnumList = getEnumList(InvoiceTypeEnums);
export const InvoiceTitleEnumList = getEnumList(InvoiceTitleEnums);
export const InvoiceStatusEnumList = getEnumList(InvoiceStatusEnums, ['Step']);
export const EnterpriseCheckStatusEnumList = getEnumList(EnterpriseCheckStatusEnums);
