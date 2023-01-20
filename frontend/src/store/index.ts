import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'

import { IToyState, toyModule } from './modules/toy.store'
import { IUserState, userModule } from './modules/user.store'

export { mutations } from './mutations'
export { actions } from './actions'

interface IState {
  toyModule: IToyState
  userModule: IUserState
}

export const storeKey: InjectionKey<Store<IState>> = Symbol()

export default createStore({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    toyModule,
    userModule
  }
})

export function useStore() {
  return baseUseStore(storeKey)
}
