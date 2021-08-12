<template>
  <section class="mp-pc-my-setting-account-page-wrap">
    <div class="basic-info">
      <span class="blue-v-line is-bold is-black">基本信息</span>
      <span class="is-font-12">（ 每月可修改 <i class="is-pink is-font-16">1</i> 次 ）</span>
      <div>
        <InputComp :disabled='!AllowEdit' v-model="AuthenInfo4Submit.CustomerName"  title='企业简称' required />
        <InputComp :disabled='!AllowEdit'
         v-model="AuthenInfo4Submit.AuthenInfo.CompanyName"  title='企业全称' placeholder='须与营业执照上的名称一致' />
      </div>
      <div class="second">
        <InputComp :disabled='!AllowEdit' v-model="TaxID"  title='纳税人识别号' placeholder='营业执照上的纳税人识别号' />
        <InputComp :disabled='!AllowEdit' v-model="QQ"  title='QQ' />
      </div>
      <div class="address-wrap">
        <div class="add-1" v-loading='loadingAddInfo'>
          <p class="title"><i class="is-pink">*</i> 经营地址：</p>
          <el-select :disabled='!AllowEdit'
            v-model="AuthenInfo4Submit.AuthenInfo.SellArea.RegionalID" @change='handleRegionalChange'>
            <el-option
              v-for="item in RegionalList"
              :key="item.ID"
              :label="item.Name"
              :value="item.ID">
            </el-option>
          </el-select>
          <el-select v-model="AuthenInfo4Submit.AuthenInfo.SellArea.CityID"
          :disabled="CityList.length === 0 || !AllowEdit" @change='handleCityChange'>
            <el-option
              v-for="item in CityList"
              :key="item.ID"
              :label="item.Name"
              :value="item.ID">
            </el-option>
          </el-select>
          <el-select v-model="AuthenInfo4Submit.AuthenInfo.SellArea.CountyID"
            :disabled="CountyList.length === 0 || !AllowEdit" @change='handleCountyChange'>
            <el-option
              v-for="item in CountyList"
              :key="item.ID"
              :label="item.Name"
              :value="item.ID">
            </el-option>
          </el-select>
        </div>
        <div class="add-2">
          <el-input :disabled='!AllowEdit'
            v-model.trim="AuthenInfo4Submit.AuthenInfo.DetailAddress" placeholder="在此输入详细地址"></el-input>
        </div>
      </div>
    </div>
    <div class="img-info">
      <p class="blue-v-line is-bold is-black">营业执照照片</p>
      <div class="img-box">
        <div class="pic is-font-18" :class="AuthenInfo4Submit.AuthenInfo.LicensePath?'':'show-bg'">
          <input type="file" class="upload" @change="onChange" accept='.png,.jpeg,.jpg,.bmp'>
          <template v-if="!AuthenInfo4Submit.AuthenInfo.LicensePath">
            <span>双击添加照片</span>
            <div class="remark">
              <p class="remoark-text1">照片支持 .png, .jpg,.bmp 格式；</p>
              <p>宽度和长度比率为5:7</p>
            </div>
          </template>
          <el-image v-else fit='cover' :src="imgSrc" class="upload-img" :preview-src-list="srcList">
          </el-image>
          <div class="img-mask" @click="onImgClick"></div>
        </div>
        <div class="text gray" v-if="!(!AllowEdit)">
          <p class="is-bold">操作说明：</p>
          <p class="is-font-12">双击可更换照片；单击查看照片，鼠标滚轮滚动可放大/ 缩小图片；拖拽可移动图片。</p>
        </div>
      </div>
    </div>
    <footer>
      <span class="is-pink" v-if="customerInfo&&customerInfo.RefuseTips&&!AllowEdit">{{customerInfo.RefuseTips}}</span>
      <el-button type="primary" :disabled='!AllowEdit' @click="handleSubmit">保存</el-button>
    </footer>
  </section>
</template>

<script>
import InputComp from '@/components/common/InputComp.vue';
import { mapState } from 'vuex';
import { imgUrl } from '@/assets/js/setup';

export default {
  // 修改账户信息后要重新获取账户信息数据和账号数据 (2个接口  需在获取前设置旧数据为null) 其它情况, 如充值后也需要重新获取账号信息
  components: {
    InputComp,
  },
  computed: {
    ...mapState('common', ['customerInfo']),
    imgSrc() {
      // if (process.env.NODE_ENV === 'development') {
      //   return `${imgUrl}${this.AuthenInfo4Submit.AuthenInfo.LicensePath}`;
      // }
      return `${imgUrl}${this.AuthenInfo4Submit.AuthenInfo.LicensePath}`;
    },
    srcList() {
      return [this.imgSrc];
    },
    AllowEdit() {
      return this.AuthenInfo4Submit.AllowEdit;
    },
    QQ: {
      get() {
        return this.AuthenInfo4Submit.QQ.replace(/^0/, '');
        // return this.AuthenInfo4Submit.AuthenInfo.QQ;
      },
      set(newVal) {
        this.AuthenInfo4Submit.QQ = newVal.replace(/^0/, '').replace(/[^\d]/g, '');
        // this.AuthenInfo4Submit.AuthenInfo.QQ = newVal.replace(/[^\d]/g, '');
      },
    },
    TaxID: {
      get() {
        return this.AuthenInfo4Submit.AuthenInfo.TaxID;
      },
      set(newVal) {
        this.AuthenInfo4Submit.AuthenInfo.TaxID = newVal.replace(/[^\w]/g, '');
      },
    },
  },
  data() {
    // const validateQQ = (rule, value, callback) => {
    //   if (this.validateCheck(value, this.QQRules, callback)) callback();
    // };
    return {
      RegionalList: [],
      CityList: [],
      CountyList: [],
      hasUploadedImg: false,
      AuthenInfo4Submit: {
        AuthenInfo: {
          CompanyName: '',
          TaxID: '',
          SellArea: {
            RegionalID: '',
            RegionalName: '',
            CityID: '',
            CityName: '',
            CountyID: '',
            CountyName: '',
          },
          DetailAddress: '',
          LicensePath: '',
        },
        CustomerName: '',
        AllowEdit: true,
        QQ: '',
      },
      firstClickTime: '',
      secondClickTime: '',
      timer: null,
      simpNameRules: [
        { strategy: 'isNotEmpty', errorMsg: '请输入企业简称' },
        { strategy: 'maxLength:20', errorMsg: '企业简称长度不能超过20个字' },
        { strategy: 'hasNotSpace', errorMsg: '企业简称中不能有空格' },
        { strategy: 'hasNotRung', errorMsg: '企业简称中不能有横杠' },
      ],
      companyRules: [
        { strategy: 'isNotEmpty', errorMsg: '请输入企业全称' },
        { strategy: 'hasNotSpace', errorMsg: '企业全称中不能有空格' },
        { strategy: 'hasNotRung', errorMsg: '企业全称中不能有横杠' },
        { strategy: 'maxLength:40', errorMsg: '企业全称长度最多不能超过40个字' },
      ],
      detailRules: [
        { strategy: 'isNotEmpty', errorMsg: '请输入详细地址信息' },
        { strategy: 'maxLength:60', errorMsg: '详细地址长度不能超过60字' },
      ],
      RegionalRules: [
        { strategy: 'isNotEmpty', errorMsg: '请选择省份' },
        { strategy: 'isNotZero', errorMsg: '请选择省份' },
      ],
      CityRules: [
        { strategy: 'isNotEmpty', errorMsg: '请选择城市' },
        { strategy: 'isNotZero', errorMsg: '请选择城市' },
      ],
      CountyRules: [
        { strategy: 'isNotEmpty', errorMsg: '请选择县/区' },
        { strategy: 'isNotZero', errorMsg: '请选择县/区' },
      ],
      TaxIDRules: [
        { strategy: 'hasNotSpace', errorMsg: '纳税人识别号中不能有空格' },
      ],
      loadingAddInfo: false,
    };
  },
  methods: {
    async handleRegionalChange(e) {
      const _t = this.RegionalList.find(it => it.ID === e);
      this.AuthenInfo4Submit.AuthenInfo.SellArea.RegionalName = _t.Name;
      this.AuthenInfo4Submit.AuthenInfo.SellArea.CityID = '';
      this.AuthenInfo4Submit.AuthenInfo.SellArea.CityName = '';
      this.AuthenInfo4Submit.AuthenInfo.SellArea.CountyID = '';
      this.AuthenInfo4Submit.AuthenInfo.SellArea.CountyName = '';
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
      this.AuthenInfo4Submit.AuthenInfo.SellArea.CityName = _t.Name;
      this.AuthenInfo4Submit.AuthenInfo.SellArea.CountyID = '';
      this.AuthenInfo4Submit.AuthenInfo.SellArea.CountyName = '';
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
      // console.log(_t);
      this.AuthenInfo4Submit.AuthenInfo.SellArea.CountyName = _t.Name;
    },
    onChange(e) {
      const file = e.target.files[0];
      console.log(file);
      if (!file) {
        return;
      }
      if (
        file.type !== 'image/jpeg'
        && file.type !== 'image/png'
        && file.type !== 'image/bmp'
      ) {
        this.messageBox.warnSingleError({
          title: '图片格式错误',
          msg: '请上传 jpg/png/bmp 格式图片',
        });
        e.target.value = '';
        return;
      }
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file); // 根据图片路径读取图片
      fileReader.onload = (ie) => {
        const base64 = ie.currentTarget.result;
        const img = new Image();
        img.src = base64;
        img.onload = async () => {
          const imgInfo = {
            width: img.naturalWidth,
            height: img.naturalHeight,
          };
          if ((imgInfo.width < 900 || imgInfo.height < 1280) && (imgInfo.width < 1280 || imgInfo.height < 900)) {
            this.messageBox.warnSingleError({
              title: '图片尺寸太小',
              msg: '请上传大于等于900×1280像素的图片',
            });
            e.target.value = '';
            return;
          }
          const res = await this.api.uploadImage(file);
          if (res.data.Status === 1000) {
            this.AuthenInfo4Submit.AuthenInfo.LicensePath = res.data.Data.Url;
          }
        };
      };
    },
    handleSingleClick() {
      const oImg = document.querySelector('div.upload-img.el-image > img');
      if (!oImg) return;
      const oMask = document.querySelector('div.img-mask');
      oMask.style.cursor = 'progress';
      this.timer = setTimeout(() => {
        oImg.click();
        this.timer = null;
        oMask.style.cursor = 'default';
      }, 300);
    },
    onImgClick() {
      if (!this.AllowEdit) return;
      this.firstClickTime = this.secondClickTime;
      this.secondClickTime = Date.now();
      if (!this.firstClickTime) {
        this.handleSingleClick();
        return;
      }
      if (this.secondClickTime - this.firstClickTime >= 300) {
        this.handleSingleClick();
      } else {
        clearTimeout(this.timer);
        this.timer = null;
        const oMask = document.querySelector('div.img-mask');
        const oInp = document.querySelector('input.upload');
        oMask.style.cursor = 'default';
        oInp.click();
      }
    },
    reportError(msg) {
      this.messageBox.warnSingleError({
        title: '校验错误',
        msg,
      });
    },
    checkValue() {
      const {
        SellArea,
        DetailAddress,
        // CompanyName,
        TaxID,
      } = this.AuthenInfo4Submit.AuthenInfo;
      if (!SellArea) {
        this.reportError('请选择地址!');
        return false;
      }
      // eslint-disable-next-line object-curly-newline
      const { RegionalID, CityID, CountyID } = SellArea;
      const { CustomerName, QQ } = this.AuthenInfo4Submit;
      if (!this.validateCheck(CustomerName, this.simpNameRules, this.reportError)) return false; // 企业简称校验
      // if (!this.validateCheck(CompanyName, this.companyRules, this.reportError)) return false; // 企业全称校验
      if (!this.validateCheck(RegionalID, this.RegionalRules, this.reportError)) return false; // 省校验
      if (!this.validateCheck(CityID, this.CityRules, this.reportError)) return false; // 市校验
      if (!this.validateCheck(CountyID, this.CountyRules, this.reportError)) return false; // 县区校验
      if (!this.validateCheck(DetailAddress, this.detailRules, this.reportError)) return false; // 详细地址校验
      if (TaxID) {
        const { length } = TaxID;
        if (length !== 15 && length !== 17 && length !== 18 && length !== 20) {
          this.reportError('纳税人识别号长度不正确,应为15、17、18、20位数字或字母');
          return false;
        }
        if (!this.validateCheck(TaxID, this.TaxIDRules, this.reportError)) return false; // 详细地址校验
      }
      if (QQ) {
        const { length } = QQ;
        if (length < 5) {
          this.reportError('QQ号长度最少为5位');
          return false;
        }
        if (QQ < 10000) {
          this.reportError('QQ号最小为10000');
          return false;
        }
        if (length > 11) {
          this.reportError('QQ号长度不应超过13位');
          return false;
        }
      }
      return true;
    },
    async handleSubmit() {
      if (!this.checkValue()) return;
      // // console.log(this.AuthenInfo4Submit);
      const res = await this.api.getCustomerApplyAuthentication(this.AuthenInfo4Submit);
      if (res.data.Status === 1000) {
        this.messageBox.successSingle({
          title: '修改成功',
          successFunc: async () => {
            // this.AuthenInfo4Submit.AllowEdit = false;
            // this.$store.commit('common/setCustomerAuthenInfo', this.AuthenInfo4Submit);
            const bool = await this.$store.dispatch('common/getCustomerDetail', true);
            if (bool) {
              const { redirect } = this.$route.query;
              if (redirect) this.$router.push(`/${redirect}`);
            }
          },
        });
      }
    },
  },
  watch: {
    customerInfo: {
      async handler(newVal) {
        if (!newVal) return;
        // eslint-disable-next-line object-curly-newline
        const { CustomerName, AuthenInfo, AllowEdit, QQ } = newVal;
        if (!AuthenInfo) return;
        // eslint-disable-next-line object-curly-newline
        const { CompanyName, DetailAddress, LicensePath, TaxID, SellArea } = AuthenInfo;
        this.AuthenInfo4Submit.CustomerName = CustomerName;
        this.AuthenInfo4Submit.QQ = QQ;
        // this.AuthenInfo4Submit.AuthenInfo.QQ = QQ;
        this.AuthenInfo4Submit.AllowEdit = AllowEdit;
        this.AuthenInfo4Submit.AuthenInfo.TaxID = TaxID;
        this.AuthenInfo4Submit.AuthenInfo.CompanyName = CompanyName;
        this.AuthenInfo4Submit.AuthenInfo.DetailAddress = DetailAddress;
        this.AuthenInfo4Submit.AuthenInfo.LicensePath = LicensePath;
        if (LicensePath) this.hasUploadedImg = true;
        // // console.log(SellArea);
        if (SellArea) this.AuthenInfo4Submit.AuthenInfo.SellArea = { ...SellArea };
        if (SellArea) {
          const { RegionalID, CityID } = SellArea;
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
        } else {
          this.loadingAddInfo = true;
          const res = await this.api.getAddressIDList(-1);
          this.loadingAddInfo = false;
          if (res.data.Status === 1000) {
            this.RegionalList = res.data.Data;
          }
        }
      },
      immediate: true,
    },
  },
  mounted() {
    // console.log(this.$route.query);
  },
};
</script>

<style lang='scss'>
.mp-pc-my-setting-account-page-wrap {
  > .basic-info {
    // padding-top: 10px;
    > div {
      margin-top: 20px;
      // &.second {
      //   margin-top: 30px;
      // }
      > div + div {
        margin-left: 60px;
      }
      &.address-wrap {
        margin-top: 30px;
        > div {
          margin: 0;
          &.add-1 {
            margin-bottom: 15px;
            > p {
              line-height: 44px;
              color: #888;
            }
            > div {
              width: 120px;
              height: 30px;
              margin-right: 20px;
              > .el-input {
                height: 30px;
                > input {
                  height: 30px;
                  line-height: 26px\0;
                }
              }
              &.el-loading-mask {
                width: 400px;
                top: 42px;
                height: 45px;
                .el-loading-spinner svg {
                  height: 24px;
                  width: 24px;
                }
              }
            }
          }
          &.add-2 {
            > .el-input {
              height: 30px;
              width: 700px;
              > input {
                height: 30px;
                line-height: 26px\0;
                &::placeholder {
                  color: #cbcbcb;
                }
              }
            }
          }
        }
      }
    }
  }
  > .img-info {
    margin-top: 40px;
    > .img-box {
      margin-top: 32px;
      > div {
        display: inline-block;
        &.pic {
          width: 300px;
          height: 400px;
          overflow: hidden;
          text-align: center;
          // padding-top: 175px;
          user-select: none;
          position: relative;
          &.show-bg {
            background: url(../../assets/images/license-bg-pic.png) no-repeat center/100% 100%;
          }
          color: #aaa;
          > .remark {
            width: 300px;
            height: 60px;
            position: absolute;
            left: 0;
            bottom: 0;
            font-size: 14px;
            background-color: rgba($color: #428dfa, $alpha: 0.5);
            color: #fff;
            > p.remoark-text1 {
              margin: 12px 0;
            }
          }
          > .el-image {
            width: 100%;
            height: 100%;
          }
          > span {
            position: absolute;
            top: 175px;
            left: 96px;
          }
          > input.upload {
            opacity: 0;
            width: 1px;
            height: 1px;
            position: absolute;
          }
          > .img-mask {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 9;
          }
        }
        &.text {
          line-height: 20px;
          padding-left: 15px;
          padding-bottom: 5px;
          vertical-align: bottom;
          &.cancel {
            color: #aaa !important;
          }
        }
      }
    }
  }
  > footer {
    margin-top: 50px;
    margin-bottom: 80px;
    padding-right: 80px;
    // padding-left: 325px;
    text-align: center;
    > button {
      width: 120px;
      margin-left: 30px;
    }
  }
}
</style>
