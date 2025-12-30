<script lang="ts" setup>
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'
import { getDonutChartConfig } from '@core/libs/apex-chart/lsyApexCharConfig'
import {computed} from 'vue'

const vuetifyTheme = useTheme()

const succRate = 80; //달성률
const series = [100-succRate, succRate, ]
const expenseRationChartConfig = computed(() => getDonutChartConfig(vuetifyTheme.current.value, series))

</script>

<template>
  <VueApexCharts
    type="donut"
    height="410"
    :options="expenseRationChartConfig"
    :series="series"
  />
</template>
