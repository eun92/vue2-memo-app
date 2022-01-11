import Vue from "vue"
import Vuex from "vuex"
import { getDatabase, ref, onValue } from "firebase/database"
// import { getDatabase, ref, child, get } from "firebase/database"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isAddFolder: false,
    folderList: [],
    folder: {},
    memoList: [],
    memo: {},
    color: "#f5f5f5",
  },
  mutations: {
    SET_IS_ADD_FOlDER(state, toggle) {
      state.isAddFolder = toggle
    },
    SET_FOLDER_LIST(state, folderList) {
      state.folderList = folderList
    },
  },
  actions: {
    FETCH_FOLDER({ state, commit }) {
      // const dbRef = ref(getDatabase())
      // const folderList = []

      // get(child(dbRef, `folderList`))
      //   .then((snapshot) => {
      //     if (snapshot.exists()) {
      //       console.log(snapshot.val())
      //       folderList.push(snapshot.val())
      //       commit("SET_FOLDER_LIST", folderList)
      //     } else {
      //       console.log("No data available")
      //     }
      //   })
      //   .catch((error) => {
      //     console.error(error)
      //   })

      const db = getDatabase()
      const dbRef = ref(db, "folderList")

      const tempList = []

      onValue(
        dbRef,
        (snapshot) => {
          snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key
            const childData = childSnapshot.val()
            // debugger
            // console.log(childData)
            childData.key = childKey
            tempList.push(childData)
          })
        },
        {
          onlyOnce: true,
        }
      )

      commit("SET_FOLDER_LIST", tempList)
    },
  },
  modules: {},
})
