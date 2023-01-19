<script lang="ts" setup>
import { reactive, computed } from 'vue'

import { IFilterBy } from '../../models'
import { TAGS } from '../../services/toy.service'
import { utilService } from '../../services/util.service'

const props = defineProps<{ filterBy: IFilterBy }>()
const emits = defineEmits(['change'])

const filter = reactive<IFilterBy>(utilService.deepCopy(props.filterBy))
const sortOptions = computed(() => ['Name', 'Price'])
const tagsOptions = computed(() => TAGS)

const handleChange = () => emits('change', filter)
</script>

<template>
  <section class="todo-filter">
    <el-form inline :model="filter">
      <el-form-item label="Search">
        <el-input
          type="text"
          placeholder="Search.."
          v-model="filter.keyword"
          @input="handleChange"
        />
      </el-form-item>

      <el-form-item label="In Stock">
        <el-select
          v-model="filter.status"
          placeholder="Select stock"
          @change="handleChange"
        >
          <el-option value="">All</el-option>
          <el-option value="In-stock">In-stock</el-option>
          <el-option value="Out-of-Stock">Out-of-stock</el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Tags">
        <el-select
          multiple
          v-model="filter.tags"
          placeholder="Select tags"
          @change="handleChange"
        >
          <el-option
            v-for="tag in tagsOptions"
            :key="tag"
            :label="tag"
            :value="tag"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Sort by">
        <el-select
          placeholder="Select.."
          v-model="filter.sortBy"
          @change="handleChange"
        >
          <el-option
            v-for="option in sortOptions"
            :value="option"
            :key="option"
          >
            {{ option }}
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </section>
</template>
