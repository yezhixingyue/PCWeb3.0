<template>
  <article class="mp-pc-unpay-list-page-wrap">
    <section v-if="unpayDataList.length > 0 || unpayDataNumber > 0">
      <NewUnpayListTable />
    </section>
    <div class="show-empty-bg" v-else>
      <img src="../../assets/images/order-empty.png" alt="">
      <p class="is-gray">当前暂无未付款单，快去下单吧...</p>
    </div>
  </article>
</template>

<script>
import { mapState } from 'vuex';
// import UnpayListTable from '@/components/UnpayListComps/UnpayListTable.vue';
import NewUnpayListTable from '@/components/UnpayListComps/NewUnpayListTable/index.vue';

export default {
  components: {
    NewUnpayListTable,
  },
  computed: {
    ...mapState('unpayList', ['unpayDataList', 'unpayDataNumber']),
  },
  data() {
    return {
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name !== 'unpayOrderDetail') {
        vm.$store.dispatch('unpayList/getUnpayList');
      } else {
        const oApp = document.getElementById('app');
        oApp.scrollTop = to.meta.y;
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    const oApp = document.getElementById('app');
    const self = from;
    if (to.name === 'unpayOrderDetail') {
      self.meta.y = oApp.scrollTop;
    } else {
      self.meta.y = 0;
    }
    next();
  },
};
</script>

<style lang='scss'>
.mp-pc-unpay-list-page-wrap {
  width: 100%;
  background-color: #fff;
  min-height: calc(100vh - 135px - 22px);
  // margin-top: 22px;
  > section {
    margin: 0 auto;
    width: 1200px;
    padding-top: 25px;
    border-top: 1px dashed #eee;
  }
  > .show-empty-bg {
    width: 100%;
    background-color: rgb(245, 245, 245);
    min-height: calc(100vh - 135px - 22px);
    text-align: center;
    padding-top: 180px\0;
    padding-bottom: 20px\0;
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
</style>
