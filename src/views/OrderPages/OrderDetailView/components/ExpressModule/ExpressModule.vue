<template>
  <section class="mp-pc-sys-order-list-page-order-detail-page-wrap-express-comp module">
    <header>
      <img src="../../../../../assets/images/order-detail/express.png" alt="">
      <span>配送信息</span>
    </header>

    <main v-loading="loading" >
      <ul class="list" v-if="OrderDetail">
        <!-- <li>
          <label>订单状态：</label>
          <span :class="{
              'is-pink': OrderDetail.Status === 10,
              'is-success': OrderDetail.Status === 200,
              'is-cancel': [254, 255].includes(OrderDetail.Status),
              'is-origin': ![10, 200, 254, 255].includes(OrderDetail.Status),
            }"
          >
            {{ OrderDetail.Status | formatStatus }}
          </span>
        </li> -->

        <li>
          <label>配送方式：</label>
          <span>{{ExpressName}}</span>
        </li>

        <li>
          <label style="width:70px;margin-right: 1em;">收件人：</label>
          <span>
            <span :title="Consignee.length > 11 ? Consignee : ''">{{Consignee.length > 11 ? `${Consignee.slice(0,10)}...` : Consignee}}</span>
            <span style="margin-left: 28px">{{Mobile}}</span>
          </span>
        </li>

        <li>
          <label>收件地址：</label>
          <span class="address text-ellipsis">{{AddressDetail}}</span>
        </li>
      </ul>

      <div class="bill-no-list" v-if="BillNoList.length" :class="BillNoList.length > 4 ? 'more' : ''">
        <table class="table">
          <tbody>
            <tr v-for="it in (BillNoList.length > 4 ? BillNoList.slice(0, 4) : BillNoList)" :key="it.BillNo">
              <td class="no">
                <label for="">运单号：</label>
                <span>
                  <template>{{ it.BillNo }}</template>
                  <template v-if="it.PackageNumber > 1"> (含{{ it.PackageNumber }}个包裹)</template>
                </span>
              </td>
              <td class="btn">
                <span class="blue-span" @click="onDetailClick(it)">配送进度</span>
              </td>
            </tr>
          </tbody>
        </table>

        <p v-if="BillNoList.length > 4" style="text-align: right;font-size: 12px;padding: 13px 5px;">
          <span class="blue-span" @click="onMoreClick">更多包裹>></span>
        </p>

        <ExpressDetailDialog :visible.sync="detailVisible" :item="curItem" />
        <ExpressMoreListDialog :visible.sync="moreVisible" :BillNoList="BillNoList" @select="onDetailClick" v-if="BillNoList.length > 4" />
      </div>

    </main>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import ExpressDetailDialog from './ExpressDetailDialog.vue';
import ExpressMoreListDialog from './ExpressMoreListDialog.vue';

export default {
  components: {
    ExpressDetailDialog,
    ExpressMoreListDialog,
  },
  props: {
    OrderDetail: {
      type: Object,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    BillNoList: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState('common', ['ExpressList']),
    Address() {
      if (this.OrderDetail) {
        return this.OrderDetail.Address;
      }

      return null;
    },
    ExpressName() {
      if (this.Address && this.Address.ExpressText) return this.Address.ExpressText;

      if (this.Address && this.Address.Express && this.ExpressList && this.ExpressList.length > 0) {
        const { First, Second } = this.Address.Express;
        const type = this.ExpressList.find(it => it.Type === First);
        if (type) {
          const t = type.List.find(it => it.ID === Second);
          if (t) return t.Name || '';
        }
      }
      return '';
    },
    Consignee() {
      if (this.Address && this.Address.Address) {
        const Consignee = this.Address.Address.Consignee || '';
        return Consignee;
      }
      return '';
    },
    Mobile() {
      if (this.Address && this.Address.Address) {
        return this.Address.Address?.Mobile || '';
      }
      return '';
    },
    AddressDetail() {
      if (this.Address && this.Address.Address) {
        const { ExpressArea, AddressDetail } = this.Address.Address;
        if (ExpressArea) {
          const { RegionalName, CityName, CountyName } = ExpressArea;
          return `${RegionalName || ''}${CityName || ''}${CountyName || ''}${AddressDetail || ''}`;
        }
      }
      return '';
    },
  },
  data() {
    return {
      detailVisible: false,
      curItem: null, // { BillNo: string; PackageID: number; ExpressID: string }
      moreVisible: false,
    };
  },
  methods: {
    onDetailClick(item) {
      this.curItem = item;
      this.detailVisible = true;
    },
    onMoreClick() {
      this.moreVisible = true;
    },
  },
};
</script>
<style lang='scss'>
.mp-pc-sys-order-list-page-order-detail-page-wrap-express-comp {
  > main {
    min-height: 112px;
    padding: 0 25px !important;
    > ul.list {
      padding: 10px 0;
      > li {
        font-size: 12px;
        line-height: 16px;
        padding-bottom: 14px;
        white-space: nowrap;
        overflow: hidden;

        &:last-of-type {
          padding-bottom: 0;
        }

        > label {
          color: #888888;
        }

        .address {
          white-space: wrap;
          height: 32px;
          display: inline-block;
          vertical-align: top;
          width: 376px;
          width: calc(100% - 5em);
        }

        .text-ellipsis {
          overflow: hidden; /* 隐藏超出部分 */
          text-overflow: ellipsis; /* 超出部分用打点表示 */
          white-space: -webkit-box; /* 使用WebKit的换行算法 */
          -webkit-line-clamp: 2; /* 限制在3行 */
          -webkit-box-orient: vertical; /* 垂直排列盒子 */
          display: -webkit-inline-box; /* 使用WebKit的弹性盒子模型布局 */
        }
      }
    }

    > .bill-no-list {
      padding-bottom: 20px;

      > table.table {
        width: 100%;
        tbody {
          tr {
            border: 1px solid #eee;
            td {
              line-height: 20px;
              padding: 5px;
              font-size: 12px;
              white-space: nowrap;
              overflow: hidden;
              max-width: 335px;
              text-overflow: ellipsis;

              label {
                color: #888888;
                margin-left: 20px;
              }

              &.btn {
                width: 80px;
                text-align: center;
              }
            }

            &:nth-child(even) {
              background-color: #F3F7FE;
            }

            &:hover {
              background-color: rgb(237, 247, 255);
            }
          }
        }
      }

      &.more {
        padding-bottom: 2px;
      }
    }
  }
}
</style>
