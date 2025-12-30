<script setup lang="ts">
import type { ChartJsCustomColors } from '@/views/charts/chartjs/types';
import axios from '@axios';
import { getPolarChartConfig } from '@core/libs/chartjs/chartjsConfig';
import PolarAreaChart from '@core/libs/chartjs/components/PolarAreaChart';
import { computed, onMounted, ref } from 'vue'; // ref와 computed, onMounted 추가
import { useTheme } from 'vuetify';
import { useStore } from 'vuex';

interface Props {
  colors: ChartJsCustomColors
}

const props = defineProps<Props>()

const vuetifyTheme = useTheme()

const chartConfig = computed(() => getPolarChartConfig(vuetifyTheme.current.value))

const store = useStore()
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = userInfo.value.id


const totalCarbohydrate = ref(0)
const totalProtein = ref(0)
const totalFat = ref(0)
const totalSodium = ref(0)
const totalCholesterol = ref(0)

//당일 섭취한 영양분 가져오기
const getNutri = () => {
  axios.get('/Actuality/dalilyNutri.do', { params: { id: connetId } })
    .then(response => {
      console.log('가져올 데이터입니다. ', response.data);

      totalCarbohydrate.value = response.data.reduce((acc, cur) => acc + parseInt(cur.total_carbohydrate), 0)
      totalProtein.value = response.data.reduce((acc, cur) => acc + parseInt(cur.total_protein), 0)
      totalFat.value = response.data.reduce((acc, cur) => acc + parseInt(cur.total_fat), 0)
      totalSodium.value = response.data.reduce((acc, cur) => acc + parseInt(cur.total_sodium) / 1000, 0)
      totalCholesterol.value = response.data.reduce((acc, cur) => acc + parseInt(cur.total_cholesterol) / 1000, 0)

      console.log('총 탄수화물?', totalCarbohydrate.value)
      console.log('총 단백질?', totalProtein.value)
      console.log('총 지방?', totalFat.value)
      console.log('총 나트륨?', totalSodium.value)
      console.log('총 콜레스테롤?', totalCholesterol.value)

    })
}


//평소 섭취하는 영양소의 비율을 나타내고자한 차트에요 원하면 바꿔도 괜찮아요
const data = computed(() => ({
  labels: ['탄수화물', '단백질', '지방', '나트륨', '콜레스테롤'],
  datasets: [
    {
      borderWidth: 0,
      label: 'Population (millions)',
      data: [totalCarbohydrate.value, totalProtein.value, totalFat.value, totalSodium.value, totalCholesterol.value],
      backgroundColor: [props.colors.primary, props.colors.yellow, props.colors.polarChartWarning, props.colors.polarChartInfo, props.colors.polarChartGrey],
    },
  ],
}))

onMounted(() => {
  getNutri()
})
</script>

<template>
  <PolarAreaChart :height="400" :chart-data="data" :chart-options="chartConfig" />
</template>
