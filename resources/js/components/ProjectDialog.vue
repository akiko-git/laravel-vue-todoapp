<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <slot name="activator" :on="{ click: open }"></slot>
    </template>
    <v-card>
      <v-card-title>
        <h1>入力フォーム</h1>
      </v-card-title>
      <v-card-text>
        <form>
          <v-text-field v-model="text" :counter="10"></v-text-field>
        </form>
      </v-card-text>
      <v-card-actions>
        <v-space></v-space>
        <v-btn color="blue darken-1" text @click="cancel">キャンセル</v-btn>
        <v-btn color="blue darken-1" text @click="dialog = false">追加</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data: () => ({
    dialog: false,
    text: "",
  }),
  methods: {
    open() {
      this.dialog = true;
    },
    cancel() {
      this.dialog = false;
      this.$emit("close");
    },
  },
};
</script>
