<template>
  <section v-if="Property.ElementList">
    <ElementTypeComp v-for="it in Property.ElementList" :key="it.ID" :Property='it' />
  </section>
  <section v-else-if="Property.SizeList">尺寸组类型</section>
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
};
</script>
<style lang='scss'>
</style>
