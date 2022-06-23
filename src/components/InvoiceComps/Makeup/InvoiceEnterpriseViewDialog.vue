<template>
  <CommonDialogComp
      width="625px"
      top="18vh"
      title="资质信息"
      cancelText="关闭"
      submitText="前往发票查询"
      :visible.sync="localVisible"
      :showSubmit="EnterpriseData.EnterpriseStatus === EnterpriseCheckStatusEnums.rejected.ID"
      @cancle="localVisible = false"
      @submit="onSubmit"
      class="mp-erp-invoice-enterprise-info-view-comp-dialog-comp-wrap"
    >
      <!-- 内容区 -->
      <ul v-if="EnterpriseData" class="content">
        <li>
          <label for="">抬头名称：</label>
          <span>{{EnterpriseData.EnterpriseName}}</span>
        </li>
        <li>
          <label for="">统一社会信用代码：</label>
          <span>{{EnterpriseData.CreditCode}}</span>
        </li>
        <li>
          <label for="">注册地址：</label>
          <span>{{EnterpriseData.RegisteredAddress}}</span>
        </li>
        <li>
          <label for="">注册电话：</label>
          <span>{{EnterpriseData.RegisteredTelephone}}</span>
        </li>
        <li>
          <label for="">开户银行：</label>
          <span>{{EnterpriseData.OpeningBank}}</span>
        </li>
        <li>
          <label for="">银行账号：</label>
          <span>{{EnterpriseData.BankAccount}}</span>
        </li>
        <li style="margin-top:18px">
          <label for="">当前状态：</label>
          <span :class="{
            'is-gray': EnterpriseData.EnterpriseStatus === EnterpriseCheckStatusEnums.checking.ID,
            'is-pink': EnterpriseData.EnterpriseStatus === EnterpriseCheckStatusEnums.rejected.ID,
          }">{{EnterpriseData.EnterpriseStatus | formatStatus}}</span>
        </li>
      </ul>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '../../../packages/CommonDialogComp';
import { EnterpriseCheckStatusEnums, EnterpriseCheckStatusEnumList } from '../../../packages/InvoiceComps/enums';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    EnterpriseData: {
      type: Object,
      default: () => ({}),
    },
  },
  filters: {
    formatStatus(EnterpriseStatus) {
      const t = EnterpriseCheckStatusEnumList.find(it => it.ID === EnterpriseStatus);
      return t ? t.Name : '';
    },
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      EnterpriseCheckStatusEnums,
    };
  },
  computed: {
    localVisible: {
      get() {
        return this.visible;
      },
      set(bool) {
        this.$emit('update:visible', bool);
      },
    },
  },
  methods: {
    onSubmit() {
      this.$emit('jumpSearch');
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-invoice-enterprise-info-view-comp-dialog-comp-wrap {
  .el-dialog__body {
    padding-left: 65px;
    ul.content {
      > li {
        padding: 9px 10px;
        line-height: 18px;
        > label {
          display: inline-block;
          text-align: right;
          width: 160px;
          margin-right: 6px;
          color: #888;
          vertical-align: top;
        }
        > span {
          display: inline-block;
          width: 350px;
          vertical-align: top;
          font-size: 13px;
          color: #444;
        }
      }
    }
  }
}
</style>
