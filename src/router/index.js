import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../views/home.vue"
import Folder from "../views/folder.vue"
import Memo from "../views/memo.vue"
import NotFound from "../views/notFound.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/f/:fid",
    name: "Folder",
    component: Folder,
    children: [
      // memo 생성 : mid(key) 없음
      {
        path: "m",
        name: "Create Memo",
        component: Memo,
      },
      // memo 상세/수정 : mid(key) 있음
      {
        path: "m/:mid",
        name: "Update Memo",
        component: Memo,
      },
    ],
  },
  {
    path: "*",
    component: NotFound,
  },
  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue"),
  // },
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
})

// NavigationDuplicated Error 해결
// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch((err) => {
//     if (err.name !== "NavigationDuplicated") throw err
//   })
// }

export default router
