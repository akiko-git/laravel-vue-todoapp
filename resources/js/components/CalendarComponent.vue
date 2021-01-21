<template>
  <v-row class="fill-height" justify="center" align-content="center" dens>
    <TaskDialog
      ref="taskAddDialog"
      dialog-title="新規登録"
      dialog-btn-text="追加"
    />
    <v-col cols="11">
      <v-toolbar flat>
        <v-btn fab text small color="grey darken-2" @click="prev">
          <v-icon small> mdi-chevron-left </v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ calendarTitle }}
        </v-toolbar-title>
        <v-btn fab text small color="grey darken-2" @click="next">
          <v-icon small> mdi-chevron-right </v-icon>
        </v-btn>
        <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
          Today
        </v-btn>
        <v-spacer />
        <v-menu bottom right>
          <template #activator="{ on, attrs }">
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
          ref="calendar"
          v-model="focus"
          color="red"
          :type="type"
          :events="filteredEvents"
          :event-color="getEventColor"
          @click:event="showEvent"
          @click:date="viewDay"
          @click:more="viewDay"
          @click:day="openTaskDialogAsAdd"
          @change="updateRange"
        />
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar color="grey lighten-4" flat>
              <v-toolbar-title>{{ selectedEvent.name }}</v-toolbar-title>
              <v-spacer />
              <v-btn icon @click="done(selectedEvent.taskId)">
                <v-icon>mdi-check-outline</v-icon>
              </v-btn>
              <v-btn icon @click="openTaskDialogAsEdit">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="deleteConfirm(selectedEvent.taskObj)">
                <v-icon>mdi-trash-can</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-actions>
              <v-btn text color="blue darken-1" @click="close">
                キャンセル
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
        <TaskDialog
          ref="taskEditDialog"
          dialog-title="編集"
          dialog-btn-text="保存"
        />
        <DeleteTask
          :delete-data="deleteTask"
          :visible="deleteDialog"
          @DeleteTaskClose="deleteDialog = false"
        />
      </v-sheet>
    </v-col>
  </v-row>
</template>
<script>
  import moment from 'moment';
  import { mapActions, mapGetters } from 'vuex';
  import DeleteTask from './DeleteTask';
  import TaskDialog from './TaskDialog';
  export default {
    components: {
      TaskDialog,
      DeleteTask,
    },

    data() {
      return {
        // today: "2020-05-21",
        focus: moment().format('yyyy-MM-DD'),
        type: 'month',
        typeToLabel: {
          month: 'Month',
          week: 'Week',
          day: 'Day',
        },
        selectedEvent: {},
        selectedElement: null,
        selectedOpen: false,
        events: [],
        colors: ['blue', 'indigo', 'cyan', 'green', 'pink', 'orange'],
        deleteTask: {},
        deleteDialog: false,
      };
    },
    computed: {
      ...mapGetters('task', ['getTasks', 'getEvents']),
      filteredEvents() {
        return this.getEvents.filter((task) => task.status === 1);
      },
      calendarTitle() {
        return moment(this.focus).format('yyyy年 M月');
      },
    },
    created() {
      this.events = this.filteredEvents;
    },
    mounted() {
      this.$refs.calendar.checkChange();
    },
    methods: {
      ...mapActions('task', [
        'fetchTasks',
        'delete',
        'fetchEvents',
        'doneTask',
      ]),
      viewDay({ date }) {
        this.focus = date;
        this.type = 'day';
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
        this.focus = moment().format('yyyy-MM-DD');
      },
      updateRange({ start, end }) {// eslint-disable-line
        return this.filteredEvents;
        // this.events = this.filteredEvents;
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
        console.log('this.selectedEvent.taskObj');
        console.log(this.selectedEvent.taskObj);
      },
      //タスクの完了
      done(taskId) {
        //ストアのタスクから取得
        const editStatusTask = this.getTasks.find((o) => {
          return o.id === taskId;
        });
        //ストアのイベントから取得
        const editStatusEvent = this.getEvents.find((o) => {
          return o.taskId === taskId;
        });
        if (editStatusTask && editStatusEvent) {
          this.doneTask({ editStatusTask, editStatusEvent }).then((res) => {
            if (res === true) {
              alert('タスクを完了しました');
            } else {
              alert('タスクの完了に失敗しました');
            }
          });
        } else {
          alert('タスクの完了に失敗しました');
        }
        this.close();
      },
      //タスクの削除
      deleteConfirm(task) {
        this.deleteDialog = true;
        this.deleteTask = task;
      },
      rnd(min, max) {
        return Math.floor((max - min + 1) * Math.random()) + min;
      },
      close() {
        this.selectedOpen = false;
      },
    },
  };
</script>
<style lang="scss" scoped></style>
