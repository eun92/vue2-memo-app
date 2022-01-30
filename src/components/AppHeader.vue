<template>
  <header
    class="header"
    :style="{
      background: memoColor,
    }"
  >
    <div class="header__inner">
      <!-- prev -->
      <el-button
        type="primary"
        icon="el-icon-arrow-left"
        size="mini"
        circle
        class="btn-prev"
        v-if="isBtn"
        @click="$router.go(-1)"
      ></el-button>
      <div class="r-btn-group">
        <!-- home -->
        <el-button
          type="primary"
          icon="el-icon-s-home"
          size="mini"
          circle
          class="btn-home"
          v-if="isBtn"
          @click="$router.push('/')"
        ></el-button>

        <!-- select font -->
        <div class="select-font" ref="selectFont">
          <el-button
            type="primary"
            class="btn-font"
            @click="onVisibleSelectFontBox"
            :class="[isSelectFontBox ? 'is-active' : '']"
          >
            <span class="material-icons-round icon"> title </span>
          </el-button>
          <div class="select-font__box" v-if="isSelectFontBox">
            <!--  -->
            <div class="select-font__box-inner">
              <el-radio-group v-model="fontRadio" @change="changeRadio">
                <el-radio-button
                  label="Noto Sans KR"
                  class="noto-sans-kr"
                ></el-radio-button>
                <el-radio-button
                  label="Nanum Gothic"
                  class="nanum-gothic"
                ></el-radio-button>
                <el-radio-button
                  label="Gothic A1"
                  class="gothic-a1"
                ></el-radio-button>
                <el-radio-button
                  label="Gowun Dodum"
                  class="gowun-dodum"
                ></el-radio-button>
                <el-radio-button label="Godo" class="godo"></el-radio-button>
                <el-radio-button
                  label="Yeon Sung"
                  class="yeon-sung"
                ></el-radio-button>
                <el-radio-button label="Jua" class="jua"></el-radio-button>
                <el-radio-button
                  label="Sunflower"
                  class="sunflower"
                ></el-radio-button>
              </el-radio-group>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapMutations, mapState } from "vuex"

export default {
  data() {
    return {
      isBtn: true,
      isBtnFont: true,
      isSelectFontBox: false,
      fontRadio: "",
    }
  },
  computed: {
    ...mapState(["memoColor", "font"]),
  },
  watch: {
    $route() {
      this.setHeaderLayout(this.$route.path)
    },
    font() {
      this.fontRadio = this.font
    },
  },
  created() {
    this.fontRadio = this.font
  },
  mounted() {
    this.setHeaderLayout(this.$route.path)
    this.setupClickOutside(this.$refs.selectFont)
  },
  methods: {
    ...mapMutations(["SET_MEMO_COLOR", "SET_FONT"]),
    setHeaderLayout() {
      if (this.$route.path === "/") {
        this.isBtn = false
        this.isBtnFont = true

        return false
      }

      this.SET_MEMO_COLOR() // 메모 컬러 초기화 : 메모 읽기/수정 페이지에서만 변경
      this.isBtn = true
      this.isBtnFont = false
    },

    onVisibleSelectFontBox() {
      // console.log("ddd")
      this.isSelectFontBox = !this.isSelectFontBox
    },

    setupClickOutside(el) {
      document.querySelector("body").addEventListener("click", (e) => {
        if (el.contains(e.target)) return
        this.isSelectFontBox = false
      })
    },

    changeRadio() {
      this.SET_FONT(this.fontRadio)
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
    border: 0 none;
    background-color: transparent;
    line-height: 1;

    span {
      display: flex;
    }

    &:focus {
      background: transparent;
      color: inherit;
    }

    &:hover,
    &.is-active {
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

  .btn-option {
    margin-left: rem(4);
  }

  .r-btn-group {
    @include flexbox();
    margin-left: auto;
  }

  .select-font {
    position: relative;

    .btn-font {
      > span {
        display: flex;

        .icon {
          font-size: rem(22);
        }
      }
    }

    &__box {
      position: absolute;
      top: 100%;
      right: 0;
      z-index: 100;
      border: 1px solid $borderColor;
      border-radius: rem(4);
      overflow: hidden;
      box-shadow: 0 0 rem(10) 0 rgba(0, 0, 0, 0.05);

      &-inner {
        @include flexbox();
        flex-direction: column;
        width: 100%;

        ::v-deep .el-radio-button {
          width: 100%;

          &__inner {
            width: 100%;
            border: 0 none;
            border-radius: 0;
            padding: rem(12) rem(20);
            font-size: rem(14);
          }

          + .el-radio-button {
            border-top: 1px solid $borderColor;
          }
        }
      }
    }
  }
}
</style>
