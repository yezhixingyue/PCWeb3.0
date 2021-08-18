<template>
  <section class="mp-place-order-panel-element-group-setup-comp-wrap">
    <div><span class="blue-span" v-show="List.length === 0" @click="onAddClick">+ 添加</span></div>
    <ul>
      <li v-for="(item, index) in List" :key="item.key" :class="{f: index === 0}">
        <ElementTypeComp v-for="(it, i) in Property.ElementList" :key="it.ID" :needInit='needInit' :Property='it' v-model="item.List[i].CustomerInputValues" />
          <ul class="ctrl">
            <li class="f">
              <div @click="onDelClick(index)" v-show="List.length > minLength">
                <i class="iconfont icon-shanchu is-pink"></i>
                <span>删除</span>
              </div>
            </li>
            <li>
              <span class="blue-span" @click="onAddClick" v-show="index === List.length - 1 && List.length < maxLength">+ 添加</span>
            </li>
          </ul>
      </li>
    </ul>
  </section>
</template>

<script>
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
    needInit: {
      type: Boolean,
      default: true,
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
      const temp = {
        List: this.Property.ElementList.map(it => ({ ElementID: it.ID, CustomerInputValues: [{ ID: '', Name: '', Value: '' }] })),
        key: Math.random().toString(36).slice(-10),
      };
      this.List = [...this.List, temp];
    },
    onDelClick(index) {
      this.List = this.List.filter((it, i) => i !== index);
    },
  },
  mounted() {
    // 应限定条件 编辑时不需要下面操作
    if (this.needInit) {
      for (let i = 0; i < this.minLength; i += 1) {
        this.onAddClick();
      }
    }
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
        > li {
          display: inline-block;
          width: 45px;
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
            width: 52px;
            margin-right: 24px;
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
