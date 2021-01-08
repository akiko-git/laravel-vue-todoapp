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
          v-model="dateMenu"
          :close-on-content-click="false"
          :return-value.sync="task.deadline"
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
            <v-btn text color="primary" @click="dateMenu = false">Cancel</v-btn>
            <v-btn text color="primary" @click="$refs.menu.save(task.deadline)"
              >OK</v-btn
            >
          </v-date-picker>
        </v-menu>
        <v-menu v-model="projectMenu" :nudge-width="200" offset-x>
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
              <v-list-item link>
                <v-list-item-title @click="handleSaveProjectId()">
                  インボックス
                </v-list-item-title>
              </v-list-item>
              <v-list-item link v-for="(list, index) in this.getProjects">
                <v-list-item-title @click="handleSaveProjectId(list.id)">
                  {{ list.project }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
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
    dateMenu: false,
    projectMenu: false,
    projectName: "",
    task: {},
    list: {},
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
    //ダイアログオープン時の処理
    open(date, taskData) {
      this.taskDialog = true;
      if (taskData) {
        this.task = Object.assign({}, taskData);
        if (this.task.inbox_flag == 1) {
          this.projectName = "インボックス";
          this.task.project_id = {};
        } else {
          const projectId = this.getProjects.find(
            ({ id }) => id === this.task.project_id
          );
          // this.task.inbox_flag = 0;
          if (projectId) {
            this.projectName = projectId.project;
            console.log("projectId.project");
            console.log(projectId.project);
          }
        }
      } else {
        this.task.inbox_flag = 1;
        this.projectName = "インボックス";
      }
      if (date) {
        this.task.deadline = date;
      }
    },
    //タスクダイアログを閉じる
    close() {
      this.task = {};
      this.taskDialog = false;
      this.$emit("editDialogClose");
    },
    //選択したプロジェクトの保存
    handleSaveProjectId(projectId) {
      if (projectId) {
        this.task.project_id = projectId;
        const project = this.getProjects.find(({ id }) => id === projectId);
        this.projectName = project.project;
        this.task.inbox_flag = 0;
      } else {
        this.task.project_id = {};
        this.task.inbox_flag = 1;
        this.projectName = "インボックス";
        console.log("インボックスだよ");
      }
      console.log("handleSaveProjectId");
      console.log(this.task);
    },
    //タスクの追加・更新
    handleSave(task) {
      if (task.id) {
        this.update(task).then((res) => {
          if (res === true) {
            alert("タスクを更新しました");
          } else {
            alert("タスクの更新に失敗しました");
          }
        });
        // console.log("idあり");
      } else {
        this.creatTask(task).then(
          (res) => {
            if (res.status === 200) {
              alert("タスクを追加しました");
            }
            // else {
            //   console.log("res");
            //   console.log(res);
            //   alert("タスクの追加に失敗しました");
            // }
          },
          (error) => {
            console.log("errorだよ");
            console.log(error);
          }
        );
        // console.log(this.task);
      }
      console.log("タスク");
      console.log(this.task);
      this.close();
    },
  },
  computed: {
    ...mapGetters("project", ["getProjects"]),
    activeSave() {
      if (this.task.title) {
        return false;
      } else {
        return true;
      }
    },
  },
  mounted() {},
  created() {},
};
</script>