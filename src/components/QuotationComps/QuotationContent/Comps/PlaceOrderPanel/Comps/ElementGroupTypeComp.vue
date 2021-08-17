<template>
  <section class="mp-place-order-panel-element-group-setup-comp-wrap">
    <div><span class="blue-span" v-show="List.length === 0" @click="onAddClick">+ 添加</span></div>
    <ul>
      <li v-for="(item, index) in List" :key="item.key" :class="{f: index === 0}">
        <ElementTypeComp v-for="(it, i) in Property.ElementList" :key="it.ID" :Property='it' v-model="item.List[i].CustomerInputValues" />
          <div class="ctrl">
            <div @click="onDelClick(index)" v-show="List.length > minLength">
              <i class="iconfont icon-shanchu is-pink"></i>
              <span>删除</span>
            </div>
            <span class="blue-span" @click="onAddClick" v-show="index === List.length - 1 && List.length < maxLength">+ 添加</span>
          </div>
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
  },
  data() {
    return {
      List: [],
    };
  },
  methods: {
    onAddClick() {
      const temp = {
        List: this.Property.ElementList.map(it => ({ ElementID: it.ID, CustomerInputValues: { ID: '', Name: '', Value: '' } })),
        key: Math.random().toString(36).slice(-10),
      };
      this.List.push(temp);
    },
    onDelClick(index) {
      this.List.splice(index, 1);
    },
  },
  mounted() {
    for (let i = 0; i < this.minLength; i += 1) {
      this.onAddClick();
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
        > div {
          display: inline-block;
          margin-right: 24px;
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
