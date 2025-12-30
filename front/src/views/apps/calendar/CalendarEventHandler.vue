<script setup>
import axiosflask from '@/plugins/axiosflask'
import axios from '@axios'
import {
  requiredValidator,
} from '@validators'
import { computed, onUpdated, ref } from 'vue'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { VForm } from 'vuetify/components/VForm'
import { useStore } from 'vuex'
import { transcript } from '/src/pages/stt.js'

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  event: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'addEvent',
  'updateEvent',
  'removeEvent',
])

const refForm = ref()



// 👉 Event
const event = ref(JSON.parse(JSON.stringify(props.event)))


const resetEvent = () => {
  event.value = JSON.parse(JSON.stringify(props.event))
  nextTick(() => {
    refForm.value?.resetValidation()
  })
}

watch(() => props.isDrawerOpen, resetEvent)

/**
 * 일정 삭제
 * @param event 삭제할 이벤트 객체 번호
 */
const removeEvent = event => {
  emit('removeEvent', userInfo.value.id, event)
  // Close drawer
  emit('update:isDrawerOpen', false)
  deleteConfirm.value = false
}

/**
 * 모달 닫기
 */
const onCancel = () => {

  // Close drawer
  emit('update:isDrawerOpen', false)
  nextTick(() => {
    refForm.value?.reset()
    resetEvent()
    refForm.value?.resetValidation()
  })
}

const startDateTimePickerConfig = computed(() => {
  const config = {
    enableTime: !event.value.allDay,
    dateFormat: `Y-m-d${event.value.allDay ? '' : ' H:i'}`,
  }

  if (event.value.end)
    config.maxDate = event.value.end

  return config
})

const endDateTimePickerConfig = computed(() => {
  const config = {
    enableTime: !event.value.allDay,
    dateFormat: `Y-m-d${event.value.allDay ? '' : ' H:i'}`,
  }

  if (event.value.start)
    config.minDate = event.value.start

  return config
})

// transcript의 값이 변경될 때 userInput의 값을 업데이트
watch(transcript, newValue => {
  userInput.value = `${newValue} ${userInput.value}`
})

const title = ref('')
const calendar = ref(null)
const start = ref('')
const end = ref('')
const userInput = ref('')

const startArea = reactive({
  address: '',
})

const endArea = reactive({
  address: '',
})


const handleUpdateAddressStart = newAddress => {
  startArea.address = newAddress.address
}

const handleUpdateAddressEnd = newAddress => {
  endArea.address = newAddress.address
}

// State
const availableCalendars = ref([
  {
    color: 'success',
    label: '일정',
    value: 1,
  },
  {
    color: 'error',
    label: '아침',
    value: 2,
  },
  {
    color: 'warning',
    label: '점심',
    value: 3,
  },
  {
    color: '',
    label: '저녁',
    value: 4,
  },
  {
    color: 'info',
    label: '운동',
    value: 5,
  },
  {
    color: 'secondary',
    label: '경로',
    value: 6,
  },
])

async function handleSubmit() {
  // 필수 필드 검사
  if (!title.value || !calendar.value || !start.value || !end.value || !userInput.value) {

    return
  }

  const postData = {
    title: title.value,
    calendar: calendar.value,
    start: start.value,
    end: end.value,
    startArea: startArea.address,
    endArea: endArea.address,
    content: userInput.value,
    eat: sub.value,
    exercise: exercise.value,
    id: userInfo.value.id,

    // 수정 모드일 경우 기존 이벤트의 id 또는 no 추가
    ...(event.value.no && { no: event?.value.no }),
  }


  // 추가 또는 수정 이벤트 발생
  if (event.value.no) {
    await emit('updateEvent', postData) // 수정 이벤트
  } else {
    await emit('addEvent', postData) // 추가 이벤트
  }
  emit('update:isDrawerOpen', false)
}

const dietinfo = ref([])
const exercise = ref('')
const eat = ref('')
const loading = ref(true)

const deleteConfirm = ref(false);


const sub = computed({
  get: () => {
    switch (calendar.value) {
      case 2: return dietinfo.value[0]?.eating_foodname || eat.value
      case 3: return dietinfo.value[1]?.eating_foodname || eat.value
      case 4: return dietinfo.value[2]?.eating_foodname || eat.value
      case 5: return exercise.value
      default: return ''
    }
  },
  set: newValue => {
    console.log('sub set 호출됨', event.value.no);
    if (event.value.no !== '') {
      switch (calendar.value) {
        case 2: dietinfo.value[0] ? dietinfo.value[0].eating_foodname = newValue : eat.value = newValue; break
        case 3: dietinfo.value[1] ? dietinfo.value[1].eating_foodname = newValue : eat.value = newValue; break
        case 4: dietinfo.value[2] ? dietinfo.value[2].eating_foodname = newValue : eat.value = newValue; break
        case 5: exercise.value = newValue; break
      }
    }
  },
})


const store = useStore()

const userInfo = computed(() => store.state.userStore.userInfo)


const getEatingRecord = async () => {
  loading.value = true

  if (userInfo.value && userInfo.value.id) {

    const connetId = userInfo.value.id

    console.log('4차')
    console.log('체크해보자 : ' + connetId)
    await axios.get('/Dietfood/DailyView.do', { params: { 'id': connetId } })
      .then(response => {
        if (response.data.length > 0) {
          // 초기화
          console.log('여긴안돼')
          console.log('응답받은 행:', response.data)
          dietinfo.value = [null, null, null]

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
          axios.get("/dietfood/search.do", { params: { 'id': connetId } })
            .then(response => {
              console.log('응답받은 행:', response)
              if (response.data === 0) {
                axiosflask.get("/food_recommend", { params: { 'id': connetId } })
                  .then(response => {

                    dietinfo.value = [null, null, null]

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
        console.log('가져온 유저 Eating_Record', dietinfo.value)
      })
  }
  loading.value = false
}

onUpdated(() => {
  // 다른 함수를 실행
  title.value = event.value.stitle || '';
  calendar.value = event.value.calendar || null;
  start.value = event.value.start || '';
  end.value = event.value.end || '';
  exercise.value = event.value.exercise || '';
  eat.value = event.value.eat || '';
  userInput.value = event.value.content || '';

  // if(event.value.no=='') sub.value = '';
  // else sub.value = event.value.eat || event.value.exercise;
  getEatingRecord()
  console.log("dietinfo", dietinfo)

})
</script>

<template>
  <VDialog :model-value="deleteConfirm" persistent width="300" style="padding-top: 20px;">
    <VCard>
      <v-card-text>
        정말 삭제하시겠습니까?
      </v-card-text>
      <template v-slot:actions>
        <v-spacer></v-spacer>

        <v-btn color="error" @click="() => removeEvent(event.no)">
          예
        </v-btn>

        <v-btn color="secondary" @click="() => deleteConfirm = false">
          아니요
        </v-btn>
      </template>
    </VCard>
  </VDialog>
  <VNavigationDrawer style="z-index: 1000;" :scrim="true" scroll-strategy="block" permanent temporary location="end"
    :model-value="props.isDrawerOpen" width="420" class="scrollable-content"
    @update:model-value="(val) => $emit('update:isDrawerOpen', val)">
    <!-- 👉 Header -->
    <AppDrawerHeaderSection :title="event.no ? 'Update Event' : 'Add Event'"
      @cancel="$emit('update:isDrawerOpen', false)">
      <template #beforeClose>
        <IconBtn v-show="event.no" @click="deleteConfirm = true">
          <VIcon size="18" icon="mdi-trash-can-outline" />
        </IconBtn>
      </template>
    </AppDrawerHeaderSection>

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- SECTION Form -->
          <VForm ref="refForm" @submit.prevent="handleSubmit">
            <VRow>
              <!-- 👉 Title -->
              <VCol cols="12">
                <VTextField v-model="title" label="Title" :rules="[requiredValidator]" />
              </VCol>

              <!-- 👉 Calendar -->
              <VCol cols="12">
                <VSelect v-model="calendar" label="Calendar" :rules="[requiredValidator]" :items="availableCalendars"
                  :item-title="item => item.label" :item-value="item => item.value"
                  placeholder="choies your schedule type">
                  <template #selection="{ item }">
                    <div v-show="calendar" class="align-center" :class="calendar ? 'd-flex' : ''">
                      <VBadge :color="item.raw.color" inline dot class="pa-1" />
                      <span>{{ item.raw.label }}</span>
                    </div>
                  </template>
                </VSelect>
              </VCol>
              <!-- 👉 eat 또는 excercise -->
              <VCol v-if="calendar !== 1 && calendar !== 6 && calendar !== null" cols="12">
                <VTextField v-model="sub" />
              </VCol>
              <!-- 👉 Start date -->
              <VCol cols="12">
                <AppDateTimePicker :key="JSON.stringify(startDateTimePickerConfig)" v-model="start"
                  :rules="[requiredValidator]" label="Start date" :config="startDateTimePickerConfig" />
              </VCol>

              <!-- 👉 End date -->
              <VCol cols="12">
                <AppDateTimePicker :key="JSON.stringify(endDateTimePickerConfig)" v-model="end"
                  :rules="[requiredValidator]" label="End date" :config="endDateTimePickerConfig" />
              </VCol>

              <!-- 👉 Location -->
              <VCol cols="12">
                <AddressApiStart v-model="startArea" :new-address="startArea"
                  @update-address="handleUpdateAddressStart" />
                <AddressApiEnd v-model="endArea" :new-address="endArea" @update-address="handleUpdateAddressEnd" />
              </VCol>

              <!-- 👉 Description -->
              <VCol cols="12">
                <!-- <VBtn
                  id="startBtn"
                  class="d-flex flex-column align-end front-z-axis"
                  style=" z-index: 9999; height: 45px; margin-top: 80px;margin-left: 295px;"
                  variant="tonal"
                  @click="startRecognition"
                >
                  <VIcon
                    size="x-large"
                    icon="mdi-microphone-outline"
                    color="success"
                  />
                </VBtn> -->
                <!-- style="margin-top: 0px;" -->
                <VTextarea v-model="userInput" :rules="[requiredValidator]" label="content" style="margin-top: 0px;"
                  no-resize />
              </VCol>


              <!-- 👉 Form buttons -->
              <VCol cols="12">
                <VBtn type="submit" class="me-3">
                  저장
                </VBtn>
                <VBtn variant="tonal" color="secondary" @click="onCancel">
                  닫기
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
          <!-- !SECTION -->
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>

  <VOverlay :model-value="props.isDrawerOpen" :scrim="true" scroll-strategy="block" persistent style="z-index: 1;" />
</template>
