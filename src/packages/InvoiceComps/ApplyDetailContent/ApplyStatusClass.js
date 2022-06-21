import { InvoiceStatusEnums, InvoiceStatusEnumList, InvoiceTypeEnums } from '../enums';
import { format2MiddleLangTypeDateFunc } from '../../commonFilters';

/**
 *   写一个类是实现下面功能
 *   获取  【发票步骤列表数据】  需要知道及确定的一些信息：
 * 1. 发票的类型： 个人普票 | 企业普票 | 专票
 *   个人普票  3步：提交申请 - 开票中 - 已开票    不需要审核
 *   企业普票  3步：同上                         需要审核    ---- 所以有驳回状态 需判断是否为驳回状态  驳回状态分2步：提交申请 - 被驳回
 *   企业专票  4步：在上面基础上添加 已邮寄 步骤   需要审核    ---- 同上
 *   所以发票的步骤共有3种可能性： 2步（驳回） 3步（普票） 4步（专票）
 * 2. 发票的状态：InvoiceStatusEnums 共有5种状态
 * 3. 根据发票的类型 及 当前发票的状态去生成： 发票步骤列表
 *
 *   获取 【头部显示信息】 中需要知道的信息： { ID: '', Status: '', Color: '', tip: '', express: '', expressCode: '' }
 * 1. 发票申请单号
 * 2. 发票当前状态: InvoiceStatusEnums 共有5种状态
 *   邮寄中：在中间展示邮寄中文案 字段： tip
 *   被驳回：在中间展示被驳回文案 字段： tip
 *   已邮寄：在中间展示配送企业及快递单号 express | expressCode
 * 3. 根据发票状态给状态圆点展示不同的颜色
 *   驳回： #ff3769
 *   已开票和已邮寄： 绿色
 *   其它：#428dfa
 *  完成
 */

export default class ApplyStatusClass {
  InvoiceID = ''

  InvoiceType = ''

  InvoiceStatus = ''

  InvoiceStatusText = ''

  Color = '' // 驳回： #ff3769   已开票和已邮寄： 绿色   其它：#428dfa

  TipsContent = '' // 驳回原因 | 邮寄状态提示词

  ExpressCompany = ''

  ExpressNumber = ''

  StepList = []

  constructor(data) {
    if (!data) return;
    const {
      InvoiceID, InvoiceStatus, ExpressCompany, ExpressNumber, InvoiceType, InvoiceMainBody, RejectReason,
      CreateTime, InvoiceLog,
    } = data;
    this.InvoiceID = InvoiceID;
    this.InvoiceStatus = InvoiceStatus;
    this.ExpressCompany = ExpressCompany;
    this.ExpressNumber = ExpressNumber;
    this.InvoiceType = InvoiceType;
    this.InvoiceMainBody = InvoiceMainBody;

    switch (InvoiceStatus) { // 根据发票状态设置圆点颜色 及 提示
      case InvoiceStatusEnums.rejected.ID:
        this.Color = '#ff3769';
        if (RejectReason) this.TipsContent = `驳回原因：${RejectReason}`;
        break;
      case InvoiceStatusEnums.haveToMail.ID:
        this.Color = '#80c269';
        break;
      case InvoiceStatusEnums.haveMaked.ID:
        this.Color = '#80c269';
        if (InvoiceType === InvoiceTypeEnums.special.ID) this.TipsContent = '您的发票已开具，工作人员正在为您办理邮寄，请耐心等待。';
        break;
      default:
        this.Color = '#428dfa';
        break;
    }

    // 获取当前状态的中文显示
    let curStep = '';
    const t = InvoiceStatusEnumList.find(it => it.ID === InvoiceStatus);
    if (t) {
      this.InvoiceStatusText = t.Name;
      curStep = t.Step;
    }

    let MakingTime = '';
    let MakedTime = '';
    let MailedTime = '';
    let RejectTime = '';
    // 需要从InvoiceLog中提取出上面四个状态的对应时间 -- 其中开票中时间在找不到的时候可以使用CreateTime， 其它按照找到的结果进行处理（或可根据当前状态决定是否寻找）
    if (curStep || curStep === 0) {
      const _InvoiceLog = InvoiceLog || [];
      let targetTime;
      if (curStep >= InvoiceStatusEnums.makingUp.Step) {
        targetTime = _InvoiceLog.find(it => it.LogType === InvoiceStatusEnums.makingUp.ID);
        MakingTime = targetTime ? targetTime.CreateTime : CreateTime;
      }
      if (curStep >= InvoiceStatusEnums.haveMaked.Step) {
        targetTime = _InvoiceLog.find(it => it.LogType === InvoiceStatusEnums.haveMaked.ID);
        MakedTime = targetTime && targetTime.CreateTime;
      }
      if (curStep >= InvoiceStatusEnums.haveToMail.Step) {
        targetTime = _InvoiceLog.find(it => it.LogType === InvoiceStatusEnums.haveToMail.ID);
        MailedTime = targetTime && targetTime.CreateTime;
      }
      if (InvoiceStatus === InvoiceStatusEnums.rejected.ID) {
        targetTime = _InvoiceLog.find(it => it.LogType === InvoiceStatusEnums.rejected.ID);
        RejectTime = targetTime && targetTime.CreateTime;
      }
    }

    // 生成步骤过程数据
    const applyStep = {
      title: '提交申请',
      activeTitle: '待审核',
      date: format2MiddleLangTypeDateFunc(CreateTime),
      icon: 'iconfont ml-2 ft-18 icon-tijiaochenggong',
      completed: curStep > InvoiceStatusEnums.pendingCheck.Step,
      active: curStep === InvoiceStatusEnums.pendingCheck.Step,
    };
    const makingStep = {
      title: '开票中',
      activeTitle: '开票中',
      date: format2MiddleLangTypeDateFunc(MakingTime),
      icon: 'iconfont ml-2 ft-18 icon-kaipiaozhong',
      completed: curStep > InvoiceStatusEnums.makingUp.Step,
      active: curStep === InvoiceStatusEnums.makingUp.Step,
    };
    const makedStep = {
      title: '已开票',
      activeTitle: InvoiceType === InvoiceTypeEnums.special.ID ? '邮寄中' : '开票完成', // 4步时(专票)为： 邮寄中
      date: format2MiddleLangTypeDateFunc(MakedTime),
      icon: 'iconfont mr-2 ft-17 icon-fapiaokaiju',
      completed: InvoiceType === InvoiceTypeEnums.special.ID ? curStep > InvoiceStatusEnums.haveMaked.Step : curStep >= InvoiceStatusEnums.haveMaked.Step,
      active: curStep === InvoiceStatusEnums.haveMaked.Step,
    };
    const mailedStep = {
      title: '已邮寄',
      activeTitle: '开票完成',
      date: format2MiddleLangTypeDateFunc(MailedTime),
      icon: 'iconfont ml-2 ft-18 icon-yiyouji',
      completed: curStep === InvoiceStatusEnums.haveToMail.Step,
      active: curStep === InvoiceStatusEnums.haveToMail.Step,
    };
    const rejectStep = {
      title: '开票申请被驳回',
      activeTitle: '已完成',
      date: format2MiddleLangTypeDateFunc(RejectTime),
      icon: 'iconfont ml-2 ft-18 icon-yichuli',
      completed: true,
      active: true,
    };
    if (InvoiceStatus === InvoiceStatusEnums.rejected.ID) {
      this.StepList = [applyStep, rejectStep];
    } else {
      this.StepList = [applyStep, makingStep, makedStep];
      if (InvoiceType === InvoiceTypeEnums.special.ID) {
        this.StepList.push(mailedStep);
      }
    }
  }
}
