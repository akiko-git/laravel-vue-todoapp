<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <slot name="activator" :on="{ click: open }"></slot>
    </template>
    <v-card>
      <v-card-title>プロジェクトを追加</v-card-title>
      <v-divider></v-divider>
      <form @submit.prevent="registProject()">
        <v-card-text>
          <v-text-field
            v-model="addProject"
            name="project"
            :counter="20"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-space></v-space>
          <v-btn color="blue darken-1" text @click="cancel">キャンセル</v-btn>
          <v-btn
            type="submit"
            color="blue darken-1"
            text
            @click="dialog = false"
            >追加
          </v-btn>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data: () => ({
    dialog: false,
    addProject: "",
  }),
  methods: {
    open() {
      this.dialog = true;
    },
    cancel() {
      this.dialog = false;
      this.$emit("close");
    },
    registProject() {
      const dataform = new FormData();
      dataform.append("addProject", this.addProject);
      axios
        .post("http://localhost:8001/api/project/regist", dataform)
        .then((res) => {
          console.log(res.data.regist);
          //this.lists.push(res.data.regist);
        });
    },
  },
};
</script>
