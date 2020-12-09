<template>
  <div class="list">
    <ComingSoon v-if="type == 'comingSoon'" :taskList="getTasks"></ComingSoon>
    <v-row>
      <v-col cols="12" v-for="task in getTasks" v-if="displayList(task)">
        <v-card class="mx-auto" color="light-blue lighten-5" max-width="790">
          <v-card-title>{{ task.title }}</v-card-title>
          <v-card-actions>
            <v-card-text class="pt-2 px-2"
              >期限：{{ task.deadline }}</v-card-text
            >
            <v-btn icon @click="openTaskDialogAsEdit(task)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="deleteConfirm(task)">
              <v-icon>mdi-trash-can</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <p>{{ user.name }}</p>
    <div>
      <v-btn color="red" @click="logout">LOGOUT</v-btn>
    </div>

    <DeleteTask
      :deleteData="deleteTask"
      :visible.sync="deleteDialog"
    ></DeleteTask>
    <AddTask
      :projectId="projectId"
      :deadline="time"
      :category="type"
      v-if="type != 'comingSoon'"
    ></AddTask>
    <TaskDialog
      ref="taskEditDialog"
      dialogTitle="編集"
      dialogBtnText="保存"
    ></TaskDialog>
  </div>
</template>

<script>
import AddTask from "./AddTask";
import ComingSoon from "./ComingSoon";
import DeleteTask from "./DeleteTask";
import TaskDialog from "./TaskDialog";
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  components: {
    AddTask,
    ComingSoon,
    DeleteTask,
    TaskDialog,
  },
  data() {
    return {
      user: "",
      deleteDialog: false,
      deleteTask: {},
    };
  },
  methods: {
    ...mapActions("task", ["fetchTasks", "creatTask"]),
    //表示するタスク一覧
    displayList: function (task) {
      if (this.type == "inbox") {
        if (task.project_id == null) {
          return true;
        }
      } else if (this.type == "today") {
        if (this.time == task.deadline) {
          return true;
        }
      } else {
        if (task.project_id != null && task.project_id == this.projectId) {
          return true;
        } else {
          return false;
        }
      }
    },
    deleteConfirm: function (task) {
      this.deleteDialog = true;
      this.deleteTask = task;
    },
    openTaskDialogAsEdit(task) {
      this.$refs.taskEditDialog.open(task.deadline, task);
    },
    logout() {
      axios
        .get("/api/logout")
        .then((res) => {
          console.log(res);
          localStorage.removeItem("auth");
          this.$router.push("/login");
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  computed: {
    ...mapState({
      postId: (state) => state.task.projectId,
      deadline: (state) => state.task.deadline,
      category: (state) => state.task.category,
    }),
    projectId: function () {
      return this.postId;
    },
    time: function () {
      return this.deadline;
    },
    type: function () {
      return this.category;
    },
    ...mapGetters("task", ["getTasks", "getUser"]),
  },
  created() {
    // this.fetchTasks();
    // this.$vuetify.lang = {
    //   t: () => {},
    // };
    this.$vuetify.theme = { dark: false };
  },
  mounted() {
    this.fetchTasks();
    console.log("getUser");
    console.log(this.getUser);
    axios.get("/api/user").then((response) => {
      this.user = response.data;
    });
  },
};
</script>
<style>
.list {
  width: 80%;
}
</style>
