<template>
  <!-- <v-container> -->
  <v-row justify="center" align="start" class="mt-4" dens>
    <!-- <v-col cols="11">{{ type }}</v-col> -->
    <!-- <v-col cols="11">{{ projectId }}</v-col> -->
    <!-- <v-col cols="11">{{ filterProjects.project }}</v-col> -->
    <v-col
      v-if="Object.keys(getProjects).length != 0 && type == 'project'"
      cols="10"
    >
      <h3>{{ filterProjects.project }}</h3>
    </v-col>
    <v-col v-if="type != 'project'" cols="10">
      <h3>{{ headline }}</h3>
    </v-col>
    <v-col v-for="(task, index) in filteredTasks" :key="task.id" cols="11">
      <v-card class="mx-auto" color="light-blue lighten-5" max-width="790">
        <v-card-title class="pa-2 pb-0">
          <v-checkbox
            v-model="selected[index]"
            dense
            hide-details
            on-icon="mdi-check-circle-outline"
            off-icon="mdi-checkbox-blank-circle-outline"
            color="indigo"
            class="mt-0"
            @change="done(task, index)"
          >
            <template #label>
              <div class="redio_text">
                {{ task.title }}
              </div>
            </template>
          </v-checkbox>
        </v-card-title>
        <v-card-actions class="pt-0">
          <v-card-text class="pa-0"> 期限：{{ task.deadline }} </v-card-text>
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
        :delete-data="deleteTask"
        :visible="deleteDialog"
        @DeleteTaskClose="deleteDialog = false"
      />
      <AddTask :project-id="projectId" :type="type" />
      <TaskDialog
        ref="taskEditDialog"
        dialog-title="編集"
        dialog-btn-text="保存"
      />
    </v-col>
  </v-row>
  <!-- </v-container> -->
</template>

<script>
  import moment from 'moment';
  import AddTask from './AddTask';
  import DeleteTask from './DeleteTask';
  import TaskDialog from './TaskDialog';
  import { mapActions, mapGetters } from 'vuex';
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
        today: moment().format('YYYY-MM-DD'),
        selected: {},
      };
    },
    computed: {
      ...mapGetters('task', ['getTasks', 'getEvents', 'getUser']),
      ...mapGetters('project', ['getProjects']),
      type() {
        if (this.$route.query.type) {
          return JSON.parse(decodeURIComponent(this.$route.query.type));
        }
        return null;
      },
      projectId() {
        if (this.$route.query.id) {
          return JSON.parse(decodeURIComponent(this.$route.query.id));
        }
        return null;
      },
      filterProjects() {
        if (this.projectId) {
          return this.getProjects.find((o) => o.id == this.projectId);
        }
        return null;
      },
      headline() {
        let title = '';
        if (this.type == 'inbox') {
          title = 'インボックス';
        } else {
          title = '今日';
        }
        return title;
      },
      //表示するタスクをフィルター
      filteredTasks() {
        // console.log("this.getTasks");
        // console.log(this.getTasks);

        if (this.type === 'inbox') {
          return this.getTasks.filter(
            (task) => task.inbox_flag === 1 && task.status === 1
          );
        } else if (this.type === 'project') {
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
    methods: {
      ...mapActions('task', ['fetchTasks', 'creatTask', 'update', 'doneTask']),
      ...mapActions('project', ['fetchProjects']),
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
                alert('タスクを完了しました');
              } else {
                alert('タスクの完了に失敗しました');
              }
            });
          } else {
            alert('タスクの完了に失敗しました');
          }
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  .redio_text {
    position: relative;
    top: 2.5px;
  }
</style>
