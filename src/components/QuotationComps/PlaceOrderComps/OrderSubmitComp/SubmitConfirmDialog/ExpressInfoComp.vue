<template>
  <!--  :style="`min-height:${minHeight}px`" -->
  <PanelItemComp title="配送信息" class="express" v-if="Address && ExpressList" :style="`height:${minHeight}px;opacity=${opacity}`" >
    <template #img>
      <img src="@/assets/images/express-info.png" alt="">
    </template>
    <ul class="display-box" ref="oBox">
      <li v-if="OutPlateNo">
        <span class="label">平台单号：</span>
        <div class="text">{{OutPlateNo}}</div>
      </li>
      <li>
        <span class="label">配送方式：</span>
        <div class="text">{{ExpressName}}</div>
      </li>
      <li>
        <span class="label" style="width:70px">收件人：</span>
        <div class="text">
          <span :title="Consignee.length > 6 ? Consignee : ''">{{Consignee.length > 6 ? `${Consignee.slice(0,5)}...` : Consignee}}</span>
          <span style="margin-left: 28px">{{Mobile}}</span>
        </div>
      </li>
      <li>
        <span class="label">收件地址：</span>
        <div class="text">{{AddressDetail}}</div>
      </li>
    </ul>
  </PanelItemComp>
</template>

<script>
import PanelItemComp from './PanelItemComp.vue';

export default {
  props: {
    Address: {
      type: Object,
      default: null,
    },
    ExpressList: {
      type: Array,
      default: null,
    },
    OutPlateNo: {
      type: String,
      default: '',
    },
    canflex: { // 页面是否支持flex布局
      type: Boolean,
      default: false,
    },
  },
  components: {
    PanelItemComp,
  },
  computed: {
    ExpressName() {
      if (this.Address && this.Address.Express && this.ExpressList && this.ExpressList.length > 0) {
        const { First, Second } = this.Address.Express;
        const type = this.ExpressList.find(it => it.Type === First);
        if (type) {
          const t = type.List.find(it => it.ID === Second);
          if (t) return t.Name || '';
        }
      }
      return '';
    },
    Consignee() {
      if (this.Address && this.Address.Address) {
        const Consignee = this.Address.Address.Consignee || '';
        return Consignee;
      }
      return '';
    },
    Mobile() {
      if (this.Address && this.Address.Address) {
        return this.Address.Address?.Mobile || '';
      }
      return '';
    },
    AddressDetail() {
      if (this.Address && this.Address.Address) {
        const { ExpressArea, AddressDetail } = this.Address.Address;
        if (ExpressArea) {
          const { RegionalName, CityName, CountyName } = ExpressArea;
          return `${RegionalName || ''}${CityName || ''}${CountyName || ''}${AddressDetail || ''}`;
        }
      }
      return '';
    },
    watchVal() {
      return this.canflex && `${this.ExpressName}${this.Consignee}${this.Mobile}${this.AddressDetail}`;
    },
  },
  data() {
    return {
      minHeight: '',
      opacity: 1,
    };
  },
  watch: {
    watchVal: {
      handler(val) {
        if (val) {
          this.opacity = 0;
          setTimeout(() => {
            if (this.$refs.oBox) {
              const h = this.$refs.oBox.offsetHeight + 56;
              this.minHeight = Math.min(Math.max(h, 198), 240);
            }
            this.opacity = 1;
          }, 0);
        }
      },
      immediate: true,
    },
  },
};
</script>
<style lang='scss'>
</style>
