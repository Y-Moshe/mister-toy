<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { SwitchButton } from '@element-plus/icons-vue'

import { useStore, actions } from '../store'
import { IUser } from '../models'

const store = useStore()
const isLoading = ref(false)
const router = useRouter()

const user = computed<IUser>(() => store.getters.user)
const profileLink = computed(() => '/profile/' + user.value.username)

const handleLogout = async () => {
  try {
    isLoading.value = true
    await store.dispatch(actions.logoutUser())
    ElMessage.success('Successfully logged out!')
    router.push('/')
  } catch (err) {
    ElMessage.error('Failed to logged out!')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <header class="main-header main-layout full">
    <nav class="main-nav">
      <router-link to="/">
        <h1>Toys</h1>
      </router-link>

      <ul class="clean-list flex gap-15" v-if="user">
        <li>
          <router-link :to="profileLink">{{ user.fullname }}</router-link>
        </li>
        <li v-if="user.isAdmin">
          <router-link to="/admin/dashboard">Dashboard</router-link>
        </li>
        <li>
          <el-tooltip content="Logout">
            <el-button
              :loading="isLoading"
              :disabled="isLoading"
              :type="isLoading ? '' : 'danger'"
              size="small"
              :icon="SwitchButton"
              @click="handleLogout"
            ></el-button>
          </el-tooltip>
        </li>
      </ul>
      <ul class="clean-list flex gap-15" v-else>
        <li>
          <router-link to="/auth/login">Login</router-link>
        </li>
        <li>
          <router-link to="/auth/signup">Signup</router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>
