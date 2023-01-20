import { createStore } from 'vuex'

import { toyModule } from './modules/toy.store'
import { userModule } from './modules/user.store'

export { mutations } from './mutations'
export { actions } from './actions'

export default createStore({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    toyModule,
    userModule
  }
})
