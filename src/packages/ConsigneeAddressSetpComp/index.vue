<template>
  <section
    class="mp-pc-place-order-address-show-and-change-wrap"
    v-if="customerInfo"
  >
    <template v-if="!isBatchUploadUse">
      <header class="bg-gray"></header>
      <div class="comp-title float">
        <span class="left is-bold">收货信息</span>
        <span class="right span-title-blue" :class="ValidExpressLoading?'l':''" @click="onAddressChangeClick">{{
          addCompTitle
        }}</span>
      </div>
    </template>
    <div class="content" v-loading="ValidExpressLoading" :class="{isBatchUploadUse:isBatchUploadUse}">
      <ul>
        <!-- 收货地址展示 与 修改按钮 -->
        <li
          class="consignee-wrap"
          v-if="customerInfo.Address.length > 0 || NewAddressInfo.isSaved"
        >
          <template v-if="!isBatchUploadUse">
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
          </template>
          <template v-else>
            <label>
              <img src="@/assets/images/position.png" alt="">
              <span>收货地址</span>
              <!-- <span style="font-weight: bold;font-size: 12px;color: #585858;">（ 无平台单号时使用此地址 ）</span> -->
              <span>：</span>
            </label>
            <div class="is-font-size-13 is-font-13">
              <span class="address" :title="curAddressInfo && curAddressInfo.address.length>50?curAddressInfo.address:''">{{ curAddressInfo.address }}</span>
              <span class="is-bold">{{ curAddressInfo.Consignee }}</span>
              <span v-if="curAddressInfo.Mobile" class="is-gray">（ {{ curAddressInfo.Mobile }} ）</span>
            </div>
            <span class="blue-span is-font-size-13 is-font-13" @click="onAddressChangeClick">更改地址</span>
          </template>
        </li>
        <!-- 收货地址为空的处理 -->
        <li v-else class="has-none-consignee">
          <label for="" v-if="isBatchUploadUse">
            <img src="@/assets/images/position.png" alt="">
            <span>收货地址：</span>
          </label>
          <span class="is-pink">{{isBatchUploadUse ? '该客户' : '' }}尚未设置收货地址， </span>
          <span class="right span-title-blue is-font-size-13" @click="onAddressChangeClick">
            点击此处{{ addCompTitle }}</span
          >
          <span class="is-primary" v-if="!isBatchUploadUse">
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
          <div class="platform-code-box" v-if="!isBatchUploadUse">
            <span class="title">平台单号：</span>
            <div class="content">{{OutPlateNo}}</div>
          </div>
          <!-- 配送方式 -->
          <div class="express-box">
            <span class="title">{{isBatchUploadUse?'配送方式': '配送'}}：</span>
            <el-radio-group v-model="Express.First" @change="onRadioChange" :disabled='disabled'>
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
                  :popper-append-to-body='false'
                  size="mini"
                >
                  <el-option
                    v-for="item in secondExpressList"
                    :key="item.ID"
                    :label="item.Name"
                    :value="item.ID"
                    :disabled='!ExpressValidList.includes(item.ID)'
                  >
                  </el-option>
                </el-select>
              </el-radio>
              <el-radio :label="2" :disabled="!ExpressTypeDisabled.canLogistic">
                <el-select
                  v-model="thirdExValFor2"
                  @visible-change="onVisibleChangeFor2"
                  :disabled="!ExpressTypeDisabled.canLogistic"
                  :popper-append-to-body='false'
                  size="mini"
                >
                  <el-option
                    v-for="item in thirdExpressList"
                    :key="item.ID"
                    :label="item.Name"
                    :value="item.ID"
                    :disabled='!ExpressValidList.includes(item.ID)'
                  >
                  </el-option>
                </el-select>
              </el-radio>
            </el-radio-group>
          </div>
        </li>
        <li v-if="!isBatchUploadUse">
          <IdentifyFormItem
            ref="oIdentifyFormItemOut"
            :OutPlateNo="OutPlateNo"
            :disabled='disabled'
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
      isEmitType
      :canClose='false'
      :visible.sync="setMapVisible"
      :curEditInfo="tempDataForMapPosition.NewAddressInfo"
      :PropRegionalList='RegionalList'
      :PropCityList='CityList'
      :PropCountyList='CountyList'
      :canMpzj="canMpzj"
      :top="!canMpzj ? '15vh' : '7vh'"
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
     :customerInfo='customerInfo'
     @submit="onDialogSubmit"
    />
  </section>
</template>

<script>
import { amapAppkey, projectType } from '@/assets/js/setup';
import AddMapComp from './AddMapComp.vue';
import IdentifyFormItem from './IdentifyFormItem.vue';
import SetupDialog from './SetupDialog.vue';

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    watchClearVal: {
      default: '',
    },
    customerInfo: {
      type: Object,
      default: null,
    },
    curProductID: {
      default: '',
    },
    ExpressList: {
      type: Array,
      default: () => [],
    },
    // 是否为批量上传组件使用，为其单独设置样式
    isBatchUploadUse: {
      type: Boolean,
      default: false,
    },
    hiddenEmptyTips: { // 当可用配送方式列表为空时，是否进行提示
      type: Boolean,
      default: false,
    },
  },
  components: {
    AddMapComp,
    SetupDialog,
    IdentifyFormItem,
  },
  data() {
    return {
      secondExVal: '', // 快递
      thirdExVal: '', // 物流
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
      ExpressValidList: [], // 当前可用物流方式
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
    canMpzj() { // 可以使用名片之家配送（如果不可以的时候不需要地图定位，暂定下单及批量上传处生效）
      if (this.customerInfo && this.customerInfo.Type) {
        const { First } = this.customerInfo.Type;
        return ![8].includes(First);
      }
      return true;
    },
    localExpressList() {
      return this.ExpressList.map(it => ({
        ...it,
        ids: it.List.map(_it => _it.ID),
        useableIds: it.List.map(_it => _it.ID).filter(_it => this.ExpressValidList.includes(_it)),
      }));
    },
    secondExpressList() {
      if (this.localExpressList.length === 0) return [];
      return this.localExpressList.find((it) => it.Type === 3).List;
    },
    thirdExpressList() {
      if (this.localExpressList.length === 0) return [];
      return this.localExpressList.find((it) => it.Type === 2).List;
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
        if (newVal === this.Express.Second) return;
        this.onRadioChange(this.Express.First, newVal);
      },
    },
    thirdExValFor2: {
      get() {
        return this.thirdExVal;
      },
      set(newVal) {
        if (newVal === this.Express.Second) return;
        this.onRadioChange(this.Express.First, newVal);
      },
    },
    ExpressTypeDisabled() {
      const logisticItem = this.localExpressList.find(it => it.Type === 2);
      const expressItem = this.localExpressList.find(it => it.Type === 3);
      return {
        canMpzj: this.ExpressValidList.includes(1), // 名片之家
        canExpress: expressItem && expressItem.useableIds.length > 0, // 快递
        canLogistic: logisticItem && logisticItem.useableIds.length > 0, // 物流
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
      this.$emit('popperVisible', bool);
      if (!bool || !this.ExpressTypeDisabled.canLogistic) return;
      if (this.Express.First === 2 && this.Express.Second === this.thirdExVal) return;
      this.onRadioChange(2);
    },
    onVisibleChangeFor3(bool) {
      this.$emit('popperVisible', bool);
      if (!bool || !this.ExpressTypeDisabled.canExpress) return;
      if (this.Express.First === 3 && this.Express.Second === this.secondExVal) return;
      this.onRadioChange(3);
    },
    onRadioChange(First, Second) { // 配送方式选择切换
      let _Second;
      if (First === '') {
        _Second = '';
      } else if (Second || Second === 0) {
        _Second = Second;
      } else {
        let temp = '';
        switch (First) {
          case 1: // mpzj
            temp = 1;
            break;
          case 2: // wuliu
            temp = this.thirdExVal;
            break;
          case 3: // kuaidi
            temp = this.secondExVal;
            break;
          default:
            break;
        }
        if (this.ExpressValidList.includes(temp)) {
          _Second = temp;
        } else {
          const t = this.localExpressList.find(it => it.Type === First);
          // eslint-disable-next-line prefer-destructuring
          if (t && t.useableIds.length > 0) _Second = t.useableIds[0];
          else _Second = '';
        }
      }
      this.Express.Second = _Second;
      if (First === 2) this.thirdExVal = _Second;
      if (First === 3) this.secondExVal = _Second;
      if (this.Express.First !== First) this.Express.First = First;
      this.setInfo4ReqObj();
      this.handleValidAddressChange();
    },
    /** 地图定位相关方法
    ---------------------------------------------------- */
    handleMapSearchError() { // 地图定位错误的处理方式  可能会传递type以区分首页与弹窗2个使用位置
      if (this.openType !== 'edit') {
        this.setMapVisible = false; // 关闭地图
      }
      // this.SetAddressVisible = true; // 打开设置
    },
    setLatitudeLongitudeAfterPositioning(data) { // 定位后,设置经纬度
      const {
        Latitude, Longitude, AddressDetail, Consignee, Mobile, ExpressArea, RegionalList, CityList, CountyList,
      } = data;
      if (!this.tempDataForMapPosition || ((!Latitude || !Longitude) && this.canMpzj)) return;
      const { curAddIndex, OutPlateNo, NewAddressInfo } = this.tempDataForMapPosition;
      const oldIndex = this.curAddIndex;
      const oldExpressArea = oldIndex === 'new' ? this.NewAddressInfo.ExpressArea : null;
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
      if (this.$refs.oIdentifyFormItemOut) this.$refs.oIdentifyFormItemOut.setValueOnOut(OutPlateNo);
      this.setInfo4ReqObj();
      this.SetAddressVisible = false;
      if (this.setMapVisible) this.setMapVisible = false;
      if (oldIndex === 'new') this.handleUseableCompanyList(this.NewAddressInfo, oldIndex, oldExpressArea);
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
      this.$emit('changeAddressInfo', JSON.parse(JSON.stringify(_temp)));
    },
    /** 内容解析相关数据
    ---------------------------------------------------- */
    async onOutPlateNoResolved({ data, OutPlateNo } = {}) {
      this.curAddIndex = '';
      await this.$nextTick();
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
      // if (this.canMpzj) {
      //   this.setMapVisible = true;
      //   this.openType = 'edit';
      // }
      this.openType = 'edit';
      this.setMapVisible = true;
      // this.$refs.ruleForm.validate();
    },
    /** 弹窗地址修改相关方法
    ---------------------------------------------------- */
    onAddressChangeClick() { // 点击更改配送地址
      if (this.ValidExpressLoading) return;
      this.SetAddressVisible = true;
    },
    onDialogSubmit(e) { // 弹窗提交
      if (!e) return;
      const { curAddIndex, OutPlateNo, NewAddressInfo } = e;
      if (curAddIndex === 'new' && !OutPlateNo && this.canMpzj) { // 弹窗定位
        this.RegionalList = null;
        this.CityList = null;
        this.CountyList = null;
        // 如果已定位则不再需要定位
        if (NewAddressInfo.HavePosition && NewAddressInfo.Latitude && NewAddressInfo.Longitude) {
          this.curAddIndex = curAddIndex;
          this.OutPlateNo = OutPlateNo;
          this.NewAddressInfo = JSON.parse(JSON.stringify(NewAddressInfo));
          if (this.$refs.oIdentifyFormItemOut) this.$refs.oIdentifyFormItemOut.setValueOnOut(OutPlateNo);
          this.setInfo4ReqObj();
          this.SetAddressVisible = false;
        } else {
          this.openType = 'tempAdd';
          // eslint-disable-next-line max-len
          this.tempDataForMapPosition = { curAddIndex, OutPlateNo, NewAddressInfo: JSON.parse(JSON.stringify(NewAddressInfo)) };
          this.setMapVisible = true;
        }
      } else {
        const oldIndex = this.curAddIndex;
        const oldExpressArea = oldIndex === 'new' ? this.NewAddressInfo.ExpressArea : null;
        this.curAddIndex = curAddIndex;
        this.OutPlateNo = OutPlateNo;
        this.NewAddressInfo = JSON.parse(JSON.stringify(NewAddressInfo));
        if (!this.canMpzj) {
          if (curAddIndex === 'new' && oldIndex === 'new') this.handleUseableCompanyList(this.NewAddressInfo, oldIndex, oldExpressArea);
        }
        if (this.$refs.oIdentifyFormItemOut) this.$refs.oIdentifyFormItemOut.setValueOnOut(OutPlateNo);
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
      if (this.$refs.oIdentifyFormItemOut) this.$refs.oIdentifyFormItemOut.setValueOnOut('');
      if (this.curAddIndex === 'new') {
        this.initCurAddIndex();
      }
    },
    initCurAddIndex() { // 首次加载或切换产品时初始化收货地址
      if (!this.customerInfo) return;
      const _i = this.customerInfo.Address.findIndex(it => (Object.prototype.hasOwnProperty.call(it, 'isSelected') ? it.isSelected : it.IsDefault));
      if (_i > -1) this.curAddIndex = _i;
      else if (this.customerInfo.Address.length > 0) this.curAddIndex = 0;
      else this.curAddIndex = 'new';
      this.setInfo4ReqObj();
    },
    inputChecker() {
      return this.$refs.oIdentifyFormItemOut.formCheckerOnOut();
    },
    judgeValidEventEmit(curAddExpressArea, oldAddExpressArea) {
      if (!curAddExpressArea) return;
      if (!oldAddExpressArea) {
        // 此处触发一次
        this.handleValidAddressChange(true);
        return;
      }
      const { RegionalID, CityID, CountyID } = curAddExpressArea;
      if (RegionalID !== 'undefined'
       && (oldAddExpressArea.RegionalID !== RegionalID || oldAddExpressArea.CityID !== CityID || oldAddExpressArea.CountyID !== CountyID)) {
        // 触发
        this.handleValidAddressChange(true);
      }
    },
    handleValidAddressChange(e) {
      this.$nextTick(() => {
        this.$emit('validChange', e);
      });
    },
    handleInfoChange() {
      if (this.customerInfo) {
        this.curAddIndex = '';
        this.Express = {
          First: 1,
          Second: 1,
        };
        this.$nextTick(() => {
          this.initCurAddIndex();
        });
      }
    },
    async handleUseableCompanyList(data, oldIndex, oldExpressArea) {
      this.ValidExpressLoading = true;
      const temp = { ...data, OutPlateSN: this.OutPlateNo };
      if (!temp.CustomerID && this.customerInfo) {
        temp.CustomerID = this.customerInfo.CustomerID;
      }
      const resp = await this.api.getExpressUseableCompanyList(temp).catch(() => null);
      this.ValidExpressLoading = false;
      if (resp && resp.data.Status === 1000) {
        let result = resp.data.Data;
        // const result = [];
        if (!this.canMpzj) {
          result = result.filter(it => it !== 1);
        }
        this.ExpressValidList = result;
        if (result.includes(this.Express.Second)) {
          let oldAddExpressArea = typeof oldIndex === 'number' ? this.customerInfo.Address[oldIndex]?.ExpressArea : null;
          if (!oldAddExpressArea && oldIndex === 'new') oldAddExpressArea = oldExpressArea; // 该情况不会出现，new只有一个不会new之间切换状态
          this.judgeValidEventEmit(data.ExpressArea, oldAddExpressArea);
        }
      }
    },
    handleExpressEmptyTips() {
      if (this.ExpressValidList.length === 0) {
        if (!this.hiddenEmptyTips) {
          if (projectType === 'pc') {
            this.messageBox.warnSingleError({ title: '当前地址不可送达', msg: '当前地址没有可用配送方式，请更换地址或留意配送信息公告' });
          } else {
            this.messageBox.warnSingleError('当前地址没有可用配送方式，请更换地址或留意配送信息公告');
          }
        }
      }
    },
  },
  watch: {
    ExpressValidList(newVal) {
      if (newVal.length === 0) {
        this.handleExpressEmptyTips();
        this.onRadioChange('');
        this.secondExVal = '';
        this.thirdExVal = '';
        return;
      }
      if (this.secondExVal === '' || !newVal.includes(this.secondExVal)) {
        const t = this.localExpressList.find(it => it.Type === 3);
        if (t && t.useableIds.length > 0) {
          [this.secondExVal] = t.useableIds;
        } else {
          this.secondExVal = '';
        }
      }
      if (this.thirdExVal === '' || !newVal.includes(this.thirdExVal)) {
        const t = this.localExpressList.find(it => it.Type === 2);
        if (t && t.useableIds.length > 0) {
          [this.thirdExVal] = t.useableIds;
        } else {
          this.thirdExVal = '';
        }
      }
      if (newVal.includes(this.Express.Second)) return;
      if (newVal.includes(1)) {
        this.onRadioChange(1);
        return;
      }
      let t = this.localExpressList.find(it => it.useableIds.length > 0 && it.Type === 3);
      if (!t) t = this.localExpressList.find(it => it.useableIds.length > 0);
      if (t) {
        this.onRadioChange(t.Type);
      } else {
        this.onRadioChange('');
      }
    },
    async curAddIndex(newVal, oldVal) {
      if (newVal === 'new') {
        if (this.customerInfo.Address.length === 0 && !this.NewAddressInfo.isSaved) {
          this.ExpressValidList = [];
          this.curAddIndex = '';
          return;
        }
        this.handleUseableCompanyList(this.NewAddressInfo, oldVal, null);
        return;
      }
      const _t = this.customerInfo.Address.find((it, i) => i === newVal);
      if (!_t) return;
      this.$emit('changeDefaultSelectAddress', _t);
      this.handleUseableCompanyList(_t, oldVal, this.NewAddressInfo.ExpressArea);
    },
    watchClearVal() {
      this.clearCurProductState();
    },
    customerInfo() {
      this.handleInfoChange();
    },
    curProductID() { // 切换产品时初始化收货地址等信息
      // if (newVal && oldVal && oldVal !== newVal) {
      //   this.handleInfoChange();
      // }
    },
  },
  created() {
    this.getAmapMount();
  },
  async mounted() {
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
            .title {
              width: 84px;
              margin-right: 2px;
            }
            > div {
              display: inline-block;
              min-width: 261px;
              margin-right: 19px;
              padding-left: 4px;
            }
            margin-right: 4px;
          }
          &.express-box {
            > .title {
              margin-right: 6px;
            }
            .el-input {
              width: 118px;
              .el-input__inner {
                height: 26px;
                line-height: 22px\0;
                padding-right: 25px;
                padding-left: 12px;
                font-size: 12px;
              }
            }
            .el-radio {
              .el-radio__label {
                color: #585858;
                font-size: 13px;
              }
              .is-cancel {
                color: #bbb !important;
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
            width: 334px;
            margin-right: 40px;
            vertical-align: top;
            padding-top: 2px;
            > .consignee {
              margin-right: 30px;
              padding-left: 4px;
            }
            .title {
              width: 84px;
              margin-right: 2px;
            }
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
                display: inline-block;
                white-space: normal;
                line-height: 18px;
                margin-top: -4px;
                font-size: 13px;
                > span {
                  margin-left: -6px;
                  line-height: 20px;
                  white-space: nowrap;
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
      }
    }
    &.isBatchUploadUse {
      > ul {
        margin-top: 7px;
        > li {
            display: flex;
            align-items: center;
            color: #888E99;
            width: 90%;
            // overflow: hidden;
            height: 32px;
            margin-top: 8px;
            margin-bottom: 0;
            > label {
              flex: none;
              display: flex;
              align-items: center;
              margin-right: 3px;
              font-size: 13px;
              line-height: 16px;
              img {
                margin-right: 8px;
              }
            }
            > div {
              flex: 0 1 auto;
              // overflow: hidden;
              margin-right: 20px;
              display: flex;
              span {
                flex: none;
                line-height: 16px;
                font-size: 12px;
                &.address {
                  flex: 1;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  margin-right: 15px;
                  color: #585858;
                  & + span {
                    color: #585858;
                  }
                }
              }
            }
            .express-box {
              display: flex;
              line-height: 28px;
              > .title {
                width: 91px;
                margin-right: 2px;
                line-height: 25px;
                font-size: 13px;
              }
              > div {
                .el-radio__label, .el-input .el-input__inner {
                  font-size: 12px;
                  line-height: 28px;
                }
              }
            }
            &:last-of-type {
              margin-top: 8px;
            }
            &.consignee-wrap {
              overflow: hidden;
              > div {
                overflow: hidden;
              }
            }

        }
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
    min-width: 750px;
    max-height: 1050px;
    box-sizing: border-box;
    .title {
      min-width: 5em;
      margin-right: 0;
    }
    .el-dialog__header {
      padding: 6px 10px;
      margin: 0 10px;
      line-height: 30px;
      border-bottom: 1px solid #eee;
      font-size: 15px;
      color: #888E99;
      .el-dialog__headerbtn {
        top: 11px;
      }
      // > header {
      //   &::before {
      //     content: '';
      //     height: 16px;
      //     width: 3px;
      //     background-color: #26bcf9;
      //     display: inline-block;
      //     position: relative;
      //     top: 2px;
      //     margin-right: 10px;
      //   }
      // }
    }
    .el-dialog__body {
      padding-left: 22px;
      padding-right: 22px;
      min-height: 188px;
      font-size: 12px;
      > .change-add-dia-content {
        > li {
          > section {
            > .el-radio {
              margin-bottom: 20px;
              display: block;
              > .el-radio__label {
                display: inline-block;
                font-size: 12px;
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
                              line-height: 23px;
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
                                line-height: 23px;
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
  .comp-title > span.span-title-blue.l {
    pointer-events: none;
  }
}
</style>
