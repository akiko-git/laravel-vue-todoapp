<template>
  <v-row justify="center" align-content="center" dens>
    <v-col cols="10">
      <!-- <Calendar v-if="type == 'comingSoon'"></Calendar> -->
    </v-col>
    <v-col cols="11">{{ type }}</v-col>
    <v-col cols="11">{{ projectId }}</v-col>
    <v-col cols="11" v-for="task in getTasks" v-if="displayList(task)">
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
      <AddTask :projectId="projectId" :category="type"></AddTask>
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
    //表示するタスク一覧
    displayList: function (task) {
      if (this.type == "inbox") {
        if (task.inbox_flag === 1) {
          return true;
        }
      } else if (this.type == "project") {
        if (this.projectId == task.project_id) {
          return true;
        }
      } else {
        if (this.today == task.deadline) {
          return true;
        }
      }
      // if (this.type == "inbox") {
      //   if (task.project_id == null) {
      //     return true;
      //   }
      // } else if (this.type == "today") {
      //   if (this.time == task.deadline) {
      //     return true;
      //   }
      // } else {
      //   if (task.project_id != null && task.project_id == this.projectId) {
      //     return true;
      //   } else {
      //     return false;
      //   }
      // }
    },
    deleteConfirm: function (task) {
      this.deleteDialog = true;
      this.deleteTask = task;
    },
    openTaskDialogAsEdit(task) {
      this.$refs.taskEditDialog.open(task.deadline, task);
    },
  },
  computed: {
    // ...mapState({
    //   postId: (state) => state.task.projectId,
    //   deadline: (state) => state.task.deadline,
    //   category: (state) => state.task.category,
    // }),
    // projectId: function () {
    //   return this.postId;
    // },
    // time: function () {
    //   return this.deadline;
    // },
    // type: function () {
    //   return this.category;
    // },
    ...mapGetters("task", ["getTasks", "getUser"]),
    type: function () {
      if (this.$route.query.type) {
        return JSON.parse(decodeURIComponent(this.$route.query.type));
      }
    },
    projectId: function () {
      if (this.$route.query.id) {
        return JSON.parse(decodeURIComponent(this.$route.query.id));
      }
    },
  },
  created() {
    this.$vuetify.theme = { dark: false };
    console.log("today");
    console.log(this.today);
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

