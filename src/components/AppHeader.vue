<template>
  <header class="header">
    <!-- prev -->
    <button type="button" class="btn-prev">
      <b-icon icon="chevron-left" font-scale="1.5"></b-icon>
    </button>

    <!-- current folder name -->
    <h1 class="title">
      모든 메모
    </h1>

    <!-- settings -->
    <button type="button" class="btn-settings">
      <b-icon icon="three-dots"></b-icon>
    </button>
  </header>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
// $bgGray: #f5f5f5;

.header {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  background: #f5f5f5;
}
</style>
