import Vue from "vue"
import Vuex from "vuex"
import createPersistedState from "vuex-persistedstate"

import {
  getDatabase,
  child,
  get,
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
    memo: {},
    memoColor: "#f5f5f5",
    font: "Noto Sans KR",
  },
  //vuex plugin 명시
  plugins: [createPersistedState()],
  mutations: {
    SET_FOLDER_LIST(state, folderList) {
      // state.folderList.push(data)
      state.folderList = folderList
    },
    SET_FOLDER(state, folder) {
      state.folder = folder
    },
    SET_MEMO(state, payload) {
      state.memo = payload
    },
    SET_MEMO_COLOR(state, color) {
      state.memoColor = color || "#f5f5f5"
    },
    SET_FONT(state, font) {
      state.font = font
    },
  },
  actions: {
    // 폴더 목록 가져오기
    FETCH_FOLDER_LIST({ state, commit }) {
      const db = getDatabase()
      const dbRef = ref(db, "folderList")
      const folders = []

      onValue(
        dbRef,
        (snapshot) => {
          snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key
            const childData = childSnapshot.val()
            // debugger
            // console.log(childData)
            childData.key = childKey
            childData.orderNum = folders.length

            // memo
            const memos = []
            for (let key in childData.memoList) {
              // console.log(key)
              const memoData = childData.memoList[key]
              memoData.key = key

              memos.push(memoData)
            }

            childData.memoList = []
            childData.memoList = memos

            folders.push(childData)
          })
        },
        {
          onlyOnce: true,
        }
      )
      commit("SET_FOLDER_LIST", folders)
    },

    // 폴더 데이터 가져오기
    async FETCH_FOLDER({ commit }, { key }) {
      const dbRef = ref(getDatabase())
      try {
        const snapshot = await get(child(dbRef, `folderList/${key}`))
        if (snapshot.exists()) {
          // memo
          const memos = []
          for (let key in snapshot.val().memoList) {
            // console.log(key)
            // console.log(snapshot.val().memoList[key])
            const memoData = snapshot.val().memoList[key]
            memoData.key = key

            memos.push(memoData)
          }

          const folderData = snapshot.val()

          folderData.memoList = []
          folderData.memoList = memos

          // console.log(memos)
          // commit("SET_MEMO_LIST", memos)
          commit("SET_FOLDER", folderData)
          // console.log(obj)
        } else {
          console.log("No data available")
        }
      } catch (error) {
        console.error(error)
      } finally {
      }

      // const dbRef = ref(getDatabase())
      // await get(child(dbRef, `folderList/${key}`))
      //   .then((snapshot) => {
      //     if (snapshot.exists()) {
      //       // memo
      //       const memos = []
      //       for (let key in snapshot.val().memoList) {
      //         // console.log(key)
      //         // console.log(snapshot.val().memoList[key])
      //         const memoData = snapshot.val().memoList[key]
      //         memoData.key = key

      //         memos.push(memoData)
      //       }

      //       const folderData = snapshot.val()

      //       folderData.memoList = []
      //       folderData.memoList = memos

      //       // console.log(memos)
      //       // commit("SET_MEMO_LIST", memos)
      //       commit("SET_FOLDER", folderData)
      //       // console.log(obj)
      //     } else {
      //       console.log("No data available")
      //     }
      //   })
      //   .catch((error) => {
      //     console.error(error)
      //   })
      //   .finally(() => {})
    },
  },
  modules: {},
})
