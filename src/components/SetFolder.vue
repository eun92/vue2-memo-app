<template>
  <el-dialog
    :title="modalTitle"
    :visible.sync="visible"
    width="80%"
    center
    @open="openPopup"
    @close="closePopup"
  >
    <p v-text="modalText"></p>
    <!-- {{ data }} -->
    <el-input
      placeholder="이름"
      v-model="input"
      clearable
      ref="input"
      maxlength="10"
      @keyup.native.enter="onSaveFolder()"
    ></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closePopup">취소</el-button>
      <el-button type="primary" @click="onSaveFolder()" :disabled="!valid">
        저장
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex"
import { getDatabase, ref, push, set, update } from "firebase/database"

export default {
  props: {
    data: {
      type: Object,
    },
    setFolderVisible: {
      type: Boolean,
      required: true,
    },
  },
  components: {},
  data() {
    return {
      visible: false,
      modalTitle: "새로운 폴더",
      modalText: "폴더의 이름을 입력하세요.",
      input: "",
      valid: false,
    }
  },
  computed: {
    ...mapState(["folderList"]),
  },
  watch: {
    input(v) {
      this.valid = v.trim().length > 0
    },
    data() {
      this.fetchData()
    },
    setFolderVisible: function (oldVal, newVal) {
      this.visible = oldVal
      // console.log(oldVal, newVal)
    },
  },
  mounted() {},
  methods: {
    ...mapActions(["FETCH_FOLDER_LIST"]),

    // 팝업 열릴 때
    openPopup() {
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },

    // 팝업 닫을 때
    closePopup() {
      this.$emit("close")

      // 새폴더 생성일 경우 취소 누르면 input 비우기
      if (!this.data) {
        this.input = ""
      }
    },

    // data 있을 경우
    fetchData() {
      this.input = this.data.title
      this.modalTitle = "폴더 이름 변경"
      this.modalText = "변경할 이름을 입력하세요."
    },

    // 폴더 저장
    onSaveFolder() {
      if (this.data) {
        this.onEditFolder()
      } else {
        this.onAddFolder()
      }
    },

    // 폴더 생성
    onAddFolder() {
      const db = getDatabase()

      const folderListRef = ref(db, "folderList")
      const newFolderRef = push(folderListRef)

      // 아무것도 입력하지 않을 경우 리턴
      if (this.input == "") {
        alert("제목을 한 글자 이상 입력하세요.")
        return
      }

      set(newFolderRef, {
        title: this.input,
      })
        .then(() => {
          // this.FETCH_FOLDER_LIST()
        })
        .catch((err) => {
          console.log(err)
        })
        .finally((_) => {
          this.visible = false
          this.input = ""
        })
    },

    // 폴더 수정
    onEditFolder() {
      const db = getDatabase()

      update(ref(db, "folderList/" + this.data.key), {
        title: this.input,
      })
        .then(() => {
          this.FETCH_FOLDER_LIST()
        })
        .catch((err) => {
          console.log(err)
        })
        .finally((_) => {
          this.visible = false
        })
    },
  },
}
</script>

<style></style>
