<template>
  <div class="search">
    <!-- <div class="search-form">
      <b-icon icon="search" font-scale="1.3"></b-icon>
      <b-form @submit="onSubmit" @reset="onReset" v-if="show">
        <b-form-input
          id="input-1"
          v-model="form.search"
          type="text"
          placeholder="검색어를 입력하세요."
          required
        ></b-form-input>
      </b-form>
      <b-icon icon="x-circle-fill" font-scale="1.3"></b-icon>
    </div> -->

    <!-- {{ form }} -->
    <el-input placeholder="Please input" v-model="input"></el-input>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // form: {
      //   search: "",
      // },
      // show: true,
      input: "",
    }
  },
  methods: {
    // onSubmit(event) {
    //   event.preventDefault()
    //   alert(JSON.stringify(this.form))
    // },
    // onReset(event) {
    //   event.preventDefault()
    //   // Reset our form values
    //   this.search = ""
    //   // Trick to reset/clear native browser form validation state
    //   this.show = false
    //   this.$nextTick(() => {
    //     this.show = true
    //   })
    // },
  },
}
</script>

<style lang="scss" scoped>
// $bgGray: #f5f5f5;

.search-form {
  display: flex;
  align-items: center;
  padding: 2px 15px;
  background: #f5f5f5;
  color: #989898;
  border-radius: 30px;

  form {
    flex-grow: 1;
  }

  .form-control {
    border: 0 none;
    background: transparent;

    &:focus {
      box-shadow: none;
    }
  }
}
</style>
