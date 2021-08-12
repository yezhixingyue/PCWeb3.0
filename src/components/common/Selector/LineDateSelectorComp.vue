<template>
  <div class="mp-line-date-selector-wrap" :class="isFull?'mp-line-date-selector-wrap-is-full':''">
    <span class="title">{{label}}：</span>

    <div class="box">
      <el-tabs v-model="tabValue">
        <el-tab-pane
          :label="item[defaultProps.label]"
          v-for="(item, i) of dateList"
          :key="item[defaultProps.label] + '-' + i" :name="item[defaultProps.value]">
        </el-tab-pane>
      </el-tabs>
      <el-popover
        placement="bottom" v-model="visible" popper-class="order-time-select" trigger="click">
        <div class="select-block-wrap">
          <div class="block">
            <el-date-picker value-format='yyyy-MM-ddTHH:mm:ss.000Z' :clearable='false'
              :picker-options="{disabledDate: handleDisabledDate4Begin}"
              v-model="beginTime" :type="dateType" placeholder="选择开始日期">
              </el-date-picker>
          </div>
          <div class="totext-box">至</div>
          <div class="block">
            <el-date-picker value-format='yyyy-MM-ddTHH:mm:ss.997Z' :clearable='false'
              :picker-options="{disabledDate: handleDisabledDate4End}"
              default-time='23:59:59'
              v-model="endTime" :type="dateType" placeholder="选择结束日期"
            ></el-date-picker>
          </div>
        </div>
        <div class="select-btn-wrap">
          <el-button @click="onSelectTimeSubmit" type="primary" >确定</el-button>
        </div>
        <span slot="reference">
          <span v-if="!showText" class="manual-select-date-box">
            自定义时间
          </span>
          <span v-else :class="{'active':UserDefinedTimeIsActive, 'manual-select-date-box': 1}">
            <template v-if="dateType === 'date'">{{ Format2DateBegin }}</template>
            <template v-else>{{ beginTime | formatDate }}</template>
            <span style="font-size:12px;margin:0 2px;vertical-align:0%;">至</span>
            <template v-if="dateType === 'date'">{{ Format2DateEnd }}</template>
            <template v-else>{{ endTime | formatDate }}</template>
          </span>
        </span>
      </el-popover>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dateList: {
      type: Array,
      // eslint-disable-next-line max-len
      default: () => [{ name: '不限', ID: 'all' }, { name: '今天', ID: 'today' }, { name: '昨天', ID: 'yesterday' }, { name: '前天', ID: 'beforeyesterday' }],
    },
    dateValue: {
      type: String,
      default: 'today',
    },
    typeList: {
      type: Array,
      required: true,
    },
    changePropsFunc: {
      type: Function,
      default: () => {},
    },
    UserDefinedTimeIsActive: {
      type: Boolean,
      default: false,
    },
    requestFunc: {
      type: Function,
      default: () => {},
      required: true,
    },
    isFull: {
      type: Boolean,
      default: true,
    },
    label: {
      type: String,
      default: '可用时间',
    },
    dateType: {
      type: String,
      default: 'datetime',
    },
    defaultProps: {
      type: Object,
      default: () => ({
        label: 'label',
        value: 'value',
      }),
    },
    initDate: {
      type: Object,
    },
  },
  computed: {
    showText: {
      get() {
        if (this.key && this.beginTime && this.endTime) return true;
        return false;
      },
    },
    Format2DateEnd() {
      return this.utils.getDateFormat2Date(this.endTime);
    },
    Format2DateBegin() {
      return this.utils.getDateFormat2Date(this.beginTime);
    },
    tabValue: {
      get() {
        const it = this.dateList.find(item => item[this.defaultProps.value] === this.dateValue);
        if (it) return it[this.defaultProps.value];
        return '';
      },
      set(newVal) {
        if (this.tabValue === newVal) return;
        if (newVal !== 'define') {
          if (newVal && newVal !== '0') {
            this.changePropsFunc([this.typeList[0], newVal]);
            if (newVal) this.requestFunc();
          }
        } else {
          this.visible = true;
        }
      },
    },
  },
  data() {
    return {
      beginTime: '',
      endTime: '',
      visible: false,
      key: false,
      start: '',
      end: '',
      isNotFoulCloseType: false, // 是否使用犯规方式关闭
    };
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.start = this.beginTime;
        this.end = this.endTime;
        this.isNotFoulCloseType = false;
      }
      if (!newVal && this.UserDefinedTimeIsActive) {
        if (!this.beginTime) this.beginTime = this.start;
        if (!this.endTime) this.endTime = this.end;
        if (!this.isNotFoulCloseType) {
          if (this.start !== this.beginTime) this.beginTime = this.start;
          if (this.end !== this.endTime) this.endTime = this.end;
        }
      }
    },
  },
  methods: {
    onSelectTimeSubmit() {
      if (!this.endTime || !this.beginTime) return;
      if (this.dateType === 'date') {
        this.endTime = `${this.Format2DateEnd}T23:59:59.997Z`;
      }
      const bool = new Date(this.endTime) - new Date(this.beginTime) > 0;
      if (!bool) {
        this.$message({
          showClose: true,
          message: '结束日期必须大于开始日期!',
          type: 'error',
        });
      } else {
        this.key = true;
        this.isNotFoulCloseType = true;
        this.visible = false;
        if (this.beginTime !== this.start || this.endTime !== this.end || !this.UserDefinedTimeIsActive) {
          this.changePropsFunc([this.typeList[0], '']);
          this.changePropsFunc([this.typeList[1], this.beginTime]);
          this.changePropsFunc([this.typeList[2], this.endTime]);
          this.requestFunc();
        }
      }
    },
    handleDisabledDate4Begin(e) {
      if (!this.endTime) {
        return false;
      }
      if (new Date(e) > new Date(this.Format2DateEnd)) {
        return true;
      }
      return false;
    },
    handleDisabledDate4End(e) {
      if (!this.beginTime) {
        return false;
      }
      if (new Date(e) < new Date(new Date(this.Format2DateBegin).getTime() - 24 * 60 * 60 * 1000)) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    if (this.UserDefinedTimeIsActive) {
      if (this.initDate.First) this.beginTime = this.initDate.First;
      if (this.initDate.Second) this.endTime = this.initDate.Second;
      this.key = true;
    }
    if (!this.$route.query.DateType && this.$route.query.First && this.$route.query.Second) {
      this.beginTime = this.$route.query.First;
      this.endTime = this.$route.query.Second;
      this.key = true;
    }
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-line-date-selector-wrap {
  min-width: 712px;
  display: inline-block;
  .el-tabs__active-bar {
    height: 3px;
    // bottom: -1px;
  }
  > .title {
    font-size: 14px;
    width: 5em;
    margin-right: 4px;
    vertical-align: top;
    font-weight: 600;
    color:#585858;
    text-align: right;
  }
  > .box {
    display: inline-block;
    position: relative;
    width: 745px;
    // &::after {
    //   height: 1px;
    //   content: "";
    //   width: 100%;
    //   position: absolute;
    //   background-color: #eee;
    //   left: 0;
    //   bottom: 1px;
    // }
    > div {
      display: inline-block;
      > .el-tabs__header {
        margin: 0;
        .el-tabs__item {
          line-height: unset;
          height: 38px;
          color: #585858;
          line-height: 12px\0;
          &.is-active, &:hover {
            color: #428DFA;
          }
          &.is-active {
            font-weight: 700;
          }
        }
        .el-tabs__nav-wrap::after {
          display: none;
        }
      }
    }
    > .normal-btn {
    margin: 0;
    &.un-select {
      color: $--color-text-primary;
      border: 1px solid $--border-color-base;
    }
    margin-left: 20px;
    position: relative;
    top: -5px;
  }
  .manual-select-date-box {
    font-size: 13px;
    min-width: 110px;
    height: 38px;
    display: inline-block;
    text-align: center;
    margin-left: 12px;
    box-sizing: border-box;
    padding: 0 15px;
    border: none;
    cursor: pointer;
    > i > img {
      vertical-align: -5%;
      margin-left: 10px;
    }
    &.active {
      color: $--color-primary;
      border-color: #26bcf9;
      background-color: $--color-white;
      &::after {
        left: 0;
      }
    }
    &.hover {
      color: $--color-primary;
    }
    position: relative;
    &::after {
      content: '';
      height: 2px;
      width: 100%;
      position: absolute;
      background-color: #428DFA;
      bottom: 0px;
      left: -100%;
      transition: 0.2s;
    }
    overflow: hidden;
  }
  > span {
    flex: none;
    // vertical-align: top;
  }
  }
  > .box > div > .el-tabs__header .el-tabs__item {
    padding: 0 10px;
    width: 68px;
    text-align: center;
  }
}
.order-time-select {
  > .select-block-wrap {
    padding: 8px;
    > .block {
      display: inline-block;
      width: 180px;
      input {
        width: 180px;
      }
    }
    > .totext-box {
      display: inline-block;
      margin: 0 10px;
    }
  }
  > .select-btn-wrap {
    margin-top: 16px;
    text-align: right;
    padding-right: 8px;
    > button {
      padding: 0;
      width: 120px;
      height: 32px;
    }
  }
}
</style>
