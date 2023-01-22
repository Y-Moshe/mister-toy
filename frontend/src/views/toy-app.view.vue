<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { utilService } from '../services/util.service.js'
import { useStore, actions, mutations } from '../store'
import { IFilterBy } from '../models'

import toyList from '../components/toy/toy-list.vue'
import toyFilter from '../components/toy/toy-filter.vue'

const store = useStore()
const router = useRouter()
const route = useRoute()
const isLoading = ref(false)

const filterBy = computed(() => store.getters.filterBy)
const toys = computed(() => store.getters.toys)
const user = computed(() => store.getters.user)

onMounted(() => store.dispatch(actions.loadToys()))

watch(route, currRoute => {  
  store.commit(mutations.setFilterBy(currRoute.query as any))
  store
    .dispatch(actions.loadToys())
    .catch(() => ElMessage.error('Failed to load toys!'))
    .finally(() => (isLoading.value = false))
}, { deep: true })

const doChangeFilter = async (filter: IFilterBy) => {
  isLoading.value = true
  filter = utilService.deepCopy(filter)
  router.replace({
    path: '/toy',
    query: filter as any
  })
}

const handleFilterChange = utilService.debounce(doChangeFilter, 500)

const removeToy = async (toyId: string) => {
  store
    .dispatch(actions.removeToy(toyId))
    .then(() => ElMessage.success(`The toy removed successfully!`))
    .catch(() => ElMessage.error(`Failed to remove ${toyId}`))
}
</script>

<template>
  <section class="toy-app">
    <toy-filter :filterBy="filterBy" @change="handleFilterChange" />
    <div class="add-toy" v-if="user?.isAdmin">
      <router-link to="/toy/edit">Add a toy +</router-link>
    </div>
    <el-divider />

    <el-progress
      v-if="isLoading"
      :indeterminate="true"
      :percentage="50"
      :show-text="false"
      status="warning"
    />
    <toy-list :toys="toys" @remove="removeToy" />
  </section>
</template>
