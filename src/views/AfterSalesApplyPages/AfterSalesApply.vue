<template>
  <section class="mp-mpzj-order-after-sales-apply-page-wrap">
    <section class="content" v-if="queryData">
      <div class="order-info">
        <header>订单信息</header>
        <ul>
          <li>
            <div>订单号：</div>
            <p>{{queryData.OrderID}}</p>
          </li>
          <li>
            <div>已售后次数：</div>
            <p>
              <span @click="viewDetailsClick" v-if="Number(OrderApplyCount)" class="seeDetails">
                {{OrderApplyCount}}次（点击查看详情）
              </span>
              <span v-else>{{OrderApplyCount}}次</span>
            </p>
          </li>
          <li>
            <div>产品数量：</div>
            <p>{{ queryData.ProductName }} {{ queryData.ProductAmount }}{{ queryData.Unit }}</p>
          </li>
          <li>
            <div>尺寸规格：</div>
            <p>{{ queryData.SizeList | formatListItemSize }} {{ queryData.CraftList | formatListItemSize }}</p>
          </li>
          <li>
            <div>成交价：</div>
            <p>{{queryData.FinalPrice ? `${queryData.FinalPrice}元` : ''}}</p>
          </li>
          <li>
            <div>运费：</div>
            <p>{{queryData.IsUnion ? '-' : queryData.Freight}}元</p>
          </li>
          <li>
            <div>内容：</div>
            <p>{{ queryData.Content }}</p>
          </li>
        </ul>
      </div>
      <div class="line"></div>
      <div class="after-sales-apply">
        <header>申请售后</header>
        <el-form label-position="right" size="small" :model="ruleForm" :rules="rules" ref="ruleForm1" label-width="100px" class="demo-ruleForm"
          style="min-height: calc(100vh - 115px - 22px - 350px);"
        >
          <template>
            <el-form-item class="QuestionTypes" label="问题：" prop="QuestionTypes" style="margin-bottom:0">
              <CheckButton
                @CheckChange="ApplyQuestionCheckChange"
                :checkList="ApplyQuestionList"
                :ActiveList="ruleForm.QuestionTypes"
                LabelKey="Title"
                ValueKey="ID"
                @DialogClick="DialogClick"
              ></CheckButton>
            </el-form-item>

            <!--  -->

            <el-form-item label="问题描述：" prop="QuestionRemark">
              <label for="QuestionRemark" slot="label" class="el-form-item__label QuestionRemark">问题描述<span>(选填)</span>：</label>
              <el-input type="textarea" v-model="ruleForm.QuestionRemark"
              @input='ruleForm.QuestionRemark.length > 300 ? ruleForm.QuestionRemark=ruleForm.QuestionRemark.slice(0, 300) : ruleForm.QuestionRemark'
              maxlength="300" autosize show-word-limit placeholder="请输入具体问题描述"></el-input>
            </el-form-item>

            <el-form-item label="上传图片：" prop="QuestionPics" class="QuestionPics" :required='isUpImg'>
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
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible" top="8vh" title="查看图片">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
              <div class="upload-Remark">
                <p class="is-font-12 gray">1、拍照时请将成品10份以上呈平铺或扇形展开，并对产品的包装、标签、整体、问题局部特写等多角度拍摄，为您带来麻烦，深表歉意！</p>
                <p class="is-font-12 gray">2、照片支持bmp、gif、png、jpg、jpeg，最多可上传9张图片，每张图片大小不超过15M。</p>
                <p class="is-font-12 gray">3、为快速为您解决售后问题，请上传“问题细节、问题多张、产品整体”等，建议上传三张及以上图片。</p>
                <p class="is-font-12 gray">4、若服务方式为第三方“快递或快运”类订单需补充“快递面单、货物标签、第三方交易详情”等相关凭证。</p>
              </div>
            </el-form-item>
            <el-form-item label="诉求意向：" prop="AppealType">
              <div class="intention">
                <span :class="ruleForm.AppealType===2 ? 'action' : ''" @click="AppealTypeClick(2)">退款</span>
                <span :class="ruleForm.AppealType===7 ? 'action' : ''" @click="AppealTypeClick(7)">补印</span>
              </div>
            </el-form-item>
            <div class="linkman">
              <el-form-item v-if="ruleForm.AppealType === 2" label="金额：" prop="ApplyRefundAmount">
                <el-input key="ApplyRefundAmount" v-model="ruleForm.ApplyRefundAmount" oninput="value=value.match(/^\d*(\.?\d{0,2})/g)[0]"
                  show-word-limit placeholder="请输入金额"></el-input> 元
              </el-form-item>
              <el-form-item v-if="ruleForm.AppealType === 7" label="补印数量：" prop="ApplyRePrintNumber">
                <el-input key="ApplyRePrintNumber" v-model="ruleForm.ApplyRePrintNumber" oninput="value=value.replace(/[^\d]/g,'')"
                  show-word-limit placeholder="请输入补印数量"></el-input> {{ queryData.Unit }}
              </el-form-item>
              <el-form-item label="联系电话：" prop="Mobile">
                <el-input v-model="ruleForm.Mobile" maxlength="11"
                  show-word-limit placeholder="请输入手机号码"></el-input>
              </el-form-item>
              <el-form-item label="QQ：" prop="QQ">
                <el-input v-model="ruleForm.QQ" maxlength="11"
                  show-word-limit placeholder="请输入QQ号码"></el-input>
              </el-form-item>
            </div>
          </template>
        </el-form>
        <div class="btn-box">
          <el-button type="primary" @click="submitForm()" >立即提交</el-button>
          <el-button  @click="handleReturn" style="color: #428DFA; border-color: #428DFA;">
            返回
          </el-button>
        </div>
      </div>

      <el-dialog
        :visible.sync="DescribeShow"
        @cancle="DescribeShow = false"
        submitText='确定'
        title="问题类型描述"
        width='472px'
        top="30vh"
        class="question-type-desc"
        >
        <div>
          {{Describe}}
        </div>
        <span slot="footer" class="dialog-footer">
          <p>
            <el-button @click="DescribeShow = false;" >关闭</el-button>
          </p>
        </span>
      </el-dialog>
      <el-dialog
        :visible.sync="viewDetailsDialog"
        @cancle="viewDetailsDialog = false"
        @open="initOrderApplyRecord"
        submitText='确定'
        title="订单已售后次数"
        width='716px'
        top="15vh"
        class="view-details-dialog"
        >
        <el-table stripe border
          :data="OrderApplyRecord.AfterSaleRecords" style="width: 100%" height="500" class="ft-14-table">
          <el-table-column prop="AfterSaleCode" label="售后单号" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="QuestionTypeTitles" label="问题" min-width="90" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="SolutionResultRemark" label="解决方案" show-overflow-tooltip width="190">
            <template slot-scope="scope">
              <template v-if="scope.row.IsReject">
                <span>未发现问题</span>
              </template>
              <template v-else>
                <template v-if="scope.row.SolutionResults.length">
                  <template v-if="scope.row.SolutionResults[0]">
                    {{ scope.row.SolutionResults[0] ? scope.row.SolutionResults[0].SolutionContent : '' }}
                    <template v-if="scope.row.SolutionResults[0].CouponContents.length">
                      {{scope.row.CouponIsExtra?'额外':''}}赠送优惠券：
                      {{ scope.row.SolutionResults[0].CouponContents.join('、') }}
                    </template>
                  </template>
                </template>
                <template v-else>
                  -
                </template>
              </template>
            </template>
          </el-table-column>
          <el-table-column label="额外支出" show-overflow-tooltip min-width="70">
            <template slot-scope="scope">
              <el-tooltip v-if="scope.row.ExtraPayAmount" :disabled="!scope.row.ExtraPayRemark" effect="dark"
              :content="scope.row.ExtraPayRemark" placement="top">
                <span>{{scope.row.ExtraPayAmount}}元</span>
              </el-tooltip>
              <template v-else>
                -
              </template>
            </template>
          </el-table-column>
          <el-table-column label="处理时间" show-overflow-tooltip min-width="140">
            <template slot-scope="scope">{{ scope.row.LastOperateTime | format2MiddleLangTypeDate }}</template>
          </el-table-column>
          <el-table-column label="处理人" show-overflow-tooltip min-width="80">
            <template slot-scope="scope">{{ scope.row.OperaterUserName }}</template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <p>
            <el-button @click="viewDetailsDialog = false;" >关闭</el-button>
          </p>
        </span>
      </el-dialog>
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
            <p>售后人员将在工作时间 <span>30分钟</span> 内进行处理，售后专员可能与您电话沟通，请保持手机畅通。</p>
            <p>您也可以在 <span>售后记录</span> 中查询后续处理进度。</p>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <p>
            <el-button type="primary" @click="submitSuccessVsible = false; handleReturn()" >确定</el-button>
          </p>
        </span>
      </el-dialog>
    </section>
  </section>
</template>

<script>
// import SingleSelector from '@/components/common/Selector/SingleSelector.vue';
import CheckButton from '@/components/FeedbackComps/CheckButton.vue';
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
        callback(new Error('请选择问题'));
      } else {
        callback();
      }
    };
    const QuestionPics = (rule, value, callback) => {
      const _list = this.$refs.upload.uploadFiles.map(it => {
        if (it.response && it.response.Status === 1000) return it.response.Data.Url; // 此处需额外处理编辑时的已有图片类型
        return '';
      }).filter(it => it);
      if (this.isUpImg && (_list.length === 0 || _list[0] === '')) {
        callback(new Error('请您上传问题证明图片（晚货/丢货无需上传）'));
      } else {
        callback();
      }
    };
    return {
      submitSuccessVsible: false,
      viewDetailsDialog: false,
      Describe: '',
      DescribeShow: false,
      ApplyQuestionList: [],
      fileList: [],
      uploadDisabled: false,
      OrderApplyCount: 0, // 订单售后次数
      OrderApplyRecord: [], // 订单售后记录
      ruleForm: {
        QuestionTypes: [],
        QuestionPics: [],
        ApplyRefundAmount: '',
        ApplyRePrintNumber: '',
        OrderID: 0, // 订单号
        AfterSaleCode: null,
        Source: 2, // 下单类型
        ChannelType: 0, // 售后渠道
        AppealType: null, // 诉求意向
        QuestionRemark: '', // 问题描述
        QQ: '', // QQ号码
        Mobile: '', // 电话
      },
      intentionAction: 0,
      rules: {
        QuestionTypes: [
          { required: true, message: '请选择问题', trigger: 'change' },
          { validator: validateQuestionTypeList, trigger: 'blur' },
        ],
        QuestionRemark: [
          {
            min: 3, max: 300, message: '长度在 3 到 300 个字符', trigger: 'change',
          },
        ],
        QuestionPics: [
          { validator: QuestionPics, trigger: 'change' },
          { required: false, message: '请您上传问题证明图片（晚货/丢货无需上传）', trigger: 'change' },
        ],
        AppealType: [
          { required: true, message: '请选择诉求意向', trigger: 'blur' },
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
    ...mapState('common', ['customerInfo']),
    isUpImg() {
      const ActionQuestionList = this.ApplyQuestionList.filter(res => this.ruleForm.QuestionTypes.find(item => item === res.ID));
      return ActionQuestionList.filter(res => res.IsUploadPic).length !== 0;
    },
  },
  methods: {
    async submitForm() {
      const phomReg = /^1[3456789]\d{9}$/;
      const QQRege = /[1-9][0-9]{4,14}/;
      this.$refs.ruleForm1.validate();
      if (this.ruleForm.QuestionTypes.length === 0) {
        this.messageBox.failSingleError({ title: '提交失败', msg: '请选择问题' });
      } else if (this.ruleForm.QuestionRemark !== '' && (this.ruleForm.QuestionRemark.length < 3 || this.ruleForm.QuestionRemark.length > 300)) {
        this.messageBox.failSingleError({ title: '提交失败', msg: '请输入问题描述并在3到300个字符' });
      } else if (!this.ruleForm.AppealType) {
        this.messageBox.failSingleError({ title: '提交失败', msg: '请选择诉求意向' });
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
        if (this.isUpImg && !_list.length) {
          this.messageBox.failSingleError({ title: '提交失败', msg: '请上传问题图片' });
          return;
        }
        this.ruleForm.QuestionPics = _list || [];
        const res = await this.api.getApplyQuestionApply(this.ruleForm);
        if (res.data.Status === 1000) {
          this.submitSuccessVsible = true;
        }
      }
    },
    getSolution(solution) {
      const arr = [];
      if (solution.SolutionTypes.find(it => it === 2)) {
        arr.push('退款');
      }
      if (solution.SolutionTypes.find(it => it === 7)) {
        arr.push('补印');
      }
      if (solution.SolutionTypes.find(it => it === 8)) {
        arr.push('赠送优惠券');
      }
      if (solution.SolutionTypes.find(it => it === 255)) {
        arr.push('其他');
      }
      return arr.join('、');
    },

    handleRemove() {
      this.$refs.ruleForm1.validateField('QuestionPics');
      this.setUploadDisabled();
    },
    beforeUpload(file) {
      const isLt15M = file.size / 1024 / 1024 < 15;
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
        this.$refs.upload.uploadFiles = this.$refs.upload.uploadFiles.filter(it => it.status === 'success' && it.response && it.response.Status === 1000);
      }
      this.$refs.ruleForm1.validateField('QuestionPics');
      this.setUploadDisabled();
    },
    handleUploadError() {
      Message({
        showClose: true,
        message: '图片上传失败',
        type: 'error',
      });
      this.$refs.upload.uploadFiles = this.$refs.upload.uploadFiles.filter(it => it.status === 'success' && it.response && it.response.Status === 1000);
    },
    handleReturn() {
      this.$router.back();
    },
    ApplyQuestionCheckChange(keys) {
      this.ruleForm.QuestionTypes = keys;
      this.$refs.ruleForm1.validateField('QuestionTypes');
      this.$refs.ruleForm1.validateField('QuestionPics');
    },
    initPicList() {
      this.$refs.upload.uploadFiles = this.ruleForm.QuestionPics.map((path, i) => ({
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
      }));
      this.setUploadDisabled();
    },
    DialogClick(Describe) {
      this.Describe = Describe;
      this.DescribeShow = true;
    },
    AppealTypeClick(val) {
      this.ruleForm.AppealType = val;
      this.$refs.ruleForm1.validateField('AppealType');
    },
    getOrderAfterSaleOrderApplyRecord() {
      this.viewDetailsDialog = true;
      // 获取问题类型数据
      this.api.getOrderAfterSaleOrderApplyRecord(this.queryData.OrderID).then(res => {
        if (res.data.Status === 1000) {
          this.OrderApplyRecord = res.data.Data;
        }
      });
    },
    viewDetailsClick() {
      this.viewDetailsDialog = true;
    },
    initOrderApplyRecord() {
      this.api.getOrderAfterSaleOrderApplyRecord(this.queryData.OrderID).then(res => {
        if (res.data.Status === 1000) {
          this.OrderApplyRecord = res.data.Data;
        }
      });
    },
  },
  async mounted() {
    if (!this.$route.params.data) {
      this.handleReturn();
      return;
    }
    this.queryData = JSON.parse(this.$route.params.data);
    this.ruleForm.Mobile = this.customerInfo?.Account.Mobile || '';
    this.ruleForm.QQ = this.customerInfo?.QQ || '';
    // 获取问题类型数据
    this.api.getApplyQuestionList().then(res => {
      if (res.data.Status === 1000) {
        this.ApplyQuestionList = res.data.Data;
      }
    });

    this.ruleForm.OrderID = this.queryData.OrderID;
    this.ruleForm.AfterSaleCode = this.queryData.AfterSaleCode;
    this.$store.dispatch('summary/getRejectReasonList');

    this.api.getOrderAfterSaleOrderApplyCount(this.queryData.OrderID).then(res => {
      if (res.data.Status === 1000) {
        this.OrderApplyCount = res.data.Data;
      }
    });
  },
  watch: {
    customerInfo: {
      handler(newVal) {
        if (newVal && !this.ruleForm.Mobile) {
          this.ruleForm.Mobile = this.customerInfo?.Account.Mobile || '';
          this.ruleForm.QQ = this.customerInfo?.QQ || '';
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang='scss'>
.question-type-desc, .view-details-dialog{
  .el-dialog{
    .el-dialog__header{
      padding: 11px;
      margin: 0 10px;
      border-bottom: 1px solid #EEEEEE;
      .el-dialog__title{
        padding-left: 10px;
        border-left: 3px solid #26BCF9;
        text-indent: 2em;
        font-size: 14px;
        line-height: 16px;
      }
      .el-dialog__headerbtn{
        top: 10px;
      }
    }
    .el-dialog__body{
      padding: 15px 32px;
      font-weight: 400;
      color: #888888;
      line-height: 1.3em;
      font-size: 14px;
    }
    .dialog-footer{
      .el-button{
        color: #26BCF9;
        border-color: #26BCF9;
      }
    }
  }
}
.mp-mpzj-order-after-sales-apply-page-wrap {
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
    // padding: 30px;
    box-sizing: border-box;
    margin-bottom: 80px;
    display: flex;
    color: #000;
    > div {
      width: 100%;
      font-size: 12px;
      >header{
        font-size: 14px;
        font-weight: 700;
        margin-top: 30px;
      }
      &.order-info{
        width: 302px;
        box-sizing: border-box;
        padding: 0 15px;
        >ul{
          margin-top: 50px;
          >li{
            display: flex;
            margin-bottom: 15px;
            line-height: 15px;
            >div{
              min-width: 72px;
              text-align: right;
              font-weight: 700;
            }
            .seeDetails{
              &:hover{
                text-decoration: underline;
              }
              color: #428DFA;
              cursor: pointer;
            }
          }
        }
      }
      &.line{
        width: 1px;
        min-height: calc(100% - 60px - 138px);
        background-color: #eee;
        margin-top: 60px;
        margin-bottom: 138px;
      }
      &.after-sales-apply{
        width: 887px;
        padding: 0 153px 0 15px;
        box-sizing: border-box;
      }
      > .el-form{
        margin-top: 22px;
        .QuestionTypes{
          .el-form-item__error{
            top: calc(100% - 22px);
          }
        }
        .QuestionPics{
          .el-form-item__error{
            top: calc(100% - 114px);
          }
          >.el-form-item__content{
            >div{
              .el-upload-list{
                margin-bottom: -10px;
                vertical-align: middle;
                .el-upload-list__item{
                  margin-right: 9px;
                  display: inline-block;
                  &:nth-child(4n){
                    margin-right: 0;
                  }
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
            line-height: 1.3em;
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
      .el-textarea__inner {
        min-height: 88px !important;
      }
      .el-form-item__label:before {
        color: #FEB829 !important;
      }
      // 诉求意向
      .intention{
        display: flex;
        height: 32px;
        align-items: center;
        font-size: 14px;
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
          width: 122px;
          line-height: 32px;
          border-radius: 5px;
          height: 32px;
          text-align: center;
          border: 1px solid #efefef;
          margin-right: 20px;
          color: #888888;
        }
      }
      // 问题类型
      .check-button{
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 7px;
        font-size: 12px;
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
          width: 102px;
          height: 32px;
          border-radius: 3px;
          line-height: 32px;
          border: 1px solid #E6E6E6;
          margin: 0px 60px 15px 0;
          text-align: center;
          color: #888888;
          position: relative;
          &:nth-child(4n){
            margin-right: 22px;
          }
          >div:hover{
            cursor:pointer;
            color: #428DFA;
            border-color: #428dfa;
            background-color: #EBF0FE;
          }
          >i{
            position: absolute;
            top: 0;
            right: -20px;
            cursor:pointer;
            &:hover{
              color: #428DFA;
            }
          }
        }
      }
      // 联系人
      .linkman{
        display: flex;
        flex-direction: column;
        .el-input{
          width: 180px;
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
          width: 140px;
          & + button {
            margin-left: 100px;
          }
        }
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
        font-size: 12px;
        padding-right: 0;
        color: #000000;
        .QuestionRemark {
          >span{
            color: #AEAEAE;
          }
        }
      }
      .is-disabled + .el-upload {
        display: none;
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
