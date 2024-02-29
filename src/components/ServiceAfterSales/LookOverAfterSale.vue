<template>
  <div class="look-over-after-sale">
    <span class="item">
      <img src="@/assets/images/service.png" alt="">
      <el-button  @click="visible=true" type="text">联系客服</el-button>
    </span>
    <span class="item">
      <i class="el-icon-warning-outline"></i>
      <a :href='`${homeUrl}help/54.html`' target="_blank">售后政策</a>
    </span>
    <el-dialog
      :visible.sync="visible"
      @cancle="visible = false"
      @open='onOpen'
      @closed='visible = false'
      submitText='确定'
      width='432px'
      >
      <div class="text">
        <div class="row">
          <div class="left">
            <i class="iconfont icon-dianhua1"></i>
          </div>
          <div class="right">
            <h4>联系电话</h4>
            <ul>
              <li>4006363006</li>
              <!-- <li>钱钱钱</li>
              <li>1111111111</li>
              <li>1111111111</li> -->
            </ul>
          </div>
        </div>
        <div class="line"></div>
        <div class="row">
          <div class="left">
            <i class="iconfont icon-QQ1"></i>
          </div>
          <div class="right">
            <h4>联系QQ</h4>
            <ul>
              <!-- <a :href="`tencent://message/?uin=${dataInfo.AfterSale.QQ}&Site=SuperNic&Menu=yes`" class="details" style="padding:0">
                {{dataInfo.AfterSale.QQ}}
              </a> -->
              <!-- <li><a :href="`tencent://message/?uin=${800065607}&amp;Site=名片之家&amp;Menu=yes`">800065607</a></li>
              <li><a :href="`tencent://message/?uin=${800131866}&amp;Site=名片之家&amp;Menu=yes`">800131866</a></li>
              <li><a :href="`tencent://message/?uin=${800131899}&amp;Site=名片之家&amp;Menu=yes`">800131899</a></li>
              <li><a :href="`tencent://message/?uin=${800131808}&amp;Site=名片之家&amp;Menu=yes`">800131808</a></li>
              <li><a :href="`tencent://message/?uin=${800050507}&amp;Site=名片之家&amp;Menu=yes`">800050507</a></li> -->
              <li><a :href="`tencent://message/?uin=${800051518}&amp;Site=名片之家&amp;Menu=yes`">800051518</a></li>
            </ul>
          </div>
        </div>
        <!-- <div class="row"></div> -->
      </div>
      <span slot="footer" class="dialog-footer">
        <p>
          <el-button type="primary" @click="visible = false" >确定</el-button>
        </p>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { homeUrl } from '@/assets/js/setup';

export default {
  data() {
    return {
      visible: false,
      homeUrl,
    };
  },
  methods: {
    onOpen() {},
  },
};
</script>

<style lang='scss'>
.look-over-after-sale{
  display: flex;
  .item{
    margin-left: 30px;
    display: flex;
    height: 30px;
    img{
      width: 26px;
      height: 26px;
      margin-top: 2px;
    }
    >i{
      font-size: 26px;
      border-radius: 50%;
      text-align: center;
      color: #428dfa;
      line-height: 30px;
    }
    .el-button{
      padding: 0;
      line-height: 30px;
      margin-left: 8px;
    }
    a{
      padding: 0;
      line-height: 30px;
      margin-left: 8px;
      color: #428DFA;
    }
    a:hover{
      color: rgba(66, 141, 255, 0.85);
    }
  }
  .dialog-footer>p {
    text-align: center;
    > button {
      height: 35px;
      width: 100px;
      padding: 0;
      border-radius: 3px;
      & + button {
        margin-left: 20px;
      }
      &.is-disabled {
        background: #cbcbcb !important;
        opacity: 1 !important;
      }
    }
  }

  .text{
    width: 320px;
    margin: 0 auto;
    .row{
      display: flex;

      .left{
        width: 40px;
        // border: 1px solid #efefef;
        box-sizing: border-box;
        i{
          margin-left: 5px;
          font-size: 15px;
          width: 28px;
          height: 28px;
          border: 1px solid #428dfa;
          border-radius: 50%;
          text-align: center;
          line-height: 28px;
          color: #428dfa;
          display: inline-block;
        }
      }
      .right{
        flex:1;
        padding: 0 8px;
        box-sizing: border-box;
        h4{
          line-height: 30px;
          font-size: 16px;
          color: #888888;
        }
        ul{
          color: #585858;
          font-size: 14px;
          display: flex;
          flex-wrap: wrap;
          margin-top: 12px;
          li{
            line-height: 38px;
            width: 50%;
            a{
              color: #585858
            }
            a:hover{
              color: #428DFA
            }
          }
        }
      }
    }
    .line{
      height: 1px;
      background-color: #EEEEEE;
      margin: 18px 0;
    }
  }
}
</style>
