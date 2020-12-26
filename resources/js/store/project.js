const project = {
  namespaced: true,

  state: {
    projects: [],
  },

  mutations: {
    setProjects(state, projects) {
      state.projects = projects;
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
    delete(state, { projectId }) {
      const index = state.projects.findIndex((o) => {
        return o.id === projectId;
      });

      if (index) {
        state.projects.splice(index);
      } else {
        return false;
      }
    }
  },

  getters: {
    getProjects(state) {
      console.log("state.projects");
      console.log(state.projects);
      return state.projects;
    },
  },

  actions: {
    //全プロジェクトデータをロード
    async fetchProjects({ commit }) {
      await axios.get("http://localhost:8001/api/project/show").then((res) => {
        commit('setProjects', res.data.getProjectList);
        console.log("プロジェクトを一覧表示!");
        console.log(res.data.getProjectList);
      }, (error) => {
        console.log(error);
      });
    },
    //新規登録
    async createProject({ state, commit }, project) {
      return await axios
        .post("http://localhost:8001/api/project/regist", project)
        .then((res) => {
          console.log(res.data.regist);
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
        .patch("http://localhost:8001/api/project/edit" + project.id, project)
        .then((res) => {
          commit('update', { editProject, project });
          console.log("editProject");
          console.log(editProject);
          return true;
        }).catch(error => {
          console.log('error:', error);
          return error;
        });
    },
    //削除
    async deleteProjectData({ state, commit }, projectId) {
      return await axios
        .delete("http://localhost:8001/api/project/delete" + projectId)
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