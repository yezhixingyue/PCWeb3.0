<template>
  <el-dialog
    :visible.sync="localVisible"
    width="710px"
    custom-class="mp-add-certificate-dialog-comp-wrap"
    v-dialogDrag
    @open="onOpen"
    top="calc(50vh - 240px)"
    :close-on-click-modal='false'
    :close-on-press-escape='false'
    :before-close='handleBeforeClose'
    @closed="onClosed"
    destroy-on-close
    append-to-body
  >
    <header slot="title">
      <span style="display: flex;align-items: center;">
        <img style="margin-right: 10px;" src="@/assets/images/add-certificateicon.png" alt="">
        {{ formAddCertificate.CertificateID ? '编辑' : '添加' }}证书
      </span>
    </header>
    <main>
      <el-form label-position="right" label-width="119px" :model="formAddCertificate">
        <el-form-item size="small" label="证书类型：">
          <el-select v-model="formAddCertificate.CertificateType" placeholder="请选择证书类型">
            <el-option
              v-for="item in CertificateType.filter(it => it.value !== '')"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="small" label="品牌名称：">
          <el-input style="width: 290px;" placeholder="请输入品牌名称"
            v-model="formAddCertificate.CertificateName"></el-input>
        </el-form-item>
        <el-form-item size="small" label="有效期至：">
          <el-date-picker
            v-model="formAddCertificate.Expire"
            type="date"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-ddTHH:mm:ss"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item size="small" label="证书上传：">
          <el-upload
            :action="baseUrl + '/Api/Upload/Image?type=10'"
            list-type="picture-card"
            ref="upload"
            drag
            accept='.png,.jpeg,.jpg,.gif'
            :multiple='true'
            :limit='3'
            :on-success='handllePictureUploaded'
            :on-error='handllePictureError'
            :http-request='Uploaded'
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :before-upload='beforeUpload'
            class="upload"
            :class="{'uploadDisabled':uploadDisabled}">
            +添加图片
          </el-upload>
          <el-image-viewer
            :on-close="() => showViewer = false"
            :showViewer.sync='showViewer'
            :PreviewSrc="PreviewSrc"
          />
        </el-form-item>
      </el-form>
      <div class="tip-txt">
        <p>注：证书信息仅供审核使用，最多上传3张图片，每张大小不超过10M，图片格式支持 jpg/jpeg/png/gif</p>
      </div>
    </main>
    <footer>
      <el-button type="primary" @click="onSubmit">保存</el-button>
      <el-button @click="localVisible = false">取消</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex';
import { imgUrl } from '@/assets/js/setup';
import { Message } from 'element-ui';
import ElImageViewer from '@/components/common/ImageViewer.vue';
// import { mapState } from 'vuex';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    editItem: {
      type: Object,
      default: () => null,
    },
  },
  components: {
    ElImageViewer,
  },
  computed: {
    ...mapState('common', ['CertificateType']),
    localVisible: {
      get() {
        return this.visible;
      },
      set(bool) {
        this.$emit('update:visible', bool);
      },
    },
  },
  data() {
    return {
      baseUrl: imgUrl,
      loading: false,
      formAddCertificate: {
        CertificateID: '',
        CertificateName: '',
        CertificatePics: [],
        CertificateType: '',
        Expire: '',
      },
      uploadDisabled: false,
      showViewer: false,
      PreviewSrc: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
    };
  },
  methods: {
    onOpen() {
      // 初始化证书数据
      if (this.editItem) {
        this.formAddCertificate = {
          CertificateID: this.editItem.CertificateID,
          CertificateName: this.editItem.CertificateName,
          CertificatePics: this.editItem.CertificatePics,
          CertificateType: this.editItem.CertificateType,
          Expire: this.editItem.Expire,
        };
        setTimeout(() => {
          this.$refs.upload.uploadFiles = this.editItem.CertificatePics.map((res, i) => ({
            response: {
              Status: 1000, Message: '返回成功', DataNumber: 1, VersionCode: 0, Data: { Url: res },
            },
            size: 0,
            status: 'success',
            uid: new Date().getTime() + i,
            url: `${imgUrl}${res}`,
          }));
          this.setUploadDisabled();
        }, 0);
      }
    },
    onClosed() {
      this.$refs.upload.uploadFiles = [];
      this.uploadDisabled = false;
      this.formAddCertificate = {
        CertificateID: '',
        CertificateName: '',
        CertificatePics: [],
        CertificateType: '',
        Expire: '',
      };
    },
    handleBeforeClose(done) {
      if (!this.loading) done();
    },
    onSubmit() {
      this.formAddCertificate.CertificatePics = this.$refs.upload.uploadFiles.map((res) => (res.response.Data.Url));
      if (this.formAddCertificate.CertificateType === '') {
        this.messageBox.failSingleError({ title: '保存失败', msg: '请选择证书类型' });
      } else if (!this.formAddCertificate.CertificateName) {
        this.messageBox.failSingleError({ title: '保存失败', msg: '请输入品牌名称' });
      } else if (!this.formAddCertificate.Expire) {
        this.messageBox.failSingleError({ title: '保存失败', msg: '请选择有效期' });
      } else if (!this.formAddCertificate.CertificatePics.length) {
        this.messageBox.failSingleError({ title: '保存失败', msg: '请上传证书' });
      } else {
        this.api.getCustomerCertificateSave(this.formAddCertificate).then(res => {
          if (res.data.Status === 1000) {
            this.$emit('succeed');
            this.localVisible = false;
          }
        });
      }
    },
    handleRemove() {
      this.setUploadDisabled();
    },
    setUploadDisabled() {
      const _list = this.$refs.upload?.uploadFiles?.map(it => {
        if (it.response && it.response.Status === 1000) return it.response.Data.Url; // 此处需额外处理编辑时的已有图片类型
        return '';
      }).filter(it => it);
      if (!_list || _list.length < 3) {
        this.uploadDisabled = false;
      } else {
        this.uploadDisabled = true;
      }
    },
    async Uploaded(data) {
      const res = await this.api.uploadImage(data.file, 10).catch(() => null);
      return res.data;
    },
    handllePictureUploaded(response) {
      if (response && response.Status !== 1000) {
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
    handllePictureError() {
      this.messageBox.warnSingleError({
        title: '上传失败',
        msg: '',
      });
    },
    beforeUpload(file) {
      const isLt15M = file.size / 1024 / 1024 < 10;
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
  },
};
</script>
<style lang='scss'>
  .mp-add-certificate-dialog-comp-wrap {
    display: table;
    border-radius: 5px;
    margin-bottom: 10px;
    > .el-dialog__header {
      padding: 0;
      > header {
        height: 18px;
        line-height: 20px;
        font-size: 16px;
        border-bottom: 1px solid #eee;
        padding: 15px 12px;
        margin: 0 15px;
      }
      > button {
        top: 15px;
        font-weight: 100;
      }
    }
    > .el-dialog__body {
      margin-left: 0px;
      margin-right: 0px;
      padding-bottom: 25px;
      margin-left: 15px\0;
      margin-right: 15px\0;
      padding-top: 20px;
      >main{
        .el-form{
          .el-select{
            width: 160px;
          }
          .el-date-picker{
            width: 200px;
          }
          .uploadDisabled{
            >.el-upload--picture-card{
              display:none
            }
          }
          .el-upload, .el-upload-dragger, .el-upload-list__item{
            width: 160px;
            height: 115px;
            color: #AEAEAE;
          }
          .el-upload{
            border: 0;
          }
          .upload{
            height: 115px;
            overflow: hidden;
            .el-upload-list__item-status-label{
              display: none;
            }
          }
          .el-upload-dragger{
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        .tip-txt{
          display: flex;
          justify-content: center;
          >p{
            color: #F4A307;
            background-color: #FFFBF6;
            line-height: 30px;
            font-size: 12px;
            padding: 0 16px;
            border-radius: 3px;
          }
        }
      }
      > footer {
        text-align: center;
        margin-top: 38px;
        // padding-right: 10px;
        button {
          height: 35px;
          width: 120px;
          line-height: 33px;
          padding: 0;
          // margin-left: 45px;
          & + button {
            margin-left: 45px;
          }
        }
      }
    }
  }
</style>
