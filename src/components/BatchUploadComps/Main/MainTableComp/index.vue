<template>
  <section class="mp-c-batch-upload-page-main-table-comp-wrap">
    <el-table
      ref="multipleTable"
      :data="list"
      border
      stripe
      style="width: 100%"
      :checkAllDisabled='handleCheckAllDisabled'
      @selection-change="handleSelectionChange">

      <el-table-column type="selection" width="55" class-name='check-item' :selectable='handleSelectable'></el-table-column>

      <el-table-column show-overflow-tooltip label="产品" min-width="180" class-name='name-item'>
        <span slot-scope="scope" class="is-font-size-12">{{ scope.row.result | formatProductName }}</span>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="数量规格" min-width="180">
        <template slot-scope="scope" class="">
          <template>{{ scope.row.result | formatProductAmount }} </template>
          <template>{{ scope.row.result | formatProductSize }} </template>
          <template>{{ scope.row.result | formatCraftShowContent }}</template>
        </template>
      </el-table-column>

      <el-table-column label="印刷内容" min-width="120" show-overflow-tooltip class-name='is-gray'>
        <template slot-scope="scope">{{ scope.row.result.Content || '' }}</template>
      </el-table-column>

      <el-table-column label="平台单号" width="200" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.result.OutPlate ? (scope.row.result.OutPlate.Second || '') : ''}}</template>
      </el-table-column>

      <el-table-column label="价格" width="140" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.result.CurrentCost | formatCurrentCost }}</template>
      </el-table-column>

      <el-table-column label="操作" min-width="280" label-class-name='operation'>
        <template slot-scope="scope">
          <ItemOperationComp :itemData='scope.row' @upload='handleItemUpload' @detail='handleDetailClick' @remove='handleItemRemove' />
        </template>
      </el-table-column>
      <div slot="empty">
        <p class="content">请点击右上角 <i class="is-bold is-font-14">[ 选择文件 ]</i> 按钮选择文件进行解析并上传</p>
        <p class="remark">注：1、文件名称需携带订单信息且符合指定格式（ 下单页面计算价格后会生成符合格式的订单信息 ）；</p>
        <p class="remark two">2、选择文件后会覆盖上次已选择文件，请在当次选择完全部需要上传的订单文件</p>
        <p class="remark two is-pink">3、IE9及IE9以下版本浏览器不支持使用，请升级浏览器</p>
      </div>
    </el-table>
    <ProductDetailDrawer v-model="drawer" :curDetailData='curDetailData' />
  </section>
</template>

<script>
// import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import ItemOperationComp from './ItemOperationComp.vue';
import ProductDetailDrawer from './ProductDetailDrawer.vue';

export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    multipleSelection: {
      type: Array,
      default: () => [],
    },
    checkAllDisabled: {
      type: Boolean,
      default: false,
    },
  },
  // mixins: [tableMixin],
  components: {
    ItemOperationComp,
    ProductDetailDrawer,
  },
  filters: {
    formatProductName(result) { // 产品名称
      if (result && result.ProductParams && result.ProductParams.Attributes) {
        const { ClassList, DisplayName } = result.ProductParams.Attributes;
        if (DisplayName) {
          if (ClassList && ClassList.length > 0) {
            const t = ClassList.find(it => it.Type === 1);
            if (t) {
              const { FirstLevel, SecondLevel } = t;
              // eslint-disable-next-line no-unused-vars
              const f = FirstLevel && FirstLevel.Name ? `${FirstLevel.Name}-` : '';
              const s = SecondLevel && SecondLevel.Name ? `${SecondLevel.Name}-` : '';
              // return `${f}${s}${DisplayName}`;
              return `${s}${DisplayName}`;
            }
          }
          return DisplayName;
        }
      }
      return '';
    },
    formatProductSize(result) { // 数量规格
      if (result && result.ProductParams) {
        const { Size } = result.ProductParams;
        const s = Size && Size.DisplayContent ? Size.DisplayContent : '';
        return s;
      }
      return '';
    },
    formatProductAmount(result) { // 数量规格
      if (result && result.ProductParams) {
        const { Attributes } = result.ProductParams;
        const {
          Unit, ProductAmount, KindCount, HaveNumber, HaveKind,
        } = Attributes || {};

        const n = Attributes ? `${HaveNumber ? `${ProductAmount}${Unit || '个'}` : ''}${HaveKind ? `${KindCount}款` : ''}` : '';
        return n;
      }
      return '';
    },
    formatCraftShowContent(result) { // 工艺名称
      if (result && result.ProductParams) {
        const { CraftList, PartList } = result.ProductParams;
        if (CraftList || PartList) {
          const _CraftList = CraftList || [];
          const _PartList = PartList || [];
          const arr = [];
          _CraftList.forEach(it => {
            if (it.Attributes) arr.push(it.Attributes.DisplayName);
          });
          if (Array.isArray(_PartList) && _PartList.length > 0) {
            _PartList.forEach(_it => {
              _it.List.forEach(_it2 => {
                if (_it2.CraftList) {
                  _it2.CraftList.forEach(_it3 => {
                    if (_it3.Attributes) arr.push(_it3.Attributes.DisplayName);
                  });
                }
              });
            });
          }
          return [...new Set(arr.filter(it => it))].join('，');
        }
      }
      return '';
    },
    formatCurrentCost(cost) { // 价格
      if (cost || cost === 0) {
        return `￥${(+cost).toFixed(2)}元`;
      }
      return '';
    },
  },
  data() {
    return {
      drawer: false,
      curDetailData: null,
    };
  },
  methods: {
    handleSelectionChange(val) { // 复选框点选事件
      this.$emit('multipleSelect', val);
    },
    // setHeight() { // 设置表格高度
    //   let d = 320;
    //   const gap = 21;
    //   let oHeader = this.oHeaderDom;
    //   if (!oHeader) {
    //     oHeader = document.querySelector('.mp-c-batch-upload-page-wrap > header');
    //     this.oHeaderDom = oHeader;
    //   }
    //   if (oHeader) {
    //     let oWorkbench = this.oWorkbenchDom;
    //     if (!oWorkbench) {
    //       oWorkbench = document.querySelector('.mp-c-batch-upload-page-wrap > main > .workbench');
    //       this.oWorkbenchDom = oWorkbench;
    //     }
    //     if (oWorkbench) {
    //       let oFooter = this.oFooterDom;
    //       if (!oFooter) {
    //         oFooter = document.querySelector('.mp-c-batch-upload-page-wrap > main > .workbench');
    //         this.oFooterDom = oFooter;
    //       }
    //       if (oFooter) {
    //         d = oHeader.offsetHeight + oWorkbench.offsetHeight + oFooter.offsetHeight;
    //       }
    //     }
    //   }
    //   const tempHeight = this.getHeight('', d + gap, '');
    //   this.h = tempHeight;
    // },
    handleItemUpload(item) {
      this.$emit('itemUpload', item);
    },
    handleDetailClick(item) {
      if (!item) return;
      this.curDetailData = item;
      this.drawer = true;
    },
    handleItemRemove(item) {
      this.$emit('itemRemove', item);
    },
    handleSelectable(data) { // 判断当前行是否可以被勾选
      if (data.orderStatus === 'success' || !data.result.HavePrice) return false;
      return true;
    },
    handleCheckAllDisabled() {
      return this.checkAllDisabled;
    },
  },
};
</script>
<style lang='scss'>
.mp-c-batch-upload-page-main-table-comp-wrap {
  padding: 0;
  > .el-table {
    .el-table__header-wrapper {
      .el-table__header {
        height: 36px;
        tr {
          th {
            font-size: 14px;
            .cell.operation {
              text-align: right;
              padding-right: 89px !important;
            }
            &.name-item {
              text-align: left;
              padding-left: 50px;
            }
          }
        }
      }
    }
    .el-table__body-wrapper {
      min-height: 450px;
      .el-table__body {
        > tbody {
          > tr {
            > td {
              color: #585858;
              padding: 14px 0;
              &.check-item .cell{
                padding: 0 10px;
              }
              &.name-item {
                text-align: left;
              }
              &.is-gray .cell{
                color: #989898;
              }
            }
          }
        }
      }
      .el-table__empty-text {
        line-height: 30px;
        padding: 50px 20px;
        width: 800px;
        padding-top: 70px;
        color: #989898;
        .remark {
          width: 560px;
          margin: 0 auto;
          text-align: left;
          &.two {
            text-indent: 2em;
          }
          &.is-pink {
            display: none;
            display: block\9;
          }
        }
        .content {
          color: #585858;
          padding-bottom: 20px;
        }
      }
    }
  }
}
</style>
