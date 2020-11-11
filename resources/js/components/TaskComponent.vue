<template>
  <div class="list">
    <!-- <div>{{ projectId }}</div> -->
    <ComingSoon v-if="type == 'comingSoon'" :taskList="getTasks"></ComingSoon>
    <v-card
      class="mx-auto"
      color="#E8EAF6"
      max-width="790"
      v-for="task in getTasks"
      v-if="displayList(task)"
    >
      <v-card-title>{{ task.title }}</v-card-title>
      <v-card-text class="pb-2">
        <pre class="mb-0">{{ task.text }}</pre>
      </v-card-text>
      <v-card-actions>
        <v-card-text class="pt-2 px-2">期限：{{ task.deadline }}</v-card-text>
        <v-btn icon>
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="deleteConfirm(task)">
          <v-icon>mdi-trash-can</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
    <DeleteTask
      :deleteData="deleteTask"
      :visible.sync="deleteDialog"
    ></DeleteTask>
    <!-- <v-dialog v-model="deleteDialog" persistent max-width="300">
      <v-card>
        <v-card-title>削除確認</v-card-title>
        <v-card-text
          >{{ deleteTask.title }}を削除してもよろしいですか？</v-card-text
        >
        <v-card-actions>
          <v-btn color="green darken-1" text @click="deleteDialog = false"
            >キャンセル</v-btn
          >
          <v-btn
            color="green darken-1"
            text
            @click="handlDeleteTask(deleteTask)"
            >削除</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog> -->
    <AddTask
      :projectId="projectId"
      :deadline="time"
      :category="type"
      v-if="type != 'comingSoon'"
    ></AddTask>
  </div>
</template>

<script>
import AddTask from "./AddTask";
import ComingSoon from "./ComingSoon";
import DeleteTask from "./DeleteTask";
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  components: {
    AddTask,
    ComingSoon,
    DeleteTask,
  },
  data: () => ({
    deleteDialog: false,
    deleteTask: {},
  }),
  // data() {
  //   return {
  //     // lists: [],
  //     deleteDialog: false,
  //     deleteTask: {},
  //   };
  // },
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
    // deleteTask: function (id) {
    //   axios
    //     .delete("http://localhost:8001/api/todolist/delete" + id)
    //     .then((res) => {
    //       this.$store.commit("task/fetchTasks");
    //       //this.lists.splice(res.data.success);
    //       // this.getList();
    //     });
    //   this.deleteDialog = false;
    // },
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
    ...mapGetters("task", ["getTasks"]),
  },
  created() {
    this.fetchTasks();
    this.$vuetify.lang = {
      t: () => {},
    };
    this.$vuetify.theme = { dark: false };
  },
  mounted() {},
};
</script>
<style>
.list {
  width: 80%;
}
</style>
