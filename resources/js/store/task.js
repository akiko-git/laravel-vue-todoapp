const task = {
  namespaced: true,

  state: {
    projectId: null,
    deadline: null,
    category: null,
    tasks: [],
    events: [],
    colors: ["blue", "indigo", "cyan", "green", "pink", "orange"],
    user: [],
    projects: [],
  },
  mutations: {
    setTask(state, tasks) {
      state.tasks = tasks;
      // console.log(state.tasks);
    },
    setEventsData(state) {
      for (let i in state.tasks) {
        state.events.push({
          name: state.tasks[i].title,
          start: state.tasks[i].deadline,
          end: state.tasks[i].deadline,
          taskId: state.tasks[i].id,
          projectId: state.tasks[i].project_id,
          status: state.tasks[i].status,
          taskObj: state.tasks[i],
          color: state.colors[Math.floor((state.colors.length) * Math.random())],
        });
      }
    },
    // setProjects(state, projects) {
    //   state.projects = projects;
    // },
    setUser(state, user) {
      state.user = user;
    },

    //タスクの新規登録
    add(state, task) {
      if (typeof task.project_id == Boolean) {
        task.project_id == null;
      }
      state.tasks.push(task);
      state.events.push({
        name: task.title,
        start: task.deadline,
        end: task.deadline,
        taskId: task.id,
        projectId: task.project_id,
        status: task.status,
        taskObj: task,
        color: state.colors[Math.floor((state.colors.length) * Math.random())],
      });
    },
    //タスクの削除
    delete(state, { taskIndex, eventIndex }) {
      state.tasks.splice(taskIndex, 1);
      state.events.splice(eventIndex, 1);
    },
    //タスクのアップデート
    update(state, { task, newTask }) {
      if (typeof newTask.project_id == Boolean) {
        newTask.project_id == null;
      }

      Object.assign(task, newTask);
    },

    eventsUpdate(state, { eventIndex, newTask }) {
      eventIndex.name = newTask.title;
      eventIndex.start = newTask.deadline;
      eventIndex.end = newTask.deadline;
      eventIndex.projectId = newTask.project_id;
      eventIndex.taskObj = newTask;
    },
    //タスクの完了
    updateStatus(state, { editStatusTask, editStatusEvent }) {
      Object.assign(editStatusTask, { status: 2 });
      Object.assign(editStatusEvent, { status: 2 });
    }

  },

  getters: {
    getTasks(state) {
      // console.log("state.tasks");
      // console.log(state.tasks);
      return state.tasks;
    },
    getEvents(state) {
      return state.events;
    },
    getUser(state) {
      return state.user;
    },
  },

  actions: {
    //ユーザーの取得
    async fetchUser({ commit }) {
      await axios.get("/api/user").then((res) => {
        commit('setUser', res.data);
        // console.log(res.data);
      }, (error) => {
        console.log(error);
      });
    },

    //全タスクデータロード
    async fetchTasks({ commit }) {
      await axios.get("/api/todolist/store").then((res) => {
        commit('setTask', res.data.getlist);
        commit('setEventsData');
        // console.log('storeだよ');
      }, (error) => {
        console.log(error);
      });
    },
    //新規登録
    async creatTask({ state, commit }, task) {
      return await axios
        .post("/api/todolist/form", task)
        .then((res) => {
          // console.log(res.data.success);
          commit('add', res.data.success);
          return res;
          // state.tasks.push(res.data.success);
        }).catch(error => {
          console.log("登録時のエラーだよ");
          console.log(error.response);
          console.log(error);
          return error;
        });;
    },
    //削除
    async delete({ state, commit }, { task, taskIndex, eventIndex }) {
      // const index = state.tasks.indexOf(task);
      return await axios
        .delete("/api/todolist/delete" + task.id)
        .then((res) => {
          commit('delete', { taskIndex, eventIndex });
          return true;
          //this.lists.splice(res.data.success);
          // this.getList();
        }).catch(error => {
          return error;
        });
    },
    //編集
    async update({ state, commit }, newTask) {
      const task = state.tasks.find((o) => {
        return o.id === newTask.id;
      });

      const eventIndex = state.events.find((o) => {
        return o.taskId === newTask.id;
      });

      if (!task && !eventIndex) {
        return false;
      }

      return await axios.patch('/api/todolist/edit' + newTask.id, newTask)
        .then(res => {
          commit('update', { task, newTask });
          commit('eventsUpdate', { eventIndex, newTask });
          // console.log(task);
          // console.log(eventIndex);
          return true;
        }).catch(error => {
          return error;
        });
    },

    //タスクの完了
    async doneTask({ state, commit }, { editStatusTask, editStatusEvent }) {
      return await axios
        .patch("/api/todolist/doneTask", editStatusTask)
        .then((res) => {
          commit('updateStatus', { editStatusTask, editStatusEvent });
          return true;
          //this.lists.splice(res.data.success);
          // this.getList();
        }).catch(error => {
          return error;
        });
    },


  },
};

export default task;