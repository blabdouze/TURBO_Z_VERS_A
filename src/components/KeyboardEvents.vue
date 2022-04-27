<template>
  <div></div>
</template>
  
<script>
  export default {
    created() {
      const component = this;
      this.handler = function (e) {
        component.$emit('keydown', e);
      }
      window.addEventListener('keydown', this.handler);
    },
    beforeUnmount() {
      window.removeEventListener('keydown', this.handler);
    }
  }
</script>
  
<style lang="css" scoped>
  div {
    display: none;
  }
</style>
