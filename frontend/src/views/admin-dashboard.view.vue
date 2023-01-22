<script lang="ts" setup>
import { reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { utilService } from '../services/util.service'
import { TAGS } from '../services/toy.service'
import { useStore, actions } from '../store'
import { IToy } from '../models'

import awesomeBarChart from '../components/charts/awesome-bar-chart.vue'
import awesomePieChart from '../components/charts/awesome-pie-chart.vue'

const store = useStore()

const barChartData = reactive({
  labels: [...TAGS],
  datasets: [
    {
      data: [],
      backgroundColor: [],
    },
  ],
})
const pieChartData = reactive({
  labels: ['In Stock', 'Out of Stock'],
  datasets: [
    {
      data: [],
      backgroundColor: [],
    },
  ],
})

const toys = computed<IToy[]>(() => store.getters.toys)

onMounted(() => {
  store
    .dispatch(actions.loadToys())
    .then(() => loadDatasets())
    .catch(() => ElMessage.error('Failed to load toys'))
})

const loadDatasets = () => {
  loadBarDataset()
  loadPieDataset()
}

const loadBarDataset = () => {
  // Bar chart
  const dataset = barChartData.labels.map((lbl) => {
    const toysWithCurrLbl = toys.value.filter((toy) => toy.tags.includes(lbl))
    const sumOfPricesOfCurrLbl = toysWithCurrLbl.reduce((prev, curr) => {
      return curr.price + prev
    }, 0)

    // average price per toy with the current lebel
    const avg = sumOfPricesOfCurrLbl / toysWithCurrLbl.length
    const bgColor = utilService.getRandomColor()
    return { avg, bgColor }
  })

  dataset.forEach((data) => {
    barChartData.datasets[0].data.push(data.avg)
    barChartData.datasets[0].backgroundColor.push(data.bgColor)
  })
}

const loadPieDataset = () => {
  const dataset = pieChartData.labels.map((lbl) => {
    const isInStock = lbl === 'In Stock' ? true : false

    const totalToys = toys.value.length
    const count = toys.value.reduce((prev, curr) => {
      if (curr.inStock === isInStock) return (prev += 1)
      return prev
    }, 0)

    // average price per toy with the current lebel
    const percent = Math.round((count / totalToys) * 100)
    const bgColor = utilService.getRandomColor()
    return { percent, bgColor }
  })

  dataset.forEach((data) => {
    pieChartData.datasets[0].data.push(data.percent)
    pieChartData.datasets[0].backgroundColor.push(data.bgColor)
  })
}
</script>

<template>
  <section class="dashboard">
    <el-row justify="center">
      <el-col :offset="2" :xs="20" :sm="10">
        <awesome-bar-chart :data="barChartData" />
      </el-col>

      <el-col :xs="20" :span="10">
        <awesome-pie-chart :data="pieChartData" />
      </el-col>
    </el-row>
  </section>
</template>
