<template>
  <div class="content__inner home">
    <!-- 홈 타이틀 -->
    <h1 class="title">폴더</h1>

    <!-- 검색창 컴포넌트 -->
    <!-- <search></search> -->

    <!-- 폴더 목록 -->
    <div class="folder-list">
      <div
        class="folder-list__item"
        v-for="(folder, index) in folderList"
        :key="folder.key"
      >
        <!-- {{ folder }} -->
        <div class="folder-list__inner">
          <!-- :to="`/f/${folder.key}`" -->
          <router-link class="item-group" :to="`/f/${folder.key}`">
            <i class="el-icon-folder"></i>
            <span class="title" v-text="folder.title"></span>
          </router-link>
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
                  <a @click="openEditFolderModal(folder)">
                    <span class="material-icons-round icon">
                      drive_file_rename_outline
                    </span>
                    <span class="text"> 폴더 이름 변경 </span>
                  </a>
                </el-dropdown-item>
                <el-dropdown-item>
                  <a @click="onDeleteFolder(folder)">
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
    </div>

    <!-- 폴더 이름 수정 -->
    <set-folder
      :data="selectedFolder"
      :set-folder-visible="setFolderVisible"
      @close="setFolderVisible = false"
    ></set-folder>
  </div>
</template>

<script>
import Search from "../components/Search.vue"
import SetFolder from "@/components/SetFolder.vue"
import { mapState, mapActions, mapMutations } from "vuex"
import { getDatabase, ref, remove, update } from "firebase/database"

export default {
  name: "Home",
  components: {
    Search,
    SetFolder,
  },
  created() {
    this.FETCH_FOLDER_LIST()
  },
  data() {
    return {
      setFolderVisible: false,
      selectedFolder: null,
      isFolderOptions: true,
    }
  },
  computed: {
    ...mapState(["folderList"]),
  },
  mounted() {
    this.SET_MEMO_COLOR() // 메모 컬러 초기화 : 메모 읽기/수정 페이지에서만 변경
  },
  methods: {
    ...mapMutations(["SET_MEMO_COLOR"]),
    ...mapActions(["FETCH_FOLDER_LIST"]),

    // 해당 폴더로 이동
    goFolder(to) {
      this.$router.push(to)
    },

    openEditFolderModal(folder) {
      // console.log(folder)
      this.selectedFolder = folder
      this.setFolderVisible = true
    },

    onDeleteFolder(folder) {
      this.selectedFolder = folder

      const db = getDatabase()

      if (confirm("정말 삭제하시겠습니까?"))
        remove(ref(db, "folderList/" + this.selectedFolder.key), {})
          .then(() => {
            this.FETCH_FOLDER_LIST()
          })
          .catch((err) => {
            console.log(err)
          })
          .finally((_) => {
            console.log(this.folderList)
          })

      // console.log(this.selectedFolder.key)
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.folder-list {
  margin: rem(15) 0;

  &__item {
    padding: rem(5) rem(15);
    border-radius: rem(10);
    // transition: 0.3s;

    &:hover {
      background: $primary;
    }
  }

  &__inner {
    position: relative;
    @include flexbox($jc: between);
    padding: rem(8) 0;

    &::after {
      @include pseudo-selector($w: 100%, $h: 1px, $bg: $borderColor);
      position: absolute;
      left: 0;
      bottom: -#{rem(5)};
    }

    .item-group {
      @include flexbox();
      flex: 1;

      + .item-group {
        flex: none;
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

  ::v-deep .el-dropdown {
    margin-right: rem(10);
  }
}
</style>
