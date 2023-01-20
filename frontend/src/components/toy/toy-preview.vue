<script lang="ts" setup>
import { computed } from 'vue'
import { Delete, Edit, Reading, MoreFilled } from '@element-plus/icons-vue'

import { useStore } from '../../store'
import { IToy } from '../../models'

const props = defineProps<{ toy: IToy }>()
const store = useStore()

const icons = computed(() => ({
  Delete,
  Edit,
  Reading,
  MoreFilled,
}))
const user = computed(() => store.getters.user)
const toyLink = computed(() => '/toy/' + props.toy._id)
const editLink = computed(() => '/toy/edit/' + props.toy._id)
const stockLbl = computed(() =>
  props.toy.inStock ? 'In-stock' : 'Out-of-stock'
)

const formattedCurrency = computed(() => {
  const price = props.toy.price
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
})

const inStockClass = computed(() => {
  return {
    'in-stock': props.toy.inStock,
    'out-of-stock': !props.toy.inStock,
  }
})
</script>

<template>
  <router-link :to="toyLink">
    <el-card class="toy-preview">
      <!-- Header and title -->
      <template #header>
        <h1>{{ toy.name }}</h1>
      </template>

      <!-- Toy photo -->
      <img :src="toy.imgUrl" alt="toy" class="toy-img" />

      <!-- Price -->
      <div class="price">
        <span>Price: {{ formattedCurrency }}</span>
        <span :class="inStockClass">{{ stockLbl }}</span>
      </div>

      <!-- Tags -->
      <section class="tags">
        <el-tag type="info" v-for="tag in toy.tags">{{ tag }}</el-tag>
      </section>
      <span class="flex-grow"></span>
      <el-divider
        ><el-icon><MoreFilled /></el-icon
      ></el-divider>

      <!-- Toy Actions -->
      <section class="toy-actions">
        <el-tooltip content="Details">
          <router-link :to="toyLink">
            <el-link type="info" :icon="icons.Reading" />
          </router-link>
        </el-tooltip>
        <!-- Admin actions -->
        <template v-if="user?.isAdmin">
          <el-tooltip content="Edit">
            <router-link :to="editLink">
              <el-link type="warning" :icon="icons.Edit" />
            </router-link>
          </el-tooltip>

          <el-popconfirm
            :icon="null"
            title="Are you sure to delete this toy?"
            @confirm="$emit('remove', toy._id)">
            <template #reference>
              <span>
                <el-tooltip content="Delete">
                  <el-link type="danger" :icon="icons.Delete" @click.prevent />
                </el-tooltip>
              </span>
            </template>
          </el-popconfirm>
        </template>
      </section>
    </el-card>
  </router-link>
</template>
