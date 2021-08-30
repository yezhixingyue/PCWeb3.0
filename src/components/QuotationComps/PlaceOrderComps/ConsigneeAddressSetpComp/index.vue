<template>
  <section
    class="mp-pc-place-order-address-show-and-change-wrap"
    v-if="customerInfo"
  >
    <header class="bg-gray"></header>
    <div class="comp-title float">
      <span class="left is-bold">收货信息</span>
      <span class="right span-title-blue" @click="onAddressChangeClick">{{
        addCompTitle
      }}</span>
    </div>
    <div class="content" v-loading="ValidExpressLoading">
      <ul>
        <!-- 收货地址展示 与 修改按钮 -->
        <li
          class="consignee-wrap"
          v-if="customerInfo.Address.length > 0 || NewAddressInfo.isSaved"
        >
          <div class="consignee-box">
            <span class="title">收货人：</span>
            <span class="consignee">{{ curAddressInfo.Consignee }}</span>
            <span>{{ curAddressInfo.Mobile }}</span>
          </div>
          <div class="address">
            <span class="title">收货地址：</span>
            <span class="title-content">
              <i>{{ curAddressInfo.address }}</i>
            </span>
          </div>
        </li>
        <!-- 收货地址为空的处理 -->
        <li v-else class="has-none-consignee">
          <span class="is-pink">尚未设置收货地址， </span>
          <span class="right span-title-blue" @click="onAddressChangeClick">
            点击此处{{ addCompTitle }}</span
          >
          <span class="is-primary">
            ， 或前往
            <router-link to="/mySetting/address" tag="i" class="span-title-blue"
              >个人设置 - 收货地址</router-link
            >
            设置常用收货地址 (<i class="is-gray">推荐</i>)
          </span>
        </li>
        <!-- 当前平台单号展示 与 配送方式选择 -->
        <li>
          <!-- 平台单号 -->
          <div class="platform-code-box">
            <span class="title">平台单号：</span>
            <div class="content">{{OutPlateNo}}</div>
          </div>
          <!-- 配送方式 -->
          <div class="express-box">
            <span class="title">配送：</span>
            <el-radio-group v-model="Express.First" @change="onRadioChange">
              <el-radio
                :label="1"
                :disabled="!ExpressTypeDisabled.canMpzj"
                style="margin-right: 24px"
              >
                <span :class="!ExpressTypeDisabled.canMpzj ? 'is-cancel' : ''">名片之家</span>
              </el-radio>
              <el-radio
                :label="3"
                :disabled="!ExpressTypeDisabled.canExpress"
                style="margin-right: 24px"
              >
                <el-select
                  v-model="secondExValFor3"
                  @visible-change="onVisibleChangeFor3"
                  :disabled="!ExpressTypeDisabled.canExpress"
                >
                  <el-option
                    v-for="item in secondExpressList"
                    :key="item.ID"
                    :label="item.Name"
                    :value="item.ID"
                  >
                  </el-option>
                </el-select>
              </el-radio>
              <el-radio :label="2" :disabled="!ExpressTypeDisabled.canLogistic">
                <el-select
                  v-model="thirdExValFor2"
                  @visible-change="onVisibleChangeFor2"
                  :disabled="!ExpressTypeDisabled.canLogistic"
                >
                  <el-option
                    v-for="item in thirdExpressList"
                    :key="item.ID"
                    :label="item.Name"
                    :value="item.ID"
                  >
                  </el-option>
                </el-select>
              </el-radio>
            </el-radio-group>
          </div>
        </li>
        <li>
          <IdentifyFormItem
            ref="oIdentifyFormItemOut"
            :OutPlateNo="OutPlateNo"
            @OutPlateNoResolved="onOutPlateNoResolved"
            @DetailedAddress="onDetailedAddressChange"
          />
         </li>
      </ul>
    </div>
    <!-- 地图定位弹窗组件 -->
    <AddMapComp
      ref="mapComp"
      :openType="openType"
      isTemp
      :canClose='false'
      :visible.sync="setMapVisible"
      :curEditInfo="tempDataForMapPosition.NewAddressInfo"
      :PropRegionalList='RegionalList'
      :PropCityList='CityList'
      :PropCountyList='CountyList'
      @handleMapSearchError="handleMapSearchError"
      @changeProps="setLatitudeLongitudeAfterPositioning"
      @submit="setLatitudeLongitudeAfterPositioning"
    />
    <!-- 地址选择弹窗组件 -->
    <SetupDialog
     :visible.sync='SetAddressVisible'
     :title="addCompTitle"
     :OutPlateNo='OutPlateNo'
     :curAddIndex='curAddIndex'
     :NewAddressInfo='NewAddressInfo'
     :PropRegionalList='RegionalList'
     :PropCityList='CityList'
     :PropCountyList='CountyList'
     @submit="onDialogSubmit"
    />
  </section>
</template>

<script>
import { mapState } from 'vuex';
import AddMapComp from '@/components/MySettingComps/AddMapComp.vue';
import { amapAppkey } from '@/assets/js/setup';
import IdentifyFormItem from './IdentifyFormItem.vue';
import SetupDialog from './SetupDialog.vue';

export default {
  components: {
    AddMapComp,
    SetupDialog,
    IdentifyFormItem,
  },
  data() {
    return {
      secondExVal: 11, // 快递
      thirdExVal: 31, // 物流
      Express: {
        First: 1,
        Second: 1,
      },
      SetAddressVisible: false, // 修改地址
      setMapVisible: false, // 地图定位
      NewAddressInfo: {
        Consignee: '',
        Mobile: '',
        ExpressArea: {
          RegionalName: '',
          RegionalID: '',
          CityName: '',
          CityID: '',
          CountyName: '',
          CountyID: '',
        },
        AddressDetail: '',
        HavePosition: false,
        IsDefault: false,
        Latitude: '',
        Longitude: '',
        CustomerID: '',
        isSaved: false,
        isSelected: true,
      },
      curAddIndex: '', //  new | 地址数组索引号
      ExpressValidList: [1, 2, 3], // 当前可用物流方式
      ValidExpressLoading: false, // 获取有效配送方式的loading状态
      OutPlateNo: '', // 平台单号
      ParseContent: '',
      tempDataForMapPosition: {}, // 需要定位的地址数据
      openType: 'tempAdd',
      RegionalList: null,
      CityList: null,
      CountyList: null,
    };
  },
  computed: {
    ...mapState('common', ['ExpressList', 'customerInfo']),
    ...mapState('Quotation', ['curProductID', 'addressInfo4PlaceOrder']),
    secondExpressList() {
      if (this.ExpressList.length === 0) return [];
      return this.ExpressList.find((it) => it.Type === 3).List;
    },
    thirdExpressList() {
      if (this.ExpressList.length === 0) return [];
      return this.ExpressList.find((it) => it.Type === 2).List;
    },
    curAddressInfo() {
      if (!this.customerInfo) return '';
      let _t;

      if (this.curAddIndex === 'new') _t = this.NewAddressInfo;
      else _t = this.customerInfo.Address.find((it, i) => i === this.curAddIndex);
      if (!_t) return '';

      const { ExpressArea, AddressDetail } = _t;
      const { RegionalName, CountyName, CityName } = ExpressArea;
      const address = `${RegionalName}${CityName}${CountyName}${AddressDetail}`;
      const _temp = { ..._t, address };
      return _temp;
    },
    secondExValFor3: {
      get() {
        return this.secondExVal;
      },
      set(newVal) {
        this.secondExVal = newVal;
        this.Express.Second = newVal;
        this.setInfo4ReqObj();
      },
    },
    thirdExValFor2: {
      get() {
        return this.thirdExVal;
      },
      set(newVal) {
        this.thirdExVal = newVal;
        this.Express.Second = newVal;
        this.setInfo4ReqObj();
      },
    },
    ExpressTypeDisabled() {
      return {
        canMpzj: this.ExpressValidList.includes(1) && !this.OutPlateNo, // 名片之家
        canExpress: this.ExpressValidList.includes(3), // 快递
        canLogistic: this.ExpressValidList.includes(2), // 物流
      };
    },
    addCompTitle() {
      if (!this.customerInfo) return '';
      if (this.customerInfo.Address.length === 0 && !this.NewAddressInfo.isSaved) return '添加临时配送地址';
      return '更改配送地址';
    },
  },
  methods: {
    /** 配送方式相关方法
    ---------------------------------------------------- */
    onVisibleChangeFor2(bool) {
      if (!bool || !this.ExpressTypeDisabled.canLogistic) return;
      if (this.Express.First === 2 && this.Express.Second === this.thirdExVal) return;
      this.Express.First = 2;
      this.Express.Second = this.thirdExVal;
      this.setInfo4ReqObj();
    },
    onVisibleChangeFor3(bool) {
      if (!bool || !this.ExpressTypeDisabled.canExpress) return;
      if (this.Express.First === 3 && this.Express.Second === this.secondExVal) return;
      this.Express.First = 3;
      this.Express.Second = this.secondExVal;
      this.setInfo4ReqObj();
    },
    onRadioChange(num) { // 配送方式选择切换
      switch (num) {
        case 1: // mpzj
          this.Express.Second = 1;
          break;
        case 2: // wuliu
          this.Express.Second = this.thirdExVal;
          break;
        case 3: // kuaidi
          this.Express.Second = this.secondExVal;
          break;
        default:
          break;
      }
      if (this.Express.First !== num) this.Express.First = num;
      this.setInfo4ReqObj();
    },
    /** 地图定位相关方法
    ---------------------------------------------------- */
    handleMapSearchError() { // 地图定位错误的处理方式  可能会传递type以区分首页与弹窗2个使用位置
      if (this.openType !== 'edit') {
        this.setMapVisible = false; // 关闭地图
      }
      // this.SetAddressVisible = true; // 打开设置
    },
    async setLatitudeLongitudeAfterPositioning(data) { // 定位后,设置经纬度
      const {
        Latitude, Longitude, AddressDetail, Consignee, Mobile, ExpressArea, RegionalList, CityList, CountyList,
      } = data;
      if (!this.tempDataForMapPosition || !Latitude || !Longitude) return;
      const { curAddIndex, OutPlateNo, NewAddressInfo } = this.tempDataForMapPosition;
      if (this.openType === 'edit') {
        NewAddressInfo.AddressDetail = AddressDetail;
        NewAddressInfo.Consignee = Consignee;
        NewAddressInfo.Mobile = Mobile;
        NewAddressInfo.ExpressArea = ExpressArea;
        if (Array.isArray(RegionalList)) this.RegionalList = RegionalList;
        if (Array.isArray(CityList)) this.CityList = CityList;
        if (Array.isArray(CountyList)) this.CountyList = CountyList;
      }
      NewAddressInfo.Latitude = Latitude;
      NewAddressInfo.Longitude = Longitude;
      NewAddressInfo.HavePosition = true;
      this.curAddIndex = curAddIndex;
      this.OutPlateNo = OutPlateNo;
      this.NewAddressInfo = NewAddressInfo;
      this.$refs.oIdentifyFormItemOut.setValueOnOut(OutPlateNo);
      this.setInfo4ReqObj();
      this.SetAddressVisible = false;
      if (this.setMapVisible) this.setMapVisible = false;
      this.ValidExpressLoading = true;
      const resp = await this.api.getExpressValidList(this.NewAddressInfo);
      this.ValidExpressLoading = false;
      if (resp.data.Status === 1000) {
        this.ExpressValidList = resp.data.Data;
        if (this.ExpressValidList.length === 0) {
          this.messageBox.failSingleError({
            title: '地址添加失败',
            msg: '当前地址没有可用配送方式，请更换地址',
          });
        }
      }
    },
    /** 修改远程仓库相关数据
    ---------------------------------------------------- */
    setInfo4ReqObj() {
      const _temp = {};
      _temp.Address = {};
      _temp.Address.Express = this.Express;
      const { AddressID } = this.curAddressInfo;
      if (AddressID) _temp.Address.AddressID = AddressID;
      _temp.Address.Address = this.curAddressInfo;
      const OutPlate = { First: 1, Second: this.OutPlateNo };
      _temp.OutPlate = OutPlate;
      this.$store.commit(
        'Quotation/setAddressInfo4PlaceOrder',
        JSON.parse(JSON.stringify(_temp)),
      );
      return true;
    },
    /** 内容解析相关数据
    ---------------------------------------------------- */
    onOutPlateNoResolved({ data, OutPlateNo } = {}) {
      if (data && OutPlateNo) {
        this.OutPlateNo = OutPlateNo;
        this.NewAddressInfo = { ...this.NewAddressInfo, ...data };
        this.NewAddressInfo.isSaved = true;
        this.curAddIndex = 'new';
        if (this.Express.First === 1) {
          this.onRadioChange(3); // 直接转到快递（后面根据需要添加是否有快递配送方式可选）
        }
        this.setInfo4ReqObj();
      }
    },
    onDetailedAddressChange(data) {
      const {
        AddressDetail,
        CityList,
        Consignee,
        CountyList,
        RegionalList,
        ExpressArea,
        Mobile,
      } = data;
      const _NewAddressInfo = JSON.parse(JSON.stringify(this.NewAddressInfo));
      _NewAddressInfo.ExpressArea = { ..._NewAddressInfo.ExpressArea, ...ExpressArea };
      _NewAddressInfo.AddressDetail = AddressDetail;
      _NewAddressInfo.Consignee = Consignee;
      _NewAddressInfo.Mobile = Mobile;
      this.tempDataForMapPosition = {
        curAddIndex: 'new',
        OutPlateNo: '',
        NewAddressInfo: _NewAddressInfo,
      };
      this.CityList = CityList || null;
      this.CountyList = CountyList || null;
      this.RegionalList = RegionalList || null;
      // this.curAddIndex = 'new';
      // 打开地图弹窗定位
      this.setMapVisible = true;
      this.openType = 'edit';
      // this.$refs.ruleForm.validate();
    },
    /** 弹窗地址修改相关方法
    ---------------------------------------------------- */
    onAddressChangeClick() { // 点击更改配送地址
      this.SetAddressVisible = true;
    },
    onDialogSubmit(e) { // 弹窗提交
      if (!e) return;
      const { curAddIndex, OutPlateNo, NewAddressInfo } = e;
      if (curAddIndex === 'new' && !OutPlateNo) { // 弹窗定位
        this.RegionalList = null;
        this.CityList = null;
        this.CountyList = null;
        // 如果已定位则不再需要定位
        if (NewAddressInfo.HavePosition && NewAddressInfo.Latitude && NewAddressInfo.Longitude) {
          this.curAddIndex = curAddIndex;
          this.OutPlateNo = OutPlateNo;
          this.NewAddressInfo = JSON.parse(JSON.stringify(NewAddressInfo));
          this.$refs.oIdentifyFormItemOut.setValueOnOut(OutPlateNo);
          this.setInfo4ReqObj();
          this.SetAddressVisible = false;
        } else {
          this.openType = 'tempAdd';
          // eslint-disable-next-line max-len
          this.tempDataForMapPosition = { curAddIndex, OutPlateNo, NewAddressInfo: JSON.parse(JSON.stringify(NewAddressInfo)) };
          this.setMapVisible = true;
        }
      } else {
        this.curAddIndex = curAddIndex;
        this.OutPlateNo = OutPlateNo;
        this.NewAddressInfo = JSON.parse(JSON.stringify(NewAddressInfo));
        this.$refs.oIdentifyFormItemOut.setValueOnOut(OutPlateNo);
        this.setInfo4ReqObj();
        this.SetAddressVisible = false;
      }
    },
    /** 初始化及切换产品清除等相关方法
    ---------------------------------------------------- */
    getAmapMount() { // 地图加载
      // 09966c2b866f9783b49969af19102d91 geren
      // eslint-disable-next-line max-len
      const url = `https://webapi.amap.com/maps?v=1.4.15&key=${amapAppkey}&plugin=AMap.PlaceSearch,AMap.Geocoder&callback=initMap`;

      let key = true;
      const oSrc = document.getElementsByTagName('script');
      oSrc.forEach((it) => {
        if (!key) return;
        if (it.src === url) {
          key = false;
          this.isMapLoaded = true;
        }
      });
      if (!key) return;
      window.initMap = () => {
        this.isMapLoaded = true;
      };
      const jsapi = document.createElement('script');
      jsapi.charset = 'utf-8';
      jsapi.src = url;
      document.head.appendChild(jsapi);
    },
    clearCurProductState() { // 在产品切换时，清理旧产品上对应的地址和平台单号信息
      this.OutPlateNo = '';
      this.NewAddressInfo = {
        Consignee: '',
        Mobile: '',
        ExpressArea: {
          RegionalName: '',
          RegionalID: '',
          CityName: '',
          CityID: '',
          CountyName: '',
          CountyID: '',
        },
        AddressDetail: '',
        HavePosition: false,
        IsDefault: false,
        Latitude: '',
        Longitude: '',
        CustomerID: '',
        isSaved: false,
        isSelected: true,
      };
      this.$refs.oIdentifyFormItemOut.setValueOnOut('');
      if (this.curAddIndex === 'new') {
        this.initCurAddIndex();
      }
    },
    initCurAddIndex() { // 首次加载或切换产品时初始化收货地址
      const _i = this.customerInfo.Address.findIndex((it) => it.isSelected);
      if (_i > -1) this.curAddIndex = _i;
      else if (this.customerInfo.Address.length > 0) this.curAddIndex = 0;
      else this.curAddIndex = 'new';
      this.setInfo4ReqObj();
    },
    inputChecker() {
      return this.$refs.oIdentifyFormItemOut.formCheckerOnOut();
    },
  },
  watch: {
    // curAddressInfo() {
    //   this.setInfo4ReqObj();
    // },
    ExpressValidList(newVal) {
      if (newVal.length === 3) return;
      if (newVal.length === 0) {
        this.messageBox.failSingleError({
          title: '地址匹配失败',
          msg: '当前地址没有可用配送方式，请更换地址',
        });
      }
      if (newVal.length > 0 && newVal.length < 3) {
        if (newVal.includes(this.Express.First)) return;
        const _t = newVal[0];
        this.onRadioChange(_t);
      }
    },
    async curAddIndex(newVal) {
      if (newVal === 'new') return;
      const _t = this.customerInfo.Address.find(
        (it, i) => i === this.curAddIndex,
      );
      if (!_t) return;
      this.$store.commit('common/changeSelectedAdd', _t);
      this.ValidExpressLoading = true;
      const res = await this.api.getExpressValidList(_t);
      this.ValidExpressLoading = false;
      if (res.data.Status === 1000) {
        this.ExpressValidList = res.data.Data;
      }
    },
    curProductID() {
      this.clearCurProductState();
    },
  },
  created() {
    this.getAmapMount();
  },
  async mounted() {
    this.$store.dispatch('common/getExpressList');
    await this.$store.dispatch('common/getCustomerDetail');
    this.initCurAddIndex();
  },
};
</script>

<style lang='scss'>
.mp-pc-place-order-address-show-and-change-wrap {
  > .content {
    svg {
      width: 26px;
      height: 26px;
    }
    > ul {
      margin-top: 23px;
      margin-bottom: 18px;
      position: relative;
      > li {
        > div {
          display: inline-block;
          &.platform-code-box {
            position: relative;
            // > div {
            //   .el-input {
            //     width: 220px;
            //     > input {
            //       height: 30px;
            //       line-height: 28px;
            //       padding-left: 8px;
            //       font-size: 13px;
            //       &::placeholder {
            //         font-size: 12px;
            //       }
            //     }
            //   }
            //   button {
            //     margin-left: 10px;
            //     padding: 6px 12px;
            //     width: 50px;
            //   }
            //   display: inline-block;
            // }
            > div {
              display: inline-block;
              min-width: 256px;
              margin-right: 19px;
              padding-left: 4px;
            }
            margin-right: 12px;
          }
          &.express-box {
            > .title {
              margin-right: 6px;
            }
            .el-input {
              width: 118px;
              .el-input__inner {
                height: 30px;
                line-height: 26px\0;
                padding-right: 25px;
                padding-left: 12px;
                font-size: 13px;
              }
            }
            .el-radio {
              // margin-right: 24px;
              .el-radio__label {
                color: #585858;
                font-size: 13px;
              }
            }
          }
        }
        &.consignee-wrap {
          margin-top: 20px;
          overflow: hidden;
          white-space: nowrap;
          margin-bottom: 12px;
          > .consignee-box {
            width: 317px;
            margin-right: 52px;
            vertical-align: top;
            padding-top: 2px;
            > .consignee {
              margin-right: 30px;
              padding-left: 4px;
            }
            // .title {
            //   min-width: 4em;
            // }
          }
          > .address {
            width: 400px;
            padding-top: 2px;
            > span {
              &.title {
                float: left;
                position: relative;
                top: -2px;
              }
              &.title-content {
                overflow: hidden;
                // width: 312px;
                display: inline-block;
                white-space: normal;
                line-height: 18px;
                margin-top: -4px;
                font-size: 13px;
                > span {
                  margin-left: -6px;
                  line-height: 20px;
                  white-space: nowrap;
                  // line-height: 24px;
                }
                > i {
                  margin-right: 12px;
                  margin-bottom: 4px;
                  display: inline-block;
                }
              }
            }
          }
          > span {
            display: inline-block;
            vertical-align: top;
            margin-top: -1px;
            margin-left: 4px;
            &:active {
              background-color: #fff;
            }
          }
        }
        &.has-none-consignee {
          line-height: 28px;
          margin-top: 20px;
          font-size: 12px;
          text-align: left;
          color: #cbcbcb;
        }
        // &.add-title {
        //   position: absolute;
        //   left: 765px;
        //   top: 55px
        // }
      }
    }
  }
  .title {
    color: #888;
    min-width: 5em;
    text-align: right;
    display: inline-block;
    margin-right: 7px;
  }
  .set-craft-dia {
    // height: 400px;
    min-width: 750px;
    max-height: 1050px;
    box-sizing: border-box;
    .title {
      min-width: 4em;
    }
    .el-dialog__body {
      padding-left: 22px;
      padding-right: 22px;
      // height: 635px;
      min-height: 188px;
      > .change-add-dia-content {
        > li {
          > section {
            > .el-radio {
              margin-bottom: 20px;
              display: block;
              > .el-radio__label {
                display: inline-block;
                .address {
                  max-width: 380px;
                  display: inline-block;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                > .demo-ruleForm {
                  font-size: 12px;
                  > header {
                    > div {
                      margin-right: 16px;
                      display: inline-block;
                      > .el-form-item {
                        display: inline-block;
                        > .el-form-item__content {
                          height: 30px;
                          > .el-input {
                            width: 120px;
                            > input {
                              height: 25px;
                              line-height: 22px\0;
                              font-size: 12px;
                              &::placeholder {
                                color: #cbcbcb;
                              }
                            }
                          }
                        }
                        &.is-error {
                          > .el-form-item__content {
                            // height: 50px;
                            margin-bottom: 13px;
                          }
                        }
                      }
                    }
                    // margin-bottom: 25px;
                  }
                  > .content {
                    > .add-1 {
                      > .el-form-item {
                        display: inline-block;
                        > .el-form-item__content {
                          height: 30px;
                          > .el-select {
                            line-height: 30px;
                            > .el-input {
                              width: 100px;
                              > input {
                                height: 25px;
                                line-height: 22px\0;
                                font-size: 12px;
                                &::placeholder {
                                  color: #cbcbcb;
                                }
                              }
                            }
                            margin-right: 16px;
                          }
                        }
                        &.is-error {
                          > .el-form-item__content {
                            // height: 50px;
                            margin-bottom: 13px;
                          }
                        }
                      }
                      // margin-bottom: 10px;
                    }
                    > .add-2 {
                      > .el-form-item {
                        display: inline-block;
                        margin-left: 55px;
                        margin-right: 36px;
                        > .el-form-item__content {
                          height: 30px;
                          > .el-input {
                            width: 600px;
                            > input {
                              height: 25px;
                              line-height: 22px\0;
                              font-size: 12px;
                              &::placeholder {
                                color: #cbcbcb;
                              }
                            }
                          }
                        }
                        &.is-error {
                          > .el-form-item__content {
                            // height: 50px;
                            margin-bottom: 13px;
                          }
                        }
                      }
                      > button {
                        width: 120px;
                        height: 35px;
                        padding: 0;
                        vertical-align: top;
                      }
                    }
                  }
                  .title {
                    color: #585858;
                  }
                }
                .consig {
                  margin-right: 12px;
                  margin-left: 16px;
                  max-width: 80px;
                  display: inline-block;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                .radio-phone {
                  display: inline-block;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                .is-success.mgleft {
                  margin-left: 8px;
                }
                color: #585858;
              }
              &.new-address-radio {
                > .el-radio__input {
                  vertical-align: top;
                  position: relative;
                  top: 13px;
                }
              }
              .el-form-item {
                margin-bottom: 3px;
              }
              user-select: text;
            }
            .OutPlateNo {
              > div {
                display: inline-block;
                width: 165px;
                padding-right: 5px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                vertical-align: -1px;
              }
            }
          }
        }
        .el-loading-spinner > svg {
          width: 24px;
          height: 24px;
        }
      }
    }
    .el-dialog__footer {
      padding: 30;
      > .dialog-footer {
        text-align: center;
        > button {
          height: 35px;
          padding: 0;
          width: 120px;
          & + button {
            margin-left: 50px;
          }
        }
      }
    }
  }
  .out-place-code-content {
    display: inline-block;
    width: 253px;
  }
}
</style>
