<template>
  <div class="mp-common-comps-express-select-box-comp-wrap">
    <span class="title">{{title}}：</span>
    <el-radio-group :value="Express.First" @input="onRadioChange" :disabled='disabled'>
      <el-radio v-for="(it) in localExpressList" :key="it.Type" :label="it.Type" :disabled="disabled || it.disabled">
        <span v-if="it.Type === 1" style="margin-right: 18px">{{it.List[0].Name}}</span>
        <el-select
          v-else
          size="mini"
          :popper-append-to-body='false'
          :disabled="disabled || it.disabled"
          v-model="it.optionVal"
          @visible-change="onVisibleChange(it)"
          @change="onOptionChange"
        >
          <el-option
            v-for="item in it.List"
            :key="item.ID"
            :label="item.Name"
            :value="item.ID"
            :disabled="ExpressValidList && !ExpressValidList.includes(item.ID)"
          >
          </el-option>
        </el-select>
      </el-radio>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '配送方式',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    ExpressList: {
      type: Array,
      default: () => [],
    },
    ExpressValidList: { // 有效配送方式id列表  如果有则启用 如果不传(默认为null)则不启用
      type: Array,
      default: null,
    },
    value: {
      type: Object,
      default: () => ({
        First: '',
        Second: '',
      }),
    },
    initial: { // 是否需要初始化数值
      type: Boolean,
      default: false,
    },
    hiddenMpzj: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      optionsVals: [],
      localExpressList: [],
      isChangeSelf: false,
    };
  },
  computed: {
    Express: {
      get() {
        return this.value;
      },
      set(val) {
        this.isChangeSelf = true;
        this.$emit('input', val);
        const f = this.localExpressList.find(it => it.Type === val.First);
        if (f) {
          const s = f.List.find(_it => _it.ID === val.Second);
          if (s) {
            this.$emit('change', s);
            return;
          }
        }
        this.$emit('change', null);
      },
    },
  },
  methods: {
    onRadioChange(First) {
      let Second = '';
      const t = this.localExpressList.find(it => it.Type === First);
      if (t && (!this.ExpressValidList || this.ExpressValidList.includes(t.optionVal))) {
        Second = t.optionVal;
      }
      this.Express = { First, Second };
    },
    onVisibleChange({ Type, optionVal }) {
      if (this.Express.First === Type) return;
      this.Express = { First: Type, Second: optionVal };
    },
    onOptionChange(Second) {
      this.Express = { ...this.Express, Second };
    },
    initialValue(bool) { // 1 如果有值且禁用时 bool为true则进行更改 反之则仅清除 默认仅清除  2 如果无值 则 自动选中可以使用的值 -- 后面有需要时可以修改规则
      const f = this.localExpressList.find(it => it.Type === this.Express.First);
      if (f) {
        if (f.disabled || (this.ExpressValidList && !this.ExpressValidList.includes(this.Express.Second))) {
          this.Express = { First: '', Second: '' };
          if (!bool) return;
        }
      }
      if (this.Express.First === '' && this.Express.Second === '') {
        const _f = this.localExpressList.find(it => !it.disabled);
        if (_f) {
          const _s = _f.List.find(_it => !this.ExpressValidList || this.ExpressValidList.includes(_it.ID));
          if (_s) {
            this.Express = { First: _f.Type, Second: _s.ID };
          }
        }
      }
    },
    setLocalExpressList(val) {
      const _list = val || [];
      this.localExpressList = _list.map(it => {
        if (this.hiddenMpzj && it.Type === 1) return null;
        const t = it.List.find(_it => !this.ExpressValidList || this.ExpressValidList.includes(_it.ID));
        const optionVal = t ? t.ID : '';
        const temp = {
          ...it,
          optionVal,
          disabled: !t,
        };
        return temp;
      }).filter(it => it);
    },
  },
  watch: {
    ExpressList: {
      handler(val) {
        this.setLocalExpressList(val);
        if (this.initial) { // 初始化值
          this.$nextTick(() => {
            this.initialValue();
          });
        }
      },
      immediate: true,
    },
    ExpressValidList(val) {
      if (val) {
        this.setLocalExpressList(this.ExpressList);
        this.initialValue();
      }
    },
    Express: {
      handler() {
        if (this.isChangeSelf) {
          this.isChangeSelf = false;
          return;
        }
        if (!this.Express) return;
        const t = this.localExpressList.find(it => it.Type === this.Express.First);
        if (t && (!this.ExpressValidList || this.ExpressValidList.includes(this.Express.Second))) {
          if (t.optionVal !== this.Express.Second) t.optionVal = this.Express.Second;
        } else if (this.Express.First !== '') {
          this.Express = { First: '', Second: '' };
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
<style lang='scss'>
.mp-common-comps-express-select-box-comp-wrap {
  > .title {
    margin-right: 6px;
    vertical-align: -1px;
  }
  .el-input {
    width: 118px;
    .el-input__inner {
      height: 26px;
      line-height: 22px\0;
      padding-right: 25px;
      padding-left: 12px;
      font-size: 12px;
    }
  }
  .el-radio {
    .el-radio__label {
      color: #585858;
      font-size: 13px;
    }
    .is-cancel {
      color: #bbb !important;
    }
  }
}
</style>
