<template>
  <section class="mp-place-order-aside-intro-comp-wrap" :class="asideIntroData ? 'right' : ''">
    <header @click="onHomeDetailClick">
      <el-image v-if="asideIntroData" :src="baseImgUrl + asideIntroData.Cover" fit="cover" title="查看产品详情" ></el-image>
      <h2 v-if="asideIntroData">{{productName}}</h2>
      <p v-if="asideIntroData">
        <span>{{asideIntroData.Introduce.substr(0, 25)}}<i v-if="asideIntroData.Introduce.length > 25">...</i></span>
        <em class="span-title-blue">产品说明</em>
      </p>
      <span v-else>
        <img src="@/assets/images/empty.png" alt="">
        <i>暂无产品说明</i>
      </span>
    </header>
    <section>
      <header>
        <h2>同类产品</h2>
        <span><i></i>查看同类产品说明</span>
      </header>
      <ul v-if="asideAboutData">
        <li v-for="item in asideAboutData.AboutList" :key="item.ID" @click="onJumpProductOrder(item.ID)">
          <p>{{item.Name}}</p>
          <div>
            <el-image :src="baseImgUrl + item.Cover" fit="cover" ></el-image>
            <p class="tip">产品说明</p>
          </div>
        </li>
        <li v-if="asideAboutData.AboutList.length === 0" class="no-recommended">
          <img src="@/assets/images/empty.png" alt="">
          <p>暂无同类产品推荐</p>
        </li>
        <li class="footer-w"></li>
      </ul>
      <div v-else>
        <div v-show="isError">获取数据出错,<span @click="onNewGetClick" class="span-title-blue">重新获取</span></div>
      </div>
    </section>
  </section>
</template>

<script>
import { imgUrl, productJumpUrl } from '@/assets/js/setup';

export default {
  props: ['asideAboutData', 'asideIntroData', 'productName', 'isError'],
  data() {
    return {
      baseImgUrl: imgUrl,
    };
  },
  methods: {
    onHomeDetailClick() {
      if (!this.asideIntroData) return;
      window.open(`${productJumpUrl}product?productID=${this.asideIntroData.Product.ID}`);
    },
    onNewGetClick() {
      this.$emit('getProductAsideIntroData');
    },
    onJumpProductOrder(id) {
      // window.open(`/#/placeOrder?id=${id}`);id
      window.open(`${productJumpUrl}product?productID=${id}`);
    },
  },
};
</script>

<style lang='scss'>
.mp-place-order-aside-intro-comp-wrap {
  display: inline-block;
  vertical-align: top;
  width: 255px;
  background-color: rgb(245, 245, 245);

  > header {
    width: 100%;
    height: 280px;
    margin-bottom: 25px;
    background-color: #fff;
    cursor: pointer;
    transition: box-shadow 0.25s ease-in-out;
    > div.el-image {
      width: 210px;
      height: 155px;
      overflow: hidden;
      margin-left: 23px;
      margin-top: 24px;
      > div {
        font-size: 12px;
      }
      > img {
        transition: transform 0.25s ease-in-out;
        border-radius: 2px;
      }
    }
    > h2 {
      height: 40px;
      padding-top: 11px;
      line-height: 33px;
      box-sizing: border-box;
      text-align: center;
      background-color: #fff;
      color: #585858;
      transition: 0.25s ease-in-out;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 200px;
      margin-left: 27.5px;
    }
    > p {
      line-height: 21px;
      padding: 4px 30px;
      font-size: 12px;
      height: 52px;
      width: 100%;
      box-sizing: border-box;
      color: #888;
      background-color: #fff;
      > span {
        margin-right: 10px;
      }
      > em {
        margin-left: -6px;
        white-space: nowrap;
      }
    }
    > span {
      text-align: center;
      padding-top: 85px;
      display: inline-block;
      width: 100%;
      height: 100%;
      background-color: #fff;
      box-sizing: border-box;
      font-size: 12px;
      color: #aaa;
      > i {
        display: block;
        margin-top: 15px;
      }
    }
  }
  > section {
    > header {
      height: 60px;
      width: 100%;
      padding: 20px 15px;
      line-height: 20px;
      box-sizing: border-box;
      background-color: #fff;
      > h2 {
        display: inline-block;
        font-size: 16px;
        width: 80px
      }
      > span {
        display: inline-block;
        font-size: 12px;
        color: #aaa;
        width: 144px;
        text-align: right;
        > i {
          display: inline-block;
          width: 14px;
          height: 14px;
          vertical-align: -2px;
          margin-right: 8px;
          background: url('../../../assets/images/horn.png') no-repeat center center/14px 14px;
        }
      }
    }
    > ul {
      width: 100%;
      max-height: 927px;
      min-height: 194px;
      overflow-y: auto;
      background-color: #eee;
      > li {
        border-top: 1px dashed #eee;
        box-sizing: border-box;
        padding: 0 27.5px;
        height: 224px;
        background-color: #fff;
        overflow: hidden;
        > p {
          height: 51px;
          padding-top: 17px;
          padding-bottom: 10px;
          line-height: 24px;
          box-sizing: border-box;
          font-size: 14px;
          color: #585858;
          transition: color 0.3s ease-in-out;
          display: inline-block;
          width: auto;
          position: relative;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 1px;
            background-color: rgba(0, 0, 0, 0);
            left: 0;
            bottom: 14px;
            transition: background-color 0.3s ease-in-out;
          }
        }
        > div {
          height: 150px;
          position: relative;
          overflow: hidden;
          > div {
            height: 150px;
            width: 200px;
            > img {
              transition: transform 0.3s ease-in-out;
              border-radius: 2px;
            }
          }
          > p {
            position: absolute;
            bottom: -35px;
            height: 35px;
            width: 100%;
            box-sizing: border-box;
            padding: 5px;
            line-height: 25px;
            text-align: center;
            background-color: rgba(66,141,250, 0.7);
            color: #fff;
            transition: 0.2s ease-in-out;
            opacity: 0;
          }
        }
        &:not(.no-recommended):hover {
          cursor: pointer;
          p.tip {
            bottom: 0;
            opacity: 1;
          }
          > p {
            color: mix(#428dfa, #fff, 80%);
            // text-decoration: underline;
            &::after {
              background-color: mix(#428dfa, #fff, 80%);
            }
          }
          // box-shadow: 0 0px 5px rgba(0, 0, 0, 0.08), 0 2px 6px 0 rgba(0, 0, 0, 0.08);
        }
        &.no-recommended {
          text-align: center;
          padding-top: 60px;
          height: 270px;
          > p {
            color: #aaa;
            font-size: 12px;
            padding-top: 10px;
            display: block;
          }
        }
        &.footer-w {
          height: 30px;
          border: none;
        }
      }
    }
    > div {
      background-color: #eee;
      width: 100%;
      height: 320px;
      text-align: center;
      padding-top: 120px;
      box-sizing: border-box;
      font-size: 12px;
      color: #989898;
    }
  }
  &.right {
    > header:hover {
      .span-title-blue {
        opacity: 0.8;
        color: #26bcf9;
      }
      box-shadow: 0 0px 5px rgba(0, 0, 0, 0.08), 0 2px 6px 0 rgba(0, 0, 0, 0.08);
      > div.el-image {
        > img {
          transform: scale(1.05);
          transform: translate(-50%, -50%) scale(1.05)\0;
        }
      }
      > h2 {
        font-weight: 700;
      }
    }
  }
}
</style>
