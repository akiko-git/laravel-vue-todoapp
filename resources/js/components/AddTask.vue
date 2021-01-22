<template>
  <div class="addTask">
    <v-list v-if="isActive" max-width="790">
      <v-list-item small class="textColor" @click="active">
        <v-list-item-icon class="mr-2">
          <v-icon small> fas fa-plus </v-icon>
        </v-list-item-icon>
        <v-list-item-title>タスクを追加</v-list-item-title>
      </v-list-item>
    </v-list>
    <v-form
      v-if="!isActive"
      v-click-outside="{
        handler: close,
        closeConditional,
      }"
      class="addTask_form"
      @submit.prevent="add()"
    >
      <v-row justify="center" align-content="center" dense>
        <v-col cols="11" class="mt-2">
          <v-text-field
            v-model="task.title"
            label="タスクを入力して下さい"
            solo
            single-line
          />
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
            <template #activator="{ on, attrs }">
              <v-chip
                class="mr-2"
                color="blue"
                outlined
                v-bind="attrs"
                v-on="on"
              >
                {{ task.deadline }}
              </v-chip>
            </template>
            <v-date-picker
              v-model="task.deadline"
              :day-format="(date) => new Date(date).getDate()"
              no-title
              scrollable
            >
              <v-spacer />
              <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.menu.save(task.deadline)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
          <!-- プロジェクトの種類 -->
          <v-menu v-model="projectMenu" :nudge-width="200" offset-x>
            <template #activator="{ on, attrs }">
              <v-chip
                v-model="task.project_id"
                class="mr-2"
                color="green"
                outlined
                v-bind="attrs"
                v-on="on"
              >
                {{ projectName }}
              </v-chip>
            </template>
            <v-card>
              <v-list>
                <v-list-item link>
                  <v-list-item-title @click="handleSaveProjectId()">
                    インボックス
                  </v-list-item-title>
                </v-list-item>
                <v-list-item v-for="list in getProjects" :key="list.id" link>
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
          <v-btn outlined color="primary" @click="close"> キャンセル </v-btn>
          <!-- <div>{{ projectId }}<br />{{ type }}{{ task.project_id }}</div> -->
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>
<script>
  import { mapActions, mapGetters } from 'vuex';
  export default {
    props: {
      projectId: {
        type: [Number, String],
        default: '',
      },
      type: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        isActive: true,
        deadline: new Date().toISOString().substr(0, 10),
        menu: false,
        task: {},
        projectMenu: false,
        projectName: '',
      };
    },
    computed: {
      ...mapGetters('project', ['getProjects']),
      activeSave() {
        if (this.task.title) {
          return false;
        } else {
          return true;
        }
      },
    },
    mounted() {},
    methods: {
      ...mapActions('task', ['fetchTasks', 'creatTask']),

      active() {
        this.isActive = false;
        this.task.deadline = new Date().toISOString().substr(0, 10);
        this.task.status = 1;
        if (this.type === 'project') {
          if (this.projectId) {
            this.task.project_id = this.projectId;
            const getProject = this.getProjects.find(
              ({ id }) => id === this.projectId
            );
            this.projectName = getProject.project;
          }
        } else {
          this.projectName = 'インボックス';
          this.task.project_id = {};
        }
      },
      close() {
        this.task = {};
        this.isActive = true;
      },
      closeConditional(e) {// eslint-disable-line
        if (this.menu === false && this.projectMenu === false) {
          return true;
        } else {
          return false;
        }
      },
      add() {
        // console.log("追加したタスク");
        // console.log(this.task);
        this.creatTask(this.task).then((res) => {
          if (res === true) {
            alert('タスクを追加しました');
          } else {
            alert('タスクの追加に失敗しました');
          }
        });
        this.close();
      },
      handleSaveProjectId(setId) {
        if (setId) {
          this.task.project_id = setId;
          const setProject = this.getProjects.find(({ id }) => id === setId);
          this.projectName = setProject.project;
        } else {
          this.task.project_id = {};
          this.projectName = 'インボックス';
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  .addTask {
    margin-top: 20px;
    .isClick {
      display: block;
    }
    .v-btn__content:hover {
      text-decoration: underline;
    }
    &_form {
      padding: 10px 0px;
      border: solid #000000 1px;
      width: 100%;
    }
  }
</style>
