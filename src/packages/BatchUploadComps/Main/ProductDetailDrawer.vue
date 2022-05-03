<template>
  <el-drawer
      class="mp-c-batch-upload-page-main-table-item-detail-drawer-comp-wrap"
      :visible.sync="drawer"
      :show-close='false'>
      <span slot="title" @click="drawer = false" class="drawer-title"><i class="el-icon-arrow-right"></i> 详情</span>
      <section class="drawer-content">
        <header>
          <img src="@/assets/images/product-detail.png" alt="">
          <span>产品信息：</span>
        </header>
        <article class="product-content" v-if="curDetailData">
          <section class="product-header">
            <OrderDetailDisplayItem :ShowData='ProductShowData' />
          </section>
          <section class="unit">  <!-- 部件信息 -->
            <OrderDetailDisplayItem v-for="(it, i) in PartShowDataList" :ShowData='it' :key="it.Name" :class="{border: i > 0}" :showBorder='i > 0' />
          </section>
        </article>
        <footer v-if="curDetailData">
          <ul>
            <li v-show="OutPlatNo">
              <label>平台单号：</label>
              <span>{{OutPlatNo}}</span>
            </li>
            <li>
              <label>产品价格：</label>
              <span class="is-pink is-font-size-14">￥{{curDetailData.result.CurrentCost}}元</span>
            </li>
            <!-- <li v-if="ExpressCost">
              <label>运费：</label>
              <span>￥{{ExpressCost}}元</span>
            </li> -->
            <li class="print-content">
              <label>印刷内容：</label>
              <span>{{curDetailData.result.Content || '无'}}</span>
            </li>
          </ul>
        </footer>
      </section>
    </el-drawer>
</template>

<script>
import OrderDetailDisplayItem from '@/packages/OrderDetailDisplayItem';
import { projectType } from '@/assets/js/setup';

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    curDetailData: {
      type: Object,
      default: null,
    },
    ShowProductDetail: {
      type: Function,
    },
  },
  components: {
    OrderDetailDisplayItem,
  },
  computed: {
    drawer: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
    ProductShowData() {
      let Name = this.curDetailData?.result?.ProductParams?.Attributes?.DisplayName || '产品名称';
      if (Array.isArray(this.curDetailData?.result?.ProductParams?.Attributes?.ClassList)) {
        const type = projectType === 'pc' ? 2 : 1;
        const t = this.curDetailData?.result.ProductParams.Attributes.ClassList.find(it => it.Type === type);
        if (t && t.FirstLevel?.Name) {
          Name = `${t.FirstLevel.Name}-${Name}`;
        }
      }
      if (this.curDetailData?.result?.ProductParams?.Attributes?.DisplayOrderList
       && this.curDetailData.result.ProductParams.Attributes.DisplayOrderList.length > 0) {
        return {
          Name,
          ContentList: this.getPartShowList(this.curDetailData.result.ProductParams.Attributes.DisplayOrderList, this.curDetailData.result.ProductParams),
          Type: 'product',
        };
      }
      return {
        Name,
        ContentList: [],
        Type: 'product',
      };
    },
    PartList() {
      if (!this.curDetailData || !this.curDetailData.result || !this.curDetailData.result.ProductParams) return [];
      return this.curDetailData.result.ProductParams.PartList || [];
    },
    PartShowDataList() {
      const arr = [];
      this.PartList.forEach(it => {
        if (Array.isArray(it.List)) {
          it.List.forEach((part, index) => {
            const ContentList = this.getPartShowList(it.Attributes.DisplayOrderList, part);
            const Name = it.List.length > 1 && index > 0 ? `${it.Attributes.Name}${index + 1}` : it.Attributes.Name;
            const temp = {
              Name,
              Type: 'Part',
              ContentList: ContentList || [],
            };
            arr.push(temp);
          });
        }
      });
      return arr;
    },
    OutPlatNo() {
      return this.curDetailData?.result?.Address?.OutPlateSN || '';
    },
    ExpressCost() {
      if (this.curDetailData && this.curDetailData.result
       && this.curDetailData.result.ExpressCost && typeof this.curDetailData.result.ExpressCost === 'number') {
        return this.curDetailData.result.ExpressCost;
      }
      return 0;
    },
  },
  methods: {
    getPartShowList(DisplayOrderList, ProductParams) {
      return this.ShowProductDetail.getDisplayContentFromPartDataByDetailData(DisplayOrderList, ProductParams);
    },
  },
};
</script>
<style lang='scss'>
.mp-c-batch-upload-page-main-table-item-detail-drawer-comp-wrap {
  .el-drawer {
    width: 470px !important;
    > header {
      padding-left: 16px;
      .drawer-title {
        cursor: pointer;
        font-size: 15px;
        color: #888E99;
        display: flex;
        align-items: center;
        transition: 0.1s ease-in-out;
        > i {
          font-size: 18px;
          margin-right: 6px;
        }
        &:hover {
          color: #585858;
          > i {
            font-weight: 700;
          }
        }
      }
    }
    > .el-drawer__body {
      color: #585858;
      font-size: 12px;
      padding: 4px 16px 0 28px;
      .drawer-content {
        > header {
          color: #888;
          font-size: 14px;
          img {
            vertical-align: -10px;
            margin-right: 15px;
          }
        }
        > .product-content {
          max-height: 530px;
          padding: 20px;
          padding-bottom: 18px;
          box-sizing: border-box;
          overflow-y: scroll;
          .unit {
            .unit-title {
              position: relative;
              padding-left: 11px;
              &::before {
                content: "";
                position: absolute;
                width: 6px;
                height: 6px;
                background-color: #f4a307;
                border-radius: 50%;
                top: calc(50% - 3px);
                left: 0;
              }
              &.margin-10 {
                margin-bottom: 12px;
              }
            }
            .size {
              > i:last-of-type {
                > em {
                  display: none;
                }
              }
            }
          }

          &::-webkit-scrollbar {
            width: 8px;
          }
          &::-webkit-scrollbar-thumb {
            background-color: #e6e6e6;
            border-radius: 4px;
            &:hover {
              background-color: #cbcbcb;
            }
          }
          span.label {
            font-size: 13px;
          }
        }
        > footer {
          border-top: 1px solid #eee;
          padding-top: 15px;
          margin-top: 20px;
          padding-left: 20px;
          > ul {
            > li {
              padding: 3px 0;
              line-height: 20px;
              label {
                font-size: 13px;
                color: #888;
              }
              &.print-content {
                padding-top: 20px;
                display: flex;
                label {
                  flex: none;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
