<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { reviewService } from '../services/review.service'
import { IReview, IUser } from '../models'
import { useStore } from '../store'

import reviewList from '../components/review/review-list.vue'
import loader from '../components/loader.vue'

const store = useStore()
const reviews = ref<IReview[]>([])
const isLoading = ref(false)
const user = computed<IUser>(() => store.getters.user)

onMounted(() => loadReviews())

const loadReviews = async () => {
  try {
    isLoading.value = true
    const results = (await reviewService.query({
      userId: user.value._id,
    })) as IReview[]
    reviews.value = results
  } catch (err) {
    ElMessage.error('Failed to load reviews!')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <section>
    <h1>{{ user?.fullname }} Profile</h1>
    <loader :show="isLoading" />
    <review-list :reviews="reviews" @remove="() => {}" />
  </section>
</template>
