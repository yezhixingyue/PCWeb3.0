<template>
  <article class="mp-pc-my-setting-pages-my-setup-page-wrap">
    <section class="order-setup">
      <header>
        <span class="blue-v-line is-bold is-black">下单设置</span>
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
      </div>
    </section>

    <!-- <section class="third-bind-setup">
      <header>
        <span class="blue-v-line is-bold is-black">微信绑定</span>
      </header>
      <ul class="content">
        <li v-show="customerInfo">
          <span v-if="!wechatBindInfo" class="ft-13 gray">当前尚未绑定微信账号，绑定后可使用微信扫码登录</span>
          <span v-else class="ft-13">当前已绑定微信账号，微信昵称为：{{ wechatBindInfo.NickName }} <i class="is-gray ft-12">( 记录的为绑定时的微信昵称，可能和当前昵称不一致 )</i> </span>
          <span v-if="!wechatBindInfo" class="blue-span ml-10" @click="visible = true">绑定微信</span>
          <span v-else class="blue-span ml-10" @click="onUnbindClick">解绑</span>
        </li>
      </ul>
    </section> -->
    <WechatBindDialog v-if="!wechatBindInfo" :visible.sync="visible" />
  </article>
</template>

<script>
import { mapState } from 'vuex';
import WxCodeHandler from '@/assets/js/ClassType/WxCodeHandler';
import WechatBindDialog from '@/components/MySettingComps/WechatBindDialog.vue';

export default {
  components: {
    WechatBindDialog,
  },
  data() {
    return {
      visible: false,
    };
  },
  computed: {
    ...mapState('common', ['customerInfo', 'keepOrderData']),
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
        const str = localStorage.getItem('localCacheDataByMpzj');
        const obj = str ? JSON.parse(str) : {};
        const key = this.customerInfo?.Account?.AccountID;
        if (!key) return;
        if (!obj.keepOrderData) obj.keepOrderData = {};
        obj.keepOrderData[key] = newVal;
        localStorage.setItem('localCacheDataByMpzj', JSON.stringify(obj));
        this.$store.commit('common/setKeepOrderData', newVal);
      },
    },
    wechatBindInfo() {
      return WxCodeHandler.getWechatBindInfo(this.customerInfo);
    },
  },
  methods: {
    handleBindSuccess(bool, result) {
      const cb = () => {
        if (result.query) {
          this.$router.replace({ query: result.query });
        }
        if (bool) {
          this.$store.commit('common/handleThirdBind', { isBind: true, info: result.authData });
        }
      };

      if (bool) this.messageBox.successSingle({ title: '绑定成功', successFunc: cb, failFunc: cb });
      else cb();
    },
    handleUnBindSuccess(info) {
      const cb = () => {
        this.$store.commit('common/handleThirdBind', { isBind: false, info });
      };

      this.messageBox.successSingle({ title: '解绑成功', successFunc: cb, failFunc: cb });
    },
    onUnbindClick() {
      if (!this.wechatBindInfo) return;
      this.messageBox.warnCancelBox({
        title: '确定解除当前微信绑定吗 ?',
        msg: `微信昵称：[ ${this.wechatBindInfo.NickName} ]`,
        successFunc: () => {
          WxCodeHandler.setWxUnbind(this.handleUnBindSuccess);
        },
      });
    },
  },
  mounted() {
    WxCodeHandler.bindByWxCode(this.$route.query, this.handleBindSuccess); // 处理微信绑定
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
