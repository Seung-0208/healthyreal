<script setup>
import { getRadialBarChartConfig } from '@core/libs/apex-chart/apexCharConfig'
import { computed, defineProps } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'

const props = defineProps({
  checkedItems: Array,
  checkedExerciseItems: Array,
})

const vuetifyTheme = useTheme()
const statisticsChartConfig = computed(() => getRadialBarChartConfig(vuetifyTheme.current.value))

const series = computed(() => {
  const result = props.checkedItems && Array.isArray(props.checkedItems) ? 100 * (props.checkedItems.length / 3) : 0
  const resultexr = props.checkedExerciseItems && Array.isArray(props.checkedExerciseItems) ? 100 * (props.checkedExerciseItems.length / 3) : 0

  console.log(result.toFixed(2))

  if (result % 1 === 0 && resultexr % 1===0)
    return [result, resultexr]
  else
    return [result.toFixed(2), resultexr.toFixed(2)]
})
</script>

<template>
  <VueApexCharts
    :key="series"
    type="radialBar"
    height="400"
    :options="statisticsChartConfig"
    :series="series"
  />
</template>
