<template>
  <v-dialog v-model="visible" persistent max-width="300">
    <v-card>
      <v-card-title>削除確認</v-card-title>
      <v-card-text
        >{{ deleteData.title }}を削除してもよろしいですか？</v-card-text
      >
      <v-card-actions>
        <v-btn color="green darken-1" text @click="close()">キャンセル</v-btn>
        <v-btn color="green darken-1" text @click="handlDeleteTask(deleteData)"
          >削除</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  props: {
    visible: {
      type: [Boolean],
      default: false,
    },
    deleteData: {
      type: [Object, String],
      default: "",
    },
  },
  methods: {
    ...mapActions("task", ["delete"]),

    handlDeleteTask(task) {
      const index = this.getTasks.findIndex((o) => {
        return o.id === task.id;
      });

      const eventIndex = this.getEvents.findIndex((o) => {
        return o.taskId === task.id;
      });
      console.log(index);
      console.log(eventIndex);
      if (index !== -1 && eventIndex !== -1) {
        this.delete({
          task: task,
          taskIndex: index,
          eventIndex: eventIndex,
        }).then((res) => {
          console.log(res);
          if (res === true) {
            alert("タスクを削除しました");
          } else {
            alert("タスクの削除に失敗しました");
          }
        });
      } else {
        alert("タスクの削除に失敗しました");
      }
      this.close();
    },
    close() {
      this.$emit("update:visible", false);
    },
    closePromise() {
      return new Promise((resolve, reject) => {
        resolve(alert("タスクの削除に失敗しました"));
      });
    },
  },
  computed: {
    ...mapGetters("task", ["getTasks", "getEvents"]),
  },
};
</script>