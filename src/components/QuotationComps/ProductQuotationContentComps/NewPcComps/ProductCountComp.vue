<template>
  <div class="mp-pc-quotation-product-count-comp-wrap">
    <span class="title gray">{{title}}：</span>
    <el-dropdown trigger="click" @command='onCommand' placement='bottom' v-if="option.length > 0">
      <el-input v-model="inpValue" :placeholder="placeholder" @focus='onFocus' suffix-icon="el-icon-caret-bottom" >
      </el-input>
      <el-dropdown-menu slot="dropdown" class="count-model-comp-dropdown-wrap">
        <el-dropdown-item :class="+item.text === +inpValue ? 'active' : ''"
         v-for="item in option" :key='item.value' :command='item'>{{item.text}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-input v-else v-model="inpValue" :placeholder="placeholder" @focus='onFocus' ></el-input>
    <span class="gray remark">{{remark}}</span>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'changeFunc',
  },
  props: {
    value: {
      required: true,
    },
    remark: {
      type: String,
      default: '张',
    },
    option: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '数量',
    },
  },
  computed: {
    inpValue: {
      get() {
        return this.value;
      },
      set(newVal) {
        const _val = newVal.replace(/[^\d]/g, '');
        this.$emit('changeFunc', _val);
      },
    },
    placeholder() {
      return `请输入${this.title}`;
    },
    showIcon() {
      if (this.option.length > 0) return true;
      return false;
    },
  },
  methods: {
    onCommand(e) {
      const newVal = e.value;
      this.$emit('changeFunc', newVal);
    },
    onFocus(e) {
      e.target.select();
    },
  },
};
</script>

<style lang='scss'>
.mp-pc-quotation-product-count-comp-wrap {
  .el-input {
    width: unset;
    .el-input__icon {
      line-height: 30px;
    }
  }
}
.count-model-comp-dropdown-wrap {
  width: 155px;
  max-height: 360px;
  overflow-y: auto;
  .el-dropdown-menu__item.active {
    font-weight: 700;
    color: #428dfa;
    background-color: rgb(245, 247, 250);
  }
  @media screen and (max-height: 700px) {
    max-height: 260px;
  }
  @media screen and (max-height: 540px) {
    max-height: 200px;
  }
  @media screen and (max-height: 450px) {
    max-height: 135px;
  }
}
</style>
