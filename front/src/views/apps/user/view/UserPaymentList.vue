<script setup>
import axios from '@axios'
import { computed } from 'vue'
import { VDataTable } from 'vuetify/labs/VDataTable'
import { useStore } from 'vuex'

const store = useStore()

// 로그인 스토어와 사용자 스토어의 상태를 가져옵니다.
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = userInfo.value.id
const name = computed(() => store.state.userStore.userInfo ? store.state.userStore.userInfo.name : null)

// ...
const headers = [
  { title: '결제 일자', sortable: false, key: 'payDate' },
  { title: '결제명', key: 'payName' },
  { title: '결제 금액', key: 'payPrice' },
  { title: '결제 수단', key: 'payMethod' },
]

// 카테고리에 따른 값 보여주기
const filteredPaylist = computed(() => {
  if (selected.value.length === 0) {
    // 선택된 카테고리가 없는 경우 전체 paylist 반환
    return paylist.value
  } else if (selected.value.includes('지출') && selected.value.includes('수입') && selected.value.includes('충전')) {
    // '지출'과 '수입'이 모두 선택된 경우 전체 paylist 반환
    return paylist.value
  } else if (selected.value.includes('지출')) {
    // '지출'이 선택된 경우 data.payType이 1인 paylist만 반환
    return paylist.value.filter(data => data.payType === 1)
  } else if (selected.value.includes('수입')) {
    // '수입'이 선택된 경우 data.payType이 2인 paylist만 반환
    return paylist.value.filter(data => data.payType === 2)
  } else if (selected.value.includes('충전')) {
    // '수입'이 선택된 경우 data.payType이 2인 paylist만 반환
    return paylist.value.filter(data => data.payType === 0)
  } else {
    // 그 외의 경우 빈 배열 반환
    return []
  }
})

//유저 포인트 조회
const pointval = ref()

// 유저 결제 내역 가져오기
const paylist = ref([])
const form = ref('')

const userpoint = async () => {
  axios
    .get('/searchPoint', {
      params: {
        id: connetId,
      }
    })
    .then(response => {
      if (response.status === 200) {
        pointval.value = response.data.POINT
      }
    })
}

const fetchData = async () => {
  axios
    .get('/PaymentList', {
      params: {
        id: connetId,
      },
    })
    .then(response => {
      if (response.status === 200) {
        paylist.value = response.data
        console.log(response.data)
        console.log(paylist.value)
        userpoint()
      } else {
        console.log('데이터 가져오기 실패')
      }
    })
    .catch(error => {
      console.error(error)
    })
}

const items = [
  '지출',
  '수입',
  '충전',
]

const selected = ref([])

onMounted(fetchData)
</script>

<template>
  <VRow>
    <!-- 👉 Payment Methods -->

    <VCol cols="12">
      <!-- 👉 Billing Address -->
      <VCard title="결제 이력 정보">
        <VCardText>
          <VRow>
            <VCol cols="12" lg="12">
              <VCol>
                <!-- 카테고리 추가 -->
                <VRow>
                  <VCol cols="5" style="margin-top: -15px;">
                    <VSelect v-model="selected" :items="items" label="카테고리" chips multiple />
                  </VCol>
                  <VCol cols="5"
                    style="margin-top: -15px; display: flex; justify-content: flex-end; align-items: center;">
                    <h3 style="padding: 5px;">보유 포인트 : {{ pointval }} Point</h3>
                  </VCol>
                </VRow>
              </VCol>
            </VCol>
            <VDataTable :headers="headers" :items="filteredPaylist" :items-per-page="5" />
          </VRow>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
