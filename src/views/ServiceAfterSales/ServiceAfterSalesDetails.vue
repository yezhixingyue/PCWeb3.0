<template>
  <section class="mp-mpzj-order-service-after-sales-details-page-wrap">
    <section class="content">
      <header>
        <p class="is-bold">
          <i></i> <span >售后单号：</span>280105
        </p>
      </header>
      <div class="line"></div>
      <header>
        <p>
          <i></i> <span class="is-bold">服务进度：</span>
        </p>
        <ul>
          <li>
            <p class="time">2024-4-27 18:52</p>
            <p class="is-bold">申请售后</p>
            <p class="msg">（等待返货）</p>
          </li>
          <li>
            <img src="@/assets/images/动线.png" alt="">
            <p class="time">2024-4-27 18:52</p>
            <p class="is-bold">申请售后</p>
            <p class="msg">（等待返货）</p>
          </li>
        </ul>
      </header>
      <main>
        <div class="order-info">
          <header class="is-bold"><img src="" alt="">订单信息</header>
          <div style="margin-top: 16px;" v-if="productInfo">
            <p><span class="label">订单号：</span> <span class="value">{{productInfo.OrderID}}</span></p>
            <p><span class="label">产品：</span> <span class="value">{{111780027}}</span></p>
            <p><span class="label">工厂：</span> <span class="value">{{111780027}}</span></p>
            <p><span class="label">物料：</span> <span class="value">{{productInfo.MaterialList | formatListItemMaterial}}</span></p>
            <p><span class="label">数量：</span> <span class="value">{{productInfo.ProductAmount}}{{ productInfo.Unit }}</span></p>
            <p><span class="label">款数：</span> <span class="value">{{productInfo.KindCount}}</span></p>
            <p><span class="label">尺寸：</span> <span class="value">{{productInfo.SizeList | formatListItemSize}}</span></p>
            <p><span class="label">印面：</span> <span class="value">{{111780027}}</span></p>
            <p><span class="label">印色：</span> <span class="value">{{111780027}}</span></p>
            <p><span class="label">是否带R标：</span> <span class="value">{{111780027}}</span></p>
            <p><span class="label">其他工艺：</span> <span class="value">{{111780027}}</span></p>
          </div>
          <div style="margin-top: 30px;" v-if="productInfo">
            <p><span class="label">下单方式：</span> <span class="value">{{111780027}}</span></p>
            <p><span class="label">下单时间：</span> <span class="value">{{111780027}}</span></p>
            <p><span class="label">付款时间：</span> <span class="value">{{111780027}}</span></p>
            <p><span class="label">预计发货：</span> <span class="value">{{111780027}}</span></p>
          </div>
          <div style="margin-top: 30px;" v-if="productInfo">
            <p><span class="label">原价：</span> <span class="value">{{111780027}}</span></p>
            <p><span class="label">成交价：</span> <span class="value is-pink is-bold">{{111780027}}</span></p>
            <p><span class="label">已付：</span> <span class="value">{{111780027}}</span></p>
            <p><span class="label">未付：</span> <span class="value">{{111780027}}</span></p>
            <p><span class="label">退款：</span> <span class="value">{{111780027}}</span></p>
            <p><span class="label">优惠券：</span> <span class="value is-pink">{{111780027}}</span></p>
            <p><span class="label">运费：</span> <span class="value">{{productInfo.Freight}}</span></p>
          </div>
        </div>
        <div class="apply-info">
          <header class="is-bold"><img src="" alt="">申请信息</header>
          <div style="margin-top: 16px;">
            <p><span class="label">问题：</span> <span class="value">{{111780027}}</span></p>
            <p><span class="label">问题描述：</span> <span class="value">{{111780027}}</span></p>
            <p><span class="label">诉求：</span> <span class="value">{{111780027}}</span></p>
            <p><span class="label">联系方式：</span> <span class="value">{{111780027}}</span></p>
            <p><span class="label">QQ：</span> <span class="value">{{111780027}}</span></p>
            <p><span class="label">图片凭证：</span></p>
            <p>
              <span class="value" style="display: flex; flex-wrap: wrap">
                <img src="@/assets/images/已处理.png" alt="">
                <img src="@/assets/images/已处理.png" alt="">
                <img src="@/assets/images/已处理.png" alt="">
                <img src="@/assets/images/已处理.png" alt="">
                <img src="@/assets/images/已处理.png" alt="">
                <img src="@/assets/images/已处理.png" alt="">
              </span>
            </p>
          </div>
        </div>
        <div class="result">
          <header class="is-bold"><img src="" alt="">处理状态及结果</header>
          <p class="is-bold"> <img src="@/assets/images/已处理.png" alt=""> 已处理</p>
          <div>
            <p><span class="label">补印：</span> <span class="value">{{111780027}}</span></p>
            <p><span class="label">赠送优惠券：</span> <span class="value">{{111780027}}</span></p>
            <p><span class="label">额外支付：</span> <span class="value">{{111780027}}</span></p>
            <p><span class="label">支出说明：</span> <span class="value">{{111780027}}</span></p>
            <p><span class="label">客服补充图片：</span></p>
            <p>
              <span class="value" style="display: flex; flex-wrap: wrap">
                <img src="@/assets/images/已处理.png" alt="">
                <img src="@/assets/images/已处理.png" alt="">
                <img src="@/assets/images/已处理.png" alt="">
                <img src="@/assets/images/已处理.png" alt="">
                <img src="@/assets/images/已处理.png" alt="">
                <img src="@/assets/images/已处理.png" alt="">
              </span>
            </p>
          </div>
          <div>
            <p class="is-bold" style="font-size: 16px;color: #444; margin: 20px 0 20px 0">处理人员联系方式</p>
            <p><span class="label">联系人：</span> <span class="value">{{111780027}}</span></p>
            <p><span class="label">电话：</span> <span class="value">{{111780027}}</span></p>
            <p><span class="label">QQ：</span> <span class="value">{{111780027}}</span></p>
          </div>
        </div>
      </main>
    </section>
  </section>
</template>

<script>
import { imgUrl } from '@/assets/js/setup';

export default {
  components: {},
  data() {
    return {
      QuestionPicList: [], // 保存的图片列表
      baseUrl: imgUrl,
      // 传入的商品信息
      productInfo: null,
      // 请求回来的售后信息
      AfterSaleInfo: null,
    };
  },

  methods: {
    copy(copyData) {
      const copyInput = document.createElement('input');// 创建input元素
      document.body.appendChild(copyInput);// 向页面底部追加输入框
      copyInput.setAttribute('value', copyData);// 添加属性，将url赋值给input元素的value属性
      copyInput.select();// 选择input元素
      document.execCommand('Copy');// 执行复制命令
      this.$message.success('复制成功！');// 弹出提示信息，不同组件可能存在写法不同
      // 复制之后再删除元素，否则无法成功赋值
      copyInput.remove();// 删除动态创建的节点
    },
    toAfterSale() {
      this.$router.push({ name: 'feedback', query: { isEdit: 0, data: JSON.stringify(this.productInfo) } });
    },
    handleReturn() {
      this.$router.go(-1);
    },
    initData() {
      this.api.getServiceDetail(this.productInfo.AfterSaleCode).then(res => {
        if (res.data.Status === 1000) {
          this.AfterSaleInfo = res.data.Data;
          const temp = [...res.data.Data.QuestionPicList.map(it => this.baseUrl + it), ...res.data.Data.SolutionQuestionPicList.map(it => this.baseUrl + it)];
          this.QuestionPicList = temp;
        //
        }
      });
    },
  },
  mounted() {
    if (!this.$route.params.data) {
      this.handleReturn();
      return;
    }
    this.productInfo = JSON.parse(this.$route.params.data);
    this.initData();
  },
};
</script>

<style lang='scss'>
.mp-mpzj-order-service-after-sales-details-page-wrap {
  background-color: #fff;
  width: 100%;
  margin-top: 15px;
  min-height: calc(100vh - 115px - 22px);
  min-height: calc(100vh - 115px - 42px) \0;
  > .content {
    width: 1200px;
    margin: 0 auto;
    box-sizing: border-box;
    margin-bottom: 80px;
    font-size: 12px;
    padding-top: 15px;
    >.line{
      width: 100%;
      height: 1px;
      background-color: #D6E8FF;
      margin: 10px 0;
    }
    >header{
      display: flex;
      align-items: flex-start;
      padding-left: 46px;
      color: #000000;
      line-height: 16px;
      >p{
        display: flex;
        align-items: center;
        >i{
          display: block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: #428DFA;
        }
        >span{
          margin: 0 10px;
        }
      }
      >ul{
        display: flex;
        color: #444444;
        max-width: calc(100% - 85px);
        padding-bottom: 10px;
        flex: 1;
        overflow-x: auto;
        >li{
          max-width: 95px;
          text-align: center;
          margin-right: 65px;
          position: relative;
          .time,.msg{
            opacity: .5;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          >img{
            position: absolute;
            left: -38px;
            top: 18px;
            width: 9px;
            height: 12px;
          }
          &:last-child{
            color: #428DFA;
            margin-right: 0
          }
        }
      }
    }
    >main{
      display: flex;
      justify-content: space-between;
      >div{
        height: 654px;
        border: 1px solid #DCDFE6;
        border-radius: 10px;
        >div{
          >p{
            margin-bottom: 10px;
            line-height: 15px;
            .label{
              color: #888;
            }
            .value{
              color: #444;
              >img{
                width: 115px;
                height: 81px;
                background-color: #efefef;
                margin-right: 12px;
                margin-bottom: 12px;
                border-radius: 4px;
                object-fit: cover;
                &:nth-child(3n){
                  margin-right: 0;
                }
              }
            }
          }
        }
        >header{
          width: calc(100% + 2px);
          background-color: #E8F1FE;
          line-height: 37px;
          text-align: center;
          border-radius: 9px;
          margin: -1px 0 0 -1px;
          color: #444;
          font-size: 16px;
        }
        &.order-info{
          width: 302px;
          >div{
            padding-left: 46px;
            box-sizing: border-box;
          }
          }
        &.apply-info{
          width: 410px;
          >div{
            padding: 0 20px;
            box-sizing: border-box;
          }
        }
        &.result{
          width: 435px;
          >p{
            font-size: 20px;
            line-height: 38px;
            margin-top: 15px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            img{
              width: 38px;
              height: 38px;
              margin-right: 6px;
            }
          }
          >div{
            padding: 0 33px;
            box-sizing: border-box;
          }
        }
      }
    }
  }
}
</style>
