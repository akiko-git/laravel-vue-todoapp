<template>
  <v-row justify="center" align-content="center">
    <v-col cols="12" sm="10" md="5">
      <h1>Login</h1>
      <v-form ref="loginForm">
        <v-text-field
          v-model="loginInfo.email"
          label="E-mail"
          :error="errors.email"
          :error-messages="messages.email"
          @keydown="resetError('email')"
        ></v-text-field>
        <v-text-field
          v-model="loginInfo.password"
          label="パスワード"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show1 ? 'text' : 'password'"
          :error="errors.password"
          :error-messages="messages.password"
          @click:append="show1 = !show1"
          @keydown="resetError('password')"
        ></v-text-field>
        <div class="red--text mt-2" v-if="loginFailur">
          メールアドレスまたはパスワードが違います
        </div>
        <v-btn block class="mt-6" color="warning" @click="loginBtn"
          >ログイン</v-btn
        >
        <p class="signUpText">アカウントをお持ちでない方</p>
        <v-btn link to="/regist" block color="light-blue" class="white--text"
          >Sign up</v-btn
        >
      </v-form>
    </v-col>
  </v-row>
</template>
<script>
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      loginInfo: {},
      errors: {
        email: false,
        password: false,
      },
      messages: {},
      loginFailur: false,
      show1: false,
    };
  },
  computed: {
    ...mapGetters("auth", [
      "check",
      "username",
      "getApiStatus",
      "getLoginErrorMessage",
    ]),
  },
  methods: {
    ...mapActions("auth", ["login", "clearLoginErrorMessage"]),
    loginBtn() {
      axios.get("/sanctum/csrf-cookie").then((response) => {
        this.login(this.loginInfo).then((res) => {
          //認証成功
          if (this.getApiStatus) {
            localStorage.setItem("auth", "ture");
            this.$router.push("/task");
          }
          //バリデーションエラー
          if (this.getLoginErrorMessage) {
            Object.keys(this.getLoginErrorMessage).forEach((key) => {
              this.errors[key] = true;
              this.messages[key] = this.getLoginErrorMessage[key][0];
            });
          }
          //メールアドレス・パスワードの不一致
          if (res === 401) {
            this.loginFailur = true;
          }
        });
      });

      // axios.get("/sanctum/csrf-cookie").then((response) => {
      //   axios
      //     .post("/api/login", this.loginInfo)
      //     .then((response) => {
      //       // console.log(response);
      //       localStorage.setItem("auth", "ture");
      //       this.$router.push("/task");
      //     })
      //     .catch((error) => {
      //       if (error.response.status == 401) {
      //         this.loginFailur = true;
      //       } else {
      //         Object.keys(error.response.data.errors).forEach((key) => {
      //           this.errors[key] = true;
      //           this.messages[key] = error.response.data.errors[key][0];
      //         });
      //       }
      //     });
      // });
    },
    resetError(item) {
      this.errors[item] = false;
      this.messages[item] = "";
      this.loginFailur = false;
    },
  },
  created() {
    this.clearLoginErrorMessage();
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