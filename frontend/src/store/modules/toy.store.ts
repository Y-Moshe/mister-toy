import { Module } from 'vuex'
import { IFilterBy, IToy } from '../../models'
import { toyService } from '../../services/toy.service.js'
import { mutations } from '../mutations'

export interface IToyState {
  toys: IToy[]
  totalPages: number
  filterBy: IFilterBy
}

export const toyModule: Module<IToyState, any> = {
  state() {
    return {
      toys: [],
      totalPages: 0,
      filterBy: {
        keyword: '',
        // page: 0,
        // itemsPerPage: 6,
        status: '',
        tags: [],
        sortBy: 'Name',
      },
    }
  },
  getters: {
    filterBy({ filterBy }) {
      return filterBy
    },
    toys({ toys }) {
      return toys
    },
  },
  mutations: {
    setToys(state, { toys }) {
      state.toys = toys
    },
    removeToy({ toys }, { toyId }) {
      const idx = toys.findIndex(({ _id }) => _id === toyId)
      toys.splice(idx, 1)
    },
    saveToy({ toys }, { toy }) {
      if (toy._id) {
        const idx = toys.findIndex(({ _id }) => _id === toy._id)
        toys[idx] = toy
      } else toys.push(toy)
    },
    setFilterBy(state, { filterBy }) {
      state.filterBy = { ...filterBy }
    },
  },
  actions: {
    async loadToys({ commit, getters }) {
      try {
        const toys = await toyService.query(getters.filterBy)
        return commit(mutations.setToys(toys))
      } catch (err) {
        console.log('err from loadToys')
        throw err
      }
    },
    async removeToy({ commit }, { toyId }) {
      try {
        await toyService.remove(toyId)
        commit(mutations.removeToy(toyId))
      } catch (err) {
        console.log('err from removeToy')
        throw err
      }
    },
    async saveToy({ commit }, { toy }) {
      try {
        const { upsertedId } = await toyService.save(toy)
        if (upsertedId) toy._id = upsertedId
        commit(mutations.saveToy(toy))
      } catch (err) {
        console.log('err from saveToy')
        throw err
      }
    },
  },
}
