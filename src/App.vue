<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view/>
  </div>
</template>

<script>
// import { throttle } from '@/assets/js/utils/throttle';
import { mapState } from 'vuex';
import { useCookie } from '@/assets/js/setup';

export default {
  // methods: {
  //   handleScroll(oEl) {
  //     if (!oEl) return;
  //     const { scrollTop, scrollHeight, offsetHeight } = oEl;
  //     // console.log(scrollTop, scrollHeight, offsetHeight);
  //   },
  // },
  // mounted() {
  //   const oApp = document.getElementById('app');
  //   // const _func = throttle(this.handleScroll, 30);
  //   if (oApp) {
  //     window.addEventListener('scroll', () => this.handleScroll(oApp));
  //     window.onscroll = () => // console.log(123);
  //   }
  // },
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
  mounted() {
    if (document.attachEvent) {
      document.attachEvent('onstorage', this.handleStorageChange);
    } else {
      window.addEventListener('storage', this.handleStorageChange);
    }
  },
};
</script>

<style lang="scss">
#app {
  font-family:MicrosoftYaHei,'微软雅黑' , Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
