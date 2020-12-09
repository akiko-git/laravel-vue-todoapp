<template>
  <v-form ref="loginForm">
    <v-text-field
      v-model="loginInfo.email"
      label="E-mail"
      required
    ></v-text-field>
    <v-text-field
      v-model="loginInfo.password"
      label="パスワード"
      required
    ></v-text-field>
    <v-btn color="warning" @click="login">ログイン</v-btn>
  </v-form>
</template>
<script>
export default {
  data: () => ({
    loginInfo: {},
    errors: {},
  }),
  methods: {
    login() {
      axios.get("/sanctum/csrf-cookie").then((response) => {
        axios
          .post("/api/login", this.loginInfo)
          .then((response) => {
            console.log(response);
            localStorage.setItem("auth", "ture");
            this.$router.push("/");
          })
          .catch((error) => {
            this.errors = error.response.data.errors;
            console.log(error.response.data.errors);
            console.log(error);
          });
      });
    },
  },
};
</script>
<style>
.v-form {
  width: 50%;
}
</style>