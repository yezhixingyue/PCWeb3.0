<template>
  <article class="mp-pc-service-after-sales-page-wrap">
    <section>
      <header>
        <ul class="header-content">
          <li class="first">
            <LineDateSelectorComp
              :changePropsFunc='setCondition4ServiceAfterSaleList'
              :requestFunc='getServiceAfterSaleList'
              :isFull="false"
              :typeList="[['DateType', ''], ['Date', 'First'], ['Date', 'Second']]"
              :dateValue='condition4ServiceAfterSaleList.DateType'
              :initDate='condition4ServiceAfterSaleList.Date'
              :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
              label="申请时间"
              minDate="2022-01-01 00:00:00"
              :dateList="dateList"
              dateType="daterange"
            />
            <!-- <SingleSelector v-model="AfterSalesStatus" :optionList='AfterSalesStatusList' title="售后进度" /> -->
            <EpCascader :list="allProductClassify" v-model="EpCascaderProductValue" :showLine="false" />
          </li>
          <li class="second">
            <div class="schedule">
              <span>售后进度：</span>
              <el-tabs
                v-model="AfterSalesStatus"
              >
                <el-tab-pane v-for="it in AfterSalesStatusList" :key="it.value" :label="it.label" :name="`${it.value}`">
                </el-tab-pane>
              </el-tabs>
            </div>
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
              <el-table-column prop="AfterSaleCode" label="售后单号" minWidth="70" show-overflow-tooltip></el-table-column>
              <el-table-column prop="OrderID" label="订单号" minWidth="88" show-overflow-tooltip>
              </el-table-column>
              <el-table-column label="产品" minWidth="101" show-overflow-tooltip>
                <span slot-scope="scope">{{ scope.row.ProductName }}</span>
              </el-table-column>
              <el-table-column label="金额" show-overflow-tooltip minWidth="60">
                <template slot-scope="scope">{{ scope.row.OrderProductPrice }}</template>
              </el-table-column>
              <el-table-column label="运费" show-overflow-tooltip minWidth="35">
                <template slot-scope="scope">{{ scope.row.OrderFreight }}</template>
              </el-table-column>
              <el-table-column label="诉求" show-overflow-tooltip minWidth="116">
                <template slot-scope="scope">{{ scope.row.AppealContent || '-' }}</template>
              </el-table-column>
              <el-table-column label="申请时间" show-overflow-tooltip minWidth="100">
                <template slot-scope="scope">{{ scope.row.CreateTime | format2MiddleLangTypeDate}}</template>
              </el-table-column>
              <el-table-column label="申请渠道" show-overflow-tooltip minWidth="64">
                <template slot-scope="scope">
                  {{ AfterSaleChannel.find(it => it.ID === scope.row.AfterSaleChannel) ?
                  AfterSaleChannel.find(it => it.ID === scope.row.AfterSaleChannel).name : ''}}
                </template>
              </el-table-column>
              <el-table-column label="处理结果" show-overflow-tooltip minWidth="137">
                <template slot-scope="scope">
                  <template v-if="scope.row.Status === 30">
                    <template v-if="scope.row.IsReject">
                      <span style="color: #52c41a;">未发现问题</span>
                    </template>
                    <template v-else>
                      <template v-if="scope.row.SolutionResults.length">
                        <template v-if="scope.row.SolutionResults[0]">
                          {{ scope.row.SolutionResults[0] ? scope.row.SolutionResults[0].SolutionContent : '' }}
                          <template v-if="scope.row.SolutionResults[0].CouponContents.length">
                            {{scope.row.CouponIsExtra?'额外':''}}赠送优惠券：
                            {{ scope.row.SolutionResults[0].CouponContents.join('、') }}
                          </template>
                        </template>
                      </template>
                    </template>
                  </template>
                  <template v-else>
                    -
                  </template>
                </template>
              </el-table-column>
              <el-table-column label="额外支付" show-overflow-tooltip minWidth="60">
                <template slot-scope="scope">
                  <el-tooltip v-if="scope.row.ExtraPayAmount" :disabled="!scope.row.ExtraPayRemark" effect="dark"
                  :content="scope.row.ExtraPayRemark" placement="top">
                    <span>{{scope.row.ExtraPayAmount}}元</span>
                  </el-tooltip>
                  <template v-else>
                    -
                  </template>
                </template>
              </el-table-column>
              <el-table-column label="状态" show-overflow-tooltip minWidth="58">
                <template slot-scope="scope">{{ getAfterSaleStatusText(scope.row.Status) }} </template>
              </el-table-column>
              <el-table-column label="处理人" show-overflow-tooltip minWidth="58">
                <template slot-scope="scope">{{ scope.row.Operater }} </template>
              </el-table-column>
              <el-table-column label="最后操作时间" minWidth="100" show-overflow-tooltip>
                <template slot-scope="scope"
                >{{scope.row.OperateTime | format2MiddleLangTypeDate }}</template>
              </el-table-column>
              <el-table-column label="操作" minWidth="65" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div class="operate">
                    <span @click="$router.push( { name: 'serviceAfterSalesDetails', params: {data: JSON.stringify(scope.row)} })">查看详情</span>
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
      </div>
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
import CommonClassType from '../../store/CommonClassType';
import EpCascader from '../../packages/EpCascader/index.vue';

export default {
  components: {
    Count,
    LineDateSelectorComp,
    SearchInputComp,
    EpCascader,
  },
  computed: {
    ...mapState('common', ['ScrollInfo']),
    ...mapState('summary', ['condition4ServiceAfterSaleList', 'ServiceAfterSaleList', 'ServiceAfterSaleListNumber']),
    ...mapGetters('Quotation', ['allProductClassify']),
    EpCascaderProductValue: {
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
      isFootFixed: false,
      // AfterSalesStatus: '',
      AfterSalesStatusList: [
        { label: '不限', value: '-1' },
        { label: '待处理', value: 0 },
        { label: '处理中', value: 10 },
        { label: '已完成', value: 30 },
        { label: '已取消', value: 255 },
      ],
      AfterSaleChannel: [
        { name: '网页端', ID: 0 },
        { name: '移动端', ID: 1 },
        { name: '人工客服', ID: 2 },
      ],
      dateList: [
        { label: '近七天', value: 'last7Date' },
        { label: '今天', value: 'today' },
        { label: '昨天', value: 'yesterday' },
        { label: '本月', value: 'curMonth' },
        { label: '上月', value: 'lastMonth' },
      ],
    };
  },
  methods: {
    ...mapMutations('summary', ['setCondition4ServiceAfterSaleList', 'clearCondition4ServiceAfterSaleList']),
    ...mapActions('summary', ['getServiceAfterSaleList']),

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
        case 25:
          str = '处理中';
          break;
        case 30:
          str = '已完成';
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
    handlePageChange(page) {
      this.$store.dispatch('summary/getServiceAfterSaleList', page);
    },
    handleScroll(oEl) {
      if (!oEl) return;
      const { scrollTop, scrollHeight, offsetHeight } = oEl;
      this.$store.commit('common/setScrollInfo', { scrollTop, scrollHeight, offsetHeight });
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
          &.first {
            display: flex;
            .mp-line-date-selector-wrap{
              min-width: 600px;
            }
            .mp-line-date-selector-wrap > .box {
              width: 500px;
              &::after {
                display: none;
              }
            }
            .mp-common-comps-ep-cascader-comp-wrap{
              margin-top: -10px;
            }
          }
          &.second {
            display: flex;
            justify-content: space-between;
            padding-top: 28px;
            .schedule{
              display: flex;
              >span{
                text-align: right;
                color: #444;
                font-size: 14px;
                font-weight: 700;
                min-width: 5em;
                display: inline-block;
                margin-right: 10px;
              }
              .el-tabs {
                .el-tabs__active-bar {
                  height: 3px;
                }
                display: inline-block;
                > .el-tabs__header {
                  margin: 0;
                  .el-tabs__item {
                    line-height: unset;
                    height: 38px;
                    color: #585858;
                    line-height: 12px\0;
                    &.is-active, &:hover {
                      color: #428DFA;
                    }
                    &.is-active {
                      font-weight: 700;
                    }
                  }
                  .el-tabs__nav-wrap::after {
                    display: none;
                  }
                }
              }
            }
            .mp-common-comps-search-box {
              vertical-align: 25px;
              margin-left: 64px;
              margin-top: -10px;
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
          .el-table{
            .el-table__body-wrapper{
              .el-table__row{
                td{
                  .cell{
                    padding: 0 5px;
                  }
                }
              }
            }
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
