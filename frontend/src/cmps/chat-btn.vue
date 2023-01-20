<script lang="ts" setup>
import { computed, ref, reactive } from 'vue'
import { ChatDotRound, Promotion } from '@element-plus/icons-vue'

import { useStore } from '../store'
import { IUser } from '../models'
defineProps<{ messages: any[] }>()
const emit = defineEmits(['messageSend'])

const store = useStore()
const isOpen = ref(false)
const inpRef = ref(null)
const form = reactive({ message: '' })

const user = computed<IUser>(() => store.getters.user)

const handleMessage = () => {
  emit('messageSend', form.message)
  inpRef.value?.focus()
  form.message = ''
}

const getUserName = (name: string) =>
  user.value.fullname === name ? 'Me' : name
</script>

<template>
  <section class="chat-btn" v-outside-click="() => (isOpen = false)">
    <section
      class="chat-box"
      :style="{ display: isOpen ? 'grid' : 'none' }"
      @click.stop=""
    >
      <div class="chat-content">
        <p v-for="msg in messages" :key="msg.id" class="chat-msg">
          <span>{{ getUserName(msg.fullname) }}</span
          >: {{ msg.txt }}
        </p>
      </div>

      <el-form :model="form" @keydown.enter="handleMessage">
        <el-input
          type="text"
          v-model="form.message"
          placeholder="Type anything..."
          v-focus
          ref="inpRef"
        />
        <el-button
          type="success"
          @click="handleMessage"
          :icon="Promotion"
          circle
        />
      </el-form>
    </section>

    <el-button
      type="primary"
      @click="isOpen = !isOpen"
      :icon="ChatDotRound"
      size="large"
      circle
    />
  </section>
</template>
