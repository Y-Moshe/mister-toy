import { IFilterBy, IToy, IUser } from '../models'

export const mutations = {
  setToys: (toys: IToy[]) => ({ type: 'setToys', toys }),
  removeToy: (toyId: string) => ({ type: 'removeToy', toyId }),
  saveToy: (toy: IToy) => ({ type: 'saveToy', toy }),
  setFilterBy: (filterBy: IFilterBy) => ({ type: 'setFilterBy', filterBy }),
  setUser: (user: IUser) => ({ type: 'setUser', user }),
}
