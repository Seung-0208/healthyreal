import '@/assets/css/globacl.css'
import { useCalendarStore } from '@/views/apps/calendar/useCalendarStore'
import { useThemeConfig } from '@core/composable/useThemeConfig'
import timeGridPlugin from '@fullcalendar/timegrid'
import { useStore } from 'vuex'

export const blankEvent = {
  no: '',
  id: '',
  stitle: '',
  start: '',
  end: '',
  calendar: '',
  startArea: '',
  endArea: '',
  content: '',
  eat: '',
  exercise: '',
  complete: '',
  rPathNo: '',
  sMate: '',
}


// 캘린더 관련 기능을 제공하는 함수입니다.
export const useCalendar = (event, isEventHandlerSidebarActive, isLeftSidebarOpen, updateDetect) => {

  console.log('event: ', event);

  // 애플리케이션의 테마 설정을 가져옵니다.
  const { isAppRtl } = useThemeConfig()
  const stores = useStore()
  const userInfo = computed(() => stores.state.userStore.userInfo)

  // 캘린더 상태를 관리하는 store를 가져옵니다.
  const store = useCalendarStore()

  // FullCalendar API를 참조하는 변수입니다.
  const calendarApi = ref(null)

  // 캘린더 컴포넌트의 참조를 저장하는 변수입니다.
  const refCalendar = ref()

  // 캘린더의 색상을 설정하는 객체입니다.
  const calendarsColor = {
    '일정': 'primary',
    '아침': 'success',
    '점심': 'error',
    '저녁': 'warning',
    '운동': 'info',
    '경로': 'secondary',
  }

  const calendarsColorForIdx = ['primary', 'success', 'error', 'warning', 'info', 'secondary']
  const calendarsLabel = ['일정', '아침', '점심', '저녁', '운동', '경로']


  // API에서 받아온 이벤트 데이터를 추출하는 함수입니다.
  const extractEventDataFromEventApi = eventApi => {
    const { stitle, no, id, start, end, calendar, startArea, endArea, content, eat, exercise, complete, rPathNo, sMate } = eventApi
    
    return {
      stitle,
      no,
      id,
      start,
      end,
      calendar,
      startArea,
      endArea,
      content,
      eat,
      exercise,
      complete,
      rPathNo,
      sMate,
    }
  }




  // 캘린더에 있는 이벤트를 업데이트하는 함수입니다.
  const updateEventInCalendar = (updatedEventData, propsToUpdate, extendedPropsToUpdate) => {
    // 업데이트할 이벤트를 찾습니다.
    const existingEvent = calendarApi.value?.getEventById(updatedEventData.id)
    if (!existingEvent) {
      console.warn('Can\'t found event in calendar to update')
      
      return
    }

    // 일반 속성을 업데이트합니다.
    for (let index = 0; index < propsToUpdate.length; index++) {
      const propName = propsToUpdate[index]

      existingEvent.setProp(propName, updatedEventData[propName])
    }

    // 날짜 관련 속성을 업데이트합니다.
    existingEvent.setDates(updatedEventData.start, updatedEventData.end, { allDay: updatedEventData.allDay })

    // 확장 속성을 업데이트합니다.
    for (let index = 0; index < extendedPropsToUpdate.length; index++) {
      const propName = extendedPropsToUpdate[index]

      existingEvent.setExtendedProp(propName, updatedEventData.extendedProps[propName])
    }
  }


  // 캘린더에서 이벤트를 삭제하는 함수입니다.
  const removeEventInCalendar = eventId => {
    const _event = calendarApi.value?.getEventById(eventId)
    if (_event)
      _event.remove()
  }

  // 캘린더의 이벤트를 새로 불러오는 함수입니다.
  const refetchEvents = () => {
    calendarApi.value?.refetchEvents()
  }

  // 선택된 캘린더가 변경될 때마다 이벤트를 새로 불러옵니다.
  watch(() => store.selectedCalendars, refetchEvents)

  // 새로운 이벤트를 추가하는 함수입니다.
  const addEvent = async _event => {
    await store.addEvent(_event)
      .then(() => {
        refetchEvents()
      })
    refCalendar.value.getApi().render();
    updateDetect();
  }

  // 기존 이벤트를 업데이트하는 함수입니다.
  const updateEvent = async _event => {
    console.log('업데이트')
    try {
      await store.updateEvent(_event)

      // 캘린더의 이벤트를 새로고침
      refetchEvents();
      // refCalendar.value.getApi().render();
      updateDetect();
    } catch (error) {
      console.error('Error updating event:', error)
    }
  }

  // 이벤트를 삭제하는 함수입니다.
  const removeEvent = async (eventId, sNo) => {
    await store.removeEvent(eventId, sNo).then(() => {
      removeEventInCalendar(eventId)
      refetchEvents()
      updateDetect();
    })
    refCalendar.value.getApi().render();
  }


  // 캘린더의 옵션을 설정합니다.
  const calendarOptions = reactive({
    plugins: [timeGridPlugin], // 사용할 플러그인들입니다.
    initialView: 'timeGridDay', 
    events: async (fetchInfo, successCallback, failureCallback) => {
      //fetchInfo: { start, end, startStr, endStr, timeZone } (선택된 날짜의 범위 정보)
      console.log("fetchInfo 확인해보자", fetchInfo)
      try {
        // userId를 사용자 ID로 설정해야 합니다. props.connetId 또는 다른 방식으로 얻을 수 있습니다.
        const userId = userInfo.value.id
        console.log("fetchInfo 확인해보자-startStr", fetchInfo.startStr.split('+')[0]);
        store.dateFilter = [fetchInfo.startStr.split('+')[0], fetchInfo.endStr.split('+')[0]];
        
        //캘린더 데이터 가져오기
        await store.fetchEvents(userId);
        successCallback(store.events)
      } catch (error) {
        console.error("Error loading events: ", error)
        failureCallback(error)
      }
    },

    forceEventDuration: true, // 이벤트의 시작일과 종료일이 같은 경우에도 종료일을 null로 설정하지 않도록 합니다.

    editable: true, // 이벤트의 드래그와 리사이즈를 가능하게 합니다.

    eventResizableFromStart: true, // 이벤트의 시작 부분에서 리사이즈를 가능하게 합니다.

    dragScroll: true, // 이벤트 드래그나 날짜 선택 시 자동으로 스크롤하게 합니다.

    dayMaxEvents: 2, // 한 날짜에 표시할 최대 이벤트 수를 2로 제한합니다.

    navLinks: true, // 날짜와 주 이름을 클릭 가능하게 합니다. 클릭 시 해당 날짜나 주로 이동합니다.
    eventClassNames({ event: calendarEvent }) {
      const calendarValue = calendarEvent._def.extendedProps.calendar
      let colorName = calendarsColorForIdx[calendarValue-1];
    
      return [
        `bg-light-${colorName} text-${colorName}`, // 이벤트의 배경색과 텍스트 색을 설정합니다.
      ]
    }, // 이벤트를 클릭했을 때의 동작을 정의합니다.
    eventClick({event: clickedEvent}) {

      event.value = extractEventDataFromEventApi(clickedEvent._def.extendedProps)
      event.value.start = clickedEvent.start
      event.value.end = clickedEvent.end

      console.log("클릭한 값", event.value)
      store.clickedEvent = event.value; // 클릭된 이벤트 정보를 store에도 저장
    
      // 이벤트 핸들러 사이드바를 활성화하여 사용자가 이벤트를 수정할 수 있도록 함
      isEventHandlerSidebarActive.value = true
    },

    // 날짜를 클릭했을 때의 동작을 정의합니다.
    dateClick(info) {
      // 클릭된 날짜를 이벤트의 시작일로 설정하고, 이벤트 핸들러 사이드바를 활성화합니다.
      console.log('dateClick: ', event.value)
      event.value = { ...event.value, sch_start: info.date }
      isEventHandlerSidebarActive.value = true
    },

    // 이벤트를 드래그하여 이동했을 때의 동작을 정의합니다.
    eventDrop({ event: droppedEvent }) {
      // 이동된 이벤트의 정보를 업데이트합니다.
      updateEvent(extractEventDataFromEventApi(droppedEvent))
    },

    // 이벤트의 크기를 변경했을 때의 동작을 정의합니다.
    eventResize({ event: resizedEvent }) {
      // 변경된 이벤트의 정보를 업데이트합니다.
      if (resizedEvent.start && resizedEvent.end)
        updateEvent(extractEventDataFromEventApi(resizedEvent))
    },
    customButtons: {
      drawerToggler: {
        text: 'calendarDrawerToggler',

        // 버튼을 클릭했을 때의 동작을 정의합니다.
        click() {
          // 왼쪽 사이드바를 열어줍니다.
          isLeftSidebarOpen.value = true
        },
      },
    },
    eventContent: function(args) {
      const event = args.event.extendedProps
    //   return {
    //     html: `
    //     <div>
    //     <strong style="font-weight: bold; margin-bottom: 5px;">${event.stitle ? `${event.stitle}  ` : '  '}<span class="badge badge-${calendarsColorForIdx[event.calendar-1]}">${calendarsLabel[event.calendar-1]}</span></strong>
    //     <ul class="event-details list-unstyled">
    //     <li>${event.calendar ? (event.calendar === 1 ? '일정 :' : 
    // event.calendar === 2 ? '아침 :' : 
    //   event.calendar === 3 ? '점심 :' : 
    //     event.calendar === 4 ? '저녁 :' : 
    //       event.calendar === 5 ? '운동 :' : 
    //         event.calendar === 6 ? '경로 :' : '') : ''} ${event.eat ? event.eat : ''}${event.exercise ? event.exercise : ''}</li>
    //         <div style="margin-bottom: 3px;">출발지: ${event.startArea ? event.startArea : '미정'}</div>
    //         <div style="margin-bottom: 3px;">목적지: ${event.endArea ? event.endArea : '미정'}</div>
    //         ${event.content ? `<div style="margin-bottom: 3px;">내용: ${event.content}</div>` : ''}
    //         ${event.sMate ? `<div style="margin-bottom: 3px;">메이트: ${event.sMate}</div>` : ''}
    //   </div>
    //   `,
    //   }
      
      return {
        html: `
        <div>
        <strong style="font-weight: bold; margin-bottom: 5px;">${event.stitle ? `${event.stitle}  ` : '  '}<span class="badge badge-${calendarsColorForIdx[event.calendar-1]}">${calendarsLabel[event.calendar-1]}</span></strong>
      </div>
      `,
      }
    },
  })

  // 컴포넌트가 마운트되었을 때의 동작을 정의합니다.
  onMounted(() => {
    // 캘린더의 API를 가져와 calendarApi.value에 저장합니다.
    calendarApi.value = refCalendar.value.getApi()
  })
  watch(isAppRtl, val => {
    // 애플리케이션의 방향이 변경되었을 때 캘린더의 방향도 함께 변경합니다.
    calendarApi.value?.setOption('direction', val ? 'rtl' : 'ltr')
  }, { immediate: true })

  return {
    refCalendar,
    calendarOptions,
    refetchEvents,
    addEvent,
    updateEvent,
    removeEvent,
  }
}
