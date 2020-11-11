<template>
  <v-row class="fill-height">
    <TaskDialog
      ref="taskAddDialog"
      dialogTitle="新規登録"
      dialogBtnText="追加"
      :taskData="selectedEvent"
    ></TaskDialog>
    <v-col>
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
          @change="updateRange"
          @click:day="openTaskDialogAsAdd"
        ></v-calendar>
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
          :eventObj="selectedEvent"
          :taskData="selectedEvent"
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
    ...mapActions("task", ["delete"]),
    viewDay({ date }) {
      this.type = "day";
      this.focus = date;
      console.log("viewDay");
      console.log(this.focus);
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
      console.log(this.focus);
      this.focus = "";
    },
    updateRange(E) {
      // console.log("updateRange");
      // console.log(E);
      // console.log(this.rnd(0, 3));
    },
    //タスクの追加
    openTaskDialogAsAdd({ date }) {
      // console.log(e);
      // this.selectedEvent = "";
      // this.editEvent = this.selectedEvent;
      this.$refs.taskAddDialog.open(date);
    },
    //タスクの編集
    openTaskDialogAsEdit() {
      // this.editEvent = this.selectedEvent;
      this.$refs.taskEditDialog.open(this.selectedEvent.start);
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
    // updateRange({ start, end }) {
    //   const min = new Date(`${start.date}T00:00:00`);
    //   const max = new Date(`${end.date}T23:59:59`);
    //   const days = (max.getTime() - min.getTime()) / 86400000;
    //   const eventCount = this.rnd(days, days + 20);
    //   console.log(eventCount);
    // },
    rnd(min, max) {
      return Math.floor((max - min + 1) * Math.random()) + min;
    },
  },
  props: {
    taskList: {
      type: Array,
      default: null,
    },
  },
  computed: {
    pushEvents: function () {
      this.events = taskList;
    },
  },
  created() {},
  mounted() {
    let currentProjectId = null;
    for (let i in this.taskList) {
      // if (this.taskList[i].project_id == null) {
      //   this.currentProjectId = "null";
      // } else {
      //   this.currentProjectId = this.taskList[i].project_id;
      // }
      this.events.push({
        name: this.taskList[i].title,
        start: this.taskList[i].deadline,
        end: this.taskList[i].deadline,
        color: this.colors[this.rnd(0, this.colors.length - 1)],
        taskId: this.taskList[i].id,
        projectId: this.taskList[i].project_id,
        taskObj: this.taskList[i],
      });
    }
    // console.log(this.$refs.calendar);
    // console.log(this.events);
  },
};
</script>