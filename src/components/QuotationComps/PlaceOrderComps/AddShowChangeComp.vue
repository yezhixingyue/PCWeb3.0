<template>
  <section class="mp-pc-place-order-address-show-and-change-wrap" v-if="customerInfo">
    <header class="bg-gray"></header>
    <div class="comp-title float">
      <span class="left is-bold">收货信息</span>
    </div>
    <div class="content" v-loading='loadingAddValid'>
      <ul>
        <li>
          <div class="platform-code-box">
            <span class="title">平台单号：</span>
            <el-input
              v-model.trim="outPlaceCode"
              maxlength="22"
              :class="isPlatformCodeError ? 'error': ''"
              show-word-limit
              placeholder="电商(淘宝、京东、拼多多)平台单号"
              @focus="onPlatformCodeInpFocus"
              @blur="onPlatformCodeInpBlur">
            </el-input>
            <div v-show="isPlatformCodeError" class="is-pink is-font-12">{{PlatformCodeErrorMsg}}</div>
          </div>
          <div  class="express-box">
            <span class="title">配送：</span>
            <el-radio-group v-model="Express.First" @change='onRadioChange'>
              <el-radio :label="1" :disabled='radioDisabled.f' style="margin-right: 24px">
                <span :class="radioDisabled.f?'is-cancel':''">名片之家</span>
              </el-radio>
              <el-radio :label="3" :disabled='radioDisabled.s' style="margin-right: 24px">
                <el-select v-model="secondExValFor3" @visible-change='onVisibleChangeFor3' :disabled='radioDisabled.s'>
                  <el-option
                    v-for="item in secondExpressList"
                    :key="item.ID"
                    :label="item.Name"
                    :value="item.ID">
                  </el-option>
                </el-select>
              </el-radio>
              <el-radio :label="2" :disabled='radioDisabled.t'>
                <el-select v-model="thirdExValFor2" @visible-change='onVisibleChangeFor2' :disabled='radioDisabled.t'>
                  <el-option
                    v-for="item in thirdExpressList"
                    :key="item.ID"
                    :label="item.Name"
                    :value="item.ID">
                  </el-option>
                </el-select>
              </el-radio>
            </el-radio-group>
          </div>
        </li>
        <li class="consignee-wrap" v-if="customerInfo.Address.length > 0 || newAdd.isSaved">
          <div class="consignee-box">
            <span class="title">收货人：</span>
            <span class="consignee">{{currentAddInfo.Consignee}}</span>
            <span>{{currentAddInfo.Mobile}}</span>
          </div>
          <div class="address">
            <span class="title">收货地址：</span>
            <span class="title-content">
              <i>{{currentAddInfo.address}}</i>
              <span class="right span-title-blue" @click="handleChangeAdd">{{ addCompTitle }}</span>
            </span>
          </div>
        </li>
        <li v-else class="has-none-consignee">
          <span class="is-pink">尚未设置收货地址， </span>
          <span class="right span-title-blue" @click="handleChangeAdd"> 点击此处{{ addCompTitle }}</span>
          <span class="is-primary">
             ， 或前往
            <router-link to="/mySetting/address" tag="i" class="span-title-blue">个人设置 - 收货地址</router-link>
             设置常用收货地址 (<i class="is-gray">推荐</i>)
          </span>
        </li>
        <!-- <li class="add-title">
          <span class="right span-title-blue" @click="handleChangeAdd">{{ addCompTitle }}</span>
        </li> -->
      </ul>
    </div>
    <el-dialog :visible.sync="outerVisible" top='20vh'
      v-dialogDrag custom-class="set-craft-dia" :before-close='handleBeforeClose'>
       <header slot="title">
        <i class="iconfont icon-shezhi is-primary-blue"></i>
        <span>{{ addCompTitle }}</span>
      </header>

      <ul class="change-add-dia-content">
        <li>
          <section v-if="customerInfo">
            <el-radio v-model="addRadio" :label="i" v-for="(item, i) in customerInfo.Address" :key="item.AddressID">
              <span class="is-font-12 address">{{getAddressInfoDetail(item)}}</span>
              <span class="is-bold consig is-font-12">{{item.Consignee}}</span>
              <span class="is-bold is-font-12 radio-phone">({{item.Mobile}})</span>
              <span class="is-success mgleft" v-if="item.IsDefault">/ 默认地址</span>
            </el-radio>
            <el-radio v-model="addRadio" label="new" class="new-address-radio"  v-loading='loadingAddInfo'>
              <el-form :model="newAdd" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <div class="content">
                  <div class="add-1">
                    <span class="title">新地址：</span>
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
                    <el-input v-model.trim="newAdd.AddressDetail" maxlength="60" show-word-limit
                     @change="handleDetailChange" placeholder="详细地址 (不包含省市区)"></el-input>
                    </el-form-item>
                    <!-- <el-button type="primary" :disabled='!newAdd.AddressDetail || !newAdd.ExpressArea.CountyID'
                    >地图定位</el-button> -->
                  </div>
                </div>
                <header>
                  <div>
                    <span class="title">收货人：</span>
                    <el-form-item prop="Consignee">
                      <el-input v-model.trim="newAdd.Consignee" maxlength="12" placeholder="收货人姓名"></el-input>
                    </el-form-item>
                  </div>
                  <div>
                    <span class="title">手机号：</span>
                    <el-form-item prop="Mobile">
                      <el-input el-input v-model.trim="Mobile" maxlength="11" placeholder="手机号"></el-input>
                    </el-form-item>
                  </div>
                </header>
              </el-form>
            </el-radio>
          </section>
        </li>
      </ul>

      <!-- <el-dialog
        width="1000px"
        custom-class="set-craft-dia"
        :visible.sync="innerVisible"
        append-to-body>
      </el-dialog> -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit('ruleForm')">确定</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </div>
    </el-dialog>
    <AddMapComp openType='tempAdd' :curEditInfo='newAdd' v-if="showMap" ref="mapComp"
      @handleMapSearchError='handleMapSearchError'
      @changeProps='changeProps' @changeStatus='changeDiaStatus' :visible='diaVisible'/>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import AddMapComp from '@/components/MySettingComps/AddMapComp.vue';

export default {
  components: {
    AddMapComp,
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
      PlatformCode: '',
      radio: 1,
      secondExVal: 11, // kuaidi
      thirdExVal: 31, // wuliu
      Express: {
        First: 1,
        Second: 1,
      },
      outerVisible: false, // 修改地址
      diaVisible: false, // 地图定位
      callbackForLasted: null, // 最终加入购物车 或 下单时如果没有定位补充定位时的回调函数 -- 只在此处使用 其它地方不用
      showMap: true,
      newAdd: {
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
      recordAddInfo: null,
      recordRegionalList: null,
      recordCityList: null,
      recordCountyList: null,
      selectdAddress: '', //  new | 地址数组索引号
      RegionalList: [],
      CityList: [],
      CountyList: [],
      addRadio: '',
      ExpressValidList: [1, 2, 3], // 当前可用物流方式
      rules: {
        Consignee: [
          { required: true, message: '请输入收货人姓名', trigger: 'blur' },
        ],
        Mobile: [
          { validator: validateMobile, trigger: 'blur' },
        ],
        AddressDetail: [
          { required: true, message: '请填写详细地址(不包含省市区)', trigger: 'blur' },
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
      loadingAddInfo: false,
      loadingAddValid: false,
      isPlatformCodeError: false,
      PlatformCodeErrorMsg: '平台单号长度应为13 18 19或22位',
      initPlatformCodeValue: '',
      reg: /(^\d{13}$)|(^\d{18}$)|(^\d{19}$)|(^\d{6}-\d{15}$)/,
    };
  },
  computed: {
    ...mapState('common', ['ExpressList', 'customerInfo']),
    ...mapState('Quotation', ['curProductID']),
    secondExpressList() {
      if (this.ExpressList.length === 0) return [];
      return this.ExpressList.find(it => it.Type === 3).List;
    },
    thirdExpressList() {
      if (this.ExpressList.length === 0) return [];
      return this.ExpressList.find(it => it.Type === 2).List;
    },
    currentAddInfo() {
      if (!this.customerInfo) return '';
      let _t;
      // if (this.selectdAddress === 'default') _t = this.customerInfo.Address.find(it => it.IsDefault);
      // else if (this.selectdAddress === 'new') _t = this.newAdd;

      if (this.selectdAddress === 'new') _t = this.newAdd;
      else _t = this.customerInfo.Address.find((it, i) => i === this.selectdAddress);
      // // console.log(this.selectdAddress, _t);
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
    outPlaceCode: {
      get() {
        return this.PlatformCode;
      },
      set(newVal) {
        this.PlatformCode = newVal.replace(/[^0-9-]/g, '').replace(/^-/, '');
        if ([0, 13, 18, 19, 22].indexOf(this.PlatformCode.length) === -1) {
          if (!this.PlatformCodeErrorMsg) this.PlatformCodeErrorMsg = '平台单号长度应为13 18 19或22位';
          this.isPlatformCodeError = true;
        } else if (this.reg.test(this.PlatformCode) || this.PlatformCode.length === 0) {
          this.PlatformCodeErrorMsg = '';
          this.isPlatformCodeError = false;
        } else this.PlatformCodeErrorMsg = '平台单号格式不正确';
        this.setInfo4ReqObj();
      },
    },
    Mobile: {
      get() {
        return this.newAdd.Mobile;
      },
      set(newVal) {
        this.newAdd.Mobile = newVal.replace(/[^\d.]/g, '');
      },
    },
    radioDisabled() {
      return {
        f: !this.ExpressValidList.includes(1), // 名片之家
        s: !this.ExpressValidList.includes(3), // 快递
        t: !this.ExpressValidList.includes(2), // 物流
      };
    },
    addCompTitle() {
      if (!this.customerInfo) return '';
      if (this.customerInfo.Address.length === 0 && !this.newAdd.isSaved) return '添加临时配送地址';
      return '更改配送地址';
    },
  },
  methods: {
    onVisibleChangeFor2(bool) {
      if (!bool || this.radioDisabled.t) return;
      if (this.Express.First === 2 && this.Express.Second === this.thirdExVal) return;
      this.Express.First = 2;
      this.Express.Second = this.thirdExVal;
      this.setInfo4ReqObj();
    },
    onVisibleChangeFor3(bool) {
      if (!bool || this.radioDisabled.s) return;
      if (this.Express.First === 3 && this.Express.Second === this.secondExVal) return;
      this.Express.First = 3;
      this.Express.Second = this.secondExVal;
      this.setInfo4ReqObj();
    },
    changeDiaStatus(bool) {
      this.diaVisible = bool;
    },
    handleMapSearchError() {
      this.changeDiaStatus(false);
      this.outerVisible = true;
    },
    onRadioChange(num) {
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
    async changeProps({ Latitude, Longitude }) {
      this.newAdd.Latitude = Latitude;
      this.newAdd.Longitude = Longitude;
      this.newAdd.HavePosition = true;
      this.setInfo4ReqObj();
      // const res = this.setInfo4ReqObj();
      // if (this.callbackForLasted && res) {
      //   this.callbackForLasted();
      //   this.callbackForLasted = null;
      // }
      this.loadingAddValid = true;
      const resp = await this.api.getExpressValidList(this.newAdd);
      this.loadingAddValid = false;
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
    setInfo4ReqObj() {
      const _temp = {};
      _temp.Address = {};
      _temp.Address.Express = this.Express;
      const { AddressID } = this.currentAddInfo;
      if (AddressID) _temp.Address.AddressID = AddressID;
      _temp.Address.Address = this.currentAddInfo;
      const OutPlate = { First: 1, Second: this.PlatformCode };
      _temp.OutPlate = OutPlate;
      // // console.log('_temp', _temp.Address.Express.First, _temp.Address.Express.Second);
      this.$store.commit('Quotation/setAddressInfo4PlaceOrder', JSON.parse(JSON.stringify(_temp)));
      return true;
    },
    async handleChangeAdd() {
      this.addRadio = this.selectdAddress;
      this.outerVisible = true;
      this.recordAddInfo = JSON.stringify(this.newAdd);
      this.recordRegionalList = JSON.stringify(this.RegionalList);
      this.recordCityList = JSON.stringify(this.CityList);
      this.recordCountyList = JSON.stringify(this.CountyList);

      if (this.RegionalList.length > 0) return;
      this.loadingAddInfo = true;
      const res = await this.api.getAddressIDList(-1);
      this.loadingAddInfo = false;
      if (res.data.Status === 1000) {
        this.RegionalList = res.data.Data;
      }
      // this.$store.dispatch('common/getAddressIDList', -1);
    },
    async handleRegionalChange(e) {
      const _t = this.RegionalList.find(it => it.ID === e);
      this.newAdd.ExpressArea.RegionalName = _t.Name;
      this.newAdd.ExpressArea.CityID = '';
      this.newAdd.ExpressArea.CityName = '';
      this.newAdd.ExpressArea.CountyID = '';
      this.newAdd.ExpressArea.CountyName = '';
      this.CityList = [];
      this.CountyList = [];
      this.newAdd.HavePosition = false;

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
      this.newAdd.HavePosition = false;

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
      // // console.log(e);
      this.newAdd.HavePosition = false;
      const _t = this.CountyList.find(it => it.ID === e);
      this.newAdd.ExpressArea.CountyName = _t.Name;
    },
    handleDetailChange() {
      this.newAdd.HavePosition = false;
    },
    handleSubmit(formName) {
      if (this.addRadio === 'new') {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.newAdd.isSaved = true;
            this.selectdAddress = this.addRadio;
            this.outerVisible = false;
            this.changeDiaStatus(true);
            // this.$refs.ruleForm.resetFields();
            // this.handleSetPositionOnMap();
          }
        });
      } else {
        this.selectdAddress = this.addRadio;
        this.outerVisible = false;
        this.$refs.ruleForm.resetFields();
      }
    },
    handleBeforeClose(done) {
      this.newAdd = JSON.parse(this.recordAddInfo);
      this.RegionalList = JSON.parse(this.recordRegionalList);
      this.CityList = JSON.parse(this.recordCityList);
      this.CountyList = JSON.parse(this.recordCountyList);
      this.setInfo4ReqObj();
      this.$refs.ruleForm.resetFields();
      done();
    },
    handleSetPositionOnMap(callback) { // 方法作废
      // // console.log(this.newAdd.HavePosition);
      if (this.addRadio === 'new') {
        this.changeDiaStatus(true);
        if (callback) this.callbackForLasted = callback;
      } else if (callback) callback();
    },
    handleCancel() {
      this.newAdd = JSON.parse(this.recordAddInfo);
      this.RegionalList = JSON.parse(this.recordRegionalList);
      this.CityList = JSON.parse(this.recordCityList);
      this.CountyList = JSON.parse(this.recordCountyList);
      this.setInfo4ReqObj();
      this.$refs.ruleForm.resetFields();
      this.outerVisible = false;
    },
    getAddressInfoDetail(item) {
      if (!item) return '';
      const { ExpressArea, AddressDetail } = item;
      const { RegionalName, CountyName, CityName } = ExpressArea;
      const address = `${RegionalName}${CityName}${CountyName}${AddressDetail}`;
      return address;
    },
    onPlatformCodeInpFocus() {
      this.initPlatformCodeValue = this.outPlaceCode;
    },
    onPlatformCodeInpBlur() {
      if (this.initPlatformCodeValue === this.outPlaceCode || !this.outPlaceCode || this.PlatformCodeErrorMsg) return;
      // 此处修改配送方式 --- 仅在当前配送方式为名片之家的时候
      if (this.Express.First === 1) {
        this.onRadioChange(3);
      }
    },
  },
  watch: {
    currentAddInfo() {
      this.setInfo4ReqObj();
    },
    newAdd: {
      handler() {
        if (this.addRadio !== 'new') this.addRadio = 'new';
      },
      deep: true,
    },
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
    async selectdAddress(newVal) {
      if (newVal === 'new') return;
      const _t = this.customerInfo.Address.find((it, i) => i === this.selectdAddress);
      if (!_t) return;
      this.$store.commit('common/changeSelectedAdd', _t);
      this.loadingAddValid = true;
      const res = await this.api.getExpressValidList(_t);
      this.loadingAddValid = false;
      if (res.data.Status === 1000) {
        this.ExpressValidList = res.data.Data;
      }
    },
    curProductID() {
      this.initPlatformCodeValue = '';
      this.outPlaceCode = '';
    },
  },
  async mounted() {
    this.$store.dispatch('common/getExpressList');
    await this.$store.dispatch('common/getCustomerDetail');
    const _i = this.customerInfo.Address.findIndex(it => it.isSelected);
    if (_i > -1) this.selectdAddress = _i;
    else if (this.customerInfo.Address.length > 0) this.selectdAddress = 0;
    else this.selectdAddress = 'new';
    // // console.log(this.addressInfo4PlaceOrder);
    // if (this.addressInfo4PlaceOrder) {
    //   // console.log('this.addressInfo4PlaceOrder is not null');
    // }
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
      margin-bottom: 28px;
      position: relative;
      > li {
        > div {
          display: inline-block;
          &.platform-code-box {
            position: relative;
            > .el-input {
              width: 252px;
              > input {
                height: 30px;
                line-height: 28px;
                padding-left: 8px;
                font-size: 13px;
                &::placeholder {
                  font-size: 12px;
                }
              }
              &.error {
                > input {
                  border-color: #ff3769;
                }
              }
            }
            > div.is-pink {
              position: absolute;
              left: 80px;
              top: 33px;
            }
            margin-right: 40px;
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
          margin-top: 22px;
          overflow: hidden;
          white-space: nowrap;
          > .consignee-box {
            width: 317px;
            margin-right: 52px;
            vertical-align: top;
            > .consignee {
              margin-right: 30px;
            }
          }
          > .address {
            width: 400px;
            > span {
              &.title {
                float: left;
              }
              &.title-content {
                overflow: hidden;
                // width: 312px;
                display: inline-block;
                white-space: normal;
                line-height: 18px;
                margin-top: -1px;
                font-size: 13px;
                > span {
                  margin-left: -6px;
                  white-space: nowrap;
                }
                > i {
                  margin-right: 12px;
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
            >.el-radio {
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
}
</style>
