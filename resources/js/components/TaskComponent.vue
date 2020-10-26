<template>
  <div class="list">
    <!-- <div>{{ projectId }}</div> -->
    <ComingSoon v-if="type == 'comingSoon'"></ComingSoon>
    <v-card
      class="mx-auto"
      color="#E8EAF6"
      max-width="790"
      v-for="list in lists"
      v-if="displayList(list)"
    >
      <v-card-title>{{ list.title }}</v-card-title>
      <v-card-text class="pb-2">
        <pre class="mb-0">{{ list.text }}</pre>
      </v-card-text>
      <v-card-actions>
        <v-card-text class="pt-2 px-2">期限：{{ list.deadline }}</v-card-text>
        <v-icon @click="deleteConfirm(list.id, list.title)"
          >mdi-trash-can</v-icon
        >
      </v-card-actions>
    </v-card>
    <v-dialog v-model="deleteDialog" persistent max-width="300">
      <v-card>
        <v-card-title>削除確認</v-card-title>
        <v-card-text>{{ deleteTitle }}を削除してもよろしいですか？</v-card-text>
        <v-card-actions>
          <v-btn color="green darken-1" text @click="deleteDialog = false"
            >キャンセル</v-btn
          >
          <v-btn color="green darken-1" text @click="deleteTask(deleteID)"
            >削除</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <AddTask
      :projectId="projectId"
      :deadline="time"
      :category="type"
      @success="getAddTasc"
    ></AddTask>
  </div>
</template>

<script>
import AddTask from "./AddTask";
import ComingSoon from "./ComingSoon";
import { mapState } from "vuex";
export default {
  components: {
    AddTask,
    ComingSoon,
  },
  data() {
    return {
      lists: [],
      deleteDialog: false,
      deleteID: null,
      deleteTitle: null,
    };
  },
  methods: {
    //表示するタスク一覧
    displayList: function (list) {
      if (this.type == "inbox") {
        if (list.project_id == null) {
          return true;
        }
      } else if (this.type == "today") {
        if (this.time == list.deadline) {
          return true;
        }
      } else {
        if (list.project_id != null && list.project_id == this.projectId) {
          return true;
        } else {
          return false;
        }
      }
    },
    deleteConfirm: function (id, title) {
      this.deleteDialog = true;
      this.deleteID = id;
      this.deleteTitle = title;
    },
    deleteTask: function (id) {
      axios
        .delete("http://localhost:8001/api/todolist/delete" + id)
        .then((res) => {
          //this.lists.splice(res.data.success);
          this.getList();
        });
      this.deleteDialog = false;
    },
    getList: function () {
      axios.get("http://localhost:8001/api/todolist/store").then((res) => {
        this.lists = res.data.getlist;
        //console.log(res.data.getlist.text);
        //console.log(res.data.getlist);
        console.log(res);
        return true;
      });
    },
    getAddTasc: function (task) {
      this.lists.push(task);
      console.log(this.lists);
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
  },
  created() {
    this.getList();
    this.$vuetify.lang = {
      t: () => {},
    };
    this.$vuetify.theme = { dark: false };
  },
};
</script>
<style>
.list {
  width: 70%;
}
</style>
