<template>
  <div class="wx-login-content">
    <i class="el-icon-close blue-span" @click="close" v-if="showClose"></i>
    <div id="login_container" v-show="!loading"></div>
    <div class="loading mt-100" v-show="loading">
      <i class="el-icon-loading ft-24"></i>
    </div>
  </div>
</template>

<script>

import ThirdCodeHandler, { ThirdTypeEnum } from '@/assets/js/ClassType/ThirdCodeHandler';

export default {
  props: {
    type: {
      type: String,
      default: 'login',
    },
    showClose: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
  },
  methods: {
    close() {
      this.$emit('close');
    },
  },
  async mounted() {
    ThirdCodeHandler.appendScriptLink();

    let state = `${this.type}${ThirdTypeEnum.wechat.ID}`;
    if (this.$route.fullPath.includes('?')) {
      const str = this.$route.fullPath.split('?')[1];
      if (str) {
        state += `?${str.replace(/&/g, '?')}`;
      }
    }

    this.loading = true;
    await ThirdCodeHandler.createWxLoginInstance(state);
    await ThirdCodeHandler.delay(100);
    this.loading = false;
  },
};
</script>

<style lang="scss">
.wx-login-content {
  border-radius: 5px;
  text-align: center;
  padding-top: 80px;

  > i.el-icon-close {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 24px;
  }

  #login_container {
    display: inline-block;
    margin: 0 auto;
  }
}
</style>
