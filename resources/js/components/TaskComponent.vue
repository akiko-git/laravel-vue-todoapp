<template>
  <v-row justify="center" align-content="center" dens>
    <v-col cols="11">{{ type }}</v-col>
    <v-col cols="11">{{ projectId }}</v-col>
    <v-col cols="11" v-for="(task, index) in filteredTasks">
      <v-card class="mx-auto" color="light-blue lighten-5" max-width="790">
        <v-card-title class="pa-2 pb-0">
          <v-checkbox
            dense
            hide-details
            on-icon="mdi-check-circle-outline"
            off-icon="mdi-checkbox-blank-circle-outline"
            color="indigo"
            class="mt-0"
            v-model="selected[index]"
            @change="done(task, index)"
          >
            <template v-slot:label
              ><div class="redio_text">
                {{ task.title }}
              </div>
            </template>
          </v-checkbox>
        </v-card-title>
        <v-card-actions class="pt-0">
          <v-card-text class="pa-0">期限：{{ task.deadline }}</v-card-text>
          <v-btn icon @click="openTaskDialogAsEdit(task)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="deleteConfirm(task)">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="10">
      <p>{{ getUser.name }}</p>

      <DeleteTask
        :deleteData="deleteTask"
        :visible.sync="deleteDialog"
      ></DeleteTask>
      <AddTask :projectId="projectId" :type="type"></AddTask>
      <TaskDialog
        ref="taskEditDialog"
        dialogTitle="編集"
        dialogBtnText="保存"
      ></TaskDialog>
    </v-col>
  </v-row>
</template>

<script>
import moment from "moment";
import AddTask from "./AddTask";
import DeleteTask from "./DeleteTask";
import TaskDialog from "./TaskDialog";
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  components: {
    AddTask,
    DeleteTask,
    TaskDialog,
  },
  data() {
    return {
      deleteDialog: false,
      deleteTask: {},
      today: moment().format("YYYY-MM-DD"),
      selected: {},
    };
  },
  methods: {
    ...mapActions("task", ["fetchTasks", "creatTask", "update", "doneTask"]),
    deleteConfirm(task) {
      this.deleteDialog = true;
      this.deleteTask = task;
    },
    openTaskDialogAsEdit(task) {
      this.$refs.taskEditDialog.open(task.deadline, task);
    },
    //タスクの完了
    done(task, index) {
      if (this.selected[index] === true) {
        //ストアのタスクから取得
        const editStatusTask = this.getTasks.find((o) => {
          return o.id === task.id;
        });
        //ストアのイベントから取得
        const editStatusEvent = this.getEvents.find((o) => {
          return o.taskId === task.id;
        });
        if (editStatusTask && editStatusEvent) {
          this.doneTask({ editStatusTask, editStatusEvent }).then((res) => {
            this.selected[index] = false;
            if (res === true) {
              alert("タスクを完了しました");
            } else {
              alert("タスクの完了に失敗しました");
            }
          });
        } else {
          alert("タスクの完了に失敗しました");
        }
      }
    },
  },
  computed: {
    ...mapGetters("task", ["getTasks", "getEvents", "getUser"]),
    type() {
      if (this.$route.query.type) {
        return JSON.parse(decodeURIComponent(this.$route.query.type));
      }
    },
    projectId() {
      if (this.$route.query.id) {
        return JSON.parse(decodeURIComponent(this.$route.query.id));
      }
    },
    //表示するタスクをフィルター
    filteredTasks() {
      console.log("this.getTasks");
      console.log(this.getTasks);

      if (this.type === "inbox") {
        return this.getTasks.filter(
          (task) => task.inbox_flag === 1 && task.status === 1
        );
      } else if (this.type === "project") {
        return this.getTasks.filter(
          (task) => this.projectId == task.project_id && task.status === 1
        );
      } else {
        return this.getTasks.filter(
          (task) => this.today == task.deadline && task.status === 1
        );
      }
    },
  },
  created() {
    this.$vuetify.theme = { dark: false };
  },
  mounted() {
    // axios.get("/api/user").then((response) => {
    //   this.user = response.data;
    // });
  },
};
</script>
<style lang="scss" scoped>
.list {
  width: 80%;
}
.redio_text {
  position: relative;
  top: 2.5px;
}
</style>

