<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { useCookie } from '@/assets/js/setup';
import { generateGetKeySrc } from '@/packages/ConsigneeAddressSetpComp/AMapLoader';

export default {
  computed: {
    ...mapState('common', ['customerInfo']),
  },
  methods: {
    async handleStorageChange(e) {
      if (e.key !== 'token' || useCookie) return;
      if (!e.newValue) {
        if (this.$route.name !== 'login') {
          sessionStorage.removeItem('token');
          this.$router.push('/login');
        }
      } else if (e.newValue) {
        if (!this.customerInfo) return;
        sessionStorage.removeItem('customerInfo');
        sessionStorage.removeItem('token');
        const res = await this.$store.dispatch('common/getCustomerDetail', true);
        // eslint-disable-next-line no-restricted-globals
        if (res) location.reload();
        else this.$router.push('/login');
      }
    },
  },
  created() {
    generateGetKeySrc();
  },
  mounted() {
    if (document.attachEvent) {
      document.attachEvent('onstorage', this.handleStorageChange);
    } else {
      window.addEventListener('storage', this.handleStorageChange);
    }
    if (document.body && 'order' in document.body.style) {
      this.$store.commit('common/setCanUseflex', true);
    }
  },
};
</script>

<style lang="scss">
#app {
  font-family:MicrosoftYaHei,'微软雅黑' , Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // scroll-behavior: smooth;
}

// #nav {
//   padding: 30px;

//   a {
//     font-weight: bold;
//     color: #2c3e50;

//     &.router-link-exact-active {
//       color: #42b983;
//     }
//   }
// }
</style>
