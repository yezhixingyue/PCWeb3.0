<template>
  <section class="mp-pc-order-detail-common-comp-wrap">
    <header class="section-title">{{title}}</header>
    <div class="main" :class="PartList.length === 1 ? 'is-merge' : ''">
      <div class="left">
        <!-- 产品名称 -->
        <p class="product-name">
          <span class="gray">产品：</span>
          <span class="is-bold">{{productName}}</span>
        </p>
        <!-- 数量、款数 -->
        <p>
          <span class="width-122 gray">数量：{{ProductNum}}</span>
          <span><i class="gray">款数：</i>{{productKindCount}}款</span>
        </p>
        <!-- 联拼行列数 和 多款联拼 -->
        <p v-if="productMakeup">
          <span class="width-122 gray"
           >联拼：{{productMakeup}}</span>
          <span>{{productMultyKindMakeup}}</span>
        </p>
        <!-- 产品属性 -->
        <p v-for="item in productPropertyList" :key="item.PropertyID">
          <span class="gray">{{item.PropertyName}}：</span>
          <span class="is-font-12">{{item.ShowValue}}{{item.ShowUnit}}</span>
        </p>

        <!-- 产品工艺 -->
        <div class="craft-wrap float" v-if="productCraftList.length > 0">
          <div class="gray">工艺：</div>
          <ul>
            <li v-for="item in productCraftList" :key="item.CraftID" class="is-font-12">
              <span class="craft-title">{{item.craftName}}</span>
              <span v-if="item.Property" class="gray">（ {{item.Property}} ）</span>
            </li>
          </ul>
        </div>

        <!-- 产品部件 -->
        <ul v-if="PartList.length === 1">
          <li v-for="item in PartList" :key="item.PartID">
            <!-- 部件名称 -->
            <i class="line"></i>
            <p class="is-bold" :class="PartList.length > 1 ? '' : 'is-opacity0'">
              <i class="is-origin">//</i> {{item.Attributes.Name}}</p>
            <div v-for="(part, i) in item.PartList" :key="part.PartID + i">
              <!-- 部件数量与物料 -->
              <p>
                <span class="width-122 gray" v-if="part.PartAmount.First > 1"
                >数量：{{part.PartAmount.First}}{{item.Attributes.Unit}}/{{productUnit}}
                </span>
                <span v-if="part.Attributes.Material"><i class="gray">物料：</i>{{part.Attributes.Material.Name}}</span>
              </p>
              <!-- 尺寸 -->
              <p v-if="part.Attributes.SizeName">
                <span><i class="gray">尺寸：</i>{{part.Attributes.SizeName}}</span>
              </p>
              <!-- 属性(包含印刷属性) -->
              <p v-for="item in part.PropertyList" :key="item.PropertyID">
                <span class="gray">{{item.PropertyName}}：</span>
                <span class="is-font-12">{{item.ShowValue}}{{item.ShowUnit}}</span>
              </p>
              <!-- 属性组 -->
              <div v-for="item in part.PropertyGroupList" :key="item.GroupID" class="property-group-wrap">
                <p class="is-bold is-font-13">{{item.GroupName}}：</p>
                <div>
                  <p v-for="(group, i) in item.PropertyList" :key="item.GroupID + i" class="property-list">
                  <span v-for="it in group.Second" :key="it.PropertyID">
                    <i class="gray">{{it.PropertyName}}</i>
                    <i v-if="it.ShowValue" class="is-font-12">：{{it.ShowValue}}{{it.ShowUnit}}</i>
                  </span>
                </p>
                </div>
              </div>
              <!-- 工艺 -->
              <div class="craft-wrap float" v-if="getCraftList(part.CraftList).length > 0">
                <div class="gray">工艺：</div>
                <ul>
                  <li v-for="item in getCraftList(part.CraftList)" :key="item.CraftID" class="is-font-12">
                    <span class="craft-title">{{item.craftName}}</span>
                    <span v-if="item.Property" class="gray">（ {{item.Property}} ）</span>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="content" v-if="PartList.length > 1">
        <!-- 产品部件 -->
        <ul>
          <li v-for="item in PartList" :key="item.PartID">
            <!-- 部件名称 -->
            <p class="is-bold" :class="PartList.length > 1 ? '' : 'is-opacity0'">
              <i class="is-origin">//</i> {{item.Attributes.Name}}</p>
            <div v-for="(part, i) in item.PartList" :key="part.PartID + i">
              <!-- 部件数量与物料 -->
              <p>
                <span class="width-122 gray" v-if="part.PartAmount.First > 1"
                >数量：{{part.PartAmount.First}}{{item.Attributes.Unit}}/{{productUnit}}
                </span>
                <span v-if="part.Attributes.Material"><i class="gray">物料：</i>{{part.Attributes.Material.Name}}</span>
              </p>
              <!-- 尺寸 -->
              <p v-if="part.Attributes.SizeName">
                <span><i class="gray">尺寸：</i>{{part.Attributes.SizeName}}</span>
              </p>
              <!-- 属性(包含印刷属性) -->
              <p v-for="item in part.PropertyList" :key="item.PropertyID">
                <span class="gray">{{item.PropertyName}}：</span>
                <span class="is-font-12">{{item.ShowValue}}{{item.ShowUnit}}</span>
              </p>
              <!-- 属性组 -->
              <div v-for="item in part.PropertyGroupList" :key="item.GroupID">
                <p class="is-bold is-font-13">{{item.GroupName}}：</p>
                <p v-for="(group, i) in item.PropertyList" :key="item.GroupID + i" class="property-list">
                  <span v-for="it in group.Second" :key="it.PropertyID">
                    <i class="gray">{{it.PropertyName}}</i>
                    <i v-if="it.ShowValue" class="is-font-12">：{{it.ShowValue}}{{it.ShowUnit}}</i>
                  </span>
                </p>
              </div>
              <!-- 工艺 -->
              <div class="craft-wrap float" v-if="getCraftList(part.CraftList).length > 0">
                <div class="gray">工艺：</div>
                <ul>
                  <li v-for="item in getCraftList(part.CraftList)" :key="item.CraftID" class="is-font-12">
                    <span class="craft-title">{{item.craftName}}</span>
                    <span v-if="item.Property" class="gray">（ {{item.Property}} ）</span>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="right" :class="PartList.length > 1?'':'setMP'">
        <slot></slot>
      </div>
    </div>
  </section>
</template>

<script>

export default {
  props: {
    title: {
      type: String,
      default: '产品详情',
    },
    orderDetail: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    productUnit() {
      if (!this.orderDetail) return '';
      if (this.pageName === 'orderDetail') {
        return this.orderDetail.Unit;
      }
      if (!this.orderDetail.ProductParams || !this.orderDetail.ProductParams.Attributes) return '';
      return this.orderDetail.ProductParams.Attributes.Unit;
    },
    productName() {
      if (!this.orderDetail) return '';
      if (this.pageName === 'orderDetail') {
        const { FirstLevelName, SecondLevelName, ProductName } = this.orderDetail;
        return `${FirstLevelName}-${SecondLevelName}-${ProductName}`;
      }
      if (!this.orderDetail.ProductParams || !this.orderDetail.ProductParams.Attributes) return '';
      const { FirstLevelName, SecondLevelName, Name } = this.orderDetail.ProductParams.Attributes;
      return `${FirstLevelName}-${SecondLevelName}-${Name}`;
    },
    ProductNum() {
      if (!this.orderDetail) return '';
      if (this.pageName === 'orderDetail') {
        const { ProductAmount, Unit } = this.orderDetail;
        return `${ProductAmount}${Unit}`;
      }
      if (!this.orderDetail.ProductParams) return '';
      const { ProductAmount, Attributes } = this.orderDetail.ProductParams;
      return `${ProductAmount}${Attributes.Unit}`;
    },
    productKindCount() {
      if (!this.orderDetail) return '';
      if (this.pageName === 'orderDetail') return this.orderDetail.KindCount;
      if (!this.orderDetail.ProductParams) return '';
      return this.orderDetail.ProductParams.KindCount;
    },
    productMakeup() {
      if (!this.orderDetail) return '';
      if (this.pageName === 'orderDetail') {
        const { MakeupRowNumber, MakeupColumnNumber } = this.orderDetail;
        if (MakeupRowNumber === 1 && MakeupColumnNumber === 1) return '';
        return `${MakeupRowNumber}行${MakeupColumnNumber}列`;
      }
      if (!this.orderDetail.ProductParams) return '';
      const { MakeupRowNumber, MakeupColumnNumber } = this.orderDetail.ProductParams;
      if (MakeupRowNumber === 1 && MakeupColumnNumber === 1) return '';
      return `${MakeupRowNumber}行${MakeupColumnNumber}列`;
    },
    productMultyKindMakeup() {
      if (!this.orderDetail) return '';
      if (this.pageName === 'orderDetail') {
        const { MultyKindMakeup } = this.orderDetail;
        if (MultyKindMakeup) return '多款联拼';
        return '';
      }
      const { MultyKindMakeup } = this.orderDetail.ProductParams;
      if (MultyKindMakeup) return '多款联拼';
      return '';
    },
    productPropertyList() {
      if (!this.orderDetail) return '';
      if (this.pageName === 'orderDetail') {
        if (this.curOrderData) return this.curOrderData.ProductParams.PropertyList;
        return [];
      }
      if (!this.orderDetail.ProductParams) return '';
      return this.orderDetail.ProductParams.PropertyList;
    },
    productCraftList() {
      if (!this.orderDetail) return '';
      let _list = this.orderDetail.ProductParams ? this.orderDetail.ProductParams.CraftList : [];
      if (this.curOrderData) _list = this.curOrderData.ProductParams.CraftList;
      // eslint-disable-next-line no-nested-ternary
      _list = _list ? _list.First ? _list.First : [] : [];
      const _arr = [];
      _list.forEach(it => {
        const _obj = {};
        _obj.craftName = it.Attributes.NickName;
        const _subArr = [];
        it.PropertyList.forEach(it2 => {
          it2.forEach(it3 => {
            const _str = it3.ShowValue + it3.ShowUnit;
            _subArr.push(_str);
          });
        });
        // if (it.PropertyList.length > 1) _subArr.push(`${it.PropertyList.length}处`);
        // else {
        //   it.PropertyList.forEach(it2 => {
        //     it2.forEach(it3 => {
        //       const _str = it3.ShowValue + it3.ShowUnit;
        //       _subArr.push(_str);
        //     });
        //   });
        // }
        _obj.Property = _subArr.join('、');
        if (_subArr.length > 1) _obj.craftName = `${_obj.craftName}${_subArr.length}处`;
        // _obj.Property = _subArr.join(' ');
        _arr.push(_obj);
      });
      return _arr;
    },
    PartList() {
      if (!this.orderDetail) return [];
      if (this.pageName === 'orderDetail') {
        if (this.curOrderData) return this.curOrderData.ProductParams.PartList;
        return [];
      }
      if (!this.orderDetail.ProductParams) return [];
      return this.orderDetail.ProductParams.PartList;
    },
  },
  data() {
    return {
      pageName: '',
      curOrderData: null,
    };
  },
  methods: {
    getCraftList(CraftList) {
      let _list = CraftList;
      // eslint-disable-next-line no-nested-ternary
      _list = _list ? _list.First ? _list.First : [] : [];
      const _arr = [];
      _list.forEach(it => {
        const _obj = {};
        _obj.craftName = it.Attributes.NickName;
        const _subArr = [];
        it.PropertyList.forEach(it2 => {
          const _tempArr = [];
          it2.forEach(it3 => {
            const _str = it3.ShowValue + it3.ShowUnit;
            _tempArr.push(_str);
          });
          _subArr.push(_tempArr.join('、'));
        });
        // if (it.PropertyList.length > 1) _subArr.push(`${it.PropertyList.length}处`);
        // else {
        //   it.PropertyList.forEach(it2 => {
        //     it2.forEach(it3 => {
        //       const _str = it3.ShowValue + it3.ShowUnit;
        //       _subArr.push(_str);
        //     });
        //   });
        // }
        _obj.Property = _subArr.join('、');
        if (_subArr.length > 1) _obj.craftName = `${_obj.craftName}${_subArr.length}处`;
        _arr.push(_obj);
      });
      return _arr;
    },
  },
  async mounted() {
    this.pageName = this.$route.name;
    if (this.pageName === 'unpayOrderDetail') this.pageName = 'orderDetail';
    if (this.pageName !== 'orderDetail') return;
    const res = await this.api.getOrderDetail(this.orderDetail.OrderID);
    this.$emit('setDetailDataCompleted', true);
    if (res.data.Status === 1000) {
      this.curOrderData = res.data.Data;
      this.$store.commit('order/updateOrderDetailData', res.data.Data);
      if (this.$route.name === 'unpayOrderDetail') {
        this.$store.commit('unpayList/updateCurUnpayListDetailData', res.data.Data);
      }
    }
  },
};
</script>

<style lang='scss'>
.mp-pc-order-detail-common-comp-wrap {
  font-size: 14px;
  color: #585858;
  padding-bottom: 35px;
  background-color: #fff;
  > .main {
    padding-top: 22px;
    position: relative;
    overflow: hidden;
    > .left {
      display: inline-block;
      vertical-align: top;
      width: 360px;
      padding: 30px;
      padding-top: 15px;
      box-sizing: border-box;
      > p {
        margin-bottom: 20px;
        &.product-name {
          margin-bottom: 28px;
        }
      }
      > ul {
        width: 380px;
        margin-top: 15px;
        // margin-left: 58px;
        box-sizing: border-box;
        > li {
          > p {
            margin-bottom: 28px;
            // padding-left: 26px;
          }
          > div {
            // padding-left: 26px;
            > p {
              margin-bottom: 20px;
            }
            & + div {
              margin-top: 10px;
              padding-top: 20px;
              border-top: 1px solid #eee;
            }
            > div {
              margin-bottom: 15px;
              > p {
                // margin-bottom: 20px;
                > span {
                  line-height: 30px;
                  margin-right: 15px;
                }
              }
              > div > p {
                margin-top: 2px;
                & + p {
                  border-top: 1px dashed #eee;
                }
                &:last-of-type {
                  border-bottom: 1px dashed #eee;
                }
              }
            }
          }
        }
      }
    }
    > .content {
      border-left: 1px solid #eee;
      border-right: 1px solid #eee;
      box-sizing: border-box;
      width: 483px;
      display: inline-block;
      height: 10000px;
      margin-bottom: -9999px;
      > ul {
        width: 380px;
        margin-top: 15px;
        margin-left: 58px;
        box-sizing: border-box;
        > li {
          > p {
            margin-bottom: 28px;
            padding-left: 26px;
          }
          > div {
            padding-left: 26px;
            > p {
              margin-bottom: 20px;
            }
            & + div {
              margin-top: 10px;
              padding-top: 20px;
              border-top: 1px solid #eee;
            }
            > div {
              margin-bottom: 15px;
              > p {
                // margin-bottom: 20px;
                > span {
                  line-height: 30px;
                  margin-right: 15px;
                }
                &.property-list {
                  margin-top: 2px;
                  & + p {
                    border-top: 1px dashed #eee;
                  }
                  &:last-of-type {
                    border-bottom: 1px dashed #eee;
                  }
                }
              }
            }
          }
        }
      }
    }
    > .right {
      display: inline-block;
      width: 355px;
      vertical-align: top;
      // padding-left: 40px;
      box-sizing: border-box;

      &.setMP {
        height: 10000px;
        margin-bottom: -9999px;
        border-left: 1px solid #eee;
      }
    }
    .craft-wrap {
      > div {
        float: left;
        // margin-right: 8px;
      }
      > ul {
        overflow: hidden;
        > li {
          margin-bottom: 20px;
          .craft-title {
            min-width: 3em;
            display: inline-block;
          }
        }
      }
    }
    .width-122 {
      width: 122px;
      display: inline-block;
    }
    &.is-merge {
      > .left {
        width: 765px;
        padding-left: 60px;
        padding-top: 30px;
        min-height: 380px;
        // > p.product-name {
        //   margin-bottom: 20px;
        // }
        > ul {
          width: 100%;
          position: relative;
          > li {
            > div > .property-group-wrap {
              > p {
                display: inline-block;
                vertical-align: top;
                padding-top: 4px;
                margin-right: 6px;
              }
              > div {
                display: inline-block;
                vertical-align: top;
                > p {
                  line-height: 20px;
                  > span {
                    margin-right: 24px;
                  }
                }
              }
            }
            > p {
              &.is-opacity0 {
                margin-bottom: 8px;

              }
            }
            >i.line {
              width: 100%;
              height: 1px;
              background-image: linear-gradient(to right, #e6e6e6 0%, #e6e6e6 80%, transparent 20%);
              background-repeat: repeat-x;
              background-size: 7px 1px;
              display: inline-block;
            }
          }
          // &::after {
          //   content: '';
          //   width: 100%;
          //   height: 1px;
          //   position: absolute;
          //   background-color: #eee;
          //   // border-bottom: 1px dashed #eee;
          //   top: 8px;
          // }
        }
        .craft-wrap {
          > ul > li {
            display: inline-block;
            margin-right: 20px;
            .craft-title {
              min-width: unset;
              display: inline-block;
            }
          }
        }
      }
    }
  }
  .is-opacity0 {
    opacity: 0;
  }
}
</style>
