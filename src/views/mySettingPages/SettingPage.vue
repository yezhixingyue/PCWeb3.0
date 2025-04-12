<template>
  <article class="mp-pc-my-setting-pages-my-setup-page-wrap">
    <section class="order-setup">
      <header>
        <span class="blue-v-line is-bold is-black">其他设置</span>
      </header>
      <div class="content">
        <div class="set-item">
          <el-checkbox v-model="isAcceptNotify">接收订单未支付提醒</el-checkbox>
          <p>
            选中此项后，如果截至当日晚上9点，仍有超过半个小时未付款的订单，系统将通过短信的方式通知您
          </p>
        </div>
        <div class="set-item">
          <el-checkbox v-model="keepDataChecked">保留下单面板数据</el-checkbox>
          <p>如果选中保留订单参数，则在每次成功“加入购物车”或“直接下单”后，下单面板数据不清空，保留已选择和已填写的数据</p>
        </div>
        <div class="set-item">
          <el-checkbox v-model="localAutoCheckedPayInFull">自动选中支付全款</el-checkbox>
          <p>如选中此项，则自动勾选支付全款选项，反之则自动不勾选</p>
        </div>
      </div>
    </section>
  </article>
</template>

<script>
import { mapState } from 'vuex';
import LocalCatchHandler from '@/assets/js/LocalCatchHandler';

export default {
  components: {
  },
  data() {
    return {
      visible: false,
    };
  },
  computed: {
    ...mapState('common', ['customerInfo', 'keepOrderData', 'AutoCheckedPayInFull']),
    isAcceptNotify: {
      get() {
        if (this.customerInfo && this.customerInfo.Config.IsAcceptNotify) return true;
        return false;
      },
      async set(bool) {
        const data = {
          IsAcceptNotify: bool,
        };
        let key = true;
        const resp = await this.api.getCustomConfigSave(data).catch(() => { key = false; });
        if (key && resp && resp.data.Status === 1000) {
          this.$store.commit('common/setCustomerAcceptNotify', bool);
        }
      },
    },
    keepDataChecked: {
      get() {
        return this.keepOrderData;
      },
      set(newVal) {
        if (!this.customerInfo?.Account?.AccountID) return;
        LocalCatchHandler.setFieldFromLocalStorage(this.customerInfo?.Account?.AccountID, 'keepOrderData', newVal);
        this.$store.commit('common/setKeepOrderData', newVal);
      },
    },
    localAutoCheckedPayInFull: {
      get() {
        return this.AutoCheckedPayInFull;
      },
      set(newVal) {
        if (!this.customerInfo?.Account?.AccountID) return;
        LocalCatchHandler.setFieldFromLocalStorage(this.customerInfo?.Account?.AccountID, 'AutoCheckedPayInFull', newVal);
        this.$store.commit('common/setAutoCheckedPayInFull', newVal);
      },
    },
  },
};
</script>

<style lang='scss'>
.mp-pc-my-setting-pages-my-setup-page-wrap {
  > section {
    > .content {
      padding-top: 25px;
      > .set-item {
        margin-bottom: 24px;
        > label {
          color: #333;
          .el-checkbox__label {
            color: #333;
          }
        }
        > p {
          font-size: 13px;
          color: #888;
          padding-top: 10px;
        }
      }
    }

    &.third-bind-setup {
      padding-top: 20px;
    }
  }
}
</style>
