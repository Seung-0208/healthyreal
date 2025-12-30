import axios from '@axios';
import { defineStore } from 'pinia';

export const useCalendarStore = defineStore('calendar', {
  // arrow function recommended for full type inference
  state: () => ({
    /**
     * 스케쥴 카테고리 메뉴
     */
    availableCalendars: [
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
    ],
    selectedCalendars: [1, 2, 3, 4, 5, 6],
    events: [], // 캘린더 이벤트 데이터를 저장할 상태 (이 값이 데이터에 뿌려짐)
    categoryFitler: [], // 카테고리 필터 상태
    dateFilter: [], // 날짜 필터 상태
    clickedEvent: null, // 클릭된 이벤트 정보를 저장할 상태
  }),
  actions: {
    //데이터 불러오기
    async fetchEvents(userId) {
      const response = await axios.post('/sch/seleteAll.do', { 
        id: userId,
        startStr: this.dateFilter.length === 2 ? this.dateFilter[0] : null,
        endStr: this.dateFilter.length === 2 ? this.dateFilter[1] : null,
        category: this.categoryFitler.length === 0 ? null : this.categoryFitler
      })

      this.events = response.data.map(eventData => ({
        no: eventData.sno,
        id: eventData.id,
        stitle: eventData.stitle,
        start: eventData.start,
        end: eventData.end,
        calendar: eventData.cal,
        startArea: eventData.sarea,
        endArea: eventData.sdest,
        content: eventData.scontent,
        eat: eventData.seat,
        exercise: eventData.sexer,
        complete: eventData.scom,
        rPathNo: eventData.rpathNo,
        sMate: eventData.smate,

      }))

      console.log("가져온 이벤트 데이터", this.events)
      
      return this.events // 수정된 부분
    },
    async addEvent(eventData) {
      try {
        console.log("추가값 확인해보자", eventData);
        const response = await axios.post('/sch/insert.do', eventData)

        this.fetchEvents(eventData.id) // 이벤트 목록 갱신
      } catch (error) {
        console.error('Event addition failed:', error)
      }
    },
    async updateEvent(event) {
      console.log("수정값 확인해보자", event)

      const response = await axios.post(`/sch/update.do`,  event)


      await this.fetchEvents(event.id) // 업데이트 후 캘린더 이벤트 목록 갱신
      
      return response
    },
    async removeEvent(eventId, sNo) {

      const response = await axios.post('/sch/delete.do', { id: eventId, sNo: sNo })

      await this.fetchEvents(eventId) // 삭제 후 캘린더 이벤트 목록 갱신
      
      return response
    },
  },
})
