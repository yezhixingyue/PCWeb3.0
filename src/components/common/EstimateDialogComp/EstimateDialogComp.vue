<template>
  <article class="mp-pc-service-after-sales-page-wrap">
    <section>
      <CommonDialogComp
        title="售后评价"
        :visible.sync="visible"
        @cancle="cancle"
        @open='onOpen'
        @closed='closed'
        submitText='确定'
        :showCancel='false'
        @submit='submit("rulesform")'
        width='800px'
        top="5vh"
        >
        <div slot="title" class="title">aaa</div>
        <el-form label-position="right" label-width="100px" ref="rulesform" :model="form" :rules="rules" class="estimate">
          <el-form-item label="服务评分：" prop="Score">
            <el-rate v-model="form.Score" show-text :texts="['非常差', '差', '一般', '好', '非常好',]"></el-rate>
          </el-form-item>
          <el-form-item label="服务结果：" prop="Result">
            <div class="result">
              <span :class="{'action': form.Result === 1}" @click="form.Result = 1">问题已解决</span>
              <span :class="{'action': form.Result === 2}" @click="form.Result = 2">问题未解决</span>
            </div>
          </el-form-item>
          <el-form-item label="服务标签：" prop="Label" style="margin:0">
            <CheckButton
              ref="CheckButton"
              @CheckChange="problemType"
              :checkList="checkList"
              LabelKey="Title"
              ValueKey="ID"
            ></CheckButton>
          </el-form-item>
          <el-form-item label="填写评价：" prop="EvaluateContent">
            <el-input
              style="width:590px"
              type="textarea"
              v-model="form.EvaluateContent"
              :rows="5"
              placeholder="请填写评价"
              maxlength="300"
              show-word-limit>
            </el-input>
          </el-form-item>
          <el-form-item label="评价晒图：" prop="EvaluatePicList">
            <div class="upload">
              <el-upload
                :action="baseUrl + '/Api/Upload/Image?type=3'"
                list-type="picture-card"
                ref="upload"
                drag
                accept='.png,.jpeg,.jpg,.bmp'
                :multiple='true'
                :limit='2'
                :before-upload='beforeUpload'
                :on-preview="handlePictureCardPreview"
                >
                <!-- :on-remove="handleRemove" -->
                <!-- :on-success='handllePictureUploaded' -->
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible" top="8vh" title="查看图片" append-to-body>
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
              <!-- <p v-if="!canEdit && fileList.length === 0">未上传照片</p> -->
              <p class="is-font-12 gray upload-Remark">最多可上传9张图片，每张图片打小不超过5M,支持bmp、gif、png、jpeg</p>
            </div>
          </el-form-item>
        </el-form>
      </CommonDialogComp>
    </section>
  </article>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';
import CheckButton from '@/components/common/CheckButton.vue';
import { imgUrl } from '@/assets/js/setup';

export default {
  components: {
    CommonDialogComp,
    CheckButton,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    AfterSaleCode: {
      type: Number,
    },
  },
  data() {
    const checkMoney = (rule, value, callback) => {
      if (value === 0) {
        callback(new Error('请评分'));
      }
    };
    return {
      baseUrl: imgUrl,
      dialogVisible: false,
      dialogImageUrl: '',
      checkList: [],
      form: {
        AfterSaleCode: 0,
        Score: null,
        Result: '',
        Label: [],
        EvaluateContent: '',
        EvaluatePicList: [],
      },
      rules: {
        Score: [
          { required: true, message: '请评分', trigger: 'change' },
          { validator: checkMoney, trigger: 'change' },
        ],
        Result: [
          { required: true, message: '请输入具体问题描述', trigger: 'change' },
        ],
        Label: [
          { required: true, message: '请输入具体问题描述', trigger: 'change' },
        ],
        EvaluateContent: [
          { required: true, message: '请输入评价', trigger: 'change' },
        ],
      },
    };
  },
  methods: {
    onOpen() {},
    problemType(keys) {
      this.form.Label = keys;
    },
    cancle() {
      this.closed();
    },
    closed() {
      this.$emit('closed');
      this.$refs.rulesform.resetFields();
      this.$refs.CheckButton.clearCheck();
    },
    submit() {
      if (!this.AfterSaleCode) {
        return;
      }
      this.form.AfterSaleCode = this.AfterSaleCode;

      // 判断是否为空
      if (!this.form.Score) {
        // 评分
        this.messageBox.failSingleError({
          title: '评价失败', msg: '请选择评分',
        });
      } else if (!this.form.Result) {
        // 结果
        this.messageBox.failSingleError({
          title: '评价失败', msg: '请选择服务结果',
        });
      } else if (!this.form.Label.length) {
        // 服务标签
        this.messageBox.failSingleError({
          title: '评价失败', msg: '请选择服务标签',
        });
      } else if (!this.form.EvaluateContent) {
        // 评价内容
        this.messageBox.failSingleError({
          title: '评价失败', msg: '请输入评价内容',
        });
      } else {
        const _list = this.$refs.upload.uploadFiles.map(it => {
          if (it.response && it.response.Status === 1000) return it.response.Data.Url; // 此处需额外处理编辑时的已有图片类型
          return '';
        }).filter(it => it);
        this.form.EvaluatePicList = _list || [];
        this.$emit('submit', this.form);
        // 图片列表
      }
    },
    // handllePictureUploaded(file) {
    //   console.log(file);
    // },
    handlePictureCardPreview(file) {
      this.dialogVisible = true;
      this.dialogImageUrl = this.baseUrl + file.response.Data.Url;
    },
    // handleRemove(file, fileList) {
    //   console.log(fileList);
    // },
    beforeUpload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        // 文件过大上传失败
      }
      return isLt5M;
    },
  },
  mounted() {
    this.api.getServiceLableList().then(res => {
      if (res.data.Status === 1000) {
        this.checkList = res.data.Data;
      }
    });
  },

};
</script>

<style lang='scss'>
.mp-pc-service-after-sales-page-wrap {
  margin: 0;
  width: 100%;
  // background-color: #fff;
  margin-bottom: 17px;
  // min-height: calc(100vh - 135px - 180px);
  .estimate{
    .el-rate{
      margin-top: 10px;
    }
    .result{
      display: flex;
      span{
        padding: 0px;
        border-radius: 5px;
        border: 1px solid #428DFA;
        text-align: center;
        width: 140px;
        line-height: 40px;
        margin-top: 0px;
        margin-right: 10px;
        color: #428DFA;
      }
        span:hover{
          cursor: pointer;
        }
      .action{
        background-color: #428DFA;
        color: #fff;
      }
    }
    .check-button{
      display: flex;
      flex-wrap: wrap;
      padding-top: 4px;
      align-items: center;
      li{
        width: 100px;
        height: 30px;
        line-height: 30px;
        margin-right: 30px;
        margin-bottom: 20px;
        border: 1px solid #E6E6E6;
        border-radius: 5px;
        text-align: center;
        color: #888888;
      }
      li:hover{
        background-color: #EBF0FE;
        border: 1px solid #428DFA;
        color: #428DFA;
      }
      .action{
        background-color: #428DFA;
        border: 1px solid #428DFA;
        color: #fff;
        &:hover{
          background-color: #428DFA;
          color: #fff;
      }
      }
    }
    .upload{
      display: flex;
      flex-direction: column;
      .el-upload{
        width: 80px;
        height: 80px;

        .el-upload-dragger{
          display: flex;
          justify-content: center;
          align-items: center;
          border: none;
          width: 100%;
          height: 100% ;
        }
      }
      .el-upload-list{
        .el-upload-list__item{
          border-radius: 3px;
          width: 80px;
          height: 80px;
          margin-right: 30px;
          i{
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
