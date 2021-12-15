<template>
  <ul class="mp-batch-upload-page-header-comps-customer-select-comp-wrap">
    <!-- 搜索区域 -->
    <li class="search">
      <el-popover
        placement="bottom-start"
        width="328"
        trigger="manual"
        popper-class='mp-batch-upload-page-header-comps-customer-select-popper-wrap'
        v-model="visible"
      >
        <!-- 输入框 -->
        <el-input
          slot="reference"
          @focus="visible = true"
          @blur="visible = false"
          @input="handleInput"
          v-model.trim="inpVal"
          :disabled='loading || disabled'
          placeholder="请输入客户关键词"
          size="mini"
          ref="oInp"
        ></el-input>
        <!-- 弹出框显示区域 -->
        <ul class="customer-list">
          <li v-if="options.length === 0" class="empty">
            <span v-if="!loading && !inpVal">请输入客户关键词</span>
            <span v-else-if="loading"> <i class="el-icon-loading"></i> 正在检索信息...</span>
            <span v-else-if="!loading && inpVal && catchQueryString === inpVal">没有搜索到客户，请检查关键词</span>
            <span v-else>正在输入</span>
          </li>
          <li v-for="it in options" :key="it.CustomerID" @click="onItemClick(it)" class="item">
            <span>{{it.CustomerSN}}</span>
            <span class="name" :title="it.CustomerName">{{it.CustomerName}}</span>
            <span>{{it.Mobile}}</span>
          </li>
        </ul>
      </el-popover>
      <!-- 搜索按钮 -->
      <el-button type="primary" size="mini" @click="remoteMethod" :disabled='loading || disabled'>
        <img src="@/assets/images/search.png" alt="" />
      </el-button>
    </li>
    <li v-if="!customer" class="empty">
      <span>尚未选中客户！</span>
    </li>
    <template v-else>
      <li class="name is-bold">
        <span :title="customer.CustomerName && customer.CustomerName.length > 17 ? customer.CustomerName :''">{{customer.CustomerName || ''}}</span>
        <span v-if="customer.CustomerSN">（ {{customer.CustomerSN}} ）</span>
      </li>
      <li class="level is-gray"  v-if="customer.Type && customer.Grade">
        <span>{{customer.Type.Second || ''}}{{customer.Grade.Second || ''}}</span>
      </li>
      <li class="area is-gray" v-if="customer.Location">
        <span>{{customer.Location.RegionalName || ''}}{{customer.Location.CityName || ''}}{{customer.Location.CountyName || ''}}</span>
      </li>
      <li class="rechange" v-if="Amount || Amount === 0">
        <span>余额：</span>
        <span class="is-pink">￥{{Amount}}元</span>
        <RechargeComp :customer='customer' @success="handleRechargeSuccess" />
      </li>
    </template>
  </ul>
</template>

<script>
import { debounce } from '@/assets/js/utils/throttle';
import RechargeComp from './RechargeComp.vue';

export default {
  props: {
    customer: {
      type: Object,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    RechargeComp,
  },
  data() {
    return {
      inpVal: '',
      loading: false,
      options: [],
      visible: false,
      catchQueryString: '',
      rechangeVisible: false, // 充值窗口
    };
  },
  computed: {
    Amount() {
      if (!this.customer || !this.customer.FundInfo) return '';
      if (this.customer.FundInfo.Amount || this.customer.FundInfo.Amount === 0) return this.customer.FundInfo.Amount;
      return '';
    },
  },
  methods: {
    async remoteMethod() {
      if (!this.visible) this.visible = true;
      if (this.catchQueryString === this.inpVal && this.inpVal) {
        this.$nextTick(() => {
          this.$refs.oInp.focus();
        });
        return;
      }
      this.options = [];
      if (this.inpVal) {
        const temp = {
          FieldType: 3,
          KeyWords: this.inpVal,
          PageSize: 10,
          Page: 1,
        };
        this.loading = true;
        const resp = await this.api.getCustomerList(temp, { closeLoading: true }).catch(() => null);
        this.loading = false;
        if (resp && resp.data.Status === 1000) {
          this.options = resp.data.Data;
          this.catchQueryString = this.inpVal;
        } else {
          this.catchQueryString = '';
        }
      } else {
        this.catchQueryString = '';
      }
      this.$nextTick(() => {
        this.$refs.oInp.focus();
      });
    },
    onItemClick(item) { // 选中客户
      if (!item) return;
      this.$emit('setCustomer', item);
    },
    handleRechargeSuccess(allAmount) { // 充值成功
      this.$emit('pay', allAmount);
    },
  },
  created() {
    this.handleInput = debounce(this.remoteMethod, 300);
  },
  watch: {
    loading(val) {
      if (val) {
        this.$nextTick(() => {
          if (!this.visible) this.visible = true;
        });
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-batch-upload-page-header-comps-customer-select-comp-wrap {
  height: 50px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding-bottom: 22px;
  > li {
    white-space: nowrap;
    &.search {
      display: flex;
      align-items: center;
      width: 300px;
      overflow: hidden;
      margin-right: 38px;
      > button {
        padding: 0;
        height: 28px;
        width: 60px;
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
      }
      .el-input {
        width: 240px;
        input {
          border-bottom-right-radius: 0;
          border-top-right-radius: 0;
          border-right: none;
        }
      }
    }
    &.empty {
      color: #989898;
    }
    &.name {
      margin-right: 13px;
      display: flex;
      max-width: 325px;
      overflow: hidden;
      > span {
        flex: none;
        &:first-of-type {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    &.level {
      margin-right: 24px;
    }
    &.area {
      margin-right: 35px;
    }
  }
}
.mp-batch-upload-page-header-comps-customer-select-popper-wrap {
  padding-left: 7px;
  padding-right: 7px;
  .customer-list {
    font-size: 12px;
    color: #585858;
    > li {
      display: flex;
      line-height: 28px;
      padding: 1px 9px;
      cursor: pointer;
      &.item > span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &:first-of-type {
          width: 95px;
        }
        &:last-of-type {
          width: 90px;
          text-align: right;
        }
        &.name {
          flex: 1;
        }
      }
      &.item:hover {
        background-color: #eee;
      }
      &.empty {
        color: #888;
        i {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
