<!--
 * @Describe:
 * @FilePath: /src/components/QuotationComps/ProductQuotationContentComps/NewPcComps/AttributesComp.vue
-->

<template>
  <section
    class="mp-duotation-content-comps-attribute-wrap"
    v-if="value.length > 0"
  >
    <article class="attribute-list" :class="1 ? 'singular' : ''">
      <SingleAttributeComp
        v-for="(item, i) in value"
        :key="item.PropertyID"
        :title="item.PropertyName"
        :PropertyID="item.PropertyID"
        :partID='partID'
        :RelevanceInformation="item.RelevanceInformation"
        :watch2Dia="watch2Dia"
        :remark="
          item.ValueType === 2
            ? ''
            : item.UserDefinedUnit
            ? item.UserDefinedUnit
            : utils.getUnit(item.Unit)
        "
        :value="item.CustomerInputValue"
        :CustomizedOptionValue="item.CustomizedOptionValue"
        @changeFunc="data => changeFunc(data, i)"
        :AllowUserDefinedOption="item.AllowUserDefinedOption"
        :option="item.OptionList"
        :defaultProps="{ text: 'Value', value: 'OptionID' }"
        :ValueType="item.ValueType"
        :disabled="item.AllowCustomized === false"
        :isCraftUse='isCraftUse'
      />
      <section class="edit-box" v-if="showDel">
        <div class="add" @click="handleAttributeAdd">
          <i class="iconfont icon-zengjia is-primary-blue"></i>
          <span class="menu-item-sm">增加一处</span>
        </div>
        <div class="del" @click="handleAttributeDel">
          <i class="iconfont icon-shanchu is-pink"></i>
          <span class="menu-item-sm">删除</span>
        </div>
      </section>
      <section class="group-menu-box" v-if="showGroupMenu">
        <span @click="handleGroupDel" class="iconfont icon-shanchu is-pink" >
          <i class="menu-item-sm is-font-13">删除</i>
        </span>
        <span class="is-font-13 span-title-blue"
         v-show="showGroupAdd && curUsageCount < MaxUsageCount" @click="handleGroupAdd"
         >+ 添加
        </span>
      </section>
    </article>
  </section>
</template>

<script>
import SingleAttributeComp from './SingleAttributeComp.vue';

export default {
  components: {
    SingleAttributeComp,
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    /**
     * 由每个属性数据组成的数组
     */
    value: {
      type: Array,
      default: () => [],
    },
    showDel: {
      type: Boolean,
      default: false,
    },
    partID: {},
    /**
     * 工艺使用，其为工艺弹窗开闭状态
     */
    watch2Dia: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否由工艺组件调用
     */
    isCraftUse: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否展示属性组删除增加控制按钮
     */
    showGroupMenu: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否展示属性组删除增加控制按钮中的增加按钮
     */
    showGroupAdd: {
      type: Boolean,
      default: false,
    },
    MinUsageCount: { // 最小使用次数
      type: Number,
    },
    MaxUsageCount: { // 最大使用次数
      type: Number,
    },
    curUsageCount: { // 当前已使用次数
      type: Number,
    },
  },
  methods: {
    handleChange([data, type], index) {
      // console.log('handleChangehandleChangehandleChange*-----', data, type);
      this.$emit('change', [data, index, type]);
    },
    handleAttributeDel() {
      this.$emit('handleDel');
    },
    handleAttributeAdd() {
      this.$emit('addCraft');
    },
    changeFunc(data, i) {
      this.handleChange(data, i);
    },
    handleGroupAdd() {
      this.$emit('handleGroupAdd');
    },
    handleGroupDel() {
      this.$emit('handleGroupDel');
    },
  },
};
</script>

<style lang="scss">
.mp-duotation-content-comps-attribute-wrap {
  > article {
    > section {
      height: 30px;
      line-height: 30px;
      margin-bottom: 22px;
      &.edit-box {
        margin-left: 25px;
        > div {
          display: inline-block;
          & + div {
            margin-left: 25px;
          }
          > i {
            margin-right: 8px;
            vertical-align: bottom;
          }
        }
      }
      &.group-menu-box {
        margin-bottom: 8px;
        margin-right: 0;
        float: right;
        &::before {
          content: '';
          clear: both;
          display: block;
        }
      }
    }
  }
}
</style>
