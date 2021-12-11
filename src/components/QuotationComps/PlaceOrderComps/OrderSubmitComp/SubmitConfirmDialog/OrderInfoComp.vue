<template>
  <PanelItemComp title="订单信息" class="order" v-if="orderInfo || OrderDetail">
    <template #img>
      <img src="@/assets/images/order-info.png" alt="" />
    </template>
    <ul class="display-box">
      <template v-if="OrderDetail">
        <li v-if="!isCar">
          <span class="label">订单编号：</span>
          <div class="text">{{ OrderDetail.OrderID }}</div>
        </li>
        <li v-if="!isCar">
          <span class="label">订单状态：</span>
          <div
            class="text"
            :class="{
              'is-pink': OrderDetail.Status === 10,
              'is-success': OrderDetail.Status === 200,
              'is-cancel': [254, 255].includes(OrderDetail.Status),
              'is-origin': [10, 200, 254, 255].includes(OrderDetail.Status),
            }"
          >
            {{ OrderDetail.Status | formatStatus }}
          </div>
        </li>
      </template>
      <template v-if="FileListForCarDetail.length > 0">
        <li v-for="fileItem in FileListForCarDetail" :key="fileItem.ID" class='single-row'>
          <span class="label">{{fileItem.Name}}：</span>
           <!-- <el-tooltip effect="dark" :content="fileItem.FileContent" placement="top-start" :enterable='false' transition='none'>
             <div slot="content" class="mp-place-order-panel-comp-order-submit-comfirm-dialog-comp-is-car-detail-order-info-file-list-dialog-wrap-content">
               <p v-for="(file, fileIndex) in fileItem.List" :key="file.UniqueName">{{fileItem.List.length > 1 ? `${fileIndex + 1}、` : ''}}{{file.FileName}}</p>
             </div>
            <div class="text">{{ fileItem.FileContent }}</div>
          </el-tooltip> -->
          <div class="text" :title="fileItem.title">{{ fileItem.FileContent }}</div>
        </li>
      </template>
      <li v-if="FileCount">
        <span class="label">订单文件：</span>
        <div class="text">
          <template v-if="FileCount && FileCount !== '0'">
            共选择 <i class="is-pink">{{ FileCount }}</i> 个文件
          </template>
          <template v-else>无</template>
        </div>
      </li>
      <li>
        <span class="label">文件内容：</span>
        <div
          class="text"
          :style="`min-height:${isCar || orderInfo ? '80' : '40'}px;color:#888`"
        >
          {{ FileContent }}
        </div>
      </li>
      <li v-if="Weight">
        <span class="label">货品重量：</span>
        <div class="text">{{ Weight }}kg</div>
      </li>
      <li v-if="!isCar && OrderDetail">
        <span class="label">下单时间：</span>
        <div class="text">
          {{ OrderDetail.CreateTime | format2MiddleLangTypeDate }}
        </div>
      </li>
      <li v-if="!hiddenProducePeriod">
        <span class="label">交货工期：</span>
        <div class="text is-pink" v-if="ProducePeriod">
          {{ ProducePeriod | getPayTime }} {{ ProducePeriod | getDoneTime }}
        </div>
        <div class="text is-gray" v-else>{{ "暂无工期" }}</div>
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
    OrderDetail: {
      type: Object,
      default: null,
    },
    isCar: {
      type: Boolean,
      default: false,
    },
    hiddenProducePeriod: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    PanelItemComp,
  },
  computed: {
    FileCount() {
      // 订单文件数量
      if (this.orderInfo) return `${this.orderInfo.FileCount}`;
      // if (
      //   this.OrderDetail
      //   && (!this.OrderDetail.FileList || this.OrderDetail.FileList.length === 0)
      // ) { return '0'; }
      return '';
    },
    FileContent() {
      // 文件内容
      if (this.orderInfo) return this.orderInfo.FileContent || '无';
      if (this.OrderDetail && this.OrderDetail.Content) { return this.OrderDetail.Content; }
      return '无';
    },
    ProducePeriod() {
      return this.orderInfo
        ? this.orderInfo.ProducePeriod
        : this.OrderDetail.ProducePeriod;
    },
    Weight() {
      return this.orderInfo
        ? this.orderInfo.Weight
        : this.OrderDetail.Weight;
    },
    FileListForCarDetail() {
      if (this.isCar && this.OrderDetail && this.OrderDetail.FileList && this.OrderDetail.FileList.length > 0) {
        return this.OrderDetail.FileList
          .filter(it => it.List && it.List.length > 0)
          .map(it => ({
            ...it,
            FileContent: it.List.length > 1 ? `共选择${it.List.length}个文件` : it.List.map(_it => _it.FileName).join('、'),
            title: it.List.map((_it, i) => `${it.List.length > 1 ? `${i + 1}、` : ''}${_it.FileName}`).join('\r\n'),
          }));
      }
      return [];
    },
  },
};
</script>
<style lang='scss'>
.mp-place-order-panel-comp-order-submit-comfirm-dialog-comp-is-car-detail-order-info-file-list-dialog-wrap-content {
  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
