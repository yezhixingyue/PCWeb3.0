<template>
  <el-dialog
    :visible.sync="localVisible"
    :title="dialogTitle"
    custom-class="set-craft-dia mp-place-order-panel-comp-craft-type-item-dialog-comp-wrap"
    v-dialogDrag
  >
    <header slot="title">
      <i class="iconfont icon-shezhi is-primary-blue"></i>
      <span>{{ dialogTitle }}</span>
    </header>
    <main>
      显示与设置区域
    </main>
    <footer>
      <el-button type="primary" @click="onSubmit">确定</el-button>
      <el-button @click="localVisible = false">取消</el-button>
    </footer>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    localVisible: {
      get() {
        return this.visible;
      },
      set(bool) {
        this.$emit('update:visible', bool);
      },
    },
    dialogTitle() {
      return '工艺参数设置';
    },
  },
  methods: {
    onSubmit() {
      console.log('onSubmit');
    },
  },
};
</script>
<style lang='scss'>
.el-dialog__wrapper {
  > .el-dialog.set-craft-dia.mp-place-order-panel-comp-craft-type-item-dialog-comp-wrap {
    width: unset;
    width: auto\0;
    min-width: 450px;
    display: table;
    border-radius: 5px;
    > .el-dialog__header {
      > header {
        height: 14px;
        line-height: 14px;
      }
    }
    > .el-dialog__body {
      margin-left: 30px;
      padding-bottom: 25px;
      margin-left: 15px\0;
      margin-right: 15px\0;
      > footer {
        text-align: center;
        margin-top: 58px;
        > button {
          height: 35px;
          width: 120px;
          line-height: 33px;
          padding: 0;
          & + button {
            margin-left: 45px;
          }
        }
      }
    }
  }
}
</style>
