<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <slot name="activator" :on="{ click: open }"></slot>
    </template>
    <v-card>
      <v-card-title>プロジェクトを{{ dialogTitle }}</v-card-title>
      <v-divider></v-divider>
      <form @submit.prevent="submitProject()">
        <v-card-text>
          <v-text-field
            v-model="addProject"
            :counter="20"
            @keydown.enter.exact="submitProject()"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="close">キャンセル</v-btn>
          <v-btn type="submit" color="blue darken-1" text :disabled="addText">{{
            dialogBtnText
          }}</v-btn>
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
  props: {
    dialogTitle: {
      type: String,
      default: "追加",
      //required: true,
    },
    dialogBtnText: {
      type: String,
      default: "追加",
    },
    editData: Object,
  },
  methods: {
    open() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.$emit("close");
    },
    //フォーム送信
    submitProject() {
      if (this.editData) {
        this.editProject();
      } else {
        this.registProject();
      }
    },
    getEditData() {
      if (this.editData) {
        this.addProject = this.editData.project;
      }
    },
    //プロジェクトを登録
    registProject() {
      const dataform = new FormData();
      dataform.append("addProject", this.addProject);
      axios
        .post("http://localhost:8001/api/project/regist", dataform)
        .then((res) => {
          console.log(res.data.regist);
          //this.lists.push(res.data.regist);
        });
      this.close();
      this.$emit("regist");
      this.addProject = null;
    },
    //プロジェクトを編集
    editProject() {
      const dataform = new FormData();
      dataform.append("addProject", this.addProject);
      dataform.append("editId", this.editData.id);
      axios
        .post("http://localhost:8001/api/project/edit", dataform)
        .then((res) => {
          console.log(res.data.edit);
        });
      this.close();
      this.$emit("regist");
      //this.addProject = null;
    },
  },
  computed: {
    addText() {
      if (this.addProject) {
        return false;
      } else {
        return true;
      }
    },
  },
  created() {
    this.getEditData();
  },
};
</script>
