<script lang="ts" setup>
import { getRadarChartConfig } from '@core/libs/apex-chart/lsyApexCharConfig'
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'

const props = defineProps({
  userdietinfo: {
    type: Array,
    required: true,
  },
})

const vuetifyTheme = useTheme()

const totalCarbohydrate = computed(() => {
  return props.userdietinfo.reduce((acc, item) => acc + item['total_carbohydrate'], 0)
})

const totalProtein = computed(() => {
  return props.userdietinfo.reduce((acc, item) => acc + item['total_protein'], 0)
})

const totalFat = computed(() => {
  return props.userdietinfo.reduce((acc, item) => acc + item['total_fat'], 0)
})

const totalSodium = computed(() => {
  return props.userdietinfo.reduce((acc, item) => acc + parseInt(item['total_sodium']), 0) / 1000
})

const totalCholesterol = computed(() => {
  return props.userdietinfo.reduce((acc, item) => acc + parseInt(item['total_cholesterol']), 0) / 1000
})

//오늘의 날짜 구하기
var today = new Date()
var year = today.getFullYear()
var month = ('0' + (today.getMonth() + 1)).slice(-2)
var day = ('0' + today.getDate()).slice(-2)
var dateString = year + '-' + month  + '-' + day

const series = [
  {
    name: dateString,
    data: [totalCarbohydrate.value, totalProtein.value, totalFat.value, totalSodium.value, totalCholesterol.value],
  },
]

const chartConfig = computed(() => getRadarChartConfig(vuetifyTheme.current.value))
</script>

<template>
  <VueApexCharts
    type="radar"
    height="300"
    :options="chartConfig"
    :series="series"
  />
</template>
