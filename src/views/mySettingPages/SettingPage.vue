<template>
  <section class="mp-pc-my-setting-pages-my-setup-page-wrap">
    <header>
      <span class="blue-v-line is-bold is-black">我的设置</span>
    </header>
    <div class="content">
      <div class="set-item">
        <el-checkbox v-model="isAcceptNotify">接收订单未支付提醒</el-checkbox>
        <p>
          选中此项后，如果截至当日晚上9点，仍有超过半个小时未付款的订单，系统将通过短信的方式通知您
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('common', ['customerInfo']),
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
          // this.$message.success('设置成功');
          this.$store.commit('common/setCustomerAcceptNotify', bool);
        }
      },
    },
  },
  mounted() {
    // console.log('mounted');
  },
};
</script>

<style lang='scss'>
.mp-pc-my-setting-pages-my-setup-page-wrap {
  > .content {
    padding-top: 30px;
    > .set-item {
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
}
</style>
