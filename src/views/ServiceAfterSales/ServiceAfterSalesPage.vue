<template>
  <article class="mp-pc-service-after-sales-page-wrap">
    <section>
      <header>
        <ul class="header-content">
          <li>
            <SingleSelector v-model="AfterSalesStatus" :optionList='AfterSalesStatusList' title="售后进度" />
            <!-- <ProductSelector
              :changePropsFunc='setCondition4ServiceAfterSaleList'
              :requestFunc='getServiceAfterSaleList'
              :ClassID='condition4ServiceAfterSaleList.Product.ClassID'
              :TypeID='condition4ServiceAfterSaleList.Product.TypeID'
              :ProductID='condition4ServiceAfterSaleList.Product.ProductID'
              :typeList="[['Product', 'ClassID'],['Product', 'TypeID'],['Product', 'ProductID']]"
            /> -->
            <EpCascader :list="allProductClassify" v-model="EpCascaderProductValue" :showLine="false" />
          </li>
          <li class="second">
          <LineDateSelectorComp
            :changePropsFunc='setCondition4ServiceAfterSaleList'
            :requestFunc='getServiceAfterSaleList'
            :isFull="false"
            :typeList="[['DateType', ''], ['Date', 'First'], ['Date', 'Second']]"
            :dateValue='condition4ServiceAfterSaleList.DateType'
            :initDate='condition4ServiceAfterSaleList.Date'
            :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
            label="申请时间"
            :dateList="dateList"
            dateType="daterange"
          />
            <search-input-comp
              title="关键词"
              placeholder="请输入搜索关键词"
              :typeList="[['KeyWords', '']]"
              :requestFunc="getServiceAfterSaleList"
              :changePropsFunc="setCondition4ServiceAfterSaleList"
              :word="condition4ServiceAfterSaleList.KeyWords"
              @reset="clearCondition4ServiceAfterSaleList"
              :searchWatchKey="ServiceAfterSaleList"
            />
          </li>
        </ul>
      </header>
      <div class="content-wrap" v-if="ServiceAfterSaleList.length">
        <div class="content">
          <div class="table-wrap">

            <el-table stripe border
              :data="ServiceAfterSaleList" style="width: 100%" class="ft-14-table">
              <el-table-column prop="AfterSaleCode" label="服务单号" width="81" show-overflow-tooltip></el-table-column>
              <el-table-column prop="OrderID" label="订单号" width="92" show-overflow-tooltip>
              </el-table-column>
              <el-table-column label="产品名称" width="116" show-overflow-tooltip>
                <span slot-scope="scope">{{ scope.row.ProductName }}</span>
              </el-table-column>
              <el-table-column label="文件内容" show-overflow-tooltip width="116">
                <template slot-scope="scope">{{ scope.row.Content }}</template>
              </el-table-column>
              <el-table-column label="数量/款数" show-overflow-tooltip width="85">
                <template slot-scope="scope">
                  {{ scope.row.ProductAmount }}{{ scope.row.Unit }} {{ scope.row.KindCount }}款
                </template>
              </el-table-column>
              <el-table-column label="尺寸" show-overflow-tooltip width="108">
                <template slot-scope="scope" v-if="scope.row.SizeList.length">{{ scope.row.SizeList | formatListItemSize }}</template>
              </el-table-column>
              <el-table-column label="工艺" show-overflow-tooltip width="128">
                <template slot-scope="scope" v-if="scope.row.CraftList && scope.row.CraftList.length">{{ scope.row.CraftList | formatListItemSize }}</template>
              </el-table-column>
              <el-table-column label="处理结果" show-overflow-tooltip width="107">
                <template slot-scope="scope">{{ getSolutions(scope.row.SolutionTypes) }} </template>
              </el-table-column>
              <el-table-column label="申请时间" width="135" show-overflow-tooltip>
                <template slot-scope="scope"
                >{{scope.row.CreateTime | format2MiddleLangTypeDate }}</template>
              </el-table-column>
              <el-table-column label="售后进度" width="76" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span :class="{
                    'coloraaa': isAccomplish(scope.row.AfterSaleStatus),
                    }">{{getAfterSaleStatusText(scope.row.AfterSaleStatus)}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="155" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div class="operate">
                    <span @click="$router.push( { name: 'serviceAfterSalesDetails', query: {data: JSON.stringify(scope.row)} })">查看</span>
                    <template v-if="scope.row.AfterSaleStatus === 30">
                      <span class="after-sale" v-if="!scope.row.IsEvaluate" @click="estimateClick(scope.row.AfterSaleCode)">售后评价</span>
                      <span class="after-sale" v-else @click="seeEstimateClick(scope.row.AfterSaleCode)">查看评价</span>
                    </template>
                    <span class="view-more" v-if="scope.row.AfterSaleStatus===0" @click="cancelAfterSale(scope.row.AfterSaleCode)">取消服务单</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>

          </div>
          <div class="content-footer">
            <Count
              :watchPage='condition4ServiceAfterSaleList.Page'
              :handlePageChange='handlePageChange'
              :count='ServiceAfterSaleListNumber'
              :pageSize='12'
              class="float"
            />
              <!-- :DownLoadConfigObj='DownLoadConfigObj' -->
          </div>
          <transition name="el-fade-in-linear">
            <div class="content-footer floating" v-show="isFootFixed">
              <div>
                <Count
                  :watchPage='condition4ServiceAfterSaleList.Page'
                  :handlePageChange='handlePageChange'
                  :count='ServiceAfterSaleListNumber'
                  :pageSize='12'
                  class="float"
                />
                  <!-- :DownLoadConfigObj='DownLoadConfigObj' -->
              </div>
            </div>
          </transition>
        </div>
      </div>
      <div v-else class="show-empty-bg">
        <img src="../../assets/images/order-empty.png" alt="">
        <p>{{showDateText}}
          <router-link tag="span" :to="{path: '/placeOrder'}">
            去下单<i class="el-icon-arrow-right"></i>
          </router-link>
        </p>
        <!-- <p class="is-gray"></p> -->
      </div>

      <!-- 售后评价 -->
      <EstimateDialogComp
      :AfterSaleCode='AfterSaleCode'
      :visible='estimateVisible'
      @closed="estimateClosed"
      @submit="estimateSubmit"></EstimateDialogComp>
      <!-- 查看售后评价 -->
      <SeeEstimateDialogComp
      :AfterSaleCode='AfterSaleCode'
      :visible='seeEstimateVisible'
      @closed="seeEstimateVisible = false"
      @submit="seeEstimateVisible = false"></SeeEstimateDialogComp>

    </section>
  </article>
</template>

<script>
import {
  mapState, mapGetters, mapMutations, mapActions,
} from 'vuex';
import Count from '@/components/common/Count.vue';
import LineDateSelectorComp from '@/components/common/Selector/LineDateSelectorComp.vue';
import SearchInputComp from '@/components/common/Selector/SearchInputComp.vue';
import EstimateDialogComp from '@/components/common/EstimateDialogComp/EstimateDialogComp.vue';
import SeeEstimateDialogComp from '@/components/common/EstimateDialogComp/SeeEstimateDialogComp.vue';
// import ProductSelector from '@/components/common/Selector/ProductSelectorIndex.vue';
import SingleSelector from '@/components/common/Selector/SingleSelector.vue';
import CommonClassType from '../../store/CommonClassType';
import EpCascader from '../../packages/EpCascader/index.vue';

export default {
  components: {
    Count,
    LineDateSelectorComp,
    SearchInputComp,
    EstimateDialogComp,
    SeeEstimateDialogComp,
    // ProductSelector,
    SingleSelector,
    EpCascader,
  },
  computed: {
    ...mapState('common', ['ScrollInfo']),
    ...mapState('summary', ['condition4ServiceAfterSaleList', 'ServiceAfterSaleList', 'ServiceAfterSaleListNumber']),
    ...mapGetters('Quotation', ['allProductClassify']),
    EpCascaderProductValue: { // :typeList="[['Product', 'ClassID'],['Product', 'TypeID'],['Product', 'ProductID']]"
      get() {
        const list = [
          this.condition4ServiceAfterSaleList.Product.ClassID,
          this.condition4ServiceAfterSaleList.Product.TypeID,
          this.condition4ServiceAfterSaleList.Product.ProductID,
        ];
        return list.filter(it => it || it === 0);
      },
      set(ids) {
        const [_First, _Second, _ProductID] = ids;
        const First = _First || _First === 0 ? _First : '';
        const Second = _Second || _Second === 0 ? _Second : '';
        const ProductID = _ProductID || _ProductID === 0 ? _ProductID : '';
        this.setCondition4ServiceAfterSaleList([['Product', 'ClassID'], First]);
        this.setCondition4ServiceAfterSaleList([['Product', 'TypeID'], Second]);
        this.setCondition4ServiceAfterSaleList([['Product', 'ProductID'], ProductID]);
        this.getServiceAfterSaleList();
      },
    },
    scrollChange() {
      return this.ScrollInfo.scrollTop + this.ScrollInfo.scrollHeight + this.ScrollInfo.offsetHeight;
    },
    UserDefinedTimeIsActive() {
      return this.condition4ServiceAfterSaleList.DateType === ''
          && !!this.condition4ServiceAfterSaleList.Date.First
          && !!this.condition4ServiceAfterSaleList.Date.Second;
    },
    condition() {
      if (!this.condition4ServiceAfterSaleList) return {};
      let _t = JSON.parse(JSON.stringify(this.condition4ServiceAfterSaleList));
      CommonClassType.setDate(_t);
      _t = CommonClassType.filter(_t);
      if (_t.Date) {
        _t.CreateTime = _t.Date;
        delete _t.Date;
      }
      return _t;
    },
    // DownLoadConfigObj() { // 不需要导出功能了
    //   return {
    //     condition: this.condition,
    //     count: this.ServiceAfterSaleListNumber,
    //     fileDefaultName: '名片之家售后单',
    //     fileDate: this.condition4ServiceAfterSaleList.Date,
    //     downFunc: data => this.api.getServiceListData2Excel(data),
    //   };
    // },
    showDateText() {
      if (this.condition4ServiceAfterSaleList && this.condition4ServiceAfterSaleList.DateType !== 'all') {
        if (this.condition4ServiceAfterSaleList.DateType) {
          const t = this.dateList.find(it => it.value === this.condition4ServiceAfterSaleList.DateType);
          if (t) return `${t.label}暂无售后单信息`;
          return '当前暂无售后单信息';
        }
        if (this.condition4ServiceAfterSaleList.Date.First && this.condition4ServiceAfterSaleList.Date.Second) {
          return '所选期间暂无售后单信息';
        }
        return '当前暂无售后单信息';
      }
      return '当前暂无售后单信息';
    },
    AfterSalesStatus: {
      get() {
        return this.condition4ServiceAfterSaleList.Status;
      },
      set(newVal) {
        this.$store.commit('summary/setCondition4ServiceAfterSaleList', [['Status', ''], newVal]);
        this.$store.dispatch('summary/getServiceAfterSaleList');
      },
    },
  },
  data() {
    return {
      seeEstimateVisible: false,
      estimateVisible: false,
      AfterSaleCode: null,

      form: {
        name: 0,
        region: '',
      },
      h: 0,
      isFootFixed: false,
      // AfterSalesStatus: '',
      AfterSalesStatusList: [
        { label: '不限', value: null },
        { label: '待处理', value: '0' },
        { label: '处理中', value: 10 },
        { label: '退款中', value: 20 },
        { label: '处理完成', value: 30 },
        { label: '已驳回', value: 40 },
        { label: '已取消', value: 255 },
      ],
      // eslint-disable-next-line max-len
      dateList: [{ label: '近七天', value: 'last7Date' }, { label: '今天', value: 'today' }, { label: '昨天', value: 'yesterday' }, { label: '本月', value: 'curMonth' }, { label: '上月', value: 'lastMonth' }],
    };
  },
  methods: {
    ...mapMutations('summary', ['setCondition4ServiceAfterSaleList', 'clearCondition4ServiceAfterSaleList']),
    ...mapActions('summary', ['getServiceAfterSaleList']),
    getSolutions(SolutionTypes) {
      let str = '';
      SolutionTypes.forEach((element, index) => {
        if (index) {
          str += '，';
        }
        if (element === 2) {
          str += '退款';
        }
        if (element === 7) {
          str += '补印';
        }
        if (element === 8) {
          str += '赠送优惠券';
        }
        if (element === 255) {
          str += '其他';
        }
      });
      return str;
    },
    getAfterSaleStatusText(status) {
      let str = '';
      switch (status) {
        case 0:
          str = '待处理';
          break;
        case 10:
          str = '处理中';
          break;
        case 20:
          str = '退款中';
          break;
        case 30:
          str = '处理完成';
          break;
        case 40:
          str = '已驳回';
          break;
        case 255:
          str = '已取消';
          break;
        default:
          break;
      }
      return str;
    },
    isAccomplish(status) {
      let bool = false;
      switch (status) {
        case 30:
          bool = '处理完成';
          break;
        case 40:
          bool = '已驳回';
          break;
        case 255:
          bool = '已取消';
          break;
        default:
          break;
      }
      return bool;
    },
    handlePageChange(page) {
      this.$store.dispatch('summary/getServiceAfterSaleList', page);
    },
    handleScroll(oEl) {
      if (!oEl) return;
      const { scrollTop, scrollHeight, offsetHeight } = oEl;
      this.$store.commit('common/setScrollInfo', { scrollTop, scrollHeight, offsetHeight });
    },
    onOpen() {},
    problemType() {},
    // 售后评价
    estimateClick(AfterSaleCode) {
      this.estimateVisible = true;
      this.AfterSaleCode = AfterSaleCode;
    },
    // 售后评价弹窗关闭
    estimateClosed() {
      this.estimateVisible = false;
      this.AfterSaleCode = null;
    },
    estimateSubmit(data) {
      this.api.getOrderAfterSaleEvaluate(data).then(res => {
        if (res.data.Status === 1000) {
          this.$store.dispatch('summary/getServiceAfterSaleList', this.condition4ServiceAfterSaleList.Page);
        }
      });
      this.estimateVisible = false;
      this.AfterSaleCode = null;
    },
    // 查看评价
    seeEstimateClick(AfterSaleCode) {
      this.seeEstimateVisible = true;
      this.AfterSaleCode = AfterSaleCode;
    },
    cancelAfterSale(code) {
      // this.messageBox
      this.messageBox.warnCancelBox({
        msg: '您确定取消本次申请吗？',
        title: '操作确认',
        successFunc: () => {
          // 发送取消请求
          this.api.getCancleApply(code).then(res => {
            if (res.data.Status === 1000) {
              this.$store.dispatch('summary/getServiceAfterSaleList', this.condition4ServiceAfterSaleList.Page);
            }
          });
        },
      });
    },
  },
  watch: {
    ServiceAfterSaleList() {
      this.$nextTick(() => {
        this.handleScroll(this.oApp);
      });
    },
    scrollChange() {
      const { scrollTop, scrollHeight, offsetHeight } = this.ScrollInfo;
      const difference = scrollHeight - offsetHeight;
      if (difference - 175 - scrollTop > 0) this.isFootFixed = true;
      else this.isFootFixed = false;
    },
  },
  mounted() {
    this.$store.dispatch('summary/getServiceAfterSaleList', this.condition4ServiceAfterSaleList.Page);
    this.oApp = document.getElementById('app');
    this.$nextTick(() => {
      this.handleScroll(this.oApp);
    });
  },
};
</script>

<style lang='scss'>
.mp-pc-service-after-sales-page-wrap {

  width: 100%;
  // background-color: #fff;
  margin-bottom: 17px;
  // min-height: calc(100vh - 135px - 180px);
  > section {
    width: 100%;
    header{
      margin-bottom: 22px;
      background-color: #fff;
      .header-content {
        margin: 0 auto;
        width: 1200px;
        padding: 25px 0 0px;
        border-top: 1px dashed #eee;
        > li {
          .is-bold{
            margin: 0;
          }
          > section {
            vertical-align: top;
          }
          > .mp-pc-order-product-select-wrap {
            vertical-align: top;
            padding-top: 1px;
            padding-left: 12px;
          }
          &.second {
            padding-top: 28px;
            .mp-line-date-selector-wrap > .box {
              width: 600px;
              &::after {
                display: none;
              }
            }
            .mp-common-comps-search-box {
              vertical-align: 25px;
              margin-left: 64px;
              // margin-right: -10px;
            }
          }
        }
      }
    }
    > .content-wrap {
      width: 100%;
      background-color: #fff;
      min-height: calc(100vh - 135px - 170px - 38px);
      > .content {
        margin: 0 auto;
        width: 1200px;
        padding-top: 25px;
        > .table-wrap {
          min-height: calc(100vh - 457px);
          // > .table{
          //   >.column{
          //     display: inline-block;
          //     border: 1px solid #efefef;
          //     border-right: none;
          //     text-align: center;
          //     .lable{
          //       background-color: #efefef;
          //       padding: 10px;
          //     }
          //     .content{
          //       line-height: 32px;
          //       padding: 0 5px;
          //     }
          //   }
          // }
          .el-table{
            .coloraaa{
              color: #AAAAAA;
            }
            .operate{
              color: #428DFA;
              text-align: left;
              >span{
                cursor: pointer;
              }
              span:nth-child(1){
                margin-right: 20px;
              }
              span:nth-child(1):active{
                color: #26BCF9;
              }
              >.after-sale{
                color: #FEB829;
                cursor:pointer
              }
              >.disabled{
                color: #aaa;
                cursor:not-allowed
              }
              .el-divider{
                margin: 0 10px;
              }
            }
          }
          // >.el-table .has-gutter > tr > th.is-leaf::after{
          //   width: 0;
          // }
        }
        > .content-footer {
          margin-top: 19px;
          height: 55px;
          &.floating {
            position: fixed;
            bottom: 0;
            left: 0;
            background-color: #fff;
            z-index: 10;
            padding-top: 10px;
            right: 0px;
            height: 55px;
            box-shadow: 0px 0px 14px 7px rgba(136, 136, 136, 0.3);
            > div {
              width: 1200px;
              margin: 0 auto;
              position: relative;
              left: -8px;
            }
          }
        }
      }
    }
    > .show-empty-bg {
      background-color: rgb(245, 245, 245);
      text-align: center;
      min-height: calc(100vh - 135px - 158px);
      text-align: center;
      padding-top: 118px\0;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #989898;
      > p {
        margin-top: 15px;
        span{
          color: #428dfa;
          margin-left: 20px;
          i{
            margin-left: -1px;
          }
        }
        span:hover{
          cursor: pointer;
        }
      }
      > img {
        height: 266px;
        width: 545px;
        user-select: none;
      }
    }
  }
}
</style>
