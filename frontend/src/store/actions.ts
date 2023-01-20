import { IToy } from '../models'
import { ICredentials } from '../views/auth.view.vue'

export const actions = {
  loadToys: () => ({ type: 'loadToys' }),
  removeToy: (toyId: string) => ({ type: 'removeToy', toyId }),
  saveToy: (toy: IToy) => ({ type: 'saveToy', toy }),
  loadUser: () => ({ type: 'loadUser' }),
  loginUser: (credentials: ICredentials) => ({ type: 'loginUser', credentials }),
  signupUser: (credentials: ICredentials) => ({ type: 'signupUser', credentials }),
  logoutUser: () => ({ type: 'logoutUser' }),
}