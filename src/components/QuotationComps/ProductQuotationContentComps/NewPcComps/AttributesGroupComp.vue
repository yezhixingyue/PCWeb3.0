<!--
 * @Describe: 属性值组件
 * @FilePath: /src/components/QuotationComps/ProductQuotationContentComps/NewPcComps/AttributesGroupComp.vue
-->

<template>
  <article
    class="mp-duotation-content-comps-attribute-group-wrap"
    v-if="PropertyGroupList.length > 0"
  >
    <section
      v-for="(PropertyGroup, index1) in PropertyGroupList"
      :key="PropertyGroup.GroupID"
      :class="PropertyGroup.PropertyList.length === 0 ? 'none-item':''"
    >
      <header>
        <span class="title is-bold is-black">{{ PropertyGroup.GroupName }}：</span>
        <span
         class="is-font-12 span-title-blue"
         v-if="PropertyGroup.PropertyList.length === 0"
         @click="addPropertyGroup(index1, PropertyGroup)"
         >+ 添加{{ PropertyGroup.GroupName }}</span>
      </header>
      <ul class="content">
        <li
          class="set-border van-hairline--bottom dashed-style"
          v-for="(Property, index2) in PropertyGroup.PropertyList"
          :key="index2"
        >
          <attributes-comp
            :value="Property.Second"
            :showGroupMenu='PropertyGroup.AllowCustomized'
            :partID='partID'
            :MinUsageCount='PropertyGroup.MinUsageCount'
            :MaxUsageCount='PropertyGroup.MaxUsageCount'
            :curUsageCount='PropertyGroup.PropertyList.length'
            @change="data => handlePropertyChange(data, index1, index2)"
            :showGroupAdd='index2 === PropertyGroup.PropertyList.length - 1'
            @handleGroupAdd='addPropertyGroup(index1, PropertyGroup)'
            @handleGroupDel='handleAttributeDel(index1, index2,
             PropertyGroup.PropertyList.length, PropertyGroup.MinUsageCount)'
          />
        </li>
      </ul>
    </section>
  </article>
</template>

<script>
import AttributesComp from '@/components/QuotationComps/ProductQuotationContentComps/NewPcComps/AttributesComp.vue';
// import { Toast } from 'vant';

export default {
  components: {
    AttributesComp,
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    partID: {},
  },
  computed: {
    PropertyGroupList: {
      get() {
        return this.value;
      },
    },
  },
  data() {
    return {
      propertyGroupTemplateList: [],
    };
  },
  methods: {
    handlePropertyChange([value, index3, type], index1, index2) {
      this.$emit('change', [[value, index3, type], index1, index2]);
    },
    addPropertyGroup(index1) {
      const _item = this.propertyGroupTemplateList[index1];
      this.$emit('addPropertyGroup', [index1, _item]);
    },
    handleAttributeDel(index1, index2, len, MinUsageCount) {
      if (len > MinUsageCount) this.$emit('delPropertyGroup', [index1, index2]);
    },
  },
  mounted() {
    const _list = this.value.filter(it => it.PropertyList.length > 0)
      .map(it => JSON.parse(JSON.stringify(it.PropertyList[0])));
    this.propertyGroupTemplateList = _list;
    this.value.forEach((it, i) => {
      if (it.MinUsageCount === 0) this.handleAttributeDel(i, 0, 1, 0);
    });
  },
};
</script>

<style lang="scss">
.mp-duotation-content-comps-attribute-group-wrap {
  // margin-bottom: 5px;
  & > section {
    > header {
      margin-top: 26px;
      margin-bottom: 13px;
    }
    > ul {
      > li {
        > section {
          display: inline-block;
          .mp-pc-quotation-sm-comp-single-att-comp-wrap {
            margin-bottom: 8px;
          }
          > article {
            > section {
              display: inline-block;
              margin-right: 50px;
            }
          }
        }
        .icon-shanchu {
          cursor: pointer;
          > i {
            margin-left: 8px;
          }
          & + span {
            margin-left: 16px;
            font-size: 13px;
          }
        }
      }
    }
    & + section {
      > header {
        margin-top: 8px;
      }
    }
    &.none-item {
      & + section {
        > header {
          margin-top: 18px;
          margin-bottom: 20px;
        }
      }
      &:last-of-type {
        > header {
          margin-bottom: 20px;
        }
      }
    }
  }
}
</style>
