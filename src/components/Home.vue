<template>
  <div class="home">
    <h2 class="title">폴더</h2>
    <search></search>
  </div>
</template>

<script>
import Search from "../components/Search.vue"

export default {
  name: "Home",
  components: {
    Search,
  },
  data() {
    return {}
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home {
  /* height: 700px; */
}
</style>
