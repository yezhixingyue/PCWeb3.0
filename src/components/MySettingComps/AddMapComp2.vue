<template>
  <el-dialog
    :visible="visible"
    v-if="visible"
    top='7vh'
    width="1000px"
    v-dialogDrag
    destroy-on-close
    :before-close='handleBeforeDiaClose'
    custom-class="set-craft-dia mp-pc-address-map-comp-wrap"
   >
    <header slot="title">
      <i class="iconfont icon-shezhi is-primary-blue"></i>
      <span>{{title}}</span>
    </header>

    <ul class="change-add-dia-content"  :class="openType==='tempAdd'?'tempAdd':''">
      <li>
        <section v-show="openType !== 'tempAdd'">
          <el-form :model="newAdd" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
            <header>
              <div>
                <span class="title">收货人：</span>
                <el-form-item prop="Consignee">
                  <el-input v-model.trim="newAdd.Consignee" placeholder="收货人姓名"></el-input>
                </el-form-item>
              </div>
              <div>
                <span class="title">手机号：</span>
                <el-form-item prop="Mobile">
                  <el-input el-input v-model.trim="Mobile" class="phone-box" placeholder="手机号"></el-input>
                </el-form-item>
              </div>
            </header>
            <div class="content">
              <div class="add-1">
                <span class="title">收货地址：</span>
                <el-form-item prop="Regional">
                  <el-select v-model="newAdd.ExpressArea.RegionalID" @change='handleRegionalChange'>
                    <el-option
                      v-for="item in RegionalList"
                      :key="item.ID"
                      :label="item.Name"
                      :value="item.ID">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="City">
                  <el-select v-model="newAdd.ExpressArea.CityID"
                  :disabled="CityList.length === 0 || !newAdd.ExpressArea.RegionalID" @change='handleCityChange'>
                    <el-option
                      v-for="item in CityList"
                      :key="item.ID"
                      :label="item.Name"
                      :value="item.ID">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="County">
                  <el-select v-model="newAdd.ExpressArea.CountyID"
                    :disabled="CountyList.length === 0 || !newAdd.ExpressArea.CityID" @change='handleCountyChange'>
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
                <el-input v-model.trim="newAdd.AddressDetail" maxlength="60"
                   show-word-limit placeholder="详细地址 (不包含省市区)"></el-input>
                </el-form-item>
                <el-button
                  type="primary" class="map-location-btn"
                  :disabled='!newAdd.ExpressArea.CountyID'
                  @click="handleMapLocationClick"
                >地图定位</el-button>
              </div>
            </div>
          </el-form>
        </section>
      </li>
      <li class="map-wrap">
        <div class="map-content" v-show="newAdd.HavePosition || openType==='tempAdd'" v-loading="mapIsLoading">
          <el-amap-search-box
            class="search-box"
            ref="amapSearchBox"
            :search-option="searchOption"
            :on-search-result="onSearchResult"
            :on-error='onSearchResult'
          ></el-amap-search-box>
          <el-amap
            vid="amapDemo"
            :center="mapCenter"
            :plugin="plugin"
            :zoom="zoom"
            :events="events"
            ref="map"
            :style="{ width: '100%', height: '485px' }"
            class="amap-demo"
          >
            <el-amap-marker :position="mapCenter"></el-amap-marker>
          </el-amap>
          <!-- <button @click="onSelfSearch">1223213123</button> -->
        </div>
        <!-- <div class="map-loading"></div> -->
      </li>
      <li v-if="openType === 'tempAdd'">
        <span class="is-gray is-font-13">为了产品能够准确的送达，选择使用新地址时，请在地图上选择准确的收货地址地图坐标 !</span>
      </li>
    </ul>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit('ruleForm')">确定</el-button>
      <el-button v-if="openType !== 'tempAdd'" @click="handleBeforeDiaClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
/* eslint-disable object-curly-newline */
import Vue from 'vue';
import AMap from 'vue-amap';

Vue.use(AMap);
// 初始化vue-amap
AMap.initAMapApiLoader({
  // 高德key
  key: '09966c2b866f9783b49969af19102d91',
  // 插件集合 （插件按需引入）
  plugin: ['PlaceSearch'],
  // plugin: ['AMap.Geolocation', 'AMap.Autocomplete', 'PlaceSearch', 'ToolBar'],
});

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    openType: {
      type: String,
      default: 'new', // edit | new | tempAdd
    },
    curEditInfo: {
      type: Object,
      default: null,
    },
  },
  data() {
    const validateMobile = (rule, value, callback) => {
      if (this.validateCheck(value, this.defineRules.Mobile, callback)) callback();
    };
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
          { min: 1, max: 12, message: '姓名不能超过12个字', trigger: 'blur' },
        ],
        Mobile: [
          { validator: validateMobile, trigger: 'blur' },
        ],
        AddressDetail: [
          { required: true, message: '请填写详细地址(不包含省市区)', trigger: 'blur' },
          { min: 1, max: 60, message: '详细地址长度不能超过60个字符', trigger: 'blur' },
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
      searchOption: {
        // city: '河南',
        // citylimit: false,
      },
      canClose: true, // 是否可关闭地图窗口 下单添加新地址时可用
      mapCenter: [113.625351, 34.746303],
      events: {
        init: () => {
          if (this.openType === 'edit') {
            const { Latitude, Longitude } = this.curEditInfo;
            if (!Latitude || !Longitude) return;
            this.lng = Longitude;
            this.lat = Latitude;
            this.mapCenter = [Longitude, Latitude];
            this.setPositionIndex(+Longitude, +Latitude, false);
          }
        },
        click: e => {
          this.setPositionIndex(e.lnglat.lng, e.lnglat.lat);
        },
      },
      plugin: [
        {
          pName: 'PlaceSearch',
          events: {
            error: e => {
              // console.log(e, 'errpr map');
            },
          },
        },
      ],
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
        return '更改配送地址';
      }
      if (this.openType === 'add') {
        return '新增配送地址';
      }
      if (this.openType === 'tempAdd') {
        return '地图定位';
      }
      return '';
    },
    // _placeSearch() {
    //   return new AMap.PlaceSearch(this.searchOption || {});
    // },
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

      if (this.CityList.length === 0 || this.CityList[0].ParentID !== e) {
        const res = await this.api.getAddressIDList(e);
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

      if (this.CountyList.length === 0 || this.CountyList[0].ParentID !== e) {
        const res = await this.api.getAddressIDList(e);
        if (res.data.Status === 1000) {
          this.CountyList = res.data.Data;
        }
      }
    },
    handleCountyChange(e) {
      // // console.log(e);
      const _t = this.CountyList.find(it => it.ID === e);
      this.newAdd.ExpressArea.CountyName = _t.Name;
    },
    handleClose() {
      this.$emit('changeStatus', false);
    },
    // onSelfSearch() {
    //   // console.log(AMap, AMap.PlaceSearch, AMap.Amap.PlaceSearch);
    //   // const placeSearch = new AMap.PlaceSearch({
    //   //   // city 指定搜索所在城市，支持传入格式有：城市名、citycode和adcode
    //   //   city: '010',
    //   // });
    // },
    async handleSubmit(formName) {
      if (this.openType === 'new') {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            if (!this.newAdd.HavePosition) {
              this.messageBox.failSingleError({
                title: '尚未设置地图定位',
                msg: '请点击右侧 [ 地图定位 ] 按钮进行设置',
              });
              return;
            }
            // 新增地址
            const _obj = JSON.parse(JSON.stringify(this.newAdd));
            const res = await this.api.getCustomerAddress(_obj);
            // // console.log(res);
            if (res.data.Status === 1000) {
              this.messageBox.successSingle({
                title: '地址添加成功',
                successFunc: () => {
                  this.newAdd.AddressID = res.data.Data;
                  this.$store.commit('common/handleAddOrEditAddressOnStore', [this.newAdd, 'add']);
                  this.handleBeforeDiaClose();
                },
              });
            }
          }
        });
      } else if (this.openType === 'tempAdd') {
        this.$emit('changeProps', this.newAdd);
        this.canClose = true;
        this.$message({
          message: '已定位',
          type: 'success',
        });
        this.handleBeforeDiaClose(true);
      } else {
        // 编辑地址
        const _obj = JSON.parse(JSON.stringify(this.newAdd));
        const res = await this.api.getCustomerAddress(_obj);
        // // console.log(res);
        if (res.data.Status === 1000) {
          this.messageBox.successSingle({
            title: '地址修改成功',
            successFunc: () => {
              // // console.log('successFunc');
              this.$store.commit('common/handleAddOrEditAddressOnStore', [this.newAdd, 'edit']);
              this.handleBeforeDiaClose();
            },
          });
        }
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
      // // console.log(this.newAdd.Longitude, _lat);
    },
    onSearchResult(pois) {
      // console.log(pois, 'onSearchResult');
      this.mapIsLoading = false;
      if (pois.length > 0) {
        const { lng, lat } = pois[0];
        this.setPositionIndex(lng, lat);
      }
    },
    handleMapLocationClick() {
      const { AddressDetail, ExpressArea } = this.newAdd;
      const { RegionalName, CityName, CountyName } = ExpressArea;
      const _str = `${RegionalName}${CityName}${CountyName}${AddressDetail}`;
      // console.log(_str);
      if (_str === this.lastSearchWords) return;
      this.newAdd.HavePosition = true;
      setTimeout(() => {
        this.$refs.amapSearchBox.keyword = _str;
        // // console.log(this.$refs.amapSearchBox.search);
        try {
          this.$refs.amapSearchBox.search();
        } catch (e) {
          // console.log(e);
        }
        this.mapIsLoading = true;
        this.lastSearchWords = _str;
      }, 30);
    },
    async handleDialogOpen() {
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
        // // console.log(this.newAdd.Latitude, Latitude, this.newAdd.Longitude, Longitude);
        const { RegionalName, RegionalID, CityName, CityID, CountyName, CountyID } = ExpressArea;
        this.newAdd.ExpressArea.RegionalName = RegionalName;
        this.newAdd.ExpressArea.RegionalID = RegionalID;
        this.newAdd.ExpressArea.CityName = CityName;
        this.newAdd.ExpressArea.CityID = CityID;
        this.newAdd.ExpressArea.CountyName = CountyName;
        this.newAdd.ExpressArea.CountyID = CountyID;
        // // console.log(AMap);
        if (ExpressArea) {
          const res = await Promise.all([
            this.api.getAddressIDList(-1),
            this.api.getAddressIDList(RegionalID),
            this.api.getAddressIDList(CityID),
          ]);
          const _list = res.map(it => {
            if (it.data.Status === 1000) {
              return it.data.Data;
            }
            return [];
          });
          this.RegionalList = [..._list[0]];
          this.CityList = [..._list[1]];
          this.CountyList = [..._list[2]];
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
        // // console.log(this.newAdd.Latitude, Latitude, this.newAdd.Longitude, Longitude);
        const { RegionalName, RegionalID, CityName, CityID, CountyName, CountyID } = ExpressArea;
        this.newAdd.ExpressArea.RegionalName = RegionalName;
        this.newAdd.ExpressArea.RegionalID = RegionalID;
        this.newAdd.ExpressArea.CityName = CityName;
        this.newAdd.ExpressArea.CityID = CityID;
        this.newAdd.ExpressArea.CountyName = CountyName;
        this.newAdd.ExpressArea.CountyID = CountyID;
        this.handleMapLocationClick();
        this.canClose = false;
      } else {
        if (this.RegionalList.length > 0) return;
        const res = await this.api.getAddressIDList(-1);
        if (res.data.Status === 1000) {
          this.RegionalList = res.data.Data;
        }
      }
    },
    handleBeforeDiaClose() {
      if (this.openType === 'tempAdd' && !this.canClose) {
        this.$message.error('请在地图中保存收货地址定位!');
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
    // mapInit() {
    //   AMap.initAMapApiLoader({
    //     // 高德key
    //     key: '09966c2b866f9783b49969af19102d91',
    //     // 插件集合 （插件按需引入）
    //     plugin: ['PlaceSearch'],
    //     // plugin: ['AMap.Geolocation', 'AMap.Autocomplete', 'PlaceSearch', 'ToolBar'],
    //   });
    // },
  },
  watch: {
    visible(newVal) {
      if (newVal) this.handleDialogOpen();
    },
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
    .el-dialog__body {
      padding-left: 22px;
      padding-right: 22px;
      padding-top: 25px;
      padding-bottom: 10px;
      // height: 635px;
      min-height: 188px;
      > .change-add-dia-content {
        height: 655px;
        &.tempAdd {
          height: 538px;
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
                              font-size: 14px;
                              line-height: 26px\0;
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
                        &.is-error {
                          > .el-form-item__content {
                            // height: 50px;
                            // margin-bottom: 14px;
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
                          height: 35px;
                          > .el-select {
                            > .el-input {
                              width: 100px;
                              > input {
                                height: 30px;
                                font-size: 13px;
                                padding-left: 12px;
                                line-height: 26px\0;
                                padding-right: 22px;
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
                              line-height: 26px\0;
                              font-size: 14px;
                              padding-left: 12px;
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
</style>
