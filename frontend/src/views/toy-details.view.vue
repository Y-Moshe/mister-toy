<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { toyService } from '../services/toy.service.js'
import { socketService, socketEmits, socketEvents } from '../services/socket.service'
import { reviewService } from '../services/review.service'
import { IReview, IToy } from '../models'

import reviewList from '../components/review/review-list.vue'
import loader from '../components/loader.vue'
import chatBtn from '../components/chat-btn.vue'

const route = useRoute()
const toy = ref<IToy>()
const isLoading = ref(false)
const chat = reactive({
  txt: '',
  messages: [],
})

const toyId = computed(() => route.params.id)
const stockLbl = computed(() =>
  toy.value.inStock ? 'In-stock' : 'Out-of-stock'
)
const inStockClass = computed(() => ({
  [toy.value.inStock ? 'in-stock' : 'out-of-stock']: true,
}))
const formattedDate = computed(() =>
  new Date(toy.value.createdAt).toLocaleTimeString()
)
const formattedCurrency = computed(() => {
  const price = toy.value.price
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
})

onMounted(() => {
  socketService.emit(socketEmits.SET_TOPIC, toyId.value)
  socketService.on(socketEvents.REVIEW_ADDED, reviewAdded)
  socketService.on(socketEvents.REVIEW_REMOVED, removeReview)
  socketService.on(socketEvents.ADD_MSG, addChatMessage)

  toyService
    .getById(toyId.value)
    .then((result) => (toy.value = result))
    .catch(() => ElMessage.error(`Failed to load the toy ${toyId.value}!`))
})

const addChatMessage = (msg: any) => chat.messages.push(msg)
const sendChatMessage = (msg: string) => socketService.emit(socketEmits.SEND_MSG, msg)

const reviewAdded = (review: IReview) => {
  if (!review.userId) return // do nothing in case of guest
  toy.value.reviews.push(review)
  ElMessage.success('New review added!')
}

const removeReview = (reviewId: string) => {
  const reviewIdx = toy.value.reviews.findIndex((rev) => rev._id === reviewId)
  toy.value.reviews.splice(reviewIdx, 1)
}

const handleSubmitReview = async () => {
  try {
    isLoading.value = true
    const review = await reviewService.add({
      toyId: toyId.value,
      txt: chat.txt,
    })

    toy.value.reviews.push(review)
    ElMessage.success('Review added successfully!')
    chat.txt = ''
  } catch (err) {
    ElMessage.error('Failed to add your review')
  } finally {
    isLoading.value = false
  }
}

const handleRemoveReview = async (reviewId: string) => {
  try {
    await reviewService.remove(reviewId)
    removeReview(reviewId)
    ElMessage.success('Review successfully removed!')
  } catch (error) {
    ElMessage.error('Failed to remove your review')
  }
}
</script>

<template>
  <section class="toy-details">
    <loader :show="!toy" />

    <!-- Toy details -->
    <section v-if="toy">
      <small>ID: {{ toy._id }}</small>
      <h1>{{ toy.name }}</h1>
      <div class="img-wrapper">
        <el-image :src="toy.imgUrl" loading="eager" />
        <div class="tags">
          <el-tag type="info" v-for="tag in toy.tags">{{ tag }}</el-tag>
        </div>
      </div>
      <div class="flex space-between">
        <span>Price: {{ formattedCurrency }}</span>
        <div class="flex gap-10">
          <span :class="inStockClass">{{ stockLbl }}</span>
          <span>Created At: {{ formattedDate }}</span>
        </div>
      </div>

      <el-divider />

      <!-- Add review -->
      <el-form :model="chat" :disabled="isLoading">
        <el-form-item label="Add Review">
          <el-col :span="16">
            <el-input type="text" v-model="chat.txt" />
          </el-col>
          <el-col :offset="1" :span="4">
            <el-button
              type="success"
              @click="handleSubmitReview"
              class="w-100"
              :loading="isLoading"
              >Post</el-button
            >
          </el-col>
        </el-form-item>
      </el-form>
      <el-divider />

      <!-- Reviews -->
      <review-list :reviews="toy.reviews" @remove="handleRemoveReview" />
    </section>
    <chat-btn :messages="chat.messages" @messageSend="sendChatMessage" />
  </section>
</template>
