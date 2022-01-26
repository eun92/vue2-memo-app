<template>
  <footer
    class="footer"
    :style="{
      background: memoColor,
    }"
  >
    <div class="footer__inner">
      <!-- create folder -->
      <el-button
        type="primary"
        icon="el-icon-folder-add"
        v-if="isBtnAddFolder"
        class="btn-add-folder"
        @click="setFolderVisible = true"
      ></el-button>

      <!-- memo cnt -->
      <p class="memo-cnt" v-if="isMemoCnt">
        총
        <span
          v-text="folder.memoList === undefined ? '0' : folder.memoList.length"
        ></span>
        개
      </p>

      <!-- create memo -->
      <el-button
        type="primary"
        icon="el-icon-edit-outline"
        class="btn-add-memo"
        @click="goAddMemo()"
        v-if="isAddMemo"
      ></el-button>
    </div>

    <!-- 새폴더 생성 -->
    <set-folder
      :set-folder-visible="setFolderVisible"
      @close="setFolderVisible = false"
    ></set-folder>
  </footer>
</template>

<script>
import SetFolder from "@/components/SetFolder.vue"
import { mapState, mapMutations } from "vuex"
import { getDatabase, ref, get, child } from "firebase/database"

export default {
  components: {
    SetFolder,
  },
  data() {
    return {
      setFolderVisible: false,
      isBtnAddFolder: false,
      isMemoCnt: true,
      isAddMemo: true,
      memoCnt: "",
      // memoColor: "#f5f5f5",
    }
  },
  computed: {
    ...mapState(["folder", "memoColor"]),
    // memoColor: {
    //   get() {
    //     return this.value
    //   },
    //   set(value) {
    //     this.value = value
    //   },
    // },
  },
  watch: {
    $route() {
      this.setFooterLayout(this.$route.path)
    },
  },
  created() {},
  mounted() {
    this.setFooterLayout(this.$route.path)
  },
  methods: {
    // 페이지 별 푸터 메뉴 show/hide
    setFooterLayout() {
      if (this.$route.path === "/") {
        // home(folder list)
        this.isMemoCnt = false
        this.isBtnAddFolder = true
        this.isAddMemo = true
        // return false
      } else if (-1 < this.$route.path.indexOf("/m")) {
        // memo
        this.isBtnAddFolder = false
        this.isMemoCnt = false
        this.isAddMemo = false
        // return false
      } else {
        // folder
        this.isBtnAddFolder = false
        this.isMemoCnt = true
        this.isAddMemo = true
      }
    },

    // 메모 생성
    goAddMemo() {
      // home에서 메모 생성할 경우 (지정한 폴더가 없을 경우) 기본폴더에 메모 생성
      if (`${this.$route.params.fid}` === "undefined") {
        this.$router.push(`/f/-Mt8WujJ-t8-fo_h9HJs/m`)
        return false
      }

      // 폴더 내에서 메모 생성할 경우 각 폴더에 메모 생성
      this.$router.push(`/f/${this.$route.params.fid}/m`)
    },
  },
}
</script>

<style lang="scss" scoped>
.footer {
  width: 100%;
  height: $footerHeight;
  margin-top: auto;
  background: $bgGray;

  &__inner {
    @include flexbox();
    height: 100%;
    padding: rem(5) rem(15);

    .memo-cnt {
      margin: 0 auto;
      font-size: rem(14);
    }

    .btn-add-folder {
      margin-right: auto;
    }
  }

  .el-button {
    font-size: rem(20);
    transform: translateY(0);
    transition: 0.2s;
    border: 0 none;
    background-color: transparent;
    line-height: 1;

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
</style>
