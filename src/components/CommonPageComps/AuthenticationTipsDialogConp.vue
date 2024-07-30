<template>
  <CommonDialogComp
    :visible.sync="dialogVisible"
    class="mp-authentication-tips-dialog"
    width="606px"
    top="30vh">
    <div class="tips-content" :class="`authentication${this.customerInfo.AuthStatus}`">
      <div class="text-area">
        <h2>
          <template v-if="!this.customerInfo.AuthStatus"> <!-- 并且未认证 -->
            未认证提醒
          </template>
          <template v-if="this.customerInfo.AuthStatus === 1"> <!-- 并且认证中 -->
            认证审核中
          </template>
          <template v-if="this.customerInfo.AuthStatus === 3"> <!-- 并且未通过 -->
            认证失败
          </template>
        </h2>
        <p>
          <template v-if="!this.customerInfo.AuthStatus"> <!-- 并且未认证 -->
            为维护广告图文印刷行业从业者的合法权益和社会公共利益，加强文件合法管理，请提供“营业执照”“电商经营证明”等有效证件进行账户认证，如未认证将影响正常报价及下单。(注：认证信息仅用于存档适用）
          </template>
          <template v-if="this.customerInfo.AuthStatus === 1"> <!-- 并且认证中 -->
            您的账号认证信息正在审核中，请耐心等待...
          </template>
          <template v-if="this.customerInfo.AuthStatus === 3"> <!-- 并且未通过 -->
            您提供的认证信息不规范已驳回，请修改并重新提交
          </template>
        </p>
        <p class="is-pink" style="text-align: center; font-size: 18px; font-weight: 700; padding: 0;">
          认证通过后，将赠送一套超值优惠券包，更多认证福利等你开启！
        </p>
      </div>
      <footer v-if="!this.customerInfo.Account.IsBranch">
        <el-button :class="`authentication${this.customerInfo.AuthStatus}`" type="primary" @click="toAuthentication">
          <template v-if="!this.customerInfo.AuthStatus"> <!-- 并且未认证 -->
            去认证
          </template>
          <template v-if="this.customerInfo.AuthStatus === 1"> <!-- 并且认证中 -->
            去查看
          </template>
          <template v-if="this.customerInfo.AuthStatus === 3"> <!-- 并且未通过 -->
            去修改
          </template>
          >>
        </el-button>
      </footer>
    </div>
  </CommonDialogComp>
</template>

<script>
import { mapState } from 'vuex';
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
    ...mapState('common', ['customerInfo', 'isNextYear']),
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$store.commit('common/setTipVisible', val);
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
.mp-authentication-tips-dialog {
  z-index: 999;
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
        background-image: url(../../assets/images/tip-bg/web未认证提醒.png);
        background-repeat: no-repeat;
        background-size: contain;
        background-position: 4px 0;
        height: 317px;
        position: relative;
        box-sizing: border-box;
        // 并且未认证
        &.authentication0{
          background-image: url(../../assets/images/tip-bg/web未认证提醒.png);
        }
        // 并且认证中
        &.authentication1{
          background-image: url(../../assets/images/tip-bg/web审核中提醒.png);
        }
        // 并且未通过
        &.authentication3{
          background-image: url(../../assets/images/tip-bg/web认证失败提醒.png);
        }
        > div.text-area {
          color: #444;
          height: calc(100% - 63px);
          > h2 {
            font-size: 29px;
            font-weight: 700;
            letter-spacing: 1.5px;
            line-height: 60px;
            // text-indent: 218px;
            text-align: center;
            padding-top: 5px;
            // 并且未认证
            &.authentication0{
              color: #444444;
            }
            // 并且认证中
            &.authentication1{
              color: #3874F6;
            }
            // 并且未通过
            &.authentication3{
              color: #FF0000;
            }
          }
          > p {
            margin-top: 25px;
            font-size: 16px;
            letter-spacing: 0.5px;
            padding: 0 33px ;
            line-height: 1.5em;
            text-indent: 2em;
            text-align: justify;
          }
        }
        > footer {
          // padding-top: 40px;
          // padding-left: 210px;
          text-align: center;
          > button {
            font-size: 18px;
            width: 135px;
            height: 43px;
            letter-spacing: 2px;
            // 并且未认证
            &.authentication0{
              background-color: #00194E;
              border: 1px solid #00194E;
              &:hover{
                background-color: #003097;
                border: 1px solid #003097;
              }
              &:active{
                background-color: #1962FF;
                border: 1px solid #1962FF;
              }
            }
            // 并且认证中
            &.authentication1{
              background-color: #3874F6;
              border: 1px solid #3874F6;
              &:hover{
                background-color: #709DFF;
                border: 1px solid #709DFF;
              }
              &:active{
                background-color: #0043D4;
                border: 1px solid #0043D4;
              }
            }
            // 并且未通过
            &.authentication3{
              background-color: #FF0000;
              border: 1px solid #FF0000;
              &:hover{
                background-color: #FF7E7E;
                border: 1px solid #FF7E7E;
              }
              &:active{
                background-color: #CF0000;
                border: 1px solid #CF0000;
              }
            }
          }
        }
      }
    }
  }
}
</style>
