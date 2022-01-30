import Vue from "vue"
import Vuex from "vuex"
import createPersistedState from "vuex-persistedstate"

import { getDatabase, child, get, ref, onChildAdded } from "firebase/database"

Vue.use(Vuex)

export default new Vuex.Store({
  //vuex plugin 명시
  plugins: [createPersistedState()],
  state: {
    folderList: [],
    folder: {},
    memoColor: "#f5f5f5",
    font: "Noto Sans KR",
  },
  mutations: {
    SET_FOLDER_LIST(state, folderList) {
      // state.folderList.push(data)
      state.folderList = folderList
    },
    SET_FOLDER(state, folder) {
      state.folder = folder
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
    FETCH_FOLDER_LIST({ commit }) {
      // firebase data get
      const db = getDatabase()
      const foldersRef = ref(db, `folderList`)

      // folders
      const folders = []

      onChildAdded(foldersRef, (data) => {
        const folderKey = data.key
        const foldersData = data.val()

        // memo key 각 object에 부여 및 memoList key-value 형태에서 배열로 변경
        const memos = []
        for (let key in foldersData.memoList) {
          // console.log(key)
          const memosData = foldersData.memoList[key]
          memosData.key = key

          memos.push(memosData)
        }

        // memo list 비우고 새로 넣기
        foldersData.memoList = []
        foldersData.memoList = memos

        // folder key 각 object에 부여 / 배열로 변경
        foldersData.key = folderKey

        folders.push(foldersData)

        // order 내림차순 정렬 0 ~ ..
        folders.sort((a, b) => {
          let orderA = a.orderNum
          let orderB = b.orderNum

          return orderA - orderB
        })

        // console.log(foldersData)
        commit("SET_FOLDER_LIST", folders)
      })
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

          console.log(folderData.memoList)

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
    },
  },
  modules: {},
})
