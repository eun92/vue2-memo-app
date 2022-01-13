<template>
  <footer class="footer">
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
      <p class="memo-cnt" v-if="isMemoCnt">총 <span>2</span> 개</p>

      <!-- create memo -->
      <el-button
        type="primary"
        icon="el-icon-edit-outline"
        class="btn-add-memo"
        @click="goAddMemo()"
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
import { mapMutations } from "vuex"

export default {
  components: {
    SetFolder,
  },
  data() {
    return {
      setFolderVisible: false,
      isBtnAddFolder: false,
      isMemoCnt: true,
    }
  },
  watch: {
    $route() {
      this.setFooterLayout(this.$route.path)
    },
  },
  mounted() {
    this.setFooterLayout(this.$route.path)
  },
  methods: {
    setFooterLayout() {
      if (this.$route.path === "/") {
        this.isMemoCnt = false
        this.isBtnAddFolder = true
        // console.log(path)
        return false
      }

      this.isBtnAddFolder = false
      this.isMemoCnt = true
    },

    goAddMemo() {
      console.log("add memo")
    },
  },
}
</script>

<style lang="scss" scoped>
.footer {
  width: 100%;
  height: $footerHeight;
  margin-top: auto;
  background: #f5f5f5;

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
