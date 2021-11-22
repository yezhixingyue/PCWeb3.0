<template>
  <div v-if="list && list.length > 0" class="mp-place-order-panel-material-select-single-select-comp-wrap">
    <CanFreeCreateSelectComp v-show="!(list.length===1&&hiddenOption)" v-if="list" :DisplayWidth='DisplayWidth'
     :DisabledOptionList='DisabledOptionList' :options='list' v-model="val" isMaterial/>
    <MaterialSingleSelector :list='nextList' :key="key" @input="handleInput" :value='value' />
  </div>
</template>

<script>
import CanFreeCreateSelectComp from '../ElementDisplayTypeComps/CanFreeCreateSelectComp.vue';

export default {
  name: 'MaterialSingleSelector',
  props: {
    list: {
      type: Array,
      default: null,
    },
    value: {},
    hiddenOption: {
      type: Boolean,
      default: false,
    },
    disabledMatarialList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CanFreeCreateSelectComp,
  },
  data() {
    return {
      // val: '',
      key: Math.random().toString(36).slice(-8),
    };
  },
  computed: {
    nextList() {
      if (this.list.length === 1 && this.hiddenOption && this.list[0].children && this.list[0].children.length > 0) {
        // console.log(this.list);
        return this.list[0].children;
      }
      if (!this.val || !this.list) return null;
      const t = this.list.find(it => it.ID === this.val);
      return t && t.children ? t.children : null;
    },
    DisabledOptionList() {
      return this.list.filter(it => it.disabled).map(it => it.ID);
    },
    val: {
      get() {
        if (!this.list) return '';
        let t = this.list.find(it => (it.lastList ? it.lastList.map(_it => _it.ID).includes(this.value) : false));
        if (t) return t.ID;
        t = this.list.find(it => it.ID === this.value);
        return t ? t.ID : '';
      },
      set(val) {
        let id = '';
        const t = this.list.find(it => it.ID === val);
        if (t) {
          if (Array.isArray(t.lastList)) {
            const _t = t.lastList.find(_it => !_it.disabled);
            if (_t) id = _t.ID;
          } else {
            id = t.ID;
          }
        }
        this.$emit('input', id);
      },
    },
    DisplayWidth() {
      return 100;
    },
  },
  methods: {
    handleInput(e) {
      this.$emit('input', e);
    },
  },
  mounted() {
    if (this.list && this.list.length > 0) {
      // const t = this.list.find(it => !it.disabled);
      // if (t) this.val = t.ID;
    }
  },
  watch: {
    // val(newVal) {
    //   if (newVal && !this.nextList) {
    //     this.$emit('input', newVal);
    //   }
    // },
  },
};
</script>
<style lang='scss'>
.mp-place-order-panel-material-select-single-select-comp-wrap {
  display: inline-block;
}
</style>
