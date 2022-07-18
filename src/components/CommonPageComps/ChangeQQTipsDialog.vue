<template>
  <CommonDialogComp
    :visible.sync="dialogVisible"
    class="mp-pc-change-qq-tips-dialog-comp-wrap"
    width="510px">
    <div class="tips-content">
      <i class="el-icon-circle-close icon" @click="dialogVisible=false"></i>
      <div class="text-area">
        <h2>名片之家服务升级</h2>
        <p>
          <span class="gray">添加全国统一业务</span>
          <a rel="nofollow" target="_blank" href="tencent://message/?uin=800051518&amp;Site=名片之家&amp;Menu=yes" class='is-blue'>
            <span>QQ：</span>
            <span>800051518</span>
          </a>
        </p>
      </div>
      <footer>
        <a rel="nofollow" target="_blank" href="tencent://message/?uin=800051518&amp;Site=名片之家&amp;Menu=yes">
            <el-button type="primary">立即体验</el-button>
        </a>
      </footer>
    </div>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '../../packages/CommonDialogComp';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CommonDialogComp,
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
  },
};
</script>
<style lang='scss'>
.mp-pc-change-qq-tips-dialog-comp-wrap {
  > .el-dialog {
    background: rgba($color: #000000, $alpha: 0);
    box-shadow: none;
    padding: 0;
    .el-dialog__header, .el-dialog__footer {
      display: none;
    }
    .el-dialog__body {
      padding: 0;
      background: rgba($color: #000000, $alpha: 0);
      .tips-content {
        background: url(../../assets/images/change-qq-tip.png) no-repeat;
        height: 492px;
        position: relative;
        left: 20px;
        padding-top: 316px;
        padding-left: 48px;
        box-sizing: border-box;
        > i.icon {
          font-size: 32px;
          position: absolute;
          right: 0;
          top: 0;
          color: #ddd;
          font-weight: 100;
          cursor: pointer;
          transition: color 0.05s ease-in-out;
          &:hover {
            color: #fff;
          }
        }
        > div.text-area {
          > h2 {
            color: #444;
            font-size: 22px;
            font-weight: 700;
            letter-spacing: 1.5px;
          }
          > p {
            margin-top: 24px;
            font-weight: 700;
            font-size: 15px;
            letter-spacing: 0.5px;
            > span {
              margin-right: 15px;
            }
          }
        }
        > footer {
          padding-top: 40px;
          padding-left: 70px;
          > a > button {
            font-size: 18px;
            width: 225px;
            letter-spacing: 2px;
          }
        }
      }
    }
  }
}
</style>
