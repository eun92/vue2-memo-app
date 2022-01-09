<template>
  <div class="search">
    <el-input
      placeholder="검색어를 입력하세요."
      prefix-icon="el-icon-search"
      v-model="input"
      clearable
    ></el-input>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: "",
    }
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
::v-deep .el-input {
  &__inner {
    background: $bgGray;
    color: #989898;
    border-radius: 30px;
    border-color: transparent;

    &:focus {
      border-color: #d6d6d6;
    }
  }

  &__icon {
    font-size: rem(18);
  }

  &__clear {
    font-size: rem(22);
  }
}
</style>
