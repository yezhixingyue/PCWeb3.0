<template>
  <section class="mp-pc-invoice-make-up-list-page-wrap">
    <MakeupListHeader @conditionChange="onConditionChange" />
    <main>
      <InvoiceListEmptyComp
        v-if="
          InvoiceMakeupOrderList.length === 0 && InvoiceMakeupOrderNumber === 0
        "
        :title="title"
        :loading="loading"
      />
      <MakeupListTableVue
        v-else
        :list="InvoiceMakeupOrderList"
        :loading="loading"
        :isSelectAll="isSelectAll"
        :validList.sync="validList"
        :invalidList.sync="invalidList"
        :isBackFromMakeup.sync="isBackFromMakeup"
      />
    </main>
    <MakeupListFooter
      :isSelectAll.sync="isSelectAll"
      :IsAllowInvoice="IsAllowInvoice"
      :validList="validList"
      :invalidList="invalidList"
      @margeMakeup="onMergeMakeupClick"
    />
  </section>
</template>

<script>
import { mapState } from 'vuex';
import MakeupListHeader from '../../../../components/InvoiceComps/Makeup/MakeupListHeader.vue';
import MakeupListTableVue from '../../../../components/InvoiceComps/Makeup/MakeupListTable.vue';
import InvoiceListEmptyComp from '../../../../components/InvoiceComps/InvoiceListEmptyComp.vue';
import MakeupListFooter from '../../../../components/InvoiceComps/Makeup/MakeupListFooter.vue';
import { InvoiceMakeUpStatusEnums } from '../../../../packages/InvoiceComps/enums';

export default {
  components: {
    MakeupListHeader,
    MakeupListTableVue,
    InvoiceListEmptyComp,
    MakeupListFooter,
  },
  data() {
    return {
      isSelectAll: false, // 全选数据 及 表格内选中数据 应保存至数据仓库中，在未保证返回时还原选中结果
      validList: [], // 有效列表 -- 当isSelectAll为false时使用，存放选中的订单id
      invalidList: [], // 无效列表 -- 当isSelectAll为true时使用，存在取消选中的订单id --- 当checkAll状态改变时，该两项列表都清空
      isBackFromMakeup: false,
    };
  },
  computed: {
    ...mapState('invoice', [
      'InvoiceMakeupOrderList',
      'InvoiceMakeupOrderNumber',
      'condition4InvoiceMakeupList',
      'loading',
      'curCondition4MakeupList',
    ]),
    ...mapState('common', ['customerInfo']),
    IsAllowInvoice() {
      return this.condition4InvoiceMakeupList.MakeupStatus === InvoiceMakeUpStatusEnums.canMakeup.ID;
    },
    title() {
      if (this.IsAllowInvoice) {
        return '可开票订单';
      }
      return '不可开票订单';
    },
  },
  methods: {
    async onMergeMakeupClick() {
      const temp = {
        ...this.curCondition4MakeupList,
        isSelectAll: this.isSelectAll,
        OrderID: this.isSelectAll ? this.invalidList : this.validList,
      };
      delete temp.Page;
      delete temp.PageSize;

      const resp = await this.api.getInvoiceMakeoutCombine(temp).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        if (!resp.data.Data) {
          this.messageBox.failSingleError({
            title: '合并开票失败',
            msg: '服务器返回数据异常',
          });
          return;
        }
        if (resp.data.Data.TotalInvoiceAmount === 0) {
          this.messageBox.failSingleError({
            title: '合并开票失败',
            msg: '开票金额必须大于0元',
          });
          return;
        }
        this.$store.commit('invoice/setCurCondition4MakeupList', temp);
        this.$store.commit('invoice/setCurCombineResult', resp.data);
        this.$router.push('/mySetting/invoiceMakeup/combine');
      }
    },
    onConditionChange() { // 条件发生变动，此时清除掉已选中订单，还原初始状态
      this.isSelectAll = null;
      this.$nextTick(() => {
        this.isSelectAll = false;
      });
    },
    getList(data = [1, false]) {
      this.$store.dispatch('invoice/getInvoiceMakeupOrderList', data);
      this.onConditionChange();
    },
  },
  watch: {
    customerInfo: {
      handler() {
        if (this.customerInfo && !this.customerInfo.PermissionInfo?.ApplyInvoice) { // 无权限 跳转至下单页面
          this.$router.replace('/placeOrder');
        }
      },
      immediate: true,
    },
  },
  // mounted() {
  //   this.getList();
  // },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name !== 'InvoiceCombineMakeupPage') {
        vm.getList([1, false]);
      } else {
        if (!vm.curCondition4MakeupList) {
          vm.getList([1, false]);
          return;
        }
        const _vm = vm;
        const { isSelectAll, OrderID } = vm.curCondition4MakeupList;
        if (isSelectAll) _vm.isBackFromMakeup = true;
        _vm.isSelectAll = isSelectAll || false;
        if (isSelectAll) {
          _vm.invalidList = OrderID || [];
        } else {
          _vm.validList = OrderID || [];
        }
        const _list = _vm.InvoiceMakeupOrderList;
        _vm.$store.commit('invoice/setInvoiceMakeupOrderList', [[]]);
        vm.$nextTick(() => {
          _vm.$store.commit('invoice/setInvoiceMakeupOrderList', [_list]);
          setTimeout(() => {
            const oApp = document.getElementById('app');
            oApp.scrollTop = to.meta.y;
          });
        });
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    const oApp = document.getElementById('app');
    const self = from;
    if (to.name === 'InvoiceCombineMakeupPage') {
      self.meta.y = oApp.scrollTop;
    } else {
      self.meta.y = 0;
    }
    next();
  },
};
</script>
<style lang='scss'>
// .mp-pc-invoice-make-up-list-page-wrap {
//   margin-left: -45px;
// }
</style>
