<template>
  <el-dialog :visible.sync="localVisible" width="400px" custom-class="mp-refund-detail-dialog" v-dialogDrag
    :close-on-click-modal='false' :close-on-press-escape='false' destroy-on-close append-to-body>
    <section class="content" v-if="displayData">
      <header>
        <img :src="displayData.imgSrc" alt="">
        <h2>{{ displayData.title }}</h2>
      </header>

      <main>
        <table>
          <tbody>
            <!-- 余额 -->
            <tr v-if="displayData.RefundFundAmount">
              <td v-if="displayData._RefundFundTime" class="datetime">{{ displayData._RefundFundTime }}</td>
              <td>
                <span class="mr-4">已退余额</span>
                <span class="amount is-primary-blue">{{ displayData.RefundFundAmount }}</span>
                <span class="unit">元</span>
              </td>
            </tr>
            <!-- 印豆 -->
            <tr v-if="displayData.RefundPrintBeanNumber" class="bean">
              <td v-if="displayData._RefundPrintBeanTime" class="datetime">{{ displayData._RefundPrintBeanTime }}</td>
              <td>
                <span class="mr-4">已退印豆</span>
                <span class="amount is-primary-blue">{{ displayData.RefundPrintBeanNumber }}</span>
                <span class="unit">个</span>
              </td>
            </tr>

            <!-- 有时间现金 -->
            <tr v-if="displayData.RefundQRAmount && displayData._RefundQRTime">
              <td class="datetime">{{ displayData._RefundQRTime }}</td>
              <td>
                <span class="amount is-primary-blue">{{ displayData.RefundQRAmount }}</span>
                <span class="unit mr-5">元</span>
                <span>{{ displayData._RefundQRRemark }}</span>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 无时间现金 -->
        <div style="text-align: center;padding-bottom: 13px;" v-if="displayData.RefundQRAmount && !displayData._RefundQRTime">
          <span class="amount is-primary-blue">{{ displayData.RefundQRAmount }}</span>
          <span class="unit mr-5">元</span>
          <span>{{ displayData._RefundQRRemark }}</span>
        </div>
      </main>

      <footer>
        <p class="is-origin mb-7" v-if="!hiddenTips && displayData.tips">{{ displayData.tips }}</p>
        <el-button type="primary" @click="localVisible = false">确认</el-button>
      </footer>
    </section>
  </el-dialog>
</template>

<script>
const succesImg = require('./imgs/success.png');
const ingImg = require('./imgs/ing.png');
// const failImg = require('./imgs/fail.png');

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    RefundDetail: {
      type: Object,
      default: null,
    },
    hiddenTips: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    localVisible: {
      get() {
        return this.visible;
      },
      set(bool) {
        this.$emit('update:visible', bool);
      },
    },
    displayData() { // 封装好的用于显示的数据
      if (!this.RefundDetail) return null;

      const {
        RefundQRAmount, RefundFundAmount, RefundPrintBeanNumber, Status, Time, CancleTime,
      } = this.RefundDetail;

      const temp = {
        imgSrc: '',
        title: '',
        tips: '',
        // 现金组
        RefundQRAmount,
        _RefundQRTime: '',
        _RefundQRRemark: '',
        // 余额组
        RefundFundAmount,
        _RefundFundTime: `${CancleTime ? CancleTime.slice(0, 16).replace('T', ' ') : ''}`,
        // 印豆组
        RefundPrintBeanNumber,
        _RefundPrintBeanTime: `${CancleTime ? CancleTime.slice(0, 16).replace('T', ' ') : ''}`,
      };

      switch (Status) {
        // case 0:
        //   temp.title = '退款中';
        //   temp.imgSrc = ingImg;
        //   temp.tips = '请耐心等待，如有疑问请联系官方客服';

        //   temp._RefundQRRemark = '正在退回原支付账户中... ';

        //   break;

        // case 1:
        //   temp.title = '自动退款失败';
        //   temp.imgSrc = failImg;
        //   temp.tips = '如有疑问请联系官方客服';

        //   temp._RefundQRRemark = '自动退款失败，已转人工处理';
        //   break;

        case 2:
          temp.title = '退款成功';
          temp.imgSrc = succesImg;
          temp.tips = '请注意查收，如有疑问请联系官方客服';

          temp._RefundQRTime = `${Time ? Time.slice(0, 16).replace('T', ' ') : ''}`;

          temp._RefundQRRemark = '已退至原支付账户';
          break;

        case 3:
          temp.title = '处理完成';
          temp.imgSrc = succesImg;
          temp.tips = '如有疑问请联系官方客服';

          // temp._RefundQRTime = `${Time ? Time.slice(0, 16).replace('T', ' ') : ''}`;

          temp._RefundQRRemark = '自动退款失败，已由人工处理完成';
          break;

        default:
          temp.title = '退款中';
          temp.imgSrc = ingImg;
          temp.tips = '请耐心等待，如有疑问请联系官方客服';

          temp._RefundQRRemark = '正在退回原支付账户中... ';

          break;
      }

      if (!RefundQRAmount && !RefundFundAmount && !RefundPrintBeanNumber) {
        temp.tips = '';
      }

      return temp;
    },
  },
};
</script>
<style lang='scss'>
.mp-refund-detail-dialog {
  border-radius: 5px;

  >.el-dialog__header {
    padding: 0;

    .el-dialog__headerbtn {
      top: 10px;
      right: 15px;
    }
  }

  >.el-dialog__body {
    .content {
      display: block;

      >header {
        text-align: center;

        h2 {
          line-height: 40px;
          font-weight: 700;
          font-size: 20px;
          color: #444;
          display: inline;
        }

        img {
          vertical-align: -10px;
          margin-right: 5px;
        }
      }

      >main {
        min-height: 30px;
        padding-top: 21px;
        padding-bottom: 6px;
        font-size: 14px;
        color: #444;
        // text-align: center;
        // display: flex;
        // align-items: center;
        // justify-content: center;

        table {
          margin: 0 auto;
        }

        tr {
          font-size: 14px;
          color: #444;

          td {
            padding-bottom: 13px;
          }

          &.bean {
            td {
              padding-bottom: 24px;
            }
          }
        }

        .datetime {
          color: #888;
          padding-right: 10px;
        }

        .amount {
          font-weight: 700;
        }

        .unit {
          font-size: 12px;
          margin-left: 2px;
        }
      }

      >footer {
        text-align: center;

        button {
          width: 120px;
          height: 35px;
          margin: 0 20px;
          padding: 0;
        }
      }
    }
  }
}
</style>
