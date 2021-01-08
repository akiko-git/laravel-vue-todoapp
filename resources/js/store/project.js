const project = {
  namespaced: true,

  state: {
    projects: [],
  },

  mutations: {
    setProjects(state, projects) {
      state.projects = projects;
      // console.log("state.projects");
      // console.log(state.projects);
    },
    //新規登録
    add(state, project) {
      state.projects.push(project);
    },
    //編集
    update(state, { editProject, project }) {
      Object.assign(editProject, project);
    },
    //削除
    delete(state, projectId) {
      const index = state.projects.findIndex((o) => {
        return o.id === projectId;
      });

      if (index !== -1) {
        console.log("削除");
        console.log(state.projects);
        console.log(index);
        state.projects.splice(index, 1);
        return true;
      } else {
        console.log("失敗");
        return false;
      }
    }
  },

  getters: {
    getProjects(state) {
      // console.log("state.projects");
      // console.log(state.projects);
      return state.projects;
    },
  },

  actions: {
    //全プロジェクトデータをロード
    async fetchProjects({ commit }) {
      await axios.get("/api/project/show").then((res) => {
        commit('setProjects', res.data.getProjectList);
        // console.log("プロジェクトを一覧表示!");
        // console.log(res.data.getProjectList);
      }, (error) => {
        console.log(error);
      });
    },
    //新規登録
    async createProject({ state, commit }, project) {
      return await axios
        .post("/api/project/regist", project)
        .then((res) => {
          // console.log(res.data.regist);
          commit('add', res.data.regist);
          return true;
        }).catch(error => {
          console.log('error:', error);
          return error;
        });
    },
    //編集
    async updateProject({ state, commit }, project) {
      const editProject = state.projects.find((o) => {
        return o.id === project.id;
      });

      return await axios
        .patch("/api/project/edit" + project.id, project)
        .then((res) => {
          commit('update', { editProject, project });
          return true;
        }).catch(error => {
          console.log('error:', error);
          return error;
        });
    },
    //削除
    async deleteProjectData({ state, commit }, projectId) {
      return await axios
        .delete("/api/project/delete" + projectId)
        .then((res) => {
          commit('delete', projectId);
          return true;
        }).catch(error => {
          console.log('error:', error);
          return error;
        });
    },

  },
};

export default project;