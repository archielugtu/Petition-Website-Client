import Vue from 'vue'
import Vuex from 'vuex'
import Api from "../Api";

Vue.use(Vuex)

export const store = new Vuex.Store({

  state: {
    isLoggedIn: sessionStorage.getItem('token') !== null,
    userId: sessionStorage.getItem('userId') || -1,
    userData: null
  },
  mutations: {
    SET_LOGGED_IN (state, status) {
      state.isLoggedIn = status
    },
    SET_USER_ID(state, userId) {
      state.userId = userId
    },
    SET_USER_DATA(state, userData) {
      state.userData = userData;
    }
  },
  actions: {
    setLoggedIn(context, status) {
      context.commit('SET_LOGGED_IN', status)
      if (status === false) {
        Api.removeToken();
      }
    },
    setUserId(context, userId) {
      context.commit('SET_USER_ID', userId)
    },
    setUserData(context, userData) {
      context.commit('SET_USER_DATA', userData)
    }
  }

})

