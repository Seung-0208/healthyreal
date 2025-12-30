<script setup>
import axios from '@axios'
import { defineEmits, defineProps, ref } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  checkedExerciseItems: Array,
})

const emit = defineEmits(['sendDataExer'])
const checkedExerciseItems = ref([])

const store = useStore()

// 로그인 스토어와 사용자 스토어의 상태를 가져옵니다.
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = userInfo.value.id

const data = ref([])

// 여기에 checkedItem에 체크박스 value 저장 저장된 배열 [id].vue에 emit으로 데이터 보냄
function sendDataToParent(value) {
  const checkedExerciseItems = ref(props.checkedExerciseItems)
  if (!Array.isArray(checkedExerciseItems.value)) {
    checkedExerciseItems.value = []
  }

  if (checkedExerciseItems.value.includes(value)) {
    // 이미 포함된 경우 해당 값을 제거한 새 배열 생성
    checkedExerciseItems.value = checkedExerciseItems.value.filter(item => item !== value)
  } else {
    // 포함되지 않은 경우 해당 값을 추가
    checkedExerciseItems.value.push(value)
    console.log('전달하기 전', checkedExerciseItems.value)
  }

  // 변경된 배열을 emit으로 전달
  emit('sendDataExer', checkedExerciseItems.value)

  axios.post('/croom/implementationExercise.do', {
    exerciseCheckCount: checkedExerciseItems.value,
    id: connetId,
  })
  console.log('여기도 갔나')
}

const checkfor = ref(false)

const isChecked1 = ref(false)
const isChecked2 = ref(false)
const isChecked3 = ref(false)

onMounted(async () => {
  if (!Array.isArray(props.checkedExerciseItems)) {
    props.checkedExerciseItems = []
  } else if (props.checkedExerciseItems.includes('1')) {
    isChecked1.value = true
    console.log(isChecked1)
  } else if (props.checkedExerciseItems.includes('2')) {
    isChecked2.value = true
  } else if (props.checkedExerciseItems.includes('3')) {
    isChecked3.value = true
  }
  checkfor.value = true
  await getData()
})

//------------------------------------------------------

const getData = async () => {

  const response = await axios.post('/exer/getData.do', { id: connetId })

  data.value = response.data
  console.log("운동 값 가져와??", data.value)

}
</script>

<template>
  <VCard title="운동 이행률">
    <VCardText>
      <VTimeline side="end" align="start" line-inset="8" truncate-line="both" density="compact">
        <!-- SECTION Timeline Item: Interview Schedule -->
        <VTimelineItem size="x-small" dot-color="info">
          <!-- 👉 Header -->
          <div class="d-flex justify-space-between align-center gap-2 flex-wrap">
            <span class="app-timeline-title">
              운동 1
            </span>
            <div class="d-flex">
              <span class="app-timeline-meta align-self-center">{{ data[0]?.ename }}, 시간당 {{ data[0]?.calories_per_hour
                }}칼로리 </span>
              <VCheckbox v-model="isChecked1" color="info" style="margin-left: 10px;" :checked="isChecked1"
                @click="sendDataToParent('1')" />
            </div>
          </div>


          <!-- 👉 Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Person -->
          <div class="d-flex align-center justify-center flex-wrap">
            <!-- 👉 Avatar & Personal Info -->
            <iframe width="400" height="300" :src="data[0]?.evideoPath" style="align-self: center; margin: 10px;"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen />
          </div>
        </VTimelineItem>
        <!-- !SECTION -->

        <!-- !SECTION -->
        <VTimelineItem size="x-small" dot-color="info">
          <!-- 👉 Header -->
          <div class="d-flex justify-space-between align-center gap-2 flex-wrap">
            <span class="app-timeline-title">
              운동 2
            </span>
            <div class="d-flex">
              <span class="app-timeline-meta align-self-center">{{ data[1]?.ename }}, 시간당 {{ data[1]?.calories_per_hour
                }}칼로리</span>
              <VCheckbox v-model="isChecked2" :selecled="isChecked2" style="margin-left: 10px;" color="info"
                @click="sendDataToParent('2')" />
            </div>
          </div>


          <!-- 👉 Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Person -->
          <div class="d-flex align-center justify-center flex-wrap">
            <!-- 👉 Avatar & Personal Info -->
            <iframe width="400" height="300" :src="data[1]?.evideoPath" style="align-self: center; margin: 10px;"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen />
          </div>
        </VTimelineItem>

        <!-- !SECTION -->
        <VTimelineItem size="x-small" dot-color="info">
          <!-- 👉 Header -->
          <div class="d-flex justify-space-between align-center gap-2 flex-wrap">
            <span class="app-timeline-title">
              운동 3
            </span>
            <div class="d-flex">
              <span class="app-timeline-meta align-self-center">{{ data[2]?.ename }}, 시간당 {{ data[2]?.calories_per_hour
                }}칼로리</span>
              <VCheckbox v-model="isChecked3" :selecled="isChecked3" style="margin-left: 10px;" color="info"
                @click="sendDataToParent('3')" />
            </div>
          </div>


          <!-- 👉 Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Person -->
          <div class="d-flex align-center justify-center flex-wrap">
            <!-- 👉 Avatar & Personal Info -->
            <iframe width="400" height="300" :src="data[2]?.evideoPath" style="align-self: center; margin: 10px;"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen />
          </div>
          {{ data[2]?.evideoPath }}
        </VTimelineItem>
      </VTimeline>
    </VCardText>
  </VCard>
</template>
