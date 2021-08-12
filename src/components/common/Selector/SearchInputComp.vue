<template>
  <section class="mp-common-comps-search-box">
    <span class="text">{{title}}：</span>
    <input
      @keydown.enter="onKeyWordSubmit"
      v-model.trim='inpVal'
      spellcheck="false"
      :placeholder="placeholder"
      type="text"
    />
    <!-- <button class="mp-search-box-btn" @click="onKeyWordSubmit">
      <i></i>
    </button> -->
    <el-button icon="el-icon-search" type="primary" @click="onKeyWordSubmit"></el-button>
    <button
     class="order-header-reset-btn" v-if="showResetBtn" @click="onResetBtn">{{resetWords}}</button>
  </section>
</template>

<script>
import { throttle } from '@/assets/js/utils/throttle';

export default {
  props: {
    word: {
      default: '',
      type: String,
    },
    title: {
      default: '活动标题',
      type: String,
    },
    placeholder: {
      type: String,
      default: '请输入活动标题',
    },
    changePropsFunc: {
      type: Function,
      default: () => {},
    },
    typeList: {
      type: Array,
      required: true,
    },
    requestFunc: {
      type: Function,
      default: () => {},
    },
    showResetBtn: {
      type: Boolean,
      default: true,
    },
    resetWords: {
      default: '清空所有筛选项条件',
      type: String,
    },
    searchWatchKey: {
      default: 0,
    },
  },
  // computed: {
  //   inpValue: {
  //     get() {
  //       return this.word;
  //     },
  //     set(newVal) {
  //       this.changePropsFunc([this.typeList[0], newVal]);
  //     },
  //   },
  // },
  data() {
    return {
      inpVal: '',
    };
  },
  methods: {
    onKeyWordSubmit() {
      const _keywords = this.inpVal;
      this.changePropsFunc([this.typeList[0], _keywords]);
      // if (this.inpVal) {
      // this.$emit('reset');
      // this.changePropsFunc([this.typeList[0], _keywords]);
      this.handleThrottleFunc();
      // } else {
      //   this.onResetBtn();
      // }
    },
    onResetBtn() {
      this.$emit('reset');
      this.requestFunc();
      this.inpVal = '';
    },
  },
  mounted() {
    this.handleThrottleFunc = throttle(this.requestFunc, 350);
  },
  watch: {
    searchWatchKey() {
      this.inpVal = this.word;
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-common-comps-search-box {
  padding-top: 2px;
  text-align: right;
  font-size: 14px;
  // @media screen and (max-width: 1600px) {
  //   padding-right: 30px;
  // }
  display: inline-block;
  > span:first-of-type {
    font-weight: 600;
    display: inline-block;
    margin-right: 15px;
    user-select: none;
    color: #585858;
    line-height: 28px;
    min-width: 5em;
  }
  input {
    height: 30px;
    line-height: 28px;
    width: 130px;
    padding: 0 0 0 6px;
    border: 1px solid $--border-color-base;
    &::placeholder {
      font-size: 12px;
      color: #cbcbcb;
    }
    box-sizing: border-box;
    outline: none;
    font-size: 12px;
    border-radius: 4px;
    transition: 0.3s;
    &:focus {
      border-color: #428dfa;
    }
  }
  button {
    border: none;
    height: 30px;
    line-height: 28px;
    width: 60px;
    outline: none;
    font-size: 20px;
    font-weight: 600;
    padding: 0;
    vertical-align: top;
    color: #fff;
    user-select: none;
    cursor: pointer;
    // border-radius: 2px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    // background-color: $--color-primary;
    // border: 1px solid #26bcf9 !important;
    // &:hover {
    //   background-color: $--color-text-btn-hover;
    //   border-color: #009EF9 !important;
    // }
    // &:active {
    //   background-color: $--color-primary-light;
    //   border-color: #35dff9 !important;
    // }
  }
  > .order-header-reset-btn {
    user-select: none;
    margin-left: 20px;
    font-size: 12px;
    width: auto;
    font-weight: 400;
    background-color: $--color-white;
    line-height: 28px;
    box-sizing: border-box;
    padding: 0 10px;
    border-radius: 2px;
    &:hover {
      background-color: $--color-white;
      // color: $--color-white;
      // transform: scale(1.1);
      box-shadow: 0 0px 1px 1px rgba(38, 188, 249, 0.2);
    }
    &:active {
      color: mix($--color-white, $--color-primary, 10%);
      background-color: rgba(168, 168, 168, 0.1);
    }
    color: $--color-primary;
    // border: 1px solid $--color-primary;
    height: 30px;
    cursor: pointer;
  }
  > input {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }
  > button.mp-search-box-btn > i {
    display: block;
    height: 20px;
    width: 100%;
    // background: url("../../assets/images/search.png") center center no-repeat;
  }
  > button.order-header-reset-btn {
    line-height: 26px !important;
  }
}
</style>
