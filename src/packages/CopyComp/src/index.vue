<template>
<el-popover
  placement="top"
  popper-class='mp-place-order-copy-poper-box'
  trigger="manual"
  v-model="visible">
  <span>{{copySuccess ? '复制成功' : '复制失败，请手动复制'}}</span>
  <span class="blue-span mp-common-copy-comp-wrap" slot="reference" @click="handleCopyClick">
    <img src="@/assets/images/copy.png" alt="">
    {{title}}
  </span>
</el-popover>
</template>

<script>
export default {
  name: 'CopyComp',
  props: {
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '提取批量下单信息',
    },
  },
  computed: {
  },
  data() {
    return {
      visible: false,
      copySuccess: false,
    };
  },
  methods: {
    handleCopyClick() { // 复制
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(this.content).then(() => {
          this.copySuccess = true;
        }).catch(() => {
          this.copySuccess = false;
        }).finally(() => {
          this.visible = true;
          setTimeout(() => {
            this.visible = false;
          }, 1000);
        });
      } else {
        const textarea = document.createElement('textarea');
        textarea.style.position = 'fixed';
        textarea.style.top = 0;
        textarea.style.left = 0;
        textarea.style.border = 'none';
        textarea.style.outline = 'none';
        textarea.style.resize = 'none';
        textarea.style.background = 'transparent';
        textarea.style.color = 'transparent';

        textarea.value = this.content;
        document.body.appendChild(textarea);
        textarea.select();
        try {
          const msg = document.execCommand('copy') ? 'success' : 'fail';
          if (msg === 'success') this.copySuccess = true;
          else this.copySuccess = false;
        } catch (err) {
          this.copySuccess = false;
        }
        this.visible = true;
        document.body.removeChild(textarea);
        setTimeout(() => {
          this.visible = false;
        }, 1000);
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-common-copy-comp-wrap.blue-span {
  white-space: nowrap;
  img {
    vertical-align: -3px;
    margin-right: 2px;
  }
}
.mp-place-order-copy-poper-box {
  min-width: 70px;
  padding: 6px 12px;
  text-align: center;
  font-size: 12px;
}
</style>
