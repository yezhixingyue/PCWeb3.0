<template>
  <div class="mp-pc-common-comp-all-page-footer-wrap" :class="cancollapse ? 'cancollapse' : ''">
    <ul class="content float">
      <li class="text-box">
        <div>
          <div class="img-box">
            <img src="../../assets/images/logo-bottom-new.png" alt="">
          </div>
          <a :href="concact" target="_blank">联系我们</a>
          <a :href="statement" target="_blank">用户协议</a>
          <a :href="agreement" target="_blank">权责声明</a>
          <a :href="opinion" target="_blank">意见建议</a>
        </div>
        <p>
          <span>Copyright ©2019 - 2022 郑州名片之家电子商务有限公司</span>
          <span>服务热线：4006363006</span>
          <span>售后专线：4006363500</span>
          <a href="https://beian.miit.gov.cn/" target="_blank">豫ICP备16032622号-1</a>
        </p>
      </li>
      <li class="img-code-box">
        <div></div>
        <p>扫描进入公众号</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { homeUrl, statementID, agreementID } from '@/assets/js/setup';

export default {
  props: {
    cancollapse: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      concact: `${homeUrl}contact-us#contact-top`,
      opinion: `${homeUrl}contact-us#opinion`,
      statement: `${homeUrl}help/${statementID}`,
      agreement: `${homeUrl}help/${agreementID}`,
    };
  },
};
</script>

<style lang='scss'>
.mp-pc-common-comp-all-page-footer-wrap {
  width: 100%;
  height: 160px;
  box-sizing: border-box;
  // padding: 10px 0;
  background-color: #252525;
  position: relative;
  z-index: 18;
  .content {
    width: 1200px;
    height: 100%;
    margin: 0 auto;
    background-color: #252525;
    > li {
      height: 126px;
    }
    > .img-box {
      width: 155px;
      float: left;
      background: url(../../assets/images/logo-bottom.png) center center/154px 122px no-repeat;
    }
    >.text-box {
      float: left;
      box-sizing: border-box;
      > div {
        height: 115px;
        padding-top: 30px;
        padding-bottom: 30px;
        line-height: 34px;
        box-sizing: border-box;
        width: 984px;
        // border-bottom: 1px solid rgba(238, 238, 238, 0.05);
        > div {
          display: inline-block;
          height: 66px;
          vertical-align: top;
          width: 168px;
          padding-right: 95px;
          opacity: 0.9;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          margin-right: 73px;
        }
        > a {
          line-height: 34px;
          display: inline-block;
          margin: 0 30px;
          cursor: pointer;
          color: #ccc;
          font-size: 16px;
          padding: 16px 0;
          transition: color 0.25s ease-in-out;
          &:hover {
            color: #eee;
          }
        }
      }
      > p {
        height: 36px;
        font-size: 14px;
        color: #888;
        line-height: 20px;
        // padding: 31px 0;
        padding-top: 5px;
        box-sizing: border-box;
        > a {
          font-size: 14px;
          color: #888;
          line-height: 20px;
          text-decoration: unset;
          &:hover {
            text-decoration: underline;
          }
        }
        > span {
          margin-right: 47px;
        }
      }
    }
    >.img-code-box {
      float: right;
      width: 84px;
      padding-top: 28px;
      > div {
        width: 84px;
        height: 84px;
        background: url(../../assets/images/code.png) no-repeat right center;
      }
      > p {
        font-size: 12px;
        color: #888;
        margin-top: 12px;
      }
    }
  }
  &.cancollapse {
    position: fixed;
    left: 0;
    bottom: -126px;
    right: 0;
    // top: 130px;
    transition: 0.2s;
    z-index: 999;
    &:hover {
      bottom: 0;
    }
  }
}
</style>
