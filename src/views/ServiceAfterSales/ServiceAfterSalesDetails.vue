<template>
  <section class="mp-mpzj-order-service-after-sales-details-page-wrap">
    <section class="content">
      <header>
        <p class="is-bold" v-if="productInfo">
          <i></i> <span >售后单号：</span>{{productInfo.AfterSaleCode}}
        </p>
      </header>
      <div class="line"></div>
      <header>
        <p>
          <i></i> <span class="is-bold">服务进度：</span>
        </p>
        <ul v-if="AfterSaleInfo">
          <li v-for="(item, i) in AfterSaleInfo.ServiceProgresses" :key="item.CreateTime+i">
            <img src="@/assets/images/动线剪头.png" alt="">
            <p class="time" :title="item.CreateTime | format2MiddleLangTypeDate">{{item.CreateTime | format2MiddleLangTypeDate}}</p>
            <p class="is-bold" :title="item.ServiceContent">{{item.ServiceContent}}</p>
            <p class="msg" :title="item.ReasonTypeTitle">{{item.ReasonTypeTitle}}</p>
          </li>
        </ul>
      </header>
      <main >
        <div class="order-info">
          <header class="is-bold"><img src="" alt="">订单信息</header>
          <div class="box">
            <div style="margin-top: 16px;" v-if="OrderInfo">
              <p><span class="label">订单号：</span> <span class="value">{{OrderInfo.OrderID}}</span></p>
              <OrderDetailDisplayItem :ShowData='ProductShowData' :hiddenFactory="true" />
              <OrderDetailDisplayItem v-for="it in PartShowDataList" :ShowData='it' :key="it.Name" />
            </div>
            <div style="margin-top: 30px;" v-if="OrderInfo">
              <p><span class="label">下单方式：</span> <span class="value">{{OrderInfo.OrderType === 2 ? '自助上传' : '代客下单'}}</span></p>
              <p><span class="label">下单时间：</span> <span class="value">
                <span class="text is-gray">{{getDayDate(OrderInfo.CreateTime)}} </span>
                <span class="text is-gray">{{getMiDate(OrderInfo.CreateTime)}}</span>
              </span></p>
              <p><span class="label">付款时间：</span> <span class="value">
                <span class="text is-gray">{{getDayDate(OrderInfo.PayTime)}} </span>
                <span class="text is-gray">{{getMiDate(OrderInfo.PayTime)}}</span>
              </span></p>
              <p v-if="[254, 255].indexOf(OrderInfo.Status) === -1
                && OrderInfo.ProducePeriod && OrderInfo.ProducePeriod.TotalTime">
                <span class="label">
                  {{OrderInfo.ProducePeriod.IncludeDiliveryTime ? '预计送达：' : '预计发货：'}}
                </span> <span class="value">
                  {{getDayDate(OrderInfo.ProducePeriod.TotalTime)}}
                </span>
              </p>
            </div>
            <div style="margin-top: 30px;" v-if="OrderInfo">
              <p><span class="label">原价：</span> <span class="value">{{OrderInfo.OriginalPrice}}</span></p>
              <p><span class="label">成交价：</span> <span class="value is-pink is-bold">{{OrderInfo.FinalPrice}}元</span></p>
              <p><span class="label">已付：</span> <span class="value">{{OrderInfo.PaidAmount}}元</span></p>
              <p><span class="label">未付：</span> <span class="value">{{OrderInfo.UnPaidAmount}}元</span></p>
              <p><span class="label">退款：</span> <span class="value">{{OrderInfo.RefundOrderAmount}}元</span></p>
              <p><span class="label">优惠券：</span> <span class="value is-pink">{{OrderInfo.CouponAmount}}元</span></p>
              <p><span class="label">运费：</span> <span class="value">{{OrderInfo.FreightAmount}}元</span></p>
            </div>
          </div>
        </div>
        <div class="apply-info" v-if="AfterSaleInfo">
          <header class="is-bold"><img src="" alt="">申请信息</header>
          <div style="margin-top: 16px;">
            <p><span class="label">问题：</span> <span class="value">{{AfterSaleInfo.QuestionTypeTitles.join('、')}}</span></p>
            <p v-if="AfterSaleInfo.QuestionRemark"><span class="label">问题描述：</span> <span class="value">{{AfterSaleInfo.QuestionRemark}}</span></p>
            <p v-if="AfterSaleInfo.AppealContent"><span class="label">诉求：</span> <span class="value">{{AfterSaleInfo.AppealContent}}</span></p>
            <p v-if="AfterSaleInfo.Mobile"><span class="label">联系方式：</span> <span class="value">{{AfterSaleInfo.Mobile}}</span></p>
            <p v-if="AfterSaleInfo.QQ"><span class="label">QQ：</span> <span class="value">{{AfterSaleInfo.QQ }}</span></p>
            <p v-if="AfterSaleInfo.QuestionPics.length"><span class="label">图片凭证：</span></p>
            <p v-if="AfterSaleInfo.QuestionPics.length">
              <span class="value" style="display: flex; flex-wrap: wrap">
                <el-image :preview-src-list="AfterSaleInfo.QuestionPics" :mpCloseViewer='closeViewer'
                v-for="(item, index) in AfterSaleInfo.QuestionPics" :key="index + item" :src="item" fit="cover" ></el-image>
                <span v-if="AfterSaleInfo.QuestionPics.length === 0" class="is-gray">暂无图片</span>
              </span>
            </p>
          </div>
        </div>
        <div class="result" v-if="AfterSaleInfo">
          <header class="is-bold"><img src="" alt="">处理状态及结果</header>
          <p class="is-bold" v-if="AfterSaleInfo.Status === 0"> <img src="@/assets/images/待处理.png" alt=""> 客服暂未处理，请耐心等待！</p>
          <p class="is-bold" v-if="AfterSaleInfo.Status === 10"> <img src="@/assets/images/处理中.png" alt=""> 处理中请您耐心等待！</p>
          <p class="is-bold" v-if="AfterSaleInfo.Status === 25"> <img src="@/assets/images/已挂起.png" alt=""> 已挂起（{{AfterSaleInfo.HangReasonTypeTitle}}）</p>
          <p class="is-bold" v-if="AfterSaleInfo.Status === 30 && AfterSaleInfo.IsReject"> <img src="@/assets/images/未发现问题.png" alt=""> 未发现问题</p>
          <p class="is-bold" v-if="AfterSaleInfo.Status === 30 && !AfterSaleInfo.IsReject"> <img src="@/assets/images/已处理.png" alt=""> 已处理</p>
          <p class="is-bold" v-if="AfterSaleInfo.Status === 255"> <img src="@/assets/images/取消申请.png" alt=""> 您取消了申请</p>
          <div v-if="AfterSaleInfo.Status === 30">
            <p v-if="AfterSaleInfo.IsReject">
              <span class="label">具体说明：</span>
              <span class="value">
                {{ AfterSaleInfo.RejectReason }}
              </span>
            </p>
            <template v-else>
              <p v-if="AfterSaleInfo.SolutionResults[0].SolutionName !== '赠送优惠劵'">
                <span class="label">{{AfterSaleInfo.SolutionResults[0].SolutionName}}：</span>
                <span class="value">
                  {{ AfterSaleInfo.SolutionResults[0].SolutionContent }}
                </span>
              </p>
              <p v-if="AfterSaleInfo.SolutionResults[0].CouponContents.length"
              style="display: flex;">
                <span class="label">{{AfterSaleInfo.CouponIsExtra?'额外':''}}赠送优惠券：</span>
                <span class="value" style="flex: 1;">
                  <p class="coupon-item" :title="it" v-for="it in AfterSaleInfo.SolutionResults[0].CouponContents" :key="it">{{it}}</p>
                </span>
              </p>
              <p v-if="AfterSaleInfo.ExtraPayAmount"><span class="label">额外支付：</span> <span class="value">{{AfterSaleInfo.ExtraPayAmount}}</span></p>
              <p v-if="AfterSaleInfo.ExtraPayAmount && AfterSaleInfo.ExtraPayRemark">
                <span class="label">支出说明：</span> <span class="value">{{AfterSaleInfo.ExtraPayRemark}}</span>
              </p>
            </template>
            <p v-if="AfterSaleInfo && AfterSaleInfo.SupplementalQuestionPics.length"><span class="label">客服补充图片：</span></p>
            <p v-if="AfterSaleInfo && AfterSaleInfo.SupplementalQuestionPics.length">
              <span class="value" style="display: flex; flex-wrap: wrap">
                <el-image :preview-src-list="AfterSaleInfo.SupplementalQuestionPics" :mpCloseViewer='closeViewer'
                v-for="(item, index) in AfterSaleInfo.SupplementalQuestionPics" :key="index + item" :src="item" fit="cover" ></el-image>
              </span>
            </p>
          </div>
          <div v-if="[10, 25, 30, 40].find(it => it === AfterSaleInfo.Status)">
            <p class="is-bold" style="font-size: 16px;color: #444; margin: 20px 0 20px 0">处理人员联系方式</p>
            <p><span class="label">联系人：</span> <span class="value">{{AfterSaleInfo.OperaterUserName}}</span></p>
            <p v-if="AfterSaleInfo.OperaterContactWay"><span class="label">电话：</span> <span class="value">{{AfterSaleInfo.OperaterContactWay}}</span></p>
            <p v-if="AfterSaleInfo.OperaterQQ"><span class="label">QQ：</span> <span class="value">
              <a style="color: #428DFA; text-decoration: underline;"
              :href="`tencent://message/?uin=${AfterSaleInfo.OperaterQQ}&amp;Site=名片之家&amp;Menu=yes`">
                {{AfterSaleInfo.OperaterQQ}}
              </a>
            </span></p>
          </div>
        </div>
      </main>
      <footer>
        <!-- <el-button type="primary" v-if="[30, 40, 255].find(it => it === AfterSaleInfo.Status)" @click="goToAfterSalesApply">再次申请</el-button> -->
        <el-button type="primary" @click="cancelAfterSaleClick"
        v-if="AfterSaleInfo && [0, 10, 25].findIndex(it => it === AfterSaleInfo.Status) !== -1">取消申请</el-button>
        <el-button  @click="handleReturn" style="color: #428DFA; border-color: #428DFA;">
          返回列表
        </el-button>
      </footer>
    </section>
  </section>
</template>

<script>
import { imgUrl } from '@/assets/js/setup';
import ShowProductDetail from '@/store/Quotation/ShowProductDetail';
import OrderDetailDisplayItem from '@/packages/OrderDetailDisplayItem';

export default {
  components: {
    OrderDetailDisplayItem,
  },
  data() {
    return {
      QuestionPicList: [], // 保存的图片列表
      baseUrl: imgUrl,
      // 传入的商品信息
      productInfo: null,
      // 请求回来的售后订单信息
      OrderInfo: null,
      // 请求回来的售后信息
      AfterSaleInfo: null,
    };
  },
  computed: {
    ProductShowData() {
      let Name = this.OrderInfo?.ProductParams?.Attributes?.DisplayName || '产品名称';
      const FactoryName = this.OrderInfo?.ProductParams?.Attributes?.FactoryName || '';
      if (Array.isArray(this.OrderInfo?.ProductParams?.Attributes?.ClassList)) {
        const t = this.OrderInfo.ProductParams.Attributes.ClassList.find(it => it.Type === 1);
        if (t && t.SecondLevel?.Name) {
          Name = `${t.SecondLevel.Name}-${Name}`;
        }
      }
      if (this.OrderInfo?.ProductParams?.Attributes?.DisplayOrderList
      && this.OrderInfo.ProductParams.Attributes.DisplayOrderList.length > 0) {
        return {
          Name,
          FactoryName,
          ContentList: this.getPartShowList(this.OrderInfo.ProductParams.Attributes.DisplayOrderList, this.OrderInfo.ProductParams),
          Type: 'product',
        };
      }
      return {
        Name,
        FactoryName,
        ContentList: [],
        Type: 'product',
      };
    },
    PartList() {
      if (!this.OrderInfo) return [];
      if (!this.OrderInfo.ProductParams) return [];
      return this.OrderInfo.ProductParams.PartList;
    },
    PartShowDataList() {
      const arr = [];
      this.PartList.forEach(it => {
        if (Array.isArray(it.List)) {
          it.List.forEach((part, index) => {
            const ContentList = this.getPartShowList(it.Attributes.DisplayOrderList, part);
            const Name = it.List.length > 1 ? `${it.Attributes.Name}${index + 1}` : it.Attributes.Name;
            const temp = {
              Name,
              Type: 'Part',
              ContentList: ContentList || [],
            };
            arr.push(temp);
          });
        }
      });
      return arr;
    },
  },
  methods: {
    getDayDate(time) {
      if (!time) return '';
      return time.split('.')[0].split('T')[0];
    },
    getMiDate(time) {
      if (!time) return '';
      return time.split('.')[0].split('T')[1];
    },
    getPartShowList(DisplayOrderList, ProductParams) {
      return ShowProductDetail.getDisplayContentFromPartDataByDetailData(DisplayOrderList, ProductParams);
    },
    closeViewer() {},
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
    cancelAfterSaleClick() { // 取消申请
      this.messageBox.warnCancelBox({
        title: '操作确认',
        msg: '确定取消售后申请吗？',
        successFunc: () => {
          this.api.getCancleApply(this.productInfo.AfterSaleCode).then(res => {
            if (res.data.Status === 1000) {
              this.handleReturn();
            }
          });
        },
      });
    },
    handleReturn() {
      this.$router.go(-1);
    },
    goToAfterSalesApply() {
      this.$router.push({ name: 'AfterSalesApply', params: { data: JSON.stringify(this.OrderInfo) } });
    },
    initData() {
      this.api.getOrderAfterSaleDetail(this.productInfo.AfterSaleCode).then(res => {
        if (res.data.Status === 1000) {
          this.AfterSaleInfo = res.data.Data;
          // const temp = [...res.data.Data.QuestionPicList.map(it => this.baseUrl + it),
          //  ...res.data.Data.SolutionQuestionPicList.map(it => this.baseUrl + it)];
          // this.QuestionPicList = temp;
        }
      });
      this.api.getAfterSaleOrderDetail(this.productInfo.OrderID).then(res => {
        if (res.data.Status === 1000) {
          this.OrderInfo = res.data.Data;
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
    margin-bottom: 20px;
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
          max-width: 102px;
          text-align: center;
          margin-right: 65px;
          position: relative;
          .time,.msg{
            opacity: .5;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          &:last-of-type{
            >img{
              filter: grayscale(0%);
            }
          }
          >img{
            position: absolute;
            left: -38px;
            top: 18px;
            width: 9px;
            height: 12px;
            filter: grayscale(100%);
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
        >div, .box>div{
          >p{
            margin-bottom: 10px;
            line-height: 15px;
            .coupon-item{
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              width: 260px;
            }
            .label{
              color: #888;
            }
            .value{
              color: #444;
              >.el-image{
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
          >.box{
            height: calc(100% - 37px);
            overflow-y: auto;
            >div{
              padding-left: 46px;
              box-sizing: border-box;
              .mp-order-detail-item-comp-wrap{
                >li{
                  line-height: 15px;
                  margin-top: 10px;
                  >.text{
                    min-height: 15px;
                    font-size: 12px !important;
                    font-weight: 400;
                    .craft-content-list{
                      line-height: 15px;
                      padding: 0;
                    }
                  }
                }
              }
            }
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
    >footer{
      text-align: center;
      padding: 30px 0 20px 0;
      .el-button{
        width: 122px;
        height: 40px;
        line-height: 40px;
        padding: 0;
      }
      .el-button+.el-button{
        margin-left: 50px;
      }
    }
  }
}
</style>
