<template>
  <section class="mp-mpzj-order-feedback-add-page-wrap">
    <section class="content">
      <header>
        <span class="is-bold is-black">申请售后</span>
      </header>
      <div>
        <el-table stripe border v-if="queryData"
          :data="[queryData]" style="width: 100%" class="ft-14-table">
          <el-table-column prop="ProductName" label="商品名称" width="234" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Content" label="文件内容" width="257" show-overflow-tooltip>
            <span slot-scope="scope" v-if="scope.row.Content">{{ scope.row.Content }}</span>
            <span v-else>--</span>
          </el-table-column>
          <el-table-column label="数量" width="229" show-overflow-tooltip>
            <span slot-scope="scope">{{ scope.row.ProductAmount }}{{ scope.row.Unit }}/{{ scope.row.KindCount}}款</span>
          </el-table-column>
          <el-table-column label="尺寸" show-overflow-tooltip width="229">
            <span slot-scope="scope" v-if="scope.row.SizeList.length">{{ scope.row.SizeList | formatListItemSize }}</span>
            <span v-else>--</span>
          </el-table-column>
          <el-table-column label="工艺" show-overflow-tooltip width="190">
            <span slot-scope="scope" v-if="scope.row.CraftList && scope.row.CraftList.length">{{ scope.row.CraftList | formatListItemSize }}</span>
            <span v-else>--</span>
          </el-table-column>
        </el-table>

        <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm1" label-width="100px" class="demo-ruleForm">
          <el-form-item label="诉求意向：" prop="AppealType">
            <div class="intention">
              <span :class="ruleForm.AppealType===0 ? 'action' : ''" @click="ruleForm.AppealType = 0">退款</span>
              <span :class="ruleForm.AppealType===1 ? 'action' : ''" @click="ruleForm.AppealType = 1">补印</span>
              <span :class="ruleForm.AppealType===255 ? 'action' : ''" @click="ruleForm.AppealType = 255">其它</span>
            </div>
          </el-form-item>

          <template v-if="ruleForm.AppealType!==null">
            <!--  -->

            <el-form-item v-if="ruleForm.AppealType===1" key='AppealType===1'>
              <div class="make-up-for">
                <div class="item">款数：
                  <el-form-item prop="KindCount">
                    <el-input-number size="small"
                    :controls="false" v-model="ruleForm.KindCount"
                    :max="queryData.KindCount"
                    :precision="0"
                    :step="1"
                    :min="1" label="款数">
                    </el-input-number>
                  </el-form-item>
                  款
                </div>
                <div class="item">
                  补印数量：
                  <el-form-item prop="Number">
                    <el-input-number size="small" :controls="false"
                      v-model="ruleForm.Number" :min="1"
                      :max="queryData.ProductAmount"
                      :step="1"
                      :precision="0"
                      label="描述文字">
                    </el-input-number>
                  </el-form-item>
                  {{ queryData.Unit }}
                  <span>您最多可提交数量为<span>{{queryData.ProductAmount}}</span></span>
                  </div>
              </div>
            </el-form-item>

            <!--  -->

            <el-form-item v-if="ruleForm.AppealType===0" key='AppealType===0'>
              <div class="make-up-for">
                退款金额：
                <div class="item">
                  <el-form-item prop="RefundAmount">
                    <el-input-number
                      @change='RefundAmountChange()'
                      size="small" :controls="false"
                      v-model="ruleForm.RefundAmount"
                      :min="0" label="退款金额">
                    </el-input-number>元
                  </el-form-item>
                </div>
              </div>
            </el-form-item>

            <!--  -->

            <el-form-item class="QuestionTypeList" label="问题类型：" prop="QuestionTypeList" style="margin-bottom:0">
              <CheckButton
                @CheckChange="ApplyQuestionCheckChange"
                :checkList="ApplyQuestionList"
                :ActiveList="ruleForm.QuestionTypeList"
                LabelKey="Title"
                ValueKey="ID"
              ></CheckButton>
            </el-form-item>

            <!--  -->

            <el-form-item label="问题描述：" prop="QuestionRemark">
              <el-input type="textarea" v-model="ruleForm.QuestionRemark"
              @input='ruleForm.QuestionRemark.length > 300 ? ruleForm.QuestionRemark=ruleForm.QuestionRemark.slice(0, 300) : ruleForm.QuestionRemark'
              maxlength="300" autosize show-word-limit placeholder="请输入具体问题描述"></el-input>
            </el-form-item>

            <el-form-item label="上传图片：" prop="QuestionPicList" class="QuestionPicList">
              <el-upload
                :action="baseUrl + '/Api/Upload/Image?type=3'"
                list-type="picture-card"
                ref="upload"
                drag
                accept='.png,.jpeg,.jpg,.bmp,.gif'
                :multiple='true'
                :limit='9'
                :on-success='handllePictureUploaded'
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :before-upload='beforeUpload'
                :class="{'uploadDisabled':uploadDisabled}"
                >
                <!-- :on-success='handllePictureUploaded'
                :on-remove="handleRemove" -->
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible" top="8vh" title="查看图片">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
              <!-- <p v-if="!canEdit && fileList.length === 0">未上传照片</p> -->
              <p class="is-font-12 gray upload-Remark">最多可上传9张图片，每张图片大小不超过5M，支持bmp、gif、png、jpg、jpeg</p>
            </el-form-item>
          </template>
        </el-form>
        <div v-if="ruleForm.AppealType!==null" class="line"></div>
        <el-form v-if="ruleForm.AppealType!==null"
          label-position="left" :model="ruleForm"
          :rules="rules" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
          <div class="linkman">
            <el-form-item label="联系人：" prop="ContactName">
              <el-input v-model="ruleForm.ContactName" maxlength="11" :disabled='!canEdit'
                show-word-limit placeholder="请输入联系人"></el-input>
            </el-form-item>

            <el-form-item label="联系电话：" prop="Mobile">
              <el-input v-model="ruleForm.Mobile" maxlength="11" :disabled='!canEdit'
                show-word-limit placeholder="请输入手机号码"></el-input>
            </el-form-item>
            <el-form-item label="QQ号码：" prop="QQ">
              <el-input v-model="ruleForm.QQ" maxlength="11" :disabled='!canEdit'
                show-word-limit placeholder="请输入QQ号码"></el-input>
            </el-form-item>
          </div>

        </el-form>
        <div class="btn-box" v-if="ruleForm.AppealType!==null">
          <el-button type="primary" @click="submitForm()" >立即提交</el-button>
          <!-- <span class="blue-span is-font-12" style="margin: 0 60px 0 30px" @click="resetForm('ruleForm')" v-if='canEdit'>重置</span> -->
          <el-button  @click="handleReturn">
            <i class="el-icon-d-arrow-left is-font-15"></i>
            <em style="margin-left: 6px">返回</em>
          </el-button>
        </div>
      </div>

      <el-dialog
        :visible.sync="submitSuccessVsible"
        @cancle="submitSuccessVsible = false"
        submitText='确定'
        width='472px'
        >
        <div class="submit-success">
          <div class="title">
            <i class="el-icon-success"></i>
            提交成功
          </div>
          <div class="message">
            <p>服务单提交后，售后人员将在 <span>30分钟</span> 内进行处理，售后专员可能与您电话沟通，请保持手机畅通。</p>
            <p>您也可以在 <span>售后记录</span> 中查询后续处理进度。</p>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <p>
            <el-button type="primary" @click="submitSuccessVsible = false; $router.replace('/feedbackList')" >确定</el-button>
          </p>
        </span>
      </el-dialog>
    </section>
  </section>
</template>

<script>
// import SingleSelector from '@/components/common/Selector/SingleSelector.vue';
import CheckButton from '@/components/common/CheckButton.vue';
import { imgUrl } from '@/assets/js/setup';
import { mapState } from 'vuex';
import { Message } from 'element-ui';

export default {
  components: {
    // SingleSelector,
    CheckButton,
  },
  data() {
    const validateQuestionTypeList = (rule, value, callback) => {
      if (value?.length === 0) {
        callback(new Error('请选择问题类型'));
      } else {
        callback();
      }
    };
    const QuestionPicList = (rule, value, callback) => {
      const _list = this.$refs.upload.uploadFiles.map(it => {
        if (it.response && it.response.Status === 1000) return it.response.Data.Url; // 此处需额外处理编辑时的已有图片类型
        return '';
      }).filter(it => it);
      if (_list.length === 0 || _list[0] === '') {
        callback(new Error('请上传问题图片'));
      } else {
        callback();
      }
    };
    const validateRefundAmount = (rule, value, callback) => {
      if (value === 0) {
        callback(new Error('退款金额不能为0'));
      } else if (value === undefined) {
        callback(new Error('请输入退款金额'));
      } else {
        callback();
      }
    };
    const validateNumber = (rule, value, callback) => {
      if (value > this.queryData.ProductAmount) {
        callback(new Error(`不能大于'${this.queryData.ProductAmount}'`));
      } else if (!value) {
        callback(new Error('不能为空'));
      } else {
        callback();
      }
    };
    const validateKindCount = (rule, value, callback) => {
      if (!value) {
        callback(new Error('不能为空'));
      } else {
        callback();
      }
    };
    return {
      submitSuccessVsible: false,
      ApplyQuestionList: [],
      fileList: [],
      canEdit: true,
      uploadDisabled: false,
      ruleForm: {

        OrderID: 0, // 订单号
        AfterSaleCode: null,
        Source: 2, // 下单类型
        AppealType: null, // 诉求意向
        QuestionTypeList: [ // 问题类型数组
        ],
        QuestionRemark: '', // 问题描述
        QuestionPicList: [ // 问题图片
          '',
        ],
        KindCount: undefined, // 款数
        Number: undefined, // 数量
        RefundAmount: undefined, // 退款金额
        ContactName: '', // 联系人
        QQ: '', // QQ号码
        Mobile: '', // 电话

      },
      intentionAction: 0,
      rules: {
        QuestionTypeList: [
          { required: true, message: '请选择售后原因', trigger: 'change' },
          { validator: validateQuestionTypeList, trigger: 'blur' },
        ],
        QuestionRemark: [
          { required: true, message: '请输入具体问题描述', trigger: 'change' },
          {
            min: 3, max: 300, message: '长度在 3 到 300 个字符', trigger: 'change',
          },
        ],
        QuestionPicList: [
          { validator: QuestionPicList, trigger: 'change' },
          { required: true, message: '请上传问题图片', trigger: 'change' },
        ],
        RefundAmount: [
          { validator: validateRefundAmount, trigger: 'blur' },
        ],
        Number: [
          { validator: validateNumber, trigger: 'blur' },
        ],
        KindCount: [
          { validator: validateKindCount, trigger: 'blur' },
        ],
        AppealType: [
          { required: true, message: '请选择诉求意向', trigger: 'blur' },
        ],
        ContactName: [
          { required: true, message: '请输入联系人', trigger: 'blur' },
        ],
        Mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' },
        ],
        QQ: [
          { pattern: /[1-9][0-9]{4,14}/, message: 'QQ号码格式不正确', trigger: 'blur' },
        ],
      },
      dialogImageUrl: '',
      dialogVisible: false,
      baseUrl: imgUrl,

      queryData: null,
    };
  },
  computed: {
    ...mapState('common', ['customerInfo', 'AppealList']),
    ...mapState('summary', ['editFeedbackData', 'RejectReasonList']),
  },
  methods: {
    RefundAmountChange() {
      this.ruleForm.RefundAmount = this.ruleForm?.RefundAmount?.toString().match(/\d+\.?\d{0,2}/, '');
    },
    async submitForm() {
      const phomReg = /^1[3456789]\d{9}$/;
      const QQRege = /[1-9][0-9]{4,14}/;
      this.$refs.ruleForm1.validate();
      this.$refs.ruleForm2.validate();
      if (this.ruleForm.AppealType === 0 && !this.ruleForm.RefundAmount) {
        // 弹窗提示 退款金额：
        this.messageBox.failSingleError({ title: '提交失败', msg: '请输入退款金额' });
      } else if (this.ruleForm.AppealType === 1 && !this.ruleForm.KindCount) {
        this.messageBox.failSingleError({ title: '提交失败', msg: '请输入补印款数' });
      } else if (this.ruleForm.AppealType === 1 && !this.ruleForm.Number) {
        this.messageBox.failSingleError({ title: '提交失败', msg: '请输入补印数量' });
      } else if (this.ruleForm.QuestionTypeList.length === 0) {
        this.messageBox.failSingleError({ title: '提交失败', msg: '请选择问题类型' });
      } else if (this.ruleForm.QuestionRemark === '' || this.ruleForm.QuestionRemark.length < 3 || this.ruleForm.QuestionRemark.length > 300) {
        this.messageBox.failSingleError({ title: '提交失败', msg: '请输入问题描述并在3到300个字符' });
      } else if (this.ruleForm.ContactName === '') {
        this.messageBox.failSingleError({ title: '提交失败', msg: '请输入联系人' });
      } else if (this.ruleForm.Mobile === '') {
        this.messageBox.failSingleError({ title: '提交失败', msg: '请输入联系电话' });
      } else if (!phomReg.test(this.ruleForm.Mobile)) {
        this.messageBox.failSingleError({ title: '提交失败', msg: '电话号码格式不正确' });
      } else if (this.ruleForm.QQ && !QQRege.test(this.ruleForm.QQ)) {
        this.messageBox.failSingleError({ title: '提交失败', msg: 'QQ号码格式不正确' });
      } else {
        const _list = this.$refs.upload.uploadFiles.map(it => {
          if (it.response && it.response.Status === 1000) return it.response.Data.Url; // 此处需额外处理编辑时的已有图片类型
          return '';
        }).filter(it => it);
        if (!_list.length) {
          this.messageBox.failSingleError({ title: '提交失败', msg: '请上传问题图片' });
          return;
        }
        this.ruleForm.QuestionPicList = _list || [];
        if (!this.$route.query.isEdit) {
          this.ruleForm.AfterSaleCode = 0;
        }
        const res = await this.api.getApplyQuestionApply(this.ruleForm);
        if (res.data.Status === 1000) {
          this.submitSuccessVsible = true;
          // this.messageBox.successSingle({
          //   title: '提交成功',
          //   successFunc: () => {
          //     this.$router.replace('/feedbackList');
          //   },
          // });
        }
      }
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      if (this.customerInfo) {
        this.ruleForm.Mobile = this.customerInfo.Account.Mobile;
        this.ruleForm.ContactName = this.customerInfo.CustomerName;
        this.ruleForm.QQ = this.customerInfo.QQ;
      }
    },
    handleRemove() {
      this.$refs.ruleForm1.validateField('QuestionPicList');
      this.setUploadDisabled();
    },
    beforeUpload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        // 文件过大上传失败
        Message({
          showClose: true,
          message: '文件过大，上传失败',
          type: 'error',
        });
      }
      return isLt5M;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    setUploadDisabled() {
      const _list = this.$refs.upload?.uploadFiles?.map(it => {
        if (it.response && it.response.Status === 1000) return it.response.Data.Url; // 此处需额外处理编辑时的已有图片类型
        return '';
      }).filter(it => it);
      if (!_list || _list.length < 9) {
        this.uploadDisabled = false;
      } else {
        this.uploadDisabled = true;
      }
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
      this.$refs.ruleForm1.validateField('QuestionPicList');
      this.setUploadDisabled();
    },
    handleReturn() {
      this.$router.back();
    },
    ApplyQuestionCheckChange(keys) {
      this.ruleForm.QuestionTypeList = keys;
      this.$refs.ruleForm1.validateField('QuestionTypeList');
    },
    initPicList() {
      this.$refs.upload.uploadFiles = this.ruleForm.QuestionPicList.map((path, i) => ({
        name: '（…）',
        percentage: 100,
        raw: {},
        response: {
          Status: 1000,
          Message: '返回成功',
          DataNumber: 1,
          VersionCode: 0,
          Data: {
            Height: 1080,
            Name: '',
            Suffix: '.jpeg',
            Url: path,
            Width: 1920,
          },
        },
        size: 1000,
        status: 'success',
        uid: new Date().getTime() + i,
        url: `${imgUrl}${path}`,
        // response: {
        //   Status: 1000,
        //   Data: {
        //     Url: path,
        //   },
        // },
      }));
    },
  },
  async mounted() {
    const isEdit = Number(this.$route.query.isEdit);
    this.queryData = JSON.parse(this.$route.query.data);
    if (isEdit) {
      this.ruleForm.AppealType = this.queryData.AppealType;
      this.ruleForm.RefundAmount = this.queryData.AppealRefundAmount;
      // this.ruleForm.QuestionTypeList = this.queryData.QuestionTypeTitleList;
      this.ruleForm.QuestionPicList = this.queryData.QuestionPicList || [];
      this.ruleForm.QuestionRemark = this.queryData.QuestionRemark;
      this.ruleForm.KindCount = this.queryData.AppealKindCount;
      this.ruleForm.Number = this.queryData.AppealNumber;
      this.ruleForm.ContactName = this.queryData.ContactName;
      this.ruleForm.QQ = this.queryData.ContactQQ;
      this.ruleForm.Mobile = this.queryData.Mobile;
      // this.fileList = this.ruleForm.QuestionPicList.map(path => ({ url: `${imgUrl}${path}` }));
      setTimeout(() => { this.initPicList(this.ruleForm.QuestionPicList); }, 500);
    } else {
      this.ruleForm.Mobile = this.customerInfo?.Account.Mobile || '';
      this.ruleForm.ContactName = this.customerInfo?.CustomerName || '';
      this.ruleForm.QQ = this.customerInfo?.QQ || '';
    }
    // 获取问题类型数据
    this.api.getApplyQuestionList().then(res => {
      if (res.data.Status === 1000) {
        this.ApplyQuestionList = res.data.Data;
        if (isEdit) {
          // 查找选中的问题类型ID
          const { QuestionTypeTitleList } = this.queryData; // ?.split(',');
          this.ruleForm.QuestionTypeList = QuestionTypeTitleList.map(item => {
            const temp = this.ApplyQuestionList.filter(i => i.Title === item);
            return temp.length ? temp[0].ID : '';
          });
        }
      }
    });

    this.ruleForm.OrderID = this.queryData.OrderID;
    this.ruleForm.AfterSaleCode = this.queryData.AfterSaleCode || 0;
    this.$store.dispatch('summary/getRejectReasonList');
  },
};
</script>

<style lang='scss'>
.mp-mpzj-order-feedback-add-page-wrap {
  width: 100%;
  margin-top: 25px;
  // background-color: #fff;
  min-height: calc(100vh - 115px - 22px);
  min-height: calc(100vh - 115px - 42px) \0;

  > .content {
    width: 1200px;
    min-height: calc(100vh - 115px - 22px);
    min-height: calc(100vh - 115px - 42px) \0;
    margin: 0 auto;
    background-color: #fff;
    padding: 30px;
    box-sizing: border-box;
    margin-bottom: 80px;
    > header {
      border-bottom: 1px dashed #EEEEEE;
      padding-bottom: 15px;
      margin-bottom: 15px;
    }
    > div {
      width: 100%;
      > .el-form{
        margin-top: 22px;
        .QuestionTypeList{
          .el-form-item__error{
            top: calc(100% - 30px);
          }
        }
        .QuestionPicList{
          .el-form-item__error{
            top: calc(100% - 52px);
          }
          >.el-form-item__content{
            >div{
              // display: flex;
              // flex-wrap: wrap;
              // min-height: 156px;
              .el-upload-list{
                // display: flex;
                // flex-wrap: wrap;
                margin-bottom: -10px;
                vertical-align: middle;
                .el-upload-list__item{
                  display: inline-block;
                  // display: flex;
                  // margin: 0 8px 17px;
                }
              }
              .el-upload--picture-card{
                margin-bottom: 23px;
              }
            }
          }
          .el-icon-close-tip{
            display: none;
            width: 0;
            height: 0;
            overflow: hidden;
          }
          .upload-Remark{
            margin-top: -1em;
          }
        }
        .el-textarea{
          textarea{
            padding-bottom: 13px;
            max-height: 200px;
          }
          .el-input__count{
            width: calc(100% - 22px);
            background: #fff;
            height: 12px;
            line-height: 12px;
            bottom: 1px;
            text-align: right;
            right: 20px;
            padding-bottom: 3px;
          }
        }
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
        height: 32px;
        .item{
          display: flex;
          margin-right: 120px;
          align-items: center;
          .el-form-item{
            .el-form-item__content{
              line-height: 32px;

              color: #888888;
            }
          }
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
        font-size: 13px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .el-upload-list__item-thumbnail {
        object-fit: cover;
      }
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
            .el-dialog__title {
              font-size: 17px;
            }
          }
          .el-dialog__body {
            padding-top: 10px;
            padding-bottom: 20px;
          }
        }
        .uploadDisabled{
          >.el-upload--picture-card{
            display:none
          }
        }
      }
    }

    .submit-success{
      padding: 0 30px;
      box-sizing: border-box;
      .title{
        text-align: center;
        font-size: 16px;
        color: #585858;
        font-weight: 700;
        line-height: 30px;
        display: flex;
        justify-content: center;
        i{
          font-size: 30px;
          margin-right: 20px;
          color: #67c23a;
        }
      }
      .message{
        width: 355px;
        margin: 0 auto;
        margin-top: 22px;
        line-height: 32px;
        font-size: 13px;
        p{
          text-indent: -1.5em;
          padding-left: 1.5em;
        }
        p:nth-child(1)::before{
          content: '1、';
        }
        p:nth-child(2)::before{
          content: '2、';
        }
        span{
          color: #FF3769;
        }
      }

    }
    .el-dialog__body{
      padding-top: 20px;
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
  }
}
</style>
