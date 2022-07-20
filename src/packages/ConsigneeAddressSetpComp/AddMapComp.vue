<template>
  <el-dialog
    :visible="visible"
    v-if="visible"
    :top='top'
    width="1000px"
    v-dialogDrag
    destroy-on-close
    :close-on-click-modal='false'
    :before-close='handleBeforeDiaClose'
    custom-class="set-craft-dia mp-pc-address-map-comp-wrap"
   >
    <header slot="title">
      <i class="iconfont icon-shezhi is-primary-blue"></i>
      <span>{{title}}</span>
    </header>

    <ul class="change-add-dia-content"  :class="{[projectType]:projectType, tempAdd:openType==='tempAdd'}">
      <li>
        <section v-show="openType !== 'tempAdd'">
          <el-form :model="newAdd" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm" @submit.native.prevent>
            <header>
              <div>
                <span class="title">收货人：</span>
                <el-form-item prop="Consignee" size="mini">
                  <el-input v-model.trim="newAdd.Consignee" placeholder="收货人姓名"></el-input>
                </el-form-item>
              </div>
              <div>
                <span class="title">手机号：</span>
                <el-form-item prop="Mobile" size="mini">
                  <el-input el-input v-model.trim="Mobile" class="phone-box" placeholder="手机号" maxlength="11"></el-input>
                </el-form-item>
              </div>
            </header>
            <div class="content" v-loading='loadingAddInfo'>
              <div class="add-1">
                <span class="title">收货地址：</span>
                <el-form-item prop="Regional">
                  <el-select v-model="RegionalID" size="mini">
                    <el-option
                      v-for="item in RegionalList"
                      :key="item.ID"
                      :label="item.Name"
                      :value="item.ID">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="City">
                  <el-select v-model="CityID" :disabled="CityList.length === 0" size="mini">
                    <el-option
                      v-for="item in CityList"
                      :key="item.ID"
                      :label="item.Name"
                      :value="item.ID">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="County">
                  <el-select v-model="CountyID" :disabled="CountyList.length === 0" size="mini">
                    <el-option
                      v-for="item in CountyList"
                      :key="item.ID"
                      :label="item.Name"
                      :value="item.ID">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="add-2">
                <el-form-item prop="AddressDetail">
                <el-input v-model.trim="AddressDetail" maxlength="40"
                  show-word-limit placeholder="详细地址 (不包含省市区)"></el-input>
                </el-form-item>
                <el-button
                  v-if="canMpzj"
                  type="primary" class="map-location-btn"
                  :disabled='!newAdd.ExpressArea.CountyID'
                  @click="handleMapLocationClick"
                >地图定位</el-button>
              </div>
            </div>
          </el-form>
        </section>
      </li>
      <li v-if="openType === 'tempAdd' && addressDisplayContent">
        <span class="is-gray is-font-13">当前设置地址：{{addressDisplayContent}}</span>
      </li>
      <p class="tips-row is-pink is-font-12"
        :class="{r: HaveAddressContentChange}"
      style="padding-top: 8px;padding-left: 70px;padding-right: 32px;">{{tipContent}}</p>
      <li class="map-wrap" v-if="canMpzj">
        <div class="map-content" id="map-container" v-show="(newAdd.HavePosition || openType==='tempAdd') && !HaveAddressContentChange"
         v-loading="mapIsLoading">
        </div>
      </li>
      <li style="text-align:center;padding-top: 8px" v-show="(newAdd.HavePosition || openType==='tempAdd') && !HaveAddressContentChange">
        <span class="is-pink is-font-16">请在地图上选择准确位置，否则会造成货物无法正常配送，影响您的正常使用！</span>
      </li>
    </ul>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary"
       @click="handleSubmit('ruleForm')"
       :title="HaveAddressContentChange ? '省市区地址发生变动，请重新定位' : ''">{{isEmitType ? '确定' : '保存'}}</el-button>
      <el-button v-if="openType !== 'tempAdd'" @click="handleBeforeDiaClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
/* eslint-disable consistent-return */
/* eslint-disable no-undef */
/* eslint-disable object-curly-newline */
import { amapAppkey, projectType } from '../../assets/js/setup';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    canMpzj: { // 是否可以使用名片之家配送， 目前电商客户除外，如果不可以则不需要定位
      type: Boolean,
      default: true,
    },
    openType: {
      type: String,
      default: 'new', // edit | new | tempAdd
    },
    curEditInfo: {
      type: Object,
      default: null,
    },
    isTemp: {
      type: Boolean,
      default: false,
    },
    PropRegionalList: {
      type: Array,
      default: null,
    },
    PropCityList: {
      type: Array,
      default: null,
    },
    PropCountyList: {
      type: Array,
      default: null,
    },
    isEmitType: { // 收集完地址信息后的处理方式：不自动进行接口调用，而是把收集到的结果信息使用emit返回给上级组件，随后执行弹窗关闭
      type: Boolean,
      default: false,
    },
    top: {
      type: String,
      default: '5vh',
    },
  },
  data() {
    const validateRegional = (rule, value, callback) => {
      if (!this.newAdd.ExpressArea.RegionalID) callback(new Error('请选择省份'));
      else callback();
    };
    const validateCity = (rule, value, callback) => {
      if (!this.newAdd.ExpressArea.CityID) callback(new Error('请选择城市'));
      else callback();
    };
    const validateCounty = (rule, value, callback) => {
      if (!this.newAdd.ExpressArea.CountyID) callback(new Error('请选择地区'));
      else callback();
    };
    const mobileRegxp = /1[3456789]\d{9}/;
    return {
      newAdd: {
        Consignee: '',
        Mobile: '',
        AddressID: '',
        CustomerID: '',
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
      },
      rules: {
        Consignee: [
          { required: true, message: '请输入收货人姓名', trigger: 'blur' },
        ],
        Mobile: [
          { required: true, message: '请输入11位手机号码', trigger: 'blur' },
          { pattern: mobileRegxp, message: '手机号码格式不正确', trigger: 'blur' },
        ],
        AddressDetail: [
          { required: true, message: '请填写详细地址(不包含省市区)', trigger: 'blur' },
          { min: 1, max: 60, message: '最多60个字符', trigger: 'blur' },
        ],
        Regional: [
          { validator: validateRegional, trigger: 'change' },
        ],
        City: [
          { validator: validateCity, trigger: 'change' },
        ],
        County: [
          { validator: validateCounty, trigger: 'change' },
        ],
      },
      defineRules: {
        Mobile: [
          { strategy: 'isNotEmpty', errorMsg: '请输入手机号!' },
          { strategy: 'shouldLength:11', errorMsg: '请输入11位手机号码' },
          { strategy: 'isPhone', errorMsg: '手机号码格式不正确' },
        ],
      },
      RegionalList: [],
      CityList: [],
      CountyList: [],
      // 下方为地图相关
      lng: 113.625351,
      lat: 34.746303,
      zoom: 14,
      mapIsLoading: false,
      lastSearchWords: '',
      isMapLoaded: false,
      searchOption: {
        // city: '河南',
        // citylimit: false,
      },
      canClose: true, // 是否可关闭地图窗口 下单添加新地址时可用
      mapCenter: [113.625351, 34.746303],
      map: null,
      initNum: 0,
      loadingAddInfo: false,
      HaveAddressContentChange: false,
      HaveAddressDetailChange: false,
      projectType,
    };
  },
  computed: {
    Mobile: {
      get() {
        return this.newAdd.Mobile;
      },
      set(newVal) {
        this.newAdd.Mobile = newVal.replace(/[^\d.]/g, '');
      },
    },
    title() {
      if (this.openType === 'edit') {
        if (this.isTemp) {
          if (!this.canMpzj) {
            return '地址信息';
          }
          return '地图定位';
        }
        return '编辑配送地址';
      }
      if (this.openType === 'new') {
        return '新增配送地址';
      }
      if (this.openType === 'tempAdd') {
        return '地图定位';
      }
      return '';
    },
    addressDisplayContent() {
      if (!this.curEditInfo || !this.curEditInfo.ExpressArea) return '';
      const { ExpressArea, AddressDetail } = this.curEditInfo;
      const { RegionalName, CityName, CountyName } = ExpressArea;
      if (RegionalName && CityName && CountyName && AddressDetail) {
        return `${RegionalName}${CityName}${CountyName}${AddressDetail}`;
      }
      return '';
    },
    RegionalID: {
      get() {
        return this.newAdd.ExpressArea.RegionalID;
      },
      set(id) {
        this.newAdd.ExpressArea.RegionalID = id;
        this.handleRegionalChange(id);
      },
    },
    CityID: {
      get() {
        return this.newAdd.ExpressArea.CityID;
      },
      set(id) {
        this.newAdd.ExpressArea.CityID = id;
        this.handleCityChange(id);
      },
    },
    CountyID: {
      get() {
        return this.newAdd.ExpressArea.CountyID;
      },
      set(id) {
        this.newAdd.ExpressArea.CountyID = id;
        this.handleCountyChange(id);
      },
    },
    AddressDetail: {
      get() {
        return this.newAdd.AddressDetail;
      },
      set(val) {
        this.newAdd.AddressDetail = val;
        // this.HaveAddressContentChange = true;
        this.HaveAddressDetailChange = true;
      },
    },
    tipContent() {
      let str = '';
      if (!this.newAdd.Latitude || !this.newAdd.Longitude) {
        str = '';
      } else if (this.HaveAddressContentChange) {
        str = '请点击按钮 重新定位';
      } else if (this.HaveAddressDetailChange) {
        // str = '详细地址发生变动，请重新设置地图定位或在地图中重新选定坐标';
        str = '详细地址变更，请在地图中重新选定坐标 或 重新地图定位';
      }
      return str;
    },
  },
  methods: {
    async handleRegionalChange(e) {
      const _t = this.RegionalList.find(it => it.ID === e);
      this.newAdd.ExpressArea.RegionalName = _t.Name;
      this.newAdd.ExpressArea.CityID = '';
      this.newAdd.ExpressArea.CityName = '';
      this.newAdd.ExpressArea.CountyID = '';
      this.newAdd.ExpressArea.CountyName = '';
      this.CityList = [];
      this.CountyList = [];
      this.HaveAddressContentChange = true;

      if (this.CityList.length === 0 || this.CityList[0].ParentID !== e) {
        this.loadingAddInfo = true;
        const res = await this.api.getAddressIDList(e);
        this.loadingAddInfo = false;
        if (res.data.Status === 1000) {
          this.CityList = res.data.Data;
        }
      }
    },
    async handleCityChange(e) {
      const _t = this.CityList.find(it => it.ID === e);
      this.newAdd.ExpressArea.CityName = _t.Name;
      this.newAdd.ExpressArea.CountyID = '';
      this.newAdd.ExpressArea.CountyName = '';
      this.CountyList = [];
      this.HaveAddressContentChange = true;

      if (this.CountyList.length === 0 || this.CountyList[0].ParentID !== e) {
        this.loadingAddInfo = true;
        const res = await this.api.getAddressIDList(e);
        this.loadingAddInfo = false;
        if (res.data.Status === 1000) {
          this.CountyList = res.data.Data;
        }
      }
    },
    handleCountyChange(e) {
      const _t = this.CountyList.find(it => it.ID === e);
      this.newAdd.ExpressArea.CountyName = _t.Name;
      this.HaveAddressContentChange = true;
    },
    handleClose() {
      this.$emit('update:visible', false);
    },
    async handleSubmit(formName) {
      if (this.openType === 'new') { // 后台不会到该步 内部代码未做修改（仅前台可用到）
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            if (!this.newAdd.HavePosition) {
              if (projectType === 'pc') {
                this.messageBox.failSingleError({
                  title: '尚未设置地图定位',
                  msg: '请点击 [ 地图定位 ] 按钮进行设置',
                });
              } else {
                this.messageBox.failSingleError('尚未设置地图定位', '请点击 [ 地图定位 ] 按钮进行设置');
              }
              return;
            }
            if (this.tipContent) {
              if (projectType === 'pc') {
                this.messageBox.failSingleError({
                  title: '保存失败',
                  msg: this.tipContent,
                });
              } else {
                this.messageBox.failSingleError('保存失败', this.tipContent);
              }
              return;
            }
            // 新增地址
            const _obj = JSON.parse(JSON.stringify(this.newAdd));
            if (this.isEmitType) {
              this.$emit('submit', _obj, this.openType);
              this.handleBeforeDiaClose();
              return;
            }
            const res = await this.api.getCustomerAddress(_obj);
            if (res.data.Status === 1000) {
              const successFunc = () => {
                this.newAdd.AddressID = res.data.Data;
                this.$store.commit('common/handleAddOrEditAddressOnStore', [this.newAdd, 'add']);
                this.handleBeforeDiaClose();
              };
              if (projectType === 'pc') {
                this.messageBox.successSingle({
                  title: '地址添加成功',
                  successFunc,
                  failFunc: successFunc,
                });
              } else {
                this.messageBox.successSingle('地址添加成功', successFunc, successFunc);
              }
            }
          }
        });
      } else if (this.openType === 'tempAdd') {
        if (this.tipContent) {
          if (projectType === 'pc') {
            this.messageBox.failSingleError({
              title: '保存失败',
              msg: this.tipContent,
            });
          } else {
            this.messageBox.failSingleError('保存失败', this.tipContent);
          }
          return;
        }
        this.$emit('changeProps', this.newAdd);
        this.canClose = true;
        this.handleBeforeDiaClose(true);
      } else {
        // 编辑地址
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            if (this.tipContent) {
              if (projectType === 'pc') {
                this.messageBox.failSingleError({
                  title: '保存失败',
                  msg: this.tipContent,
                });
              } else {
                this.messageBox.failSingleError('保存失败', this.tipContent);
              }
              return;
            }
            const _obj = JSON.parse(JSON.stringify(this.newAdd));
            if (this.isTemp) {
              // eslint-disable-next-line max-len
              this.$emit('submit', { ..._obj, RegionalList: this.RegionalList, CityList: this.CityList, CountyList: this.CountyList });
              return;
            }
            if (this.isEmitType) {
              this.$emit('submit', _obj, this.openType);
              this.handleBeforeDiaClose();
              return;
            }
            const res = await this.api.getCustomerAddress(_obj);
            if (res.data.Status === 1000) {
              const successFunc = () => {
                this.$store.commit('common/handleAddOrEditAddressOnStore', [this.newAdd, 'edit']);
                this.handleBeforeDiaClose();
              };
              if (projectType === 'pc') {
                this.messageBox.successSingle({
                  title: '地址修改成功',
                  successFunc,
                  failFunc: successFunc,
                });
              } else {
                this.messageBox.successSingle('地址修改成功', successFunc, successFunc);
              }
            }
          }
        });
      }
    },
    setPositionIndex(lng, lat, flag = true) {
      // 获取坐标点后，修改小数点位数，修改data中心坐标点坐标，修改vuex中左边点值
      const _lng = lng.toFixed(6);
      const _lat = lat.toFixed(6);
      if (flag) {
        this.lng = _lng;
        this.lat = _lat;
        this.mapCenter = [lng, lat];
      }
      this.newAdd.Latitude = _lat;
      this.newAdd.Longitude = _lng;
    },
    handleMapClick(e) {
      this.HaveAddressDetailChange = false;
      this.setPositionIndex(e.lnglat.lng, e.lnglat.lat);
    },
    onSearchResult(pois) {
      this.mapIsLoading = false;
      this.HaveAddressContentChange = false;
      this.HaveAddressDetailChange = false;
      if (pois.length > 0) {
        const { lng, lat } = pois[0];
        this.setPositionIndex(lng, lat);
      }
    },
    handleMapLocationClick() {
      const { AddressDetail, ExpressArea } = this.newAdd;
      const { RegionalName, CityName, CountyName } = ExpressArea;
      const _str = `${RegionalName}${CityName}${CountyName}${AddressDetail}`;
      if (_str === this.lastSearchWords) return;
      // this.lastSearchWords = '';
      this.newAdd.HavePosition = true;
      this._PlaceSearch.search(_str, (status, result) => {
        this.mapIsLoading = false;
        if (result && result.poiList && result.poiList.count) {
          const { poiList: { pois } } = result;
          const LngLats = pois.map(poi => {
            const _point = poi;
            _point.lat = poi.location.lat;
            _point.lng = poi.location.lng;
            return _point;
          });
          this.onSearchResult(LngLats);
          this.initNum += 1;
        } else if (status === 'error' || result.poiList === undefined) {
          const successFunc = () => {
            this.$emit('handleMapSearchError');
          };
          const msg = typeof result === 'string' ? result : '搜索不到地址，请更改关键词并重新定位!';
          if (projectType === 'pc') {
            this.messageBox.failSingleError({
              title: '定位失败',
              msg,
              successFunc,
              failFunc: successFunc,
            });
          } else {
            this.messageBox.failSingleError('定位失败', msg, successFunc, successFunc);
          }
          if (!this.initNum && this.openType === 'new') this.newAdd.HavePosition = false;
          throw new Error('定位过程中出现错误!');
        }
      });
      this.mapIsLoading = true;
      this.lastSearchWords = _str;
    },
    async handleDialogOpen() {
      this.initNum = 0;
      this.lastSearchWords = '';
      this.HaveAddressContentChange = false;
      this.HaveAddressDetailChange = false;
      this.$nextTick(() => {
        if (!this.canMpzj) return;
        this.map = new AMap.Map('map-container', {
          center: [this.lng, this.lat],
          resizeEnable: true,
          zoom: 14,
        });
        AMap.plugin('AMap.ToolBar', () => { // 异步加载插件
          const toolbar = new AMap.ToolBar();
          this.map.addControl(toolbar);
        });
        this._PlaceSearch = new AMap.PlaceSearch(this.searchOption);
        this.marker = new AMap.Marker({
          position: [this.lng, this.lat], // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: '北京',
        });

        // 将创建的点标记添加到已有的地图实例：
        this.map.add(this.marker);
        this.map.on('click', this.handleMapClick);
        if (this.openType === 'tempAdd') this.handleMapLocationClick();
        if (this.openType === 'edit' && this.isTemp) this.handleMapLocationClick();
      });
      // }
      if (this.openType === 'edit') {
        if (!this.curEditInfo) return;
        // eslint-disable-next-line max-len
        const { AddressDetail, AddressID, Consignee, ExpressArea, CustomerID, HavePosition, IsDefault, Latitude, Longitude, Mobile } = this.curEditInfo;
        this.newAdd.Consignee = Consignee;
        this.newAdd.Mobile = Mobile;
        this.newAdd.AddressID = AddressID;
        this.newAdd.CustomerID = CustomerID;
        this.newAdd.AddressDetail = AddressDetail;
        this.newAdd.HavePosition = HavePosition;
        this.newAdd.IsDefault = IsDefault;
        this.newAdd.Latitude = Latitude;
        this.newAdd.Longitude = Longitude;
        const { RegionalName, RegionalID, CityName, CityID, CountyName, CountyID } = ExpressArea;
        this.newAdd.ExpressArea.RegionalName = RegionalName;
        this.newAdd.ExpressArea.RegionalID = RegionalID;
        this.newAdd.ExpressArea.CityName = CityName;
        this.newAdd.ExpressArea.CityID = CityID;
        this.newAdd.ExpressArea.CountyName = CountyName;
        this.newAdd.ExpressArea.CountyID = CountyID;
        if (this.isTemp) this.canClose = false;
        if (Latitude && Longitude) {
          this.lng = Longitude;
          this.lat = Latitude;
          this.mapCenter = [Longitude, Latitude];
          this.setPositionIndex(+Longitude, +Latitude, false);
        }
        if (ExpressArea) {
          this.loadingAddInfo = true;
          const handleList = async (list, parentID) => {
            if (Array.isArray(list) && list.length > 0) {
              if (list[0].ParentID === parentID) return list;
            }
            if (parentID || parentID === 0) {
              const res = await this.api.getAddressIDList(parentID).catch(() => {});
              if (res && res.data.Status === 1000) return res.data.Data;
            }
            return [];
          };
          const respList = await Promise.all([
            handleList(this.PropRegionalList, -1),
            handleList(this.PropCityList, RegionalID),
            handleList(this.PropCountyList, CityID),
          ]);
          this.loadingAddInfo = false;
          this.RegionalList = [...respList[0]];
          this.CityList = [...respList[1]];
          this.CountyList = [...respList[2]];
        }
      } else if (this.openType === 'tempAdd') {
        if (!this.curEditInfo) return;
        // eslint-disable-next-line max-len
        const { AddressDetail, isSaved, Consignee, ExpressArea, CustomerID, HavePosition, IsDefault, Latitude, Longitude, Mobile } = this.curEditInfo;
        this.newAdd.Consignee = Consignee;
        this.newAdd.Mobile = Mobile;
        this.newAdd.isSaved = isSaved;
        this.newAdd.CustomerID = CustomerID;
        this.newAdd.AddressDetail = AddressDetail;
        this.newAdd.HavePosition = HavePosition;
        this.newAdd.IsDefault = IsDefault;
        this.newAdd.Latitude = Latitude;
        this.newAdd.Longitude = Longitude;
        const { RegionalName, RegionalID, CityName, CityID, CountyName, CountyID } = ExpressArea;
        this.newAdd.ExpressArea.RegionalName = RegionalName;
        this.newAdd.ExpressArea.RegionalID = RegionalID;
        this.newAdd.ExpressArea.CityName = CityName;
        this.newAdd.ExpressArea.CityID = CityID;
        this.newAdd.ExpressArea.CountyName = CountyName;
        this.newAdd.ExpressArea.CountyID = CountyID;
        this.canClose = false;
      } else {
        this.CityList = [];
        this.CountyList = [];
        if (this.RegionalList.length > 0) return;
        this.loadingAddInfo = true;
        const res = await this.api.getAddressIDList(-1);
        this.loadingAddInfo = false;
        if (res.data.Status === 1000) {
          this.RegionalList = res.data.Data;
        }
      }
    },
    handleBeforeDiaClose() {
      if ((this.openType === 'tempAdd') && !this.canClose) {
        if (projectType === 'pc') {
          this.messageBox.failSingleError({
            title: '新增地址需要定位',
            msg: '请在地图中保存收货地址定位!',
          });
        } else {
          this.messageBox.failSingleError('新增地址需要定位', '请在地图中保存收货地址定位');
        }
        return;
      }
      // ---------------------- 在此应设置数据还原
      this.newAdd = {
        Consignee: '',
        Mobile: '',
        AddressID: '',
        CustomerID: '',
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
        // isSaved: false,
      };
      this.$refs.ruleForm.resetFields();
      this.handleClose();
    },
    getAmapMount() {
      // 09966c2b866f9783b49969af19102d91 geren
      // eslint-disable-next-line max-len
      const url = `https://webapi.amap.com/maps?v=1.4.15&key=${amapAppkey}&plugin=AMap.PlaceSearch,AMap.Geocoder&callback=initMap`;

      let key = true;
      const oSrc = document.getElementsByTagName('script');
      oSrc.forEach(it => {
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
  },
  watch: {
    visible(newVal) {
      if (newVal) this.handleDialogOpen();
    },
    mapCenter() {
      if (this.map) this.map.setCenter(this.mapCenter);
      if (this.marker) this.marker.setPosition(this.mapCenter);
    },
  },
  created() {
    this.getAmapMount();
  },
};
</script>

<style lang='scss'>
.set-craft-dia.mp-pc-address-map-comp-wrap {
    // height: 800px;
    box-sizing: border-box;
    .title {
      min-width: 5em;
      display: inline-block;
      text-align: right;
    }
    .el-dialog__header {
      padding: 7px 15px !important;
      position: relative;
      height: 30px;
      line-height: 30px !important;
      > header {
        height: 14px;
        line-height: 30px !important;
        color: #888;
      }
      .el-dialog__headerbtn {
        top: 11px !important;
      }
      &::after {
        height: 1px;
        width: calc(100% - 20px);
        margin: 0 10px;
        content: '';
        position: absolute;
        left: 0;
        bottom: -1px;
        background: whitesmoke;
      }
    }
    .el-dialog__body {
      padding-left: 22px;
      padding-right: 22px;
      padding-top: 25px;
      padding-bottom: 10px;
      // height: 635px;
      min-height: 188px;
      > .change-add-dia-content {
        // height: 630px;
        &.tempAdd {
          height: 542px;
          > .map-wrap {
            margin-top: 5px;
            margin-bottom: 16px;
          }
        }
        > li {
          > section {
                > .demo-ruleForm {
                  font-size: 14px;
                  > header {
                    margin-bottom: 15px;
                    > div {
                      margin-right: 16px;
                      display: inline-block;
                      > .el-form-item {
                        display: inline-block;
                        > .el-form-item__content {
                          height: 35px;
                          > .el-input {
                            width: 120px;
                            > input {
                              height: 30px !important;
                              line-height: 26px\0;
                              font-size: 14px;
                              padding-left: 12px;
                              // padding-right: 12px;
                              &::placeholder {
                                color: #cbcbcb;
                              }
                            }
                            // &.phone-box {
                            //   width: 126px;
                            // }
                          }
                        }
                        // &.is-error {
                        //   > .el-form-item__content {
                        //     // height: 50px;
                        //     // margin-bottom: 14px;
                        //   }
                        // }
                      }
                    }
                    // margin-bottom: 25px;
                  }
                  > .content {
                    .el-loading-mask {
                      width: 800px;
                      .el-loading-spinner {
                        width: 580px;
                      }
                      svg {
                        height: 25px;
                        width: 25px;
                      }
                    }
                    > .add-1 {
                      > .el-form-item {
                        display: inline-block;
                        > .el-form-item__content {
                          height: 35px;
                          > .el-select {
                            line-height: 30px;
                            width: 100%;
                            > .el-input {
                              width: 100px;
                              > input {
                                height: 30px;
                                font-size: 13px;
                                padding-left: 12px;
                                padding-right: 22px;
                                line-height: 26px\0;
                                border-radius: 3px;
                                &::placeholder {
                                  color: #cbcbcb;
                                }
                              }
                              > span {
                                right: 2px;
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
                        margin-left: 70px;
                        margin-right: 36px;
                        > .el-form-item__content {
                          height: 35px;
                          > .el-input {
                            width: 700px;
                            > input {
                              height: 30px;
                              font-size: 14px;
                              padding-left: 12px;
                              line-height: 26px\0;
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
                }
                .is-success.mgleft {
                  margin-left: 8px;
                }
                color: #585858;
          }
          .el-form-item {
            margin-bottom: 3px;
          }
          &.map-wrap {
            height: 485px;
            margin-top: 15px;
            > div > .el-vue-search-box-container {
              opacity: 0;
              height: 1px;
              width: 1px;
              overflow: hidden;
            }
          }
        }
        input {
          border-radius: 4px;
          font-size: 13px !important;
        }
        &.erp {
          .el-input__suffix {
            top: -2px;
          }
        }
        > .tips-row.r {
          text-align: right;
        }
      }
    }
    .el-dialog__footer {
      padding: 30;
      > .dialog-footer {
        text-align: center;
        > .tips-row {
          color: #ff3769;
          font-size: 12px;
          padding-bottom: 8px;
          padding-left: 340px;
          line-height: 20px;
          text-align: left;
          height: 20px;
        }
        > button {
          height: 35px;
          padding: 0;
          width: 120px;
          font-size: 14px;
          & + button {
            margin-left: 50px;
          }
        }
      }
    }
    #map-container {
      width: 956px;
      height: 485px;
    }
}
</style>
