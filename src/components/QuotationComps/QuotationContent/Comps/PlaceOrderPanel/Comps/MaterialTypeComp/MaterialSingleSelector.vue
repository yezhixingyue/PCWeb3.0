<template>
  <div v-if="list && list.length > 0" class="mp-place-order-panel-material-select-single-select-comp-wrap">
    <CanFreeCreateSelectComp v-show="!(list.length===1&&hiddenOption)" v-if="list"
     :DisabledOptionList='DisabledOptionList' :options='list' v-model="val" :filterable='false'/>
    <MaterialSingleSelector :list='nextList' :key="val" @input="handleInput" />
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
      val: '',
    };
  },
  computed: {
    nextList() {
      if (!this.val || !this.list) return null;
      const t = this.list.find(it => it.ID === this.val);
      return t && t.children ? t.children : null;
    },
    DisabledOptionList() {
      return this.list.filter(it => it.disabled).map(it => it.ID);
    },
  },
  methods: {
    handleInput(e) {
      this.$emit('input', e);
    },
  },
  mounted() {
    if (this.list && this.list.length > 0) {
      const t = this.list.find(it => !it.disabled);
      if (t) this.val = t.ID;
    }
  },
  watch: {
    val(newVal) {
      if (newVal && !this.nextList) {
        this.$emit('input', newVal);
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-place-order-panel-material-select-single-select-comp-wrap {
  display: inline-block;
}
</style>
