<script setup>
import {
  blankEvent,
  useCalendar,
} from '@/views/apps/calendar/useCalendar'
import { useCalendarStore } from '@/views/apps/calendar/useCalendarStore'
import { useResponsiveLeftSidebar } from '@core/composable/useResponsiveSidebar'
import FullCalendar from '@fullcalendar/vue3'
import { ref } from 'vue'

// Components
import CalendarEventHandler from '@/views/apps/calendar/CalendarEventHandler.vue'

const props = defineProps({
  connetId: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['events-updated']);

const store = useCalendarStore()

// 👉 Event
const event = ref(structuredClone(blankEvent))
// drawer 열고 닫는 상태값
const isEventHandlerSidebarActive = ref(false)

watch(isEventHandlerSidebarActive, val => {
  if (!val)
    event.value = structuredClone(blankEvent)

  // console.log(event.value)
})

function updateDetect() {
  console.log('캘린더 변경 감지');
  emit('events-updated');
}

const { isLeftSidebarOpen } = useResponsiveLeftSidebar()
const { refCalendar, calendarOptions, addEvent, updateEvent, removeEvent } = useCalendar(event, isEventHandlerSidebarActive, isLeftSidebarOpen, updateDetect)

// onMounted(async () => {
//   console.log("나는 누구인가???", props.connetId)
//   await store.fetchEvents(props.connetId) // 컴포넌트 마운트 시 이벤트 불러오기
// })

const availableCalendars = [
  {
    color: 'primary',
    label: '일정',
    value: 1,
  },
  {
    color: 'success',
    label: '아침',
    value: 2,
  },
  {
    color: 'error',
    label: '점심',
    value: 3,
  },
  {
    color: 'warning',
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
]

const mapping = {
  '일정': 1,
  '아침': 2,
  '점심': 3,
  '저녁': 4,
  '운동': 5,
  '경로': 6,
}

const addNewSchedule = () => {
  event.value = structuredClone(blankEvent)
  isEventHandlerSidebarActive.value = true
  store.clickedEvent = null; // 새로운 일정을 추가할 때는 클릭된 이벤트 정보를 초기화
}

const selectedCalendars = ref([])
const calendarKey = ref(0); // 캘린더 강제 리렌더링을 위한 키

watch(
  selectedCalendars,
  async (newVal, oldVal) => {
    console.log('[selectedCalendars] →', newVal)
    console.log('[selectedCalendars] →', newVal.length)
    if(newVal.length === 0) store.categoryFitler = [];
    else {
      newVal.forEach(item => {
        store.categoryFitler.push(mapping[item])
      })
      store.categoryFitler = Array.from(new Set(store.categoryFitler)); // 중복 제거
    }
    console.log('refCalendar 확인해보자', refCalendar.value.getApi());
    await store.fetchEvents(props.connetId);
    // refCalendar.value.getApi().render();
    calendarKey.value += 1; // 캘린더 강제 리렌더링
    // store.categoryFitler = newVal;
  },
  { flush: 'post' } // DOM 업데이트 이후에 찍고 싶으면 옵션
)
</script>

<template>
  <div>
    <VCard :class="{ 'pe-none': isEventHandlerSidebarActive }">
      <!-- `z-index: 0` Allows overlapping vertical nav on calendar -->
      <VLayout style="z-index: 0;">
        <!-- 달력 옆에 있는 메뉴 -->
        <VNavigationDrawer
          v-model="isLeftSidebarOpen"
          width="250"
          absolute
          touchless
          location="start"
          class="calendar-add-event-drawer"
          :temporary="$vuetify.display.mdAndDown"
        >
          <div class="pa-5 d-flex flex-column gap-y-8">
            <VBtn
              block
              @click="addNewSchedule"
            >
              추가
            </VBtn>
            <div>
              <p class="text-sm text-uppercase text-medium-emphasis mb-3">
                Calendars
              </p>
              <!-- ⬇️ 카테고리 선택 -->
              <div class="d-flex flex-column calendars-checkbox">
                <VCheckbox
                  v-for="calendar in availableCalendars"
                  :key="calendar.label"
                  v-model="selectedCalendars"
                  :value="calendar.label"
                  :color="calendar.color"
                  :label="calendar.label"
                  
                  class="pt-1"
                />
              </div>
            </div>
          </div>
        </VNavigationDrawer>
        <VMain>
          <VCard flat>
            <FullCalendar
              ref="refCalendar"
              :options="calendarOptions"
              :key="calendarKey"
            />
          </VCard>
        </VMain>
      </VLayout>
    </VCard>
    <Teleport to="body">
      <CalendarEventHandler
        v-model:isDrawerOpen="isEventHandlerSidebarActive"
        :event="event"
        @add-event="addEvent"
        @update-event="updateEvent"
        @remove-event="removeEvent"
      />
    </Teleport>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/libs/full-calendar";

.calendars-checkbox {
  .v-label {
    color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
    opacity: var(--v-high-emphasis-opacity);
  }
}

.calendar-add-event-drawer {
  &.v-navigation-drawer:not(.v-navigation-drawer--temporary) {
    border-end-start-radius: 0.375rem;
    border-start-start-radius: 0.375rem;
  }
}
</style>

<style lang="scss" scoped>
.v-layout {
  overflow: visible !important;

  .v-card {
    overflow: visible;
  }
}
</style>
