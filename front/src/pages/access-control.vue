<script setup lang="ts">
import UserList from '@/views/apps/roles/UserList.vue'
import ChartJsLineChart from '@/views/charts/chartjs/ChartJsLineChart.vue'
import axios from '@axios'
import controlHeader from '@images/pages/app-search-header-bg-light.png'
import defaultImg from '@images/userProfile/default.png'
import { onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import BlackLists from './BlackLists.vue'

const store = useStore()

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

const currentTab = ref(0)

const state = reactive({
  items: [],
})

onMounted(async () => {
  getData()
})

const users = ref([])

//삭제코드
const deleteItem = async bno => {
  try {
    const response = await axios.get(`/bbs/${bno}/Delete.do`)
    if (response.data === 1) {
      const bnoInt = parseInt(bno) // bno를 숫자로 변환

      state.items = state.items.filter(item => item.bno !== bnoInt) // items 배열에서 삭제된 항목 제거
    } else {
      console.log(response.data, "response.data")
      alert('삭제에 실패했습니다.')
    }
  } catch (error) {
    console.error(error)
  }
}

const getUserAvatar = userId => {
  const user = users.value.find(user => user.id === userId)

  return user ? user.profilePath : defaultImg
}

const getData = async function () {
  try {
    const response = await axios.post('/bbs/allList.do', {
      selectedItems: ["운동", "식단", "심리"],
    })

    // 응답 처리
    if (response.status === 200) {

      state.items = response.data // 데이터 저장
      console.log('데이터 받기 성공', state.items)

      const tempUserKeys = []
      for (var i = 0; i < state.items.length; i++) {
        tempUserKeys[i] = state.items[i].id
      }
      const tempUserKeysSet = new Set(tempUserKeys) //중복 아이디 제거
      const temp = [...tempUserKeysSet] //ids

      /*
      temp의 앞에 현재 서비스를 이용 중인 유저의 아이디가 들어가야 함.
      뿌려주는 게시글 작성자들의 목록을 불러옴.
      */
      console.log(temp)
      axios.post("/bbs/userProfile", JSON.stringify({
        ids: temp,
      }), {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })
        .then(resp => {
          console.log('요청받은 값:', resp.data)
          users.value = resp.data
          for (const i of users.value) {
            console.log('유저 아이디:', i.id, '\n유저 프로필:', i.profilePath)
            console.log('체크', i)
          }
        })
        .catch(err => console.log(err))
      console.log('데이터 체크', response.data)
    } else {
      console.log('데이터 전송 실패')
    }
  } catch (error) {
    console.error(`데이터 전송 실패: ${error}`)
  }
}


// -------------------------------------------------------------------------------
const logout = async () => {
  try {
    console.log("이게 실행 안되는거지?")
    localStorage.removeItem('User-Token')
    await store.dispatch('logout') // 'loginStore/logout' 액션 디스패치
    await store.dispatch('userlogout')
  } catch (error) {
    console.log('')
    console.error(error)
  }
}
</script>

<template>
  <VRow>
    <VCol cols="2" md="2" />

    <VCol cols="8" sm="12" md="8">
      <VImg cover :src="controlHeader"
        style=" height: 200px;padding-top: 230px; margin-top: 50px; margin-bottom: 20px;" />

      <VRow>
        <VCol cols="8" sm="4">
          <VTabs v-model="currentTab" direction="vertical" class="v-tabs-pill">
            <VTab>
              <VIcon start icon="mdi-account-cancel-outline" />
              블랙리스트
            </VTab>

            <VTab>
              <VIcon start icon="mdi-account-eye-outline" :size="22" />
              유저 관리
            </VTab>

            <VTab>
              <VIcon start icon="mdi-chart-arc" :size="22" />
              페이지 통계
            </VTab>
            <VTab>
              <VIcon start icon="mdi-instagram" :size="22" />
              게시글 관리
            </VTab>
          </VTabs>
        </VCol>

        <VCol cols="12" sm="8">
          <VWindow v-model="currentTab">
            <VWindowItem>
              <div class="d-flex align-center mb-6">
                <VAvatar rounded color="primary" variant="tonal" class="me-3" size="large">
                  <VIcon :size="30" icon="mdi-account-cancel-outline" />
                </VAvatar>

                <div>
                  <h6 class="text-h6">
                    신고 유저 관리
                  </h6>
                  <span class="text-sm">Report user management</span>
                </div>
              </div>
              <VCard>
                <BlackLists />
              </VCard>
            </VWindowItem>

            <VWindowItem>
              <div class="d-flex align-center mb-6">
                <VAvatar rounded color="primary" variant="tonal" class="me-3" size="large">
                  <VIcon :size="30" icon="mdi-account-eye-outline" />
                </VAvatar>

                <div>
                  <h6 class="text-h6">
                    유저 관리
                  </h6>
                  <span class="text-sm">User Management</span>
                </div>
              </div>
              <VCol cols="12">
                <UserList />
              </VCol>
            </VWindowItem>

            <VWindowItem>
              <div class="d-flex align-center mb-6">
                <VAvatar rounded color="primary" variant="tonal" class="me-3" size="large">
                  <VIcon :size="30" icon="mdi-account-eye-outline" />
                </VAvatar>

                <div>
                  <h6 class="text-h6">
                    페이지 통계
                  </h6>
                  <span class="text-sm">page statistics</span>
                </div>
              </div>
              <VCol cols="12">
                <VCard title="Statistics" subtitle="Commercial networks and enterprises">
                  <VCardText>
                    <ChartJsLineChart :colors="chartJsCustomColors" />
                  </VCardText>
                </VCard>
              </VCol>
            </VWindowItem>
            <VWindowItem>
              <div class="d-flex align-center mb-6">
                <VAvatar rounded color="primary" variant="tonal" class="me-3" size="large">
                  <VIcon :size="30" icon="mdi-account-eye-outline" />
                </VAvatar>

                <div>
                  <h6 class="text-h6">
                    게시글 관리
                  </h6>
                  <span class="text-sm">Post Management</span>
                </div>
              </div>
              <VCard flat :max-width="auto" class="mt-1 mt-sm- pa-0 custom-scrollbar"
                style="height: 750px; overflow-y: auto;">
                <!-- 게시물 작성 공간 -->
                <VCol v-if="state.items.length > 0">
                  <!-- 게시물이 있을 때의 템플릿 -->
                  <VCol v-for="(item, index) in state.items" :key="index" cols="12">
                    <VCard>
                      <VCol>
                        <VRow>
                          <VCol cols="1">
                            <VAvatar class="text-sm pointer-cursor" :image="getUserAvatar(item.id)" />
                          </VCol>
                          <VCol cols="9">
                            <VCardSubtitle class="text-sm pointer-cursor" style="margin-top: 10px;">
                              <strong>{{ item.id }}</strong> <!-- 유저 닉네임 뿌려주기 -->
                            </VCardSubtitle>
                          </VCol>
                          <VCol cols="1">
                            <VBtn variant="tonal" @click="deleteItem(item.bno)">
                              <VIcon icon="mdi-delete-outline" />
                            </VBtn>
                          </VCol>
                        </VRow>
                      </VCol>
                      <!-- 사진 부분 -->
                      <VCol v-if="item.files && item.files.length == 1" class="transparent-carousel"
                        show-arrows-on-hover>
                        <VCol v-for="(image, i) in item.files" :key="i" :class="{ 'active-slide': i === activeIndex }">
                          <VImg :src="image" class="pointer-cursor" />
                        </VCol>
                      </VCol>
                      <VCarousel v-if="item.files && item.files.length >= 2" class="transparent-carousel"
                        show-arrows-on-hover color="success">
                        <!--
                          cycle
                          interval="2000" 
                        -->
                        <VCarouselItem v-for="(image, i) in item.files" :key="i"
                          :class="{ 'active-slide': i === activeIndex }">
                          <VImg :src="image" class="pointer-cursor" open-view-post-moadl />
                        </VCarouselItem>
                      </VCarousel>
                      <VCardItem>
                        <VCardTitle class="pointer-cursor">
                          {{ item.content }}
                        </VCardTitle>
                      </VCardItem>
                    </VCard>
                  </VCol>
                </VCol>

                <VCol v-if="true" class="d-flex justify-center align-center" style="height: 300px;">
                  <!-- 게시물이 없을 때의 템플릿 -->
                  <VCol v-if="state.items.length <= 0" class="d-flex flex-column align-center justify-center"
                    style="height: 100%;">
                    <VCardTitle class="headline font-weight-bold">
                      등록된 게시물이 없습니다
                    </VCardTitle>
                    <VCardText>새로운 게시물을 작성해보세요!</VCardText>
                  </VCol>
                </VCol>
              </VCard>
            </VWindowItem>
          </VWindow>
        </VCol>
      </VRow>
      <VBtn @click="logout">
        <VIcon start icon="mdi-logout" :size="22" />
        로그아웃
      </VBtn>
    </VCol>
  </VRow>
</template>

<route lang="yaml">
  meta:
    layout: blank
    action: read
    subject: Auth
    redirectIfLoggedIn: true
  </route>
