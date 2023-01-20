<script lang="ts" setup>
import toyPreview from './toy-preview.vue'
import { IToy } from '../../models'

defineProps<{ toys: IToy[] }>()
</script>

<template>
  <div class="toy-list">
    <toy-preview
      v-for="toy in toys"
      :key="toy._id"
      :toy="toy"
      @remove="$emit('remove', $event)"
    />
  </div>
</template>
