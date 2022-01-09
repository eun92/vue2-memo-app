import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../views/home.vue"
import Folder from "../components/Folder.vue"
import Memo from "../components/Memo.vue"
import NotFound from "../components/NotFound.vue"

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
      {
        path: "m/:mid",
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

export default router
