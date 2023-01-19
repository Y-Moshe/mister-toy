<script lang="ts" setup>
defineProps({ show: Boolean })
</script>

<template>
  <div class="loader" v-if="show"></div>
</template>
