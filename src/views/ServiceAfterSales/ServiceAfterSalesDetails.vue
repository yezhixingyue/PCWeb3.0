<template>
  <section class="mp-mpzj-order-feedback-add-page-wrap">
    <section class="content">
      <header v-if="productInfo">
        <span class="is-bold is-black">订单号：{{productInfo.OrderID}}</span>
        <!-- <span v-if="canEdit" class="is-font-12"> （ 该订单如有售后等问题需要反馈，请填写该页面信息并提交，工作人员会在查收到后第一时间进行处理 ）</span> -->
      </header>
      <div>
        <el-table stripe border v-if="productInfo"
          :data="[productInfo]" style="width: 100%" class="ft-14-table">
          <el-table-column prop="ProductName" label="商品名称" width="156" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ProductName" label="物料" width="168" show-overflow-tooltip>
            <span slot-scope="scope">{{scope.row.MaterialList | formatListItemMaterial}}</span>
          </el-table-column>
          <el-table-column label="尺寸" show-overflow-tooltip width="148">
            <span slot-scope="scope" v-if="scope.row.SizeList.length">{{ scope.row.SizeList | formatListItemSize }}</span>
          </el-table-column>
          <el-table-column label="数量" width="68" show-overflow-tooltip>
            <span slot-scope="scope">{{ scope.row.ProductAmount }}{{ scope.row.Unit }}</span>
          </el-table-column>
          <el-table-column label="款数" width="48" show-overflow-tooltip>
            <span slot-scope="scope">{{ scope.row.KindCount }}款</span>
          </el-table-column>
          <el-table-column label="工艺" show-overflow-tooltip width="64">
            <!-- ================================== -->
            <span slot-scope="scope" v-if="scope.row.CraftList && scope.row.CraftList.length">{{ scope.row.CraftList | formatListItemSize }}</span>
          </el-table-column>
          <el-table-column prop="Content" label="文件内容" width="146" show-overflow-tooltip></el-table-column>
          <el-table-column prop="FinalPrice" label="成交价" width="85" show-overflow-tooltip>
            <span slot-scope="scope">{{scope.row.FinalPrice ? `${scope.row.FinalPrice}元` : ''}}</span>
          </el-table-column>
          <el-table-column prop="OrderID" label="运费" width="58" show-overflow-tooltip>
            <span slot-scope="scope">{{scope.row.Freight}}元</span>
          </el-table-column>
          <el-table-column prop="OrderID" label="总计" width="88" show-overflow-tooltip>
            <span slot-scope="scope">
              <b class="is-pink">
                {{scope.row.Freight + scope.row.FinalPrice}}元
              </b>
            </span>
          </el-table-column>
          <el-table-column prop="OrderID" label="已售后(含运费)" width="110" show-overflow-tooltip>
            <span slot-scope="scope">{{scope.row.Refund +  scope.row.RefundFreight}}元</span>
          </el-table-column>
        </el-table>
        <div class="info" v-if="AfterSaleInfo">
          <h4>售后信息</h4>
          <CustomSteps
              :stepsNumber='stepsNumber'
              :underway='underway'
              :stepList='stepList'></CustomSteps>

          <template v-if="AfterSaleInfo.Status === 30 || AfterSaleInfo.Status === 40">
            <h4>处理结果</h4>
            <p class="opinion" v-if="AfterSaleInfo.Status === 40">
              <span>已驳回</span>
            </p>
            <p class="reprint" v-if="AfterSaleInfo.SolutionTypes.find(it => it === 7)">
              补印：款数：<span class="is-pink">{{AfterSaleInfo.SuccessKindCount}}</span>款，数量：<span class="is-pink">{{AfterSaleInfo.SuccessNumber}}</span> 张
              <span style="margin-left: 20px;">补印订单号：{{ AfterSaleInfo.ReprintOrderID }}
                <i @click="copy(AfterSaleInfo.ReprintOrderID)">复制</i>
                可在订单中查看进度
              </span>
            </p>
            <div class="refund" v-if="AfterSaleInfo.SolutionTypes.find(it => it === 2)">
              <div class="left">
                <p>退款：</p>
              </div>
              <div class="right">
                <p v-if="AfterSaleInfo.RefundBalance">
                  <i>
                    退到余额：<span>{{AfterSaleInfo.RefundBalance}}</span> 元
                  </i>
                  <i v-if="AfterSaleInfo.RefundFreightType === 1 && AfterSaleInfo.RefundFreightAmount">
                    含运费：<span>{{AfterSaleInfo.RefundFreightAmount}}</span> 元
                  </i>
                </p>
                <p v-if="AfterSaleInfo.RefundPrintBean">
                  <i>
                    退印豆：<span>{{AfterSaleInfo.RefundPrintBean}}</span> 个
                  </i>
                  <i v-if="AfterSaleInfo.RefundFreightType === 3 && AfterSaleInfo.RefundFreightAmount">
                    含运费：<span>{{AfterSaleInfo.RefundFreightAmount}}</span> 个
                  </i>
                </p>
                <p v-if="AfterSaleInfo.RefundThirdParty">
                  <i>
                    退到扫码账户：<span>{{AfterSaleInfo.RefundThirdParty}}</span> 元
                  </i>
                  <i v-if="AfterSaleInfo.RefundFreightType === 2 && AfterSaleInfo.RefundFreightAmount">
                    含运费：<span>{{AfterSaleInfo.RefundFreightAmount}}</span> 元
                  </i>
                </p>
                <p v-if="AfterSaleInfo.UnpaidReducedAmount">
                  <i>
                    售后优惠：<span>{{AfterSaleInfo.UnpaidReducedAmount}}</span> 元
                  </i>
                </p>
              </div>
            </div>
            <div class="coupon" v-if="AfterSaleInfo.SolutionTypes.find(it => it === 8)">
              <div>
                赠送优惠券：
              </div>
              <ul>
                <li v-for="(it,i) in AfterSaleInfo.CouponList" :key="i">
                    <span class="is-pink">{{it.Amount}}</span>元
                    满<span class="MinPayAmount">{{it.MinPayAmount}}</span>元使用
                    （ <i class="is-origin">{{it.Number}}</i>张 ）
                </li>
              </ul>
            </div>
            <p class="opinion" v-if="AfterSaleInfo.SolutionTypes.find(it => it === 255)">
              <span>其他</span>
            </p>
          </template>

          <template v-if="AfterSaleInfo.Status === 30 || AfterSaleInfo.Status === 40">
            <h4>处理意见</h4>
            <p class="opinion">
              {{AfterSaleInfo.OperaterRemark}}
              <!-- <span v-if="AfterSaleInfo.SolutionType === 255"> {{AfterSaleInfo.OperaterRemark}}</span>
              <span v-if="AfterSaleInfo.Status === 40">亲爱的客户，您的服务单不符合我司的售后制度，暂无法为您处理，感谢您一路以来的支持。</span>
              <span v-if="AfterSaleInfo.SolutionType === 7">亲爱的客户，您的服务单符合公司售后制度，已为您办理补印，感谢您一路以来的支持。</span>
              <span v-if="AfterSaleInfo.SolutionType === 2">亲爱的客户，您的服务单符合公司售后制度，已为您办理退款，感谢您一路以来的支持。</span>
              <span v-if="AfterSaleInfo.SolutionType === 8">亲爱的客户，您的服务单符合公司售后制度，已为为您赠送优惠券，感谢您一路以来的支持。</span> -->
            </p>
            <!-- <p class="opinion"> -->
              <!-- 驳回原因 -->
              <!-- <span v-if="AfterSaleInfo.Status === 40">{{AfterSaleInfo.OperaterRemark}}</span> -->
            <!-- </p> -->
          </template>

          <template v-if="AfterSaleInfo.Status < 30">
            <h4>进度说明</h4>
            <p class="opinion">
              <span v-if="AfterSaleInfo.Status === 0">亲爱的客户，您的服务单已经提交成功，请您耐心等待名片之家处理。</span>
              <span v-if="AfterSaleInfo.Status === 10">亲爱的客户，您的服务单我们正在努力处理，请耐心等待。</span>
              <span v-if="AfterSaleInfo.Status === 20">亲爱的客户，您的服务单我们正在退款，请耐心等待。</span>
            </p>
            <p class="opinion" style="margin-top:10px" v-if="AfterSaleInfo.OperaterRemark">
              <span>{{AfterSaleInfo.OperaterRemark}}</span>
              <span style="margin-left:10px" v-if="AfterSaleInfo.NextOperateType">下次处理时间：{{AfterSaleInfo.NextOperateTime | format2MiddleLangTypeDate}}</span>
              <!-- <span style="margin-left:10px" v-else>处理时间：不确定</span> -->
            </p>
          </template>
          <p style="margin-top:30px;color:#585858" v-if="AfterSaleInfo.Status >= 30 && AfterSaleInfo.Status != 255">
            <span>是否已解决您的问题？若未解决{{productInfo.AppealStatus===3?'可联系处理人员': '可点击再次申请售后服务'}}</span>
          </p>
          <div class="btns" v-if="AfterSaleInfo.Status !== 255">
            <template v-if="AfterSaleInfo.Status >= 30 && AfterSaleInfo.Status != 255">
              <el-button @click="toAfterSale" v-if="productInfo.AppealStatus === 1">申请售后</el-button>
              <el-tooltip v-else
                effect="dark" :content="getAppealStatusText(productInfo.AppealStatus)" placement="top">
                <span style="margin-right: 10px;">
                  <el-button disabled style="color: #999; border-color: #999;">申请售后</el-button>
                </span>
              </el-tooltip>
            </template>

            <el-button @click="seeHandlerVisible = true" v-if="AfterSaleInfo.Status >= 10 && AfterSaleInfo.Status != 255">联系处理人员</el-button>
            <!-- <el-button @click="seeHandlerVisible = true" >联系处理人员</el-button> -->
            <template v-if="AfterSaleInfo.Status === 30">
              <el-button v-if="!AfterSaleInfo.IsEvaluate" @click="estimateClick(productInfo.AfterSaleCode)">售后评价</el-button>
              <el-button v-else @click="seeEstimateClick(productInfo.AfterSaleCode)">查看评价</el-button>
            </template>
            <el-button @click="editAfterSale" v-if="AfterSaleInfo.Status === 0" class="safety">修改服务单</el-button>
            <el-button @click="cancelAfterSale(productInfo.AfterSaleCode)" v-if="AfterSaleInfo.Status === 0" class="danger">取消服务单</el-button>
          </div>
          <h4>服务单信息</h4>
          <table class="table" v-if="AfterSaleInfo">
            <div class="tr">
              <div class="td title">问题类型：</div>
              <div class="td content texts">{{AfterSaleInfo.QuestionTypeTitleList.length?AfterSaleInfo.QuestionTypeTitleList.join('，'):'--'}}</div>
              <div class="td title">诉求意向：</div>
              <div class="td content">
                <template v-if="AfterSaleInfo.AppealType === 2">
                  退货/退款
                </template>
                <template v-if="AfterSaleInfo.AppealType === 3">
                  优惠减款
                </template>
                <template v-if="AfterSaleInfo.AppealType === 7">
                  补印
                </template>
                <template v-if="AfterSaleInfo.AppealType === 255">
                  其他
                </template>
                <!-- {{AfterSaleInfo.AppealType === null ? '--' : AfterSaleInfo.AppealType === 2 ? '退款' : AfterSaleInfo.AppealType === 7 ? '补印' : '其他'}} -->
              </div>
            </div>
            <div class="tr">
              <div class="td title">联系信息：</div>
              <div class="td content texts">
                <p>
                  <span style="margin-right:10px" v-if="AfterSaleInfo.ContactName">联系人：{{AfterSaleInfo.ContactName}}</span>
                  <span style="margin-right:10px" v-if="AfterSaleInfo.Mobile">手机：{{AfterSaleInfo.Mobile}}</span>
                  <span style="margin-right:10px" v-if="AfterSaleInfo.ContactQQ">QQ：{{AfterSaleInfo.ContactQQ}}</span>
                  <span style="margin-right:10px" v-if="!AfterSaleInfo.ContactQQ && !AfterSaleInfo.Mobile && !AfterSaleInfo.ContactName">--</span>
                </p>
              </div>

              <div class="td title">上传图片：</div>
              <div class="td content image">
                <el-image :preview-src-list="QuestionPicList" :mpCloseViewer='closeViewer'
                v-for="(item, index) in QuestionPicList" :key="index + item" :src="item" fit="cover" ></el-image>
                <!-- {{AfterSaleInfo.QuestionPicList}} -->
                <span v-if="QuestionPicList.length === 0">暂无图片</span>
              </div>
            </div>
            <div class="tr">
              <div class="td title">问题描述：</div>
              <div class="td content texts" style="width:none;flex:1">{{AfterSaleInfo.QuestionRemark || '--'}}</div>
            </div>
            <!-- <div class="tr">
              <div class="td title">联系信息：</div>
              <div class="td content texts">
                <p>
                  <span style="margin-right:10px" v-if="AfterSaleInfo.ContactName">联系人：{{AfterSaleInfo.ContactName}}</span>
                  <span style="margin-right:10px" v-if="AfterSaleInfo.Mobile">手机：{{AfterSaleInfo.Mobile}}</span>
                  <span style="margin-right:10px" v-if="AfterSaleInfo.ContactQQ">QQ：{{AfterSaleInfo.ContactQQ}}</span>
                  <span style="margin-right:10px" v-if="!AfterSaleInfo.ContactQQ && !AfterSaleInfo.Mobile && !AfterSaleInfo.ContactName">--</span>
                </p>
              </div>
              <div class="td title"></div>
              <div class="td content"></div>
            </div> -->
          </table>
        </div>

            <div class="btn-box">
              <el-button @click="handleReturn" style="color: #428DFA; border-color: #428DFA;">
                返回
              </el-button>
            </div>
      </div>
      <el-dialog
        :visible.sync="seeHandlerVisible"
        @cancle="seeHandlerVisible = false"
        @closed='seeHandlerVisible = false'
        submitText='确定'
        width='432px'
        >
        <div class="text">
          <div class="row">
            <div class="left">
              <i class="el-icon-user-solid"></i>
            </div>
            <div class="right">
              <h4>处理人</h4>
              <ul>
                <li v-if="AfterSaleInfo">{{AfterSaleInfo.OperaterUserName}}</li>
              </ul>
            </div>
          </div>
          <div class="line"></div>
          <div class="row">
            <div class="left">
              <i class="iconfont icon-dianhua1"></i>
            </div>
            <div class="right">
              <h4>联系电话</h4>
              <ul>
                <li v-if="AfterSaleInfo">{{AfterSaleInfo.OperaterContactWay}}</li>
              </ul>
            </div>
          </div>
          <div class="line"></div>
          <div class="row">
            <div class="left">
              <i class="iconfont icon-QQ1"></i>
            </div>
            <div class="right">
              <h4>联系QQ</h4>
              <ul>
                <li v-if="AfterSaleInfo">
                  <a :href="`tencent://message/?uin=${AfterSaleInfo.OperaterQQ}&amp;Site=名片之家&amp;Menu=yes`"
                    class="details" style="padding:0">{{AfterSaleInfo.OperaterQQ}}</a>
                </li>

                <!-- <li v-if="AfterSaleInfo">{{AfterSaleInfo.OperaterQQ}}</li> -->
              </ul>
            </div>
          </div>
          <!-- <div class="row"></div> -->
        </div>
        <span slot="footer" class="dialog-footer">
          <p>
            <el-button type="primary" @click="seeHandlerVisible = false" >确定</el-button>
          </p>
        </span>
      </el-dialog>
      <!-- 售后评价 -->
      <EstimateDialogComp
      :AfterSaleCode='AfterSaleCode'
      :visible='estimateVisible'
      @closed="estimateClosed"
      @submit="estimateSubmit"></EstimateDialogComp>
      <!-- 查看售后评价 -->
      <SeeEstimateDialogComp
      :AfterSaleCode='AfterSaleCode'
      :visible='seeEstimateVisible'
      @closed="seeEstimateVisible = false"
      @submit="seeEstimateVisible = false"></SeeEstimateDialogComp>
    </section>
  </section>
</template>

<script>
// import SingleSelector from '@/components/common/Selector/SingleSelector.vue';
import CustomSteps from '@/components/ServiceAfterSales/CustomSteps.vue';
import EstimateDialogComp from '@/components/common/EstimateDialogComp/EstimateDialogComp.vue';
import SeeEstimateDialogComp from '@/components/common/EstimateDialogComp/SeeEstimateDialogComp.vue';
import { imgUrl } from '@/assets/js/setup';

export default {
  components: {
    // SingleSelector,
    CustomSteps,
    EstimateDialogComp,
    SeeEstimateDialogComp,
  },
  data() {
    return {
      seeEstimateVisible: false,
      estimateVisible: false,
      AfterSaleCode: null,
      QuestionPicList: [], // 保存的图片列表
      seeHandlerVisible: false,
      baseUrl: imgUrl,
      // 传入的商品信息
      productInfo: null,
      // 请求回来的售后信息
      AfterSaleInfo: null,
      stepList: [{ text: '提交申请', type: 1 }],
      stepsNumber: 1,
      underway: '处理中',
      Steps: {
        submitApplications: { // 提交申请
          text: '提交申请',
          imgUrl: '@/assets/images/stepsImg/submit-applications.png',
          actionImgUrl: '@/assets/images/stepsImg/submit-applications-action.png',
        },
        beingProcessed: { // 处理中
          text: '系统处理中',
          imgUrl: '@/assets/images/stepsImg/being-processed.png',
          actionImgUrl: '@/assets/images/stepsImg/being-processed-action.png',
        },
        refund: { // 退款中
          text: '退款中',
          imgUrl: '@/assets/images/stepsImg/refund.png',
          actionImgUrl: '@/assets/images/stepsImg/refund-action.png',
        },
        figureOut: { // 处理完成
          text: '处理完成',
          imgUrl: '@/assets/images/stepsImg/figure-out.png',
          actionImgUrl: '@/assets/images/stepsImg/figure-out-action.png',
        },
      },
    };
  },

  methods: {
    getAppealStatusText(status) {
      let str = '';
      switch (status) {
        case 0:
          str = '订单未完成';
          break;
        case 2:
          str = '正在售后';
          break;
        case 3:
          str = '已退全款或全部补印';
          break;
        case 255:
          str = '超出售后期';
          break;
        default:
          break;
      }
      return str;
    },
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
    editAfterSale() {
      this.$router.push({ name: 'feedback', query: { isEdit: 1, data: JSON.stringify({ ...this.AfterSaleInfo, ...this.productInfo }) } });
    },
    cancelAfterSale(code) {
      // this.messageBox
      this.messageBox.warnCancelBox({
        msg: '您确定取消本次申请吗？',
        title: '操作确认',
        successFunc: () => {
          // 发送取消请求
          this.api.getCancleApply(code).then(res => {
            if (res.data.Status === 1000) {
              this.handleReturn();
            } else {
              this.initData();
            }
          });
        },
      });
    },
    handleReturn() {
      this.$router.go(-1);
    },
    // 售后评价
    estimateClick(AfterSaleCode) {
      this.estimateVisible = true;
      this.AfterSaleCode = AfterSaleCode;
    },
    // 售后评价弹窗关闭
    estimateClosed() {
      this.estimateVisible = false;
      this.AfterSaleCode = null;
    },
    estimateSubmit(data) {
      this.api.getOrderAfterSaleEvaluate(data).then(res => {
        if (res.data.Status === 1000) {
          this.initData();
          this.estimateVisible = false;
          this.AfterSaleCode = null;
        }
      });
    },
    // 查看评价
    seeEstimateClick(AfterSaleCode) {
      this.seeEstimateVisible = true;
      this.AfterSaleCode = AfterSaleCode;
    },
    closeViewer() {},
    getSteps(AfterSaleInfo) {
      this.stepList = [{ text: '提交申请', type: 1 }];
      if (AfterSaleInfo.Status === 255) { // 取消
        this.stepList.push({ text: '服务单已取消', type: 255 });
      } else if (AfterSaleInfo.Status === 30) {
        if (AfterSaleInfo.SolutionTypes.find(it => it === 2)) { // 如果处理结果为退款
          this.stepList.push({ text: '处理中', type: 10 });
          this.stepList.push({ text: '退款中', type: 20 });
          this.stepList.push({ text: '处理完成', type: 255 });
        } else {
          this.stepList.push({ text: '处理中', type: 10 });
          this.stepList.push({ text: '处理完成', type: 255 });
        }
      } else {
        this.stepList.push({ text: '处理中', type: 10 });
        this.stepList.push({ text: '处理完成', type: 255 });
      }
      // 确定步数
      switch (AfterSaleInfo.Status) {
        case 0:
          this.stepsNumber = 1;
          this.underway = '待处理';
          break;
        case 10:
          this.stepsNumber = 2;
          this.underway = '处理中';
          break;
        // case 20:
        //   if (AfterSaleInfo.SolutionType === 2) { // 退款
        //     this.stepsNumber = 3;
        //     this.underway = '退款中';
        //   }
        //   break;
        case 30: // 处理完成 并 处理结果为退款
          if (AfterSaleInfo.SolutionTypes.find(it => it === 2)) { // 退款
            this.stepsNumber = 4;
            this.underway = '已完成';
          } else {
            this.stepsNumber = 3;
            this.underway = '已完成';
          }
          break;
        case 40: // 驳回
          this.stepsNumber = 3;
          this.underway = '已完成';
          break;
        default:
          this.stepsNumber = 2;
          this.underway = '已完成';
      }
    },
    initData() {
      this.api.getServiceDetail(this.productInfo.AfterSaleCode).then(res => {
        if (res.data.Status === 1000) {
          this.AfterSaleInfo = res.data.Data;
          const temp = [...res.data.Data.QuestionPicList.map(it => this.baseUrl + it), ...res.data.Data.SolutionQuestionPicList.map(it => this.baseUrl + it)];
          this.QuestionPicList = temp;
          this.getSteps(res.data.Data);
        //
        }
      });
    },
  },
  mounted() {
    this.productInfo = JSON.parse(this.$route.query.data);
    console.log(this.productInfo, 'productInfo');
    this.initData();
  },
};
</script>

<style lang='scss'>
.mp-mpzj-order-feedback-add-page-wrap {
  .info{
    color: #333;
    font-size: 14px;
    h4{
      font-weight: 700;
      // line-height: 3em;
      margin-bottom: 20px;
      margin-top: 30px;
      color: #585858;
    }
    p{
      // line-height: 2em;
      color: #888888;
      &.opinion{
        line-height: 2em;
        margin-bottom: 10px;
      }
    }
    .btns{
      border-bottom: 1px dotted #EEEEEE;
      padding:20px 0px;
      .el-button{
        width: 100px;
        height:30px;
        padding:0 10px;
        line-height:30px;
        border:1px solid #428dfa;
        color:#428dfa;
      }
      .safety{
        background-color: #428dfa;
        color: #fff;
      }
      .danger{
        color: #FF3769;
        border:1px solid #FF3769;
      }
    }
    .reprint{
      margin-bottom: 10px;
      // span{
      //   color: #FF3769;
      // }
      i{
        cursor: pointer;
        color: #428dfa;
      }
    }
    .refund{
      // margin: -7px 0;
      margin-bottom: 10px;
      display: flex;
    }
    .coupon{
      margin-bottom: 10px;
      display: flex;
      color: #888888;
      ul{
        line-height: 2em;
        margin: -0.5em 0;
      }
    }
  }
  .table{
    border: 1px solid #eeeeee;
    border-spacing: 0;
    border-bottom: 0;
    .tr,.td{
      box-sizing: border-box;
    }
    >.tr{
      display: flex;
      border-bottom: 1px solid #eeeeee;;
      .td{
        border-left: 1px solid #eeeeee;
      }
      .td:nth-child(1){
        border-left: 0;
      }

      .title{
        width: 100px;
        font-size: 14px;
        color: #585858;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 52px;
      }
      .content{
        padding: 0 20px;
        color: #888888;
        width: 469px;
        display: flex;
        justify-content: left;
        align-items: center;
        min-height: 52px;
        &.texts{
          padding: 8px 20px;
          line-height: 30px;
        }
        &.image{
          padding-top: 10px;
          flex-wrap: wrap;
          padding-right: 12px;
          >span{
            line-height: 32px;
            margin-bottom: 10px;
          }
        }
        .el-image{
          width: 40px;
          height: 40px;
          // padding: 25px 0;
          margin-bottom: 10px;
          margin-right: 8px;
          text-align: center;
        }
      }
    }
  }
  width: 100%;
  margin-top: 25px;
  // background-color: #fff;
  min-height: calc(100vh - 115px - 22px);
  min-height: calc(100vh - 115px - 42px) \0;

  > .content {
    width: 1200px;
    margin: 0 auto;
    background-color: #fff;
    padding: 30px;
    box-sizing: border-box;
    margin-bottom: 80px;
    > header {
      // padding-top: 25px;
      border-bottom: 1px dashed #EEEEEE;
      padding-bottom: 15px;
      margin-bottom: 15px;
      // padding-left: 10px;
    }
    > div {
      width: 100%;
      // margin-left: 80px;
      > .el-form{
        margin-top: 22px;
      }
      > .line{
        border-bottom: 1px dashed #EEEEEE;
        margin-top: -16px;
        margin-bottom: 30px;
      }

      .btn-box {
        padding-bottom: 60px;
        margin-top: 20px;
        line-height: 41px;
        display: flex;
        justify-content: center;
        > button {
          width: 140px;
          & + button {
            margin-left: 100px;
          }
        }
      }
    }

  .text{
    width: 320px;
    margin: 0 auto;
    .row{
      display: flex;

      .left{
        width: 40px;
        // border: 1px solid #efefef;
        box-sizing: border-box;
        i{
          margin-left: 5px;
          font-size: 15px;
          width: 28px;
          height: 28px;
          border: 1px solid #428dfa;
          border-radius: 50%;
          text-align: center;
          line-height: 28px;
          color: #428dfa;
          display: inline-block;
        }
      }
      .right{
        flex:1;
        padding: 0 8px;
        box-sizing: border-box;
        h4{
          line-height: 30px;
          font-size: 16px;
          color: #888888;
        }
        ul{
          color: #585858;
          font-size: 14px;
          display: flex;
          flex-wrap: wrap;
          margin-top: 12px;
          li{
            line-height: 24px;
            width: 50%;
            a{
              color: #585858
            }
            a:hover{
              color: #428DFA
            }
          }
        }
      }
    }
    .line{
      height: 1px;
      background-color: #EEEEEE;
      margin: 18px 0;
    }
  }
  }
    .dialog-footer>p {
    text-align: center;
    > button {
      height: 35px;
      width: 100px;
      padding: 0;
      border-radius: 3px;
      & + button {
        margin-left: 20px;
      }
      &.is-disabled {
        background: #cbcbcb !important;
        opacity: 1 !important;
      }
    }
  }
}
</style>
