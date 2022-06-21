<template>
  <section class="mp-invoice-apply-detail-status-comp-wrap" v-if="statusData">
    <header>
      <div class="l">
        <!-- <img src="" alt=""> -->
        <i class="iconfont ft-28 mr-16 icon-kaipiaozhong"></i>
        <span>申请单号：{{statusData.InvoiceID}}</span>
      </div>
      <div class="center">
        <el-button type="primary"
         @click="onThroughClick" v-if="statusData.InvoiceStatus===InvoiceStatusEnums.pendingCheck.ID&&showThroughBtn">发票资质通过</el-button>
        <span class="opinion"
         :class="{'is-pink': statusData.InvoiceStatus===InvoiceStatusEnums.rejected.ID}" v-if='statusData.TipsContent'>{{statusData.TipsContent}}</span>
        <template v-if="statusData.InvoiceStatus===InvoiceStatusEnums.haveToMail.ID">
          <!-- <img src="" alt=""> -->
          <i class="iconfont ft-28 mr-18 icon-yiyouji"></i>
          <span>配送企业：</span>
          <!-- 设置超出隐藏 -->
          <span class="e-name">{{statusData.ExpressCompany}}</span>
          <span>快递单号：</span>
          <!-- 设置超出隐藏 -->
          <span class="e-code">{{statusData.ExpressNumber}}</span>
          <CopyComp :content="statusData.ExpressNumber" title="复制单号" isButton />
        </template>
      </div>
      <div class="r">
        <svg height="30px" width="30px">
          <circle r="3px" cx="15px" cy='15px' :fill="statusData.Color"></circle>
        </svg>
        <span class="status">{{statusData.InvoiceStatusText}}</span>
      </div>
    </header>
    <div class="content">
      <CommonStepsComp :list="statusData.StepList" />
    </div>
  </section>
</template>

<script>
import CopyComp from '@/packages/CopyComp';
import CommonStepsComp from './CommonStepsComp.vue';
import { InvoiceStatusEnums, InvoiceTypeEnums } from '../enums';
import ApplyStatusClass from './ApplyStatusClass';

export default {
  props: {
    detailData: {
      type: Object,
      default: null,
    },
    showThroughBtn: {
      type: Boolean,
      default: false,
    },
    invoiceStatus: {

    },
  },
  components: {
    CopyComp,
    CommonStepsComp,
  },
  data() {
    return {
      statusData: null,
      InvoiceTypeEnums,
      InvoiceStatusEnums,
    };
  },
  methods: {
    onThroughClick() {
      this.$emit('through');
    },
    init() {
      this.statusData = new ApplyStatusClass(this.detailData);
    },
  },
  watch: {
    invoiceStatus: {
      handler(val) {
        if (typeof val !== 'number') return;
        this.init();
      },
      immediate: true,
    },
  },
};
</script>
<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-invoice-apply-detail-status-comp-wrap {
  width: 100%;
  margin-bottom: 32px;
  > header {
    height: 60px;
    padding: 15px 20px;
    box-sizing: border-box;
    background: #f5f5f5;
    position: relative;
    > div {
      height: 30px;
      line-height: 30px;
      vertical-align: top;
      display: inline-block;
      color: #585858;
      &.l {
        max-width: 205px;
        font-weight: 700;
        margin-right: 20px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &.center {
        width: 590px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 700;
        > .opinion {
          color: #f4a307;
          font-size: 12px;
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
          font-weight: 400;
        }
        > .e-name, > .e-code {
          display: inline-block;
          overflow: hidden;
          vertical-align: top;
          margin-right: 40px;
          max-width: 8em;
          text-overflow: ellipsis;
        }
        > .e-code {
          margin-right: 20px;
          max-width: 170px;
        }
        > span > button {
          width: 60px;
          height: 20px;
          padding: 0;
        }
        > .el-button {
          width: 110px;
          height: 26px;
          padding: 0;
          border-radius: 3px;
          font-size: 12px;
        }
      }
      &.r {
        width: 105px;
        text-align: right;
        position: absolute;
        right: 20px;
        top: 15px;
        white-space: nowrap;
        svg {
          vertical-align: top;
        }
        .status {
          font-weight: 700;
          margin-left: 10px;
          white-space: nowrap;
        }
      }
      i.iconfont {
        color: $--color-primary;
        font-weight: 400;
        vertical-align: middle;
      }
    }
  }
}
</style>
