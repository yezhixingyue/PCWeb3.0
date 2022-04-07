<template>
  <ul class="display-box mp-order-detail-item-comp-wrap" :class="{border: showBorder}">
    <li>
      <span class="label" :class="{part:ShowData.Type==='Part', product: ShowData.Type==='product'}">{{ShowData.Type==='product'?'产品名称：':' '}}</span>
      <div class="text is-font-14" :class="{'is-bold': ShowData.Type==='product'}">{{ShowData.Name}}</div>
    </li>
    <li v-for="(item, lv1Index) in localContentList" :key="item.Label + item.Content + lv1Index">
      <span class="label" :class="{'opacity-0': item.Label.includes('-notFirst')}">{{item.Label.replace('-notFirst', '')}}{{item.Label ? '：' : ''}}</span>
      <div class="text">
        <span v-if="typeof item.Content === 'string'">{{item.Content}}</span>
        <ul v-else>
          <li v-for="(it, lv2Index) in item.Content" :key="(it.Name || it) + lv2Index">
            <span v-if="typeof it === 'string'">{{it}}</span>
            <div v-else-if="item.type==='CraftList'" class="craft-wrap">
              <span>{{it.Name}}</span>
              <ul v-if="Array.isArray(it.Content)" class="craft-content-list">
                <li v-for="(minItem, minIndex) in it.Content" :key="minItem + minIndex">
                  <span v-if="minItem.Label">{{minItem.Label}}</span>
                  <span v-if="minItem.Content && minItem.type === 'GroupList'"> [ {{minItem.Content}} ]</span>
                  <span v-else-if="minItem.Content"> {{minItem.Content}}</span>
                </li>
              </ul>
              <span class="is-gray" v-else-if="it.Content">（{{it.Content}}）</span>
            </div>
          </li>
        </ul>
      </div>
    </li>
    <li v-if="localContentList.length === 0">
      <span class="label">参数：</span>
      <div class="text">无</div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'OrderDetailDisplayItem',
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
        &::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          background: #F4A307;
          border-radius: 50%;
          margin-right: 5px;
          position: relative;
          top: -1px;
        }
      }
      &.opacity-0 {
        opacity: 0;
      }
    }
    > div.text {
      color: #585858;
      font-size: 12px;
      overflow: hidden;
      min-height: 22px;
      > ul {
        > li {
          > div {
            white-space: normal;
          }
        }
        // margin-bottom: -5px;
      }
    }
  }
  .craft-wrap {
    white-space: nowrap;
    .craft-content-list {
      display: inline-block;
      vertical-align: top;
      margin-left: 7px;
      color: #989898;
      line-height: 18px;
      padding-top: 2px;
      white-space: nowrap;
      li {
        white-space: normal;
        margin-bottom: 0 !important;
      }
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
