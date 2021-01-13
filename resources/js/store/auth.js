import { OK, CREATED, UNAUTHORIZED, UNPROCESSABLE_ENTITY } from '../util'
const auth = {
  namespaced: true,

  state: {
    user: null,
    apiStatus: null,
    loginErrorMessage: null,
    registerErrorMessage: null
  },

  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setApiStatus(state, status) {
      state.apiStatus = status;
    },
    setLoginErrorMessage(state, message) {
      state.loginErrorMessage = message;
    },
    setRegisterErrorMessage(state, message) {
      state.registerErrorMessage = message;
    },

  },

  getters: {
    // ログイン済みかどうか
    check: state => !!state.user,
    // ユーザネームの取得
    username: state => (state.user ? state.user.name : ""),
    getApiStatus(state) {
      return state.apiStatus;
    },
    getLoginErrorMessage(state) {
      return state.loginErrorMessage;
    },
    getRegisterErrorMessage(state) {
      return state.registerErrorMessage;
    },
  },

  actions: {

    //ログイン
    async login({ state, commit }, data) {
      //setApiStatusをクリア
      commit('setApiStatus', null);
      const response = await axios.post("/api/login", data);

      //通信成功 200
      if (response.status === OK) {
        commit('setApiStatus', true);
        commit('setUser', response.data);
        return false;
      }

      //通信失敗
      commit('setApiStatus', false);

      if (response.status === UNPROCESSABLE_ENTITY) {
        //422の場合
        commit('setLoginErrorMessage', response.data.errors);
      } else if (response.status === UNAUTHORIZED) {
        //401の場合
        return response.status;
      } else {
        commit('error/setCode', response.status, { root: true });
      }

    },

    //エラーメッセージの初期化
    clearLoginErrorMessage({ commit }) {
      commit('setLoginErrorMessage', null);
    },

    //ユーザー登録
    async register({ state, commit }, data) {
      //setApiStatusをクリア
      commit('setApiStatus', null);
      const response = await axios.post("/api/regist", data);

      //登録成功 201
      if (response.status === CREATED) {
        commit('setApiStatus', true);
        commit('setUser', response.data);
        return false;
      }

      //通信失敗
      commit('setApiStatus', false);

      if (response.status === UNPROCESSABLE_ENTITY) {
        //422の場合
        commit('setRegisterErrorMessage', response.data.errors);
      } else if (response.status === UNAUTHORIZED) {
        //401の場合
        return response.status;
      } else {
        commit('error/setCode', response.status, { root: true });
      }
    },

    //エラーメッセージの初期化
    clearRegisterErrorMessage({ commit }) {
      commit('setRegisterErrorMessage', null);
    },

    //ログアウト
    async logout({ commit }) {
      //setApiStatusをクリア
      commit('setApiStatus', null);
      const response = await axios
        .post("/api/logout");

      //通信成功 200
      if (response.status === OK) {
        commit('setApiStatus', true);
        commit('setUser', null);
        return true;
      }
      console.log("失敗");
      //通信失敗
      commit('setApiStatus', false);
      commit('error/setCode', response.status, { root: true });

    },


    //ユーザーをクリア
    clearUser({ commit }) {
      commit('setUser', null);
    },

  },

}

export default auth;