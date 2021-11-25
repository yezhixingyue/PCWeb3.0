<template>
  <ul class="display-box mp-order-detail-item-comp-wrap" :class="{border: showBorder}">
    <li>
      <span class="label" :class="{part:ShowData.Type==='Part', product: ShowData.Type==='product'}">{{ShowData.Type==='product'?'产品名称':'部件'}}：</span>
      <div class="text is-font-14" :class="{'is-bold': ShowData.Type==='product'}">{{ShowData.Name}}</div>
    </li>
    <li v-for="(item) in localContentList" :key="item.Label + item.Content">
      <span class="label">{{item.Label}}{{item.Label ? '：' : ''}}</span>
      <div class="text">
        <span v-if="typeof item.Content === 'string'">{{item.Content}}</span>
        <ul v-else>
          <li v-for="it in item.Content" :key="it.Name || it">
            <span v-if="typeof it === 'string'">{{it}}</span>
            <div v-else-if="item.type==='CraftList'">
              <span>{{it.Name}}</span>
              <span class="is-gray" v-if="it.Content">（{{it.Content}}）</span>
            </div>
          </li>
        </ul>
      </div>
    </li>
    <li v-if="localContentList.length === 0">
      <span class="label">参数：</span>
      <div class="text">未设置</div>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    ShowData: {
      type: Object,
      default: () => ({}),
    },
    showBorder: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    localContentList() {
      if (this.ShowData && Array.isArray(this.ShowData.ContentList)) {
        return this.ShowData.ContentList.filter(it => it.Content && it.Content.length > 0);
      }
      return [];
    },
  },
};
</script>
<style lang='scss'>
.mp-order-detail-item-comp-wrap {
  > li {
    width: 100%;
    margin-top: 8px;
    line-height: 22px;
    > span.label {
      color: #888;
      float: left;
      margin-right: 2px;
      &.part {
        position: relative;
        padding-left: 13px;
        &::before {
          content: '';
          position: absolute;
          width: 6px;
          height: 6px;
          background: #F4A307;
          border-radius: 50%;
          left: 0;
          top: 8px;
        }
      }
    }
    > div.text {
      color: #585858;
      font-size: 12px;
      overflow: hidden;
      min-height: 22px;
    }
  }
  &.border {
    margin-top: 20px;
    padding-top: 10px;
    position: relative;
    &::before {
      content: '';
      width: 280px;
      position: absolute;
      height: 1px;
      border-top: 1px dashed #eee;
      top: 0;
      left: 0;
    }
  }
}
</style>
