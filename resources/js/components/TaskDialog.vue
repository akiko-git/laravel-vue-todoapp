<template>
  <v-dialog v-model="taskDialog" persistent max-width="600px">
    <v-card>
      <v-card-title>{{ dialogTitle }}</v-card-title>
      <v-card-text>
        <v-text-field v-model="task.title" :counter="20"></v-text-field>
      </v-card-text>
      <v-card-text>
        <v-chip class="mr-2" color="primary" outlined @click="deadline">
          <v-icon left>mdi-calendar-today</v-icon>
          {{ day }}
        </v-chip>
        <v-chip class="mr-2" color="green" outlined @click="editProject">
          {{ projectName }}
        </v-chip>
      </v-card-text>
      <v-card-actions>
        <v-btn color="blue darken-1" text @click="close">キャンセル</v-btn>
        <v-btn
          type="submit"
          color="blue darken-1"
          text
          :disabled="activeSave"
          @click="handleSave(task)"
          >{{ dialogBtnText }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  data: () => ({
    taskDialog: false,
    start: null,
    end: null,
    inputTitle: "",
    day: "",
    projectName: "",
    projectLists: [],
    task: {},
  }),
  props: {
    dialogTitle: {
      type: String,
    },
    dialogBtnText: {
      type: String,
    },
    taskData: {
      type: [Object, String],
      default: "",
    },
  },
  methods: {
    ...mapActions("task", ["fetchTasks", "creatTask", "delete", "update"]),
    open(date) {
      this.task = {};
      this.taskDialog = true;
      this.day = date;
      this.task.title = this.taskData.name;
      this.task.id = this.taskData.taskId;
      if (!this.taskData.projectId) {
        this.projectName = "インボックス";
      } else {
        for (let i in this.projectLists) {
          if (this.taskData.projectId == this.projectLists[i].id) {
            this.projectName = this.projectLists[i].project;
          }
        }
      }
    },
    close() {
      this.taskDialog = false;
      this.$emit("close");
    },
    deadline() {},
    editProject() {},
    // プロジェクトの一覧を取得
    getProjectList() {
      axios.get("http://localhost:8001/api/project/show").then((res) => {
        this.projectLists = res.data.getProjectList;
        return true;
      });
    },
    //保存
    handleSave(task) {
      if (task.id) {
        console.log("idあり");
      } else {
        console.log("idなし");
      }
    },
  },
  computed: {
    activeSave() {
      if (this.inputTitle) {
        return false;
      } else {
        return true;
      }
    },
  },
  mounted() {},
  created() {
    this.getProjectList();
  },
};
</script>