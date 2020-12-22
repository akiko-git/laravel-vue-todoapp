<template>
  <v-row justify="center" align-content="center" dens>
    <v-col cols="10">
      <!-- <Calendar v-if="type == 'comingSoon'"></Calendar> -->
    </v-col>
    <v-col cols="11">{{ type }}</v-col>
    <v-col cols="11">{{ projectId }}</v-col>
    <v-col cols="11" v-for="task in filteredTasks">
      <v-card class="mx-auto" color="light-blue lighten-5" max-width="790">
        <v-card-title>{{ task.title }}</v-card-title>
        <v-card-actions>
          <v-card-text class="pt-2 px-2">期限：{{ task.deadline }}</v-card-text>
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
// import Calendar from "./CalendarComponent";
import DeleteTask from "./DeleteTask";
import TaskDialog from "./TaskDialog";
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  components: {
    AddTask,
    // Calendar,
    DeleteTask,
    TaskDialog,
  },
  data() {
    return {
      deleteDialog: false,
      deleteTask: {},
      today: moment().format("YYYY-MM-DD"),
    };
  },
  methods: {
    ...mapActions("task", ["fetchTasks", "creatTask", "fetchUser"]),
    deleteConfirm(task) {
      this.deleteDialog = true;
      this.deleteTask = task;
    },
    openTaskDialogAsEdit(task) {
      this.$refs.taskEditDialog.open(task.deadline, task);
    },
  },
  computed: {
    ...mapGetters("task", ["getTasks", "getUser"]),
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
      if (this.type === "inbox") {
        return this.getTasks.filter((task) => task.inbox_flag === 1);
      } else if (this.type === "project") {
        return this.getTasks.filter(
          (task) => this.projectId == task.project_id
        );
      } else {
        return this.getTasks.filter((task) => this.today == task.deadline);
      }
    },
  },
  created() {
    this.$vuetify.theme = { dark: false };
  },
  mounted() {
    this.fetchUser();
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
</style>

