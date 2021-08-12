<template>
  <section class="mp-mpzj-order-feedback-add-page-wrap">
    <section class="content">
      <header>
        <span v-if="!canEdit" style="margin-right:20px;cursor:pointer;" @click="handleReturn">
          <i class="el-icon-back"></i>
          <em class="is-font-13"> 返回列表</em>
        </span>
        <span class="blue-v-line is-bold is-black">{{ canEdit ? '售后申请' : '查看售后申请'}}</span>
        <span v-if="canEdit" class="is-font-12"> （ 如果该订单有售后等问题需要反馈，请填写该页面信息并提交，工作人员会在查收到后第一时间进行处理 ）</span>
      </header>
      <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="订单号：">
            <!-- <el-input v-model="ruleForm.OrderID" disabled></el-input> -->
            <p class="text">{{ruleForm.Order.OrderID}}</p>
          </el-form-item>
          <el-form-item label="文件内容：">
            <!-- <el-input v-model="content" disabled></el-input> -->
            <p class="text gray">{{ruleForm.Order.Content}}</p>
          </el-form-item>
          <el-form-item label="售后原因：" prop="QuestionList" class="mp-select">
            <SingleSelector
              v-model="ruleForm.QuestionList"
              :optionList='RejectReasonList'
              multiple
              :disabled='!canEdit'
              placeholder="请选择售后原因"
              :defaultProps="{ label: 'Title', value: 'ID', }"
            />
          </el-form-item>
          <el-form-item label="问题描述：" prop="Remark">
            <el-input type="textarea" v-model="ruleForm.Remark" :disabled='!canEdit'
             maxlength="600" show-word-limit placeholder="请输入具体问题描述"></el-input>
          </el-form-item>
          <el-form-item label="诉求意向：" prop="AppealType" class="mp-select">
            <SingleSelector
              :disabled='!canEdit'
              v-model="ruleForm.AppealType"
              :optionList='AppealList'
              placeholder="请选择诉求意向"
            />
          </el-form-item>
          <el-form-item label="上传凭证：">
            <el-upload
              :action="baseUrl + '/Api/Upload/Image?type=3'"
              list-type="picture-card"
              :file-list="fileList"
              ref="upload"
              drag
              :disabled='!canEdit'
              accept='.png,.jpeg,.jpg,.bmp'
              :multiple='true'
              :limit='4'
              :on-success='handllePictureUploaded'
              :on-preview="handlePictureCardPreview"
              >
              <!-- :on-success='handllePictureUploaded'
              :on-remove="handleRemove" -->
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" top="8vh" title="查看图片">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
            <p v-if="!canEdit && fileList.length === 0">未上传照片</p>
            <p class="is-font-12 gray upload-Remark">产品有问题的，请把有问题的成品一二十份呈扇形摊开拍照，并把有问题的部分单独拍照；最多上传4张照片</p>
          </el-form-item>
          <el-form-item label="联系方式：" prop="Mobile">
            <el-input v-model="ruleForm.Mobile" maxlength="11" :disabled='!canEdit'
              show-word-limit placeholder="请输入手机号码"></el-input>
          </el-form-item>
          <el-form-item label="QQ号码：" prop="QQ">
            <el-input v-model="ruleForm.QQ" maxlength="11" :disabled='!canEdit'
              show-word-limit placeholder="请输入QQ号码"></el-input>
          </el-form-item>
          <el-form-item label="处理情况：" v-if="!canEdit" class="mp-feedback-progress-box">
            <p>
              <span style="margin-right:6px">处理进度：</span>
              <span  :class="getStatusClass(ruleForm.Status)">{{ruleForm.Status | formatFeedbackProgress}}</span>
            </p>
            <p v-if="(ruleForm.RejectReason && ruleForm.Status === 3) || ruleForm.Remark && ruleForm.Status === 2">
              <span style="margin-right:6px">{{ruleForm.Status === 3?'拒绝原因':'处理信息'}}：</span>
              <span :class="ruleForm.Status === 3?'is-pink':''" class="is-font-12"
               >{{ruleForm.Status === 3?ruleForm.RejectReason:ruleForm.Remark}}</span>
            </p>
          </el-form-item>
          <el-form-item>
            <div class="btn-box">
              <div>
                <p class="is-bold">请注意：</p>
                <div class="is-font-12">
                  <p>1、数量问题请在配送人员送货时现场确认，已使用的产品无法处理数量问题的售后；</p>
                  <p>2、请在下单日起算一个月内申请售后，超出一个月的无法处理售后问题。</p>
                </div>
              </div>
              <el-button type="primary" @click="submitForm('ruleForm')" v-if='canEdit'>立即提交</el-button>
              <el-button @click="resetForm('ruleForm')" v-if='canEdit'>重置</el-button>
              <el-button type="primary" @click="handleReturn" v-if='!canEdit'>
                <i class="el-icon-d-arrow-left is-font-15"></i>
                <em style="margin-left: 6px">返回列表</em>
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </section>
  </section>
</template>

<script>
import SingleSelector from '@/components/common/Selector/SingleSelector.vue';
import { imgUrl } from '@/assets/js/setup';
import { mapState } from 'vuex';
import { Message } from 'element-ui';

export default {
  components: {
    SingleSelector,
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
      // if (this.customerInfo) {
      //   this.ruleForm.Mobile = this.customerInfo.Account.Mobile;
      //   this.ruleForm.QQ = this.customerInfo.QQ;
      // }
    },
    // handleRemove(file, fileList) {
    //   console.log(file, fileList);
    //   console.log('handleRemove', this.fileList);
    // },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handllePictureUploaded(response, file, fileList) {
      console.log('handllePictureUploaded', response, file, fileList);
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
      this.$store.commit('summary/setNeedFetchListData', false);
      this.$router.go(-1);
    },
  },
  async mounted() {
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
          ...this.editFeedbackData,
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
  width: 100%;
  margin-top: 25px;
  background-color: #fff;
  min-height: calc(100vh - 115px - 22px);
  min-height: calc(100vh - 115px - 42px) \0;
  > .content {
    width: 1200px;
    margin: 0 auto;
    > header {
      padding-top: 25px;
      padding-bottom: 40px;
      padding-left: 10px;
    }
    > div {
      width: 1000px;
      margin-left: 80px;
      .el-textarea__inner {
        min-height: 88px !important;
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
        padding-bottom: 150px;
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
