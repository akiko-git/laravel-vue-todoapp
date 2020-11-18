<template>
  <v-dialog v-model="taskDialog" persistent max-width="600px">
    <v-card>
      <v-card-title>{{ dialogTitle }}</v-card-title>
      <v-card-text>
        <v-text-field v-model="task.title" :counter="20"></v-text-field
        >{{ task.title }}
      </v-card-text>
      <!-- <v-card-text>
        <v-text-field v-model="newtask.title" :counter="20"></v-text-field
        >{{ newtask.title }}
      </v-card-text>
 -->
      <v-card-text>
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="task.date"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-chip
              v-bind="attrs"
              v-on="on"
              class="mr-2"
              color="primary"
              outlined
            >
              <v-icon left>mdi-calendar-today</v-icon>
              {{ task.date }}
            </v-chip>
          </template>
          <v-date-picker v-model="task.date" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
            <v-btn text color="primary" @click="$refs.menu.save(task.date)"
              >OK</v-btn
            >
          </v-date-picker>
        </v-menu>

        <!-- <v-chip
          class="mr-2"
          color="primary"
          outlined
          @click="date"
          v-model="task.date"
        >
          <v-icon left>mdi-calendar-today</v-icon>
          {{ task.date }}
        </v-chip> -->
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
    menu: false,
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
  },
  methods: {
    ...mapActions("task", ["fetchTasks", "creatTask", "delete", "update"]),
    open(date, taskData) {
      this.taskDialog = true;
      this.task.date = date;
      if (taskData) {
        this.task = Object.assign({}, taskData);
      }
      if (!this.task.project_id) {
        this.projectName = "インボックス";
      } else {
        for (let i in this.projectLists) {
          if (this.task.project_id == this.projectLists[i].id) {
            this.projectName = this.projectLists[i].project;
          }
        }
      }
    },
    close() {
      this.taskDialog = false;
      this.$emit("close");
      this.task = {};
    },
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
        this.creatTask(this.task).then((res) => {
          if (res === true) {
            alert("タスクを追加しました");
          } else {
            alert("タスクの追加に失敗しました");
          }
        });
        console.log(this.task);
      }
    },
  },
  computed: {
    activeSave() {
      if (this.task.title) {
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