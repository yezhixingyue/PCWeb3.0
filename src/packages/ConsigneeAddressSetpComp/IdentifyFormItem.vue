<template>
  <el-form
    v-if="type !== 'out'"
    :model="IdentifyForm"
    :rules="rules"
    ref="oIdentifyForm"
    label-width="86px"
    @submit.native.prevent
    class="mp-place-order-address-set-comp-identify-ruleForm-containner"
  >
    <el-form-item label="识别内容：" prop="Value" size="small">
      <el-input
        size="small"
        ref="oInInp"
        @keyup.enter.native="submitForm"
        v-model="IdentifyForm.Value"
        :disabled='OutPlateNoLoading || disabled'
        clearable
        placeholder="请输入淘宝/京东/拼多多平台单号，或者详细地址。然后点击“自动识别”按钮"
      ></el-input>
    </el-form-item>
    <el-form-item size="mini">
      <el-button
        size="mini"
        type="primary"
        @click="submitForm('oIdentifyForm')"
        :disabled="
          OutPlateNoLoading ||
          !IdentifyForm.Value ||
          OutPlateNo === IdentifyForm.Value ||
          disabled
        "
      >
        <template v-if="!OutPlateNoLoading && !(OutPlateNo && OutPlateNo === IdentifyForm.Value)">自动识别</template>
        <template v-else-if="OutPlateNoLoading">识别中</template>
        <template v-else-if="OutPlateNo && OutPlateNo === IdentifyForm.Value">已识别</template>
      </el-button>
    </el-form-item>
  </el-form>
  <div v-else>
    <el-input
      ref="oOutInp"
      :disabled='OutPlateNoLoading || disabled'
      @keyup.enter.native="submitForm"
      placeholder="输入平台单号或临时地址进行解析"
      v-model="IdentifyForm.Value"
    ></el-input>
    <el-button
      type="primary"
      size="mini"
      @click="submitForm"
      :disabled="
        OutPlateNoLoading ||
        (!IdentifyForm.Value && !OutPlateNo) ||
        OutPlateNo === IdentifyForm.Value ||
        disabled
      "
      >
      <template v-if="OutPlateNoLoading">
        <i class="el-icon-loading"></i>
      </template>
      <template v-else>解析</template>
    </el-button>
  </div>
</template>

<script>
import { projectType } from '../../assets/js/setup';

export default {
  props: {
    OutPlateNo: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      IdentifyForm: {
        Value: '',
      },
      rules: {
        Value: [{ validator: this.validateFunc, trigger: 'blur' }],
      },
      reg: /(^\d{18}$)|(^\d{19}$)|(^\d{6}-\d{15}$)/,
      isSubmit: false,
      OutPlateNoLoading: false,
      geocoder: null,
      RegionalList: [],
    };
  },
  methods: {
    validateFunc(rule, value, callback) {
      const handleCallback = (msg) => {
        if (msg) callback(new Error(msg));
        else callback();
        if (this.isSubmit) this.isSubmit = false;
      };
      if (this.isSubmit) {
        if (value) {
          handleCallback('有内容未识别，请先识别或清除');
          return;
        }
      }
      if (value && this.OutPlateNo && value !== this.OutPlateNo) {
        // if (!this.reg.test(value.trim())) {
        //   callback(new Error('已有平台单号，此时不允许输入详细地址进行识别'));
        //   return;
        // }
      }
      handleCallback();
    },
    async formCheckerOnOut(bool = true) {
      this.isSubmit = bool;
      const res = await this.$refs.oIdentifyForm.validate().catch(() => {});
      return !!res;
    },
    async submitForm() {
      // 提交识别
      // eslint-disable-next-line no-undef
      if (AMap && !this.geocoder) this.geocoder = new AMap.Geocoder();
      if (this.type !== 'out') {
        const bool = await this.formCheckerOnOut(false);
        if (!bool) return;
      }
      const content = this.IdentifyForm.Value.trim();
      if (!content) {
        if (this.OutPlateNo && this.type === 'out') {
          // 清除已设置的平台单号及相关地址信息
        }
        return;
      }
      const isPlatformCode = this.reg.test(content);
      if (isPlatformCode) {
        // 处理平台单号
        this.PlatformCodeHandler(content);
      } else {
        // 处理详细地址
        this.DetailedAddressHandler(this.IdentifyForm.Value);
      }
    },
    async PlatformCodeHandler(OutPlateNo) { // 平台单号解析
      // 平台单号处理
      this.OutPlateNoLoading = true;
      const resp = await this.api
        .getAnalysisOutPlateNo(OutPlateNo)
        .catch(() => {});
      this.OutPlateNoLoading = false;
      if (resp && resp.data.Status === 1000) {
        // 获取成功;
        const data = resp.data.Data;
        this.IdentifyForm.Value = '';
        this.$emit('OutPlateNoResolved', { data, OutPlateNo, type: this.type }); // 通过type区分是弹窗提交还是外部提交
      }
    },
    handleStrWithoutMobile(content, hasPhone = false, isPhoneBegin = false) {
      // 已排除掉手机号的单字符串，其可能包含详细地址或收件人信息
      const temp = { address: '', Consignee: '' };
      if (Array.isArray(content)) {
        const [item1, item2] = content;
        temp.address = item1.length >= item2.length ? item1 : item2;
        temp.Consignee = item1.length >= item2.length ? item2 : item1;
        return temp;
      }
      const restArr = content.split(' ').map((it) => it.trim()).filter((it) => it);
      if (restArr.length === 1) {
        // 手机号在边上
        const [item] = restArr;
        temp.address = item;
        return temp;
      }
      if (hasPhone) {
        if (isPhoneBegin) {
          const [item, ...arr] = restArr;
          temp.Consignee = item;
          temp.address = arr.join(' ');
          return temp;
        }
        temp.Consignee = restArr[restArr.length - 1];
        temp.address = restArr.slice(0, -1).join(' ');
        return temp;
      }

      if (restArr.length === 2) {
        const [item1, item2] = restArr;
        temp.address = item1.length >= item2.length ? item1 : item2;
        temp.Consignee = item1.length >= item2.length ? item2 : item1;
        return temp;
      }
      const [item] = restArr;
      temp.Consignee = item;
      temp.address = restArr.slice(1).join(' ');
      return temp;
    },
    handleDetailAddressStrSplit(str) {
      // 转换输入的详细地址为地址 收件人 手机号码
      const _str = str
        .split(' ')
        .map((it) => it.replace(/[\w\W]+[:：]/, ''))
        .filter((it) => it)
        .join(' ');
      const mobileRegxp = /1[3456789]\d{9}/;
      const temp = {
        address: '',
        Mobile: '',
        Consignee: '',
      };
      if (mobileRegxp.test(_str)) {
        // 匹配到手机号
        const restArr = _str
          .split(mobileRegxp)
          .map((it) => it.trim())
          .filter((it) => it);
        let isPhoneBegin = false;
        if (_str.match(mobileRegxp).length > 0) {
          // 获取手机号
          const [Mobile] = _str.match(mobileRegxp);
          isPhoneBegin = _str.match(mobileRegxp).index === 0;
          if (Mobile) temp.Mobile = Mobile;
        }
        if (restArr.length === 0) {
          // 只有手机号
          return temp;
        }
        const { address, Consignee } = this.handleStrWithoutMobile(
          restArr.length === 1 ? restArr[0] : restArr,
          true,
          isPhoneBegin,
        );
        temp.address = address;
        temp.Consignee = Consignee;
        return temp;
      }
      // 未匹配到手机号
      const { address, Consignee } = this.handleStrWithoutMobile(_str);
      temp.address = address;
      temp.Consignee = Consignee;
      return temp;
    },
    EmitAddressDetailResolved(data) {
      if (this.type !== 'out') {
        this.$emit('DetailedAddress', data);
        this.IdentifyForm.Value = '';
      }
    },
    async handleMapSearchedSuccess(result, address, Consignee, Mobile) {
      const ExpressArea = {
        RegionalID: '',
        RegionalName: '',
        CityID: '',
        CityName: '',
        CountyID: '',
        CountyName: '',
      };
      let CityList = [];
      let CountyList = [];
      const { pname, cityname, adname } = result;
      const province = pname;
      const city = cityname;
      const district = adname;
      const AddressDetail = address
        .replace(province, '')
        .replace(city, '')
        .replace(district, '')
        .trim();
      let fetchRegionalOK = true;
      if (this.RegionalList.length === 0) {
        const resp = await this.api.getAddressIDList(-1).catch(() => null); // RegionalList
        if (resp && resp.data.Status === 1000) {
          this.RegionalList = resp.data.Data;
        } else {
          fetchRegionalOK = false;
        }
      }
      if (!fetchRegionalOK) return;
      const t = this.RegionalList.find((it) => it.Name === province);
      if (t) {
        ExpressArea.RegionalID = t.ID;
        ExpressArea.RegionalName = t.Name;
        const CityData = await this.api.getAddressIDList(t.ID).catch(() => null); // CountyList
        if (CityData && CityData.data.Status === 1000) {
          CityList = CityData.data.Data;
          if (city) {
            const targetCity = CityList.find((it) => it.Name === city);
            if (targetCity) {
              ExpressArea.CityID = targetCity.ID;
              ExpressArea.CityName = targetCity.Name;
              const CountyData = await this.api.getAddressIDList(targetCity.ID).catch(() => {}); // CountyList
              if (CountyData && CountyData.data.Status === 1000) {
                CountyList = CountyData.data.Data;
                if (CountyList.length > 0) {
                  if (targetCity.IsVirtual) {
                    ExpressArea.CountyID = CountyList[0].ID;
                    ExpressArea.CountyName = CountyList[0].Name;
                  } else if (district) {
                    const targetCounty = CountyList.find(
                      (it) => it.Name === district,
                    );
                    if (targetCounty) {
                      ExpressArea.CountyID = targetCounty.ID;
                      ExpressArea.CountyName = targetCounty.Name;
                    }
                  }
                }
              }
            }
          }
        }
      }
      const temp = {
        ExpressArea,
        Mobile,
        Consignee,
        AddressDetail,
        CityList,
        CountyList,
        RegionalList: this.RegionalList,
      };
      this.EmitAddressDetailResolved(temp);
    },
    async DetailedAddressHandler(str) { //
      // 详细地址解析
      // 详细地址处理
      const { address, Mobile, Consignee } = this.handleDetailAddressStrSplit(str); // { Consignee, Mobile, address }
      if (address) {
        const result = await this.placeSearchByAMap(address).catch(() => null);
        if (result) {
          this.handleMapSearchedSuccess(result, address, Consignee, Mobile);
        }
      } else {
        const temp = {
          ExpressArea: {
            RegionalID: '',
            CityID: '',
            CountyID: '',
          },
          Mobile,
          Consignee,
          AddressDetail: '',
          CityList: [],
          CountyList: [],
          RegionalList: [],
        };
        this.EmitAddressDetailResolved(temp);
      }
    },
    resetForm() {
      if (this.$refs.oIdentifyForm) this.$refs.oIdentifyForm.resetFields();
    },
    setValueOnOut(val) {
      this.IdentifyForm.Value = val;
    },
    handleErrorFunc() {
      if (this.type === 'out') {
        if (this.$refs.oOutInp) this.$refs.oOutInp.select();
      } else if (this.$refs.oInInp) this.$refs.oInInp.select();
    },
    async getRegionalList() { // 获取省级列表
      if (this.RegionalList.length > 0) return;
      const res = await this.api.getAddressIDList(-1);
      if (res.data.Status === 1000) {
        this.RegionalList = res.data.Data;
      }
    },
    placeSearchByAMap(keywords) { // 使用高德地图解析关键字
      return new Promise((resolve) => {
        if (!this.placeSearch && window.AMap) {
          this.placeSearch = new window.AMap.PlaceSearch({
            extensions: 'all',
          });
        }
        if (this.placeSearch) {
          this.placeSearch.search(keywords, (status, result) => {
            if (
              status === 'complete'
              && result
              && result.info === 'OK'
              && result.poiList
              && result.poiList.count > 0
              && result.poiList.pois.length > 0
            ) {
              const [target] = result.poiList.pois;
              resolve(target);
            } else {
              if (projectType === 'pc') {
                this.messageBox.failSingleError({
                  title: '解析失败',
                  msg: '未匹配到准确的省市区（县）,请重新输入（ 手机号码放至收货人与收货地址中间有助于提高识别准确度 ）',
                  successFunc: this.handleErrorFunc,
                  failFunc: this.handleErrorFunc,
                });
              } else {
                this.messageBox.failSingleError('解析失败', '未匹配到准确的省市区（县）,请重新输入（ 手机号码放至收货人与收货地址中间有助于提高识别准确度 ）',
                  this.handleErrorFunc, this.handleErrorFunc);
              }
              resolve(null);
            }
          });
        } else {
          this.$message.warning('解析插件加载失败，请刷新重试');
          resolve(null);
        }
      });
    },
  },
};
</script>
<style lang='scss'>
.mp-place-order-address-set-comp-identify-ruleForm-containner {
  margin-top: 15px;
  .el-form-item {
    margin-bottom: 15px;
    .el-form-item__label {
      font-size: 14px;
      padding-right: 2px;
      color: #888;
    }
    .el-form-item__content {
      width: 772px;
      input {
        line-height: 28px;
        height: 30px;
        &::placeholder {
          letter-spacing: 0.5px;
          font-size: 13px;
        }
      }
      button {
        border-radius: 5px;
        padding: 7px 10px;
        width: 70px;
      }
    }
  }
}
</style>
