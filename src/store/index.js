import Vue from "vue"
import Vuex from "vuex"
import createPersistedState from "vuex-persistedstate"

import { getDatabase, child, get, ref, onChildAdded } from "firebase/database"

Vue.use(Vuex)

export default new Vuex.Store({
  //vuex plugin 명시
  // plugins: [createPersistedState()],
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
        const foldersKey = data.key
        const foldersData = data.val()

        // folder key 각 object에 부여 / 배열로 변경
        foldersData.key = foldersKey
        folders.push(foldersData)

        // memo length 구하기 위해 memoList key-value 형태에서 배열로 변경
        const memos = []
        for (let key in foldersData.memoList) {
          const memosData = foldersData.memoList[key]
          // console.log(memosData)
          // memosData.key = key

          memos.push(memosData)
        }

        // foldersData에 있는 memoList에 memos를 넣음
        // foldersData.memoList = []
        foldersData.memoList = memos

        // order 오름차순 정렬 0, 1, 2 ..
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
        const folderData = snapshot.val()

        // memo
        const memos = []
        for (let key in folderData.memoList) {
          // console.log(key)
          // console.log(folderData.memoList[key])
          const memoData = folderData.memoList[key]
          memoData.key = key

          memos.push(memoData)
        }

        folderData.memoList = []
        folderData.memoList = memos

        // console.log(folderData.memoList)

        // 최신 메모 ~ 오래된 메모 순으로
        folderData.memoList.sort((a, b) => {
          let dateA, dateB

          dateA = a.updatedDate ? a.updatedDate : a.createdDate
          dateB = b.updatedDate ? b.updatedDate : b.createdDate

          return new Date(dateB) - new Date(dateA)
        })

        commit("SET_FOLDER", folderData)
        // console.log(obj)
      } catch (error) {
        console.error(error)
      } finally {
      }
    },
  },
  modules: {},
})
