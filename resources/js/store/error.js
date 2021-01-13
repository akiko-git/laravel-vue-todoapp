const error = {
  namespaced: true,

  state: {
    //エラーコードを保持
    code: null,
  },

  mutations: {
    setCode(state, code) {
      state.code = code;
    },
  },

  // getters: {
  //   getCode(state) {
  //     return state.code;
  //   },
  // },


}

export default error;