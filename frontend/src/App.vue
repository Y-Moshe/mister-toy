<script lang="ts" setup>
import { onBeforeMount, onUnmounted, computed } from 'vue'
import { socketService } from './services/socket.service'
import { version } from '../package.json'

import appHeader from './components/app-header.vue'
import appFooter from './components/app-footer.vue'
import { useStore, actions } from './store'

const store = useStore()
const user = computed(() => store.getters.user)

onBeforeMount(() => {
  console.log('App running v' + version)

  store
    .dispatch(actions.loadUser())
    .finally(initializeWebSockets)
})

onUnmounted(() => socketService.terminate())

const initializeWebSockets = () => {
  socketService.setup()
  // Sign user socket
  socketService.on('connect', () => {
    if (user.value) {
      console.log('User socket signed!')
      socketService.login(user.value._id)
    }
  })
}
</script>

<template>
  <section class="main-app main-layout">
    <app-header />
    <router-view class="main-view" />
    <app-footer />
  </section>
</template>
