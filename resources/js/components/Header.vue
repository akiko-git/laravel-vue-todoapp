<template>
  <div>
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-group
          @mouseover="mouseOverAction"
          @mouseleave="mouseLeaveAction"
          v-bind:disabled="isPush"
        >
          <template v-slot:activator>
            <ProjectDialog
              @close="isPush = false"
              @regist="getProjectList"
              ref="edit"
            >
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" small @click="pushIcon()">fas fa-plus</v-icon>
              </template>
            </ProjectDialog>
            <v-list-item-content>
              <v-list-item-title>プロジェクト</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item v-for="projectList in projectLists" link>
            <v-list-item-title>{{ projectList.project }}</v-list-item-title>
            <v-menu bottom right offset-x>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on" small>fas fa-list</v-icon>
              </template>
              <v-list>
                <v-list-item
                  v-for="deatail in projectDetails"
                  @click="
                    pushDeatail(
                      deatail.item,
                      projectList.id,
                      projectList.project
                    )
                  "
                >
                  <v-list-item-icon class="mr-2">
                    <v-icon>{{ deatail.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{ deatail.text }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item>
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
export default {
  data: () => ({
    drawer: null,
    hoverFlag: false,
    isPush: false,
    projectLists: [],
    projectDetails: [
      { text: "プロジェクトを編集", icon: "mdi-pencil", item: "edit" },
      { text: "プロジェクトを削除", icon: "mdi-trash-can", item: "delete" },
    ],
    deleteProjectDialog: false,
    deleteProjectID: null,
    deleteProjectText: null,
  }),
  methods: {
    mouseOverAction() {
      this.hoverFlag = true;
    },
    mouseLeaveAction() {
      this.hoverFlag = false;
    },
    addProject() {
      alert("add!!!");
    },
    pushIcon() {
      this.isPush = true;
    },
    test() {
      alert("test");
    },
    pushDeatail(item, id, project) {
      if (item == "edit") {
        this.$refs.edit.open();
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
    //プロジェクト編集
    // editProject(){

    // },
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
  },
};
</script>
<style>
.v-list-item__content {
  padding-left: 20px;
}
.v-icon.v-icon.v-icon--link {
  padding-left: 5px;
}
</style>
