const resetpasswordStore = {
  state: {
    isResetPasswordDialogVisible: false,

    // 기타 상태...
  },
  mutations: {
    openResetPasswordDialog(state) {
      console.log('openResetPasswordDialog실행되니?')
      state.isResetPasswordDialogVisible = true
    },
    closeResetPasswordDialog(state) {
      state.isResetPasswordDialogVisible = false
    },

    // 기타 mutations...
  },
  actions: {
    openResetPasswordDialogAction({ commit }) {
      console.log('실행됨?')
      commit('openResetPasswordDialog')
    },
    closeResetPasswordDialogAction({ commit }){
      console.log('모달 닫기')
      commit('closeResetPasswordDialog')
    },

    // 기타 actions...
  },

  // 기타 코드...
}

export default resetpasswordStore
