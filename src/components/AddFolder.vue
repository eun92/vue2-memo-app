<template>
  <el-dialog
    title="새로운 폴더"
    :visible.sync="isAddFolder"
    width="40%"
    center
    @opened="openPopup"
    @close="SET_IS_ADD_FOlDER(false)"
  >
    <p>폴더의 이름을 입력하세요.</p>
    <el-input
      placeholder="이름"
      v-model="input"
      clearable
      ref="input"
    ></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button @click="SET_IS_ADD_FOlDER(false)">취소</el-button>
      <el-button type="primary" @click="onAddFolder()" :disabled="!valid">
        저장
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { get } from "@firebase/database"
import { mapMutations, mapActions } from "vuex"
import { getDatabase, ref, push, set } from "firebase/database"

export default {
  components: {},
  data() {
    return {
      // dialogVisible: false,
      input: "",
      valid: false,
    }
  },
  computed: {
    isAddFolder: {
      get() {
        return this.$store.state.isAddFolder
      },
      set(value) {
        this.$store.commit("SET_IS_ADD_FOlDER", value)
      },
    },
  },
  watch: {
    input(v) {
      this.valid = v.trim().length > 0
    },
  },
  mounted() {},
  methods: {
    ...mapMutations(["SET_IS_ADD_FOlDER"]),
    ...mapActions(["FETCH_FOLDER"]),

    openPopup() {
      this.$refs.input.focus()
    },
    // orderNumCalc() {}
    onAddFolder() {
      // Create a new post reference with an auto-generated id
      const db = getDatabase()
      const folderListRef = ref(db, "folderList")
      const newFolderRef = push(folderListRef)
      set(newFolderRef, {
        title: this.input,
        orderNum: "3",
      })
        .then(() => {
          this.FETCH_FOLDER()
        })
        .catch((err) => {
          console.log(err)
        })
        .finally((_) => {
          this.SET_IS_ADD_FOlDER(false)
          this.input = ""
        })
    },
  },
}
</script>

<style></style>
