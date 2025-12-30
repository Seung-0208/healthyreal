<script setup>
import axiosflask from '@/plugins/axiosflask'
import axios from '@axios'
import { computed, defineProps, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { transcript } from '/src/pages/stt.js'

const props = defineProps({
  rpathNo: {
    type: String,
  },
  refreshKey: {
    type: Number
  }
})

watch(() => props.refreshKey, async () => {
  console.log("타임라인 새로고침:", props.refreshKey)
  await getData()
}, { immediate: true })

const emit = defineEmits(['update:summary', 'update:rpathNo'])
const date = new Date()
const toDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
const text = transcript
const store = useStore()
const userInfo = computed(() => store.state.userStore.userInfo)


onMounted(async () => await getData())

const Data = ref()
const summary = ref([])

async function getData() {

  try {
    const response = await axios.post('/sch/seleteTodayAll.do', { id: userInfo.value.id })

    Data.value = response.data

    console.log("타임라인 확인:", Data.value)

    const putData = await axiosflask.post('/summaryAPI', { content: Data.value })

    summary.value = putData.data
    console.log("요약내용 확인:", summary.value)

  } catch (error) {
    console.error(error)
  }
}

watch(summary, newSummary => {
  emit('update:summary', newSummary)
})


// 시간을 추출하는 함수를 정의
const getTime = datetime => {
  return datetime ? new Date(datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null
}

const getCalLabel = cal => {
  switch (cal) {
    case 1: return '일정'
    case 2: return '아침'
    case 3: return '점심'
    case 4: return '저녁'
    case 5: return '운동'
    case 6: return '경로'
    default: return ''
  }
}

const calendarsColorForIdx = ['primary', 'success', 'error', 'warning', 'info', 'secondary']

const gotoMap = rpathNo => {
  console.log("클릭 확인:", rpathNo)
  emit('update:rpathNo', rpathNo)
}
</script>

<template>
  <VCard title="Daily Timeline" style=" width: auto;height: 610px; overflow-y: auto;" class="scrollbar">
    <VCardText>
      <VTimeline density="compact" align="start" line-inset="8" truncate-line="both">
        <VTimelineItem v-for="calendarEvent in Data" :key="calendarEvent"
          :dot-color="calendarsColorForIdx[calendarEvent.cal - 1]" size="x-small"
          @click="gotoMap(calendarEvent.rpathNo)">
          <VCol>
            <div class="d-flex justify-space-between align-center flex-wrap" :style="{ cursor: 'pointer' }">
              <h4 class="app-timeline-title me-1 mb-2">
                {{ calendarEvent.stitle }}
              </h4>
              <small class="app-timeline-meta text-no-wrap">{{ getTime(calendarEvent.start) }} ~ {{
                getTime(calendarEvent.end) }} </small>
            </div>
            <p v-if="calendarEvent.cal" class="mb-0 app-timeline-text">
              {{ getCalLabel(calendarEvent.cal) }} : {{ getCalLabel(calendarEvent.cal) == '운동' ? calendarEvent.sexer :
                calendarEvent.seat }}
            </p>
            <p v-if="calendarEvent.scontent" class="mb-0 app-timeline-text">
              내용 : {{ calendarEvent.scontent }}
            </p>
            <p v-if="calendarEvent.sarea" class="mb-0 app-timeline-text">
              출발지 : {{ calendarEvent.sarea }}
            </p>
            <p v-if="calendarEvent.sdest" class="mb-0 app-timeline-text">
              목적지 : {{ calendarEvent.sdest }}
            </p>
            <p v-if="calendarEvent.smate" class="mb-0 app-timeline-text">
              메이트 : {{ calendarEvent.smate }}
            </p>
          </VCol>
        </VTimelineItem>
      </VTimeline>
    </VCardText>
  </VCard>
</template>
