<template>
  <section class="mp-pc-unpay-list-page-table-comp-wrap">
    <RetractableDisplayComp
      class="mp-pc-new-unpay-list-page-table-comp-wrap"
      :isScrollStyle="false"
      :widthObj="widthObj"
      :onWidthChange="onWidthChange"
      :titleList="titleList"
      isCheck
      v-model="checkedAll"
      :indeterminate="isIndeterminate"
    >
      <template v-if="localUnpayDataList && localUnpayDataList.length > 0">
        <ul>
          <li
            v-for="(data, i) in localUnpayDataList"
            :key="data.ID"
            :class="i === localUnpayDataList.length - 1 ? 'hide-border' : ''"
          >
            <ItemListComp :data="data" :widthObj="widthObj" v-model="multipleSelection" />
          </li>
        </ul>
      </template>
      <div class="no-data-show is-gray" v-else>暂无数据</div>
    </RetractableDisplayComp>
    <footer class="is-font-14">
      <div class="float">
        <div class="left">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkedAll"
            >全选</el-checkbox
          >
          <span class="gray"
            >共检测出 <i class="is-pink">{{ unpayDataNumber }}</i> 个订单</span
          >
        </div>
        <div class="right">
          <span class="span-title-blue" @click="handleClearList"
            >清除已付款已取消订单</span
          >
          <span class="span-title-pink" @click="handleDel(null)"
            >取消选中订单</span
          >
          <!-- <el-button type="primary" @click="handleSelectedSubmit"
            >支付选中订单</el-button
          > -->
        </div>
      </div>
    </footer>
    <transition name="el-fade-in-linear">
      <footer class="is-font-14 floating" v-show="isFootFixed">
        <div class="float">
          <div class="left">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkedAll"
              >全选</el-checkbox
            >
            <span class="gray"
              >共检测出
              <i class="is-pink">{{ unpayDataNumber }}</i> 个订单</span
            >
          </div>
          <div class="right">
            <span class="span-title-blue" @click="handleClearList"
              >清除已付款已取消订单</span
            >
            <span class="span-title-pink" @click="handleDel(null)"
              >取消选中订单</span
            >
            <!-- <el-button type="primary" @click="handleSelectedSubmit"
              >支付选中订单</el-button
            > -->
          </div>
        </div>
      </footer>
    </transition>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import RetractableDisplayComp from '@/components/common/RetractableDisplayComp/Index.vue';
import ItemListComp from './ItemListComp.vue';

export default {
  components: {
    ItemListComp,
    RetractableDisplayComp,
  },
  data() {
    return {
      widthObj: {
        w1: 80,
        w2: 110,
        w3: 70,
        w4: 70,
        w5: 70,
        w6: 80,
        w7: 60,
        w8: 80,
        w9: 65,
        w10: 90,
        w11: 70,
        w12: 95,
        w13: 80,
        w14: 70,
        w15: 108,
      },
      titleList: [
        '全选',
        '产品',
        '尺寸',
        '数量',
        '工艺',
        '原价',
        '优惠券',
        '成交价',
        '定金',
        '文件内容',
        '收货人',
        '收货人手机',
        '配送方式',
        '状态',
        '操作',
      ],
      multipleSelection: [],
      h: 0,
      isFootFixed: false,
    };
  },
  computed: {
    ...mapState('unpayList', ['unpayDataList', 'unpayDataNumber']),
    ...mapState('common', ['ScrollInfo']),
    scrollChange() {
      return (
        this.ScrollInfo.scrollTop
        + this.ScrollInfo.scrollHeight
        + this.ScrollInfo.offsetHeight
      );
    },
    checkedAll: {
      get() {
        return (
          this.multipleSelection.length === this.unpayDataNumber
          && this.multipleSelection.length > 0
        );
      },
      set(newVal) {
        if (newVal) {
          this.multipleSelection = this.unpayDataList.map(it => it.PayCode);
        } else {
          this.multipleSelection = [];
        }
      },
    },
    isIndeterminate() {
      return (
        this.multipleSelection.length < this.unpayDataNumber
        && this.multipleSelection.length > 0
      );
    },
    localUnpayDataList() {
      if (!Array.isArray(this.unpayDataList) || this.unpayDataList.length === 0) return [];
      return this.unpayDataList.map(it => {
        const _OrderList = [];
        let _Weight = 0;
        if (Array.isArray(it.PackageList) && it.PackageList.length > 0) {
          it.PackageList.forEach(({
            Address, OrderList, Weight, OutPlat,
          }) => {
            const _list = Array.isArray(OrderList) ? OrderList.map(_it => ({
              ..._it, Address, OutPlat, _FullName: this.getFullName(_it),
            })) : [];
            _OrderList.push(..._list);
            _Weight += Weight;
          });
        }
        const temp = { ...it };
        delete temp.PackageList;
        _Weight = +_Weight.toFixed(2);
        return { ...temp, _OrderList, _Weight };
      });
    },
  },
  methods: {
    onWidthChange(newW, w) {
      this.widthObj[w] = newW;
    },
    getFullName({ ProductName, ClassList }) {
      if (!ProductName) return '';
      if (!ClassList || ClassList.length === 0) return ProductName;
      const t = ClassList.find(it => it.Type === 2);
      return t && t.FirstLevel && t.FirstLevel.Name ? `${t.FirstLevel.Name} - ${ProductName}` : ProductName;
    },
    handleScroll(oEl) {
      if (!oEl) return;
      const { scrollTop, scrollHeight, offsetHeight } = oEl;
      this.$store.commit('common/setScrollInfo', { scrollTop, scrollHeight, offsetHeight });
    },
    handleClearList(e) {
      console.log('handleClearList', e);
    },
  },
  watch: {
    unpayDataList() {
      this.$nextTick(() => {
        this.oApp.scrollTop = 0;
        this.handleScroll(this.oApp);
      });
    },
    scrollChange() {
      const { scrollTop, scrollHeight, offsetHeight } = this.ScrollInfo;
      const difference = scrollHeight - offsetHeight;
      if (difference - 165 - scrollTop > 0) this.isFootFixed = true;
      else this.isFootFixed = false;
    },
  },
  mounted() {
    this.oApp = document.getElementById('app');
    this.$nextTick(() => {
      this.handleScroll(this.oApp);
    });
  },
};
</script>

<style lang='scss'>
.mp-pc-unpay-list-page-table-comp-wrap {
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
        padding-left: 15px;
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
.mp-pc-new-unpay-list-page-table-comp-wrap {
  height: 100%;
  box-sizing: border-box;
  padding-bottom: 15px;
  border: 1px solid #eee;
  position: relative;
  > header {
    height: 40px;
    background-color: rgb(248, 248, 248);
    box-sizing: border-box;
    border-top: none;
    > div {
      line-height: 38px;
      height: 100%;
      background-color: rgb(248, 248, 248);
    }
  }
  .no-data-show {
    font-size: 12px;
    text-align: center;
    display: block;
    position: absolute;
    left: calc(50% - 24px);
    top: calc(50% - 9px);
  }
  > main {
    min-height: calc(100vh - 135px - 175px - 205px);
    overflow-x: hidden;
    border-top: 1px solid #eee;
    > div {
      margin-bottom: 0;
    }
    .hide-border {
      .hide-border-item {
        border-bottom: none;
      }
    }
  }
}
</style>
