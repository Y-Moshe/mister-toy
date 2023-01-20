<script lang="ts" setup>
import { computed } from 'vue'
import { Delete } from '@element-plus/icons-vue'

import { useStore } from '../../store'
import { IReview } from '../../models'
defineProps<{ review: IReview }>()

const store = useStore()
const user = computed(() => store.getters.user)
</script>

<template>
  <article class="review-preview">
    <router-link to="/">
      <div class="profile">
        <el-image
          src="src/assets/img/profile.png"
          alt="profile img"
          class="review-profile-img"
        />
        <span>{{ user?.fullname }}</span>
      </div>
    </router-link>

    <p>{{ review.txt }}</p>
    <el-button
      v-if="user?.isAdmin"
      type="danger"
      @click="$emit('remove', review._id)"
      size="small"
      :icon="Delete"
    />
  </article>
</template>
