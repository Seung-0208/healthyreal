<script lang="ts" setup>
import axios from '@axios'
import { getAreaChartSplineConfig } from '@core/libs/apex-chart/apexCharConfig'
import { computed, onMounted, ref, watchEffect } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'
import { useStore } from 'vuex'

const vuetifyTheme = useTheme()
const chartConfig = computed(() => getAreaChartSplineConfig(vuetifyTheme.current.value, categories))
const store = useStore()
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = userInfo.value.id

const series = ref([])
const chartInstance = ref(null)

onMounted(async () => {
  await updateInbodyData()

  // series가 변경될 때마다 차트를 갱신합니다.
  watchEffect(() => {
    if (series.value.length > 0 && chartInstance.value) {
      chartInstance.value.updateOptions({
        xaxis: { categories: categories.value },
      }, true)
      chartInstance.value.updateSeries(series.value, true)
    }
  })
})

const categories = ref([])


async function updateInbodyData() {
  try {
    const response = await axios.post('/Inbody/findAllInbody.do', { id: connetId })
    const data = response.data

    console.log("인바디 전체 데이터:", data)

    categories.value = data.map(item => {
      const date = new Date(item.inb_date)
      const year = date.getFullYear().toString().substr(-2) // 마지막 두 자리만 가져오기
      const month = (date.getMonth() + 1).toString().padStart(2, '0') // 월은 0부터 시작하므로 1을 더한 후, 두 자리 숫자로 만들기
      const day = date.getDate().toString().padStart(2, '0') // 두 자리 숫자로 만들기

      return `${year}-${month}-${day}`
    }).reverse()

    const seriesData = [
      ['체중', 'inb_weight'],
      ['골격근량', 'inb_smm'],
      ['체지방량', 'inb_bfm'],
      ['BMI', 'inb_bmi'],
      ['체지방률', 'inb_pbf'],
    ].map(([name, key]) => ({ name, data: data.map(item => item[key]).reverse() }))

    if (!chartInstance.value) {
      series.value = seriesData
    } else {
      await chartInstance.value.updateOptions({
        xaxis: { categories: categories.value },
      }, true)
      await chartInstance.value.updateSeries(seriesData, true)
    }

    console.log("반영 후:", series.value)
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <VueApexCharts ref="chartInstance" type="area" height="400" :options="chartConfig" :series="series" />
</template>
