<template>
  <section class="mp-pc-my-setting-page-sub-account-page-wrap">
    <header>
      <span class="blue-v-line is-bold is-black">子账号管理</span>
      <span class="is-font-12">（ 共检测出<i class="is-pink is-font-16"> {{customerAccountList.length}} </i>条记录 ）</span>
    </header>
    <ul class="content" v-if="customerInfo">
      <li v-for="item in customerAccountList" :key="item.AccountID"
          class="account-item" :class="{main:!item.IsBranch, active:customerInfo.Account.AccountID === item.AccountID}">
        <div class="account-item-header">
          <i class="iconfont icon-yonghu1"></i>
          <span>{{item.NickName}}</span>
          <span class="is-font-12 is-gray">{{customerInfo.Account.AccountID === item.AccountID ? ' ( 当前用户 )' : ''}}</span>
        </div>
        <div class="account-item-content">
          <p>
            <i class="iconfont icon-dianhua"></i>
            <span>{{ item.Mobile }}</span>
          </p>
          <p class="add-date">添加时间：{{item.CreateTime | format2MiddleLangTypeDate}}</p>
        </div>
        <div class="account-item-footer">
          <span class="span-title-blue"  @click="handleEdit(item)" v-if="IsPrimaryAccount || customerInfo.Account.AccountID === item.AccountID">编辑</span>
          <!-- <span class="span-title-blue disabled" v-else>编辑</span> -->
          <span class="span-title-pink" @click="handleDel(item)" v-if="IsPrimaryAccount">删除</span>
          <!-- <span class="span-title-pink disabled" v-else>删除</span> -->
        </div>
        <div class="account-item-sign">管理员</div>
      </li>
      <li class="add-new-account-box" @click="handleAddNewAccount" v-if="IsPrimaryAccount">
        <i class="el-icon-plus"></i>
        <span>新增子账号</span>
      </li>
    </ul>
    <el-dialog
      :visible.sync="dialogVisible"
      width="700px"
      custom-class="set-craft-dia"
      :before-close="handleFormCancel"
      v-dialogDrag>
      <header slot="title">
        <i class="iconfont icon-zengjia is-primary-blue"></i>
        <span>{{dialogTitle}}</span>
      </header>
      <!-- 弹窗表单区域 -->
      <el-form :model="subAccountForm" ref="subAccountForm" :rules="rules" label-width="100px"
       class="account-ruleForm" v-if="customerInfo" @submit.native.prevent>
        <el-form-item label="登录手机号：" prop="Mobile">
          <el-input
            v-banAutoComplete
            v-model.trim="Mobile"
            :disabled='!subAccountForm.IsBranch || subAccountForm.AccountID === customerInfo.Account.AccountID'
          />
        </el-form-item>
        <el-form-item label="姓名：" prop="NickName">
          <el-input v-banAutoComplete v-model.trim="subAccountForm.NickName"></el-input>
        </el-form-item>
        <template v-if="subAccountForm.IsBranch && (!subAccountForm.AccountID || subAccountForm.AccountID !== customerInfo.Account.AccountID) && dialogVisible">
          <el-form-item label="密码：" prop="Password">
            <el-input
               v-banAutoComplete
               type="password"
              :placeholder="placeholder"
              :disabled='!subAccountForm.IsBranch' v-model.trim="subAccountForm.Password"
            />
          </el-form-item>
          <el-form-item label="确认密码：" prop="rePassword">
            <el-input
               v-banAutoComplete
               type="password"
              :placeholder="placeholder"
              :disabled='!subAccountForm.IsBranch'
               v-model.trim="subAccountForm.rePassword"
            />
          </el-form-item>
        </template>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('subAccountForm')">确 定</el-button>
        <el-button @click="handleFormCancel">取 消</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('common', ['customerAccountList', 'customerInfo']),
    placeholder() {
      if (!this.dialogVisible) return '';
      if (this.isEdit) return '不修改密码则不用填写';
      return '';
    },
    Mobile: {
      get() {
        return this.subAccountForm.Mobile;
      },
      set(newVal) {
        this.subAccountForm.Mobile = newVal.replace(/[^\d]/g, '');
      },
    },
    IsPrimaryAccount() { // 当前登录用户是否为子账号
      if (this.customerInfo) {
        return !this.customerInfo.Account.IsBranch;
      }
      return false;
    },
  },
  data() {
    const validateMobile = (rule, value, callback) => {
      if (this.validateCheck(value, this.defineRules.Mobile, callback)) callback();
    };
    const validatePassword = (rule, value, callback) => {
      if (!value && !this.subAccountForm.rePassword && this.isEdit) callback();
      if (this.validateCheck(value, this.defineRules.Password, callback)) {
        if (this.subAccountForm.rePassword !== '') this.$refs.subAccountForm.validateField('rePassword');
        callback();
      }
    };
    const validateRePassword = (rule, value, callback) => {
      if (!value && !this.subAccountForm.Password && this.isEdit) callback();
      if (this.validateCheck(value, this.defineRules.Password, callback)) {
        if (this.subAccountForm.rePassword !== this.subAccountForm.Password) callback(new Error('两次密码输入不一致'));
        else callback();
      }
    };
    return {
      dialogVisible: false,
      dialogTitle: '',
      isEdit: false,
      subAccountForm: {
        Mobile: '',
        NickName: '',
        Password: '',
        rePassword: '',
        IsBranch: true,
        AccountID: '',
      },
      rules: {
        NickName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          {
            min: 1, max: 5, message: '长度最大为 5 个字符', trigger: 'blur',
          },
        ],
        Password: [
          { validator: validatePassword, trigger: 'blur' },
        ],
        rePassword: [
          { validator: validateRePassword, trigger: 'blur' },
        ],
        Mobile: [
          { validator: validateMobile, trigger: 'blur' },
        ],
      },
      defineRules: {
        Mobile: [
          { strategy: 'isNotEmpty', errorMsg: '请输入手机号!' },
          { strategy: 'shouldLength:11', errorMsg: '请输入11位手机号码' },
          { strategy: 'isPhone', errorMsg: '手机号码格式不正确' },
        ],
        Password: [
          { strategy: 'isNotEmpty', errorMsg: '请输入密码!' },
          { strategy: 'minLength:6', errorMsg: '密码最小长度为6位' },
          { strategy: 'maxLength:16', errorMsg: '密码最大长度为16位' },
        ],
      },
    };
  },
  methods: {
    handleEdit(item) {
      this.isEdit = true;
      const {
        AccountID, IsBranch, NickName, Mobile,
      } = item;
      this.initSubAccountForm(AccountID, IsBranch, NickName, Mobile);
      this.dialogTitle = IsBranch ? '编辑子账号' : '编辑主账号';

      this.dialogVisible = !this.dialogVisible;
    },
    handleDel(item) {
      if (!item) return;
      const { AccountID, NickName } = item;
      if (!AccountID) return;
      this.messageBox.warnCancelBox({
        title: '确定删除该子账号吗?',
        msg: `账号： [ ${NickName} ]`,
        successFunc: async () => {
          const res = await this.api.getCustomerRemoveAccount(AccountID);
          if (res.data.Status === 1000) {
            this.messageBox.successSingle({
              title: '删除成功',
              successFunc: () => {
                this.$store.dispatch('common/getCustomerAccountList', true);
              },
            });
          }
        },
      });
    },
    initSubAccountForm(AccountID, IsBranch, NickName, Mobile) { // 初始化表单操作
      this.subAccountForm.AccountID = AccountID;
      this.subAccountForm.IsBranch = IsBranch;
      this.subAccountForm.NickName = NickName;
      this.subAccountForm.Mobile = Mobile;
      this.subAccountForm.Password = '';
      this.subAccountForm.rePassword = '';
    },
    handleAddNewAccount() {
      if (this.customerInfo.Account.IsBranch) {
        this.messageBox.failSingle({ msg: '无操作权限' });
        return;
      }
      this.isEdit = false;
      this.dialogTitle = '添加子账号';
      this.initSubAccountForm('', true, '', '');

      this.dialogVisible = !this.dialogVisible;
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const _obj = { ...this.subAccountForm };
          delete _obj.rePassword;
          if (!_obj.AccountID) delete _obj.AccountID;
          const res = await this.api.getCustomerEditSubAccount(_obj);
          if (res.data.Status === 1000) {
            const title = this.isEdit ? '编辑成功' : '添加成功';
            this.messageBox.successSingle({
              title,
              successFunc: () => {
                this.dialogVisible = false;
                this.$store.dispatch('common/getCustomerAccountList', true);
              },
            });
          }
        }
      });
    },
    handleFormCancel() {
      this.dialogVisible = false;
      this.initSubAccountForm('', true, '', '');
      this.$refs.subAccountForm.resetFields();
    },
  },
  mounted() {
    this.$store.dispatch('common/getCustomerAccountList');
  },
};
</script>

<style lang='scss'>
.mp-pc-my-setting-page-sub-account-page-wrap {
  > .content {
    padding-top: 35px;
    > li {
      width: 290px;
      height: 160px;
      box-sizing: border-box;
      box-shadow: 0px 5px 12px 1px rgba(238, 238, 238, 0.59);
      border-radius: 5px;
      border: solid 1px #eeeeee;
      display: inline-block;
      vertical-align: text-top;
      margin-right: 25px;
      margin-bottom: 25px;
      transition: 0.1s;

      &:hover {
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.15);
        // transform: scale(1.02);
      }
      &.add-new-account-box {
        color: #aaa;
        text-align: center;
        padding-top: 68px;
        cursor: pointer;
        user-select: none;
        > i {
          font-size: 19px;
          margin-right: 9px;
          vertical-align: -5%;
        }
        &:active {
          background-color: #eee;
        }
        &:hover {
          color: #428dfa;
        }
      }
      &.account-item {
        padding-left: 10px;
        padding-right: 4px;
        position: relative;
        > .account-item-header {
          height: 28px;
          border-bottom: 1px dashed #eee;
          vertical-align: bottom;
          padding-top: 22px;
          padding-left: 5px;
        }
        > .account-item-content {
          padding-left: 5px;
          padding-top: 21px;
          user-select: none;
          > p {
            &.add-date {
              margin-top: 26px;
              font-size: 12px;
              color: #888;
            }
          }
        }
        > .account-item-footer {
          margin-top: 9px;
          text-align: right;
          padding-right: 13px;
          > span {
            &.span-title-pink {
              margin-left: 4px;
              margin-right: -6px;
            }
            &.disabled {
              cursor: not-allowed !important;
            }
          }
        }

        > .account-item-sign {
          width: 70px;
          height: 22px;
          background-color: #ff3769;
          border-radius: 0px 0px 5px 5px;
          position: absolute;
          top: 0;
          right: 16px;
          color: #fff;
          font-size: 12px;
          text-align: center;
          line-height: 19px;
          user-select: none;
          display: none;
        }
        &.active {
          i.iconfont {
            color: #428dfa;
          }
          > .account-item-footer {
            > .span-title-pink {
              display: none;
            }
          }
        }
        &.main {
          > .account-item-sign {
            display: block;
          }
        }
        i.iconfont {
          color: #ddd;
          margin-right: 12px;
        }
      }
    }
  }
  > .el-dialog__wrapper {
    > .el-dialog {
      > .el-dialog__header > header {
        color: #585858;
      }
      > .el-dialog__body {
        height: 208px;
        > .el-form {
          width: 345px;
          // margin: 0 auto;
          margin-left: 160px;
          > .el-form-item {
            height: 30px;
            > .el-form-item__label {
              color: #888;
              height: 30px;
              line-height: 30px;
              &::before {
                display: none;
              }
            }
            > .el-form-item__content {
              width: 240px;
              height: 30px;
              > .el-input {
                width: 240px;
                height: 30px;
                > input {
                  height: 30px;
                  line-height: 26px\0;
                  vertical-align: top;
                  &::placeholder {
                    color: #cbcbcb;
                    font-size: 13px;
                  }
                }
                &.is-disabled .el-input__inner {
                  background-color: #f8f8f8
                }
              }
            }
          }
        }
      }
      > .el-dialog__footer {
        margin-top: 20px;
        padding-bottom: 25px;
        padding-left: 66px;
        text-align: center;
        > .dialog-footer {
          > button {
            width: 120px;
            height: 35px;
            padding: 0;
            & + button {
              margin-left: 50px;
            }
          }
        }
      }
    }
  }
}
</style>
