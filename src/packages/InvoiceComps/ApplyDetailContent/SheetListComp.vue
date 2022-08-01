<template>
  <div class="mp-invoice-item-detail-sheet-list-comp-wrap" v-if="localList.length > 0">
    <p class="blue-v-line is-bold is-black">{{item.title}}</p>
    <div>
      <dl v-for="([f, s], i) in localList" :key="i">
        <dt>{{f.label || ''}}</dt>
        <dd :style="`color:${f.color}`">{{f | formatValue}}</dd>
        <dt>{{s.label || ''}}</dt>
        <dd :style="`color:${s.color}`">{{s | formatValue}}</dd>
      </dl>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  filters: {
    formatValue(it) {
      return it.value || it.value === 0 || !it.label ? (it.value || '') : ' -';
    },
  },
  computed: {
    localList() {
      if (!Array.isArray(this.item.list) || this.item.list.length === 0) {
        return [];
      }
      const list = this.item.list.length % 2 === 0 ? this.item.list : [...this.item.list, {}];
      return list.reduce((result, item) => {
        if (result[result.length - 1].length < 2) {
          result[result.length - 1].push(item);
        } else {
          result.push([item]);
        }
        return result;
      }, [[]]);
    },
  },
};
</script>
<style lang='scss'>
.mp-invoice-item-detail-sheet-list-comp-wrap {
  width: 100%;
  margin-bottom: 30px;
  > div {
    width: 100%;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
    box-sizing: border-box;
    > dl {
      width: 100%;
      display: inline-block;
      vertical-align: top;
      min-height: 57px;
      > dt, > dd {
        display: inline-block;
        vertical-align: top;
        height: 100%;
        padding: 18px 15px;
        line-height: 20px;
        box-sizing: border-box;
        border-left: 1px solid #eee;
        border-top: 1px solid #eee;
        display: table-cell;
        vertical-align: middle;
      }
      > dt {
        width: 161px;
        text-align: center;
        font-size: 14px;
        color: #585858;
        font-weight: 700;
      }
      > dd {
        width: 318.5px;
        // width: calc(50% - 161px);
        padding-left: 22px;
        font-size: 13px;
        color: #989898;
      }
    }
  }
  > p {
    margin-bottom: 20px;
  }
}
</style>
