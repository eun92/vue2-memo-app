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
            <el-dropdown trigger="click" @command="sortHandleCommand">
              <span class="el-dropdown-link">
                <span class="material-icons-round"> filter_list </span>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="ascendingOrderByTitle">
                  <span> 제목 오름차순 </span>
                </el-dropdown-item>
                <el-dropdown-item command="descendingOrderByTitle">
                  <span>제목 내림차순</span>
                </el-dropdown-item>
                <el-dropdown-item command="ascendingOrderByDate">
                  <span>날짜 오름차순</span>
                </el-dropdown-item>
                <el-dropdown-item command="descendingOrderByDate">
                  <span>날짜 내림차순</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>

          <!-- 선택삭제/전체삭제 -->
          <div class="delete-options">
            <el-dropdown trigger="click" @command="deleteHandleCommand">
              <span class="el-dropdown-link">
                <i class="el-icon-delete"></i>
                <!-- <span class="material-icons-round"> delete </span> -->
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="deleteSelected">
                  <span>선택삭제</span>
                </el-dropdown-item>
                <el-dropdown-item command="deleteAll">
                  <span>전체삭제</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>

      <el-checkbox-group v-model="memoCheckList" class="memo-list-group">
        <!-- 고정 메모 목록 -->
        <div class="memo-list-wrap">
          <h2 class="memo-list__title">
            <span class="material-icons-round icon"> push_pin </span>
            <span class="text"> 고정된 메모 </span>
          </h2>
          <div class="memo-list" :class="viewTypeClass">
            <memo-list
              v-for="memo in fixedMemoList"
              :memo="memo"
              :key="memo.key"
              @deleteMemo="fetchData"
              @fixMemo="fetchData"
              @moveMemo="openMoveMemo(memo)"
            ></memo-list>
          </div>
        </div>

        <!-- 메모 목록 -->
        <div class="memo-list-wrap">
          <h2 class="memo-list__title">
            <span class="material-icons-round icon"> storage </span>
            <span class="text"> 메모 </span>
          </h2>
          <div class="memo-list" :class="viewTypeClass">
            <memo-list
              v-for="memo in noFixedMemoList"
              :memo="memo"
              :key="memo.key"
              @deleteMemo="fetchData"
              @fixMemo="fetchData"
              @moveMemo="openMoveMemo(memo)"
            ></memo-list>
          </div>
        </div>
      </el-checkbox-group>

      <!-- 메모 이동 모달 -->
      <move-memo
        :data="selectedMemo"
        :move-memo-visible="moveMemoVisible"
        @close="closeMoveMemo()"
      ></move-memo>
    </div>

    <!-- memo /f/:fid/m/:mid -->
    <router-view></router-view>
  </div>
</template>

<script>
import MemoList from "../components/MemoList.vue"
import MoveMemo from "../components/MoveMemo.vue"

import { mapState, mapActions } from "vuex"
import { getDatabase, ref, remove, update } from "firebase/database"

export default {
  data() {
    return {
      // folder layout
      isFolder: true,

      // view type
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

      // list
      memoCheckList: [],
      fixedMemoList: [],
      noFixedMemoList: [],

      // modal
      selectedMemo: null,
      moveMemoVisible: false,
    }
  },
  components: {
    MemoList,
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
  methods: {
    ...mapActions(["FETCH_FOLDER"]),

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

          if (obj.isFixed === true) {
            // 고정된 메모
            this.fixedMemoList.push(obj)
          } else {
            // 일반 메모
            this.noFixedMemoList.push(obj)
          }
        })
      })
    },

    // view type
    changeViewType(index) {
      this.selectedViewType = index

      if (this.selectedViewType === 1) {
        this.viewTypeClass = "view-type-grid"
        return false
      }

      this.viewTypeClass = ""
    },

    // 정렬 드롭다운
    sortHandleCommand(command) {
      this.sortMemoList(command, this.fixedMemoList)
      this.sortMemoList(command, this.noFixedMemoList)
    },

    // memo list 정렬
    sortMemoList(command, memoArr) {
      switch (command) {
        case "ascendingOrderByTitle":
          this.orderByTitle(memoArr, "ascending")
          break
        case "descendingOrderByTitle":
          this.orderByTitle(memoArr, "descending")
          break
        case "ascendingOrderByDate":
          this.orderByDate(memoArr, "ascending")
          break
        case "descendingOrderByDate":
          this.orderByDate(memoArr, "descending")
          break
      }
    },

    // 제목 정렬
    orderByTitle(memoArr, type) {
      memoArr.sort((a, b) => {
        if (type === "ascending") {
          return a.title < b.title ? -1 : a.title > b.title ? 1 : 0
        }
        return a.title > b.title ? -1 : a.title < b.title ? 1 : 0
      })
    },

    // 날짜 정렬
    orderByDate(memoArr, type) {
      memoArr.sort((a, b) => {
        let dateA = a.createdDate
        if (a.updatedDate) {
          dateA = a.updatedDate
        }

        let dateB = b.createdDate
        if (b.updatedDate) {
          dateB = b.updatedDate
        }

        if (type === "ascending") {
          return new Date(dateA) - new Date(dateB)
        }
        return new Date(dateB) - new Date(dateA)
      })
    },

    // 삭제 드롭다운
    deleteHandleCommand(command) {
      switch (command) {
        case "deleteSelected":
          this.onDeleteSelectedMemo()
          break
        case "deleteAll":
          this.onDeleteAll()
          break
      }
    },

    // 메모 선택 삭제
    onDeleteSelectedMemo() {
      const arr = this.memoCheckList
      const db = getDatabase()

      if (!arr.length) {
        alert("메모를 하나 이상 선택해주세요.")
        return
      }

      if (confirm("선택한 메모를 정말 삭제하시겠습니까?"))
        for (let i = 0; i < arr.length; i++) {
          remove(
            ref(db, `folderList/${this.$route.params.fid}/memoList/${arr[i]}`),
            {}
          ).then(() => {
            this.fetchData()
          })
        }
    },

    // 메모 전체 삭제
    onDeleteAll() {
      const db = getDatabase()
      if (confirm("정말 모두 삭제하시겠습니까?"))
        remove(
          ref(db, `folderList/${this.$route.params.fid}/memoList`),
          {}
        ).then(() => {
          this.fetchData()
        })
    },

    // 메모 이동 모달 열기
    openMoveMemo(memo) {
      this.selectedMemo = memo
      this.moveMemoVisible = true
    },

    // 메모 이동 모달 닫기
    closeMoveMemo() {
      this.moveMemoVisible = false
      this.fetchData()
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

    div + div {
      margin-left: rem(5);
    }

    i {
      font-size: rem(18);
    }
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
    }

    .text {
      margin-left: rem(3);
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
  }

  &__title {
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
}
</style>
