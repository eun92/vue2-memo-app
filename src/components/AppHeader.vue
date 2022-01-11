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
        @click="$router.go(-1)"
        v-if="isBtn"
      ></el-button>

      <!-- options -->
      <el-button
        type="primary"
        icon="el-icon-more"
        size="mini"
        circle
        class="btn-option"
        v-if="isBtn"
      ></el-button>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      isBtn: true,
    }
  },
  watch: {
    $route() {
      this.visibleBtnPrev(this.$route.path)
    },
  },
  mounted() {
    this.visibleBtnPrev(this.$route.path)
  },
  methods: {
    visibleBtnPrev() {
      if (this.$route.path === "/") {
        this.isBtn = false
        // console.log(path)
        return false
      }

      this.isBtn = true
    },
  },
}
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

  .btn-option {
    margin-left: auto;
  }
}
</style>
