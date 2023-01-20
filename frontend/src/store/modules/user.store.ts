import { Module } from 'vuex'
import { IUser } from '../../models'
import { authService } from '../../services/auth.service'
import { mutations } from '../mutations'

interface IUserState {
  user: IUser[]
}

export const userModule: Module<IUserState, any> = {
  state() {
    return {
      user: null,
    }
  },
  getters: {
    user({ user }) {
      return user
    },
  },
  mutations: {
    setUser(state, { user }) {
      state.user = user
    },
  },
  actions: {
    loadUser({ commit }) {
      const user = authService.getLoggedinUser()
      if (!user) return

      commit(mutations.setUser(user))
    },
    async loginUser({ commit }, { credentials }) {
      const user = await authService.login(credentials)
      commit(mutations.setUser(user))
    },
    async signupUser({ commit }, { credentials }) {
      const user = await authService.signup(credentials)
      commit(mutations.setUser(user))
    },
    async logoutUser({ commit }) {
      await authService.logout()
      commit(mutations.setUser(null))
    },
  },
}
