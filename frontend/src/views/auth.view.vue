<template>
  <section class="auth-view">
    <el-form
      status-icon
      ref="ruleFormRef"
      :model="credentials"
      :rules="rules"
      :disabled="isLoading"
      @keydown.enter="handleSubmit(ruleFormRef)"
      label-position="left"
      label-width="100px"
    >
      <el-form-item>
        <h1>{{ authType }}</h1>
      </el-form-item>

      <el-form-item label="Fullname" v-if="!isLogin" prop="fullname" required>
        <el-input type="text" v-model="credentials.fullname" />
      </el-form-item>

      <el-form-item label="Username" prop="username" required>
        <el-input type="text" v-model="credentials.username" v-focus />
      </el-form-item>

      <el-form-item label="Password" prop="password" required>
        <el-input type="password" v-model="credentials.password" />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="handleSubmit(ruleFormRef)"
          :loading="isLoading"
        >
          {{ authType }}
        </el-button>
        <template v-if="isLogin">
          <el-divider>Or</el-divider>
          <el-button type="info" @click="demoLogin" plain>Demo login</el-button>
          <el-button type="warning" @click="loginAsAdmin" plain>
            Login as Admin
          </el-button>
        </template>
      </el-form-item>
    </el-form>
  </section>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage, FormInstance, FormRules } from 'element-plus'

import { authService } from '../services/auth.service.js'

const props = defineProps({ isLogin: Boolean })

const credentials = reactive({
  username: '',
  password: '',
  fullname: '',
})
const isLoading = ref(false)
const ruleFormRef = ref<FormInstance>(null)
const authType = computed(() => (props.isLogin ? 'Login' : 'Signup'))
const store = useStore()
const router = useRouter()

const rules = reactive<FormRules>({
  username: [
    {
      required: true,
      message: 'Username is required!',
      trigger: 'blur',
    },
    {
      min: 3,
      message: 'Require minimum 3 characters!',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: 'Password is required!',
      trigger: 'blur',
    },
    {
      min: 3,
      message: 'Require minimum 3 characters!',
      trigger: 'blur',
    },
    {
      max: 16,
      message: 'Require maximum 16 characters!',
      trigger: 'blur',
    },
  ],
  fullname: [
    {
      required: !props.isLogin,
      message: 'Fullname is required!',
      trigger: 'blur',
    },
    {
      min: 3,
      message: 'Require minimum 3 characters!',
      trigger: 'blur',
    },
  ],
})

const handleSubmit = async (elForm: FormInstance | undefined) => {
  const isValid = await elForm.validate((isValid) => isValid)
  if (!isValid) return ElMessage.error('Invalid fields, please correct them!')

  isLoading.value = true
  const authAction = props.isLogin ? authService.login : authService.signup

  try {
    const user = await authAction(credentials)
    store.commit({ type: 'setUser', user })
    router.push('/')
  } catch (err) {
    ElMessage.error(err)
  } finally {
    isLoading.value = false
  }
}

const demoLogin = () => {
  credentials.username = 'Maor123'
  credentials.password = '123'
  handleSubmit(ruleFormRef.value)
}

const loginAsAdmin = () => {
  credentials.username = 'admin'
  credentials.password = 'admin'
  handleSubmit(ruleFormRef.value)
}
</script>
