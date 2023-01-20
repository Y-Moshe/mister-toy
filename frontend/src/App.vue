<script lang="ts" setup>
import { onBeforeMount } from 'vue'

import appHeader from './components/app-header.vue'
import appFooter from './components/app-footer.vue'
import { useStore, actions } from './store'

const store = useStore()
onBeforeMount(() => store.dispatch(actions.loadUser()))
</script>

<template>
  <section class="main-app main-layout">
    <app-header />
    <router-view class="main-view" />
    <app-footer />
  </section>
</template>
