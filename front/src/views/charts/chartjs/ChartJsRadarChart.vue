<script setup lang="ts">
import axios from '@axios'
import { getRadarChartConfig } from '@core/libs/chartjs/chartjsConfig'
import RadarChart from '@core/libs/chartjs/components/RadarChart'
import { computed, onMounted, ref } from 'vue'
import { useTheme } from 'vuetify'
import { useStore } from 'vuex'

const vuetifyTheme = useTheme()
const store = useStore()
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = userInfo.value.id

const chartData = ref({
  labels: [],
  datasets: [],
})

const isDataLoaded = ref(false)  // 새로운 반응형 속성을 추가합니다.

const chartConfig = computed(() => getRadarChartConfig(vuetifyTheme.current.value))

onMounted(async () => { await setting() })

const setting = async () => {
  const response = await axios.post('/Inbody/findinbody.do', { id: connetId })

  console.log("인바디 데이타!!response.data:", response.data)

  // 측정 결과를 배열로 만듭니다.
  const measurements = [
    response.data.inb_weight,
    response.data.inb_smm,
    response.data.inb_bfm,
    response.data.inb_bmi,
    response.data.inb_pbf,
  ]

  // 차트 데이터를 설정합니다.
  chartData.value = {
    labels: ['체중', '골격근량', '체지방량', 'BMI', '체지방률'],
    datasets: [
      {
        fill: true,
        label: '측정결과',
        borderColor: 'transparent',
        backgroundColor: 'rgba(134,229,127, 0.8)',
        data: measurements,
        pointBorderColor: 'transparent',
        pointBackgroundColor: 'transparent',
      },
    ],
  }

  isDataLoaded.value = true  // 데이터가 로드되었음을 표시합니다.
}
</script>

<template>
  <div>
    <!-- isDataLoaded가 true일 때만 RadarChart 컴포넌트를 렌더링합니다. -->
    <RadarChart v-if="isDataLoaded" :height="400" :chart-data="chartData" :chart-options="chartConfig" />
  </div>
</template>
