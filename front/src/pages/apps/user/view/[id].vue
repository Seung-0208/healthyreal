<script setup>
import ApexChartStatistics from '@/pages/components/ApexChartStatistics.vue'
import MyList from '@/pages/myList.vue'
import { useUserListStore } from '@/views/apps/user/useUserListStore'
import UserBioPanel from '@/views/apps/user/view/UserBioPanel.vue'
import UserEdit from '@/views/apps/user/view/UserEdit.vue'
import UserHistory from '@/views/apps/user/view/UserHistory.vue'
import UserPaymentList from '@/views/apps/user/view/UserPaymentList.vue'
import ApexChartAreaChart from '@/views/charts/apex-chart/ApexChartAreaChart.vue'
import ChartJsPolarAreaChart from '@/views/charts/chartjs/ChartJsPolarAreaChart.vue'
import ChartJsRadarChart from '@/views/charts/chartjs/ChartJsRadarChart.vue'
import axios from '@axios'
import { ref } from 'vue'
import { useStore } from 'vuex'


const store = useStore()

// 로그인 스토어와 사용자 스토어의 상태를 가져옵니다.
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId=userInfo.value.id

const userListStore = useUserListStore()
const route = useRoute()
const userData = ref()
const userTab = ref(null)


const tabs = [
  {
    icon: 'mdi-account-edit',
    title: '회원정보 수정',
  },
  {
    icon: 'mdi-text-box-edit',
    title: '게시글 수정',
  },
  {
    icon: 'mdi-chart-bar',
    title: '분석',
  },
  {
    icon: 'mdi-history',
    title: '히스토리',
  },
  {
    icon: 'mdi-poll',
    title: '이행률',
  },
  {
    icon: 'mdi-credit-card-plus',
    title: '결제내역',
  },
]

const chartJsCustomColors = {
  white: '#fff',
  yellow: '#ffe802',
  primary: '#836af9',
  areaChartBlue: '#2c9aff',
  barChartYellow: '#ffcf5c',
  polarChartGrey: '#4f5d70',
  polarChartInfo: '#299aff',
  lineChartYellow: '#d4e157',
  polarChartGreen: '#28dac6',
  lineChartPrimary: '#9e69fd',
  lineChartWarning: '#ff9800',
  horizontalBarInfo: '#26c6da',
  polarChartWarning: '#ff8131',
  scatterChartGreen: '#28c76f',
  warningShade: '#ffbd1f',
  areaChartBlueLight: '#84d0ff',
  areaChartGreyLight: '#edf1f4',
  scatterChartWarning: '#ff9f43',
}

userListStore.fetchUser(Number(route.params.id)).then(response => {
  userData.value = response.data
})

// R 서버로 해당 유저의 보고서 요청
const Rsave = async () =>{

  //   // 렌더링된 html 받아서 파일 열기
  //   try {
  //     const response = await axios.get('http://127.0.0.1:8000/api/htmlfile', { params: { userid: connetId } })
  //     const htmlContent = response.data.content

  //     // 새로운 팝업 창 열기
  //     const newWindow = window.open("", "_blank")
    
  //     // HTML 내용을 팝업 창에 쓰기
  //     newWindow.document.write(htmlContent)
  //   } catch (error) {
  //     console.error("오류 발생:", error)
  //   }

  axios.get('http://127.0.0.1:8000/api/htmlfile', { params: { userid: connetId } })
    .then(response => {
    // 여기에서 response.data가 실제 HTML 내용을 포함하고 있는지 확인
      console.log(response.data) // 이를 통해 반환된 HTML 내용을 확인

      const newWindow = window.open("", "_blank")

      newWindow.document.write(response.data)
    })
    .catch(error => {
      console.error("오류 발생:", error)
    })
}
</script>

<template>
  <VRow v-if="userData">
    <VCol cols="4">
      <UserBioPanel :user-data="userData" />
    </VCol>
    <VCol
      cols="12"
      md="8"
    >
      <VTabs
        v-model="userTab"
        class="v-tabs-pill"
      >
        <VTab
          v-for="tab in tabs"
          :key="tab.icon"
        >
          <VIcon
            start
            :icon="tab.icon"
          />
          {{ tab.title }}
        </VTab>
      </VTabs>  
      <VWindow
        v-model="userTab"
        class="mt-6 disable-tab-transition"
        :touch="false"
      >
        <VWindowItem>
          <UserEdit />
        </VWindowItem>

        <VWindowItem>
          <MyList :id="connetId" />
        </VWindowItem>

        <VWindowItem>
          <!-- 인바티 데이터 차트 모아둔 거 -->
          <VCard>
            <VCardItem class="d-flex flex-wrap justify-space-between gap-4">
              <VCardTitle>Inbody 변화</VCardTitle>
              <VCardSubtitle>몸의 변화를 그래프로 보세요</VCardSubtitle>
            </VCardItem>

            <VCardText>
              <ApexChartAreaChart />
            </VCardText>
          </VCard>
          <VRow style="margin-top: 20px;">
            <!-- 인바티 데이터 차트 -->
            <VCol
              cols="12"
              md="6"
            >
              <VCard
                title="이번달 Inbody"
                class="hover-card"
              >
                <VCardText>
                  <ChartJsRadarChart />
                </VCardText>
              </VCard>
            </VCol>

            <!-- 영양분 데이터 차트 -->
            <VCol
              cols="12"
              md="6"
            >
              <VCard
                title="섭취 영양분"
                class="hover-card"
              >
                <VCardText>
                  <ChartJsPolarAreaChart :colors="chartJsCustomColors" />
                </VCardText>
              </VCard>
              <VCol>
                <VBtn @click="Rsave">
                  보고서
                </VBtn>
              </VCol>
            </VCol>
          </VRow>
        </VWindowItem>

        <VWindowItem>
          <UserHistory />
        </VWindowItem>

        <VWindowItem>
          <VCard style="margin-bottom: 50px;">
            <ApexChartStatistics style="margin: 50px 0;" />
          </VCard>
        </VWindowItem>

        <VWindowItem>
          <UserPaymentList />
        </VWindowItem>
      </VWindow>
    </VCol>
  </VRow>
</template>

<style lang="scss">
.hover-card {
  position: relative;
  transition: all 0.3s ease;
}

.hover-card:hover {
  z-index: 1;
  transform: scale(1.2); /* 크기를 1.1배로 확대합니다. */
}
</style>
