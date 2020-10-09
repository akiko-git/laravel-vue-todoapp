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
            <ProjectDialog @close="isPush = false">
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
            <v-menu bottom left>
              <template v-slot:activator="{ on, attrs }">
                <v-icon v-bind="attrs" v-on="on" small>fas fa-list</v-icon>
              </template>
              <v-list>
                <v-list-item v-for="(item, index) in items" :key="index">
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item>
        </v-list-group>
      </v-list>
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
    pros: [["お知らせ"]],
    hoverFlag: false,
    isPush: false,
    projectLists: [],
    items: [{ title: "test1" }],
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
    // 一覧表示
    getProjectList() {
      axios.get("http://localhost:8001/api/project/show").then((res) => {
        this.projectLists = res.data.getProjectList;
        console.log(res);
        return true;
      });
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
