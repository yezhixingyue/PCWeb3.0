<template>
  <section></section>
</template>

<script>
import { homeUrl, beanHelpID } from '../assets/js/setup';

export default {
  methods: {
    handlePathRedirect() {
      const type = this.$route.name;
      let url = '';
      switch (type) {
        case 'toPrintBeanHelp':
          url = `${homeUrl}help/${beanHelpID}.html`;
          break;

        default:
          break;
      }
      if (url) {
        window.location.href = url;
      } else {
        this.messageBox.failSingleError({ title: '跳转失败', msg: '未匹配到有效地址' });
      }
    },
  },
  mounted() {
    this.handlePathRedirect();
  },
};
</script>
<style lang='scss'>
</style>
