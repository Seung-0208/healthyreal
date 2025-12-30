<script setup>
import axios from '@axios'

// Images
import { useStore } from 'vuex'

const store = useStore()

// 로그인 스토어와 사용자 스토어의 상태를 가져옵니다.
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = userInfo.value.id

const getDotColor = mhdate => {
  const colors = ['']

  if (mhdate.mem_colname == 'NAME') {
    colors.value = 'error'
  }
  else if (mhdate.mem_colname == 'GENDER') {
    colors.value = 'primary'
  }
  else if (mhdate.mem_colname == 'B_DAY') {
    colors.value = 'primary'
  }
  else if (mhdate.mem_colname == 'TEL') {
    colors.value = 'info'
  }
  else if (mhdate.mem_colname == 'USERADDRESS') {
    colors.value = 'info'
  }
  else if (mhdate.mem_colname == 'HEIGHT') {
    colors.value = 'success'
  }
  else if (mhdate.mem_colname == 'WEIGHT') {
    colors.value = 'success'
  }
  else if (mhdate.mem_colname == 'GOAL_NO') {
    colors.value = 'success'
  }
  else colors.value = 'success'

  return colors.value
}

// mh는 Member_History 테이블을 뜻하는 약자
const mhdate = ref([])
const form = ref('')

const fetchData = async () => {
  axios
    .get('/memberhistory/View.do', {
      params: {
        id: connetId,
      },
    })
    .then(response => {
      if (response.status === 200) {
        mhdate.value = response.data
      } else {
        console.log('데이터 가져오기 실패')
      }
    })
    .catch(error => {
      console.error(error)
    })
}

onMounted(fetchData)
</script>

<template>
  <VRow>
    <VCol cols="12">
      <!-- :point_right: Activity timeline -->
      <VCard title="히스토리">
        <VCardText>
          <VTimeline v-if="mhdate.length > 0" density="compact" align="start" truncate-line="both"
            class="v-timeline-density-compact">
            <VTimelineItem v-for="(data, index) in mhdate" :key="index" :dot-color="getDotColor(data)" size="x-small">
              <div class="d-flex justify-space-between align-center flex-wrap gap-2 mb-3">
                <span class="app-timeline-title">
                  {{ data.mem_colname == 'NAME' ? '이름을' :
                    data.mem_colname == 'GENDER' ? '성별을' :
                      data.mem_colname == 'B_DAY' ? '생일을' :
                        data.mem_colname == 'TEL' ? '번호를' :
                          data.mem_colname == 'USERADDRESS' ? '주소를' :
                            data.mem_colname == 'HEIGHT' ? '키를' :
                              data.mem_colname == 'WEIGHT' ? '몸무게를' :
                                data.mem_colname == 'GOAL_NO' ? '목표를' : '' }} '{{ data.before_value }}'에서 '{{ data.after_value }}'로
                  수정하셨습니다.
                </span>
                <span class="app-timeline-meta">{{ data.update_day }}</span>
              </div>
            </VTimelineItem>
          </VTimeline>
          <div v-else>
            변경 이력이 없습니다.
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
