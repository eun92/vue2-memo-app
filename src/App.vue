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

export default {
  name: "app",
  components: {
    AppHeader,
    AppFooter,
  },
  data() {
    return {}
  },
}
</script>

<style>
/* common css / font  */
@import "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700&display=swap";
</style>
