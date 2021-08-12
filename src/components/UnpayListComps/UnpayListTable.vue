<template>
  <section class="mp-pc-unpay-list-page-table-comp-wrap">
    <div class="table-wrap">
      <el-table
        ref="multipleTable"
        :data="unpayDataList"
        tooltip-effect="dark"
        stripe
        border
        key="mp-pc-unpay-list-page-table-comp-wrap"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" class-name="check-row" width="54"></el-table-column>
        <el-table-column label="产品" width="130" show-overflow-tooltip>
          <template slot-scope="scope">{{getName(scope.row)}}</template>
        </el-table-column>
        <el-table-column label="尺寸" width="70" show-overflow-tooltip>
          <template slot-scope="scope">{{getSize(scope.row)}}</template>
        </el-table-column>
        <el-table-column label="数量" width="78" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.ProductAmount+scope.row.Unit}}</span>
            <i v-if="scope.row.KindCount>1">{{scope.row.KindCount}}款</i>
          </template>
        </el-table-column>
        <el-table-column label="工艺" width="70" show-overflow-tooltip>
          <template slot-scope="scope">{{ getCraft(scope.row) }}</template>
        </el-table-column>
        <el-table-column label="原价" width="65" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.Funds.OriginalPrice }}元</template>
        </el-table-column>
        <el-table-column label="优惠券" show-overflow-tooltip width="65">
          <template slot-scope="scope"
            >{{ scope.row.Funds.CouponAmount > 0 ? '-' + scope.row.Funds.CouponAmount : 0 }}元</template>
        </el-table-column>
        <el-table-column label="成交价" width="65" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.Funds.FinalPrice }}元</template>
        </el-table-column>
        <el-table-column label="定金" width="65" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.Funds.Deposit }}元</template>
        </el-table-column>
        <el-table-column prop="Content" label="文件内容" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Package.Address.Address.Consignee" label="收货人" width="60" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="Package.Address.Address.Mobile" label="收货人手机" width="90" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="配送方式" prop="Express" show-overflow-tooltip width="78">
          <!-- <template slot-scope="scope">{{ getExpress(scope.row.Address.Express) }}</template> -->
        </el-table-column>
        <el-table-column label="状态" show-overflow-tooltip width="75">
          <span slot-scope="scope" :class="{
            'is-pink': scope.row.Status === 10,
            'is-cancel': scope.row.Status === 254,
            'is-cyan': typeof scope.row.Status === 'string',
          }">{{scope.row.Status | formatStatus}}</span>
        </el-table-column>
        <el-table-column label="操作" width="150" >
          <div class="menu-list" slot-scope="scope">
            <span class="span-title-blue" v-if="scope.row.Status===10" @click="handleSingleSubmit(scope.row)">付款</span>
            <span class="is-cancel" v-else>付款</span>
            <span @click="onDetailClick(scope.row)" class="span-title-blue detail">详情</span>
            <span class="span-title-pink" v-if="scope.row.Status === 10" @click="handleDel(scope.row)">取消</span>
            <span class="is-cancel" v-else >取消</span>
          </div>
        </el-table-column>
      </el-table>
    </div>
    <!-- <footer class="float floating is-font-14 ">
      <div class="left">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkedAll">全选</el-checkbox>
        <span class="gray">共检测出 <i class="is-pink">{{unpayDataNumber}}</i> 个订单</span>
      </div>
      <div class="right">
        <span class="span-title-blue" @click="handleClearList">清除已付款已取消订单</span>
        <span class="span-title-pink" @click="handleDel(null)">取消选中订单</span>
        <el-button type="primary" @click="handleSelectedSubmit">支付选中订单</el-button>
      </div>
    </footer> -->
    <footer class="is-font-14">
      <div class="float">
        <div class="left">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkedAll">全选</el-checkbox>
          <span class="gray">共检测出 <i class="is-pink">{{unpayDataNumber}}</i> 个订单</span>
        </div>
        <div class="right">
          <span class="span-title-blue" @click="handleClearList">清除已付款已取消订单</span>
          <span class="span-title-pink" @click="handleDel(null)">取消选中订单</span>
          <el-button type="primary" @click="handleSelectedSubmit">支付选中订单</el-button>
        </div>
      </div>
    </footer>
    <transition name="el-fade-in-linear">
      <footer class="is-font-14 floating" v-show="isFootFixed">
        <div class="float">
          <div class="left">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkedAll">全选</el-checkbox>
            <span class="gray">共检测出 <i class="is-pink">{{unpayDataNumber}}</i> 个订单</span>
          </div>
          <div class="right">
            <span class="span-title-blue" @click="handleClearList">清除已付款已取消订单</span>
            <span class="span-title-pink" @click="handleDel(null)">取消选中订单</span>
            <el-button type="primary" @click="handleSelectedSubmit">支付选中订单</el-button>
          </div>
        </div>
      </footer>
    </transition>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import { throttle } from '@/assets/js/utils/throttle';

export default {
  data() {
    return {
      multipleSelection: [],
      h: 0,
      isFootFixed: false,
    };
  },
  computed: {
    ...mapState('unpayList', ['unpayDataList', 'unpayDataNumber']),
    ...mapState('common', ['ScrollInfo']),
    scrollChange() {
      return this.ScrollInfo.scrollTop + this.ScrollInfo.scrollHeight + this.ScrollInfo.offsetHeight;
    },
    checkedAll: {
      get() {
        return this.multipleSelection.length === this.unpayDataNumber && this.multipleSelection.length > 0;
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
      return this.multipleSelection.length < this.unpayDataNumber && this.multipleSelection.length > 0;
    },
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
    getName({ ProductName, SecondLevelName }) {
      return `${SecondLevelName}-${ProductName}`;
    },
    getSize({ SizeList }) {
      const _sizeArr = [];
      SizeList.forEach(it => {
        const _name = it.Name.replace('毫米', 'mm');
        if (!_sizeArr.includes(_name)) _sizeArr.push(_name);
      });
      return _sizeArr.join('、');
    },
    getNumber({ Attributes, ProductAmount, KindCount }) {
      const { Unit } = Attributes;
      let _str = '';
      if (KindCount > 1) _str = `${KindCount}款`;
      return `${ProductAmount}${Unit}${_str}`;
    },
    getCraft({ CraftList }) {
      const _craftArr = [];
      CraftList.forEach(it => {
        _craftArr.push(it.Name);
      });
      return _craftArr.join('、');
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    onDetailClick(row) {
      this.$store.commit('unpayList/setCurUnpayListDetailData', row);
      this.$router.push('/unpay/detail');
    },
    async handleSelectedSubmit() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择订单');
        return;
      }
      const res = await this.$store.dispatch('unpayList/getOrderPreCreateFromUnpayList', this.multipleSelection);
      if (res) this.$router.push('/unpay/submit');
    },
    async handleSingleSubmit(row) {
      const res = await this.$store.dispatch('unpayList/getOrderPreCreateFromUnpayList', [row]);
      if (res) this.$router.push('/unpay/submit');
    },
    handleDel(item) {
      if (!item && this.multipleSelection.length === 0) {
        this.$message.error('请选择订单');
        return;
      }
      const title = item ? '确定取消该订单吗' : '确定取消选中订单吗';
      // eslint-disable-next-line max-len
      const msg = item ? `订单产品：[ ${item.SecondLevelName} - ${item.ProductName} ]` : `[ 总共 ${this.multipleSelection.length} 条订单被选中 ]`;
      this.messageBox.warnCancelBox({
        title,
        msg,
        successFunc: async () => {
          const list = item ? [item] : this.multipleSelection;
          await this.$store.dispatch('unpayList/getOrderCancle', list);
          if (!item) this.$refs.multipleTable.clearSelection();
          else if (this.multipleSelection.includes(item)) this.$refs.multipleTable.toggleRowSelection(item);
        },
      });
    },
    handleClearList() {
      this.$store.commit('unpayList/clearUnpayDataList');
    },
    handleScroll(oEl) {
      if (!oEl) return;
      const { scrollTop, scrollHeight, offsetHeight } = oEl;
      this.$store.commit('common/setScrollInfo', { scrollTop, scrollHeight, offsetHeight });
    },
  },
  mounted() {
    // this.$nextTick(() => this.setHeight());
    // window.addEventListener('resize', this.setHeight);
    // window.addEventListener('resize', this.handleScroll);
    // this.$store.dispatch('common/getExpressList');
    this.oApp = document.getElementById('app');
    this.$nextTick(() => {
      this.handleScroll(this.oApp);
    });
  },
  watch: {
    unpayDataList: {
      handler() {
        this.$nextTick(() => {
          if (this.oBtn) return;
          const oBtn = document.querySelector('.mp-pc-unpay-list-page-table-comp-wrap .el-table__header .check-row');
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
.mp-pc-unpay-list-page-table-comp-wrap {
  > .table-wrap {
    min-height: calc(100vh - 130px - 140px);
    // margin-top: 22px;
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
                  &.is-cancel {
                    padding: 2px 6px;
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
}
</style>
