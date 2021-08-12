<template>
  <article class="mp-pc-unpay-list-page-wrap">
    <section v-if="unpayDataList.length > 0 || unpayDataNumber > 0">
      <UnpayListTable />
    </section>
    <div class="show-empty-bg" v-else>
      <img src="../../assets/images/order-empty.png" alt="">
      <p class="is-gray">当前暂无未付款单，快去下单吧...</p>
    </div>
  </article>
</template>

<script>
import { mapState } from 'vuex';
import UnpayListTable from '@/components/UnpayListComps/UnpayListTable.vue';

export default {
  components: {
    UnpayListTable,
  },
  computed: {
    ...mapState('unpayList', ['unpayDataList', 'unpayDataNumber']),
  },
  mounted() {
    this.$store.dispatch('unpayList/getUnpayList');
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
