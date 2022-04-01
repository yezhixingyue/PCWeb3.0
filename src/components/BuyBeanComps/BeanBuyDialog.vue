<template>
  <CommonDialogComp
    width='700px'
    dangerText='立即付款'
    showDanger
    class="mp-pc-bean-buy-list-page-dialog-comp-wrap"
    :showSubmit='false'
    :visible.sync="visible"
    :disabled="loading"
    @danger="onSubmit"
    @cancle="onCancle"
    @open="onOpen">
    <!-- 弹窗图标 -->
    <template slot="title">
      <img src="@/assets/images/bean-y.png" alt="">
      <span>购买印豆</span>
    </template>
    <div v-if="curBuyItemData" class="content" v-loading='loading'>
      <!-- 信息 -->
      <p class="info">
        <label>每份数量：</label>
        <span>{{curBuyItemData.BeanNumber}}个</span>
        <label>单价：</label>
        <span>{{curBuyItemData.Price}}元</span>
      </p>
      <!-- 购买数量输入 -->
      <div class="num-box">
        <span>购买</span>
        <NumberInput v-model.number="buyNumber" :max='canBuyMaxCount' :min="1" />
        <i>份</i>
        <div class="price">
          <span>价格：</span>
          <span class="is-pink is-font-18" v-show="canBuyMaxCount >= buyNumber">{{totalPrice}}</span>
          <span class="is-pink" v-show="canBuyMaxCount >= buyNumber">元</span>
          <span class="is-pink" v-if="canBuyMaxCount < buyNumber">已超出最大购买份数</span>
        </div>
      </div>
      <div class="balance">
        <el-checkbox v-model="UseBalance" :disabled='UseBalanceDisabled'>使用余额支付</el-checkbox>
      </div>
      <!-- 提示 -->
      <p class="tips-box" v-if="canBuyMaxCount < Infinity">
        <i class="el-icon-warning"></i>
        <span>注： 今天还可购买{{canBuyMaxCount}}份</span>
      </p>
    </div>
    <template slot="foot-tip">
    </template>
  </CommonDialogComp>
</template>

<script>
import { mapState } from 'vuex';
import CommonDialogComp from '@/packages/CommonDialogComp';
import NumberInput from '../common/NumberInput.vue.vue';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    curBuyItemData: {
      type: Object,
      default: null,
    },
  },
  components: {
    CommonDialogComp,
    NumberInput,
  },
  data() {
    return {
      buyNumber: 1,
      UseBalance: false,
      loading: false,
    };
  },
  computed: {
    ...mapState('common', ['customerBalance']),
    canBuyMaxCount() { // 当日可用购买的最大数量
      if (this.curBuyItemData && typeof this.curBuyItemData.EverydayBuyMaxNumber === 'number') {
        return this.curBuyItemData.EverydayBuyMaxNumber;
      }
      return Infinity;
    },
    totalPrice() {
      if (!this.curBuyItemData) return 0;
      const num = +(this.buyNumber * this.curBuyItemData.Price);
      return +(num.toFixed(2));
    },
    UseBalanceDisabled() {
      return this.totalPrice > this.customerBalance;
    },
  },
  methods: {
    async onOpen() {
      this.buyNumber = 1;
      this.UseBalance = false;
      this.loading = true;
      await this.$store.dispatch('common/getCustomerFundBalance');
      this.loading = false;
    },
    checker() {
      if (this.buyNumber === '') {
        this.messageBox.failSingleError({ title: '购买失败', msg: '请输入购买份数' });
        return false;
      }
      if (!this.utils.getValueIsOrNotNumber(this.buyNumber, true)) {
        this.messageBox.failSingleError({ title: '购买失败', msg: '购买份数不正确，应为整数数字类型' });
        return false;
      }
      if (this.buyNumber <= 0) {
        this.messageBox.failSingleError({ title: '购买失败', msg: '购买份数不正确，最少购买1份' });
        return false;
      }
      if (this.buyNumber > this.canBuyMaxCount) {
        this.messageBox.failSingleError({ title: '购买失败', msg: `购买份数超出，最多还可购买 ${this.canBuyMaxCount} 份` });
        return false;
      }
      return true;
    },
    onSubmit() {
      if (!this.curBuyItemData) return;
      if (this.checker()) {
        const temp = {
          Number: this.buyNumber,
          ID: this.curBuyItemData.ID,
          UseBalance: this.UseBalanceDisabled ? false : this.UseBalance,
        };
        this.$emit('submit', temp);
      }
    },
    onCancle() {
      this.$emit('update:visible', false);
    },
  },
  watch: {
    UseBalanceDisabled(newVal, oldVal) {
      if (newVal && !oldVal && this.UseBalance) {
        this.UseBalance = false;
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-pc-bean-buy-list-page-dialog-comp-wrap {
  .el-dialog__header {
    img {
      vertical-align: -1px;
      margin-right: 6px;
    }
  }
  .el-dialog__body {
    > .content {
      text-align: center;
      color: #585858;
      padding-top: 15px;
      > p.info {
        > span {
          margin-right: 18px;
          &:last-of-type {
            margin-right: 0;
          }
        }
      }
      > div.num-box {
        padding: 45px 0;
        > .mp-pc-common-comps-number-input-comp-wrap {
          width: 150px;
          margin-left: 13px;
        }
        > i {
          color: #aaa;
          margin-left: 10px;
        }
        > .price {
          display: inline-block;
          margin-left: 16px;
          min-width: 120px;
        }
      }
      > p.tips-box {
        margin-top: 25px;
        text-align: left;
        margin-left: 30px;
        width: 600px;
      }
      .balance {
        margin-top: -13px;
        padding-bottom: 20px;
        .el-checkbox__label {
          font-size: 13px;
        }
      }
    }
  }
}
</style>
