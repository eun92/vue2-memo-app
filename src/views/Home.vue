<template>
  <div class="content__inner home">
    <!-- 홈 타이틀 -->
    <h1 class="title">폴더</h1>

    <!-- 폴더 목록 -->
    <div class="folder-list">
      <draggable
        v-model="folderList"
        :move="checkMove"
        @change="onChange"
        filter=".no-drag"
        chosenClass="sortable-chosen"
        dragClass="sortable-drag"
      >
        <div
          class="folder-list__item"
          v-for="(folder, index) in folderList"
          :key="folder.key"
          :class="[index === 0 ? 'no-drag' : '']"
        >
          <!-- {{ folder }} -->
          <div class="folder-list__inner">
            <a @click.prevent.native="goFolder(to)" class="item-group">
              <span class="material-icons-round icon-drag" v-if="index !== 0">
                drag_indicator
              </span>
              <i class="el-icon-folder"></i>
              <span class="title" v-text="folder.title"></span>
            </a>
            <div class="item-group">
              <el-dropdown
                trigger="click"
                :class="[index === 0 ? 'is-none' : '']"
              >
                <span class="el-dropdown-link">
                  <i class="el-icon-more"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <a @click.prevent.native="openEditFolderModal(folder)">
                      <span class="material-icons-round icon">
                        drive_file_rename_outline
                      </span>
                      <span class="text"> 폴더 이름 변경 </span>
                    </a>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <a @click.prevent.native="onDeleteFolder(folder)">
                      <span class="material-icons-round icon">
                        folder_delete
                      </span>
                      <span class="text">폴더 삭제</span>
                    </a>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <div class="memo-cnt">
                <span v-text="folder.memoList.length"></span>
                <i class="el-icon-arrow-right"></i>
              </div>
            </div>
          </div>
        </div>
      </draggable>
    </div>

    <!-- 폴더 이름 변경 -->
    <set-folder
      :data="selectedFolder"
      :set-folder-visible="setFolderVisible"
      @close="setFolderVisible = false"
    ></set-folder>
  </div>
</template>

<script>
import SetFolder from "@/components/SetFolder.vue"
import { mapState, mapActions, mapMutations } from "vuex"
import { getDatabase, ref, remove, update } from "firebase/database"
import draggable from "vuedraggable"

export default {
  name: "Home",
  components: {
    SetFolder,
    draggable,
  },
  data() {
    return {
      setFolderVisible: false,
      selectedFolder: null,
    }
  },
  computed: {
    // for vuedraggable
    ...mapState(["folderList"]),
    folderList: {
      get() {
        return this.$store.state.folderList
      },
      set(value) {
        this.$store.commit("SET_FOLDER_LIST", value)
      },
    },
  },
  created() {
    this.fetchData()
  },
  mounted() {
    this.SET_MEMO_COLOR() // 메모 컬러 초기화 : 메모 읽기/수정 페이지에서만 변경
  },
  methods: {
    ...mapMutations(["SET_MEMO_COLOR"]),
    ...mapActions(["FETCH_FOLDER_LIST"]),

    // fetch
    fetchData() {
      this.FETCH_FOLDER_LIST()
    },

    // 해당 폴더로 이동
    goFolder(to) {
      this.$router.push(to)
    },

    // 폴더 이름 변경
    openEditFolderModal(folder) {
      // console.log(folder)
      this.selectedFolder = folder
      this.setFolderVisible = true
    },

    // 폴더 삭제
    onDeleteFolder(folder) {
      const db = getDatabase()

      if (confirm("정말 삭제하시겠습니까?"))
        remove(ref(db, "folderList/" + folder.key), {})
          .then(() => {
            this.FETCH_FOLDER_LIST()
          })
          .catch((err) => {
            console.log(err)
          })
          .finally((_) => {
            // console.log(this.folderList)
          })
    },

    // vuedraggable :move 드래깅 상태에서 움직였을 때 호출
    checkMove(evt) {
      // 기본메모 자리는 제외 / 기본메모 드래그 제한은 filter option으로 지정
      if (evt.relatedContext.element.orderNum == 0) return false
    },

    // vuedraggable @change 요소를 드래깅하여 위치가 변경 될 때 호출
    onChange(evt) {
      const folders = this.folderList
      const db = getDatabase()

      // orderNum 1,2,3 순서대로 변경해서 업데이트
      for (let i = 0; i < folders.length; i++) {
        folders[i].orderNum = i

        update(ref(db, "folderList/" + folders[i].key), {
          orderNum: folders[i].orderNum,
        })
      }
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.folder-list {
  margin: rem(15) 0;

  &__item {
    padding: 0 rem(15);
    border-radius: rem(10);
    // transition: 0.3s;

    a {
      padding: rem(11) 0;
    }

    &:hover {
      background: $primary;
    }

    &.sortable-chosen,
    &.sortable-drag {
      background: $borderColor;
    }
  }

  &__inner {
    position: relative;
    @include flexbox($jc: between);

    &::after {
      @include pseudo-selector($w: 100%, $h: 1px, $bg: $borderColor);
      position: absolute;
      left: 0;
      bottom: 0;
    }

    .item-group {
      @include flexbox();
      flex: 1;

      + .item-group {
        flex: none;
        margin-left: rem(10);
      }
    }

    .icon-drag {
      font-size: rem(18);
      color: #acafb3;
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

  ::v-deep .el-dropdown {
    margin-right: rem(10);
  }
}
</style>
