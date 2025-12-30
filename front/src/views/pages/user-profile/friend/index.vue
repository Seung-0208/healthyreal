<script setup>
import BlockFriendConfirmModal from '@/pages/community/BlockFriendConfirmModal.vue'
import InviteFriendConfirmModal from '@/pages/community/InviteFriendConfirmModal.vue'
import { isfriendscreenchanged } from '@/router/index'
import axios from '@axios'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = computed(() => userInfo.value.id)

const router = useRoute()
const connectionData = ref([])
const recommendData = ref([])
const isFriendExist = ref(true)
const isConnected = {}
const isInvited = {}
const isFriendBlocked = {}
const userId = ref(userInfo.value.id) //접속한 유저 아이디
const head = ref('친구목록')
const isSwitchOn = ref()
const requestModalControll = ref(false)

const controllInviteFunc = (ans, id) => { //DB에 접근
  console.log('이벤트 발생')
  console.log(ans, id)
  isInvited[id] = ref(false)
  axios.post("/comm/request", JSON.stringify({
    userId: connetId.value,
    reqId: id,
    type: '1',
  }), { headers: { 'Content-Type': 'application/json' } })
    .then(() => {
      //sendCommReqMessage(connetId.value, id, 'fReq')
    })
    .catch(err => {
      console.log(err, '값을 받는 데 실패했습니다')
    })
}


const switchController = value => {
  if (value) {
    head.value = '친구 추천 목록'
    if (recommendData.value.length === 0) {
      axios.get("/comm/randomfriend", {
        params: {
          id: userId.value,
        },
      })
        .then(resp => {
          recommendData.value = resp.data
          for (const i of resp.data) {
            isInvited[i.friend_id] = ref(true)
          }
        })
        .catch(err => console.error(err))
    }
  }
  else {
    head.value = '친구목록'
  }
}

const fetchProjectData = () => {
  if (router.params.tab === 'friend') { //조회용
    axios.get("/comm/friend", { params: { id: userId.value } }) //이미 친구인 목록
      .then(response => {
        connectionData.value = response.data
        if (Object.keys(connectionData.value).length == 0) isFriendExist.value = true
        else {
          isFriendExist.value = false
          for (const key in connectionData.value) {
            isConnected[connectionData.value[key]['friend_id']] = ref(true)
            isFriendBlocked[connectionData.value[key]['friend_id']] = ref(false)
          }
        }
      })
      .catch(() => { console.log('서버가 꺼져있습니다.') })

  }
}


const connectionController = temp => {
  temp.value = !temp.value
}

const modalControll = ref(false)
const username = ref('')

const blockingController = (temp, id) => {
  console.log('차단클릭됨')
  console.log(modalControll.value)
  modalControll.value = true
  temp.value = !temp.value
  username.value = id
}

const blockFriend = (bool, id) => {
  if (bool) {
    console.log(id, '차단됨')
  }
  axios.put("/comm/friend/block", JSON.stringify({ //차단용
    userId: userId.value,
    id: id,
  }), { headers: { "Content-Type": `application/json` } })
    .then(() => {
      fetchProjectData()
    })
}

//페이지 이동 감시 테스트----------------------------------

window.addEventListener('click', () => { //친구 끊기용
  if (isfriendscreenchanged.value) {
    console.log('url변경감지', isConnected)
    for (const userid in isConnected) {
      console.log('url변경감지 및 반복문')
      console.log(userid, isConnected[userid].value)
      if (!isConnected[userid].value) {
        console.log('axios delete 안으로 들어옴', userid)
        axios.delete("/comm/friend/delete", {
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

    isfriendscreenchanged.value = false
  }
})

//페이지 이동 감시 테스트 end----------------------------------
//watch 함수를 사용하여 router 객체를 감시하고, 변경이 있을 때마다 fetchProjectData 함수를 실행합니다. 
//immediate: true 옵션을 사용하여 초기 로드 시에도 함수를 실행합니다.
watch(router, fetchProjectData, { immediate: true })

const requestFriend = memberId => {
  requestModalControll.value = !requestModalControll.value
  username.value = memberId
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
  <VAlert v-show="isFriendExist && !isSwitchOn" density="default" color="secondary" variant="tonal"
    :style="{ 'margin-bottom': '200px' }">
    친구 목록이 없습니다
  </VAlert>
  <VRow>
    <VCol v-for="data in connectionData" v-show="!isSwitchOn" :key="data.friend_id" sm="6" lg="4" cols="12">
      <VCard>
        <VCardItem>
          <VCardTitle class="d-flex flex-column align-center justify-center">
            <VAvatar size="100" :image="data.profilePath" class="mt-3" />
            <!-- 이름 부분 -->
            <p class="mt-6 mb-0">
              {{ data.friend_id }}
            </p>
            <!-- 이름 부분 -->
            <!-- 직업 부분 -->
            <span class="text-body-1">{{ data.name }}</span>
            <!-- 직업 부분 -->
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
              :prepend-icon="isConnected[data.friend_id].value ? 'mdi-account-cancel-outline' : 'mdi-account-check-outline'"
              :variant="isConnected[data.friend_id].value ? 'tonal' : 'elevated'"
              @click="connectionController(isConnected[data.friend_id])">
              {{ isConnected[data.friend_id].value ? '친구취소' : '취소 되돌리기' }}
            </VBtn>

            <VBtn prepend-icon="mdi-block-helper" variant="outlined" color="warning"
              @click="blockingController(isFriendBlocked[data.friend_id], data.friend_id)">
              차단하기
            </VBtn>
            <BlockFriendConfirmModal v-model:isDialogVisible="modalControll" :message="username"
              @check-event="blockFriend" />
          </div>
        </VCardText>
      </VCard>
    </VCol>
    <VCol v-for="data in recommendData" v-show="isSwitchOn" :key="data.friend_id" sm="6" lg="4" cols="12">
      <VCard>
        <VCardItem>
          <VCardTitle class="d-flex flex-column align-center justify-center">
            <VAvatar size="100" :image="data.profilePath" class="mt-3" />
            <!-- 이름 부분 -->
            <p class="mt-6 mb-0">
              {{ data.friend_id }}
            </p>
            <span class="text-body-1">{{ data.name }}</span>
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
            <!-- 친구신청 버튼 -->
            <VBtn v-show="isInvited[data.friend_id].value" @click="requestFriend(data.friend_id)">
              친구요청
            </VBtn>
            <InviteFriendConfirmModal v-model:isDialogVisible="requestModalControll" :message="username"
              @check-confirm="controllInviteFunc" />
            <VBtn v-show="!isInvited[data.friend_id].value" prepend-icon="mdi-account-check-outline" disabled="true">
              신청완료
            </VBtn>
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
