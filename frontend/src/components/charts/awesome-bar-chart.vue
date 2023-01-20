<script lang="ts" setup>
import { reactive } from 'vue'
import { BarChart } from 'vue-chart-3'
import { Chart, registerables, ChartOptions } from 'chart.js'
Chart.register(...registerables)
defineProps<{ data: any }>()

const chartOptions = reactive<ChartOptions>({
  plugins: {
    legend: {
      display: false,
    },
  },
})
</script>

<template>
  <BarChart :chartData="data" :options="chartOptions" />
</template>
