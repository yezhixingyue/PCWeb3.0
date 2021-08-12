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
    TodayDate(state) {
      const stringDate = ConvertTimeFormat(new Date(state.newDate));
      return {
        First: `${stringDate}T00:00:00.000Z`,
        Second: `${stringDate}T23:59:59.997Z`,
      };
    },
    YesterdayDate(state) {
      const stringDate = ConvertTimeFormat(
        new Date(new Date(state.newDate).getTime() - 1000 * 60 * 60 * 24),
      );
      return {
        First: `${stringDate}T00:00:00.000Z`,
        Second: `${stringDate}T23:59:59.997Z`,
      };
    },
    BeforeYesterdayTimeDate(state) {
      const stringDate = ConvertTimeFormat(
        new Date(new Date(state.newDate).getTime() - 1000 * 60 * 60 * 24 * 2),
      );
      return {
        First: `${stringDate}T00:00:00.000Z`,
        Second: `${stringDate}T23:59:59.997Z`,
      };
    },
    curMonthDate(state) {
      const stringDate1 = ConvertTimeFormat(new Date(new Date(state.newDate).setDate(1)));
      const m = new Date(state.newDate).getMonth();
      const t = new Date(new Date(new Date().setMonth(m + 1)).setDate(0));
      const stringDate2 = ConvertTimeFormat(new Date(t));
      return {
        First: `${stringDate1}T00:00:00.000Z`,
        Second: `${stringDate2}T23:59:59.997Z`,
      };
    },
    lastMonthDate(state) {
      const stringDate1 = ConvertTimeFormat(new Date(
        new Date(
          new Date(state.newDate).setDate(1),
        ).setMonth(new Date(state.newDate).getMonth() - 1),
      ));
      const stringDate2 = ConvertTimeFormat(new Date(new Date(state.newDate).setDate(0)));
      return {
        First: `${stringDate1}T00:00:00.000Z`,
        Second: `${stringDate2}T23:59:59.997Z`,
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
    financeTodayDate(state) {
      const stringDate = ConvertTimeFormat(new Date(state.newDate));
      const secondDate = getSecondTime(new Date(state.newDate));
      return {
        First: `${stringDate}T08:00:00.000Z`,
        Second: `${secondDate}T07:59:59.997Z`,
      };
    },
    financeYesterdayDate(state) {
      const date = new Date(new Date(state.newDate).getTime() - 1000 * 60 * 60 * 24);
      const stringDate = ConvertTimeFormat(date);
      const secondDate = getSecondTime(date);
      return {
        First: `${stringDate}T08:00:00.000Z`,
        Second: `${secondDate}T07:59:59.997Z`,
      };
    },
    financeDayBeforeYesterdayTimeDate(state) {
      const date = new Date(new Date(state.newDate).getTime() - 1000 * 60 * 60 * 24 * 2);
      const stringDate = ConvertTimeFormat(date);
      const secondDate = getSecondTime(date);
      return {
        First: `${stringDate}T08:00:00.000Z`,
        Second: `${secondDate}T07:59:59.997Z`,
      };
    },
    financeCurMonthDate(state) {
      const stringDate1 = ConvertTimeFormat(new Date(new Date(state.newDate).setDate(1)));
      const m = new Date(state.newDate).getMonth();
      const t = new Date(new Date(new Date().setMonth(m + 1)).setDate(0));
      const secondDate = getSecondTime(t);
      return {
        First: `${stringDate1}T08:00:00.000Z`,
        Second: `${secondDate}T07:59:59.997Z`,
      };
    },
    financeLastMonthDate(state) {
      const stringDate1 = ConvertTimeFormat(new Date(
        new Date(new Date(state.newDate)
          .setDate(1)).setMonth(new Date(state.newDate).getMonth() - 1),
      ));
      const secondDate = getSecondTime(new Date(new Date(state.newDate).setDate(0)));
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
