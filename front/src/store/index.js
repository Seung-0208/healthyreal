import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import loginStore from './modules/loginStore'
import resetpasswordStore from './modules/resetpasswordStore'
import userStore from './modules/userStore'

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    loginStore, 
    userStore,  
    resetpasswordStore,
    
  },
  plugins: [
    createPersistedState({
      path: ['loginStore', 'userStore', 'resetpasswordStore' ], 
    }),
  ],
})
