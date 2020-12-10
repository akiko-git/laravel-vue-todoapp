<template>
  <v-row justify="center" align-content="center">
    <v-col cols="12" sm="10" md="5">
      <h1>Sign Up</h1>
      <v-form ref="registForm">
        <v-text-field
          v-model="registInfo.name"
          label="ユーザー名"
          required
        ></v-text-field>
        <v-text-field
          v-model="registInfo.email"
          label="E-mail"
          required
        ></v-text-field>
        <v-text-field
          v-model="registInfo.password"
          label="パスワード"
          required
        ></v-text-field>
        <v-btn block color="warning" @click="regist">登録</v-btn>
      </v-form>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data() {
    return {
      registInfo: {},
      errors: {},
    };
  },
  methods: {
    regist() {
      axios
        .post("/api/regist", this.registInfo)
        .then((response) => {
          console.log(response);
          // this.$router.push("/");
        })
        .catch((error) => {
          this.errors = error.response.data.errors;
          console.log(error.response.data.errors);
          console.log(error);
        });
    },
  },
};
</script>