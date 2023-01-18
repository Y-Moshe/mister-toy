<template>
  <section>
    <h1>{{user?.fullname}} Profile</h1>
    <review-list :reviews="reviews" @remove="() => {}" />
  </section>
</template>

<script>
import { ElMessage } from 'element-plus'
import { reviewService } from '../services/review.service'
import reviewList from '../cmps/review/review-list.vue'

export default {
  components: { reviewList },
  data() {
    return {
      reviews: []
    }
  },
  created() {
    this.loadReviews()
  },
  methods: {
    loadReviews() {
      reviewService.query({ userId: this.user._id })
        .then(reviews => this.reviews = reviews)
        .catch(() => ElMessage.error('Failed to load reviews'))
    }
  },
  computed: {
    user() {
      return this.$store.getters.user
    }
  }
}
</script>