<script lang="ts" setup>
import { reactive, computed } from 'vue'

import { IFilterBy } from '../../models'
import { TAGS } from '../../services/toy.service'
import { utilService } from '../../services/util.service'

const props = defineProps<{ filterBy: IFilterBy }>()
const emit = defineEmits(['change'])

const filter = reactive<IFilterBy>(utilService.deepCopy(props.filterBy))
const sortOptions = computed(() => ['Name', 'Price'])
const tagsOptions = computed(() => TAGS)

const handleChange = () => emit('change', filter)
</script>

<template>
  <section class="todo-filter">
    <el-form inline :model="filter" :label-width="100">
      <el-form-item label="Search" class="w-100">
        <el-input
          type="text"
          placeholder="Search.."
          v-model="filter.keyword"
          @input="handleChange"
        />
      </el-form-item>

      <el-row>
        <el-col :xs="24" :sm="8">
          <el-form-item label="In Stock" class="w-100">
            <el-select
              v-model="filter.status"
              placeholder="Select stock"
              @change="handleChange"
              class="w-100"
            >
              <el-option value="">All</el-option>
              <el-option value="In-stock">In-stock</el-option>
              <el-option value="Out-of-Stock">Out-of-stock</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="8">
          <el-form-item label="Tags" class="w-100">
            <el-select
              multiple
              v-model="filter.tags"
              placeholder="Select tags"
              @change="handleChange"
              class="w-100"
            >
              <el-option
                v-for="tag in tagsOptions"
                :key="tag"
                :label="tag"
                :value="tag"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="8">
          <el-form-item label="Sort by" class="w-100">
            <el-select
              placeholder="Select.."
              v-model="filter.sortBy"
              @change="handleChange"
              class="w-100"
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
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>
