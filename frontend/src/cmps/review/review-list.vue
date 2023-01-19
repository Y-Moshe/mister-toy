<script lang="ts" setup>
import reviewPreview from './review-preview.vue'
import { IReview } from '../../models';
defineProps<{ reviews: IReview[] }>()
</script>

<template>
  <ul class="clean-list">
    <li v-for="review in reviews" :key="review._id">
      <review-preview :review="review" @remove="$emit('remove', $event)" />
    </li>
  </ul>
</template>
