<template>
  <v-app>
    <Header v-if="$route.name === 'task' || $route.name === 'calendar'" />
    <v-main>
      <v-container class="fill-height" fluid>
        <v-layout justify-center align-center wrap>
          <RouterView />
        </v-layout>
      </v-container>
    </v-main>
    <!-- <Footer v-if="$route.name === 'task'" /> -->
  </v-app>
</template>

<script>
import Header from "./components/Header";
import Footer from "./components/Footer";

export default {
  components: {
    Header,
    Footer,
  },
};
</script>
