<template>
  <section
    class="mp-quotation-craft-list-comp-wrap"
    v-if="craftList.length > 0"
  >
    <div class="left is-gray">{{ title }}：</div>
    <ul class="right">
      <li v-for="singleCraft of craftList" :key="singleCraft.CraftID">
        <div>{{ singleCraft.CraftNickName }}</div>
        <div
          v-if="
            singleCraft.PropertyList.length > 0 &&
              singleCraft.PropertyList[0].length > 0
          "
          class="is-gray van-ellipsis"
        >
          (<span v-if="singleCraft.PropertyList.length > 1"
            >{{ singleCraft.PropertyList.length }}处</span
          >
          <span
            v-else
            v-for="(it, i) of singleCraft.PropertyList[0]"
            :key="it.PropertyID"
          >
            <i v-if="it.ValueType === 1"
              >{{ it.CustomerInputValue
              }}{{
                it.UserDefinedUnit
                  ? it.UserDefinedUnit
                  : $utils.getUnit(it.Unit)
              }}
              <em v-if="i !== singleCraft.PropertyList[0].length - 1">、</em>
            </i>
            <i v-else-if="it.ValueType === 2">
              {{ geAttrValue(it) }}
              <em v-if="i !== singleCraft.PropertyList[0].length - 1">、</em>
            </i> </span
          >)
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '必选工艺',
    },
    craftList: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    geAttrValue(item) {
      if (item.CustomizedOptionValue) return item.CustomizedOptionValue;
      if (item.CustomerInputValue && item.OptionList.length > 0) {
        const _t = item.OptionList.find(
          _it => _it.OptionID === item.CustomerInputValue,
        );
        return _t.Value;
      }
      return item.CustomerInputValue;
    },
  },
};
</script>

<style lang="scss">
.mp-quotation-craft-list-comp-wrap {
  display: flex;
  > ul {
    margin-top: -10px;
    > li {
      margin: 10px 0;
      display: flex;
      > div:first-of-type {
        flex: none;
        line-height: 15px;
        height: 15px;
      }
      > div + div {
        margin-left: 5px;
        line-height: 15px;
        height: 15px;
        // white-space: nowrap;
        // overflow: hidden;
        // text-overflow: ellipsis;
      }
    }
  }
  > .left {
    line-height: 15px;
    flex: none;
  }
}
</style>
