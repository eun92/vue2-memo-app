<template>
  <el-dialog
    title="메모 이동"
    :visible.sync="visible"
    width="40%"
    center
    @close="close"
  >
    <ul class="folder-list">
      <li
        class="folder-list__item"
        v-for="folder in folderList"
        :key="folder.key"
        :class="{ 'is-active': selectedFolder === folder.key }"
        @click="getSelectedFolder(folder)"
      >
        <i class="el-icon-folder"></i>
        <span class="title" v-text="folder.title"></span>
      </li>
    </ul>
    <!-- {{ folderList }} -->
    <!-- {{ data }} -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">취소</el-button>
      <el-button
        type="primary"
        @click="onMoveMemo()"
        :disabled="!this.selectedFolder"
      >
        저장
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex"
import { getDatabase, ref, push, set, remove } from "firebase/database"

export default {
  props: {
    data: {
      type: Object,
    },
    moveMemoVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      visible: false,
      valid: false,
      selectedFolder: null,
    }
  },
  computed: {
    ...mapState(["folderList"]),
  },
  watch: {
    moveMemoVisible: function (oldVal, newVal) {
      this.visible = oldVal
    },
  },
  methods: {
    ...mapActions(["FETCH_FOLDER"]),

    close() {
      this.$emit("close")
      this.selectedFolder = null
    },

    // 선택한 폴더 key 구하기
    getSelectedFolder(folder) {
      this.selectedFolder = folder.key

      console.log(this.selectedFolder)
    },

    // 메모 이동
    onMoveMemo() {
      const folder = this.selectedFolder
      const selectedMemo = this.data

      console.log(folder, selectedMemo)

      const db = getDatabase()
      const memoListRef = ref(db, `folderList/${folder}/memoList`)
      const newMemoRef = push(memoListRef)

      // 데이터 저장
      if (selectedMemo.updatedDate) {
        set(newMemoRef, {
          title: selectedMemo.title,
          body: selectedMemo.body,
          createdDate: selectedMemo.createdDate,
          updatedDate: selectedMemo.updatedDate,
          color: selectedMemo.color,
        })
          .then(() => {
            remove(
              ref(
                db,
                `folderList/${this.$route.params.fid}/memoList/${selectedMemo.key}`
              ),
              {}
            )
          })
          .catch((err) => {
            console.log(err)
          })
          .finally((_) => {
            this.FETCH_FOLDER({ key: this.$route.params.fid })
            this.close()
          })
      } else {
        set(newMemoRef, {
          title: selectedMemo.title,
          body: selectedMemo.body,
          createdDate: selectedMemo.createdDate,
          color: selectedMemo.color,
        })
          .then(() => {
            remove(
              ref(
                db,
                `folderList/${this.$route.params.fid}/memoList/${selectedMemo.key}`
              ),
              {}
            )
          })
          .catch((err) => {
            console.log(err)
          })
          .finally((_) => {
            this.FETCH_FOLDER({ key: this.$route.params.fid })
            this.close()
          })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.folder-list {
  border: 1px solid $borderColor;
  border-radius: rem(5);

  &__item {
    position: relative;
    padding: rem(8) rem(10);
    cursor: pointer;

    + .folder-list__item {
      border-top: 1px solid $borderColor;
    }

    i {
      margin-right: rem(4);
    }

    &:hover {
      background: $primary;
    }

    &.is-active {
      background: $primary;
      color: #000;

      &::after {
        position: absolute;
        top: 50%;
        right: rem(5);
        transform: translateY(-50%);
        content: "check";
        font-family: "Material Icons Round";
        font-size: rem(22);
        color: #69a8e4;
        font-weight: 700;
      }
    }
  }
}
</style>
