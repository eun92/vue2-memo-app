<template>
  <header class="header">
    <div class="header__inner">
      <!-- prev -->
      <el-button
        type="primary"
        icon="el-icon-arrow-left"
        size="mini"
        circle
        class="btn-prev"
      ></el-button>

      <!-- options -->
      <el-button
        type="primary"
        icon="el-icon-more"
        size="mini"
        circle
      ></el-button>
    </div>
  </header>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: $headerHeight;
  background: #f5f5f5;

  &__inner {
    @include flexbox($jc: between);
    height: 100%;
    padding: rem(5) rem(15);
  }

  .el-button {
    font-size: rem(20);
  }

  .btn-prev {
    transform: translateX(0);
    transition: 0.2s;

    &:hover,
    &:focus {
      background: transparent;
      color: inherit;
    }

    &:hover {
      transform: translateX(-3px);
    }
  }
}
</style>
