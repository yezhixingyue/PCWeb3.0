<template>
  <section class="mp-batch-upload-page-header-comps-address-setup-comp-wrap">
    <div class="type" v-show="customer">
      <el-radio-group v-model="localUseSameAddress" size="small" :disabled='switchUseSameAddDisabled'
       :title="switchUseSameAddDisabled?'如需切换时，请先清空文件列表再进行切换':''">
        <el-radio-button :label="false">使用不同地址</el-radio-button>
        <el-radio-button :label="true">使用同一地址</el-radio-button>
      </el-radio-group>
      <span class="tips-box" v-show="switchUseSameAddDisabled">
        <i class="el-icon-warning"></i>下方解析成功的文件列表为空时，才可切换地址使用方式
      </span>
    </div>
    <ConsigneeAddressSetpComp
      v-if="customer"
      v-show='localUseSameAddress'
      ref="oConsigneeAddressSetpComp"
      isBatchUploadUse
      :watchClearVal="customer"
      :customerInfo="customer"
      :ExpressList="ExpressList"
      @changeAddressInfo="setAddressInfo4PlaceOrder"
      @validChange='handleValidChange'
      @popperVisible='handlePopperVisible'
    />
    <div v-show='!localUseSameAddress && customer' class="is-gray remark">
      <span class="f">注：使用不同地址时，每个需要解析的文件中都必须携带有 <i>平台单号</i> 或 <i>地址信息</i>（平台单号优先），否则将解析失败</span>
      <span>地址信息格式：【收货人+手机号+地址】 或 【地址+手机号+收货人】，如：张三19903970210河南省郑州市花园路国基路花园SOHO1号楼</span>
    </div>
  </section>
</template>

<script>
import ConsigneeAddressSetpComp from '@/packages/ConsigneeAddressSetpComp';
import { mapState } from 'vuex';

export default {
  props: {
    customer: {
      type: Object,
      default: null,
    },
    PayInFull: {
      type: Boolean,
      default: false,
    },
    UsePrintBean: {
      type: Boolean,
      default: false,
    },
    UseSameAddress: {
      type: Boolean,
      default: false,
    },
    switchUseSameAddDisabled: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ConsigneeAddressSetpComp,
  },
  computed: {
    ...mapState('common', ['ExpressList']),
    localUseSameAddress: {
      get() {
        return this.UseSameAddress;
      },
      set(val) {
        this.$emit('changeUseSameAddress', val);
      },
    },
  },
  methods: {
    setAddressInfo4PlaceOrder(data) {
      this.$emit('change', data);
    },
    handleValidChange(onlyAddChange) { // 触发有效地址改变事件（指会影响到运费计算的地址改变 1. 配送方式发生改变 2. 配送方式未改变但省市区发生改变 3. 注意避免省市区改变后影响到配送方式改变的重复事件触发）
      this.$emit('validAddChange', onlyAddChange);
    },
    handlePopperVisible(bool) {
      this.$emit('popperVisible', bool);
    },
  },
  mounted() {
    this.$store.dispatch('common/getExpressList');
  },
};
</script>
<style lang='scss'>
.mp-batch-upload-page-header-comps-address-setup-comp-wrap {
  font-size: 14px;
  .option {
    margin-top: -9px;
    label.title {
      width: 96px;
      margin-right: 2px;
      line-height: 25px;
      display: inline-block;
      text-align: right;
      color: #888;
    }
    label.el-checkbox {
      .el-checkbox__label {
        font-size: 12px;
      }
      margin-right: 24px;
    }
  }
  > .type {
    padding-top: 3px;
    > .el-radio-group {
      > label {
        .el-radio-button__inner {
          width: 120px;
          font-size: 13px;
          height: 32px;
          line-height: 30px;
          padding: 0;
        }
        &:first-of-type {
          .el-radio-button__inner {
            border-top-left-radius: 2px;
            border-bottom-left-radius: 2px;
          }
        }
        &:last-of-type {
          .el-radio-button__inner {
            border-top-right-radius: 2px;
            border-bottom-right-radius: 2px;
          }
        }
      }
      .el-radio-button__orig-radio:disabled + .el-radio-button__inner {
        background-color: #f8f8f8;
        border-color: #E4E7ED;
        color: #C0C4CC;
      }
      .el-radio-button__orig-radio:disabled:checked + .el-radio-button__inner {
        background-color: #93defc;
        color: #fff;
        border-color: #93defc;
      }
    }
    > span {
      margin-left: 20px;
      letter-spacing: 0.5px;
    }
    .tips-box {
      font-size: 12px;
    }
  }
  > .remark {
    margin-top: 11px;
    display: block;
    line-height: 26px;
    font-size: 12px;
    > span {
      display: block;
      text-indent: 2em;
      &.f {
        text-indent: 0;
        i {
          font-weight: 700;
        }
      }
    }
  }
}
</style>
