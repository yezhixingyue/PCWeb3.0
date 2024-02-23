<template>
  <article class="mp-pc-common-page-comp-view-wrap">
    <header>
      <CommonHeader />
    </header>
    <div class="common-page-view-content">
      <!-- <keep-alive> -->
        <router-view />
      <!-- </keep-alive> -->
      <div class="back-wrapper">
        <el-popover
          placement="left"
          width="180"
          trigger="hover">
          <div class="contact-us-wrap" slot="reference">
            <i class="iconfont icon-dianhua1"></i>
          </div>
          <ul class="mp-contact-us-content-wrap">
            <!-- <li>
              <p class="title">
                <i class="iconfont icon-dianhua"></i>
                <span class="is-gray">软件技术支持：</span>
              </p>
              <div class="content">
                <p>0371-55672961</p>
                <p>199-0397-0210</p>
                <hr>
              </div>
            </li> -->
            <!-- <li>
              <p class="title">
                <i class="iconfont icon-QQ1"></i>
                <span class="is-gray">客服QQ：</span>
              </p>
              <div class="content">
                <p>
                  <a rel="nofollow" target="_blank"
                    href="tencent://message/?uin=800051518&amp;Site=名片之家&amp;Menu=yes">
                    <span>800051518</span>
                  </a>
                </p>
                <hr>
              </div>
            </li> -->
            <li>
              <p class="title">
                <i class="iconfont icon-wodekefu"></i>
                <span class="is-gray">全国统一服务热线：</span>
              </p>
              <div class="content">
                <p>4006363006</p>
                <p>4006363500</p>
              </div>
            </li>
          </ul>
        </el-popover>
        <el-backtop target="#app" :visibility-height='50'>
          <i class="iconfont icon-xiangshang"></i>
        </el-backtop>
      </div>
    </div>
    <footer>
      <BlueInfoFooter  />
      <!-- <BlueInfoFooter cancollapse /> -->
    </footer>
  </article>
</template>

<script>
import CommonHeader from '@/components/CommonPageComps/CommonHeader.vue';
import BlueInfoFooter from '@/components/common/BlueInfoFooter.vue';

export default {
  components: {
    CommonHeader,
    BlueInfoFooter,
  },
};
</script>

<style lang='scss'>
.mp-pc-common-page-comp-view-wrap {
  padding-top: 125px;
  background-color: rgb(245, 245, 245);
  box-sizing: border-box;
  min-width: 1200px;
  overflow-x: auto;
  > .common-page-view-content {
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
    min-height: calc(100vh - 115px - 22px);
    min-height: calc(100vh - 115px - 42px)\0;
    > .back-wrapper {
      width: 1200px;
      margin: 0 auto;
      height: 1px;
      position: fixed;
      z-index: 20;
      bottom: 80px;
      left: calc(50% - 600px);
      > .el-backtop {
        position: absolute;
        right: -85px !important;
        bottom: 0px !important;
        width: 50px;
        height: 50px;
        background-color: #428dfa;
        border-radius: 5px;
        color: #fff;
        text-align: center\0;
        line-height: 40px\9\0;
        > i {
          font-size: 10px;
          transform: scale(0.9);
        }
        &:hover {
          background-color: mix(#fff, #428dfa, 20%);
        }
        &:active {
          background-color: #1d5ab6;
        }
      }
       .contact-us-wrap {
        position: absolute;
        right: -85px !important;
        bottom: 65px;
        color: #428dfa;
        background-color: #fff;
        width: 48px;
        height: 48px;
        border-radius: 5px;
        text-align: center;
        border: 1px solid #fff;
        transition: 0.2s;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.15);
        // box-sizing: border-box;
        > i {
          font-size: 20px;
          position: absolute;
          left: 15px;
          top: 15px;
        }
        cursor: pointer;
        &:hover {
          // background-color: #eee;
          // border-color: #428dfa;
          border: 1px solid #428dfa;
          background-color: #428dfa;
          color: #fff;
        }
        &:active {
          // background-color: #eee;
          border: 1px solid #1d5ab6;
          // color: #428dfa;
          background-color: #1d5ab6;
        }
      }
    }
    @media screen and (max-width:1350px){
      > .back-wrapper {
        width: calc(100vw - 150px);
      }
    }
    @media screen and (max-width:1200px){
      > .back-wrapper {
        // width: calc(100vw);
        left: unset;
        right: 120px;
      }
    }
    @media screen and (max-width:1000px){
      > .back-wrapper {
        // width: calc(100vw);
        left: unset;
        right: 15px\0;
      }
    }
    @media screen and (max-width:880px){
      > .back-wrapper {
        width: calc(100vw);
        left: unset;
        right: 0\0;
      }
    }
  }
  @keyframes identifier {
    // 0% {
    //   border: 1px solid ;
    // },
  }
}
ul.mp-contact-us-content-wrap {
  padding-left: 8px;
  padding-right: 12px;
  padding-top: 4px;
  padding-bottom: 8px;
  > li {
    > p.title {
      > .iconfont {
        color: #428dfa;
        margin-right: 12px;
        &.icon-wodekefu {
          font-size: 16px;
          margin-right: 10px;
        }
      }
    }
    > div.content {
      padding-top: 7px;
      padding-left: 26px;
      letter-spacing: 0.5px;
      > p {
        padding: 2px 0;
        color: #585858;
        > a {
          color: inherit;
          &:hover {
            color: #428dfa;
          }
        }
      }
      > hr {
        border: none;
        border-bottom: 1px dashed #ccc;
        margin: 12px 0;
      }
    }
  }
}
</style>
