import Vue from "vue"
import Vuex from "vuex"
import createPersistedState from "vuex-persistedstate"

import {
  getDatabase,
  child,
  query,
  get,
  ref,
  push,
  set,
  remove,
  onValue,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  orderByChild,
  orderByValue,
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
    FETCH_FOLDER_LIST({ state, commit, dispatch }) {
      const db = getDatabase()
      // const dbRef = ref(db, "folderList")
      const foldersRef = ref(db, `folderList`)
      const folders = []

      onChildAdded(foldersRef, (data) => {
        // console.log(data.val())

        const folderKey = data.key
        const foldersData = data.val()

        foldersData.key = folderKey
        foldersData.orderNum = folders.length

        // memo
        const memos = []
        for (let key in foldersData.memoList) {
          // console.log(key)
          const memoData = foldersData.memoList[key]
          memoData.key = key

          memos.push(memoData)
        }

        foldersData.memoList = []
        foldersData.memoList = memos

        folders.push(foldersData)

        // console.log(foldersData)
        commit("SET_FOLDER_LIST", folders)
      }),
        onChildChanged(foldersRef, (data) => {}),
        onChildRemoved(foldersRef, (data) => {
          // DELETE_FOLDER()
        })
    },

    // DELETE_FOLDER({ state, dispatch }, { key }) {
    //   const db = getDatabase()

    //   remove(ref(db, "folderList/" + key), {}).then((_) => {
    //     dispatch("FETCH_FOLDER_LIST", { key: state.folderList.key })
    //   })
    //   console.log("ddd")
    // },

    // 폴더 데이터 가져오기
    async FETCH_FOLDER({ dispatch, commit }, { key }) {
      const dbRef = ref(getDatabase())
      try {
        // const db = getDatabase()

        // const snapshot = query(
        //   ref(db, `folderList/${key}`),
        //   orderByChild("updatedDate")
        // )
        // console.log(snapshot.val())

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

          // console.log(folderData.memoList)

          // 최신 메모 ~ 오래된 메모 순으로
          folderData.memoList.sort((a, b) => {
            let dateA = a.createdDate
            // console.log(a.updatedDate)
            if (a.updatedDate) {
              dateA = a.updatedDate
            }

            let dateB = b.createdDate
            // console.log(b.updatedDate)
            if (b.updatedDate) {
              dateB = b.updatedDate
            }

            return new Date(dateB) - new Date(dateA)
          })

          commit("SET_FOLDER", folderData)
          // console.log(obj)
        } else {
          console.log("No data available")
        }
      } catch (error) {
        console.error(error)
      } finally {
      }
      // commit("SET_FOLDER", folderData)

      // const db = getDatabase()

      // onChildAdded(folderRef, (data) => {
      //   console.log(data.val())

      //   // memo
      //   const memos = []

      //   for (let key in data.val()) {
      //     // console.log(key)
      //     // console.log(data.val().memoList[key])
      //     const memoData = data.val()[key]
      //     memoData.key = key

      //     memos.push(memoData)
      //   }

      //   const folderData = data.val()

      //   folderData = []
      //   folderData = memos.reverse()

      //   // console.log(memos)
      //   // commit("SET_MEMO_LIST", memos)
      //   commit("SET_FOLDER", folderData)
      //   // console.log(obj)

      //   // dispatch(
      //   //   "ADD_MEMO",
      //   //   (data.val().title,
      //   //   data.val().body,
      //   //   data.val().createdDate,
      //   //   data.val().color)
      //   // )
      //   // data.val().title,
      //   // data.val().body,
      //   // data.val().created
      // })

      // const db = getDatabase()
      // const folderRef = ref(db, `folderList/${key}`)

      // onChildAdded(folderRef, (data) => {
      //   dispatch(
      //     "ADD_MEMO",
      //     (data.val().title,
      //     data.val().body,
      //     data.val().createdDate,
      //     data.val().color)
      //   )
      //   console.log("ddd")
      // })

      // onChildRemoved(folderRef, (data) => {
      //   deleteComment(postElement, data.key)
      // })
    },

    // ADD_MEMO({ state, commit }, { title, body, createdDate, color }) {
    //   const db = getDatabase()
    //   const memoListRef = ref(db, `folderList/${state.folder.key}/memoList`)
    //   const newMemoRef = push(memoListRef)

    //   // 데이터 저장
    //   set(newMemoRef, {
    //     title,
    //     body,
    //     createdDate,
    //     color,
    //   }).then(() => {
    //     commit("SET_MEMO_COLOR", color)
    //   })
    // },
  },
  modules: {},
})
