<template>
  <v-row justify="center" align-content="center">
    <v-col cols="12" sm="10" md="5">
      <h1>Sign Up</h1>
      <v-form ref="registForm">
        <v-text-field
          v-model="registInfo.name"
          :error="errors.name"
          :error-messages="messages.name"
          @keydown="resetError('name')"
          label="ユーザー名"
        ></v-text-field>
        <v-text-field
          v-model="registInfo.email"
          :error="errors.email"
          :error-messages="messages.email"
          @keydown="resetError('email')"
          label="E-mail"
        ></v-text-field>
        <v-text-field
          v-model="registInfo.password"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show1 ? 'text' : 'password'"
          :hint="'8文字以上で入力して下さい'"
          :error="errors.password"
          :error-messages="messages.password"
          @keydown="resetError('password')"
          @click:append="show1 = !show1"
          label="パスワード"
          counter
        ></v-text-field>
        <v-btn class="mt-10" block color="warning" @click="regist">登録</v-btn>
      </v-form>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data() {
    return {
      registInfo: {},
      show1: false,
      errors: {
        name: false,
        email: false,
        password: false,
      },
      messages: {},
    };
  },
  methods: {
    regist() {
      axios
        .post("/api/regist", this.registInfo)
        .then((response) => {
          console.log("成功した時");
          this.$router.push("/login");
          console.log(response);
          // this.$router.push("/");
        })
        .catch((error) => {
          // Object.keys(error.response.data.errors).forEach((key) => {
          //   this.errors[key] = true;
          //   this.messages[key] = error.response.data.errors[key][0];
          // });
          Object.keys(error.response.data.errors).map((key) => {
            this.errors[key] = true;
            this.messages[key] = error.response.data.errors[key][0];
          });
          console.log("エラーがある時");
          console.log(this.errors);
          console.log(error.response);
        });
    },
    resetError(item) {
      this.errors[item] = false;
      this.messages[item] = null;
    },
  },
};
</script>
<style lang="scss" scoped>
</style>