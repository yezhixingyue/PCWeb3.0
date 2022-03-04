<template>
  <section class="mp-pc-shopcar-page-table-comp-wrap">
    <div class="table-wrap">
      <el-table
        ref="multipleTable"
        :data="shoppingDataList"
        tooltip-effect="dark"
        stripe
        key="mp-pc-shopcar-page-table-comp-wrap"
        border
        style="width: 100%"
        :checkAllDisabled='handleCheckAllDisabled'
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" class-name="check-row" width="54" :selectable='handleSelectable'></el-table-column>
        <el-table-column label="产品" width="130" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.ProductParams.Attributes | getFullName}}</template>
        </el-table-column>
        <el-table-column label="尺寸" width="70" show-overflow-tooltip>
          <template slot-scope="scope">{{getSize(scope.row)}}</template>
        </el-table-column>
        <el-table-column label="数量" width="78" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.ProductParams.Attributes | formarProductAmount }}</template>
        </el-table-column>
        <el-table-column label="工艺" width="70" show-overflow-tooltip>
          <template slot-scope="scope">{{ getCraft(scope.row.ProductParams) }}</template>
        </el-table-column>
        <el-table-column label="原价" width="65" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.Funds.OriginalPrice }}元</template>
        </el-table-column>
        <el-table-column label="优惠券" show-overflow-tooltip width="65">
          <template slot-scope="scope"
            >{{ scope.row.Funds.CouponAmount > 0 ? '-' + +scope.row.Funds.CouponAmount.toFixed(2) : 0 }}元</template>
        </el-table-column>
        <el-table-column label="成交价" width="65" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.Funds.FinalPrice }}元</template>
        </el-table-column>
        <el-table-column label="定金" width="65" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.Funds.Deposit }}元</template>
        </el-table-column>
        <el-table-column prop="Content" label="文件内容" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.Content || '无'}}</template>
        </el-table-column>
        <el-table-column prop="Address.Address.Consignee" label="收货人" width="60" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="Address.Address.Mobile" label="收货人手机" width="90" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="配送方式" show-overflow-tooltip width="78">
          <template slot-scope="scope">{{ getExpress(scope.row.Address.Express) }}</template>
        </el-table-column>
        <el-table-column label="状态" show-overflow-tooltip width="75">
          <span
          slot-scope="scope"
          :title="scope.row._removeErrorText || ''"
          :class="{ 'is-pink': getStatus(scope.row).warn, 'is-success': getStatus(scope.row).success }"
          >{{ getStatus(scope.row).text }}</span>
        </el-table-column>
        <el-table-column label="操作" width="150" >
          <div class="menu-list" slot-scope="scope">
            <span class="span-title-blue" @click="handleSingleSubmit(scope.row)" :class="{disabled: scope.row._isOrder}">下单</span>
            <span @click="onDetailClick(scope.row)" class="span-title-blue detail">详情</span>
            <span class="span-title-pink" @click="handleDel(scope.row)">删除</span>
          </div>
        </el-table-column>
      </el-table>
    </div>
    <!-- 详情弹窗 -->
    <SubmitConfirmDialog :visible.sync="detailVisible" :OrderDetail='orderDetailData'
     :submitLabel='orderDetailData && !orderDetailData._isOrder ? "下单" : ""' @submit="onDetailSubmit" isCar />
    <!-- 预下单弹窗 -->
    <PreCreateDialog :visible.sync="preCreateVisible" :PreCreateData="PreCreateData" :OriginList='preCreateOriginDataList' @submit="onOrderSubmit" />
    <!-- 付款二维码弹窗 -->
    <QrCodeForPayDialogComp v-model="QrCodeVisible" :payInfoData="payInfoData" @success='handlePaidSuccess' payType='21' showPayGroup showPayDescription />
    <footer class="is-font-14">
      <div class="float">
        <div class="left">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkedAll" :disabled='handleCheckAllDisabled()'>全选</el-checkbox>
          <span class="gray">共检测出 <i class="is-pink">{{shoppingDataNumber}}</i> 个订单</span>
        </div>
        <div class="right">
          <span class="span-title-blue" @click="handleClearList">清除已上传订单</span>
          <span class="span-title-pink" @click="handleDel(null)">删除选中订单</span>
          <el-button type="primary" @click="handleSelectedSubmit">上传选中订单</el-button>
        </div>
      </div>
    </footer>
    <transition name="el-fade-in-linear">
      <footer class="is-font-14 floating" v-show="isFootFixed">
        <div class="float">
          <div class="left">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkedAll" :disabled='handleCheckAllDisabled()'>全选</el-checkbox>
            <span class="gray">共检测出 <i class="is-pink">{{shoppingDataNumber}}</i> 个订单</span>
          </div>
          <div class="right">
            <span class="span-title-blue" @click="handleClearList">清除已上传订单</span>
            <span class="span-title-pink" @click="handleDel(null)">删除选中订单</span>
            <el-button type="primary" @click="handleSelectedSubmit">上传选中订单</el-button>
          </div>
        </div>
      </footer>
    </transition>
  </section>
</template>

<script>
/* eslint-disable object-curly-newline */
import { mapState } from 'vuex';
import { throttle } from '@/assets/js/utils/throttle';
import { getFullName } from '@/assets/js/utils/filter';
import SubmitConfirmDialog from '@/components/QuotationComps/PlaceOrderComps/OrderSubmitComp/SubmitConfirmDialog/index.vue'; // 详情弹窗
import PreCreateDialog from '@/components/BatchUploadComps/PreCreateDialog/index.vue';
import QrCodeForPayDialogComp from '@/components/common/QrCodeForPayDialogComp';

export default {
  components: {
    SubmitConfirmDialog,
    PreCreateDialog,
    QrCodeForPayDialogComp,
  },
  data() {
    return {
      multipleSelection: [],
      h: 0,
      // difference: 0,
      // scrollTop: 0,
      isFootFixed: false,
      detailVisible: false,
      orderDetailData: null,
      preCreateVisible: false,
      preCreateOriginDataList: [], // 预下单原始列表数据，预下单确认后使用该列表数据生成订单
      PreCreateData: null, // 预下单数据（服务器返回数据）
      QrCodeVisible: false,
      payInfoData: null,
    };
  },
  computed: {
    ...mapState('shoppingCar', ['shoppingDataList', 'shoppingDataNumber']),
    ...mapState('common', ['ExpressList', 'ScrollInfo']),
    ...mapState('Quotation', ['RiskWarningTipsTypes']),
    scrollChange() {
      return this.ScrollInfo.scrollTop + this.ScrollInfo.scrollHeight + this.ScrollInfo.offsetHeight;
    },
    canSelectList() {
      const list = this.shoppingDataList.filter(it => !this.getStatus(it).success);
      return list;
    },
    checkedAll: {
      get() {
        return this.multipleSelection.length === this.canSelectList.length && this.multipleSelection.length > 0;
      },
      set(newVal) {
        if (newVal) {
          this.$refs.multipleTable.toggleAllSelection();
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
    },
    isIndeterminate() {
      return this.multipleSelection.length < this.canSelectList.length && this.multipleSelection.length > 0;
    },
    // isFootFixed() {
    //   // 140
    //   return this.difference - 140 - this.scrollTop > 0;
    // },
  },
  methods: {
    getHeight() {
      const oBody = document.getElementsByTagName('body')[0];
      return oBody.offsetHeight - 280;
    },
    setHeight() {
      const tempHeight = this.getHeight();
      this.h = tempHeight;
    },
    getSize({ ProductParams }) {
      const { Size } = ProductParams;
      return Size && Size.DisplayContent ? Size.DisplayContent : '';
    },
    getCraftFromItem(First, arr) {
      if (First && First.length > 0) {
        First.forEach(craft => {
          let _str = '';
          const { Attributes, PropertyList } = craft;
          const { NickName } = Attributes;
          _str += NickName;
          if (PropertyList.length > 1) _str += `${PropertyList.length}处`;
          else if (PropertyList.length === 1) {
            if (PropertyList[0].length > 0) {
              PropertyList[0].forEach(it => {
                const { ShowValue } = it;
                if (ShowValue) {
                  _str += ` ${ShowValue}`;
                }
              });
            }
          }
          arr.push(_str);
        });
      }
    },
    getCraft({ CraftList, PartList }) {
      const arr = [];
      CraftList.forEach(it => {
        if (it.Attributes) arr.push(it.Attributes.DisplayName);
      });
      if (Array.isArray(PartList) && PartList.length > 0) {
        PartList.forEach(_it => {
          _it.List.forEach(_it2 => {
            _it2.CraftList.forEach(_it3 => {
              if (_it3.Attributes) arr.push(_it3.Attributes.DisplayName);
            });
          });
        });
      }
      return [...new Set(arr.filter(it => it))].join('，');
    },
    getExpress({ First, Second }) {
      if (First === 1 && Second === 1) return '名片之家';
      if (this.ExpressList.length === 0) return '';
      let _str = '';
      const _first = this.ExpressList.find(it => it.Type === First);
      if (_first) {
        _str = _first.Name;
        const _second = _first.List.find(item => item.ID === Second);
        if (_second) _str += ` ${_second.Name}`;
      }
      return _str;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getStatus(item) {
      if (!item) return {};
      if (!item.FileErrorMessage) {
        // let text = '无订单文件';
        // if (Array.isArray(item.FileList)) {
        //   const t = item.FileList.find(it => it.List && it.List.length > 0);
        //   if (t) text = '文件已上传';
        // }
        // if (item.FileHaveUpload) return { text, warn: false, success: false };
        return { text: '', warn: false, success: false };
      }
      let warn = false;
      let success = false;
      if (item._isRemoveError) {
        warn = true;
        success = false;
      }
      if (item._isOrder) {
        warn = false;
        success = true;
      }
      return { text: item.FileErrorMessage, warn, success };
    },
    onDetailClick(row) {
      // this.$store.commit('shoppingCar/setCurShoppingCarDetailData', row);
      // this.$router.push('/shopping/detail');
      this.orderDetailData = row;
      this.detailVisible = true;
    },
    handleSelectedSubmit() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择订单');
        return;
      }
      this.handlePreCreateSubmit(this.multipleSelection);
    },
    handleSingleSubmit(row) {
      if (row._isOrder || row._isPaid) return;
      this.handlePreCreateSubmit([row]);
    },
    async handlePreCreateSubmit(list) {
      const res = await this.$store.dispatch('shoppingCar/getOrderPreCreateFromShoppingCar', list);
      if (res) {
        console.log(res);
        const { PreCreateData, OriginList } = res;
        this.PreCreateData = PreCreateData;
        this.preCreateOriginDataList = OriginList;
        this.preCreateVisible = true;
      }
    },
    async onOrderSubmit({ OriginList, PayInFull, UsePrintBean }) {
      this.preCreateVisible = false;
      const List = OriginList.map(it => ({ ...it, Position: 255, IgnoreRiskLevel: this.RiskWarningTipsTypes.All }));
      const _requestObj = { List, OrderType: 2, PayInFull, UsePrintBean };
      const resp = await this.api.CreateOrderFromPreCreate(_requestObj, { closeLoading: false, closeTip: false }).catch(() => null);
      if (resp && resp.data.Status === 1000) { // 下单成功
        // 修改列表数据状态
        this.$store.dispatch('common/getCustomerFundBalance'); // 重新获取客户余额信息
        this.$store.commit('shoppingCar/setShoppingDataStatusAfterSubmit', { List, Msg: '已下单', _isOrder: true, _isPaid: false });
        this.multipleSelection = this.multipleSelection.filter(it => !it._isOrder);
        if (resp.data.Data) {
          // const { FundBalance, FundBeanNumber } = resp.data.Data;
          // const temp = {};
          // if (typeof FundBalance === 'number') {
          //   temp.FundBalance = FundBalance;
          // }
          // if (typeof FundBeanNumber === 'number') {
          //   temp.FundBeanNumber = FundBeanNumber;
          // }
          // this.$store.commit('common/setCustomerBalance', temp);
          this.payInfoData = resp.data.Data;
          this.QrCodeVisible = true;
        } else {
          this.messageBox.successSingle({
            title: '下单成功!',
            successFunc: () => {
              this.$store.commit('shoppingCar/setShoppingDataStatusAfterSubmit', { List, Msg: '已付款', _isOrder: true, _isPaid: true });
            },
          });
        }
      }
    },
    handlePaidSuccess() {
      this.messageBox.successSingle({ title: '下单并支付成功' });
      this.$store.dispatch('common/getCustomerFundBalance'); // 重新获取客户余额信息
      this.$store.commit('shoppingCar/setShoppingDataStatusAfterSubmit', { List: this.preCreateOriginDataList, Msg: '已付款', _isOrder: true, _isPaid: true });
    },
    handleDel(item) {
      if (item && item._isOrder) {
        this.$store.commit('shoppingCar/clearShoppingDataList', [item]);
        this.$message({
          message: '已删除',
          type: 'success',
        });
        return;
      }
      if (!item && this.multipleSelection.length === 0) {
        this.$message.error('请选择订单');
        return;
      }
      const title = item ? '确定删除该订单吗' : '确定删除选中订单吗';
      let msg = '';
      if (item) {
        if (!item.ProductParams || !item.ProductParams.Attributes) return;
        const _name = getFullName(item.ProductParams.Attributes);
        if (!_name) return;
        msg = `订单产品：[ ${_name} ]`;
      } else {
        if (!this.multipleSelection) return;
        msg = `[ 共有 ${this.multipleSelection.length} 条订单被选中 ]`;
      }
      this.messageBox.warnCancelBox({
        title,
        msg,
        successFunc: () => {
          const list = item ? [item] : this.multipleSelection;
          this.$store.dispatch('shoppingCar/getQuotationRemove', list);
        },
      });
    },
    handleClearList() {
      const list = this.shoppingDataList.filter(it => it._isOrder);
      this.$store.commit('shoppingCar/clearShoppingDataList', list);
    },
    handleScroll(oEl) {
      if (!oEl) return;
      const { scrollTop, scrollHeight, offsetHeight } = oEl;
      this.$store.commit('common/setScrollInfo', { scrollTop, scrollHeight, offsetHeight });
    },
    onDetailSubmit() {
      this.detailVisible = false;
      this.handleSingleSubmit(this.orderDetailData);
    },
    handleSelectable(data) { // 判断当前行是否可以被勾选
      return !data._isOrder;
    },
    handleCheckAllDisabled() {
      const list = this.shoppingDataList.filter(it => !it._isOrder);
      return list.length === 0;
    },
  },
  mounted() {
    this.oApp = document.getElementById('app');
    this.$nextTick(() => {
      this.handleScroll(this.oApp);
    });
  },
  watch: {
    shoppingDataList: {
      handler() {
        this.$nextTick(() => {
          if (this.oBtn) return;
          const oBtn = document.querySelector('.mp-pc-shopcar-page-table-comp-wrap .el-table__header .check-row');
          if (!oBtn) return;
          this.oBtn = oBtn;
          oBtn.click = null;
          const _func = throttle((e) => {
            if (e.target.nodeName === 'TH') {
              if (!this.checkedAll) {
                this.$refs.multipleTable.toggleAllSelection();
              } else {
                this.$refs.multipleTable.clearSelection();
              }
            }
          }, 10);
          oBtn.addEventListener('click', _func, false);
        });
      },
      immediate: true,
    },
    scrollChange() {
      const { scrollTop, scrollHeight, offsetHeight } = this.ScrollInfo;
      const difference = scrollHeight - offsetHeight;
      if (difference - 156 - scrollTop > 0) this.isFootFixed = true;
      else this.isFootFixed = false;
    },
  },
};
</script>

<style lang="scss">
.mp-pc-shopcar-page-table-comp-wrap {
  > .table-wrap {
    min-height: calc(100vh - 130px - 140px);
    > .el-table {
      .has-gutter > tr > th {
        &.check-row {
          padding-right: 20px;
          cursor: pointer;
          &::after{
            top: 13px;
            height: 15px;
            width: 30px;
            left: 25px;
            content: '全选';
            font-size: 12px;
            background-color: rgb(245, 245, 245);
            color: #39588a;
          }
          > .cell {
            pointer-events: none;
          }
        }
      }
      .el-table__body {
      tbody {
        tr {
          td {
            &.check-row {
              padding-right: 20px;
            }
            > .cell {
              padding: 0 2px;
              > .menu-list {
                > span {
                  font-size: 12px;
                  &.detail {
                    margin: 0 15px;
                  }
                }
              }
            }
          }
        }
      }
      }
    }
  }
  > footer {
    width: 100%;
    > div {
      height: 65px;
      width: 1200px;
      padding: 15px 0 10px 0;
      box-sizing: border-box;
      line-height: 40px;
      margin: 0 auto;
      > .left {
        float: left;
        padding-left: 10px;
        > .gray {
          margin-left: 16px;
        }
      }
      > .right {
        float: right;
        padding-right: 5px;
        > .span-title-pink {
          margin: 0 35px;
        }
      }
    }

    &.floating {
      position: fixed;
      bottom: 0;
      background-color: #fff;
      left: 0;
      right: 10px;
      box-shadow: 0px 0px 14px 7px rgba(136, 136, 136, 0.3);
      z-index: 10;
      // transition: 0.3s;
      > div {
        position: relative;
        left: -8px;
      }
    }
  }
  .page-pay-info-box {
    .customer {
      padding-bottom: 15px;
      > p {
        padding-bottom: 16px;
      }
    }
    .item {
      font-size: 14px;
      padding-bottom: 15px;
      > span {
        display: inline-block;
        width: 50%;
        &.k {
          text-align: right;
        }
        &.v {
          text-align: left;
        }
      }
      &.amount {
        .is-origin {
          font-size: 15px;
        }
      }
      &.bean .v{
        text-indent: 1em;
      }
    }
  }
}
</style>
