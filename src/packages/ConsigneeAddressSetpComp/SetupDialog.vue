<template>
  <el-dialog
    :visible.sync="localVisible"
    top="20vh"
    :close-on-click-modal="false"
    v-dialogDrag
    custom-class="set-craft-dia"
    @open='onOpen'
    @closed='onClosed'
  >
    <header slot="title">
      <i class="iconfont icon-shezhi is-primary-blue"></i>
      <span>{{ title }}</span>
    </header>

    <ul class="change-add-dia-content">
      <li>
        <section v-if="customerInfo">
          <el-radio
            v-for="(item, i) in customerInfo.Address"
            :key="item.AddressID"
            v-model="radio"
            :label="i"
            :disabled="!!localOutPlateNo"
          >
            <span class="is-font-12 address">
              {{getAddressInfoDetail(item)}}
            </span>
            <span class="is-bold consig is-font-12">{{ item.Consignee }}</span>
            <span class="is-bold is-font-12 radio-phone">({{ item.Mobile }})</span>
            <span class="is-success mgleft" v-if="item.IsDefault">/ 默认地址</span>
          </el-radio>
          <el-radio
            v-model="radio"
            label="new"
            class="new-address-radio"
            v-loading="AddressListIsLoading"
          >
            <el-form
              :model="localNewAddressInfo"
              @submit.native.prevent
              :rules="rules"
              ref="ruleForm"
              label-width="0px"
              class="demo-ruleForm"
              v-if="localNewAddressInfo"
            >
              <div class="content">
                <div class="add-1">
                  <span class="title">新地址：</span>
                  <el-form-item prop="Regional">
                    <el-select
                      v-model="localNewAddressInfo.ExpressArea.RegionalID"
                      @change="handleRegionalChange"
                      :disabled="!!localOutPlateNo"
                      size="mini"
                    >
                      <el-option
                        v-for="item in RegionalList"
                        :key="item.ID"
                        :label="item.Name"
                        :value="item.ID"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="City">
                    <el-select
                      v-model="localNewAddressInfo.ExpressArea.CityID"
                      :disabled="CityList.length === 0 || !!localOutPlateNo"
                      @change="handleCityChange"
                      size="mini"
                    >
                      <el-option
                        v-for="item in CityList"
                        :key="item.ID"
                        :label="item.Name"
                        :value="item.ID"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="County">
                    <el-select
                      v-model="localNewAddressInfo.ExpressArea.CountyID"
                      :disabled="CountyList.length === 0 || !!localOutPlateNo"
                      @change="handleCountyChange"
                      size="mini"
                    >
                      <el-option
                        v-for="item in CountyList"
                        :key="item.ID"
                        :label="item.Name"
                        :value="item.ID"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="add-2">
                  <el-form-item prop="AddressDetail">
                    <el-input
                      v-model.trim="localNewAddressInfo.AddressDetail"
                      maxlength="60"
                      show-word-limit
                      @change="handleDetailChange"
                      placeholder="详细地址 (不包含省市区)"
                      :disabled="!!localOutPlateNo"
                    ></el-input>
                  </el-form-item>
                </div>
              </div>
              <header>
                <div>
                  <span class="title">收货人：</span>
                  <el-form-item prop="Consignee">
                    <el-input
                      :disabled="!!localOutPlateNo"
                      v-model.trim="localNewAddressInfo.Consignee"
                      maxlength="12"
                      placeholder="收货人姓名"
                    ></el-input>
                  </el-form-item>
                </div>
                <div>
                  <span class="title">手机号：</span>
                  <el-form-item prop="Mobile">
                    <el-input
                      :disabled="!!localOutPlateNo"
                      v-model.trim="Mobile"
                      maxlength="11"
                      placeholder="手机号"
                    ></el-input>
                  </el-form-item>
                </div>
                <div class="OutPlateNo" @click.stop v-show="localOutPlateNo">
                  <span class="title">平台单号：</span>
                  <div>
                    {{ localOutPlateNo }}
                  </div>
                  <span
                    class="span-title-blue"
                    @click.stop.self="onOutPlateNoClearClick"
                    v-show="localOutPlateNo"
                    >清空</span
                  >
                </div>
              </header>
            </el-form>
          </el-radio>
          <!-- <IdentifyFormItem
            key="IdentifyFormItem-dialog"
            @OutPlateNoResolved="onOutPlateNoResolved"
            @DetailedAddress="onDetailedAddressChange"
            :OutPlateNo="OutPlateNo"
            :RegionalList="RegionalList"
            ref="oIdentifyFormItem"
          /> -->
        </section>
      </li>
    </ul>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit">确定</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    visible: {
      type: Boolean,
      default: false,
    },
    OutPlateNo: { // 平台单号
      type: String,
      default: '',
    },
    curAddIndex: {}, // 当前索引类型
    NewAddressInfo: { // 新地址信息
      type: Object,
      default: null,
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
    customerInfo: {
      type: Object,
      default: null,
    },
  },
  computed: {
    Mobile: {
      get() {
        return this.localNewAddressInfo.Mobile;
      },
      set(newVal) {
        this.localNewAddressInfo.Mobile = newVal.replace(/[^\d.]/g, '');
      },
    },
    localVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
  },
  data() {
    const mobileRegxp = /1[3456789]\d{9}/;
    const validateMobile = (rule, value, callback) => {
      if (this.OutPlateNo) callback();
      else {
        if (!value) {
          callback(new Error('请输入手机号'));
          return;
        }
        if (!mobileRegxp.test(value)) {
          callback(new Error('手机号码格式不正确'));
          return;
        }
        callback();
      }
    };
    const validateRegional = (rule, value, callback) => {
      if (!this.localNewAddressInfo.ExpressArea.RegionalID) callback(new Error('请选择省份'));
      else callback();
    };
    const validateCity = (rule, value, callback) => {
      if (!this.localNewAddressInfo.ExpressArea.CityID) callback(new Error('请选择城市'));
      else callback();
    };
    const validateCounty = (rule, value, callback) => {
      if (!this.localNewAddressInfo.ExpressArea.CountyID) callback(new Error('请选择地区'));
      else callback();
    };
    return {
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
      AddressListIsLoading: false,
      localNewAddressInfo: null,
      radio: '',
      localOutPlateNo: '',
      RegionalList: [],
      CityList: [],
      CountyList: [],
    };
  },
  methods: {
    handleDetailChange() {
      this.localNewAddressInfo.HavePosition = false;
    },
    async handleRegionalChange(e) { // 省切换
      const _t = this.RegionalList.find(it => it.ID === e);
      this.localNewAddressInfo.ExpressArea.RegionalName = _t.Name;
      this.localNewAddressInfo.ExpressArea.CityID = '';
      this.localNewAddressInfo.ExpressArea.CityName = '';
      this.localNewAddressInfo.ExpressArea.CountyID = '';
      this.localNewAddressInfo.ExpressArea.CountyName = '';
      this.CityList = [];
      this.CountyList = [];
      this.localNewAddressInfo.HavePosition = false;

      if (this.CityList.length === 0 || this.CityList[0].ParentID !== e) {
        this.AddressListIsLoading = true;
        const res = await this.api.getAddressIDList(e);
        this.AddressListIsLoading = false;
        if (res.data.Status === 1000) {
          this.CityList = res.data.Data;
        }
      }
    },
    async handleCityChange(e) { // 市切换
      const _t = this.CityList.find(it => it.ID === e);
      this.localNewAddressInfo.ExpressArea.CityName = _t.Name;
      this.localNewAddressInfo.ExpressArea.CountyID = '';
      this.localNewAddressInfo.ExpressArea.CountyName = '';
      this.CountyList = [];
      this.localNewAddressInfo.HavePosition = false;

      if (this.CountyList.length === 0 || this.CountyList[0].ParentID !== e) {
        this.AddressListIsLoading = true;
        const res = await this.api.getAddressIDList(e);
        this.AddressListIsLoading = false;
        if (res.data.Status === 1000) {
          this.CountyList = res.data.Data;
        }
      }
    },
    handleCountyChange(e) { // 区切换
      this.localNewAddressInfo.HavePosition = false;
      const _t = this.CountyList.find(it => it.ID === e);
      this.localNewAddressInfo.ExpressArea.CountyName = _t.Name;
    },
    handleSubmit() { // 弹窗保存
      if (this.radio === 'new') {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.localNewAddressInfo.isSaved = true;
            // this.selectdAddress = this.radio; // curAddIndex
            // this.outPlaceCode = this.OutPlateNo;
            // this.$emit('update:visible', false);
            // if (!this.OutPlateNo) this.diaVisible = true;
            // else if (this.Express.First === 1) {
            //   this.onRadioChange(3);
            // }
            this.$emit('submit', {
              NewAddressInfo: this.localNewAddressInfo,
              OutPlateNo: this.localOutPlateNo,
              curAddIndex: this.radio,
            });
          }
        });
      } else {
        // this.selectdAddress = this.radio;
        // this.$emit('update:visible', false);
        this.$refs.ruleForm.clearValidate();
        // this.outPlaceCode = '';
        this.$emit('submit', {
          NewAddressInfo: this.localNewAddressInfo,
          OutPlateNo: this.localOutPlateNo,
          curAddIndex: this.radio,
        });
      }
    },
    onClosed() {
      this.localNewAddressInfo = null;
      this.radio = '';
      this.localOutPlateNo = '';
      if (this.$refs.ruleForm) this.$refs.ruleForm.resetFields();
    },
    async getRegionalList() { // 获取省级列表
      if (this.RegionalList.length > 0) return;
      this.AddressListIsLoading = true;
      const res = await this.api.getAddressIDList(-1);
      this.AddressListIsLoading = false;
      if (res.data.Status === 1000) {
        this.RegionalList = res.data.Data;
      }
    },
    onOpen() { // 打开时初始化数据
      this.localOutPlateNo = this.OutPlateNo;
      this.localNewAddressInfo = JSON.parse(JSON.stringify(this.NewAddressInfo));
      this.$nextTick(() => {
        this.radio = this.curAddIndex;
      });
      if (this.PropRegionalList && this.PropCityList && this.PropCountyList) {
        this.RegionalList = this.PropRegionalList;
        this.CityList = this.PropCityList;
        this.CountyList = this.PropCountyList;
      }
      if (this.OutPlateNo && this.localNewAddressInfo && this.localNewAddressInfo.ExpressArea) {
        const {
          CityID, CityName, CountyID, CountyName, RegionalID, RegionalName,
        } = this.localNewAddressInfo.ExpressArea;
        if (
          (CityID && CityID >= 0) && CityName
           && (CountyID && CountyID >= 0) && CountyName
           && (RegionalID && RegionalID >= 0) && RegionalName
        ) {
          this.RegionalList = [{ ID: RegionalID, Name: RegionalName }];
          this.CityList = [{ ID: CityID, Name: CityName }];
          this.CountyList = [{ ID: CountyID, Name: CountyName }];
        }
      }
      this.getRegionalList();
    },
    handleCancel() {
      this.$emit('update:visible', false);
    },
    getAddressInfoDetail(item) {
      if (!item) return '';
      const { ExpressArea, AddressDetail } = item;
      const { RegionalName, CountyName, CityName } = ExpressArea;
      const address = `${RegionalName}${CityName}${CountyName}${AddressDetail}`;
      return address;
    },
    onOutPlateNoClearClick() {
      this.localOutPlateNo = '';
      this.localNewAddressInfo = {
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
      if (this.$refs.ruleForm) this.$refs.ruleForm.resetFields();
      this.RegionalList = [];
      this.CityList = [];
      this.CountyList = [];
      this.getRegionalList();
    },
  },
  watch: {
    localNewAddressInfo: {
      handler() {
        if (this.radio !== 'new') this.radio = 'new';
      },
      deep: true,
    },
  },
};
</script>
<style lang='scss'>
</style>
