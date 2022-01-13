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
        <a @click.self="goFolder(`/f/${folder.key}`)">
          <!-- :to="`/f/${folder.key}`" -->
          <div class="item-group">
            <i class="el-icon-folder"></i>
            <span class="title" v-text="folder.title"></span>
          </div>
          <div class="item-group">
            <el-dropdown trigger="click" v-if="isFolderOptions">
              <span class="el-dropdown-link">
                <i class="el-icon-more"></i>
              </span>

              <!-- // {{ folder }} -->
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <a @click="openEditFolderModal(folder)">폴더 이름 변경</a>
                </el-dropdown-item>
                <el-dropdown-item>
                  <a @click="onDeleteFolder(folder)">폴더 삭제</a>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <div class="memo-cnt">
              <span v-text="`0`"></span>
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
        </a>
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
import { mapState, mapActions } from "vuex"
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
    // this.setIsFolderOptions()
    // console.log(this.folderList[0])
  },
  methods: {
    ...mapActions(["FETCH_FOLDER_LIST"]),

    setIsFolderOptions() {
      if (this.folderList[0]) {
        this.isFolderOptions = false
      } else {
        this.isFolderOptions = true
      }

      console.log("실행")
    },

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
          .finally((_) => {})

      // console.log(this.selectedFolder.key)
    },
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

::v-deep .el-dropdown {
  margin-right: rem(10);

  &-menu__item {
    padding: 0 rem(10);

    a {
      display: block;
    }
  }
}
</style>
