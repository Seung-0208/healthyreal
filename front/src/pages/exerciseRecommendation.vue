<script setup>
import UpdateExercise from '@/components/dialogs/UpdateExercise.vue';
import axiosflask from '@/plugins/axiosflask';
import axios from '@axios';
import defaultImg from '@images/userProfile/default.png';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'; // vue-router에서 필요한 함수 가져오기
import { useStore } from 'vuex';


const isUpgradeExercisePlan = ref(false)
const isCheckedRecipe = ref(false)
const isCheckedRestaurant = ref(false)
const isCategory = ref(false)
const isyoutubecrawling = ref(false)

// const router = useRoute()
const router = useRouter() // useRouter() 함수를 사용하여 router 객체 가져오기
const connectionData = ref([])

const store = useStore()

// 로그인 스토어와 사용자 스토어의 상태를 가져옵니다.
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = userInfo.value.id

const users = ref([])
const usersView = ref([])

const state = reactive({
  items: [],
})

onMounted(async () => {
  getData()
})

const getData = async function () {
  try {
    const response = await axios.post('/bbs/List.do', {
      selectedItems: ["운동"],
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
      temp.unshift(connetId)
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


const fetchProjectData = () => {
  if (router.params.tab === 'connections') {
    axios.get('/pages/profile', { params: { tab: router.params.tab } }).then(response => {
      connectionData.value = response.data
    })
  }
}

const kinCrawlingResult = ref([])

const searchExercise = ref('')

const handleCrawlingComplete = result => {
  const { kinCrawling, searchKeyword } = result

  kinCrawlingResult.value = kinCrawling

  searchExercise.value = searchKeyword
  isyoutubecrawling.value = !isyoutubecrawling.value

  // kinCrawlingResult.value = result
}

watch(isyoutubecrawling, (newValue, oldValue) => {
  if (newValue) {
    randomyoutude()
  }
})

const getUserAvatar = userId => {
  const user = users.value.find(user => user.id === userId)

  return user ? user.profilePath : defaultImg
}

const youtubedata = ref({})
const video = ref('https://www.youtube.com/embed/kgvvdwQBSFQ')

const randomyoutude = async () => {
  await axiosflask.get('/youtudeCrawling', { params: { search: searchExercise.value } })
    .then(response => {
      youtubedata.value = response.data
      console.log('전달받은 유튜브 :', youtubedata.value)

      // "v=" 다음의 인덱스와 "&pp" 다음의 인덱스를 찾습니다.
      const startIndex = response.data.href.indexOf("v=") + 2
      const endIndex = response.data.href.indexOf("&pp")

      // "v=" 다음의 인덱스와 "&pp" 다음의 인덱스를 기반으로 문자열을 추출합니다.
      const extractedValue = response.data.href.substring(startIndex, endIndex)

      video.value = "https://www.youtube.com/embed/" + extractedValue

    })
}

const goToDetailPage = data => {
  // 클릭된 링크에 대한 처리
  // 예를 들어, "/detail" 라우트로 이동하고 링크에 대한 정보를 전달할 수 있습니다.
  console.log('들어왔나..?')

  const jsonData = JSON.stringify(data) // 데이터를 JSON 문자열로 변환

  router.push({ path: '/exerRecommendView', query: { data: jsonData } }) // JSON 문자열을 전달
}
</script>

<template>
  <section>
    <VRow class="fill-height">
      <VCol cols="7" class="dll">
        <!-- 전체 화면의 왼쪽 -->
        <VCard class="custom-scrollbar" style="height: 925px; overflow-y: auto;">
          <!-- 참가비 시작 -->
          <VCol>
            <!-- 👉 Search -->
            <AppSearchHeader v-model="faqSearchQuery" subtitle="찾고 싶은 단어를 작성해 주세요" :connet-id="connetId"
              custom-class="mb-7" @crawlingComplete="handleCrawlingComplete" />
            <VCard v-for="(data, index) in kinCrawlingResult" :key="index" cols="12" style="margin: 20px 10px;">
              <!-- 👉 Collapsible -->
              <AppCardActions action-collapsed :title="data.title" :hit="data.question_hit">
                <div style="margin: 0 30px;">
                  <small>
                    {{ data.question_content }}
                  </small>
                </div>
                <!-- VCard부분에 포인트 커서 해놨어요 click 이벤트로 이동시키면 됩니다 -->
                <VCard style="margin: 10px;" class="pointer-cursor">
                  <!-- 답변해주는 유저의 사진 VAvatar에 넣어주시고 color 삭제해주세요. -->
                  <VCol>
                    <VAvatar size="small" color="success" />
                    <span class="pointer-cursor" @click="goToDetailPage(data)">
                      더 자세하게 보고싶어요
                    </span>
                  </VCol>

                  <!-- props로 지식인 내용 먼저 좀 뿌려주시면 될 것 같습니다 -->
                  <VCol class="vcol-ellipsis" style="height: 75px; font-size: 14px;">
                    {{ data.answer_content }}
                  </VCol>
                  <VCol>
                    <div style="display: flex; justify-content: space-between;">
                      <span style="font-size: 12px; font-weight: bold;">{{ data.answer_date }}</span>
                      <strong style="color: #45d15a; font-size: 12px;">더보기</strong>
                    </div>
                  </VCol>
                </VCard>
              </AppCardActions>
            </VCard>
          </VCol>
        </VCard>
      </VCol>

      <!-- 지식인 끝 -->

      <VCol cols="5">
        <iframe width="560" height="315" :src="video" frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen />
        <!-- "https://www.youtube.com/embed/V1TzoKc99rE" -->
        <VCard flat :max-width="auto" class="mt-1 mt-sm- pa-0 custom-scrollbar"
          style="height: 600px; overflow-y: auto;">
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
                    <VCol cols="4">
                      <VCol cols="12">
                        <VCardSubtitle class="text-sm pointer-cursor" style="margin-left: -5%;">
                          {{ item.id }} <!-- 유저 닉네임 뿌려주기 -->
                        </VCardSubtitle>
                      </VCol>
                    </VCol>
                  </VRow>
                </VCol>
                <!-- 사진 부분 -->
                <VCol v-if="item.files && item.files.length == 1" class="transparent-carousel" show-arrows-on-hover>
                  <VCol v-for="(image, i) in item.files" :key="i" :class="{ 'active-slide': i === activeIndex }">
                    <VImg :src="image" class="pointer-cursor" />
                  </VCol>
                </VCol>
                <VCarousel v-if="item.files && item.files.length >= 2" class="transparent-carousel" show-arrows-on-hover
                  color="success" cycle interval="2000">
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
      </VCol>
    </VRow>
    <VBtn block style="margin-top: 10px;" @click="isUpgradeExercisePlan = true">
      운동 추천 받기
    </VBtn>
    <UpdateExercise v-model:isDialogVisible="isUpgradeExercisePlan" />
  </section>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";

.custom-scrollbar::-webkit-scrollbar {
  background-color: #f5f5f5;
  inline-size: 0;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #888;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

.vcol-ellipsis {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  text-overflow: ellipsis;
}
</style>

<style scoped>
.pointer-cursor {
  cursor: pointer;
}
</style>
