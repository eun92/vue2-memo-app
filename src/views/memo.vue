<template>
  <div class="memo">
    <!-- 제목 -->
    <div
      class="memo__title"
      :style="{
        background: `${this.selectedColor}`,
      }"
    >
      <span class="title">제목</span>
      <el-input
        v-model="input"
        placeholder="메모 제목을 입력하세요."
        ref="titleInput"
      ></el-input>
      <div class="palette" ref="palette">
        <!-- btn -->
        <button
          type="button"
          class="btn-palette"
          @click="onVisiblePaletteBox"
          :class="[isPaletteBox ? 'is-active' : '']"
        >
          <span class="material-icons"> palette </span>
        </button>
        <!-- select color -->
        <div class="palette__box" v-if="isPaletteBox">
          <ul class="palette__list">
            <li
              v-for="color in colors"
              :key="color.index"
              @click="onSelectColor(color.bg)"
            >
              <span
                :style="{
                  backgroundColor: `${color.bg}`,
                }"
              ></span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 본문 -->
    <div class="memo__body">
      <el-input
        type="textarea"
        placeholder="메모 내용을 입력하세요."
        v-model="textarea"
        autosize
      >
      </el-input>
    </div>

    <!-- 저장 버튼 -->
    <el-button
      type="primary"
      class="memo__btn-save"
      @click="onSaveMemo"
      title="메모 저장"
    >
      <span class="material-icons-round"> note_add </span>
    </el-button>
  </div>
</template>

<script>
import { mapMutations } from "vuex"
import {
  getDatabase,
  ref,
  get,
  child,
  push,
  set,
  update,
  serverTimestamp,
} from "firebase/database"

export default {
  data() {
    return {
      input: "",
      textarea: "",
      isPaletteBox: false,
      selectedColor: "",
      colors: [
        {
          bg: "#8bc34a",
        },
        {
          bg: "#fda639",
        },
        {
          bg: "#b39ddb",
        },
        {
          bg: "#6acddb",
        },
        {
          bg: "#ffb6d2",
        },
        {
          bg: "#ffe2a5",
        },
        {
          bg: "#e6f0f8",
        },
        {
          bg: "#d7d7d7",
        },
      ],
    }
  },
  computed: {
    invalidInput() {
      return !this.input.trim()
    },
    invalidTextarea() {
      return !this.textarea.trim()
    },
  },
  watch: {
    // $route: console.log("ddd"),
  },
  created() {
    this.$nextTick(() => {
      this.$refs.titleInput.focus()
    })
    if (this.$route.params.mid) this.fetchData()
  },
  mounted() {
    this.setupClickOutside(this.$refs.palette)
  },
  methods: {
    ...mapMutations(["SET_MEMO_COLOR"]),
    onVisiblePaletteBox() {
      this.isPaletteBox = !this.isPaletteBox
    },

    setupClickOutside(el) {
      document.querySelector("body").addEventListener("click", (e) => {
        if (el.contains(e.target)) return // palette안에 click한 대상이 포함되어 있으면 아무 동작도 일어나지 않음
        this.isPaletteBox = false // palette 외 영역 클릭 시 .palette__box를 숨김
      })
    },

    onSaveMemo() {
      if (this.$route.params.mid) {
        this.onEditMemo()
      } else {
        this.onAddMemo()
      }
    },

    // 메모 생성
    onAddMemo() {
      const db = getDatabase()
      const memoListRef = ref(
        db,
        `folderList/${this.$route.params.fid}/memoList`
      )
      const newMemoRef = push(memoListRef)

      // 아무것도 입력하지 않을 경우 alert & return
      if (this.invalidInput && this.invalidTextarea) {
        alert("제목이나 내용 중 하나라도 입력하세요")
        return
      }

      // 제목 없을 경우
      if (this.invalidInput) this.input = "제목 없음"

      // 내용 없을 경우
      if (this.invalidTextarea) this.textarea = "내용 없음"

      // 색상 없을 경우
      if (!this.selectedColor) this.selectedColor = "#f5f5f5"

      // 데이터 저장
      set(newMemoRef, {
        title: this.input,
        body: this.textarea,
        createdDate: serverTimestamp(),
        color: this.selectedColor,
        isFixed: false,
      }).then(() => {
        this.SET_MEMO_COLOR(this.selectedColor)
        this.$router.push(`/f/${this.$route.params.fid}`)
      })
    },

    // 메모 color 선택
    onSelectColor(color) {
      this.selectedColor = color
      this.SET_MEMO_COLOR(color)
    },

    // 메모 수정
    onEditMemo() {
      const db = getDatabase()
      update(
        ref(
          db,
          `folderList/${this.$route.params.fid}/memoList/${this.$route.params.mid}`
        ),
        {
          title: this.input,
          body: this.textarea,
          color: this.selectedColor,
          updatedDate: serverTimestamp(),
        }
      )
        .then(() => {
          this.SET_MEMO_COLOR(this.selectedColor)
          console.log("update")
          this.$router.push(`/f/${this.$route.params.fid}`)
        })
        .catch((err) => {
          console.log(err)
        })
        .finally((_) => {})
    },

    // 메모 읽기
    fetchData() {
      // 읽기
      const dbRef = ref(getDatabase())
      get(
        child(
          dbRef,
          `folderList/${this.$route.params.fid}/memoList/${this.$route.params.mid}`
        )
      )
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val()

            this.input = data.title
            this.textarea = data.body
            this.selectedColor = data.color
            // console.log(snapshot.val())
            this.SET_MEMO_COLOR(data.color)
          }
        })
        .catch((_) => {
          console.log("error")
        })
        .finally(() => {})
    },
  },
}
</script>

<style lang="scss" scoped>
.memo {
  position: relative;

  &__title {
    @include flexbox();
    // height: rem(100);
    padding: rem(20);
    background: $bgGray;

    .title {
      display: block;
      flex-shrink: 0;
      // margin-right: rem(7);
      font-size: rem(18);
    }

    ::v-deep .el-input {
      margin: 0 rem(10);
    }
  }

  &__body {
    padding: rem(20);

    ::v-deep .el-textarea__inner {
      border: 0 none;
      resize: none;
      padding: 0;
      min-height: rem(465) !important;
      // height: 100% !important;
      // min-height: 100% !important;
      // background: pink;
    }
  }

  &__btn-save {
    position: fixed;
    right: rem(40);
    bottom: rem(80);
    border-radius: 50%;
    width: rem(50);
    height: rem(50);
    background: rgba(0, 0, 0, 0.4);
    color: #fff;
    border: 0 none;
    line-height: 1;
  }
}

.palette {
  position: relative;

  .btn-palette {
    color: #7c7c7c;
    border: 0 none;
    background-color: transparent;
    line-height: 1;

    &:hover,
    &.is-active {
      color: #333;
    }
  }

  &__box {
    position: absolute;
    top: 100%;
    right: 0;
    width: rem(115);
    margin-top: rem(10);
    padding: rem(10);
    background: #fff;
    border-radius: rem(10);
    box-shadow: 0 0 rem(10) 0 rgba(0, 0, 0, 0.05);
    z-index: 10;
    border: 1px solid #ececec;
  }

  &__list {
    @include flexbox();
    flex-wrap: wrap;

    > li {
      display: flex;
      cursor: pointer;
      margin: rem(4);

      > span {
        display: inline-block;
        width: rem(15);
        height: rem(15);
        border-radius: 50%;
        border: 2px solid transparent;
        transition: 0.3s;
      }

      &:hover {
        span {
          border-color: $borderColor;
          transform: scale(1.5);
        }
      }
    }
  }
}
</style>
