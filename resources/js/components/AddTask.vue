<template>
  <div class="addTask">
    <v-list v-if="isActive" max-width="790">
      <v-list-item small @click="active" class="textColor">
        <v-list-item-icon class="mr-2">
          <v-icon small>fas fa-plus</v-icon>
        </v-list-item-icon>
        <v-list-item-title>タスクを追加</v-list-item-title>
      </v-list-item>
    </v-list>
    <v-form
      @submit.prevent="add()"
      v-if="!isActive"
      class="addTask_form"
      v-click-outside="{
        handler: close,
        closeConditional,
      }"
    >
      <v-row justify="center" align-content="center" dense>
        <v-col cols="11" class="mt-2">
          <v-text-field
            v-model="task.title"
            label="タスクを入力して下さい"
            solo
            single-line
          ></v-text-field>
        </v-col>
        <v-col cols="11" class="mb-4">
          <!-- 日付 -->
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="task.deadline"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <!-- <v-text-field
                v-model="task.deadline"
                label="期限"
                prepend-inner-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field> -->
              <v-chip
                class="mr-2"
                color="blue"
                outlined
                v-bind="attrs"
                v-on="on"
                v-model="task.deadline"
              >
                {{ task.deadline }}
              </v-chip>
            </template>
            <v-date-picker v-model="task.deadline" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.menu.save(task.deadline)"
                >OK</v-btn
              >
            </v-date-picker>
          </v-menu>
          <!-- プロジェクトの種類 -->
          <v-menu v-model="projectMenu" :nudge-width="200" offset-x>
            <template v-slot:activator="{ on, attrs }">
              <v-chip
                class="mr-2"
                color="green"
                outlined
                v-bind="attrs"
                v-on="on"
                v-model="task.project_id"
              >
                {{ projectName }}
              </v-chip>
            </template>
            <v-card>
              <v-list>
                <v-list-item link>
                  <v-list-item-title @click="handleSaveProjectId(null)">
                    インボックス
                  </v-list-item-title>
                </v-list-item>
                <v-list-item link v-for="(list, index) in this.getProjects">
                  <v-list-item-title @click="handleSaveProjectId(list.id)">
                    {{ list.project }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </v-col>
        <v-col cols="11">
          <v-btn
            :disabled="activeSave"
            type="submit"
            class="mx-2"
            color="primary"
          >
            送信
          </v-btn>
          <v-btn outlined color="primary" @click="close">キャンセル</v-btn>
          <div>{{ projectId }}<br />{{ type }}</div>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      isActive: true,
      deadline: new Date().toISOString().substr(0, 10),
      menu: false,
      task: {},
      projectMenu: false,
      projectName: "",
    };
  },
  methods: {
    ...mapActions("task", ["fetchTasks", "creatTask"]),

    active() {
      this.isActive = false;
      this.task.deadline = new Date().toISOString().substr(0, 10);
      this.task.status = 1;
      // this.task["title"] = "";
      if (this.type === "project") {
        // this.task.inbox_flag = false;
        if (this.projectId) {
          this.task.project_id = this.projectId;
          const getProject = this.getProjects.find(
            ({ id }) => id === this.projectId
          );
          this.projectName = getProject.project;
        }
      } else {
        // this.task.inbox_flag = true;
        this.projectName = "インボックス";
        this.task.project_id = null;
      }
    },
    close() {
      this.task = {};
      this.isActive = true;
    },
    closeConditional(e) {
      if (this.menu === false && this.projectMenu === false) {
        return true;
      } else {
        return false;
      }
    },
    add() {
      this.creatTask(this.task).then((res) => {
        console.log("追加したタスク");
        console.log(this.task);
        if (res === true) {
          alert("タスクを追加しました");
        } else {
          alert("タスクの追加に失敗しました");
        }
      });
      this.isActive = true;
    },
    handleSaveProjectId(setId) {
      if (setId) {
        this.task.project_id = setId;
        const setProject = this.getProjects.find(({ id }) => id === setId);
        this.projectName = setProject.project;
      } else {
        this.task.project_id = null;
        this.projectName = "インボックス";
      }
    },
  },
  props: {
    projectId: {
      type: [Number, String],
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
  },
  computed: {
    ...mapGetters("project", ["getProjects"]),
    activeSave() {
      if (this.task.title) {
        return false;
      } else {
        return true;
      }
    },
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
.addTask {
  // width: 50%;
  margin-top: 20px;
  .isClick {
    display: block;
  }
  .v-btn__content:hover {
    text-decoration: underline;
  }
  &_form {
    border: solid #000000 1px;
    width: 100%;
  }
}
</style>

