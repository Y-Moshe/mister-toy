<script lang="ts" setup>
import { reactive } from 'vue'
import { PieChart } from 'vue-chart-3'
import { Chart, registerables, ChartOptions } from 'chart.js'
Chart.register(...registerables)
defineProps<{ data: any }>()

const chartOptions = reactive<ChartOptions>({
  plugins: {
    tooltip: {
      callbacks: {
        label({ label, parsed }) {
          return `${label}: ${parsed}%`
        },
      },
    },
  },
})
</script>

<template>
  <PieChart :chartData="data" :options="chartOptions" />
</template>
