const task = {
  namespaced: true,

  state: {
    projectId: null,
  },
  // getters: { ... },
  mutations: {
    getProjectId(state, id) {
      state.projectId = id;
    },
  }
  // actions: { ... }
};

export default task;