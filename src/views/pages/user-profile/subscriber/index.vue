<script setup>
import DeletSubConfirmModal from '@/pages/community/DeletSubConfirmModal.vue'
import { isSubscribesscreenchanged } from '@/router/index'
import axios from '@axios'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId=computed(() => userInfo.value.id)

console.log('구독자 쪽 connectId 체크', connetId.value, typeof connetId.value)

const router = useRoute()
const subscribeTo = ref([])
const subscribers = ref([])
const isSubToExist = ref(true)
const isMySubExist = ref(true)
const isDeleted = {}
const isSubscribed = {}

const fetchProjectData = () => {
  if (router.params.tab === 'subscriber') {
    axios.get('/comm/subscribe', { params: { id: connetId.value } }).then(response => {
      subscribeTo.value = response.data['subTo']
      subscribers.value = response.data['MySub']
      console.log(typeof subscribers.value)
      console.log(subscribeTo.value)
      if(Object.keys(subscribeTo.value).length==0) {
        isSubToExist.value = true
        console.log('값이 존재하지 않음')
      }
      else if (Object.keys(subscribeTo.value).length!=0){
        isSubToExist.value = false
        for(const key in subscribeTo.value) {
          isSubscribed[subscribeTo.value[key].subscribe_id] = ref(true)
        }
      }
      if(Object.keys(subscribers.value).length==0) {
        isMySubExist.value = true
        console.log('값이 존재하지 않음')
      }
      else if (Object.keys(subscribers.value).length!=0) {
        console.log(typeof subscribers.value)
        isMySubExist.value = false
        for(const key in subscribers.value){
          isDeleted[subscribers.value[key].id] = ref(false)
        }
      }
      console.log(isSubToExist)
    })
      .catch(()=>{console.log('서버가 꺼져있습니다')})
  }
}

window.addEventListener('click', ()=>{ //beforeunload
  if(isSubscribesscreenchanged.value) {
    console.log('url변경감지', isSubscribed)
    for(const userid in isSubscribed) {
      console.log('url변경감지 및 반복문')
      console.log(userid, isSubscribed[userid].value)

      if (!isSubscribed[userid].value){
        console.log('axios delete 안으로 들어옴', userid)
        axios.delete("/comm/subscribe/delete", {
          data: {
            userId: connetId.value,
            subToId: userid,
          },
        }, { headers: { "Content-Type": `application/json` } })
          .then(()=>{
            fetchProjectData()
          })
      }
    }

    isSubscribesscreenchanged.value = false
  }
})


//watch 함수를 사용하여 router 객체를 감시하고, 변경이 있을 때마다 fetchProjectData 함수를 실행합니다. 
//immediate: true 옵션을 사용하여 초기 로드 시에도 함수를 실행합니다.
watch(router, fetchProjectData, { immediate: true })

const username = ref('')
const mySubModalController = ref(false)

const deleteController = id => {
  username.value = id
  mySubModalController.value = true
}

const deleteMySub = id => { //api 요청
  console.log(id, '삭제됨')
  axios.delete("/comm/subscribe/deleteSubscriber", { data: {
    subId: id,
    userId: connetId.value,
  } })
    .then(()=>{
      fetchProjectData()
    })
}

const subscribe = temp => { //구독 api 요청 (url 감지)
  console.log(temp)
  isSubscribed[temp].value = !isSubscribed[temp].value
}
</script>

<template>
  <VCardText>
    <h5
      class="text-h5"
      style="font-weight: bold;"
    >
      구독한 목록
    </h5>
    <hr
      :style="{'margin-top':'30px', 'margin-bottom':'10px',
               'background-color' :'#DEDEDE', 'height':'1px', 'border':'0'
      }"
    >
  </VCardText>
  <VAlert
    v-show="isSubToExist"
    density="default"
    color="secondary"
    variant="tonal"
    :style="{'margin-bottom':'200px'}"
  >
    구독한 목록이 없습니다
  </VAlert>
  <VRow>
    <VCol
      v-for="data in subscribeTo"
      :key="data.subscribe_id"
      sm="6"
      lg="4"
      cols="12"
    >
      <VCard>
        <VCardItem>
          <VCardTitle class="d-flex flex-column align-center justify-center">
            <VAvatar
              size="100"
              :image="data.profilePath"
              class="mt-3"
            />

            <p class="mt-6 mb-0">
              {{ data.subscribe_id }}
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
            <!-- 구독 버튼 -->
            <VBtn
              v-show="!isSubscribed[data.subscribe_id].value"
              id="myButton"
              width="40"
              style="margin-left: 5px;"
              variant="elevated"
              @click="subscribe(data.subscribe_id)"
            >
              구독
            </VBtn>
            <VBtn
              v-show="isSubscribed[data.subscribe_id].value"
              id="myButton"
              style="margin-left: 5px;"
              variant="tonal"
              @click="subscribe(data.subscribe_id)"
            >
              <VIcon icon="mdi-bell" />
              구독중
            </VBtn>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
  
  <VCardText>
    <h5
      class="text-h5"
      style=" margin-top: 100px;font-weight: bold;"
    >
      구독받은 목록
    </h5>
    <hr
      :style="{'margin-top':'30px', 'margin-bottom':'10px',
               'background-color' :'#DEDEDE', 'height':'1px', 'border':'0'
      }"
    >
  </VCardText>
  <VAlert
    v-show="isMySubExist"
    density="default"
    color="secondary"
    variant="tonal"
    :style="{'margin-bottom':'200px'}"
  >
    구독받은 목록이 없습니다
  </VAlert>
  <VRow>
    <VCol
      v-for="data in subscribers"
      :key="data.id"
      sm="6"
      lg="4"
      cols="12"
    >
      <VCard>
        <VCardItem>
          <VCardTitle class="d-flex flex-column align-center justify-center">
            <VAvatar
              size="100"
              :image="data.profilePath"
              class="mt-3"
            />

            <p class="mt-6 mb-0">
              {{ data.id }}
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
            <VBtn
              prepend-icon="mdi-trash-can-outline"
              variant="outlined"
              @click="deleteController(data.id)"
            >
              삭제
            </VBtn>
            <DeletSubConfirmModal 
              v-model:isDialogVisible="mySubModalController"
              :message="username"
              @check-event="deleteMySub"
            />
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
