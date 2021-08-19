<template>
  <section class="mp-place-order-panel-element-group-setup-comp-wrap">
    <div>
      <span class="blue-span" v-show="List.length === 0" @click="onAddClick"
        >+ 添加</span
      >
    </div>
    <ul>
      <li
        v-for="(item, index) in List"
        :key="item.key"
        :class="{ f: index === 0 }"
      >
        <ElementTypeComp
          v-for="(it) in Property.ElementList"
          :key="it.ID"
          :needInit="needInit"
          :Property="it"
          :value="getItemValue(index, it)"
          @input="onItemValueChange(index, it, $event)"
        />
        <ul class="ctrl" :class="{fillWidth:fillWidth}">
          <li class="f" >
            <div @click="onDelClick(index)" v-show="List.length > minLength">
              <i class="iconfont icon-shanchu is-pink"></i>
              <span>删除</span>
            </div>
          </li>
          <li v-show="fillWidth || (index === List.length - 1 && List.length < maxLength)">
            <span
              class="blue-span"
              @click="onAddClick"
              v-show="index === List.length - 1 && List.length < maxLength"
              >+ 添加</span
            >
          </li>
        </ul>
      </li>
    </ul>
  </section>
</template>

<script>
import QuotationClassType from '@/store/Quotation/QuotationClassType';
import ElementTypeComp from './ElementTypeComp';

export default {
  props: {
    Property: {
      type: Object,
      required: true,
    },
    value: {
      type: Array,
      default: () => [],
    },
    needInit: { // 弃用 不再需要从组件这里初始化部分数据
      type: Boolean,
      default: true,
    },
    fillWidth: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ElementTypeComp,
  },
  computed: {
    maxLength() {
      if (!this.Property || !this.Property.UseTimes) return Infinity;
      const { MaxValue } = this.Property.UseTimes;
      return MaxValue || Infinity;
    },
    minLength() {
      if (!this.Property || !this.Property.UseTimes) return 1;
      const { MinValue } = this.Property.UseTimes;
      return MinValue || MinValue === 0 ? MinValue : 1;
    },
    List: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  data() {
    return {
      // List: [],
    };
  },
  methods: {
    onAddClick() {
      const temp = QuotationClassType.getGroupItemSubmitData(this.Property, true);
      this.List = [...this.List, temp];
    },
    onDelClick(index) {
      this.List = this.List.filter((it, i) => i !== index);
    },
    onItemValueChange(lv1Index, it, value) {
      const temp = JSON.parse(JSON.stringify(this.value));
      const t = temp[lv1Index].List.find(_it => _it.ElementID === it.ID);
      if (t) t.CustomerInputValues = value;
      this.List = temp;
    },
    getItemValue(index, it) {
      const t = this.List[index].List.find(_it => _it.ElementID === it.ID);
      return t ? t.CustomerInputValues : {};
    },
  },
  mounted() {
    // 应限定条件 编辑时不需要下面操作
    // if (this.needInit) {
    //   for (let i = 0; i < this.minLength; i += 1) {
    //     this.onAddClick();
    //   }
    // }
  },
};
</script>
<style lang='scss'>
.mp-place-order-panel-element-group-setup-comp-wrap {
  > ul {
    > li {
      > .ctrl {
        display: inline-block;
        margin-left: 25px;
        &.fillWidth {
          width: 120px;
        }
        > li {
          display: inline-block;
          // width: 45px;
          > div {
            display: inline-block;
            cursor: pointer;
            > span {
              color: #aaa;
              margin-left: 9px;
              user-select: none;
              transition: color 0.1s ease-in-out;
            }
            > i {
              position: relative;
              top: -1px;
            }
            &:hover {
              > span {
                color: #585858;
              }
            }
          }
          &.f {
            > div {
              padding-right: 24px;
            }
          }
        }
      }
      margin-top: 10px;
      &.f {
        margin-top: 0;
      }
    }
  }
  > div {
    margin-left: 6px;
  }
}
</style>
