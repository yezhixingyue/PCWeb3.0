import getEnumList from '@/assets/js/utils/getEnumList';

export const CustomerAuthStatusEnum = {
  /** 未认证；未提交认证 */
  notSubmitted: {
    ID: 0,
    Name: '未认证',
    Color: 'pink',
  },
  /** 正在审核中 */
  inReview: {
    ID: 1,
    Name: '认证中',
    Color: 'orange',
  },
  /** 审核通过 */
  verified: {
    ID: 2,
    Name: '已认证',
    Color: 'green',
  },
  /** 审核不通过 */
  failedVerified: {
    ID: 3,
    Name: '未通过',
    Color: 'red',
  },
};

export const CustomerAuthStatusEnumList = getEnumList(CustomerAuthStatusEnum, true);

export default class AuthStatusHandler {
  /** 获取账号认证信息 */
  static getAuthInfo(AuthStatus) {
    return CustomerAuthStatusEnumList.find(it => it.ID === AuthStatus);
  }
}
