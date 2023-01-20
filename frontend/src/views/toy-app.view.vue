<template>
  <section class="toy-app">
    <toy-filter :filterBy="filterBy" @change="handleFilterChange" />
    <div class="add-toy" v-if="user?.isAdmin">
      <router-link to="/toy/edit">Add a toy +</router-link>
    </div>
    <hr>

    <loader :show="toys.length === 0" />
    <toy-list :toys="toys" @remove="removeToy" />

    <!-- <pagination
      :page="filterBy.page"
      :totalPages="totalPages"
      @prev="goNexrPrevPage(-1)"
      @page="goToPage"
      @next="goNexrPrevPage(1)"
    /> -->
  </section>
</template>

<script>
import { ElMessage } from 'element-plus'
import { utilService } from '../services/util.service.js'

import { actions, mutations } from '../store'
import toyList from '../components/toy/toy-list.vue'
import toyFilter from '../components/toy/toy-filter.vue'
import loader from '../components/loader.vue'

export default {
  data() {
    return {
      handleFilterChange: () => {}
    }
  },
  created() {
    this.$store.dispatch(actions.loadToys())
    this.handleFilterChange = utilService.debounce(this.doChangeFilter, 500)
  },
  methods: {
    removeToy(toyId) {
      this.$store.dispatch(actions.removeToy(toyId))
        .then(() => ElMessage.success(`The toy removed successfully!`))
        .catch(() => ElMessage.error(`Failed to remove ${toyId}`))
    },
    doChangeFilter(filterBy) {
      this.$store.commit(mutations.setFilterBy(utilService.deepCopy(filterBy)))
    },
    // goNexrPrevPage(diff) {
    //   const { page: currPage } = this.filterBy
    //   const nextPage = currPage + diff
    //   const target = { name: 'page', value: nextPage }
    //   this.$store.commit(mutations.setFilterBy(target))
    // },
    // goToPage(page) {
    //   const target = { name: 'page', value: page }
    //   this.$store.commit(mutations.setFilterBy(target))
    // },
  },
  computed: {
    filterBy() {
      return this.$store.getters.filterBy
    },
    toys() {
      return this.$store.getters.toys
    },
    user() {
      return this.$store.getters.user
    },
    // totalPages() {
    //   return this.$store.getters.totalPages
    // }
  },
  components: {
    toyList,
    toyFilter,
    loader
  }
}
</script>
