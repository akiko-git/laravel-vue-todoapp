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
    setEventsData(state) {
      for (let i in state.tasks) {
        state.events.push({
          name: state.tasks[i].title,
          start: state.tasks[i].deadline,
          end: state.tasks[i].deadline,
          taskId: state.tasks[i].id,
          projectId: state.tasks[i].project_id,
          taskObj: state.tasks[i],
          color: state.colors[Math.floor((state.colors.length) * Math.random())],
        });
      }
    },
    setUser(state, user) {
      state.user = user;
      // console.log(state.tasks);
    },
    add(state, task) {
      state.tasks.push(task);
      state.events.push({
        name: task.title,
        start: task.deadline,
        end: task.deadline,
        taskId: task.id,
        projectId: task.project_id,
        taskObj: task,
        color: state.colors[Math.floor((state.colors.length) * Math.random())],
      });
    },
    delete(state, taskid) {
      const index = state.tasks.findIndex((o) => {
        return o.id === taskid;
      });
      const eventIndex = state.events.findIndex((o) => {
        return o.taskId === taskid;
      });
      if (index) {
        state.tasks.splice(index);
        state.events.splice(eventIndex);
      } else {
        return false;
      }
    },
    update(state, { task, newTask }) {
      Object.assign(task, newTask);
    },

    eventsUpdate(state, { eventIndex, newTask }) {
      eventIndex.name = newTask.title;
      eventIndex.start = newTask.deadline;
      eventIndex.end = newTask.deadline;
      eventIndex.projectId = newTask.project_id;
      eventIndex.taskObj = newTask;
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
      console.log(state.tasks);
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
    //全データロード
    async fetchTasks({ commit }) {
      await axios.get("http://localhost:8001/api/todolist/store").then((res) => {
        commit('setData', res.data.getlist);
        commit('setEventsData');
        commit('setUser', res.data.user);
        // console.log('storeだよ');
      }, (error) => {
        console.log(error);
      });
    },
    //カレンダー用データをロード
    fetchEvents({ commit }, { tasks, colors }) {
      commit('setEventsData', { tasks: tasks, colors: colors });
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
      // const index = state.tasks.indexOf(task);
      return await axios
        .delete("http://localhost:8001/api/todolist/delete" + task.id)
        .then((res) => {
          commit('delete', task.id);
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

      const eventIndex = state.events.find((o) => {
        return o.taskId === newTask.id;
      });

      if (!task && !eventIndex) {
        return false;
      }

      return await axios.patch('http://localhost:8001/api/todolist/edit' + newTask.id, newTask)
        .then(res => {
          commit('update', { task, newTask });
          commit('eventsUpdate', { eventIndex, newTask });
          console.log(task);
          console.log(eventIndex);
          return true;
        }).catch(error => {
          return error;
        });
    },

  },
};

export default task;