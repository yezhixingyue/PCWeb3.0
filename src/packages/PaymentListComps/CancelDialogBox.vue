<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="420px"
    custom-class='mp-order-parment-order-cancel-dialog-box-containner'
    center
    v-if="value">
    <div class="display-content">
      <p class="title">
        <img src="@/assets/images/cancelWarning.png" alt="">
        <span>确定取消选中付款单吗 ？ </span>
      </p>
      <div>
        <p>付款单号： {{content}}</p>
        <el-checkbox v-model="checked">取消后加入购物车</el-checkbox>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmitClick">确定</el-button>
      <el-button @click="dialogVisible = false" class="cancel-btn">暂不取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Object,
      default: null,
    },
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
    checked: {
      get() {
        return this.value?.isAddPrepare || false;
      },
      set(isAddPrepare) {
        if (!this.value) return;
        this.$emit('input', { ...this.value, isAddPrepare });
      },
    },
    content() {
      if (!this.value) return '';
      if (typeof this.value.PayCode === 'number') {
        return this.value.PayCode;
      }
      if (Array.isArray(this.value.PayCode) && this.value.PayCode.length > 0) {
        if (this.value.PayCode.length === 1) return this.value.PayCode[0];
        return `共${this.value.PayCode.length}个付款单`;
      }
      return '';
    },
  },
  methods: {
    onSubmitClick() {
      this.$emit('submit', this.value);
      this.dialogVisible = false;
    },
  },
};
</script>
<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-order-parment-order-cancel-dialog-box-containner {
  border-radius: 5px;
  div.display-content {
    text-align: center;
    > .title {
      height: 32px;
      line-height: 32px;
      padding-bottom: 18px;
      img {
        vertical-align: middle;
        margin-right: 20px;
        position: relative;
        top: -2px;
      }
      span {
        color: #585858;
        font-size: 16px;
      }
    }
    > div {
      > p {
        color: #888;
        padding-bottom: 18px;
      }
      .el-checkbox__label {
        color: #888;
      }
    }
  }
  .el-dialog__footer {
    padding-top: 5px;
    padding-bottom: 25px;
    button {
      width: 100px;
      height: 36px;
      padding: 0;
      font-size: 14px;
      &.cancel-btn {
        border-color: $--color-primary;
        color: $--color-primary;
        margin-left: 24px;
        &:active {
          color: darken($color: $--color-primary, $amount: 15);
          border-color: darken($color: $--color-primary, $amount: 15);
        }
      }
    }
  }
}
</style>
