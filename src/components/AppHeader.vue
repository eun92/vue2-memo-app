<template>
  <header
    class="header"
    :style="{
      background: memoColor,
    }"
  >
    <div class="header__inner" v-if="isBtn">
      <!-- prev -->
      <el-button
        type="primary"
        icon="el-icon-arrow-left"
        size="mini"
        circle
        class="btn-prev"
        @click="$router.go(-1)"
      ></el-button>

      <!-- home -->
      <el-button
        type="primary"
        icon="el-icon-s-home"
        size="mini"
        circle
        class="btn-home"
        @click="$router.push('/')"
      ></el-button>

      <!-- options -->
      <el-button
        type="primary"
        icon="el-icon-more"
        size="mini"
        circle
        class="btn-option"
      ></el-button>
    </div>
  </header>
</template>

<script>
import { mapMutations, mapState } from "vuex"

export default {
  data() {
    return {
      isBtn: true,
    }
  },
  computed: {
    ...mapState(["memoColor"]),
  },
  watch: {
    $route() {
      this.visibleBtnPrev(this.$route.path)
    },
  },
  created() {},
  mounted() {
    this.visibleBtnPrev(this.$route.path)
  },
  methods: {
    ...mapMutations(["SET_MEMO_COLOR"]),
    visibleBtnPrev() {
      if (this.$route.path === "/") {
        this.isBtn = false
        // console.log(path)
        return false
      }

      this.SET_MEMO_COLOR() // 메모 컬러 초기화 : 메모 읽기/수정 페이지에서만 변경
      this.isBtn = true
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: $headerHeight;
  background: $bgGray;

  &__inner {
    @include flexbox($jc: between);
    height: 100%;
    padding: rem(5) rem(15);
  }

  .el-button {
    font-size: rem(20);
    transition: 0.2s;
    transform: scale(1);

    &:hover,
    &:focus {
      background: transparent;
      color: inherit;
      transform: scale(1.2);
    }
  }

  .btn-prev {
    transform: scale(1) translateX(0);

    &:hover {
      transform: scale(1.2) translateX(-3px);
    }
  }

  .btn-home {
    margin-left: auto;
  }

  // .btn-option {
  //   margin-left: auto;
  // }
}
</style>
