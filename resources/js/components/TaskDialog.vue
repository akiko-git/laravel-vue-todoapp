<template>
  <v-dialog v-model="taskDialog" persistent max-width="600px">
    <v-card>
      <v-card-title>{{ dialogTitle }}</v-card-title>
      <v-card-text>
        <v-text-field v-model="task.title" :counter="20"></v-text-field
        >{{ task.title }}
      </v-card-text>
      <v-card-text>
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="task"
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
              {{ task.deadline }}
            </v-chip>
          </template>
          <v-date-picker v-model="task.deadline" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
            <v-btn text color="primary" @click="$refs.menu.save(task.deadline)"
              >OK</v-btn
            >
          </v-date-picker>
        </v-menu>
        <v-menu
          v-model="projectMenu"
          :close-on-content-click="false"
          :nudge-width="200"
          offset-x
        >
          <template v-slot:activator="{ on, attrs }">
            <v-chip
              class="mr-2"
              color="green"
              outlined
              v-bind="attrs"
              v-on="on"
              v-model="task.project_id"
            >
              {{ projectName }}
            </v-chip>
          </template>
          <v-card>
            <v-list>
              <v-list-item v-for="(list, index) in this.projectLists">
                <v-list-item-title @click="handleSaveProjectId(list.id)">
                  {{ list.project }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
        <!-- <v-autocomplete
          v-model="values"
          :items="this.projectLists.project"
          dense
          chips
          small-chips
          label="Outlined"
        ></v-autocomplete> -->
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
    projectMenu: false,
    projectName: "",
    projectLists: [],
    task: {},
    list: {},
    values: null,
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
      if (taskData) {
        this.task = Object.assign({}, taskData);
      }
      this.task.deadline = date;
      if (!this.task.project_id) {
        this.projectName = "インボックス";
      } else {
        // for (let i in this.projectLists) {
        //   if (this.task.project_id == this.projectLists[i].id) {
        //     this.projectName = this.projectLists[i].project;
        //   }
        // }
        const projectId = this.projectLists.find(
          ({ id }) => id === this.task.project_id
        );
        this.projectName = projectId.project;
      }
    },
    close() {
      this.taskDialog = false;
      this.$emit("close");
      this.task = {};
    },
    handleSaveProjectId(projectId) {
      this.task.project_id = projectId;
      const project = this.projectLists.find(({ id }) => id === projectId);
      this.projectName = project.project;
      console.log(this.task.project_id);
      console.log(this.projectName);
    },
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
        this.update(task).then((res) => {
          if (res === true) {
            alert("タスクを更新しました");
          } else {
            alert("タスクの更新に失敗しました");
          }
        });
        console.log("idあり");
      } else {
        this.creatTask(task).then((res) => {
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