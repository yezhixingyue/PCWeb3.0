<template>
  <section class="mp-mpzj-order-feedback-add-page-wrap">
    <section class="content">
      <header>
        <span v-if="!canEdit" style="margin-right:20px;cursor:pointer;" @click="handleReturn">
          <i class="el-icon-back"></i>
          <em class="is-font-13"> 返回列表</em>
        </span>
        <span class="is-bold is-black">申请服务详情</span>
        <!-- <span v-if="canEdit" class="is-font-12"> （ 该订单如有售后等问题需要反馈，请填写该页面信息并提交，工作人员会在查收到后第一时间进行处理 ）</span> -->
      </header>
      <div>
        <el-table stripe border
          :data="ServiceAfterSaleList" style="width: 100%" class="ft-14-table">
          <el-table-column prop="ID" label="商品名称" width="234" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Order.OrderID" label="文件内容" width="257" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="数量" width="229" show-overflow-tooltip>
            <span slot-scope="scope">{{ scope.row.Order.name }}</span>
          </el-table-column>
          <el-table-column label="尺寸" show-overflow-tooltip width="229">
            <template slot-scope="scope">{{ scope.row.Order.Funds.FinalPrice }}元</template>
          </el-table-column>
          <el-table-column label="工艺" show-overflow-tooltip width="190">
            <template slot-scope="scope">{{ scope.row.Order.Funds.FinalPrice }}元</template>
          </el-table-column>
        </el-table>

        <CustomSteps
            :stepsNumber='1'
            :stepList='[ { text: "提交申请", iconClass: "" },{ text: "系统处理中", iconClass: "" } ]'></CustomSteps>

        <div>
          <h4>售后信息</h4>
          <p class="reprint">
            补印：数量：4款/1000张
          </p>
          <h4>处理意见</h4>
          <p class="opinion">
            处理意见处理意见处理意见处理意见处理意见处理意见处理意见处理意见
          </p>
          <p class="opinion">
            处理意见处理意见处理意见处理意见处理意见处理意见处理意见处理意见
          </p>
          <div> <el-button style="height:30px;padding:0 10px; line-height:30px;border:1px solid red">aaa</el-button> </div>
          <table class="table" border="10px">
              <tr>
                  <td class="w300">1行1列的内容</td>
                  <td>1行2列的内容</td>
              </tr>
              <tr>
                  <td>2行1列的内容</td>
                  <td>2行2列的内容</td>
              </tr>
          </table>
        </div>

            <div class="btn-box">
              <!-- <div>
                <p class="is-bold">请注意：</p>
                <div class="is-font-12">
                  <p>1、数量问题请在配送人员送货时现场确认，已使用的产品无法处理数量问题的售后；</p>
                  <p>2、请在下单日起算一个月内申请售后，超出一个月的无法处理售后问题。</p>
                </div>
              </div> -->
              <el-button type="primary" @click="submitForm('ruleForm')" v-if='canEdit'>立即提交</el-button>
              <span class="blue-span is-font-12" style="margin: 0 60px 0 30px" @click="resetForm('ruleForm')" v-if='canEdit'>重置</span>
              <el-button  @click="handleReturn">
                <i class="el-icon-d-arrow-left is-font-15"></i>
                <em style="margin-left: 6px">返回</em>
              </el-button>
            </div>
      </div>
    </section>
  </section>
</template>

<script>
// import SingleSelector from '@/components/common/Selector/SingleSelector.vue';
import CustomSteps from '@/components/ServiceAfterSales/CustomSteps.vue';
import { imgUrl } from '@/assets/js/setup';
import { mapState } from 'vuex';
import { Message } from 'element-ui';

export default {
  components: {
    // SingleSelector,
    CustomSteps,
  },
  data() {
    return {
      fileList: [],
      canEdit: true,
      ruleForm: {
        ID: 0,
        Order: {
          OrderID: '', // 订单号
          Content: '', // 订单备注
        },
        QuestionList: [], // 售后原因
        Remark: '', // 问题描述
        AppealType: '', // 诉求意向
        Mobile: '', // 联系方式 - 手机号码
        QQ: '', // QQ号码
        PicList: [], // 上传图片列表
      },
      intentionAction: 0,
      rules: {
        QuestionList: [
          { required: true, message: '请选择售后原因', trigger: 'change' },
        ],
        Remark: [
          { required: true, message: '请输入具体问题描述', trigger: 'blur' },
          {
            min: 3, max: 600, message: '长度在 3 到 600 个字符', trigger: 'blur',
          },
        ],
        AppealType: [
          { required: true, message: '请选择诉求意向', trigger: 'change' },
        ],
        Mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' },
        ],
        QQ: [
          { required: true, message: '请输入QQ号码', trigger: 'blur' },
          { pattern: /(^[1-9]\d*$)/, message: 'QQ号码必须为数字值，且不能以0开头' },
          {
            min: 5, max: 11, message: '长度在 5 到 11 个字符', trigger: 'blur',
          },
        ],
      },
      dialogImageUrl: '',
      dialogVisible: false,
      baseUrl: imgUrl,

      ServiceAfterSaleList: [{
        ID: 1,
        Order: {
          OrderID: 2,
          name: 'aaa',
          Funds: {
            FinalPrice: 3,
          },
        },
      }],

      aaa: 0,
    };
  },
  computed: {
    ...mapState('common', ['customerInfo', 'AppealList']),
    ...mapState('summary', ['editFeedbackData', 'RejectReasonList']),
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const _list = this.$refs.upload.uploadFiles.map(it => {
            if (it.response && it.response.Status === 1000) return it.response.Data.Url; // 此处需额外处理编辑时的已有图片类型
            return '';
          }).filter(it => it);
          this.ruleForm.PicList = _list;
          this.ruleForm.QuestionList = this.ruleForm.QuestionList.map(ID => ({ ID }));
          const res = await this.api.getAfterSalesApply(this.ruleForm);
          if (res.data.Status === 1000) {
            this.messageBox.successSingle({
              title: '提交成功',
              successFunc: () => {
                this.$router.replace('/feedbackList');
              },
            });
          }
        }
      });
    },
    getStatusClass(status) {
      let str = '';
      switch (status) {
        case 0:
          str = 'is-black';
          break;
        case 1:
          str = 'is-cyan';
          break;
        case 2:
          str = 'is-success';
          break;
        case 3:
          str = 'is-pink';
          break;
        case 255:
          str = 'is-gray';
          break;
        default:
          break;
      }
      return str;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      if (this.customerInfo) {
        this.ruleForm.Mobile = this.customerInfo.Account.Mobile;
        this.ruleForm.QQ = this.customerInfo.QQ;
      }
    },
    // handleRemove(file, fileList) {
    //   console.log(file, fileList);
    //   console.log('handleRemove', this.fileList);
    // },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handllePictureUploaded(response) {
      if (response.Status !== 1000) {
        Message({
          showClose: true,
          message: response.Message,
          type: 'error',
        });
        // eslint-disable-next-line max-len
        this.$refs.upload.uploadFiles = this.$refs.upload.uploadFiles.filter(it => it.response && it.response.Status === 1000);
      }
    },
    handleReturn() {
      if (!this.canEdit) this.$store.commit('summary/setNeedFetchListData', false);
      else this.$store.commit('order/setShouldGetNewListData', false);
      this.$router.go(-1);
    },
    problemType(keys) {
      console.log(keys);
    },
  },
  async mounted() {
    console.log(this.RejectReasonList);
    const OrderID = this.$route.params.id;
    const Content = this.$route.params.desc;
    const { type } = this.$route.params;
    if (!OrderID || !Content || !type) return;
    if (type === 'detail') {
      this.canEdit = false;
      if (this.editFeedbackData) { // 仓库提前保存好的编辑数据
        let QuestionList = [];
        if (this.editFeedbackData.QuestionList.length > 0) {
          QuestionList = this.editFeedbackData.QuestionList.map(it => it.ID);
        }
        this.ruleForm = {
          ...this.ruleForm,
          ...JSON.parse(JSON.stringify(this.editFeedbackData)),
          QuestionList,
        };
        // console.log(this.editFeedbackData.QuestionList);
        this.fileList = this.editFeedbackData.PicList.map(path => ({ url: `${imgUrl}${path}` }));
        // this.$store.commit('summary/setEditFeedbackData', null);
      } else {
        this.$router.replace('/feedbackList');
        return;
      }
    } else if (type === 'add' && this.customerInfo) {
      this.ruleForm.Mobile = this.customerInfo.Account.Mobile;
      this.ruleForm.QQ = this.customerInfo.QQ;
    }
    this.ruleForm.Order.OrderID = OrderID;
    this.ruleForm.Order.Content = Content;
    this.$store.dispatch('summary/getRejectReasonList');
  },
};
</script>

<style lang='scss'>
.mp-mpzj-order-feedback-add-page-wrap {
  .table{
    border: 1px solid red;
    border-spacing: 0;
    .w300{
      width: 300px;
    }
    td{
      border: 1px solid red;
    }
  }
  width: 100%;
  margin-top: 25px;
  // background-color: #fff;
  min-height: calc(100vh - 115px - 22px);
  min-height: calc(100vh - 115px - 42px) \0;

  > .content {
    width: 1200px;
    margin: 0 auto;
    background-color: #fff;
    padding: 30px;
    box-sizing: border-box;
    margin-bottom: 80px;
    > header {
      // padding-top: 25px;
      border-bottom: 1px dashed #EEEEEE;
      padding-bottom: 15px;
      margin-bottom: 15px;
      // padding-left: 10px;
    }
    > div {
      width: 100%;
      // margin-left: 80px;
      > .el-form{
        margin-top: 22px;
      }
      > .line{
        border-bottom: 1px dashed #EEEEEE;
        margin-top: -16px;
        margin-bottom: 30px;
      }
      .el-textarea__inner {
        min-height: 88px !important;
      }
      .el-form-item__label:before {
        color: #FEB829 !important;
      }
      // 诉求意向
      .intention{
        display: flex;
        height: 40px;
        align-items: center;
        span:hover{
          cursor:pointer;
          color: #428DFA;
          background-color: #EBF0FE;
          border-color: #428dfa;
        }
        >.action{
          border-color: #428dfa;
          background-color: #428dfa;
          color: #fff;
          &:hover{
          border-color: #428dfa;
          background-color: #428dfa;
          color: #fff;
        }
        }
        span{
          width: 140px;
          line-height: 40px;
          border-radius: 5px;
          height: 40px;
          text-align: center;
          border: 1px solid #efefef;
          margin-right: 20px;
          color: #888888;
        }
      }
      // 补印
      .make-up-for{
        display: flex;
        color: #888888;
        .item{
          display: flex;
          margin-right: 120px;
          align-items: center;
          >span{
            font-size: 12px;
            margin-left: 20px;
            color: #aaa;
            >span{
              color: #FF3769;
            }
          }
          .el-input-number{
            width: 80px;
            text-align: center;
            margin-right: 10px;
          }
        }
      }
      // 问题类型
      .check-button{
        display: flex;
        flex-wrap: wrap;
        .action{
          background-color: #428dfa;
          border-color: #428dfa;
          color: #fff;
          &:hover{
            border-color: #428dfa;
            background-color: #428dfa;
            color: #fff;
          }
        }
        li{
          width: 100px;
          height: 30px;
          border-radius: 5px;
          line-height: 30px;
          border: 1px solid #E6E6E6;
          margin: 0px 30px 30px 0;
          text-align: center;
          color: #888888;
        }
        li:hover{
          cursor:pointer;
          color: #428DFA;
          border-color: #428dfa;
          background-color: #EBF0FE;
        }
      }
      // 联系人
      .linkman{
        display: flex;
        flex-wrap: wrap;
        .el-input{
          width: 200px;
          margin-right: 140px;
        }
      }
      .mp-select {
        .el-form-item__content {
          // height: 40px;
          > .mp-pc-common-comps-select-comp-wrap {
            width: 260px;
            display: block;
            > header {
              display: none;
            }
            > .el-select {
              width: 260px;
              height: auto;
              .el-input__inner {
                width: 260px;
                height: 40px;
              }
              .el-input__suffix .el-input__icon::before {
                top: 11px;
              }
            }
          }
          // .el-form-item__error {
          //   padding-top: 0;
          // }
        }
      }
      .btn-box {
        padding-bottom: 60px;
        margin-top: 20px;
        line-height: 41px;
        display: flex;
        justify-content: center;
        > div {
          padding-bottom: 86px;
          padding-top: 20px;
          p {
            line-height: 24px;
          }
        }
        > button {
          width: 120px;
          & + button {
            margin-left: 20px;
          }
        }
      }
      .text {
        padding-left: 13px;
        // color: #888;
        font-size: 13px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        // font-weight: 700;
      }
      .el-upload-list__item-thumbnail {
        object-fit: cover;
      }
      // .upload-Remark {
      //   // line-height: 34px;
      //   // padding-bottom: 10px;
      // }
      .el-upload-dragger {
        width: 100%;
        height: 100%;
        border: none;
      }
      .el-form-item__label {
        font-weight: 700;
      }
      .is-disabled + .el-upload {
        display: none;
      }
      .mp-feedback-progress-box {
        padding: 20px 0;
        margin-top: 35px;
        border-radius: 4px;
        border: 1px solid #eee;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.08), 0 2px 6px 0 rgba(0, 0, 0, 0.08);
        background-color: rgb(253, 253, 253);
      }
      .el-form-item__content {
        > .el-dialog__wrapper {
          .el-dialog__header {
            padding: 10px 20px;
            // height: 30px;
            .el-dialog__title {
              font-size: 17px;
            }
          }
          .el-dialog__body {
            padding-top: 10px;
            padding-bottom: 20px;
          }
        }
      }
    }
  }
}
</style>
