<template>
  <div>
    <!-- folder /f/:fid -->
    <div class="content__inner folder" v-if="isFolder">
      <div class="title-group">
        <!-- 폴더 타이틀 -->
        <h1 class="title" v-text="folder.title"></h1>

        <div class="r-group" v-if="folder.memoList.length > 0">
          <!-- 메모 보기 형식 -->
          <div class="view-type">
            <el-button
              type="primary"
              size="medium"
              class="view-type__btn"
              v-for="(type, index) in viewTypes"
              :key="index"
              @click="changeViewType(index)"
              :class="{ 'is-active': selectedViewType === index }"
            >
              <span class="material-icons-round icon" v-text="type.icon"></span>
              <span class="text" v-text="type.name"></span>
            </el-button>
          </div>

          <!-- 정렬 -->
          <div class="sort">
            <el-dropdown trigger="click" @command="handleCommand">
              <span class="el-dropdown-link">
                <span class="material-icons-round"> filter_list </span>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="ascendingOrderByName"
                  >제목 오름차순</el-dropdown-item
                >
                <el-dropdown-item command="descendingOrderByName"
                  >제목 내림차순</el-dropdown-item
                >
                <el-dropdown-item command="ascendingOrderByDate"
                  >날짜 오름차순</el-dropdown-item
                >
                <el-dropdown-item command="descendingOrderByDate"
                  >날짜 내림차순</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>

      <!-- 검색창 -->
      <!-- <search></search> -->

      <!-- 고정 메모 목록 -->
      <div class="memo-list-wrap">
        <h2 class="memo-title">
          <span class="material-icons-round icon"> push_pin </span>
          <span class="text">고정된 메모</span>
        </h2>
        <div class="memo-list" :class="viewTypeClass">
          <div
            class="memo-list__item"
            v-for="memo in fixedMemoList"
            :key="memo.key"
          >
            <div class="memo-list__inner">
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

                <!-- optional -->
                <div class="thumbnail-area" v-if="memo.isImage">
                  <div class="thumbnail">
                    <img :src="memo.image" alt="thumbnail" />
                  </div>
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
                      <a @click="onFixMemo(memo, false)">
                        <span class="material-icons-round icon"> storage</span>
                        <span class="text"></span>고정 해제
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
        </div>
      </div>

      <!-- 메모 목록 -->
      <div class="memo-list-wrap">
        <h2 class="memo-title">
          <span class="material-icons-round icon"> storage</span>
          <span class="text">메모</span>
        </h2>
        <div class="memo-list" :class="viewTypeClass">
          <div
            class="memo-list__item"
            v-for="(memo, index) in noFixedMemoList"
            :key="index"
          >
            <div class="memo-list__inner">
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

                <!-- <el-button
              type="primary"
              icon="el-icon-delete"
              class="btn-delete-memo"
              @click.stop="onDeleteMemo(memo)"
            ></el-button> -->

                <!-- optional -->
                <div class="thumbnail-area" v-if="memo.isImage">
                  <div class="thumbnail">
                    <img :src="memo.image" alt="thumbnail" />
                  </div>
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
                      <a @click="onFixMemo(memo, true)">
                        <span class="material-icons-round icon">
                          push_pin
                        </span>
                        <span class="text"></span>메모 고정
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

      <!-- 메모 이동 모달 -->
      <move-memo
        :data="selectedMemo"
        :move-memo-visible="moveMemoVisible"
        @close="moveMemoVisible = false"
      ></move-memo>
    </div>

    <!-- memo /f/:fid/m/:mid -->
    <router-view></router-view>
  </div>
</template>

<script>
import Search from "../components/Search.vue"
import MoveMemo from "../components/MoveMemo.vue"
import { mapState, mapActions, mapMutations } from "vuex"
import { getDatabase, ref, remove, update } from "firebase/database"

export default {
  components: { Search },
  data() {
    return {
      isFolder: true,
      selectedMemo: null,
      disabledBtn: false,
      moveMemoVisible: false,
      viewTypes: [
        {
          icon: "view_list",
          name: "리스트형",
        },
        {
          icon: "grid_view",
          name: "그리드형",
        },
      ],
      selectedViewType: 0,
      viewTypeClass: "",
      fixedMemoList: [],
      noFixedMemoList: [],
    }
  },
  components: {
    MoveMemo,
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
  mounted() {
    // console.log(this.viewTypes[0])
    // console.log(this.folder.memoList)
  },
  updated() {
    // this.$nextTick(() => {
    //   if (this.folder.memoList.length == 0) this.disabledBtn = true
    //   this.disabledBtn = false
    // })
  },
  methods: {
    // ...mapMutations(["SET_MEMO_COLOR"]),
    ...mapActions(["FETCH_FOLDER"]),

    // view type
    changeViewType(index) {
      this.selectedViewType = index

      if (this.selectedViewType === 1) {
        this.viewTypeClass = "view-type-grid"
        return false
      }

      this.viewTypeClass = ""
    },

    // 드롭다운 메뉴 이벤트
    handleCommand(command) {
      // this.$message("click on item " + command)
      // console.log(command)

      this.sortMemoList(command, this.fixedMemoList)
      this.sortMemoList(command, this.noFixedMemoList)
    },

    // memo list 정렬
    sortMemoList(command, memoArr) {
      switch (command) {
        case "ascendingOrderByName":
          memoArr.sort((a, b) => {
            return a.title < b.title ? -1 : a.title > b.title ? 1 : 0
          })
          console.log(command)

          break
        case "descendingOrderByName":
          memoArr.sort((a, b) => {
            return a.title > b.title ? -1 : a.title < b.title ? 1 : 0
          })
          console.log(command)

          break
        case "ascendingOrderByDate":
          memoArr.sort((a, b) => {
            let dateA = a.createdDate
            if (a.updatedDate) {
              dateA = a.updatedDate
            }

            let dateB = b.createdDate
            if (b.updatedDate) {
              dateB = b.updatedDate
            }

            return new Date(dateA) - new Date(dateB)
          })
          console.log(command)
          break
        case "descendingOrderByDate":
          memoArr.sort((a, b) => {
            let dateA = a.createdDate
            if (a.updatedDate) {
              dateA = a.updatedDate
            }

            let dateB = b.createdDate
            if (b.updatedDate) {
              dateB = b.updatedDate
            }

            return new Date(dateB) - new Date(dateA)
          })
          console.log(command)
          break
      }
    },

    // 폴더 데이터 페치
    fetchData() {
      // 메모 페이지로 이동할 경우
      if (-1 < this.$route.path.indexOf("/m")) {
        this.isFolder = false
        return false
      }
      this.isFolder = true

      // folder data 불러오기
      this.FETCH_FOLDER({ key: this.$route.params.fid }).then(() => {
        this.fixedMemoList = []
        this.noFixedMemoList = []

        this.folder.memoList.filter((obj) => {
          // console.log(obj)

          // 고정된 메모일 경우
          if (obj.isFixed === true) {
            this.fixedMemoList.push(obj)
          } else {
            // 일반 메모
            this.noFixedMemoList.push(obj)
          }
        })
      })
    },

    // 메모 고정/해제
    onFixMemo(memo, isFixed) {
      // 고정값 update
      const db = getDatabase()
      update(
        ref(db, `folderList/${this.$route.params.fid}/memoList/${memo.key}`),
        {
          isFixed,
        }
      )
        .then(() => {
          this.fetchData()
        })
        .catch((err) => {
          console.log(err)
        })
        .finally((_) => {})
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

      // 날짜&시간에 요일을 원하는 위치에 넣기
      // const position = 11
      // const result = [
      //   date.slice(0, position),
      //   dayOfWeek,
      //   date.slice(position),
      // ].join(" ")

      return date
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

    // 메모 이동
    openMoveMemo(memo) {
      this.selectedMemo = memo
      this.moveMemoVisible = true
      // console.log("move")
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
    },
  },
}
</script>

<style lang="scss" scoped>
.title-group {
  @include flexbox($ai: end, $jc: between);

  h1.title {
    margin-bottom: 0;
    flex: 1;
  }

  .r-group {
    @include flexbox($jc: end);
    margin-left: rem(10);
  }
}

h1.title {
  color: #444;
}

.view-type {
  @include flexbox($jc: end);

  &__btn {
    border: 0 none;
    background-color: transparent;
    line-height: 1;

    .icon {
      font-size: rem(16);
      margin-right: rem(3);
    }

    .text {
      font-size: rem(14);
    }

    &.is-active {
      background: #5c5c5c;
      border-color: #5c5c5c;
      color: #ffffff;
    }
  }
}

.sort {
  height: rem(25);
  margin-left: rem(5);
}

.memo-title {
  @include flexbox();
  padding: rem(5) rem(10);
  margin-bottom: rem(10);
  font-size: rem(16);
  font-weight: 400;
  color: #777;
  background: #f7f7f7;
  border-radius: rem(7);

  .icon {
    margin-right: rem(5);
    font-size: rem(16);
  }
}

.memo-list {
  &-wrap {
    margin: rem(15) 0;
  }

  &.view-type-grid {
    @include flexbox();
    flex-wrap: wrap;

    .memo-list__item {
      width: 50%;
    }

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
          $w: calc(100% + #{rem(20)}),
          $h: 1px,
          $bg: $borderColor
        );
        position: absolute;
        left: 0;
        bottom: 0;
      }
    }

    .color-dot {
      width: rem(10);
      height: rem(10);
      background: $bgGray;
      border-radius: 50%;
      position: absolute;
      top: rem(15);
      left: -#{rem(7)};
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
