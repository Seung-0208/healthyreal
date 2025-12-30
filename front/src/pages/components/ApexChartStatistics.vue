<script setup>
import axios from '@axios'
import { getRadialBarChartConfig } from '@core/libs/apex-chart/apexCharConfig'
import { computed, ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'
import { useStore } from 'vuex'

const store = useStore()
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = userInfo.value.id

// ----------------------------------------------------------------------------------------
const checkedItems = ref([])
const checkedExerciseItems = ref([])
const currentTab = ref('tab-1')
const isSettingComplete = ref(false)

const isBChecked = computed(() => checkedItems.value && checkedItems.value.includes('B'))
const isLChecked = computed(() => checkedItems.value && checkedItems.value.includes('L'))
const isDChecked = computed(() => checkedItems.value && checkedItems.value.includes('D'))


function handleDataFromChildExer(data) {
  checkedExerciseItems.value = data
  console.log(checkedExerciseItems.value)
  console.log('여기다운동')
  console.log(Array.isArray(checkedExerciseItems.value))
}

//-----------------------------------------------------------------------------------------
onMounted(async () => {
  await setting(), await getEatingRecord()

})


//-----------------------------------------------------------------------------------------
const setting = async () => {
  console.log(connetId)

  const response = await axios.post('/croom/implementationSetting.do', { id: connetId })

  console.log(response)
  if (response.status === 200) {
    checkedItems.value = []
    checkedExerciseItems.value = []

    const exerciseString = response.data.exercise
    const eattingString = response.data.eatting


    if (exerciseString && exerciseString.length > 2 || eattingString && eattingString.length > 2) {
      const exerciseArray = exerciseString.substring(1, exerciseString.length - 1).split(',').map(item => item.trim()) // "[B, D, L]" -> "B, D, L" -> ["B", "D", "L"]

      checkedExerciseItems.value = exerciseArray // 배열 할당
      if (checkedExerciseItems.value[0] == "") {
        checkedExerciseItems.value.splice(0, 1)
      }
      console.log('이행률 데이터는---', response)
      console.log('checkedExerciseItems.value---', checkedExerciseItems.value)

      const eattingArray = eattingString.substring(1, eattingString.length - 1).split(',').map(item => item.trim())

      checkedItems.value = eattingArray // 배열 할당

      if (eattingArray[0] == "") {
        checkedItems.value = []
      }

      console.log('이행률 데이터는---', response)
      console.log('checkedItems.value---', checkedItems.value)

    } else {

      if (Array.isArray(checkedItems.value)) {
        checkedItems.value = eattingString
      }
      if (Array.isArray(checkedExerciseItems.value)) {
        checkedExerciseItems.value = exerciseString
      }
    }

  } else {
    console.error('이행률 데이터 가져오기 실패')
  }
  isSettingComplete.value = true
}


//-----------------------------------------------------------------------------------------

const statisticsChartConfig = computed(() => getRadialBarChartConfig(vuetifyTheme.current.value))

const series = computed(() => {
  const result = Array.isArray(checkedItems.value) ? 100 * (checkedItems.value?.length / 3) : 0
  const resultexr = Array.isArray(checkedExerciseItems.value) ? 100 * (checkedExerciseItems.value?.length / 3) : 0

  if (result % 1 === 0 && resultexr % 1 === 0) {
    console.log(result.toFixed(2))
    console.log(resultexr.toFixed(2))

    return [result, resultexr]
  }
  else if (result || resultexr) {
    console.log(result.toFixed(2))
    console.log(resultexr.toFixed(2))

    return [parseFloat(result.toFixed(2)), parseFloat(resultexr.toFixed(2))]
  }
  else {
    return [0, 0]
  }
})

const vuetifyTheme = useTheme()

//-----------------------------------------------------------------------------------------
const dietinfo = ref([])

const getEatingRecord = async () => {
  console.log('체크해보자 : ')
  await axios.get('/Dietfood/DailyView.do', { params: { 'id': connetId } })
    .then(response => {
      if (response.data.length > 0) {
        // 초기화
        dietinfo.value = [[], [], []]

        response.data.forEach(data => {
          if (data.mealType === '아침') {
            dietinfo.value[0] = data
          } else if (data.mealType === '점심') {
            dietinfo.value[1] = data
          } else if (data.mealType === '저녁') {
            dietinfo.value[2] = data
          }
        })
      }
      console.log('가져온 유저 Eating_Record', dietinfo.value)
    })
}

//-----------------------------------------------------------------------------------------

const sendDataToParent = value => {
  if (!Array.isArray(checkedItems.value)) {
    checkedItems.value = []
  }

  // 배열인지 확인
  if (Array.isArray(checkedItems.value)) {
    if (checkedItems.value.includes(value)) {
      // 이미 포함된 경우 해당 값을 제거한 새 배열 생성
      checkedItems.value = checkedItems.value.filter(item => item !== value)
    } else {
      // 포함되지 않은 경우 해당 값을 추가
      checkedItems.value.push(value)
    }
  } else {
    // checkedItems.value가 배열이 아닌 경우
    console.error('checkedItems.value is not an array.')
  }

  axios.post('/croom/implementationFood.do', {
    foodCheckCount: checkedItems.value,
    id: connetId,
  })
}
</script>

<template>
  <VueApexCharts :key="series" type="radialBar" height="400" :options="statisticsChartConfig" :series="series" />

  <VTabs v-model="currentTab" grow stacked>
    <!-- 탭 목록 -->
    <VTab value="tab-1">
      <VIcon icon="mdi-food-fork-drink" class="mb-2" />
      <span>식단</span>
    </VTab>

    <VTab value="tab-2">
      <VIcon icon="mdi-dumbbell" class="mb-2" />
      <span>운동</span>
    </VTab>
  </VTabs>
  <VWindow v-model="currentTab" class="mt-5">
    <!-- 식단쪽 이행률 체크 타임라인 -->
    <VWindowItem value="tab-1">
      <VCard title="식단 이행률">
        <VCardText>
          <VTimeline side="end" align="start" line-inset="8" truncate-line="both" density="compact">
            <!-- SECTION Timeline Item: Interview Schedule -->
            <VTimelineItem size="x-small" dot-color="warning">
              <!-- 👉 Header -->
              <div class="d-flex justify-space-between align-center gap-2 flex-wrap">
                <span class="app-timeline-title">
                  아침 식단
                </span>
                <div class="d-flex">
                  <span class="app-timeline-meta align-self-center">{{ dietinfo[0]?.eating_foodname }}, {{
                    dietinfo[0]?.calory }}kcal</span>
                  <VCheckbox id="checkboxB" v-model="isBChecked" style="margin-left: 10px;" color="warning"
                    class="BCheckbox" @click="sendDataToParent('B')" />
                </div>
              </div>
              <!-- 👉 Divider -->
              <VDivider class="my-2" />

              <!-- 👉 Person -->
              <div class="d-flex align-center justify-center flex-wrap">
                <!-- 👉 Avatar & Personal Info -->
                <div>
                  <img id="diaryImages" :src="dietinfo[0]?.recipe_img"
                    style=" width: 400px; height: 300px; align-self: center; margin: 10px;">
                </div>
              </div>
            </VTimelineItem>
            <!-- !SECTION -->

            <!-- !SECTION -->
            <VTimelineItem size="x-small" dot-color="warning">
              <!-- 👉 Header -->
              <div class="d-flex justify-space-between align-center gap-2 flex-wrap">
                <span class="app-timeline-title">
                  점심 식단
                </span>
                <div class="d-flex">
                  <span class="app-timeline-meta align-self-center">{{ dietinfo[1]?.eating_foodname }}, {{
                    dietinfo[1]?.calory }}kcal</span>
                  <VCheckbox id="checkboxL" v-model="isLChecked" style="margin-left: 10px;" color="warning"
                    @click="sendDataToParent('L')" />
                </div>
              </div>


              <!-- 👉 Divider -->
              <VDivider class="my-2" />

              <!-- 👉 Person -->
              <div class="d-flex align-center justify-center flex-wrap">
                <div>
                  <img id="diaryImages" :src="dietinfo[1]?.recipe_img"
                    style=" width: 400px; height: 300px; align-self: center; margin: 10px;">
                </div>
              </div>
            </VTimelineItem>

            <!-- !SECTION -->
            <VTimelineItem size="x-small" dot-color="warning">
              <!-- 👉 Header -->
              <div class="d-flex justify-space-between align-center gap-2 flex-wrap">
                <span class="app-timeline-title ">
                  저녁 식단
                </span>
                <div class="d-flex">
                  <span class="app-timeline-meta align-self-center">{{ dietinfo[2]?.eating_foodname }}, {{
                    dietinfo[2]?.calory }}kcal</span>
                  <VCheckbox id="checkboxD" v-model="isDChecked" style="margin-left: 10px;" color="warning"
                    @click="sendDataToParent('D')" />
                </div>
              </div>


              <!-- 👉 Divider -->
              <VDivider class="my-2" />

              <!-- 👉 Person -->
              <div class="d-flex align-center justify-center flex-wrap">
                <!-- 👉 Avatar & Personal Info -->
                <img id="diaryImages" :src="dietinfo[2]?.recipe_img"
                  style=" width: 400px; height: 300px; align-self: center; margin: 10px;">
              </div>
            </VTimelineItem>
          </VTimeline>
        </VCardText>
      </VCard>
    </VWindowItem>
    <!-- 운동쪽 이행률 체크 타임라인 -->
    <VWindowItem value="tab-2">
      <TimelineBasicExercise :checked-exercise-items="checkedExerciseItems" @sendDataExer="handleDataFromChildExer" />
    </VWindowItem>
  </VWindow>
</template>
