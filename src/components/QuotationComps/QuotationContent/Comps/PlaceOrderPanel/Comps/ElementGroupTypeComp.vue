<template>
  <section>
    <ElementTypeComp v-for="it in Property.ElementList" :key="it.ID" :Property='it' />
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
};
</script>
<style lang='scss'>
</style>
