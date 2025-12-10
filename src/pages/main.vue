<script setup>
import ExerciseMainVue from '@/components/ExerciseMain.vue'
import Calendar from '@/pages/apps/calendar.vue'
import Timeline from '@/pages/components/timeline.vue'
import axiosflask from '@/plugins/axiosflask'
import CrmActivityTimeline from '@/views/dashboards/crm/CrmActivityTimeline.vue'
import axios from '@axios'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import MainMap from './exercise/map/MainMap.vue'


import { startSynthesis, stopSynthesis } from './tts.js'


const router = useRouter()
const store = useStore()
const rpathNo = ref() //지도 번호

// computed를 import합니다.
const userInfo = computed(() => store.state.userStore.userInfo)

// const userInfo = computed(() => store.state.userStore.userInfo)
// const connetId = userInfo.value.id


const route = useRoute()
const isDialogVisible = ref(false)
const isPDialogVisible = ref(!isDialogVisible.value)

const dietinfo = ref([""])

let lastFoodRecommendationTime = null

const getEatingRecord = async () => {

  if (userInfo.value && userInfo.value.id) {

    const connetId = userInfo.value.id

    await axios.get('/Dietfood/DailyView.do', { params: { 'id': connetId } })
      .then(response => {
        if (response.data.length > 0) {

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
        else {
          if (!lastFoodRecommendationTime || Date.now() - lastFoodRecommendationTime > 60000) {
            axios.get("/dietfood/search.do", { params: { 'id': connetId } })
              .then(response => {
                console.log('응답받은 행:', response.data)
                if (response.data === 0) {
                  axiosflask.get("/recommend/recommendFood", { params: { 'id': connetId } })
                    .then(response => {
                      lastFoodRecommendationTime = Date.now()
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
                    })
                }
              })
          }
        }
      })
  }

}

onMounted(() => {
  // 다른 함수를 실행
  getEatingRecord()

})


const test = () => {
  console.log("테스트용 클릭 이벤트; ", rpathNo)
}

const mainMapNo = ref()

const mainMapRef = ref(null)


const refs = ref(null)

watch(rpathNo, () => {
  console.log("main.vue에서 값 변경을 확인", rpathNo)
  mainMapNo.value = rpathNo

  mainMapRef.value.test()
})

const userTab = ref(null)

const tabs = [
  {
    icon: 'mdi-silverware-fork-knife',
    title: '식단',
    color: 'warning',
  },
  {
    icon: 'mdi-dumbbell',
    title: '운동',
    color: 'success',
  },
  {
    icon: 'mdi-map-check',
    title: '경로',
    color: 'success',
  },

]

const iconss = [
  {
    icon: 'mdi-contactless-payment-circle-outline',
    title: '오늘의 스케쥴',
  },
]

const dietPlansList = [
  {
    title: '아침 메뉴',
    index: 0,
  },
  {
    title: '점심 메뉴',
    index: 1,
  },
  {
    title: '저녁 메뉴',
    index: 2,
  },
]

const moveRecipe = () => {
  router.push({ path: "/dietfood" })
}

const summaryData = ref([])

const handleSummaryUpdate = newSummaryArray => {

  summaryData.value = newSummaryArray
  console.log("요약내용 보기", summaryData.value.summary)
}

const startTTS = () => {
  startSynthesis(summaryData.value.summary)
}

const refreshTimeline = ref(0);
function onCalendarUpdated() {
  // 키 변경 → Timeline이 watch해서 재조회
  console.log('캘린더 변경 감지 - 타임라인 새로고침');
  refreshTimeline.value++
}

</script>

<template>
  <section>
    <VRow class="fill-height">
      <VCol cols="12" md="8">
        <VExpansionPanels variant="accordion">
          <VExpansionPanel v-for="item in 1" :key="item">
            <VExpansionPanelTitle>
              <h6 class="text-h6">
                Calendar
              </h6>
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <Calendar :connet-id="userInfo.id" @events-updated="onCalendarUpdated" />
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
        <VCol cols="12" />
        <VTabs v-model="userTab" class="v-tabs-pill">
          <VTab v-for="tab in tabs" :key="tab.icon" :color="tab.color" block>
            <VIcon start :icon="tab.icon" />
            <span>{{ tab.title }}</span>
          </VTab>
        </VTabs>

        <VWindow v-model="userTab" class="mt-6 disable-tab-transition" :touch="false">
          <VWindowItem>
            <VRow>
              <VCol v-for="list in dietPlansList" :key="list.index" cols="12" md="4" style="height: 400px;">
                <VCard class="text-center" @click="moveRecipe">
                  <VCardItem class="d-flex flex-column justify-center align-center">
                    <VAvatar variant="tonal" size="160" class="mb-2">
                      <VImg v-if="!dietinfo[list.index]" size="160px" />
                      <VImg v-else style="height: 160px;" :src="dietinfo[list.index]?.recipe_img" />
                    </VAvatar>
                    <h6 class="text-h6">
                      <span v-if="dietinfo.length > 0 && dietinfo[list.index] != ''">{{
                        dietinfo[list.index]?.eating_foodname }}</span>

                      <span v-else>{{ list.index == 0 ? '아침' : list.index == 1 ? '점심' : '저녁' }} 메뉴</span>
                    </h6>
                  </VCardItem>
                  <VCardText style="height: 100px;">
                    <span v-if="dietinfo.length > 0">{{ dietinfo[list.index].recipe_title }}</span>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>
          </VWindowItem>
          <!-- ------------------ 운동 ---------------------- -->
          <VWindowItem>
            <ExerciseMainVue />
          </VWindowItem>

          <!-- ------------------경로-------------------- -->
          <VWindowItem>
            <MainMap ref="mainMapRef" v-model:rpathNo="mainMapNo" />
          </VWindowItem>
        </VWindow>
        <VCol cols="12" />
        <VCard>
          <VRow>
            <VCardText style=" display: flex;width: 100%; justify-content: space-between;">
              <VBtn style="height: 40px;" variant="text" @click="startTTS">
                <VIcon start icon="mdi-contactless-payment-circle-outline" />
                오늘의 스케쥴
              </VBtn>
              <VBtn variant="flat" color="info" @click="stopSynthesis">
                중지
              </VBtn>
            </VCardText>
          </VRow>
        </VCard>
        <!-- -->
      </VCol>

      <VCol cols="12" md="4">
        <CrmActivityTimeline v-model:rpathNo="rpathNo" @update:summary="handleSummaryUpdate" @click="test"
          :refreshKey="refreshTimeline" />
        <Timeline />
      </VCol>
    </VRow>
  </section>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
