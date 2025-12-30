<script setup>
import BlockMateConfirmFinal from '@/pages/community/BlockMateConfirmFinal.vue'
import BlockMateConfirmModal from '@/pages/community/BlockMateConfirmModal.vue'
import RequestMateConfirmModal from '@/pages/community/RequestMateConfirmModal.vue'
import axiosflask from '@/plugins/axiosflask'
import { isMatescreenchanged } from '@/router/index'
import axios from '@axios'
import { reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()

const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = computed(() => userInfo.value.id)

const router = useRoute()
const connectionData = ref([])
const isMateExist = ref(true)

const userId = ref(connetId) //접속한 유저 아이디

const rating = reactive({}) //호감도 뿌려주기 위한 변수
const predRating = ref({}) //예측된 호감도
const beforeRating = {}

const isSwitchOn = ref(false)
const isRequested = {}

const recommendData = ref([])
const head = ref('메이트 목록')

const switchController = value => {
  if (value) { //스위치가 켜져있으면
    head.value = '메이트 추천 목록'
    console.log("userID:", userId)
    if (recommendData.value.length === 0) {
      axiosflask.post("/recommendMate", JSON.stringify({
        ID: userId.value,
      }), {
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then(resp => {
          console.log("추천목록:", resp.data.recommendations)
          recommendData.value = resp.data.recommendations
          for (const pred of recommendData.value) {
            predRating.value[pred.mate_id] = pred.estimated_rating.toFixed(0)
            isRequested[pred.mate_id] = ref(false)
          }
        })
        .catch(err => console.error(err))
    }
  }
  else {
    head.value = '메이트 목록'
  }
}

const ratingColors = [
  'warning',
]

const isConnected = {}
const isWarning = {}

const fetchProjectData = () => { //유저 값 가져오기
  if (router.params.tab === 'mate') {
    axios.get('/comm/mate', {
      params: {
        id: userId.value,
      },
    })
      .then(response => {
        connectionData.value = response.data
        if (Object.keys(response.data).length == 0) isMateExist.value = true
        else {
          isMateExist.value = false

          //호감도 Vrating에 설정해줄 값
          connectionData.value.forEach(user => {
            rating[user.mate_id] = ref(user.favorable_rating)
            isConnected[user.mate_id] = ref(true)
            isWarning[user.mate_id] = ref(false)
          })
        }
      })
      .catch(() => { console.log('서버가 꺼져있습니다.') })
  }
}

console.log('mate의 isConnected:', isConnected)

const connectionController = (temp, id) => {
  temp.value = !temp.value
  console.log(id)
}

const modalControll = ref(false)
const username = ref('')

const blockingController = (temp, id) => {
  modalControll.value = true
  username.value = id
}

const isWarningComplete = ref(false)

//메이트 신고용
const blockMate = (warningReason, id) => {
  console.log(warningReason.value, id) //axios로 처리
  isWarningComplete.value = true
  axios.post("/comm/mate/reportwarning", JSON.stringify({
    userId: userId.value,
    id: id,
    warningReason: warningReason.value,
  }), { headers: { 'Content-Type': 'application/json' } })
    .then(() => {
      fetchProjectData()
    })
    .catch(err => console.log(err))
}

watch(router, fetchProjectData, { immediate: true })

watch(rating, () => { //호감도 관련 기능
  if (beforeRating != {}) {
    for (const key in rating) {
      if (beforeRating[key] != rating[key]) {
        axios.put('/comm/mate/changefavorable', JSON.stringify({
          mate_id: key,
          favorable_rating: rating[key],
        }), { headers: { "Content-Type": `application/json` } })
          .catch(error => { console.log(error) })
      }
    }
  }
  for (const key in rating) {
    beforeRating[key] = rating[key]
  }
}, { immediate: true })

window.addEventListener('click', () => { //beforeunload
  if (isMatescreenchanged.value) {
    console.log('메이트 url변경감지', isConnected)
    for (const userid in isConnected) {
      console.log('메이트 url변경감지 및 반복문')
      console.log(userid, isConnected[userid].value)

      if (!isConnected[userid].value) {
        console.log('axios delete 안으로 들어옴', userid)
        axios.delete("/comm/mate/delete", { //메이트 취소하기
          data: {
            userId: userId.value,
            id: userid,
          },
        }, { headers: { "Content-Type": `application/json` } })
          .then(() => {
            fetchProjectData()
          })
      }
    }

    isMatescreenchanged.value = false
  }
})

//메이트 요청 관련 코드
const isModalShow = ref(false)

const clickedId = ref('')

const requestController = val => {
  clickedId.value = val
  isModalShow.value = true
}

const changeValue = val => {
  isModalShow.value = val
}

const changeStateValue = val => {
  axios.post("/comm/request", JSON.stringify({
    userId: connetId.value,
    reqId: val,
    type: '2',
  }), { headers: { 'Content-Type': 'application/json' } })
    .then(() => {
      //sendCommReqMessage(connetId.value, val, 'mReq')
    })
    .catch(err => {
      console.log("에러발생:", err)
    })
  isRequested[val].value = true
}
</script>

<template>
  <VRow>
    <VCardText>
      <h5 class="text-h5" style="font-weight: bold;">
        {{ head }}
      </h5>
    </VCardText>
    <VSwitch v-model="isSwitchOn" style="margin-right: 20px;" color="success" label="추천보기"
      @update:model-value="switchController" />
  </VRow>
  <VAlert v-show="isMateExist && !isSwitchOn" density="default" color="secondary" variant="tonal"
    :style="{ 'margin-bottom': '200px' }">
    메이트 목록이 없습니다
  </VAlert>
  <VRow>
    <!-- 나의 메이트 보기 start -->
    <VCol v-for="data in connectionData" v-show="!isSwitchOn" :key="data.mate_id" sm="6" lg="4" cols="12">
      <VCard>
        <VCardItem>
          <VCardTitle class="d-flex flex-column align-center justify-center">
            <VAvatar size="100" :image="data.profilePath" class="mt-3" />
            <p class="mt-6 mb-0">
              {{ data.mate_id }}
            </p>
            <span class="text-body-1">{{ data.name }}</span>

            <div class="d-flex align-center flex-wrap gap-2 mt-6">
              <div class="d-flex flex-column">
                <VRating v-for="color in ratingColors" :key="color" v-model="rating[data.mate_id]" :color="color" />
              </div>
            </div>
          </VCardTitle>
        </VCardItem>

        <VCardText>
          <div class="d-flex justify-space-around mt-1">
            <div class="text-center">
              <h6 class="text-h6">
                {{ data.fnum }}
              </h6>
              <span class="text-body-1">친구</span>
            </div>
            <div class="text-center">
              <h6 class="text-h6">
                {{ data.mnum }}
              </h6>
              <span class="text-body-1">메이트</span>
            </div>
            <div class="text-center">
              <h6 class="text-h6">
                {{ data.snum }}
              </h6>
              <span class="text-body-1">구독자</span>
            </div>
          </div>

          <div class="d-flex justify-center gap-4 mt-6">
            <VBtn
              :prepend-icon="isConnected[data.mate_id].value ? 'mdi-account-cancel-outline' : 'mdi-account-check-outline'"
              :variant="isConnected[data.mate_id].value ? 'tonal' : 'elevated'"
              @click="connectionController(isConnected[data.mate_id], data.mate_id)">
              {{ isConnected[data.mate_id].value ? '메이트취소' : '취소 되돌리기' }}
            </VBtn>
            <VBtn prepend-icon="mdi-alert" variant="outlined" color="error"
              @click="blockingController(isWarning[data.mate_id], data.mate_id)">
              신고하기
            </VBtn>
            <BlockMateConfirmModal v-model:isDialogVisible="modalControll" :message="username"
              @check-confirm="blockMate" />
            <BlockMateConfirmFinal v-model:isDialogVisible="isWarningComplete" />
          </div>
        </VCardText>
      </VCard>
    </VCol>
    <!-- 추천 메이트 보기 start -->
    <VCol v-for="data in recommendData" v-show="isSwitchOn" :key="data.mate_id" sm="6" lg="4" cols="12">
      <VCard>
        <VCardItem>
          <VCardTitle class="d-flex flex-column align-center justify-center">
            <VAvatar size="100" :image="data.profilePath" class="mt-3" />
            <p class="mt-6 mb-0">
              {{ data.mate_id }}
            </p>
            <span class="text-body-1">{{ data.name }}</span>

            <div class="d-flex align-center flex-wrap gap-2 mt-6">
              <VChip color="warning">
                예측 별점
              </VChip>
              <div class="d-flex flex-column">
                <VRating v-for="color in ratingColors" :key="color" v-model="predRating[data.mate_id]" readonly
                  :color="color" />
              </div>
            </div>
          </VCardTitle>
        </VCardItem>

        <VCardText>
          <div class="d-flex justify-space-around mt-1">
            <div class="text-center">
              <h6 class="text-h6">
                {{ data.fnum }}
              </h6>
              <span class="text-body-1">친구</span>
            </div>
            <div class="text-center">
              <h6 class="text-h6">
                {{ data.mnum }}
              </h6>
              <span class="text-body-1">메이트</span>
            </div>
            <div class="text-center">
              <h6 class="text-h6">
                {{ data.snum }}
              </h6>
              <span class="text-body-1">구독자</span>
            </div>
          </div>
          <div class="d-flex justify-center gap-4 mt-6">
            <VBtn v-show="!isRequested[data.mate_id].value" prepend-icon="mdi-run" variant="elevated"
              @click="requestController(data.mate_id)">
              메이트 요청
            </VBtn>
            <VBtn v-show="isRequested[data.mate_id].value" disabled="true">
              메이트 요청 완료
            </VBtn>
            <RequestMateConfirmModal v-model:isDialogVisible="isModalShow" :requested-id="clickedId"
              @close-modal="changeValue" @request-complete="changeStateValue(clickedId)" />
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
.vertical-more {
  position: absolute;
  inset-block-start: 1rem;
  inset-inline-end: 0.5rem;
}
</style>
