<template>
  <v-row class="fill-height" justify="center" align-content="center" dens>
    <TaskDialog
      ref="taskAddDialog"
      dialogTitle="新規登録"
      dialogBtnText="追加"
    ></TaskDialog>
    <v-col cols="11">
      <v-toolbar flat>
        <v-btn fab text small color="grey darken-2" @click="prev">
          <v-icon small> mdi-chevron-left </v-icon>
        </v-btn>
        <v-toolbar-title v-if="$refs.calendar">
          {{ $refs.calendar.title }}
        </v-toolbar-title>
        <v-btn fab text small color="grey darken-2" @click="next">
          <v-icon small> mdi-chevron-right </v-icon>
        </v-btn>
        <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
          Today
        </v-btn>
        <v-spacer></v-spacer>
        <v-menu bottom right>
          <template v-slot:activator="{ on, attrs }">
            <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
              <span>{{ typeToLabel[type] }}</span>
              <v-icon right> mdi-menu-down </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="type = 'day'">
              <v-list-item-title>Day</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'week'">
              <v-list-item-title>Week</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'month'">
              <v-list-item-title>Month</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
      <v-sheet height="600">
        <v-calendar
          color="red"
          ref="calendar"
          v-model="focus"
          :type="type"
          :events="events"
          :event-color="getEventColor"
          @click:event="showEvent"
          @click:date="viewDay"
          @click:more="viewDay"
          @change="updateRange"
          @click:day="openTaskDialogAsAdd"
        ></v-calendar>
        <div v-for="test in getTasks">
          <p v-if="test.deadline === '2020-11-13'">{{ test.title }}</p>
        </div>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :close-on-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar color="grey lighten-4" flat>
              <v-toolbar-title>{{ selectedEvent.name }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon @click="openTaskDialogAsEdit">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="deleteConfirm(selectedEvent.taskObj)">
                <v-icon>mdi-trash-can</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-actions>
              <v-btn text color="blue darken-1" @click="selectedOpen = false">
                キャンセル
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
        <TaskDialog
          ref="taskEditDialog"
          dialogTitle="編集"
          dialogBtnText="保存"
          @close="editDialogClose"
        ></TaskDialog>
        <DeleteTask
          :deleteData="deleteTask"
          :visible.sync="deleteDialog"
        ></DeleteTask>
      </v-sheet>
    </v-col>
  </v-row>
</template>
<script>
import { mapActions, mapState, mapGetters } from "vuex";
import DeleteTask from "./DeleteTask";
import TaskDialog from "./TaskDialog";
export default {
  components: {
    TaskDialog,
    DeleteTask,
  },

  data: () => ({
    today: "2020-05-21",
    focus: "",
    type: "month",
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    colors: ["blue", "indigo", "cyan", "green", "pink", "orange"],
    deleteTask: {},
    deleteDialog: false,
  }),
  methods: {
    ...mapActions("task", ["fetchTasks", "delete", "fetchEvents"]),
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => {
          this.selectedOpen = true;
        }, 10);
      };
      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }
      nativeEvent.stopPropagation();
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    setToday() {
      // console.log(this.focus);
      this.focus = "";
    },
    updateRange({ start, end }) {
      this.events = this.getEvents;
    },
    //タスクの追加
    openTaskDialogAsAdd({ date }) {
      this.$refs.taskAddDialog.open(date);
    },
    //タスクの編集
    openTaskDialogAsEdit() {
      // this.editEvent = this.selectedEvent;

      this.$refs.taskEditDialog.open(
        this.selectedEvent.start,
        this.selectedEvent.taskObj
      );
    },
    //タスクの編集画面を閉じた時の処理
    editDialogClose() {
      this.selectedOpen = false;
    },
    //タスクの削除
    deleteConfirm(task) {
      this.deleteDialog = true;
      this.deleteTask = task;
    },
    rnd(min, max) {
      return Math.floor((max - min + 1) * Math.random()) + min;
    },
  },
  props: {},
  computed: {
    ...mapGetters("task", ["getTasks", "getEvents"]),
  },
  created() {
    // this.events = this.events2;
  },
  mounted() {
    this.$refs.calendar.checkChange();
    // console.log("storeのイベントの値");
    // console.log(this.getEvents);
    // for (let i in this.getTasks) {
    //   if (this.taskList[i].project_id == null) {
    //     this.currentProjectId = "null";
    //   } else {
    //     this.currentProjectId = this.taskList[i].project_id;
    //   }
    //   this.events.push({
    //     name: this.getTasks[i].title,
    //     start: this.getTasks[i].deadline,
    //     end: this.getTasks[i].deadline,
    //     color: this.colors[this.rnd(0, this.colors.length - 1)],
    //     taskId: this.getTasks[i].id,
    //     projectId: this.getTasks[i].project_id,
    //     taskObj: this.getTasks[i],
    //     timed: 2,
    //   });
    // }
    // console.log("普通のイベントの値");
    // console.log(this.events);
    // console.log("カレンダーオブジェクト");
    // console.log(this.$refs.calendar);
    // console.log("カレンダータイトル");
    // console.log(this.$refs.calendar.title);
  },
};
</script>
<style lang="scss" scoped>
</style>
