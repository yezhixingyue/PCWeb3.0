import { ConvertTimeFormat, getSecondTime } from '@/assets/js/utils/ConvertTimeFormat';

/**
 * 该模块主要用于时间选择模块,为公共模块,方便在需要使用时调用
 */

export default {
  namespaced: true,
  state: {
    /* 时间选择相关
    -------------------------------*/
    selectedTimeArr: [0, 1, 0, 0, 0, 0],
    newDate: new Date(),
  },
  getters: {
    /* 时间选择相关
    -------------------------------*/
    AlltimeDate() {
      return {
        First: '',
        Second: '',
      };
    },
    TodayDate() {
      const stringDate = ConvertTimeFormat(new Date());
      return {
        First: `${stringDate}T00:00:00.000Z`,
        Second: `${stringDate}T23:59:59.997Z`,
      };
    },
    YesterdayDate() {
      const stringDate = ConvertTimeFormat(
        new Date(new Date().getTime() - 1000 * 60 * 60 * 24),
      );
      return {
        First: `${stringDate}T00:00:00.000Z`,
        Second: `${stringDate}T23:59:59.997Z`,
      };
    },
    BeforeYesterdayTimeDate() {
      const stringDate = ConvertTimeFormat(
        new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 2),
      );
      return {
        First: `${stringDate}T00:00:00.000Z`,
        Second: `${stringDate}T23:59:59.997Z`,
      };
    },
    curMonthDate() {
      const stringDate1 = ConvertTimeFormat(new Date(new Date().setDate(1)));
      const m = new Date().getMonth();
      const t = new Date(new Date(new Date().setMonth(m + 1)).setDate(0));
      const stringDate2 = ConvertTimeFormat(new Date(t));
      return {
        First: `${stringDate1}T00:00:00.000Z`,
        Second: `${stringDate2}T23:59:59.997Z`,
      };
    },
    lastMonthDate() {
      const stringDate1 = ConvertTimeFormat(new Date(
        new Date(
          new Date().setDate(1),
        ).setMonth(new Date().getMonth() - 1),
      ));
      const stringDate2 = ConvertTimeFormat(new Date(new Date().setDate(0)));
      return {
        First: `${stringDate1}T00:00:00.000Z`,
        Second: `${stringDate2}T23:59:59.997Z`,
      };
    },
    last7Date() {
      const BeginDate = ConvertTimeFormat(new Date(new Date() - 24 * 60 * 60 * 1000 * 6));
      const TodayDate = ConvertTimeFormat(new Date());
      return {
        First: `${BeginDate}T00:00:00.000Z`,
        Second: `${TodayDate}T23:59:59.997Z`,
      };
    },
    /* 财务时间选择相关
    -------------------------------*/
    financeAlltimeDate() {
      return {
        First: '',
        Second: '',
      };
    },
    financeTodayDate() {
      const stringDate = ConvertTimeFormat(new Date());
      const secondDate = getSecondTime(new Date());
      return {
        First: `${stringDate}T08:00:00.000Z`,
        Second: `${secondDate}T07:59:59.997Z`,
      };
    },
    financeYesterdayDate() {
      const date = new Date(new Date().getTime() - 1000 * 60 * 60 * 24);
      const stringDate = ConvertTimeFormat(date);
      const secondDate = getSecondTime(date);
      return {
        First: `${stringDate}T08:00:00.000Z`,
        Second: `${secondDate}T07:59:59.997Z`,
      };
    },
    financeDayBeforeYesterdayTimeDate() {
      const date = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 2);
      const stringDate = ConvertTimeFormat(date);
      const secondDate = getSecondTime(date);
      return {
        First: `${stringDate}T08:00:00.000Z`,
        Second: `${secondDate}T07:59:59.997Z`,
      };
    },
    financeCurMonthDate() {
      const stringDate1 = ConvertTimeFormat(new Date(new Date().setDate(1)));
      const m = new Date().getMonth();
      const t = new Date(new Date(new Date().setMonth(m + 1)).setDate(0));
      const secondDate = getSecondTime(t);
      return {
        First: `${stringDate1}T08:00:00.000Z`,
        Second: `${secondDate}T07:59:59.997Z`,
      };
    },
    financeLastMonthDate() {
      const stringDate1 = ConvertTimeFormat(new Date(
        new Date(new Date()
          .setDate(1)).setMonth(new Date().getMonth() - 1),
      ));
      const secondDate = getSecondTime(new Date(new Date().setDate(0)));
      return {
        First: `${stringDate1}T08:00:00.000Z`,
        Second: `${secondDate}T07:59:59.997Z`,
      };
    },
  },
  mutations: {
    /* 时间选择相关
    -------------------------------*/
    setSelectTime(state, [type, num, obj]) {
      if (type !== 'timeSelect') {
        const timeObj = this.getters[`timeSelectModule/${type}`];
        state.objForOrderList.PlaceDate = timeObj;
      } else {
        state.objForOrderList.PlaceDate = obj;
      }
      state.selectedTimeArr = [0, 0, 0, 0, 0, 0];
      state.selectedTimeArr[num] = 1;
    //  // console.log(state.objForOrderList);
    },
    /* 更新时间
    -------------------------------*/
    updateNewDate(state) {
      state.newDate = new Date();
    },
  },
  actions: {},
};
