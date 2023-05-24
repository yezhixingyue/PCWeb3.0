<template>
  <CommonDialogComp
    :visible.sync="dialogVisible"
    class="mp-authentication-tips-dialog-comp-wrap"
    width="606px"
    top="30vh">
    <div class="tips-content">
      <i class="el-icon-close icon" @click="dialogVisible=false"></i>
      <div class="text-area">
        <h2>认证通知</h2>
        <p>
          为维护广告图文印刷行业从业者的合法权益和社会公共利益，加强文件合法性管理，客户需提供“营业执照、电商经营证明”等有效证件进行账户认证（注：认证信息仅用于存档使用）为避免影响您享受更多的福利政策和下单体验，请您及时认证。
        </p>
      </div>
      <footer>
        <el-button type="primary" @click="toAuthentication">去认证>></el-button>
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
  methods: {
    toAuthentication() {
      this.$router.push('/mySetting/authentication');
      this.dialogVisible = false;
    },
  },
};
</script>
<style lang='scss'>
.mp-authentication-tips-dialog-comp-wrap {
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
        background: url(../../assets/images/authentication.png) no-repeat;
        background-size: contain;
        height: 317px;
        position: relative;
        left: 20px;
        // padding-top: 316px;
        // padding-left: 48px;
        box-sizing: border-box;
        > i.icon {
          font-size: 20px;
          position: absolute;
          right: 70px;
          top: 50px;
          color: #ddd;
          color: #4694FF;
          font-weight: 100;
          cursor: pointer;
          transition: color 0.05s ease-in-out;
          &:hover {
            color: #fff;
          }
        }
        > div.text-area {
          color: #444;
          > h2 {
            font-size: 29px;
            font-weight: 700;
            letter-spacing: 1.5px;
            line-height: 55px;
            text-indent: 218px;
            padding-top: 5px;
          }
          > p {
            margin-top: 25px;
            font-size: 16px;
            letter-spacing: 0.5px;
            padding: 0 70px 0 24px ;
            line-height: 1.5em;
            text-indent: 2em;
          }
        }
        > footer {
          padding-top: 40px;
          padding-left: 210px;
          > button {
            font-size: 18px;
            width: 135px;
            height: 43px;
            letter-spacing: 2px;
          }
        }
      }
    }
  }
}
</style>
