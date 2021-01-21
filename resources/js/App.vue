<template>
  <v-app>
    <Header v-if="$route.name === 'task' || $route.name === 'calendar'" />
    <v-main>
      <!-- <v-container class="fill-height" fluid> -->
      <v-layout justify-center align-center wrap>
        <RouterView />
      </v-layout>
      <!-- </v-container> -->
    </v-main>
    <!-- <Footer v-if="$route.name === 'task'" /> -->
  </v-app>
</template>

<script>
import Header from "./components/Header";
import Footer from "./components/Footer";
import {
  NOT_FOUND,
  UNAUTHORIZED,
  CSRF_UNAUTHORIZED,
  INTERNAL_SERVER_ERROR,
} from "./util";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  components: {
    Header,
    Footer,
  },
  methods: {
    ...mapActions("auth", ["clearUser"]),
  },
  computed: {
    // ...mapGetters("error", ["getCode"]),
    errorCode() {
      return this.$store.state.error.code;
    },
  },
  watch: {
    errorCode: {
      async handler(val) {
        if (val === INTERNAL_SERVER_ERROR) {
          //500
          console.log("500だよ");
          this.$router.push("/500");
        } else if (val === CSRF_UNAUTHORIZED || val === UNAUTHORIZED) {
          //401・419
          console.log("419だよ");
          //authストアのuserをクリア
          this.clearUser;
          //ローカルストレージをクリア
          localStorage.removeItem("auth");
          this.$router.go(this.$router.currentRoute.path);
          this.$router.push("/login");
        } else if (val === NOT_FOUND) {
          //404
          this.$router.push("/not-found");
        }
        immediate: true;
      },
      $route() {
        this.$store.commit("error/setCode", null);
      },
    },
  },
};
</script>
