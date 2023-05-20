<template>
  <div class="authentication-from-page">
    <section>
      <div class="not-pass" v-if="authCompanyInfo && authCompanyInfo.Status === 3">
        <p class="cause">
          <span>未通过原因：</span>
          <span style="color:red"
            >{{authCompanyInfo.Remark}}</span
          >
        </p>
      </div>
      <el-form label-width="120px" label-position="top">
        <el-form-item label="企业全称：">
          <el-input v-model.trim="submitData.CompanyName"
            placeholder="请输入企业或店铺名称" />
        </el-form-item>
        <el-form-item label="证件号：">
          <el-input v-model.trim="submitData.CreditCode"
            placeholder="请输入统一社会信用代码或电商店铺编号" />
        </el-form-item>
        <el-form-item label="证件上传：" class="flex-box">
          <el-upload
            :action="baseUrl + '/Api/Upload/Image?type=1'"
            list-type="picture-card"
            ref="upload"
            drag
            accept='.png,.jpeg,.jpg,.bmp'
            :multiple='true'
            :limit='2'
            :on-success='handllePictureUploaded'
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :before-upload='beforeUpload'
            class="upload"
            :class="{'uploadDisabled':uploadDisabled}">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-image-viewer
             v-if="showViewer"
             :on-close="() => showViewer = false"
             :url-list="PreviewSrc"
          />

          <p>①请上传清晰彩色完整的原件照片，证件各项信息清晰可见容易识别。 <el-button type="text" @click="samplingDialog = true">正确示范</el-button></p>
          <p>②照片支持上传png、jpg、jpeg、bmg格式。</p>
          <p>③最多上传2张照片，单张照片大小不超过20M。</p>
          <el-dialog :visible.sync="samplingDialog" top="1vh" title="正确示范"
            width="1200px" custom-class="mp-sampling-dialog-comp-wrap">
            <p>
              <span class="img-sampling">
                <p>店铺营业执照示例图</p>
                <el-image
                  :src="require('@/assets/images/5392129ed11e5759cc5e0dfca34d664e.png')">
                </el-image>
              </span>
              <!-- <img src="@/assets/images/5392129ed11e5759cc5e0dfca34d664e.png" alt=""> -->
              <span class="img-sampling">
                <p>电商经营许可证示例图</p>
                <el-image
                  :src="require('@/assets/images/2cdb6ac4a0b5ac1703b64f7ee7773990.png')">
                </el-image>
              </span>
            </p>
            <!-- <img src="@/assets/images/2cdb6ac4a0b5ac1703b64f7ee7773990.png" alt=""> -->
            <span slot="footer" class="dialog-footer">
              <el-button @click="samplingDialog = false">关 闭</el-button>
            </span>
          </el-dialog>
        </el-form-item>
      </el-form>

      <div class="form-item">
        <div class="form-label"></div>
        <div class="form-conent statement">
          <el-checkbox
            shape="square"
            v-model.trim="submitData.ensure"
          ></el-checkbox
          ><span class="is-required">本人已知并同意 </span>
          <p type="text">此证件“仅用于名片之家平台公用认证信息”</p>
        </div>
      </div>
      <div class="form-item">
        <div class="form-conent submit" :class="{ 'is-edit': authCompanyInfo && authCompanyInfo.Status === 3 }">
          <el-button type="primary" @click="submit">提交认证</el-button>
          <el-button class="cancel" @click="cancel" v-if="authCompanyInfo && authCompanyInfo.Status === 3">取消</el-button>
        </div>
      </div>
    </section>

      <!-- <CommonDialogComp
        :visible.sync="disclaimerDialog"
        @cancle="disclaimerDialog = false"
        @closed='disclaimerDialog = false'
        title="权责声明"
        :showSubmit="false"
        submitText='确定'
        cancelText="关闭"
        :showCancel='true'
        @submit='disclaimerDialog = false'
        width='800px'>
        <p>
          迎您申请并使用郑州名片之家电子商务有限公司及其他合作运营主体（以下简称“名片之家”）提供的服务。
          为使用名片之家平台及服务，以及服务中包含的各种业务功能，您应当仔细阅读并遵守《名片之家用户协议》（以下简称“本协议”）以及《名片之家权责声明》。
          您在本平台上注册、登录、使用即视为您已充分阅读并完全自愿接受本用户服务协议的各项内容，包括名片之家对本协议随时所做的修订，并成为名片之家用户。
          如果您未满18周岁，请在法定监护人的陪同下阅读本协议及其他上述协议。迎您申请并使用郑州名片之家电子商务有限公司及其他合作运营
        </p>
      </CommonDialogComp> -->
  </div>
</template>

<script>
// import CommonDialogComp from '@/packages/CommonDialogComp';
import { mapState, mapActions } from 'vuex';
import api from '@/api';
import { imgUrl } from '@/assets/js/setup';
import { Message } from 'element-ui';
import ElImageViewer from 'element-ui/packages/image/src/image-viewer';

export default {
  components: {
    // CommonDialogComp,
    ElImageViewer,
  },
  data() {
    return {
      samplingDialog: false, // 正确示例
      baseUrl: imgUrl,
      actionSheetShow: false,
      disclaimerDialog: false, // 权责声明
      submitData: {
        CustomerID: '',
        CompanyName: '',
        CreditCode: '',
        CreditPath: [],
        ChangeWay: 2,
        ensure: false,
      },

      CompanyNameRules: [
        { strategy: 'isNotEmpty', errorMsg: '请输入企业全称' },
        { strategy: 'maxLength:60', errorMsg: '企业全称不能超过60个字' },
        { strategy: 'minLength:2', errorMsg: '企业全称不能少于2个字' },
      ],
      CreditCodeRules: [{ strategy: 'isNotEmpty', errorMsg: '请输入证件号' },
        { strategy: 'maxLength:30', errorMsg: '证件号不能超过30个字' }],

      showViewer: false,
      PreviewSrc: [],
      uploadDisabled: false,
    };
  },
  computed: {
    ...mapState('Authentication', ['authCompanyInfo']),
    ...mapState('common', ['customerInfo']),
    // uploadDisabled() {
    //   const a = this.$refs.upload?.uploadFiles.length || 1;
    //   console.log(a);
    //   if (a >= 2) {
    //     return true;
    //   }
    //   return false;
    // },
  },
  methods: {
    ...mapActions('Authentication', ['getAuthCompanyInfo']),
    handllePictureUploaded(response) {
      if (response.Status !== 1000) {
        Message({
          showClose: true,
          message: response.Message,
          type: 'error',
        });
        this.$refs.upload.uploadFiles = this.$refs.upload.uploadFiles.filter(it => it.status === 'success' && it.response && it.response.Status === 1000);
      }
      this.setUploadDisabled();
    },
    handlePictureCardPreview(file) {
      const tempList = this.$refs.upload.uploadFiles.map(it => it.url);
      const index = tempList.findIndex(it => it === file.url);
      this.PreviewSrc = [...tempList.slice(index), ...tempList.slice(0, index)];
      this.showViewer = true;
    },
    beforeUpload(file) {
      const isLt15M = file.size / 1024 / 1024 < 20;
      if (!isLt15M) {
        // 文件过大上传失败
        Message({
          showClose: true,
          message: '文件过大，上传失败',
          type: 'error',
        });
      }
      return isLt15M;
    },
    handleRemove() {
      this.setUploadDisabled();
    },
    setUploadDisabled() {
      const _list = this.$refs.upload?.uploadFiles?.map(it => {
        if (it.response && it.response.Status === 1000) return it.response.Data.Url; // 此处需额外处理编辑时的已有图片类型
        return '';
      }).filter(it => it);
      if (!_list || _list.length < 2) {
        this.uploadDisabled = false;
      } else {
        this.uploadDisabled = true;
      }
    },
    reportError(msg) {
      this.messageBox.warnSingleError({
        title: '保存失败',
        msg,
      });
    },
    checkValue() {
      const { CompanyName, CreditCode, ensure } = this.submitData;
      if (!this.validateCheck(CompanyName, this.CompanyNameRules, this.reportError)) return false; //
      if (!this.validateCheck(CreditCode, this.CreditCodeRules, this.reportError)) return false; //
      if (!this.$refs.upload.uploadFiles.map(res => res.url).filter(it => it).length) {
        this.reportError('请上传证件照');
        return false;
      }
      if (!ensure) {
        this.reportError('请阅读并同意《权责声明》');
        return false;
      }
      return true;
    },
    submit() {
      if (!this.checkValue()) return;
      this.submitData.CreditPath = this.$refs.upload.uploadFiles.map((res) => (res.response.Data.Url));
      api.authenticationApply(this.submitData).then(res => {
        if (res.data.Status === 1000) {
          const cb = () => {
            this.getAuthCompanyInfo();
            this.cancel();
          };
          this.messageBox.successSingle({
            title: '提交成功',
            msg: '已提交，我们会在第一时间进行审核',
            successFunc: cb,
            failFunc: cb,
          });
        }
      });
    },
    cancel() {
      this.$emit('againAuthentication', false);
    },
    // disclaimerClick() {
    //   this.disclaimerDialog = true;
    // },
    init() {
      this.submitData.CustomerID = this.customerInfo.CustomerID;
      this.submitData.CompanyName = this.authCompanyInfo?.CompanyName || '';
      this.submitData.CreditCode = this.authCompanyInfo?.CreditCode || '';
      this.submitData.CreditPath = this.authCompanyInfo?.CreditPath || [];
      if (
        this.authCompanyInfo && this.authCompanyInfo.CreditPath
        && this.authCompanyInfo.CreditPath.length
      ) {
        this.$refs.upload.uploadFiles = this.authCompanyInfo.CreditPath.map((res, i) => ({
          response: {
            Status: 1000, Message: '返回成功', DataNumber: 1, VersionCode: 0, Data: { Url: res },
          },
          size: 0,
          status: 'success',
          uid: new Date().getTime() + i,
          url: `${imgUrl}${res}`,
        }));
        this.setUploadDisabled();
      }
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss">
.authentication-from-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  .is-required {
    position: relative;
    margin-left: 0.5em;
    &::before {
      content: "*";
      color: #ff0000;
      position: absolute;
      left: -0.5em;
    }
  }
  .el-dialog {
    .el-dialog__body {
      line-height: 20px;
    }
  }
  > section {
    flex: 1;
    // padding: 0 34px;
    box-sizing: border-box;
    height: 100%;
    .not-pass {
      margin-top: 20px;
      .cause {
        display: flex;
        align-items: flex-start;
        span {
          min-width: 6em;
        }
      }
    }
    .el-form{
      .el-form-item{
        margin-top: 30px;
        position: relative;
        margin-left: 0.5em;
        .mp-sampling-dialog-comp-wrap{
          .el-dialog__body{
            padding: 0;
            p{
              display: flex;
              justify-content: space-around;
              margin: 10px;
            }
          }
          .el-dialog__footer{
            padding-top: 0;
          }
        }
        &.flex-box{
          display: flex;
          .el-form-item__label{
            min-width: 6em;
          }
        }
        .el-form-item__label{
          line-height: 18px;
          padding-bottom: 10px;
          &::before {
            content: "*";
            color: #ff0000;
            position: absolute;
            left: -0.5em;
          }
        }
        .el-form-item__content{
          line-height: 30px;
          >.el-input{
            width: 700px;
            height: 30px;
            input{
              height: 30px;
              line-height: 30px;
            }
          }
          >p{
            font-size: 12px;
            font-family: Microsoft YaHei UI-Regular, Microsoft YaHei UI;
            font-weight: 400;
            color: #B7B7B7;
            line-height: 24px;
            &:first-of-type{
              margin-top: 10px;
            }
          }
          .upload{
            overflow: hidden;
            height: 263px;
          }
          .uploadDisabled{
            >.el-upload--picture-card{
              display:none
            }
          }
          .el-upload{
            width: 373px;
            height: 231px;
            .el-upload-dragger{
              margin: 0 auto;
              margin-top: 30px;
              border: none;
            }
          }
          .el-upload-list{
            // background-color: red;
            .el-upload-list__item{
              margin-right: 70px;
              position: relative;
              width: 373px;
              height: 263px;
              margin-bottom: 0;
              .el-upload-list__item-status-label{
                display: none;
              }
              .el-upload-list__item-thumbnail{
                height: 231px;
              }
              .el-upload-list__item-actions{
                position: absolute;
                height: 30px;
                background-color: #E6F7FF;
                opacity: 1;
                top: 231px;
                display: flex;
                align-items: center;
                justify-content: center;
                >span + span{
                  position: relative;
                  &::before{
                    content: '';
                    position: absolute;
                    display: inline-block;
                    height: 11px;
                    width: 1px;
                    background-color: #93C2FC;
                    left: 0;
                    top: 8px;
                  }
                }
                >span{
                  display: inline-block;
                  font-size: 14px;
                  width: 50%;
                  margin: 0;
                }
                .el-upload-list__item-preview{
                  color: #428DFA;
                  &::after{
                    content: '查看';
                    margin-left: 2px;
                  }
                }
                .el-upload-list__item-delete{
                  color: #FF3769;
                  &::after{
                    content: '删除';
                    margin-left: 2px;
                  }
                }
              }
            }
            .el-upload-list__item+.el-upload-list__item{
              margin-right: 0;
            }
          }
        }
      }
    }
    .form-item {
      margin-bottom: 9px;
      .form-label {
        font-size: 14px;
        line-height: 20px;
      }
      .form-conent {
        margin-top: 4px;
        > .el-field {
          border: 1px solid #dcdfe6;
          border-radius: 2px;
          font-size: 12px;
          text-indent: 10px;
          padding: 3px;
        }
      }
      // .upload-img {
      //   .el-uploader {
      //     width: 307px;
      //     .el-uploader__upload,
      //     .el-uploader__preview {
      //       border: 1px dashed lightblue;
      //       border-radius: 2px;
      //       box-sizing: border-box;
      //       height: 192px;
      //       width: 100%;
      //       margin: 0;
      //     }
      //     .el-uploader__preview-image {
      //       width: 100%;
      //       height: 100%;
      //       margin: 0;
      //       .el-uploader__upload-icon {
      //         font-size: 43px;
      //         color: #81d3f8;
      //       }
      //     }
      //     .el-uploader__preview {
      //       margin-bottom: 20px;
      //       &.el-uploader__preview + .el-uploader__preview {
      //         margin: 0;
      //       }
      //     }
      //     .el-uploader__upload::after {
      //       content: "请上传证件照照片";
      //       color: #999999;
      //       margin-top: 20px;
      //     }
      //   }
      //   .el-uploader + .el-uploader {
      //     margin-top: 20px;
      //   }
      // }
      .statement {
        display: flex;
        align-items: center;
        .el-checkbox {
          margin-right: 8px;
        }
        > i {
          color: #428dfa;
        }
        p{
          margin-left: 10px;
          color: #428DFA;
        }
      }
      .submit {
        text-align: center;
        .el-button {
          width: 122px;
          height: 40px;
          margin-top: 27px;
          margin-bottom: 20px;
          padding: 0;
        }
        &.is-edit {
          .el-button {
            width: 110px;
          }
          .el-button + .el-button {
            margin-left: 80px;
          }
        }
        .cancel {
          background: none;
          border-color: #4694ff;
          color: #4694ff;
        }
      }
    }
  }

  .mp-sampling-dialog-comp-wrap{
    .el-dialog__header{
      position: relative;
      span{
        border-left: 3px solid #4694FF;
        line-height: 19px;
        padding-left: 12px;
      }
      &::after{
        content: '';
        width: calc(100% - 22px);
        height: 1px;
        background-color: #E5E5E5;
        position: absolute;
        display: inline-block;
        left: 11px;
        bottom: 0;
      }
    }
    .el-dialog__body{
      padding: 20px;
      padding-top: 0;
      text-align: center;
      p{
        margin-bottom: 10px;
        margin-top: 20px;
        font-size: 16px;
        color: #444444;
      }
      >.el-image{
        width: 535px;
        height: 285px;
      }
    }
    .el-dialog__footer{
      padding-top: 20px;
      text-align: center;
      .el-button{
        border-color: #428DFA;
        color: #428DFA;
        width: 130px;
      }
    }
  }
}
</style>
