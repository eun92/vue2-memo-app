<template>
  <footer class="footer">
    <div class="footer__inner">
      <!-- create folder -->
      <el-button type="primary" icon="el-icon-folder-add"></el-button>

      <!-- memo cnt -->
      <p class="memo-cnt">총 <span>2</span> 개</p>

      <!-- create memo -->
      <el-button type="primary" icon="el-icon-edit-outline"></el-button>
    </div>
  </footer>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.footer {
  width: 100%;
  height: $footerHeight;
  margin-top: auto;
  background: #f5f5f5;

  &__inner {
    @include flexbox();
    height: 100%;
    padding: rem(5) rem(15);

    .memo-cnt {
      margin: 0 auto;
      font-size: rem(14);
    }
  }

  .el-button {
    font-size: rem(20);
    transform: translateY(0);
    transition: 0.2s;

    &:hover,
    &:focus {
      background: transparent;
      color: inherit;
    }

    &:hover {
      transform: translateY(-3px);
    }
  }
}
</style>
