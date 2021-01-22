<template>
  <v-row justify="center" align-content="center">
    <v-col cols="12" sm="10" md="5">
      <h1>Sign Up</h1>
      <v-form ref="registForm">
        <v-text-field
          v-model="registInfo.name"
          :error="errors.name"
          :error-messages="messages.name"
          label="ユーザー名"
          @keydown="resetError('name')"
        />
        <v-text-field
          v-model="registInfo.email"
          :error="errors.email"
          :error-messages="messages.email"
          label="E-mail"
          @keydown="resetError('email')"
        />
        <v-text-field
          v-model="registInfo.password"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show1 ? 'text' : 'password'"
          :hint="'8文字以上で入力して下さい'"
          :error="errors.password"
          :error-messages="messages.password"
          label="パスワード"
          counter
          @keydown="resetError('password')"
          @click:append="show1 = !show1"
        />
        <v-btn class="mt-10" block color="warning" @click="regist">
          登録
        </v-btn>
      </v-form>
    </v-col>
  </v-row>
</template>
<script>
  import { mapActions, mapGetters } from 'vuex';
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
    computed: {
      ...mapGetters('auth', [
        'check',
        'username',
        'getApiStatus',
        'getRegisterErrorMessage',
      ]),
    },
    created() {
      this.clearRegisterErrorMessage();
    },
    methods: {
      ...mapActions('auth', ['register', 'clearRegisterErrorMessage']),
      regist() {
        this.register(this.registInfo).then(() => {
          //登録成功
          if (this.getApiStatus) {
            this.$router.push('/login');
          }
          //バリデーションエラー
          if (this.getApiStatus === false && this.getRegisterErrorMessage) {
            console.log('422だよ');
            Object.keys(this.getRegisterErrorMessage).forEach((key) => {
              this.errors[key] = true;
              this.messages[key] = this.getRegisterErrorMessage[key][0];
            });
          }
        });
      },
      resetError(item) {
        this.errors[item] = false;
        this.messages[item] = null;
      },
    },
  };
</script>
<style lang="scss" scoped></style>
