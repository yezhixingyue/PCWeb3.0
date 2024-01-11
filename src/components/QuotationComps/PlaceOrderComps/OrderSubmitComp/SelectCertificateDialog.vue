<template>
  <el-dialog
    :visible.sync="localVisible"
    width="730px"
    custom-class="mp-place-order-panel-comp-select-certificate-dialog-comp-wrap"
    v-dialogDrag
    @open="onOpen"
    top="calc(50vh - 242px)"
    :close-on-click-modal='false'
    :close-on-press-escape='false'
    :before-close='handleBeforeClose'
    @closed="onClosed"
  >
    <header slot="title">
      <span style="display: flex;align-items: center;">
        <img style="margin-right: 10px;" src="@/assets/images/select-certificateicon.png" alt="">
        选择证书
      </span>
    </header>
    <main>
      <p class="filtrate-box">
        <span class="condition"><i>搜索名称：</i>
          <el-input size="small" v-model="KeyWords" clearable></el-input>
        </span>
        <span class="condition"><i>证书类型：</i>
          <el-select size="small" v-model="CertificateTypeData" placeholder="请选择">
            <el-option
              v-for="item in CertificateType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </span>
        <span style="cursor: pointer; color: #428DFA;" @click="refreshClick"><i class="icon el-icon-refresh"></i>刷新</span>
        <span style="cursor: pointer; color: #428DFA;" @click="addCertificateClick">+ 添加证书</span>
        <AddCertificateDialog
        :visible.sync="addCertificateVisible" @succeed="onOpen" />
      </p>
      <el-table
        stripe
        border
        height="253px"
        class="add-certificate-table"
        :data="FilterCertificateList"
        style="width: 100%;">
        <el-table-column
          prop="Name"
          label="名称"
          show-overflow-tooltip
          min-width="159">
          <template slot-scope="scope">
            <p class="product-name">
              <el-radio v-model="actionID" :label="scope.row.CertificateID">{{scope.row.CertificateName}}</el-radio>
            </p>
          </template>
        </el-table-column>
        <el-table-column
          prop="CertificateType"
          label="类型"
          min-width="145">
          <template slot-scope="scope">{{ getCertificateType(scope.row.CertificateType) }}</template>
        </el-table-column>
        <el-table-column
          prop="Expire"
          label="有效期"
          min-width="137">
          <span slot-scope="scope">{{ getConvertTimeFormat(scope.row.Expire) }}</span>
        </el-table-column>
        <el-table-column
          prop="CertificatePics"
          label="缩略图"
          min-width="239">
          <template slot-scope="scope">
            <div style="display: flex; justify-content: center;">
              <el-image v-for="it in scope.row.CertificatePics" :key="it"
                @click="checkClick(scope.row.CertificatePics, imgUrl+it)"
                :src="imgUrl+it"
                alt=""
                fit="cover"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-image-viewer
        :showViewer.sync='showViewer'
        :PreviewSrc="PreviewSrc"
      />
    </main>
    <footer>
      <el-button type="primary" @click="onSubmit">确认提交</el-button>
      <el-button @click="localVisible = false">取消</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex';
import { imgUrl } from '@/assets/js/setup';
import { ConvertTimeFormat } from '@/assets/js/utils/ConvertTimeFormat';
import ElImageViewer from '@/components/common/ImageViewer.vue';
import AddCertificateDialog from '@/components/common/AddCertificateDialog';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    SelectCertificate: {
      type: Object,
      default: () => null,
    },
  },
  components: {
    AddCertificateDialog,
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
    FilterCertificateList() {
      let returnTemp = [];
      if (!this.KeyWords) {
        returnTemp = this.CertificateList;
      } else {
        returnTemp = this.CertificateList.filter(item => item.CertificateName.search(this.KeyWords) !== -1);
      }
      if (this.CertificateTypeData !== '') {
        returnTemp = returnTemp.filter(item => item.CertificateType === this.CertificateTypeData);
      }
      return returnTemp;
    },
  },
  data() {
    return {
      imgUrl,
      showViewer: false,
      PreviewSrc: null,
      loading: false,
      KeyWords: '',
      CertificateTypeData: '',
      addCertificateVisible: false,
      CertificateList: [],
      actionID: null,
    };
  },
  methods: {
    getConvertTimeFormat(date) {
      return ConvertTimeFormat(new Date(date));
    },
    onOpen() {
      if (this.SelectCertificate) {
        this.actionID = this.SelectCertificate.CertificateID;
      }
      this.api.getCustomerCertificateAll().then(res => {
        if (res.data.Status === 1000) {
          this.CertificateList = res.data.Data;
        }
      });
    },
    onClosed() {
      this.CertificateList = [];
      this.KeyWords = '';
      this.CertificateTypeData = '';
      this.actionID = '';
    },
    handleBeforeClose(done) {
      if (!this.loading) done();
    },
    onSubmit() {
      const selectTemp = this.FilterCertificateList.find(it => it.CertificateID === this.actionID);
      if (selectTemp) {
        this.$emit('submit', selectTemp);
        this.localVisible = false;
      } else {
        this.messageBox.failSingleError({ title: '保存失败', msg: '请选择商标证书' });
      }
    },
    refreshClick() {
      this.onOpen();
    },
    addCertificateClick() {
      this.addCertificateVisible = true;
    },
    actionClick(item) {
      this.actionID = item.CertificateID;
    },
    getCertificateType(Type) {
      const temp = this.CertificateType.find(it => it.value === Type);
      return temp ? temp.label : '';
    },
    checkClick(list, url) {
      const tempList = list.map(it => imgUrl + it);
      const index = tempList.findIndex(it => it === url);
      this.PreviewSrc = [...tempList.slice(index), ...tempList.slice(0, index)];
      this.showViewer = true;
    },
  },
};
</script>
<style lang='scss'>
  .mp-place-order-panel-comp-select-certificate-dialog-comp-wrap {
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
        .filtrate-box{
          display: flex;
          .el-input{
            width: 160px;
          }
          >span{
            display: flex;
            align-items: center;
            .icon{
              margin-right: 5px;
            }
            &.condition{
              >i{
                width: 5em;
              }
            }
          }
          >span+span{
            margin-left: 30px;
          }
        }
        .add-certificate-table{
          margin-top: 20px;
          .el-table__header{
            .has-gutter{
              tr{
                th{
                  max-height: 37px;
                  padding: 0;
                }
              }
            }
          }
          .el-table__body-wrapper{
            .el-table__body{
              .el-image{
                width: 40px;
                height: 40px;
                cursor: pointer;
                & + .el-image{
                  margin-left: 10px;
                }
              }
              tbody{
                .product-name{
                  text-align: left;
                }
                .el-table__row{
                  td{
                    padding: 11px 0 !important;
                  }
                }
              }
            }
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
