<template>
  <div class="memo">
    <!-- 제목 -->
    <div class="memo__title">
      <el-input v-model="input"></el-input>
    </div>

    <!-- 본문 -->
    <div class="memo__body">
      <el-input
        type="textarea"
        :rows="2"
        placeholder="Please input"
        v-model="textarea"
      >
      </el-input>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: "",
      textarea: "",
    }
  },
}
</script>

<style lang="scss" scoped>
.memo {
  &__title {
    height: rem(100);
    padding: rem(20);
    background: $bgGray;
  }

  &__body {
    padding: rem(20);
  }
}
</style>
