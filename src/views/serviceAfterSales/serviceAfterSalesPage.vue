<template>
  <article class="mp-pc-service-after-sales-page-wrap">
    <section>
      <header>
        <div class="header-content">
          <LineDateSelectorComp
          :changePropsFunc='setCondition4ServiceAfterSaleList'
          :requestFunc='getServiceAfterSaleList'
          :isFull="false"
          :typeList="[['DateType', ''], ['Date', 'First'], ['Date', 'Second']]"
          :dateValue='condition4ServiceAfterSaleList.DateType'
          :initDate='condition4ServiceAfterSaleList.Date'
          :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
          label="售后时间"
          :dateList="dateList"
          dateType="date"
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
        <LookOverAfterSale></LookOverAfterSale>
        </div>
      </header>
      <div class="content-wrap">
        <div class="content">
          <div class="table-wrap">

            <!-- <ul class="table">
              <li class="column" width="300px">
                <div class="lable">订单编号</div>
                <div class="content">内容</div>
              </li>
              <li class="column">
                <div class="lable">下单时间</div>
                <div class="content">内容</div>
              </li>
              <li class="column">
                <div class="lable">订单状态</div>
                <div class="content">内容内容</div>
              </li>
              <li class="column">
                <div class="lable">商品名称</div>
                <div class="content">内容</div>
              </li>
              <li class="column">
                <div class="lable">文件内容</div>
                <div class="content">内容</div>
              </li>
              <li class="column">
                <div class="lable">物料</div>
                <div class="content">内容</div>
              </li>
              <li class="column">
                <div class="lable">款数</div>
                <div class="content">内容</div>
              </li>
              <li class="column">
                <div class="lable">数量</div>
                <div class="content">内容</div>
              </li>
              <li class="column">
                <div class="lable">尺寸</div>
                <div class="content">内容</div>
              </li>
              <li class="column">
                <div class="lable">工艺</div>
                <div class="content">内容</div>
              </li>
              <li class="column">
                <div class="lable">操作</div>
                <div class="content">内容</div>
              </li>
            </ul> -->

            <el-table stripe border
              :data="ServiceAfterSaleList" style="width: 100%" class="ft-14-table">
              <el-table-column prop="ID" label="售后服务单号" width="197" show-overflow-tooltip></el-table-column>
              <el-table-column prop="Order.OrderID" label="订单编号" width="171" show-overflow-tooltip>
              </el-table-column>
              <el-table-column label="商品名称" width="171" show-overflow-tooltip>
                <span slot-scope="scope">{{ scope.row.Order | getFullName }}</span>
              </el-table-column>
              <el-table-column label="文件内容" show-overflow-tooltip width="171">
                <template slot-scope="scope">{{ scope.row.Order.Funds.FinalPrice }}元</template>
              </el-table-column>
              <el-table-column label="申请时间" width="171" show-overflow-tooltip>
                <template slot-scope="scope"
                >{{scope.row.Solution && scope.row.Solution.Type ? getSolutionType(scope.row.Solution.Type) : ''}}</template>
              </el-table-column>
              <el-table-column label="售后进度" width="171" show-overflow-tooltip>
                <template slot-scope="scope">
                  <i>{{scope.row.Solution.Type === 2 ? scope.row.Solution.Refund + '元' : ''}}</i>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="146" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>查看</span>
                  <el-divider direction="vertical"></el-divider>
                  <span>售后评价</span>
                  <i v-if="scope.row.Solution.Type===2 && scope.row.Solution.RefundFreight > 0">{{scope.row.Solution.RefundFreight}}元</i>
                </template>
              </el-table-column>

            </el-table>

            <div class="null-data">
              <img src="" alt="">
              <div class="null-data-right">
                最近没下过订单哦
                <router-link to="/serviceAfterSalesDetails">
                  <el-button>去首页看看</el-button>
                </router-link>
              </div>
            </div>
          </div>
          <div class="content-footer">
            <Count
              :watchPage='condition4ServiceAfterSaleList.Page'
              :handlePageChange='handlePageChange'
              :count='ServiceAfterSaleListNumber'
              :DownLoadConfigObj='DownLoadConfigObj'
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
                  :DownLoadConfigObj='DownLoadConfigObj'
                  :pageSize='12'
                  class="float"
                />
              </div>
            </div>
          </transition>
        </div>
      </div>
      <!-- <div class="show-empty-bg" v-else>
        <img src="../../assets/images/order-empty.png" alt="">
        <p class="is-gray">{{showDateText}}</p>
      </div> -->
    </section>
  </article>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import Count from '@/components/common/Count.vue';
import LineDateSelectorComp from '@/components/common/Selector/LineDateSelectorComp.vue';
import LookOverAfterSale from '@/components/ServiceAfterSales/LookOverAfterSale.vue';
import SearchInputComp from '@/components/common/Selector/SearchInputComp.vue';
import CommonClassType from '../../store/CommonClassType';

export default {
  components: {
    Count,
    LineDateSelectorComp,
    LookOverAfterSale,
    SearchInputComp,
  },
  computed: {
    ...mapState('common', ['ScrollInfo']),
    ...mapState('summary', ['condition4ServiceAfterSaleList', 'ServiceAfterSaleList', 'ServiceAfterSaleListNumber']),
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
    DownLoadConfigObj() {
      return {
        condition: this.condition,
        count: this.ServiceAfterSaleListNumber,
        fileDefaultName: '名片之家售后单',
        fileDate: this.condition4ServiceAfterSaleList.Date,
        downFunc: data => this.api.getServiceListData2Excel(data),
      };
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
  },
  data() {
    return {
      h: 0,
      isFootFixed: false,
      // eslint-disable-next-line max-len
      dateList: [{ label: '全部', value: 'all' }, { label: '今天', value: 'today' }, { label: '昨天', value: 'yesterday' }, { label: '本月', value: 'curMonth' }, { label: '上月', value: 'lastMonth' }],
    };
  },
  methods: {
    ...mapMutations('summary', ['setCondition4ServiceAfterSaleList', 'clearCondition4ServiceAfterSaleList']),
    ...mapActions('summary', ['getServiceAfterSaleList']),
    handlePageChange(page) {
      this.$store.dispatch('summary/getServiceAfterSaleList', page);
    },
    handleScroll(oEl) {
      if (!oEl) return;
      const { scrollTop, scrollHeight, offsetHeight } = oEl;
      this.$store.commit('common/setScrollInfo', { scrollTop, scrollHeight, offsetHeight });
    },
    getSolutionType(Type) {
      if (Type === 2) return '减款';
      if (Type === 7) return '补印';
      if (Type === 8) return '赠送优惠券';
      return '';
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
    this.$store.dispatch('summary/getServiceAfterSaleList');
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
    > header {
      width: 100%;
      background-color: #fff;
      .header-content{
        display: flex;
        // align-items: center;
        .mp-line-date-selector-wrap{
          flex: 1;
          min-width: 650px;
          .box{
            width: 550px;
          }
        }
      }
      > div {
        margin: 0 auto;
        width: 1200px;
        padding: 35px 0 0px 0;
        border-top: 1px dashed #eee;
      }
      margin-bottom: 22px;
    }
    > .content-wrap {
      width: 100%;
      background-color: #fff;
      min-height: calc(100vh - 135px - 45px - 116px);
      > .content {
        margin: 0 auto;
        width: 1200px;
        padding-top: 25px;
        > .table-wrap {
          min-height: calc(100vh - 374px);
          > .table{
            >.column{
              display: inline-block;
              border: 1px solid #efefef;
              border-right: none;
              text-align: center;
              .lable{
                background-color: #efefef;
                padding: 10px;
              }
              .content{
                line-height: 32px;
                padding: 0 5px;
              }
            }
          }
          >.null-data{
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 50px;
            >img{
              width: 200px;
              height: 200px;
              background-color: #efefef;
              margin-right: 30px;
            }
            .null-data-right{
              display: flex;
              flex-direction: column;
              justify-content: center;
              .el-button{
                margin-top: 20px;
              }
            }
          }
          >.el-table .has-gutter > tr > th.is-leaf::after{
            width: 0;
          }
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
      > p {
        margin-top: 15px;
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
