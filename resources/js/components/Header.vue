<template>
  <div>
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list>
        <v-list-item
          :to="{
            name: 'task',
            query: { type: encodeURIComponent(JSON.stringify('inbox')) },
          }"
          :exact="true"
        >
          <v-list-item-icon>
            <v-icon>mdi-package-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-title>インボックス</v-list-item-title>
        </v-list-item>
        <v-list-item to="/task" :exact="true">
          <v-list-item-icon>
            <v-icon>mdi-calendar-today</v-icon>
          </v-list-item-icon>
          <v-list-item-title>今日</v-list-item-title>
        </v-list-item>
        <v-list-item to="/calendar">
          <v-list-item-icon>
            <v-icon>mdi-calendar-month</v-icon>
          </v-list-item-icon>
          <v-list-item-title>近日予定</v-list-item-title>
        </v-list-item>
        <v-list-group
          @mouseover="mouseOverAction"
          @mouseleave="mouseLeaveAction"
          v-bind:disabled="isPush"
          :value="isProjectList"
          color="black"
        >
          <template v-slot:activator>
            <ProjectDialog @close="isPush = false">
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" small @click="pushIcon()">fas fa-plus</v-icon>
              </template>
            </ProjectDialog>
            <v-list-item-content class="pl-4">
              <v-list-item-title>プロジェクト</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            v-for="(projectList, index) in getProjects"
            :class="{ active: projectId === projectList.id }"
            class="projectList"
            color="black"
          >
            <router-link
              :to="{
                name: 'task',
                query: {
                  type: encodeURIComponent(JSON.stringify('project')),
                  id: encodeURIComponent(JSON.stringify(projectList.id)),
                },
              }"
              :exact="true"
              class="router-link"
            >
              <v-list-item-content>
                <v-list-item-title class="textWrapping">{{
                  projectList.project
                }}</v-list-item-title>
              </v-list-item-content>
            </router-link>
            <v-menu
              bottom
              right
              offset-x
              :close-on-content-click="closeContent"
              nudge-right="40"
              right
              v-model="projectMenu[index]"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-list-item-icon
                  v-bind="attrs"
                  v-on="on"
                  event=""
                  @click="projectListClick(index)"
                >
                  <v-icon small>fas fa-list</v-icon>
                </v-list-item-icon>
              </template>
              <v-list>
                <ProjectDialog
                  :dialogTitle="edit"
                  :dialogBtnText="editBtn"
                  :editData="projectList"
                  @close="editDialogClose, closeProjectMenu(index)"
                >
                  <template v-slot:activator="{ on }">
                    <v-list-item v-on="on" small>
                      <v-list-item-icon class="mr-2">
                        <v-icon>mdi-pencil</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>プロジェクトを編集</v-list-item-title>
                    </v-list-item>
                  </template>
                </ProjectDialog>
                <v-list-item
                  @click="deleteConfirm(projectList.id, projectList.project)"
                >
                  <v-list-item-icon class="mr-2">
                    <v-icon>mdi-trash-can</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>プロジェクトを削除</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item>
          <ProjectDialog @close="isPush = false">
            <template v-slot:activator="{ on }">
              <v-list-item
                v-on="on"
                small
                @click="pushIcon()"
                class="textColor"
              >
                <v-list-item-icon class="mr-2">
                  <v-icon small :class="{ iconHover: isHover }"
                    >fas fa-plus</v-icon
                  >
                </v-list-item-icon>
                <v-list-item-title
                  @mouseover="isHover = true"
                  @mouseleave="isHover = false"
                  >プロジェクトを追加</v-list-item-title
                >
              </v-list-item>
            </template>
          </ProjectDialog>
        </v-list-group>
      </v-list>
      <v-dialog v-model="deleteProjectDialog" persistent max-width="300">
        <v-card>
          <v-card-title>削除確認</v-card-title>
          <v-card-text
            >{{ deleteProjectText }}を削除してもよろしいですか？</v-card-text
          >
          <v-card-actions>
            <v-btn
              color="green darken-1"
              text
              @click="deleteProjectDialog = false"
              >キャンセル</v-btn
            >
            <v-btn
              color="green darken-1"
              text
              @click="deleteProject(deleteProjectID)"
              >削除</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-navigation-drawer>
    <v-app-bar class="indigo" fixed app dark clipped-left>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-btn icon to="/task" :exact="true" class="home">
        <v-icon>mdi-home-outline</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-menu bottom right offset-y nudgeWidth="200">
        <template v-slot:activator="{ on, attrs }">
          <v-avatar color="white" size="30" v-bind="attrs" v-on="on">
            <v-icon color="blue">mdi-account</v-icon>
          </v-avatar>
        </template>
        <v-card>
          <v-list>
            <v-list-item dense>
              <v-list-item-icon>
                <v-icon>mdi-cog</v-icon>
              </v-list-item-icon>
              <v-list-item-title>設定</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item dense link @click="logoutBtn">
              <v-list-item-icon>
                <v-icon>mdi-logout</v-icon>
              </v-list-item-icon>
              <v-list-item-title>logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script>
import moment from "moment";
import ProjectDialog from "./ProjectDialog";
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  components: {
    ProjectDialog,
  },
  data: () => ({
    drawer: null,
    hoverFlag: false,
    isPush: false,
    MenuContentClick: false,
    // projectLists: [],
    deleteProjectDialog: false,
    deleteProjectID: null,
    deleteProjectText: null,
    edit: "編集",
    editBtn: "保存",
    isHover: false,
    closeContent: false,
    projectMenu: {},
  }),
  methods: {
    ...mapActions("task", ["fetchTasks", "fetchUser"]),
    ...mapActions("project", ["fetchProjects", "deleteProjectData"]),
    ...mapActions("auth", ["logout"]),
    mouseOverAction() {
      this.hoverFlag = true;
    },
    mouseLeaveAction() {
      this.hoverFlag = false;
    },
    pushIcon() {
      this.isPush = true;
      //console.log(this.on);
    },
    pushDeatail(item, id, project) {
      if (item == "edit") {
        // this.$refs.edit.open();
      } else if (item == "delete") {
        this.deleteConfirm(id, project);
      }
    },

    //プロジェクト削除
    deleteConfirm(id, project) {
      this.deleteProjectDialog = true;
      this.deleteProjectID = id;
      this.deleteProjectText = project;
    },
    deleteProject(id) {
      this.deleteProjectData(id).then((res) => {
        if (res === true) {
          alert("プロジェクトを削除しました");
        } else {
          alert("プロジェクトの削除に失敗しました");
        }
      });
      this.deleteProjectDialog = false;
    },
    //編集画面を閉じた時の処理
    editDialogClose() {
      this.isPush = false;
    },
    projectListClick(index) {
      this.closeContent = false;
      this.projectMenu[index] = true;
    },
    closeProjectMenu(index) {
      this.closeContent = true;
      this.projectMenu[index] = false;
    },
    //ログアウト
    logoutBtn() {
      this.logout().then((res) => {
        //認証成功
        if (res === true) {
          localStorage.removeItem("auth");
          this.$router.go(this.$router.currentRoute.path);
          this.$router.push("/login");
        }
      });

      // axios
      //   .post("/api/logout")
      //   .then((res) => {
      //     // console.log(res);
      //     localStorage.removeItem("auth");
      //     this.$router.go(this.$router.currentRoute.path);
      //     this.$router.push("/login");
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    },
  },
  created() {
    this.fetchTasks();
    this.fetchProjects();
    this.fetchUser();
  },
  computed: {
    ...mapGetters("project", ["getProjects"]),
    type() {
      if (this.$route.query.type) {
        return JSON.parse(decodeURIComponent(this.$route.query.type));
      }
    },
    projectId() {
      if (this.$route.query.id) {
        return JSON.parse(decodeURIComponent(this.$route.query.id));
      }
    },
    //プロジェクトリストの表示制御
    isProjectList() {
      if (this.type === "project") {
        const project = this.getProjects.filter(
          (project) => project.id === this.projectId
        );
        if (project) {
          return true;
        } else {
          return false;
        }
      }
    },
  },

  mounted() {
    // for (let i = 0; i < this.getProjects; i++) {
    //   this.menu[i] = false;
    // }
  },
};
</script>
<style lang="scss" scoped>
.v-list {
  a:hover {
    text-decoration: none;
  }
}
.projectList {
  &:hover {
    background: #f6f6f6;
  }
  &.active:hover {
    background: #e5e5e5;
  }
}

.v-icon.v-icon.v-icon--link {
  padding-left: 3px;
}

.textColor {
  .v-list-item__title {
    color: #bdbdbd;
    &:hover {
      color: #e53935;
    }
  }
  .v-icon.v-icon {
    &:hover {
      color: #e53935;
    }
  }
  .v-list-item__icon:hover + .v-list-item__title {
    color: #e53935;
  }
  .theme--light.v-icon {
    color: #bdbdbd;
  }
  .theme--light.v-icon.iconHover {
    color: #e53935;
  }
}

.iconHover {
  color: #e53935;
}
.textWrapping {
  text-overflow: inherit;
  white-space: unset;
}
.router-link {
  color: #000000;
  display: contents;
}
.active {
  background: #e5e5e5;
}
.home {
  &:hover {
    text-decoration: none;
    background-color: rgba(255, 255, 255, 0.08);
  }
  &:before {
    background-color: transparent;
  }
}
</style>
