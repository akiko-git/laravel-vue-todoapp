const task = {
  namespaced: true,

  state: {
    projectId: null,
    deadline: null,
    category: null,
    tasks: [],
  },
  mutations: {
    sideMenuSelect(state, { projectId, deadline, category }) {
      state.deadline = deadline;
      state.category = category;
      state.projectId = projectId;
    },
    setData(state, tasks) {
      state.tasks = tasks;
      // console.log(state.tasks);
    },
    //タスク一覧取得
    // fetchTasks(state) {
    //   state.tasks = [];
    //   axios.get("http://localhost:8001/api/todolist/store").then((res) => {
    //     state.tasks = res.data.getlist;
    //     //console.log(res.data.getlist.text);
    //     //console.log(res.data.getlist);
    //     console.log('storeだよ');
    //     console.log(state.tasks);
    //     return true;
    //   }, (error) => {
    //     console.log(error);
    //   });
    // },
    add(state, task) {
      state.tasks.push(task);
    },
    delete(state, index) {
      state.tasks.splice(index);
    },
    update(state, { task, newTask }) {
      Object.assign(task, newTask);
    },
    //タスクの新規登録
    // creatTask(state, task) {
    //   axios
    //     .post("http://localhost:8001/api/todolist/form", task)
    //     .then((res) => {
    //       console.log(res.data.success);
    //       state.tasks.push(res.data.success);
    //     });
    // },

  },

  getters: {
    getTasks(state) {
      return state.tasks;
    }
  },

  actions: {
    //全データロード
    async fetchTasks({ commit }) {
      await axios.get("http://localhost:8001/api/todolist/store").then((res) => {
        commit('setData', res.data.getlist);
        // console.log('storeだよ');
      }, (error) => {
        console.log(error);
      });
    },
    //新規登録
    async creatTask({ state, commit }, task) {
      return await axios
        .post("http://localhost:8001/api/todolist/form", task)
        .then((res) => {
          console.log(res.data.success);
          commit('add', res.data.success);
          return true;
          // state.tasks.push(res.data.success);
        }, (error) => {
          console.log(error);
        });
    },
    //削除
    async delete({ state, commit }, task) {
      const index = state.tasks.indexOf(task);
      return await axios
        .delete("http://localhost:8001/api/todolist/delete" + task.id)
        .then((res) => {
          commit('delete', index);
          return true;
          //this.lists.splice(res.data.success);
          // this.getList();
        }, (error) => {
          console.log(error);
        }).catch(error => {
          return error;
        });
    },
    //編集
    async update({ state, commit }, newTask) {
      const task = state.tasks.find((o) => {
        return o.id === newTask.id;
      });

      if (!task) {
        return false;
      }

      return await axios.patch('http://localhost:8001/api/todolist/edit' + newTask.id, newTask)
        .then(res => {
          commit('update', { task, newTask });
          return true;
        }).catch(error => {
          return error;
        });
    },

  },
};

export default task;