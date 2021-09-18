<template>
  <PanelItemComp title="订单信息" class="order" v-if="orderInfo">
    <template #img>
      <img src="@/assets/images/order-info.png" alt="">
    </template>
    <ul>
      <li>
        <span class="label">平台单号：</span>
        <div class="text">{{orderInfo.OutPlateNo || '无'}}</div>
      </li>
      <li>
        <span class="label">订单文件：</span>
        <div class="text">
          共选择 <i class="is-pink">{{orderInfo.FileCount}}</i> 个文件
        </div>
      </li>
      <li>
        <span class="label">文件内容：</span>
        <div class="text" style="min-height:80px;color:#888">{{orderInfo.FileContent || ''}}</div>
      </li>
      <li>
        <span class="label">交货工期：</span>
        <div class="text is-pink" v-if="orderInfo.ProducePeriod">{{orderInfo.ProducePeriod}}</div>
        <div class="text is-gray" v-else>{{'暂无工期'}}</div>
      </li>
    </ul>
  </PanelItemComp>
</template>

<script>
import PanelItemComp from './PanelItemComp.vue';

export default {
  props: {
    orderInfo: {
      type: Object,
      default: null,
    },
  },
  components: {
    PanelItemComp,
  },
};
</script>
<style lang='scss'>
</style>
