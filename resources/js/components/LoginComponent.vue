<template>
  <v-row justify="center" align-content="center">
    <v-col cols="12" sm="10" md="5">
      <h1>Login</h1>
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
        <v-btn block color="warning" @click="login">ログイン</v-btn>
        <p class="signUpText">アカウントをお持ちでない方</p>
        <v-btn link to="/regist" block color="light-blue" class="white--text"
          >Sign up</v-btn
        >
      </v-form>
    </v-col>
  </v-row>
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
<style lang="scss" scoped>
.signUpText {
  margin-top: 40px;
  text-align: center;
  display: flex;
  align-items: center;
  &::before,
  &::after {
    content: "";
    height: 1px;
    flex-grow: 1;
    display: block;
    background-color: #666;
  }
  &::before {
    margin-right: 0.4em;
  }
  &::after {
    margin-left: 0.4em;
  }
}
// .loginForm {
//   width: 80%;
//   .v-form {
//     width: 50%;
//     margin: 0 auto;
//   }
// }
</style>