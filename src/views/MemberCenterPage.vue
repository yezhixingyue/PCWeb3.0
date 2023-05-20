<template>
  <section class="member-center-page">
    <header>
      <div>
        <span @click="arrowLClick" class="carousel__arrow carousel__arrow--left">
          <i class="iconfont icon-iconfontyoujiantou"></i>
        </span>
        <span @click="arrowRClick" class="carousel__arrow carousel__arrow--right">
          <i class="iconfont icon-iconfontyoujiantou"></i>
        </span>
        <el-carousel @change="onChange"
        v-if="customerInfo"
        :initial-index="customerInfo.Grade.Third || 0"
        indicator-position="outside" arrow="always"
        :autoplay="false" :loop="false" ref="carousel">
          <el-carousel-item v-for="(item, index) in memberListData" :key="index">
            <div class="carousel-main" :class="`v${item.index}`">
              <img :src="require(`@/assets/images/member-banner/member-v${item.index}.png`)" alt="">
              <div class="current-level" v-if="customerInfo">
                <div class="user-name">
                  <p>
                    {{customerInfo.CustomerName}}
                  </p>
                  <img :src="require(`@/assets/images/member-banner/v${item.index}-crown.png`)" alt="">
                  <!-- <img src="@/assets/images/v0-crown.png" alt=""> -->
                </div>
                <p v-if="item.index === customerInfo.Grade.Third" class="level"><i></i> 当前等级</p>
                <p class="other">
                  <template v-if="customerInfo.AuthStatus === 2">
                    <span v-if="item.index === customerInfo.Grade.Third">
                      <template v-if="customerInfo.Grade.Third === 0">
                        长期有效
                      </template>
                      <template v-else>
                        有效期至:{{ customerInfo.GradeEndTime | formatMonthLastDay }}
                      </template>
                    </span>
                    <span v-if="item.index > customerInfo.Grade.Third">
                      还没有到达该等级请再接再厉~
                    </span>
                    <span v-if="item.index < customerInfo.Grade.Third">
                      您已超过该等级
                    </span>
                  </template>
                  <template v-else>
                    认证后可升级解锁更多权益
                  </template>
                </p>
              </div>
              <div class="other-level">
                <div class="level-name">
                  <span v-if="memberListData[index+1]">下一等级：{{memberListData[index+1].name}}>></span>
                  <span v-else>最高等级</span>
                </div>
                <div class="level">
                  Lv{{item.index}} {{item.name}}
                </div>
              </div>
              <!-- <h3>{{ item }}</h3> -->
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </header>
    <main>
      <div class="member-title">
        <div class="hand-shank left">
          <div class="circle top">
            <span class="solid"></span>
          </div>
          <div class="line"></div>
          <div class="circle bottom">
            <span class="solid"></span>
          </div>
        </div>
        <span></span>
        <span></span>
        <h2>{{actionMemberData.name}}权益</h2>
        <div class="hand-shank right">
          <div class="circle top">
            <span class="solid"></span>
          </div>
          <div class="line"></div>
          <div class="circle bottom">
            <span class="solid"></span>
          </div>
        </div>
      </div>
      <div class="member-rights-interests">
        <el-scrollbar wrap-class="scrollbar-wrapper" ref="scrollbar">
          <ul>
            <li v-for="(item, index) in actionMemberData.rightsAndInterests" :key="index">
              <div class="img-box">
                <img :src="require(`@/assets/images/rightsAndInterest/${item.backgroundImage}`)" alt="">
                <div class="bottom-bg">
                </div>
                <div class="top-right-bg">
                </div>
                <p></p>
              </div>
              <p>{{ item.name }}</p>
            </li>
          </ul>
        </el-scrollbar>
      </div>
      <div class="member-rule">
        <div class="left">
          <div class="line"></div>
          <div class="line"></div>
          <div class="line"></div>
          <div class="line"></div>
        </div>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <h2>会员升降级别规则Q&A</h2>
        <div class="right">
          <div class="line"></div>
          <div class="line"></div>
          <div class="line"></div>
          <div class="line"></div>
        </div>
      </div>
      <div class="member-rule-info">
        <ul>
          <li v-for="(item, index) in regulations" :key="index">
            <h3><i></i><span>Q{{ index + 1 }}：{{ item.title }}</span></h3>
            <p v-for="(detail, i) in item.details" :key="i">
              {{ detail }}
            </p>
          </li>
        </ul>
      </div>
    </main>
  </section>
</template>

<script>
import Vue from 'vue';
import { mapState } from 'vuex';
import memberListData, { regulations } from '@/assets/js/memberListData';
import { Carousel, CarouselItem } from 'element-ui';

Vue.use(Carousel).use(CarouselItem);
export default {
  data() {
    return {
      nowSwipeIndex: 0,
      memberListData,
      regulations,
    };
  },
  filters: {
    formatDateContent(str) {
      if (str) {
        return str.split('T')[0];
      }
      return '';
    },
    formatMonthLastDay(str) {
      const date = new Date(str.split('T')[0]);
      const year = date.getFullYear();
      const month = date.getMonth();
      const lastDay = new Date(year, month + 1, 0).getDate();
      if (str) {
        return `${year}-${month + 1}-${lastDay}`;
      }
      return '';
    },
  },
  computed: {
    ...mapState('common', ['customerInfo']),
    actionMemberData() {
      return memberListData.find(it => it.index === this.nowSwipeIndex);
    },
  },
  watch: {
    customerInfo: {
      handler(newVal) {
        if (newVal) {
          this.onChange(newVal?.Grade?.Third);
        }
      },
      immediate: true,
    },
  },
  methods: {
    arrowLClick() {
      this.$refs.carousel.prev();
    },
    arrowRClick() {
      this.$refs.carousel.next();
    },
    onChange(index) {
      this.nowSwipeIndex = index;
      setTimeout(() => {
        this.$refs.scrollbar.update();
      }, 100);
    },
  },
};
</script>
<style lang='scss'>
.member-center-page{
  background-color: #fff;
  header{
    height: 477px;
    background: url(../assets/images/会员页面背景设计.png) no-repeat;
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: center;
    align-items: center;
    >div{
      position: relative;
      height: 100%;
      .carousel__arrow{
        position: absolute;
        top: calc(50% - 41px);
        color: #000;
        background-color: #E9E9E9;
        width: 82px;
        height: 82px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0.6;
        transform: 0.2s;
        &:hover{
          opacity: 0.8;
        }
        &.disabled{
          opacity: 0.4;
        }
        &.carousel__arrow--left{
          left: -100px;
          transform: rotateZ(180deg);
        }
        &.carousel__arrow--right{
          right: -100px;
        }
        >i{
          font-size: 32px;
        }
      }
    }
    .el-carousel{
      margin: 0 auto;
      margin-top: 90px;
      width: 986px;
      position: relative;
      .carousel-main{
        padding: 8px;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        position: relative;
        &.v0{
          .current-level{
            .user-name{
              border-color: #005AD5;
            }
          }
          .other-level{
            .level{
              color: #005AD5;
            }
            .level-name{
              color: #00265B;
            }
          }
        }
        &.v1{
          .current-level{
            .user-name{
              border-color: #CDD1D7;
              color: #818488;
            }
          }
          .other-level{
            .level{
              border-color: #6A6A6A;
              color: #232323;
            }
            .level-name{
              color: #232323;
            }
          }
        }
        &.v2{
          .current-level{
            .user-name{
              border-color: #D27200;
              color: #8F4E00;
            }
          }
          .other-level{
            .level{
              border-color: #E59100;
              color: #8F4E00;
            }
            .level-name{
              color: #232323;
            }
          }
        }
        &.v3{
          .current-level{
            .user-name{
              border-color: #A85E11;
              color: #8F4E00;
            }
          }
          .other-level{
            .level{
              border-color: #956003;
              color: #8F4E00;
            }
            .level-name{
              color: #232323;
            }
          }
        }
        &.v4{
          .current-level{
            .user-name{
              border-color: #351F58;
              color: #351F58;
            }
          }
          .other-level{
            .level{
              border-color: #341E58;
              color: #351F58;
            }
            .level-name{
              color: #F6F6F6;
            }
          }
        }
        &.v5{
          .current-level{
            .user-name{
              border-color: #FCF1DE;
              color: #2A2219;
            }
          }
          .other-level{
            .level{
              border-color: #000000;
              color: #000000;
            }
            .level-name{
              color: #F6F6F6;
            }
          }
        }

        >img{
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
        }
        .current-level{
          position: relative;
          width: 330px;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          .user-name{
            width: 228px;
            height: 50px;
            border: 4px solid #004FBC;
            box-sizing: border-box;
            background-color: #fff;
            color: #004FBC;
            text-align: center;
            position: relative;
            border-radius: 33px;
            margin-top: 70px;
            font-size: 18px;
            line-height: 42px;
            padding: 0 6px;
            p{
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            img{
              width: 62px;
              height: 40px;
              position: absolute;
              left: calc(50% - 31px);
              top: -42px;
              z-index: 999;
            }
          }
          .level{
            font-size: 29px;
            color: #fff;
            margin-top: 20px;
          }
          .other{
            font-size: 22px;
            color: #fff;
            margin-top: 40px;
            margin-bottom: 40px;
          }
        }
        .other-level{
          position: relative;
          padding: 29px 30px 32px 0;
          width: 600px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-end;
          .level-name{
            color: #00265B;
            font-size: 22px;
            line-height: 30px;
          }
          .level{
            width: 205px;
            height: 42px;
            border: 2px solid #005AD5;
            border-radius: 21px;
            color: #005AD5;
            font-size: 27px;
            line-height: 34px;
            box-sizing: border-box;
            background-color: #fff;
            text-align: center;
          }
        }
      }
      .el-carousel__arrow{
        display: none;
      }
      .el-carousel__indicators{
        margin: 0 auto;
        margin-top: 40px;
        text-align: center;
        width: 180px;
        display: flex;
        justify-content: space-around;
        height: 14px;
        align-items: center;
        .el-carousel__indicator{
          display: inline-block;
          width: 8px;
          height: 7px;
          border-radius: 4px;
          padding: 0;
          margin: 0 4px;
          transition: width 0.2s;
          &.is-active{
            width: 80px;
            .el-carousel__button{
              border-radius: 4px;
              width: 80px;
              height: 100%;
            }
          }
          .el-carousel__button{
            border-radius: 4px;
            width: 7px;
            height: 100%;
          }
        }
      }
    }
  }
  main{
    .member-title{
      position: relative;
      text-align: center;
      width: 420px;
      margin: 0 auto;
      margin-top: 60px;
      height: 64px;
      h2{
        font-size: 50px;
        color: #00193B;
        font-weight: bold;
        line-height: 64px;
        z-index: 999;
        position: relative;
      }
      >span{
        width: 30px;
        height: 30px;
        display: inline-block;
        position: absolute;
        border: 4px solid #FFDB77;
        border-radius: 50%;
        // z-index: 88;
        &:nth-of-type(1) {
          left: 90px;
          top: -1px;
        }
        &:nth-of-type(2) {
          right: 90px;
          bottom: 0px;
          border-color: #4694FF;
        }
      }
      .hand-shank{
        position: absolute;
        top: 26px;
        width: 30px;
        &.left{
          left: 0;
        }
        &.right{
          right: 0;
        }
        .circle{
          border: 3px solid #0056CB;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          box-sizing: border-box;
          display: inline-block;
          &.bottom{
            margin-top: 55px;
            .solid{
              margin-top: 0;
            }
          }
          &.top{
            .solid{
              margin-top: 8px;
            }
          }
          .solid{
            width: 16px;
            height: 16px;
            border-radius: 50%;
            display: inline-block;
            background-color: #0056CB;

          }
        }
        .line{
          display: inline-block;
          width: 14px;
          height: 88px;
          background-color:#4694FF;
          position: absolute;
          left: 8px;
          top: 14px;
          border-radius: 7px;
        }
      }
    }
    .member-rights-interests{
      background: url(../assets/images/rights-interests.png) no-repeat;
      width: 1245px;
      height: 357px;
      margin: 0 auto;
      margin-top: 35px;
      padding: 0 125px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      .el-scrollbar{
        flex: 1;
        .el-scrollbar__bar{
          height: 8px;
          opacity: 1;
        }
      }
      ul{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100%;
        padding: 30px 0;
        li+li{
          margin-left: 10px;
        }
        li{
          min-width: 191px;
          display: flex;
          flex-direction: column;
          align-items: center;
          .img-box{
            position: relative;
            width: 156px;
            height: 157px;
            border: 4px solid #4694FF;
            background-color: #005AD5;
            box-sizing: border-box;
            border-radius: 25px;
            display: flex;
            justify-content: center;
            img{
              width: 130px;
              height: 130px;
              margin-top: 10px;
            }
            .top-right-bg{
              width: 73px;
              height: 70px;
              position: absolute;
              right: -9px;
              top: -9px;
              background: url(../assets/images/rightsAndInterest/权益装饰.png) no-repeat;
              background-size: 100%;
            }
            .bottom-bg{
              width: 100%;
              position: absolute;
              bottom: 0;
              background-color: #fff;
              opacity: 0.3;
              height: 44px;
              border-radius: 0 0 20px 20px;
            }
            p{
              width: 100%;
              position: absolute;
              bottom: 0;
              text-align: center;
              font-size: 22px;
              color: #005AD5;
              bottom: 8px;
            }
          }
          >p{
            color: #005AD5;
            font-size: 28px;
            text-align: center;
            line-height: 35px;
            margin-top: 14px;
          }
        }
      }
    }
    .member-rule{
      position: relative;
      text-align: center;
      width: 1244px;
      margin: 0 auto;
      margin-top: 60px;
      h2{
        font-size: 50px;
        color: #00193B;
        font-weight: bold;
        line-height: 64px;
        position: relative;
      }
      >span{
        width: 30px;
        height: 30px;
        display: inline-block;
        position: absolute;
        border: 4px solid #FFDB77;
        border-radius: 50%;
        // z-index: 88;
        &:nth-of-type(1) {
          left: 390px;
          top: -1px;
          border-color: #BED9FF;
        }
        &:nth-of-type(2) {
          left: 490px;
          bottom: -1px;
          border-color: #FFAA00;
        }
        &:nth-of-type(3) {
          right: 490px;
          top: -1px;
          border-color: #0B63DC;
        }

        &:nth-of-type(4) {
          right: 360px;
          bottom: 0px;
          border-color: #4694FF;
        }
      }
      >div{
        position: absolute;
        bottom: 4px;
        width: 340px;
        height: 44px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        &.left{
          left: 0;
        }
        &.right{
          right: 0;
          transform: rotate(-180deg);
        }

        .line{
          display: inline-block;
          width: 340px;
          height: 5px;
          background: linear-gradient(to right, #FFFFFF, #ABCEFF);
          border-radius: 3px;
        }
      }
    }
    .member-rule-info{
      margin-top: 40px;
      padding-bottom: 100px;
      ul{
        li{
          text-align: center;
          color: #444;
          line-height: 24px;
          width: 1244px;
          margin: 0 auto;
          h3{
            font-size: 18px;
            font-weight: bold;
            margin-top: 20px;
            margin-bottom: 15px;
            position: relative;
            height: 24px;
            i{
              width: 217px;
              height: 6px;
              border-radius: 4px;
              background-color:#ABCEFF;
              display: block;
              position: absolute;
              left: 50%;
              top: 10px;
              transform: translateX(-50%);
            }
            span{
              position: relative;
            }
          }
          p{
            font-size: 16px;
          }
        }
      }
    }
  }
}
</style>
