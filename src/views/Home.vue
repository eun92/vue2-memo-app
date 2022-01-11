<template>
  <div class="content__inner home">
    <!-- 홈 타이틀 -->
    <h1 class="title">폴더</h1>

    <!-- 검색창 컴포넌트 -->
    <search></search>

    <!-- 폴더 목록 -->
    <div class="folder-list">
      <div
        class="folder-list__item"
        v-for="folder in folderList"
        :key="folder.key"
      >
        <router-link :to="`/f/${folder.key}`">
          <div class="item-group">
            <i class="el-icon-folder"></i>
            <span class="title" v-text="folder.title"></span>
          </div>
          <div class="item-group">
            <div class="memo-cnt">
              <span v-text="`0`"></span>
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Search from "../components/Search.vue"
import { mapState, mapActions } from "vuex"

export default {
  name: "Home",
  components: {
    Search,
  },
  created() {
    this.FETCH_FOLDER()
  },
  data() {
    return {}
  },
  computed: {
    ...mapState(["folderList"]),
  },
  methods: {
    ...mapActions(["FETCH_FOLDER"]),
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.folder-list {
  margin: rem(20) 0;

  &__item {
    padding: rem(5) rem(15);
    border-radius: rem(10);
    // transition: 0.3s;

    &:hover {
      background: #eef7ff;

      a {
        &::after {
          display: none;
        }
      }
    }

    a {
      position: relative;
      @include flexbox($jc: between);
      padding: rem(8) 0;

      &::after {
        @include pseudo-selector($w: 100%, $h: 1px, $bg: #ebebeb);
        position: absolute;
        left: 0;
        bottom: -#{rem(5)};
      }
    }

    .item-group {
      @include flexbox();

      + .item-group {
        margin-left: rem(10);
      }
    }

    i {
      font-size: rem(18);
      color: #c0c4cc;
    }

    .title {
      margin-left: rem(5);
      color: #212121;
    }
  }
}
</style>
