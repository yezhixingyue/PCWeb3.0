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
          <template slot-scope="scope">{{ getNumber(scope.row.ProductParams) }}</template>
        </el-table-column>
        <el-table-column label="工艺" width="70" show-overflow-tooltip>
          <template slot-scope="scope">{{ getCraft(scope.row.ProductParams) }}</template>
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
          :class="{ 'is-pink': getStatus(scope.row).warn, 'is-success': getStatus(scope.row).success }"
          >{{ getStatus(scope.row).text }}</span>
        </el-table-column>
        <el-table-column label="操作" width="150" >
          <div class="menu-list" slot-scope="scope">
            <span class="span-title-blue" @click="handleSingleSubmit(scope.row)">下单</span>
            <span @click="onDetailClick(scope.row)" class="span-title-blue detail">详情</span>
            <span class="span-title-pink" @click="handleDel(scope.row)">删除</span>
          </div>
        </el-table-column>
      </el-table>
    </div>
    <footer class="is-font-14">
      <div class="float">
        <div class="left">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkedAll">全选</el-checkbox>
          <span class="gray">共检测出 <i class="is-pink">{{shoppingDataNumber}}</i> 个订单</span>
        </div>
        <div class="right">
          <!-- <span class="span-title-blue" @click="handleClearList">清除已上传订单</span> -->
          <span class="span-title-pink" @click="handleDel(null)">删除选中订单</span>
          <el-button type="primary" @click="handleSelectedSubmit">上传选中订单</el-button>
        </div>
      </div>
    </footer>
    <transition name="el-fade-in-linear">
      <footer class="is-font-14 floating" v-show="isFootFixed">
        <div class="float">
          <div class="left">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkedAll">全选</el-checkbox>
            <span class="gray">共检测出 <i class="is-pink">{{shoppingDataNumber}}</i> 个订单</span>
          </div>
          <div class="right">
            <!-- <span class="span-title-blue" @click="handleClearList">清除已上传订单</span> -->
            <span class="span-title-pink" @click="handleDel(null)">删除选中订单</span>
            <el-button type="primary" @click="handleSelectedSubmit">上传选中订单</el-button>
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
      // difference: 0,
      // scrollTop: 0,
      isFootFixed: false,
    };
  },
  computed: {
    ...mapState('shoppingCar', ['shoppingDataList', 'shoppingDataNumber']),
    ...mapState('common', ['ExpressList', 'ScrollInfo']),
    scrollChange() {
      return this.ScrollInfo.scrollTop + this.ScrollInfo.scrollHeight + this.ScrollInfo.offsetHeight;
    },
    checkedAll: {
      get() {
        return this.multipleSelection.length === this.shoppingDataNumber && this.multipleSelection.length > 0;
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
      return this.multipleSelection.length < this.shoppingDataNumber && this.multipleSelection.length > 0;
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
    getName({ ProductParams }) {
      const { Attributes } = ProductParams;
      const { Name, SecondLevelName } = Attributes;
      return `${SecondLevelName}-${Name}`;
    },
    getSize({ ProductParams }) {
      const { PartList } = ProductParams;
      const _sizeArr = [];
      if (PartList[0].PartList[0].Attributes.SizeName) return PartList[0].PartList[0].Attributes.SizeName;
      PartList.forEach(item => {
        const { SizePropertyList } = item.PartList[0];
        let _str = '';
        const _sizeList = [];
        const _unitList = [];
        SizePropertyList.forEach(it => {
          _sizeList.push(it.ShowValue);
          _unitList.push(it.ShowUnit);
        });
        const _obj = {};
        _unitList.forEach(it => {
          if (!_obj[it]) _obj[it] = 0;
          else _obj[it] += 1;
        });
        if (Object.keys(_obj).length === 1) {
          _str = _sizeList.join('×') + _unitList[0];
        } else {
          const _arr = [];
          _sizeList.forEach((it, i) => {
            const _temp = it + _unitList[i];
            _arr.push(_temp);
          });
          _str = _arr.join('×');
        }
        const len = _sizeArr.length;
        if (len > 0 && _sizeArr[len - 1] === _str) return;
        _sizeArr.push(_str);
      });

      return _sizeArr.join('、');
    },
    getNumber({ Attributes, ProductAmount, KindCount }) {
      const { Unit } = Attributes;
      let _str = '';
      if (KindCount > 1) _str = `${KindCount}款`;
      return `${ProductAmount}${Unit}${_str}`;
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
      const _arr = [];

      const { First } = CraftList;
      this.getCraftFromItem(First, _arr);
      if (PartList.length > 0) {
        PartList.forEach(part => {
          part.PartList.forEach(subPart => {
            const partFirst = subPart.CraftList.First;
            this.getCraftFromItem(partFirst, _arr);
          });
        });
      }
      return _arr.join('，');
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
      if (!item.FileErrorMessage) {
        if (item.FileHaveUpload) return { text: '文件已上传', warn: false, success: false };
        return { text: '文件未上传', warn: true, success: false };
      }
      let warn = false;
      let success = false;
      if (['删除失败'].includes(item.FileErrorMessage)) {
        warn = true;
        success = false;
      }
      if (['订单已提交'].includes(item.FileErrorMessage)) {
        warn = false;
        success = true;
      }
      return { text: item.FileErrorMessage, warn, success };
    },
    onDetailClick(row) {
      this.$store.commit('shoppingCar/setCurShoppingCarDetailData', row);
      this.$router.push('/shopping/detail');
    },
    async handleSelectedSubmit() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择订单');
        return;
      }
      const res = await this.$store.dispatch('shoppingCar/getOrderPreCreateFromShoppingCar', this.multipleSelection);
      if (res) this.$router.push('/shopping/submit');
    },
    async handleSingleSubmit(row) {
      const res = await this.$store.dispatch('shoppingCar/getOrderPreCreateFromShoppingCar', [row]);
      if (res) this.$router.push('/shopping/submit');
    },
    handleDel(item) {
      if (!item && this.multipleSelection.length === 0) {
        this.$message.error('请选择订单');
        return;
      }
      const title = item ? '确定删除该订单吗' : '确定删除选中订单吗';
      // // console.log(item);
      let msg = '';
      if (item) {
        if (!item.ProductParams || !item.ProductParams.Attributes) return;
        const _nameInfo = item.ProductParams.Attributes;
        const { SecondLevelName, Name } = _nameInfo;
        if (!SecondLevelName || !Name) return;
        msg = `订单产品：[ ${SecondLevelName} - ${Name} ]`;
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
      this.$store.commit('shoppingCar/clearShoppingDataList');
    },
    handleScroll(oEl) {
      if (!oEl) return;
      const { scrollTop, scrollHeight, offsetHeight } = oEl;
      this.$store.commit('common/setScrollInfo', { scrollTop, scrollHeight, offsetHeight });
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
}
</style>
