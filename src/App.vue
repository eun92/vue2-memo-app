<template>
  <div id="app">
    <div class="container">
      <app-header></app-header>
      <section class="content">
        <router-view></router-view>
      </section>
      <app-footer></app-footer>
    </div>
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue"
import AppFooter from "@/components/AppFooter.vue"
import { mapState } from "vuex"

export default {
  name: "app",
  components: {
    AppHeader,
    AppFooter,
  },
  data() {
    return {}
  },
  computed: {
    ...mapState(["font"]),
  },
  watch: {
    font: "updateFont",
  },
  created() {
    this.updateFont()
  },
  updated() {},
  methods: {
    updateFont() {
      const fontClass = this.font.toLowerCase().replace(/ /g, "-")

      document.querySelector("body").className = fontClass
    },
  },
}
</script>

<style>
/* icon font  */
@import "https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp";
/* default font */
@import "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700&display=swap";
/* fonts */
@import "https://fonts.googleapis.com/css2?family=Jua&family=Gothic+A1&family=Yeon+Sung&family=Gowun+Dodum&family=Nanum+Gothic:wght@400;700;800&family=Sunflower:wght@300;500;700&display=swap";
</style>
