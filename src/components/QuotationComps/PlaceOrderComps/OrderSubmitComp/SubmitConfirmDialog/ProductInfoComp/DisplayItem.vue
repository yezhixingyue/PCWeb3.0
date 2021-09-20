<template>
  <ul class="display-box">
    <li>
      <span class="label" :class="{part:ShowData.Type==='Part', product: ShowData.Type==='product'}">{{ShowData.Type==='product'?'产品名称':'部件'}}：</span>
      <div class="text is-font-14 is-bold">{{ShowData.Name}}</div>
    </li>
    <li v-for="item in localContentList" :key="item.Label + item.Content">
      <span class="label">{{item.Label}}：</span>
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
</style>
