<template>
  <div class="authentication-info-page">
    <section>
      <p class="state" :class="getStates(authCompanyInfo.Status).class">
        <i></i>
        <span>
          <p class="title">企业认证信息状态：<span>{{getStates(authCompanyInfo.Status).msg}}</span></p>
          <p v-if="authCompanyInfo.Status===1" class="is-pink">工作人员会在9：00-19：00期间审核，非上述时间段申请会在下一个工作日进行审核</p>
          <p v-if="authCompanyInfo.Status === 3"><i>未通过原因：</i><span class="is-pink">{{ authCompanyInfo.Remark }}</span></p>
        </span>
      </p>

      <div class="form-item">
        <span class="label">企业全称：</span>
        <div class="content">
          {{ authCompanyInfo.CompanyName }}
        </div>
      </div>
      <div class="form-item">
        <span class="label">证件号：</span>
        <div class="content">
          {{ authCompanyInfo.CreditCode }}
        </div>
      </div>
      <div class="form-item">
        <span class="label">证件照：</span>
        <div class="content">
          <div class="images" v-for="it in authCompanyInfo.CreditPath" :key="it">
            <el-image
              :src="imgUrl+it"
              alt=""
            />
            <span @click="handlePicturePreview(imgUrl+it)">查看</span>
          </div>
          <el-image-viewer
             v-if="showViewer"
             :on-close="() => showViewer = false"
             :url-list="PreviewSrc"
        />
        </div>
      </div>
      <div class="form-item">
        <span class="label">申请时间：</span>
        <div class="content">
          {{ authCompanyInfo.CreateTime | format2MiddleLangTypeDate }}
        </div>
      </div>
      <div class="form-item" v-if="authCompanyInfo.Status === 3 || authCompanyInfo.Status === 2">
        <span class="label">审核时间：</span>
        <div class="content">
          {{ authCompanyInfo.CheckTime | format2MiddleLangTypeDate }}
        </div>
      </div>
      <div class="form-item restart" v-if="authCompanyInfo.Status === 3">
        <el-button @click="againAuthentication" type="primary">重新认证</el-button>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { imgUrl } from '@/assets/js/setup';
import ElImageViewer from 'element-ui/packages/image/src/image-viewer';

export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ElImageViewer,
  },
  data() {
    return {
      actionSheetShow: false,
      imgUrl,
      showViewer: false,
      PreviewSrc: null,
    };
  },
  computed: {
    ...mapState('Authentication', ['authCompanyInfo']),
  },
  methods: {
    getStates(status) {
      const _obj = {};
      switch (status) {
        case 1:
          _obj.msg = '审核中......';
          _obj.class = 'unreviewed';
          break;
        case 2:
          _obj.msg = '已通过';
          _obj.class = 'verified';
          break;
        case 3:
          _obj.msg = '未通过';
          _obj.class = 'not-pass';
          break;

        default:
          _obj.msg = '未认证';
          _obj.class = '';
          break;
      }
      return _obj;
    },
    handlePicturePreview(url) {
      const tempList = this.authCompanyInfo.CreditPath.map(it => imgUrl + it);
      const index = tempList.findIndex(it => it === url);
      this.PreviewSrc = [...tempList.slice(index), ...tempList.slice(0, index)];
      this.showViewer = true;
    },
    getTransformTime() {
      // return ConvertTimeFormat(new Date(Time));
    },
    againAuthentication() {
      this.$emit('againAuthentication', true);
    },
  },
  mounted() {},
  destroyed() {},
};
</script>

<style lang="scss">
.authentication-info-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  // overflow-x: auto;
  section {
    .state {
      font-weight: bold;
      line-height: 20px;
      margin-top: 17px;
      display: flex;
      align-items: center;
      >span{
        >p{
          font-size: 14px;
          line-height: 18px;
          margin-top: 10px;
          &.title{
            font-size: 20px;
            line-height: 25px;
            margin: 0;
          }
        }
      }
      &.unreviewed{
        >i{
          background: url(../../assets/images/under-review.png) no-repeat;
          background-size: 60px;
          background-position: center center;
        }
        >span{
          .title{
            span{
              color: #F4A307;
            }
          }
        }
      }
      &.verified{
        >i{
          background: url(../../assets/images/success@2x.png) no-repeat;
          background-size: 60px;
          background-position: center center;
        }
        >span{
          .title{
            span{
              color: #52C41A;
            }
          }
        }
      }
      &.not-pass{
        >i{
          background: url(../../assets/images/error@2x.png) no-repeat;
          background-size: 60px;
          background-position: center center;
        }
        >span{
          .title{
            span{
              color: #FF0000;
            }
          }
        }
      }
      >i {
        width: 63px;
        height: 63px;
        margin-right: 20px;
      }
    }
    .message {
      font-size: 12px;
      line-height: 15px;
      margin-top: 7px;
      text-align: center;
      color: #888888;
      padding: 0 60px;
    }
    .form-item {
      color: #888888;
      display: flex;
      // padding: 0 56px;
      margin-top: 30px;
      align-items: flex-start;
      .label {
        min-width: 5em;
        text-align: right;
      }
      .content {
        flex: 1;
        display: flex;
        .images{
          display: flex;
          flex-direction: column;
          width: 373px;
          height: 263px;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          margin-right: 20px;
          span{
            width: 100%;
            height: 30px;
            background-color: #E6F7FF;
            text-align: center;
            line-height: 30px;
            color: #428DFA;
            &:hover{
              cursor: pointer;
            }
          }
        }
        .el-image {
          flex: 1;
        }
        .el-image + .el-image {
          margin-top: 10px;
        }
      }
      &.restart {
        text-align: center;
        justify-content: center;
        .el-button {
          width: 122px;
          height: 40px;
          margin-top: 27px;
          margin-bottom: 20px;
        }
      }
    }
  }
}
</style>
