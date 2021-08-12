<template>
  <section class="mp-pc-common-comp-order-common-summary-comp-wrap">
    <header class="section-title">{{title}}</header>
    <ul class="content float">
      <li class="left">
        <p class="first">
          <span class="title">平台单号：</span>
          <span>{{info4OrderSummary.OutPlate}}</span>
        </p>
        <p>
          <span class="title">收件人：</span>
          <span>{{info4OrderSummary.Consignee}}</span>
          <span class="phone">{{info4OrderSummary.Mobile}}</span>
          <span class="gray">/ 配送方式：{{info4OrderSummary.ExpressText}}</span>
        </p>
        <p>
          <span class="title">收件地址：</span>
          <el-tooltip
            class="item"
            effect="dark"
            :content="info4OrderSummary.Address"
            placement="top-start"
          >
            <span>{{info4OrderSummary.Address}}</span>
          </el-tooltip>
        </p>
        <p>
          <span>货品重量：
            <template
             v-if="info4OrderSummary.Weight || info4OrderSummary.Weight === 0">{{info4OrderSummary.Weight}}kg</template>
          </span>
        </p>
      </li>
      <li class="right gray">
        <p>
          <template v-if="info4OrderSummary.ProducePeriod">
            <span class="title">工期时间：</span>
            <span class="is-pink">{{info4OrderSummary.ProducePeriod | getPayTime}}
              {{info4OrderSummary.ProducePeriod | getDoneTime}}</span>
          </template>
        </p>
        <p>
          <span class="title">印刷文件：</span>
          <el-tooltip
            class="item"
            effect="dark"
            :content="info4OrderSummary.FilePath"
            placement="top-start"
          >
            <span>{{info4OrderSummary.FilePath}}</span>
          </el-tooltip>
        </p>
        <p>
          <span class="title">文件内容：</span>
          <el-tooltip
            class="item"
            effect="dark"
            :content="info4OrderSummary.Content"
            placement="top-start"
          >
            <span>{{info4OrderSummary.Content}}</span>
          </el-tooltip>
        </p>
      </li>
    </ul>
  </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    title: {
      type: String,
      default: '订单概括',
    },
    showData: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapState('common', ['ExpressList']),
    info4OrderSummary() {
      return {
        OutPlate: this.showData.OutPlate,
        Consignee: this.showData.Address.Address.Consignee,
        Mobile: this.showData.Address.Address.Mobile,
        ExpressText: this.getExpress(this.showData.Address.Express),
        Address: this.getAdd(this.showData.Address.Address),
        Content: this.showData.Content,
        FilePath: this.showData.FilePath,
        ProducePeriod: this.showData.ProducePeriod,
        Weight: this.showData.Weight,
      };
    },
  },
  methods: {
    getExpress({ First, Second }) {
      if (First === 1 && Second === 1) return '名片之家';
      if (this.ExpressList.length === 0) return '';
      let _str = '';
      const _first = this.ExpressList.find(it => it.Type === First);
      if (_first) {
        _str = _first.Name;
        const _second = _first.List.find(item => item.ID === Second);
        if (_second) _str += ` ${_second.Name}`;
      }
      return _str;
    },
    getAdd({ AddressDetail, ExpressArea }) {
      const { RegionalName, CityName, CountyName } = ExpressArea;
      return `${RegionalName}${CityName}${CountyName}${AddressDetail}`;
    },
  },
  mounted() {
    this.$store.dispatch('common/getExpressList');
  },
};
</script>

<style lang='scss'>
.mp-pc-common-comp-order-common-summary-comp-wrap {
  background: url('../../../assets/images/detail-saw.png') bottom left/ 1200px 5px repeat-x ;
  position: relative;
  // &::after {
  //   display: block;
  //   content: "";
  //   height: 12px;
  //   // margin-top: 24px;
  //   background-color: rgb(245, 245, 245);
  //   background-size: 12px 24px;
  //   background-image: linear-gradient(
  //       45deg,
  //       #fff 25%,
  //       transparent 25%,
  //       transparent
  //     ),
  //     linear-gradient(-45deg, #fff 25%, transparent 25%, transparent),
  //     linear-gradient(45deg, transparent 75%, #fff 75%),
  //     linear-gradient(-45deg, transparent 75%, #fff 75%);
  // }
  > ul.content {
    height: 151px;
    padding: 0 30px;
    padding-top: 9px;
    color: #585858;
    > .left {
      float: left;
      line-height: 34px;
      font-size: 14px;
      > .first {
        // padding-bottom: 9px;
      }
      padding-right: 20px;
      width: 660px;
      > p {
        > .phone {
          margin: 0 40px 0 25px;
        }
      }
    }
    > .right {
      overflow: hidden;
      height: 96px;
      font-size: 12px;
      padding-left: 25px;
      // margin-top: 10px;
      border-left: 1px solid #eee;
      line-height: 32px;
      padding-top: 14px;
      > p {
        height: 32px;
      }
    }
  }
  .title {
    min-width: 5em;
    text-align: right;
    display: inline-block;
  }
  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
