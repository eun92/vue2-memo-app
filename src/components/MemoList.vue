<template>
  <div class="memo-list__item">
    <div class="memo-list__inner">
      <!-- check -->
      <el-checkbox :label="memo.key"></el-checkbox>

      <a class="item-group" @click.prevent="goMemoView(memo)">
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
      </a>

      <div class="item-group">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <i class="el-icon-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <a @click="openMoveMemo(memo)">
                <span class="material-icons-round icon">
                  drive_file_move_rtl
                </span>
                <span class="text">메모 이동</span>
              </a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a @click="onFixMemo(memo, isFixed)">
                <span class="material-icons-round icon" v-text="fixMemoIcon">
                  <!--push_pin/storage--></span
                >
                <span class="text" v-text="fixMemoText">
                  <!-- 메모 고정/메모 해제-->
                </span>
              </a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a @click="onDeleteMemo(memo)">
                <span class="material-icons-round icon"> delete </span>
                <span class="text">메모 삭제</span>
              </a>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex"
import { getDatabase, ref, remove, update } from "firebase/database"

export default {
  props: {
    memo: {
      type: Object,
    },
  },
  data() {
    return {
      fixMemoIcon: "",
      fixMemoText: "",
      selectedMemo: null,
      isFixed: false,
    }
  },
  computed: {
    ...mapState(["folder"]),
  },
  created() {
    this.fetchData()
    // console.log(this.folder)
  },
  methods: {
    ...mapActions(["FETCH_FOLDER"]),

    // data fetch
    fetchData() {
      if (this.memo.isFixed == true) {
        this.fixMemoIcon = "storage"
        this.fixMemoText = "고정 해제"
        return
      }
      this.fixMemoIcon = "push_pin"
      this.fixMemoText = "메모 고정"
    },

    // date format
    formatDate(dbTime) {
      // new date
      const _newDate = new Date(dbTime)

      // 요일 구하기
      const week = ["일", "월", "화", "수", "목", "금", "토"]
      const dayOfWeek = week[_newDate.getDay()]

      // 날짜&시간 구하면서 요일 원하는 위치에 넣기
      const date = new Date(+_newDate + 3240 * 10000)
        .toISOString()
        .replace("T", ` ${dayOfWeek} `)
        .replace(/\..*/, "")

      return date
    },

    // 선택한 메모로 이동
    goMemoView(memo) {
      this.$router.push(`/f/${this.$route.params.fid}/m/${memo.key}`)
    },

    // 메모 이동
    openMoveMemo(memo) {
      this.selectedMemo = memo

      this.$emit("moveMemo", this.selectedMemo)
    },

    // 메모 고정/해제
    onFixMemo(memo) {
      if (this.memo.isFixed == true) {
        this.isFixed = false
      } else {
        this.isFixed = true
      }

      // console.log(this.isFixed)

      // 고정값 update
      const db = getDatabase()
      update(
        ref(db, `folderList/${this.$route.params.fid}/memoList/${memo.key}`),
        {
          isFixed: this.isFixed,
        }
      ).then(() => {
        this.$emit("fixMemo")
        // this.FETCH_FOLDER({ key: this.$route.params.fid })
      })
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
        ).then(() => {
          this.$emit("deleteMemo")
          // this.FETCH_FOLDER({ key: this.$route.params.fid })
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.memo-list {
  &.view-type-grid {
    .memo-list__inner {
      margin: rem(5);
      border: 1px solid $borderColor;
      border-radius: rem(12);

      a {
        &::after {
          display: none;
        }
      }
    }
  }

  &__inner {
    @include flexbox($jc: between);
    position: relative;
    padding: 0 rem(15);
    border-radius: rem(10);
    // transition: border 0.3s;

    ::v-deep .el-checkbox__label {
      display: none;
    }

    .item-group {
      @include flexbox();
      flex: 1;
      width: 90%;

      + .item-group {
        flex: none;
        width: auto;
      }
    }

    &:hover {
      background: $primary;
    }

    a {
      position: relative;
      @include flexbox($jc: between);
      padding: rem(10) rem(10);

      &::after {
        @include pseudo-selector(
          $w: calc(100% + #{rem(33)}),
          $h: 1px,
          $bg: $borderColor
        );
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
      }
    }

    .color-dot {
      width: rem(10);
      height: rem(10);
      background: $bgGray;
      border-radius: 50%;
      position: absolute;
      top: rem(18);
      left: -#{rem(12)};
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
}
</style>
