<template>
  <div class="not-found"><strong>404</strong> 페이지를 찾을 수 없습니다.</div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.not-found {
  @include flexbox($jc: center);
  flex-direction: column;
  height: 100%;
  font-size: rem(30);
  text-align: center;

  strong {
    display: block;
    font-size: rem(40);
  }
}
</style>
