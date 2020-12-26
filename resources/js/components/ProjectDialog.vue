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
          <v-text-field v-model="project.project" :counter="20"></v-text-field>
        </v-card-text>
        {{ project.project }}
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
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  data: () => ({
    dialog: false,
    // addProject: "",
    project: {},
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
    ...mapActions("project", ["createProject", "updateProject"]),
    open() {
      if (this.editData) {
        this.project = Object.assign({}, this.editData);
      }
      this.dialog = true;
    },
    close() {
      this.project = {};
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
    // pushEnter(event) {
    //   if (event.isComposing || event.keyCode === 229) {
    //     return;
    //   }
    //   this.submitProject();
    // },
    // getEditData() {
    //   if (this.editData) {
    //     this.project.project = this.editData.project;
    //     this.project.id = this.editData.id;
    //   }
    // },
    //プロジェクトを登録
    registProject() {
      this.createProject(this.project).then((res) => {
        if (res === true) {
          console.log("追加したプロジェクト");
          console.log(this.project);
          alert("プロジェクトを追加しました");
        } else {
          alert("プロジェクトの追加に失敗しました");
        }
      });
      this.close();
      // const dataform = new FormData();
      // dataform.append("addProject", this.addProject);
      // axios
      //   .post("http://localhost:8001/api/project/regist", dataform)
      //   .then((res) => {
      //     console.log(res.data.regist);
      //     //this.lists.push(res.data.regist);
      //   });
      // this.close();
      // // this.$emit("regist");
      // this.addProject = null;
    },
    //プロジェクトを編集
    editProject() {
      this.updateProject(this.project).then((res) => {
        if (res === true) {
          console.log("編集したプロジェクト");
          console.log(this.project);
          alert("プロジェクトを更新しました");
        } else {
          alert("プロジェクトの更新に失敗しました");
        }
      });
      this.close();
      // const dataform = new FormData();
      // dataform.append("addProject", this.addProject);
      // dataform.append("editId", this.editData.id);
      // axios
      //   .post("http://localhost:8001/api/project/edit", dataform)
      //   .then((res) => {
      //     console.log(res.data.edit);
      //   });
    },
  },
  computed: {
    addText() {
      if (this.project.project) {
        return false;
      } else {
        return true;
      }
    },
  },
  created() {},
};
</script>
