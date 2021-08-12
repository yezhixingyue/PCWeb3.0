<template>
  <section class="mp-pc-my-setting-pages-coupon-center-page-wrap">
    <header>
      <span class="blue-v-line is-bold is-black">领券中心</span>
      <span class="is-font-12">（ 共检测出 <i class="is-pink is-font-16">{{couponCount}}</i> 张优惠券 ）</span>
    </header>
    <ul class="content" v-if="couponList.length > 0">
      <li class="coupon-item"
        v-for="(item, i) of couponList"
        :key="item.CouponID + i"
        :class="item.Receivable?item.Data.TotalNumber>item.Data.GenerateNumber?'receivable':'hasnone':'disabled'">
        <div class="left-content">
          <div class="amount-box">
            <p class="f center">
              <span class="is-font-18">¥ </span><span class="is-font-28 is-bold">{{item.Data.Amount}}</span>
            </p>
            <p class="center is-font-12">满<i class="is-font-14">{{item.Data.MinPayAmount}}</i>元可用</p>
          </div>
          <div class="info">
            <p class="f">
              <span class="is-gray">限产品：</span>
              <el-tooltip popper-class="table-item" :enterable='true' placement="top-start">
                <ul slot="content">
                  <li v-for="(it, i) in item.ProductString.split('\n')" :key="i">{{it}}</li>
                </ul>
                <span>{{item.ProductString}}</span>
              </el-tooltip>
            </p>
            <p class="is-gray">
              <span>{{item.ValidStartTime | format2MiddleLangTypeDate}}</span>
              <i> - </i>
              <span>{{item.ValidEndTime | format2MiddleLangTypeDate}}</span>
            </p>
          </div>
        </div>
        <div class="right-botton" @click="handleCouponReceive(item)">
          {{item.Receivable?item.Data.TotalNumber>item.Data.GenerateNumber?'立即领取':'已抢光':'已领取'}}
        </div>
        <div class="receivable-box"></div>
      </li>
    </ul>
    <div class="has-none-wrap" v-else>
      <span>暂无优惠券</span>
    </div>
    <footer>
      <Count
        :watchPage='Page'
        :handlePageChange='handlePageChange'
        :count='couponCount'
        :pageSize='PageSize'
      />
    </footer>
  </section>
</template>

<script>
import Count from '@/components/common/Count.vue';

export default {
  components: {
    Count,
  },
  data() {
    return {
      couponList: [],
      couponCount: 0,
      Page: 1,
      PageSize: 12,
    };
  },
  methods: {
    async getCouponList(Page, PageSize) {
      // const couponCenterData = sessionStorage.getItem('couponCenterData');
      // if (couponCenterData) {
      //   this.couponList = JSON.parse(couponCenterData).couponList;
      //   this.couponCount = JSON.parse(couponCenterData).couponCount;
      //   return;
      // }
      if (Page) this.Page = Page;
      if (PageSize) this.PageSize = PageSize;
      const res = await this.api.getCouponReceiveableList(this.Page, this.PageSize);
      if (res.data.Status === 1000) {
        this.couponList = res.data.Data;
        this.couponCount = res.data.DataNumber;
        // this.setSsionStorage();
      }
    },
    setSsionStorage() { // 已弃用
      const _couponCenterData = { couponList: this.couponList, couponCount: this.couponCount };
      sessionStorage.setItem('couponCenterData', JSON.stringify(_couponCenterData));
    },
    handlePageChange(page) {
      this.getCouponList(page);
    },
    async receiveCoupon(data) {
      const res = await this.api.getCouponReceive(data);
      if (res.data.Status === 1000) {
        const cb = () => {
          const { CouponID } = data;
          const _t = this.couponList.find(it => it.CouponID === CouponID);
          if (_t) {
            _t.ReceiveNumber += 1;
            if (_t.ReceiveNumber === _t.MaxReceiveNumber) _t.Receivable = false;
          }
        };
        this.messageBox.successSingle({
          title: '领取成功',
          successFunc: cb,
        });
      } else if (res.data.Status === 7086) {
        const { CouponID } = data;
        const _t = this.couponList.find(it => it.CouponID === CouponID);
        _t.Data.GenerateNumber = _t.Data.TotalNumber;
      }
    },
    handleCouponReceive({ CouponID, Receivable, Data }) {
      if (!CouponID || !Receivable || Data.TotalNumber === Data.GenerateNumber) return;
      this.receiveCoupon({ CouponID });
    },
  },
  mounted() {
    this.getCouponList();
  },
};
</script>

<style lang='scss'>
.mp-pc-my-setting-pages-coupon-center-page-wrap {
  > .content {
    padding-top: 35px;
    margin-right: -25px;
    > li.coupon-item {
      width: 470px;
      height: 120px;
      margin-right: 20px;
      margin-bottom: 40px;
      border-radius: 5px;
      border: solid 1px #eeeeee;
      transition: 0.3s;
      // overflow: hidden;
      position: relative;
      box-sizing: border-box;
      display: inline-block;
      > .left-content {
        height: 95px;
        width: 410px;
        padding-top: 14px;
        padding-bottom: 11px;
        display: inline-block;
        > div {
          display: inline-block;
          height: 100%;
          &.amount-box {
            color: #9399ff;
            width: 125px;
            height: 100%;
            border-right: 1px dashed #eee;
            transition: color 0.3s;
          }
          &.info {
            width: 284px;
          }
          > p {
            padding: 0 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            &.f {
              padding: 16px 12px;
              margin-bottom: 10px;
              line-height: 28px;
              height: 28px;
            }
            &.center {
              text-align: center;
            }
            > .el-tooltip {
              max-width: 203px;
              display: inline-block;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            > .is-gray {
              display: inline-block;
              line-height: 28px;
              height: 28px;
              vertical-align: top;
            }
          }

        }
      }
      > .receivable-box {
        position: absolute;
        width: 62px;
        height: 62px;
        border-radius: 50%;
        top: 12px;
        right: 72px;
        overflow: hidden;
        background: url('../../assets/images/couponed.png') no-repeat center/100% 100%;
        z-index: 20;
        background-color: rgba($color: #fff, $alpha: 0.85);
        display: none;
      }
      &.disabled, &.hasnone {
        > div {
          opacity: 0.6;
        }
        > .receivable-box {
          display: block;
          opacity: 1;
        }
      }
      &.hasnone {
        > .receivable-box {
          background: url('../../assets/images/lootAll.png') no-repeat center/100% 100%;
        }
      }
      > .right-botton {
        position: absolute;
        top: -1px;
        right: -1px;
        width: 60px;
        height: 110px;
        font-size: 16px;
        vertical-align: top;
        writing-mode: vertical-rl;
        text-align: center;
        line-height: 60px;
        letter-spacing: 8px;
        padding-top: 10px;
        user-select: none;
        background-color: #9399ff;
        color: #fff;
        border-radius: 5px;
        transition: 0.3s;
        &::before {
          content: '';
          position: absolute;
          width: 4px;
          height: 120px;
          left: 0;
          top: 0;
          background: url('../../assets/images/sawtooth-2.png') left bottom/ 4px 120px repeat-y ;
        }
      }
      &.receivable {
        > .right-botton {
          cursor: pointer;
        }
      }
      &.receivable:hover {
        // border-color: #7a80e7;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        > .right-botton {
          background-color: #5e66fa;
          &:active {
            background-color: #3b4096;
          }
        }
        > .left-content > div.amount-box {
          color: #5e66fa;
        }
      }
    }
  }
  > .has-none-wrap {
    font-size: 13px;
    color: #838a9d;
    text-align: center;
    padding-top: 140px;
    padding-right: 80px;
    line-height: 16px;
  }
  > footer {
    margin-bottom: 50px;
    > .count-wrap {
      > .count {
        display: none;
      }
    }
  }
}
</style>
