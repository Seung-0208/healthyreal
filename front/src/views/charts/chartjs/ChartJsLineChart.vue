<script setup lang="ts">
import type { ChartJsCustomColors } from '@/views/charts/chartjs/types';
import { getLineChartConfig } from '@core/libs/chartjs/chartjsConfig';
import LineChart from '@core/libs/chartjs/components/LineChart';
import axios from '@axios';
import { nextTick, onMounted, ref } from 'vue';
import { useTheme } from 'vuetify';

interface Props {
  colors: ChartJsCustomColors
}
const props = defineProps<Props>()
const vuetifyTheme = useTheme()
const tabData = ref({})
const data = ref({
  labels: [],
  datasets: []
});

async function fetchDataAndDrawChart() {
  const response = await axios.get('/tab/getCount.do')
  tabData.value = response.data


  console.log("tabData.value---", tabData.value)

  const tabDate = tabData.value.map(item => item.tabDate);
  const communityPage = tabData.value.map(item => item.communityPage);
  const dietPage = tabData.value.map(item => item.dietPage);
  const exercisePage = tabData.value.map(item => item.exercisePage);
  const mindPage = tabData.value.map(item => item.mindPage);

  await nextTick();

  console.log("tabDate---", tabDate)
  console.log("communityPage---", communityPage)
  console.log("dietPage---", dietPage)
  console.log("exercisePage---", exercisePage)
  console.log("mindPage---", mindPage)

  data.value = {
    labels: tabDate,
    datasets: [
      {
        fill: false,
        tension: 0.5,
        pointRadius: 1,
        label: '커뮤니티',
        pointHoverRadius: 5,
        pointStyle: 'circle',
        borderColor: props.colors.primary,
        backgroundColor: props.colors.primary,
        pointHoverBorderWidth: 10,
        pointHoverBorderColor: props.colors.white,
        pointBorderColor: 'transparent',
        pointHoverBackgroundColor: props.colors.primary,
        data: communityPage,
      },
      {
        fill: false,
        tension: 0.5,
        pointRadius: 1,
        label: '식단',
        pointHoverRadius: 5,
        pointStyle: 'circle',
        borderColor: "#00FF00",
        backgroundColor: "#00FF00",
        pointHoverBorderWidth: 10,
        pointHoverBorderColor: props.colors.white,
        pointBorderColor: 'transparent',
        pointHoverBackgroundColor: "#00FF00",
        data: dietPage,
      },
      {
        fill: false,
        tension: 0.5,
        label: '운동',
        pointRadius: 1,
        pointHoverRadius: 5,
        pointStyle: 'circle',
        borderColor: props.colors.warningShade,
        backgroundColor: props.colors.warningShade,
        pointHoverBorderWidth: 5,
        pointHoverBorderColor: props.colors.white,
        pointBorderColor: 'transparent',
        pointHoverBackgroundColor: props.colors.warningShade,
        data: exercisePage,
      },
      {
        fill: false,
        tension: 0.5,
        pointRadius: 1,
        label: '마음돌봄',
        pointHoverRadius: 5,
        pointStyle: 'circle',
        borderColor: props.colors.yellow,
        backgroundColor: props.colors.yellow,
        pointHoverBorderWidth: 5,
        pointHoverBorderColor: props.colors.white,
        pointBorderColor: 'transparent',
        pointHoverBackgroundColor: props.colors.yellow,
        data: mindPage,
      },
    ],
  }
}
onMounted(() => {
  fetchDataAndDrawChart();
});

const chartConfig = computed(() => getLineChartConfig(vuetifyTheme.current.value))
</script>

<template>
  <LineChart v-if="data" :chart-options="chartConfig" :height="400" :chart-data="data" />
</template>
