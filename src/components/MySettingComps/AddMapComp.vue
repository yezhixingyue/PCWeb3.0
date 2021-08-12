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
            <div class="content" v-loading='loadingAddInfo'>
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
                  :disabled="CityList.length === 0" @change='handleCityChange'>
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
                    :disabled="CountyList.length === 0" @change='handleCountyChange'>
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
        <div class="map-content" id="map-container"
         v-show="newAdd.HavePosition || openType==='tempAdd'" v-loading="mapIsLoading">
        </div>
      </li>
      <li v-if="openType === 'tempAdd'">
        <span class="is-gray is-font-13">使用新增地址时，需要在地图上定位准确的地址坐标 !</span>
      </li>
    </ul>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit('ruleForm')">确定</el-button>
      <el-button v-if="openType !== 'tempAdd'" @click="handleBeforeDiaClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
/* eslint-disable consistent-return */
/* eslint-disable no-undef */
/* eslint-disable object-curly-newline */

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
        ],
        Mobile: [
          { validator: validateMobile, trigger: 'blur' },
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
    },
    handleClose() {
      this.$emit('changeStatus', false);
    },
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
        // if (!this.newAdd.HavePosition) {
        //   this.messageBox.failSingleError({
        //     title: '定位不成功',
        //     msg: '请重新定位',
        //   });
        //   return;
        // }
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
    },
    handleMapClick(e) {
      this.setPositionIndex(e.lnglat.lng, e.lnglat.lat);
    },
    onSearchResult(pois) {
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
          if (typeof result === 'string') {
            this.messageBox.failSingleError({
              title: '定位失败',
              msg: result,
              successFunc: () => {
                this.$emit('handleMapSearchError');
              },
            });
          } else {
            this.messageBox.failSingleError({
              title: '定位失败',
              msg: '搜索不到地址，请尝试修改搜索关键词!',
              successFunc: () => {
                this.$emit('handleMapSearchError');
              },
            });
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
      this.$nextTick(() => {
        this.map = new AMap.Map('map-container', {
          center: [this.lng, this.lat],
          resizeEnable: true,
          zoom: 14,
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
        if (Latitude && Longitude) {
          this.lng = Longitude;
          this.lat = Latitude;
          this.mapCenter = [Longitude, Latitude];
          this.setPositionIndex(+Longitude, +Latitude, false);
        }
        if (ExpressArea) {
          this.loadingAddInfo = true;
          const res = await Promise.all([
            this.api.getAddressIDList(-1),
            this.api.getAddressIDList(RegionalID),
            this.api.getAddressIDList(CityID),
          ]);
          this.loadingAddInfo = false;
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
      if (this.openType === 'tempAdd' && !this.canClose) {
        this.messageBox.failSingleError({
          title: '新增地址需要定位',
          msg: '请在地图中保存收货地址定位!',
        });
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
  mounted() {
    // 09966c2b866f9783b49969af19102d91 geren
    // eslint-disable-next-line max-len
    const url = 'https://webapi.amap.com/maps?v=1.4.15&key=d1de441473f06000bd61463102442b1e&plugin=AMap.PlaceSearch&callback=initMap';

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
                            > .el-input {
                              width: 100px;
                              > input {
                                height: 30px;
                                font-size: 13px;
                                padding-left: 12px;
                                padding-right: 22px;
                                line-height: 26px\0;
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
    #map-container {
      width: 956px;
      height: 485px;
    }
}
</style>
