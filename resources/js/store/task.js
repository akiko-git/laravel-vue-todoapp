const task = {
  namespaced: true,

  state: {
    projectId: null,
    deadline: null,
    category: null,
  },
  // getters: { ... },
  mutations: {
    sideMenuSelect(state, { projectId, deadline, category }) {
      state.deadline = deadline;
      state.category = category;
      state.projectId = projectId;
    },
  }
  // actions: { ... }
};

export default task;