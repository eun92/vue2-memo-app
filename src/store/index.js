import Vue from "vue"
import Vuex from "vuex"
// import { getDatabase, ref, onValue } from "firebase/database"
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
} from "firebase/database"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    folderList: [],
    folder: {},
    memoList: [],
    memo: {},
    color: "#f5f5f5",
  },
  mutations: {
    SET_FOLDER_LIST(state, folderList) {
      // state.folderList.push(data)
      state.folderList = folderList
    },
  },
  actions: {
    // 폴더 목록 가져오기
    FETCH_FOLDER_LIST({ state, commit }) {
      // const db = getDatabase()
      // const dbRef = ref(db, "folderList")
      // const tempList = []
      // onValue(
      //   dbRef,
      //   (snapshot) => {
      //     snapshot.forEach((childSnapshot) => {
      //       const childKey = childSnapshot.key
      //       const childData = childSnapshot.val()
      //       // debugger
      //       // console.log(childData)
      //       childData.key = childKey
      //       tempList.push(childData)
      //     })
      //   },
      //   {
      //     onlyOnce: true,
      //   }
      // )
      // commit("SET_FOLDER_LIST", tempList)
      const db = getDatabase()
      const foldersRef = ref(db, "folderList")
      const folders = []

      onChildAdded(foldersRef, (data) => {
        const folderKey = data.key
        const foldersData = data.val()

        folders.push(foldersData)
        foldersData.key = folderKey
        foldersData.orderNum = folders.length - 1

        commit("SET_FOLDER_LIST", folders)
      })
    },
  },
  modules: {},
})
