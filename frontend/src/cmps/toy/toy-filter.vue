<template>
  <section class="todo-filter">
    <el-form inline :model="form">

      <el-form-item label="Search">
        <el-input type="text" placeholder="Search.." v-model="form.keyword" @input="handleChange" />
      </el-form-item>

      <el-form-item label="In Stock">
        <el-select v-model="form.status" placeholder="Select stock" @change="handleChange">
          <el-option value="">All</el-option>
          <el-option value="In-stock">In-stock</el-option>
          <el-option value="Out-of-Stock">Out-of-stock</el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Tags">
        <el-select multiple v-model="form.tags" placeholder="Select tags" @change="handleChange">
          <el-option v-for="tag in tagsOptions" :key="tag" :label="tag" :value="tag" />
        </el-select>
      </el-form-item>

      <el-form-item label="Sort by">
        <el-select placeholder="Select.." v-model="form.sortBy" @change="handleChange">
          <el-option v-for="option in sortOptions" :value="option" :key="option">
            {{ option }}
          </el-option>
        </el-select>
      </el-form-item>

    </el-form>
  </section>
</template>

<script>
import { TAGS } from '../../services/toy.service'
import { utilService } from '../../services/util.service'

export default {
  props: { filterBy: Object },
  data() {
    return {
      form: null
    }
  },
  created() {
    this.form = utilService.deepCopy(this.filterBy)
  },
  computed: {
    sortOptions() {
      return ['Name', 'Price']
    },
    tagsOptions() {
      return TAGS
    }
  },
  methods: {
    handleChange() {
      this.$emit('change', this.form)
    }
  }
}
</script>
