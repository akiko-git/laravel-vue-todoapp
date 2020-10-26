<template>
  <div>
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list>
        <v-list-item link @click="registTaskStore(null, 'inbox')">
          <v-list-item-icon>
            <v-icon>mdi-package-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-title>インボックス</v-list-item-title>
        </v-list-item>
        <v-list-item link @click="registTaskStore(null, 'today')">
          <v-list-item-icon>
            <v-icon>mdi-calendar-today</v-icon>
          </v-list-item-icon>
          <v-list-item-title>今日</v-list-item-title>
        </v-list-item>
        <v-list-item link @click="registTaskStore(null, 'comingSoon')">
          <v-list-item-icon>
            <v-icon>mdi-calendar-month</v-icon>
          </v-list-item-icon>
          <v-list-item-title>近日予定</v-list-item-title>
        </v-list-item>
        <v-list-group
          @mouseover="mouseOverAction"
          @mouseleave="mouseLeaveAction"
          v-bind:disabled="isPush"
        >
          <template v-slot:activator>
            <ProjectDialog @close="isPush = false" @regist="getProjectList">
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" small @click="pushIcon()">fas fa-plus</v-icon>
              </template>
            </ProjectDialog>
            <v-list-item-content>
              <v-list-item-title>プロジェクト</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            v-for="(projectList, index) in projectLists"
            link
            @click="registTaskStore(projectList.id)"
          >
            <v-list-item-title>{{ projectList.project }}</v-list-item-title>
            <v-menu
              bottom
              right
              offset-x
              :close-on-content-click="false"
              :value="MenuContentClick"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on" small>fas fa-list</v-icon>
              </template>
              <v-list>
                <ProjectDialog
                  @regist="getProjectList"
                  :dialogTitle="edit"
                  :dialogBtnText="editBtn"
                  :editData="projectList"
                  @close="isPush = false"
                >
                  <template v-slot:activator="{ on }">
                    <v-list-item v-on="on" small @click="pushIcon()">
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
          <ProjectDialog @regist="getProjectList" @close="isPush = false">
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
      <v-toolbar-title>Title</v-toolbar-title>
    </v-app-bar>
  </div>
</template>

<script>
import moment from "moment";
export default {
  data: () => ({
    drawer: null,
    hoverFlag: false,
    isPush: false,
    MenuContentClick: false,
    projectLists: [],
    deleteProjectDialog: false,
    deleteProjectID: null,
    deleteProjectText: null,
    edit: "編集",
    editBtn: "保存",
    isHover: false,
  }),
  methods: {
    mouseOverAction() {
      this.hoverFlag = true;
    },
    mouseLeaveAction() {
      this.hoverFlag = false;
    },
    //taskストアにプロジェクトキーを登録
    registTaskStore(id, category) {
      if (category == "today") {
        this.$store.commit("task/sideMenuSelect", {
          projectId: null,
          deadline: moment().format("YYYY-MM-DD"),
          category: category,
        });
      } else if (category == "comingSoon") {
        this.$store.commit("task/sideMenuSelect", {
          projectId: null,
          deadline: moment().format("YYYY-MM-DD"),
          category: category,
        });
      } else {
        this.$store.commit("task/sideMenuSelect", {
          projectId: id,
          deadline: moment().format("YYYY-MM-DD"),
          category: category,
        });
      }
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

    // 一覧表示
    getProjectList() {
      axios.get("http://localhost:8001/api/project/show").then((res) => {
        this.projectLists = res.data.getProjectList;
        console.log(res);
        return true;
      });
    },
    //プロジェクト削除
    deleteConfirm(id, project) {
      this.deleteProjectDialog = true;
      this.deleteProjectID = id;
      this.deleteProjectText = project;
    },
    deleteProject(id) {
      axios
        .delete("http://localhost:8001/api/project/delete" + id)
        .then((res) => {
          //this.lists.splice(res.data.success);
          this.getProjectList();
          console.log(res.data.delete);
        });
      this.deleteProjectDialog = false;
    },
  },
  components: {
    ProjectDialog: () => import("./ProjectDialog"),
  },
  created() {
    this.getProjectList();
    console.log(moment().format("YYYY-MM-DD"));
  },
};
</script>
<style lang="scss" scoped>
.v-list-item__content {
  padding-left: 20px;
}

.v-icon.v-icon.v-icon--link {
  padding-left: 5px;
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
}

.iconHover {
  color: #e53935;
}
</style>
