<template>
  <section class="mp-pc-my-setting-authentication-page-wrap">
    <div class="basic-info">
      <span class="blue-v-line is-bold is-black">企业认证</span>
      <p><img src="@/assets/images/cancelWarning.png" alt="">您所提供的信息，仅限平台认证审核使用，名片之家将绝对保密。</p>
      <template v-if="isLoadding && customerInfo">
        <!-- 表单 -->
        <authenticationFrom
          v-if="showWayComponent"
          @againAuthentication="bool => (isEdit = bool)"
        />
        <!-- 详情 -->
        <authenticationInfo
          v-else
          :isEdit.sync="isEdit"
          @againAuthentication="bool => (isEdit = bool)"
        />
      </template>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import authenticationFrom from '@/components/AuthenticationComps/authenticationFrom.vue';
import authenticationInfo from '@/components/AuthenticationComps/authenticationInfo.vue';

export default {
  components: {
    authenticationFrom,
    authenticationInfo,
  },
  data() {
    return {
      isEdit: false,
      isLoadding: false,
    };
  },
  computed: {
    ...mapState('Authentication', ['authCompanyInfo']),
    ...mapState('common', ['customerInfo']),
    showWayComponent() {
      if (!this.authCompanyInfo || this.isEdit) return true;
      return false;
    },
  },
  methods: {
    ...mapActions('Authentication', ['getAuthCompanyInfo']),
    async AuthCompanyInit() {
      if (this.customerInfo) {
        if (this.customerInfo.Account.IsBranch) {
          this.$router.push('/placeOrder');
        } else {
          await this.getAuthCompanyInfo();
        }
      }
      this.isLoadding = true;
    },
  },
  watch: {
    customerInfo() {
      this.isLoadding = false;
      this.AuthCompanyInit();
    },
  },
  mounted() {
    this.isLoadding = false;
    this.AuthCompanyInit();
  },
};
</script>

<style lang='scss'>
.mp-pc-my-setting-authentication-page-wrap {
  > .basic-info {
    >p{
      background-color: #FFFBE6;
      border: 1px solid #FFE799;
      color: #F4A307;
      border-radius: 2px;
      line-height: 22px;
      padding: 4px 10px;
      display: flex;
      align-items: center;
      margin-top: 14px;
      img{
        width: 22px;
        height: 22px;
        margin-right: 7px;
      }
    }
  }
}
</style>
