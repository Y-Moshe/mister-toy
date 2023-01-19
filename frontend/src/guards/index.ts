import { ElMessage } from 'element-plus'
import store from '../store'

export function requireAuth() {
  const isAuthenticated = store.getters.user
  if (!isAuthenticated) {
    ElMessage.error('Login is required!')
    return { name: 'login' }
  }

  return true
}

export function requireAdmin() {
  const user = store.getters.user
  if (!user.isAdmin) {
    ElMessage.error('Requires administrator permission!')
    return { name: '/' }
  }

  return true
}