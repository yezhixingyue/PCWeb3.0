<template>
  <section class="mp-pc-my-setting-page-address-page-wrap">
    <header>
      <span class="blue-v-line is-bold is-black">收货地址</span>
      <span class="is-font-12">（ 最多可添加<i class="is-pink is-font-16"> 3 </i>个收货地址 ）</span>
    </header>
    <ul class="content" v-if="customerInfo">
      <li v-for="(item,i) in customerInfo.Address" :key="item.AddressID + i"
          class="address-item" :class="{
            active: item.IsDefault,
            selected: item.isSelected,
          }">
        <div class="address-item-header">
          <i class="iconfont icon-yonghu1"></i>
          <span>{{item.Consignee}}</span>
        </div>
        <div class="address-item-content">
          <!-- <p class="add-date">添加时间：{{item.CreateTime | format2MiddleLangTypeDate}}</p> -->
          <div class="left">
            <i class="iconfont icon-dingwei"></i>
          </div>
          <div class="right">
            <span>{{getAdd(item)}}</span>
          </div>
        </div>
        <div class="address-item-footer float">
          <p>
            <i class="iconfont icon-dianhua"></i>
            <span>{{ item.Mobile | formatMobile }}</span>
          </p>
          <div>
            <span class="span-title-blue" @click="handleEdit(item)">编辑</span>
            <span class="span-title-pink" @click="handleDel(item)">删除</span>
          </div>
        </div>
        <div class="address-item-sign" @click="handleDefaultAdd(item)">默认地址</div>
        <div class="address-item-sign-img">
          <img src="../../assets/images/add-select.png" alt="">
        </div>
        <div class="img-box top">
          <div class="img-remark"></div>
          <img src="../../assets/images/add-line.png" alt="">
        </div>
        <div class="img-box bottom">
          <div class="img-remark"></div>
          <img src="../../assets/images/add-line.png" alt="">
        </div>
      </li>
      <li class="add-new-address-box" @click="handleAddNewAccount" v-if="customerInfo.Address.length < 3">
        <i class="el-icon-plus"></i>
        <span>新增收货地址</span>
        <div class="img-box top">
          <div class="img-remark"></div>
          <img src="../../assets/images/add-line.png" alt="">
        </div>
        <div class="img-box bottom">
          <div class="img-remark"></div>
          <img src="../../assets/images/add-line.png" alt="">
        </div>
      </li>
    </ul>
    <AddMapComp :openType='openType' :curEditInfo='curEditInfo' @changeStatus='changeDiaStatus' :visible='diaVisible'/>
  </section>
</template>

<script>
import { mapState } from 'vuex';
// import AddMapComp from '@/components/MySettingComps/AddMapComp.vue';

export default {
  components: {
    // AddMapComp,
    AddMapComp: () => import('@/components/MySettingComps/AddMapComp.vue'),
  },
  computed: {
    ...mapState('common', ['customerInfo']),
  },
  data() {
    return {
      diaVisible: false,
      curEditInfo: null,
      openType: 'new', // edit | new
    };
  },
  methods: {
    handleAddNewAccount() {
      this.openType = 'new';
      this.curEditInfo = null;
      this.changeDiaStatus(true);
    },
    handleEdit(item) {
      this.curEditInfo = item;
      this.openType = 'edit';
      this.changeDiaStatus(true);
    },
    handleDel(item) {
      if (!item) return;
      const { AddressID, Consignee } = item;
      if (!AddressID) return;
      this.messageBox.warnCancelBox({
        title: '确定删除该地址吗?',
        msg: `收货人姓名： [ ${Consignee} ]`,
        successFunc: async () => {
          const res = await this.api.getCustomerRemoveAddress(AddressID);
          if (res.data.Status === 1000) {
            this.messageBox.successSingle({
              title: '删除成功',
              successFunc: () => {
                this.$store.commit('common/handleDelAddressOnStore', AddressID);
              },
            });
          }
        },
      });
    },
    getAdd(item) {
      if (!item) return '';
      const { ExpressArea, AddressDetail } = item;
      if (!ExpressArea) return '';
      const { RegionalName, CountyName, CityName } = ExpressArea;
      return `${RegionalName}${CityName}${CountyName}${AddressDetail}`;
    },
    async handleDefaultAdd(item) {
      if (item.IsDefault || !item) return;
      const { AddressID } = item;
      const res = await this.api.getCustomerSetDefaultAddress({ AddressID });
      if (res.data.Status === 1000) {
        this.$store.commit('common/SetDefaultAddress', AddressID);
      }
    },
    changeDiaStatus(bool) {
      this.diaVisible = bool;
    },
  },
  mounted() {
    // this.$store.dispatch('common/getCustomerDetail');
  },
};
</script>

<style lang='scss'>
.mp-pc-my-setting-page-address-page-wrap {
  > .content {
    padding-top: 35px;
    > li {
      width: 280px;
      height: 160px;
      box-sizing: border-box;
      box-shadow: 0px 5px 12px 1px rgba(238, 238, 238, 0.59);
      // border-radius: 5px;
      border: solid 1px #eeeeee;
      display: inline-block;
      vertical-align: text-top;
      margin-right: 25px;
      margin-bottom: 25px;
      transition: 0.15s;
      position: relative;
      overflow: hidden;
      > .img-box {
        position: absolute;
        left: 0;
        right: 0;
        height: 3px;
        &.top {
          top: 0;
        }
        &.bottom {
          bottom: 0;
        }
        > img, > .img-remark {
          height: 100%;
          width: 100%;
          position: absolute;
          left: 0;
          top: 0;
        }
        > .img-remark {
          background-color: #fff;
          z-index: 88;
          opacity: 0.6;
        }
      }
      &:hover {
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.15);
        // transform: scale(1.02);
      }
      &.add-new-address-box {
        color: #aaa;
        text-align: center;
        padding-top: 68px;
        cursor: pointer;
        user-select: none;
        transition: 0.1s;
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
      &.address-item {
        padding-left: 10px;
        padding-right: 4px;
        position: relative;
        > .address-item-header {
          height: 26px;
          border-bottom: 1px dashed #eee;
          vertical-align: bottom;
          padding-top: 16px;
          padding-left: 5px;
        }
        > .address-item-content {
          padding-left: 5px;
          padding-top: 18px;
          user-select: none;
          height: 53px;
          overflow: hidden;
          > .left {
            float: left;
            height: 100%;
          }
          > .right {
            overflow: hidden;
            height: 100%;
            font-size: 12px;
            > span {
              line-height: 20px;
              margin-top: -4px;
              display: inline-block;
              height: 44px;
              overflow: hidden;
              // vertical-align: top;
            }
          }
        }
        > .address-item-footer {
          margin-top: 9px;
          padding-right: 8px;
          padding-left: 5px;
          > p {
            float: left;
          }
          > div {
            float: right;
            >.span-title-pink {
              margin-left: 4px;
              margin-right: 0px;
            }
          }
        }

        > .address-item-sign {
          width: 70px;
          height: 22px;
          background-color: #ff3769;
          border-radius: 0px 0px 5px 5px;
          position: absolute;
          top: 0;
          right: 6px;
          color: #fff;
          font-size: 12px;
          text-align: center;
          line-height: 19px;
          user-select: none;
          display: none;
          z-index: 89;
          transition: 0.15s;
        }
        > .address-item-sign-img {
          position: absolute;
          width: 26px;
          height: 22px;
          z-index: 89;
          right: 0;
          bottom: 0;
          display: none;
          transition: 0.2s;
        }
        &:hover {
          > .address-item-sign {
            display: block;
            opacity: 0.6;
            transition: 0.2s;
            &:hover {
              opacity: 1;
              cursor: pointer;
            }
            &:active {
              background-color: #e42a2a;
            }
          }
        }
        &.selected {
          > .address-item-sign-img {
            display: block;
            opacity: 1;
          }
        }
        &.active {
          i.iconfont {
            color: #428dfa;
            transition: color 0.2s;
          }
          > .address-item-sign,{
            display: block;
            opacity: 1;
          }
          > .address-item-sign:hover {
            cursor: unset;
            background-color: #ff3769;
          }
          > .address-item-footer {
            .span-title-pink {
              display: none;
            }
          }
          .img-remark {
            opacity: 0 !important;
          }
        }
        i.iconfont {
          color: #ddd;
          margin-right: 12px;
        }
      }
    }
  }
}
</style>
