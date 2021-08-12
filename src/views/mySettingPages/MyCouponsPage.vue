<template>
  <section class="mp-pc-my-setting-pages-my-coupons-page-wrap">
    <header>
      <span class="blue-v-line is-bold is-black">我的优惠券</span>
      <div class="add-box">
        <span>优惠券激活：</span>
        <el-input v-model.trim="computedCouponCode2Add" placeholder="请输入优惠券激活码"></el-input>
        <el-button type="primary" :disabled='!computedCouponCode2Add' @click="getCouponActivate">激活</el-button>
      </div>
      <div class="jump-btn">
        <el-button @click="jumpToCouponCenter">
          <i class="iconfont icon-lingquan"></i>
          <span>领券中心</span>
        </el-button>
      </div>
    </header>
    <section class="page-content">
      <header>
        <span class="title">状态：</span>
        <span class="status-item" :class="{active: curSelectedOption===0}"
          @click="handleSwitchStatus(0)">未使用（{{CountObj.unused}}）</span>
        <span class="status-item" :class="{active: curSelectedOption===1}"
          @click="handleSwitchStatus(1)">已使用（{{CountObj.used}}）</span>
        <span class="status-item" :class="{active: curSelectedOption===2}"
          @click="handleSwitchStatus(2)">已过期（{{CountObj.outOfDate}}）</span>
      </header>
      <ul class="coupon-list" v-if="curSelectedList.length > 0">
        <li class="coupon-item" v-for="item in curSelectedList" :key="item.CouponCode"
         :class="{
           'add-new': item.CouponCode === newCouponCode,
           'old': item.CouponCode !== newCouponCode && newCouponCode,
           'disabled': curSelectedOption === 1 || curSelectedOption === 2,
           }">
          <div class="top">
            <p class="amount">
              <i>¥</i>
              <span>{{item.Amount}}</span>
            </p>
            <p class="MinPayAmount">满<i class="is-font-16">{{item.MinPayAmount}}</i>元可用</p>
            <p class="ValidDate">
              <span>{{item.ValidStartTime | format2MiddleLangTypeDate}}</span>
              <i>-</i>
              <span>{{item.ValidEndTime | format2MiddleLangTypeDate}}</span>
              <span> 可用</span>
            </p>
            <div class="to-del" @click="handleDelClick(item)">
              <i class="el-icon-close"></i>
            </div>
          </div>
          <div class="bottom">
            <p class="coupon-code">
              <span class="is-font-12 title">券编号：</span><span class="gray">{{item.CouponCode}}</span>
            </p>
            <div class="product">
              <span class="title is-font-12">限产品：</span>
              <div class="text gray">
                <el-tooltip popper-class="table-item" :enterable='true' placement="top-start">
                  <ul slot="content">
                    <li v-for="(it, i) in item.ProductString.split('\n')" :key="i">{{it}}</li>
                  </ul>
                  <span>{{item.ProductString}}</span>
                </el-tooltip>
              </div>
            </div>
          </div>
          <div class="will-out-time" v-if="item.WillBeExpired">
            <span class="iconfont icon-fengtiao is-pink"></span>
            <span class="text">即将过期</span>
          </div>
          <div class="disabled-status" v-if="curSelectedOption === 1">
            <span class="iconfont icon-fengtiao"></span>
            <span class="text">{{curStatusText}}</span>
          </div>
          <div class="disabled-status" v-if="curSelectedOption === 2">
            <span class="iconfont icon-fengtiao"></span>
            <span class="text">{{curStatusText}}</span>
          </div>
        </li>
      </ul>
      <div class="empty" v-else>
        暂无{{curStatusText}}优惠券
      </div>
      <footer>
        <Count
          :watchPage='Page'
          :handlePageChange='handlePageChange'
          :count='couponDataNumber'
          :pageSize='9'
        />
      </footer>
    </section>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import Count from '@/components/common/Count.vue';

export default {
  components: {
    Count,
  },
  data() {
    return {
      couponCode2Add: '',
      unusedCouponList: [],
      usedCouponList: [],
      expiredCouponList: [],
      // couponDataNumber: 0,
      curSelectedOption: 0, // unused  | used | outOfDate 分别对应状态码 0 1 2
      // willOutDateDay: 3, // 即将过期生效时间天数
      newCouponCode: '',
      countData: null,
      Page0: 1,
      Page1: 1,
      Page2: 1,
    };
  },
  computed: {
    ...mapState('common', ['customerInfo']),
    computedCouponCode2Add: {
      get() {
        return this.couponCode2Add;
      },
      set(newVal) {
        this.couponCode2Add = newVal.replace(/[^\w]/g, '');
      },
    },
    curStatusText() {
      if (this.curSelectedOption === 0) return '未使用';
      if (this.curSelectedOption === 1) return '已使用';
      if (this.curSelectedOption === 2) return '已过期';
      return '';
    },
    CountObj() {
      if (!this.countData) return { unused: 0, used: 0, outOfDate: 0 };
      const _t0 = this.countData.find(it => it.First === 0);
      const _t1 = this.countData.find(it => it.First === 1);
      const _t2 = this.countData.find(it => it.First === 2);
      // // console.log(_t0);
      return {
        unused: _t0.Second,
        used: _t1.Second,
        outOfDate: _t2.Second,
      };
    },
    couponDataNumber() {
      if (!this.countData) return 0;
      // const _count = 0;
      const _obj = this.countData.find(it => it.First === this.curSelectedOption);
      return _obj.Second;
    },
    Page() {
      let _p = 1;
      switch (this.curSelectedOption) {
        case 0:
          _p = this.Page0;
          break;
        case 1:
          _p = this.Page1;
          break;
        case 2:
          _p = this.Page2;
          break;
        default:
          break;
      }
      return _p;
    },
    curSelectedList() {
      let _list = [];
      switch (this.curSelectedOption) {
        case 0:
          _list = this.unusedCouponList;
          break;

        case 1:
          _list = this.usedCouponList;
          break;

        case 2:
          _list = this.expiredCouponList;
          break;
        default:
          break;
      }
      return _list;
    },
  },
  methods: {
    async getCouponActivate() {
      if (!this.couponCode2Add) return;
      if (this.couponCode2Add.length !== 10) {
        this.messageBox.warnSingleError({
          title: '激活失败',
          msg: '请输入10位优惠券码',
        });
        return;
      }
      await this.$store.dispatch('common/getCustomerDetail');
      if (!this.customerInfo) return;
      const { CustomerID } = this.customerInfo;
      const CouponCode = this.couponCode2Add;
      const _obj = { CustomerID, CouponCode };
      const res = await this.api.getCouponActivate(_obj);
      if (res.data.Status !== 1000) return;
      this.couponCode2Add = '';
      this.messageBox.successSingle({
        title: '激活成功',
        successFunc: () => {
          this.unusedCouponList.unshift(res.data.Data);
          const _list = this.unusedCouponList;
          this.unusedCouponList = [];
          this.newCouponCode = res.data.Data.CouponCode;
          // this.couponDataNumber += 1;
          this.countData.find(it => it.First === 0).Second += 1;
          this.curSelectedOption = 0;
          setTimeout(() => {
            if (_list.length > 9) this.unusedCouponList = _list.splice(0, 9);
            else this.unusedCouponList = _list;
          }, 30);
        },
      });
    },
    async getCouponList(Page = 1) {
      const _obj = {
        Page,
        PageSize: 9,
        UseStatus: this.curSelectedOption,
      };
      // _obj.Product = {};
      switch (this.curSelectedOption) {
        case 0:
          this.Page0 = Page;
          break;
        case 1:
          this.Page1 = Page;
          break;
        case 2:
          this.Page2 = Page;
          break;
        default:
          break;
      }
      if (this.curSelectedOption === 0) this.unusedCouponList = [];
      if (this.curSelectedOption === 1) this.usedCouponList = [];
      if (this.curSelectedOption === 2) this.expiredCouponList = [];
      const res = await this.api.getMyCoupon(_obj);
      if (res.data.Status !== 1000) return;
      this.newCouponCode = '';
      if (this.curSelectedOption === 0) this.unusedCouponList = res.data.Data.Second;
      if (this.curSelectedOption === 1) this.usedCouponList = res.data.Data.Second;
      if (this.curSelectedOption === 2) this.expiredCouponList = res.data.Data.Second;
      this.countData = res.data.Data.First;
    },
    handlePageChange(page) {
      this.getCouponList(page);
    },
    handleSwitchStatus(status) {
      this.curSelectedOption = status;
      this.newCouponCode = '';
      const _t = this.countData.find(it => it.First === status);
      if (
        this.curSelectedList.length !== _t.Second
        && (this.curSelectedList.length === 0 || (this.curSelectedList.length <= 9 && _t.Second <= 9))
      ) this.getCouponList();
    },
    handleDelClick({ CouponCode, Status }) {
      let _text = '';
      switch (Status) {
        case 0:
          _text = '未使用';
          break;
        case 1:
          _text = '已使用';
          break;
        case 2:
          _text = '已过期';
          break;
        default:
          break;
      }

      this.messageBox.warnCancelBox({
        title: '确定删除该优惠券吗?',
        msg: `选中优惠券状态：[ ${_text} ]`,
        successFunc: () => {
          this.getCouponRemove(CouponCode, Status);
        },
      });
    },
    async getCouponRemove(CouponCode, Status) {
      const res = await this.api.getCouponRemove(CouponCode);
      if (res.data.Status !== 1000) return;
      this.messageBox.successSingle({
        title: '删除成功',
        successFunc: () => {
          if (Status === 0) this.unusedCouponList = this.unusedCouponList.filter(it => it.CouponCode !== CouponCode);
          if (Status === 1) this.usedCouponList = this.usedCouponList.filter(it => it.CouponCode !== CouponCode);
          if (Status === 2) this.expiredCouponList = this.expiredCouponList.filter(it => it.CouponCode !== CouponCode);
          const _t = this.countData.find(it => it.First === Status);
          _t.Second -= 1;
        },
      });
    },
    jumpToCouponCenter() {
      this.$router.push('/mySetting/couponCenter');
    },
  },
  mounted() {
    if (!this.countData) this.getCouponList();
  },
};
</script>

<style lang='scss'>
.mp-pc-my-setting-pages-my-coupons-page-wrap {
  width: 930px;
  > header {
    position: relative;
    padding-bottom: 50px;
    width: 930px;
    // padding-top: 10px;
    > .add-box {
      // margin-bottom: 50px;
      padding-top: 45px;
      padding-left: 128px;
      > .el-input {
        width: 350px;
        > input {
          height: 30px;
          // line-height: 26px;
          line-height: 26px\0;
          &::placeholder {
            font-size: 12px;
            color: #cbcbcb;
          }
        }
      }
      > span {
        // color: #888;
        margin-right: 6px;
      }
      > button {
        height: 30px;
        width: 90px;
        line-height: 28px;
        padding: 0;
        margin-left: 20px;
      }
    }
    > .jump-btn {
      line-height: 16px;
      position: absolute;
      right: 0;
      top: 0;
      > button {
        line-height: 16px;
        width: 120px;
        padding: 0;
        height: 40px;
        > span {
          > i {
            color: #ddd;
            margin-right: 10px;
            transition: color 0.2s;
          }
        }
        &:hover, &:focus {
          > span > i {
            color: #428dfa;
          }
        }
      }
    }
  }
  > .page-content {
    > header {
      box-shadow: 0px 2px 7px 1px rgba(238, 238, 238, 0.8);
      height: 40px;
      line-height: 40px;
      padding-left: 20px;
      > .status-item {
        margin-right: 34px;
        cursor: pointer;
        transition: 0.2s;
        padding: 2px 6px;
        border-radius: 2px;
        transition: 0.3s;
        &.active, &:hover {
          color: #428dfa;
        }
        &:active {
          color: #35dff9;
          background-color: #eee;
        }
      }
      > .title {
        margin-right: 6px;
      }
    }
    > ul.coupon-list {
      > li.coupon-item {
        transition: 0.2s;
        width: 260px;
        margin-top: 40px;
        margin-right: 45px;
        display: inline-block;
        position: relative;
        > .top {
          background-color: #9399ff;
          height: 170px;
          position: relative;
          color: #fff;
          text-align: center;
          > .amount {
            padding-top: 40px;
            padding-bottom: 29px;
            > i {
              line-height: 48px;
              font-size: 18px;
              height: 42px;
              display: inline-block;
              vertical-align: top;
              margin-right: 5px;
            }
            > span {
              font-size: 42px;
              font-weight: 700;
              display: inline-block;
            }
          }
          > .MinPayAmount {
            margin-bottom: 14px;
          }
          > .ValidDate {
            font-size: 12px;
          }
          > .to-del {
            width: 30px;
            height: 30px;
            position: absolute;
            border-radius: 50%;
            top: -15px;
            right: -15px;
            text-align: center;
            // padding-top: ;
            font-size: 17px;
            line-height: 28px;
            user-select: none;
            cursor: pointer;
            transition: 0.2s;
            // display: none;
            opacity: 0;
            background-color: rgba($color: #353535, $alpha: 0.4);
            &:hover {
              background-color: rgba($color: #353535, $alpha: 0.6);
            }
            &:active {
              background-color: rgba($color: #353535, $alpha: 0.8);
            }
          }
          &::before {
            content: '';
            position: absolute;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background-color: #fff;
            left: 116px;
            top: -14px;
          }
          &::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 6px;
            left: 0px;
            bottom: -0;
            background: url('../../assets/images/sawtooth-1.png') bottom left/ 260px 4px repeat-x ;
          }
        }
        > .bottom {
          height: 150px;
          background-color: #f5f5f5;
          padding-top: 30px;
          padding-left: 10px;
          > .product {
            margin-top: 24px;
            > .title {
              display: inline-block;
              width: 48px;
              vertical-align: top;
            }
            > .text {
              display: inline-block;
              margin-top: -5px;
              width: 192px;
              line-height: 24px;
              height: 48px;
              overflow: hidden;
            }
          }
          .title {
            user-select: none;
          }
        }
        > .will-out-time, .disabled-status {
          width: 90px;
          height: 90px;
          position: absolute;
          right: -2px;
          bottom: 0;
          > span.iconfont {
            font-size: 90px;
          }
          > span.text {
            display: block;
            position: absolute;
            top: 48px;
            left: 24px;
            transform: rotate(-45deg);
            color: #fff;
          }
        }
        > .disabled-status {
          > span.text {
            top: 46px;
            left: 33px
          }
          > span.iconfont {
            color: rgb(203, 203, 203);
          }
        }
        &:hover {
          // box-shadow: 0 -3px 3px 0 rgba(0, 0, 0, 0.3);
          transform: scale(1.01);
          > .top {
            > .to-del {
              // display: block;
              opacity: 1;
            }
          }
        }
        // box-shadow: 0 0 10px rgba(0,0,0,.12);
        &.add-new {
          animation: new-add-item 0.7s, new-add-item-color 6s ;
          box-shadow: 0px 0px 3px #ff3769;
        }
        &.old {
          animation: new-add-item-opacity 2s;
        }
        &.disabled {
          > .top {
            background-color: #cbcbcb;
          }
        }
      }
    }
    > .empty {
      height: 100px;
      text-align: center;
      color: #888;
      padding-top: 100px;
    }
    > footer {
      margin-top: 48px;
      margin-bottom: 40px;
    }
  }
  @keyframes new-add-item{
    0%{
      transform: scale(1);
    }
    25%{
      transform: scale(1.05);
    }
    50%{
      transform: scale(1);
    }
    75%{
      transform: scale(1.05);
    }
    100%{
      transform: scale(1);
    }
  }
  @keyframes new-add-item-color{
    0%{
      box-shadow: 0px 0px 10px #ff3769;
    }
    100%{
      box-shadow: 0px 0px 0px #ff3769;
    }
  }
  @keyframes new-add-item-opacity{
    0%{
      opacity: 0.2;
    }
    100%{
      opacity: 1;
    }
  }
}
</style>
