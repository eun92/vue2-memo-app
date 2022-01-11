<template>
  <div>
    <div class="content__inner folder">
      <!-- 폴더 타이틀 -->
      <h1 class="title" v-text="`모든 메모`"></h1>

      <!-- 검색창 -->
      <search></search>

      <!-- 메모 목록 -->
      <div class="memo-list" v-if="false">
        <div
          class="memo-list__item"
          v-for="memo in folderList.memoList"
          :key="memo.key"
        >
          <router-link to="">
            <!--  :to="`/f/${folder.key}/m/${memo.key}`" -->
            <!-- color -->
            <span
              class="color-dot"
              v-if="memo.isColor"
              :style="{ backgroundColor: `${memo.color}` }"
            ></span>

            <!-- required -->
            <div class="main-info-group">
              <h2 class="title" v-text="memo.title"></h2>
              <p class="summary" v-text="memo.body"></p>
              <span class="date" v-text="memo.createTime"></span>
            </div>

            <!-- optional -->
            <div class="thumbnail-area" v-if="memo.isImage">
              <div class="thumbnail">
                <img :src="memo.image" alt="thumbnail" />
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- memo -->
    <!-- <router-view></router-view> -->
  </div>
</template>

<script>
import Search from "../components/Search.vue"
import { mapState, mapActions } from "vuex"

export default {
  components: { Search },
  data() {
    return {
      memoList: [
        // {
        //   title: "memo1",
        //   body: "ddddd",
        //   createTime: "2022-01-01",
        //   isImage: true,
        //   image: "",
        //   isColor: true,
        //   color: "#b39ddb",
        // },
        // {
        //   title: "메모입니다.제목입니다.제목이길어집니다.길어져요길어져요",
        //   body: "내용입니다. 내용이 길어집니다. 내용이 길어요. 한줄만 출력이에요.",
        //   createTime: "2022-01-01",
        //   isImage: false,
        // },
      ],
    }
  },
  computed: {
    ...mapState(["folderList"]),
  },
}
</script>

<style lang="scss" scoped>
h1.title {
  color: #444;
}

.memo-list {
  margin: rem(20) 0;

  &__item {
    position: relative;
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
      margin-left: rem(10);

      &::after {
        @include pseudo-selector($w: 100%, $h: 1px, $bg: #ebebeb);
        position: absolute;
        left: 0;
        bottom: -#{rem(5)};
      }
    }

    .color-dot {
      width: rem(10);
      height: rem(10);
      background: #ddd;
      border-radius: 50%;
      position: absolute;
      top: rem(17);
      left: -#{rem(16)};
    }

    .main-info-group {
      overflow: hidden;
    }

    .title {
      color: #212121;
      font-size: rem(17);
      @include ellipse-item();
    }

    .summary {
      color: #595959;
      font-size: rem(15);
      @include ellipse-item();
    }

    .date {
      color: #a9a9a9;
      font-size: rem(13);
    }
  }

  .thumbnail {
    &-area {
      width: rem(60);
      flex-shrink: 0;
      border-radius: rem(6);
      overflow: hidden;
    }

    position: relative;
    z-index: 1;
    overflow: hidden;
    @include flexbox();
    flex-direction: column;
    width: 100%;
    // height: 100%;
    height: rem(60); // default - 디자인 별로 각 클래스에서 변경
    background: #f8f8f8;
    border: 1px solid transparent;
    transition: 0.3s;

    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: -1;
      min-width: 100%;
      min-height: 100%;
      max-height: 100%;
      transition: 0.3s;
    }
  }
}
</style>
