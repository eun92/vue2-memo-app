<template>
  <div>
    <!-- folder /f/:fid -->
    <div class="content__inner folder" v-if="isFolder">
      <!-- 폴더 타이틀 -->
      <h1 class="title" v-text="folder.title"></h1>

      <!-- 검색창 -->
      <!-- <search></search> -->

      <!-- 메모 목록 -->
      <div class="memo-list">
        <div
          class="memo-list__item"
          v-for="memo in folder.memoList"
          :key="memo.key"
        >
          <a @click="goMemoView(memo)">
            <!-- color -->
            <span
              class="color-dot"
              :style="{ backgroundColor: `${memo.color}` }"
            ></span>

            <!-- required -->
            <div class="main-info-group">
              <h2 class="title" v-text="memo.title"></h2>
              <p class="summary" v-text="memo.body"></p>
              <span
                class="date"
                v-text="
                  memo.updatedDate
                    ? formatDate(memo.updatedDate)
                    : formatDate(memo.createdDate)
                "
              ></span>
            </div>

            <el-button
              type="primary"
              icon="el-icon-delete"
              class="btn-delete-memo"
              @click.stop="onDeleteMemo(memo)"
            ></el-button>

            <!-- optional -->
            <div class="thumbnail-area" v-if="memo.isImage">
              <div class="thumbnail">
                <img :src="memo.image" alt="thumbnail" />
              </div>
            </div>
          </a>
        </div>
      </div>

      <!-- <pre>
      {{ folder.memoList }}
      </pre> -->
      <!-- <el-button
        type="primary"
        size="mini"
        @click="onDeleteAll"
        round
        style="margin-top: 10px"
        :disabled="disabledBtn"
        >모두 삭제(임시)</el-button
      > -->
    </div>

    <!-- memo /f/:fid/m/:mid -->
    <router-view></router-view>
  </div>
</template>

<script>
import Search from "../components/Search.vue"
import { mapState, mapActions, mapMutations } from "vuex"
import { getDatabase, ref, remove } from "firebase/database"
export default {
  components: { Search },
  data() {
    return {
      isFolder: true,
      selectedMemo: null,
      disabledBtn: false,
    }
  },
  computed: {
    ...mapState(["folder"]),
  },
  watch: {
    $route: "fetchData",
  },
  created() {
    this.fetchData()
  },
  mounted() {},
  // updated() {
  //   this.$nextTick(() => {
  //     if (this.folder.memoList.length == 0) this.disabledBtn = true
  //     this.disabledBtn = false
  //   })
  // },
  methods: {
    // ...mapMutations(["SET_MEMO_COLOR"]),
    ...mapActions(["FETCH_FOLDER"]),

    // 폴더 데이터 페치
    fetchData() {
      // 메모 페이지로 이동할 경우
      if (-1 < this.$route.path.indexOf("/m")) {
        this.isFolder = false
        return false
      }
      this.isFolder = true

      return this.FETCH_FOLDER({ key: this.$route.params.fid })
    },

    // date format
    formatDate(dbTime) {
      // new date
      const _newDate = new Date(dbTime)

      // 날짜&시간 구하기
      const date = new Date(+_newDate + 3240 * 10000)
        .toISOString()
        .replace("T", " ")
        .replace(/\..*/, "")

      // 요일 구하기
      const week = ["일", "월", "화", "수", "목", "금", "토"]
      const dayOfWeek = week[_newDate.getDay()]

      // 날짜&시간에 요일을 원하는 위치에 넣기
      const position = 11
      const result = [
        date.slice(0, position),
        dayOfWeek,
        date.slice(position),
      ].join(" ")

      return result
    },

    // 선택한 메모로 이동
    goMemoView(memo) {
      this.selectedMemo = memo
      this.$router.push(
        `/f/${this.$route.params.fid}/m/${this.selectedMemo.key}`
      )
    },

    // 메모 삭제
    onDeleteMemo(memo) {
      this.selectedMemo = memo

      const db = getDatabase()
      if (confirm("정말 삭제하시겠습니까?"))
        remove(
          ref(
            db,
            `folderList/${this.$route.params.fid}/memoList/${this.selectedMemo.key}`
          ),
          {}
        )
          .then(() => {
            this.fetchData()
          })
          .catch((err) => {
            console.log(err)
          })
          .finally((_) => {
            // console.log(this.folder)
          })
    },

    // 메모 전체 삭제
    onDeleteAll() {
      const db = getDatabase()
      if (confirm("정말 모두 삭제하시겠습니까?"))
        remove(ref(db, `folderList/${this.$route.params.fid}/memoList`), {})
          .then(() => {
            this.fetchData()
          })
          .catch((err) => {
            console.log(err)
          })
          .finally((_) => {
            // console.log(this.folder)
          })
      // this.folder.memoList = []
    },
  },
}
</script>

<style lang="scss" scoped>
h1.title {
  color: #444;
}

.memo-list {
  margin: rem(15) 0;

  &__item {
    position: relative;
    padding: rem(5) rem(15);
    border-radius: rem(10);
    // transition: 0.3s;

    &:hover {
      background: $primary;
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
      background: $bgGray;
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

    .btn-delete-memo {
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
