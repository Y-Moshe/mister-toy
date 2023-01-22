<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { uploadService } from '../services/upload.service'
import { toyService, TAGS } from '../services/toy.service.js'
import { useStore, actions } from '../store'
import { IToy } from '../models'

const store = useStore()
const route = useRoute()
const router = useRouter()
const toy = ref<IToy>(toyService.getEmptyToy())
const isLoading = ref(true)
const isImgUploading = ref(false)
const fileRef = ref<HTMLElement>(null)

const toyId = computed(() => route.params.id)
const btnText = computed(() => (toyId ? 'Save' : 'Add'))
const tagsOptions = computed(() => TAGS)

onMounted(() => {
  toyId.value && loadToy()
})

const loadToy = async () => {
  try {
    const result = await toyService.getById(toyId.value)
    toy.value = result
  } catch (err) {
    ElMessage.error(`Failed to load the toy ${toyId.value}!`)
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  if (!toyId.value) toy.value.createdAt = Date.now()
  try {
    await store.dispatch(actions.saveToy(toy.value))
    ElMessage.success('The toy saved successfully!')
    router.push('/')
  } catch (err) {
    ElMessage.error('Failed to save the toy')
  }
}

const handleUpload = async (ev) => {
  try {
    isImgUploading.value = true

    const url = await uploadService.uploadImg(ev)
    toy.value.imgUrl = url
    ElMessage.success('Image uploaded successfully!')
  } catch (err) {
    ElMessage.error('Failed to upload img!')
  } finally {
    isImgUploading.value = false
  }
}
</script>

<template>
  <section class="toy-edit">
    <el-form
      :model="toy"
      label-position="left"
      label-width="100px"
      v-loading="isLoading"
    >
      <el-form-item label="Name">
        <el-input type="text" v-model="toy.name" v-focus />
      </el-form-item>

      <el-form-item label="Img URL">
        <el-col :span="6">
          <el-input
            type="text"
            v-model="toy.imgUrl"
            :disabled="isImgUploading"
          />
        </el-col>
        <el-col :offset="1" :span="1">
          <label>Or</label>
        </el-col>
        <el-col :span="3">
          <input type="file" ref="fileRef" @change="handleUpload" hidden />
          <el-button
            type="primary"
            class="mr-1"
            @click="fileRef.click()"
            :loading="isImgUploading"
            >Upload file</el-button
          >
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-col :offset="6" :span="12">
          <el-image
            v-if="
              /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(
                toy.imgUrl
              )
            "
            :src="toy.imgUrl"
            loading="eager"
          />
        </el-col>
      </el-form-item>

      <el-form-item label="Price">
        <el-input type="number" v-model="toy.price" />
      </el-form-item>

      <el-form-item label="Tags">
        <el-select multiple v-model="toy.tags" placeholder="Select..">
          <el-option
            v-for="option in tagsOptions"
            :key="option"
            :value="option"
          >
            {{ option }}
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="In Stock">
        <el-checkbox v-model="toy.inStock" />
      </el-form-item>

      <el-button type="success" @click="handleSubmit">{{ btnText }}</el-button>
    </el-form>
  </section>
</template>
