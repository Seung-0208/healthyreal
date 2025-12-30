<script setup>
import AddMateRoomSetting from '@/components/dialogs/AddMateRoomSetting.vue'
import axios from '@axios'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const projectData = ref([])
const isAddMateRoomSettingDialogVisible = ref(false)
const store = useStore()
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = userInfo.value.id
const isSnackbarCenteredVisible = ref(false)

const fetchProjectData = () => {
  axios.get('/pages/profile', { params: { tab: 'projects' } }).then(response => {
    projectData.value = response.data
  })
}

watch(router, fetchProjectData, { immediate: true })

const challenges = ref([])

const myData = ref([])

const my = async () => {
  console.log("connetId---", connetId)

  myData.value = await axios.get('/mroom/myData.do', { params: { id: connetId } })

  if (myData.value.status === 200) {  // 수정된 부분
    console.log('내 데이타는---', myData.value.data)
  } else {
    console.log('내 데이타 가져오기 실패')
  }

}


const getData = async () => {
  try {
    const response = await axios.get('/mroom/listChall.do')

    challenges.value = response.data

    console.log("방 전체 정보는???---", challenges.value)

  } catch (error) {
    console.error(error)
  }
}


onMounted(async () => { await getData(), await my() })

const getHourDifference = (date1, date2) => {
  const diff = Math.abs(new Date(date1) - new Date(date2))

  return diff / (1000 * 60 * 60)
}


const formatDate = dateString => {
  const date = new Date(dateString) // 날짜 문자열을 Date 객체로 변환

  date.setDate(date.getDate()) // 1일을 추가

  const year = date.getFullYear().toString().substring(2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // 월은 0부터 시작하므로 1을 더하고, 2자리로 맞춤
  const day = date.getDate().toString().padStart(2, '0') // 날짜를 2자리로 맞춤

  return `${year}/${month}/${day}`
}

defineExpose({ formatDate })

const calculateAge = birthdayString => {
  const birthday = new Date(birthdayString)
  const today = new Date()

  let age = today.getFullYear() - birthday.getFullYear()
  const monthDifference = today.getMonth() - birthday.getMonth()

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthday.getDate())) {
    age-- // 생일이 아직 안 지났으면, 나이에서 1을 빼줍니다.
  }

  return age
}

const getGenderCode = gender => {
  if (gender === 'M') {
    return 1
  } else if (gender === 'W') {
    return 2
  } else {
    return 0 // gender 값이 'M' 또는 'W'가 아닌 경우 0을 반환
  }
}


//참여 유효성 검사
const checkEntrance = async challenge => {
  console.log("myData.value---", myData.value)
  console.log("calculateAge(myData.value.B_DAY)---", calculateAge(myData.value.data.B_DAY))
  console.log("challenge.value.ageMin---", challenge.ageMin)
  console.log("challenge.value.ageMax---", challenge.ageMax)
  console.log("getGenderCode(myData.value.GENDER)---", getGenderCode(myData.value.data.GENDER))
  console.log("myData.value.data.GENDER---", myData.value.data.GENDER)
  console.log("challenge.value.glimit---", challenge.glimit)
  console.log("connetId---", connetId)
  console.log("challNo---", challenge.mateNo)

  if (myData.value && calculateAge(myData.value.data.B_DAY) >= challenge.ageMin && calculateAge(myData.value.data.B_DAY) <= challenge.ageMax && (getGenderCode(myData.value.data.GENDER) === challenge.glimit || challenge.glimit === 0)) {

    const response = await axios.post('/mroom/joinRoom.do', { id: connetId, challNo: challenge.mateNo })

    router.push({ name: 'apps-user-mate-room', params: { room: challenge.mateNo } }) //넘겨줄 Vue 경로 입력하기

  } else {
    isSnackbarCenteredVisible.value = true
  }
}
</script>

<template>
  <section>
    <VCol>
      <VRow v-if="challenges.length > 0">
        <VCol v-for="challenge in challenges" :key="challenge.mateNo" cols="12" sm="6" lg="4">
          <VCard>
            <VCardItem>
              <template #prepend>
                <!--
                  <VAvatar
                  :image="data.avatar"
                  size="38"
                  />
                -->
              </template>

              <VCardTitle><span style="font-size: xx-large; font-weight: bold;">{{ challenge.mateTitle }}</span>
              </VCardTitle>
              <div class="d-flex align-center flex-wrap justify-space-between mt-1 mb-0">
                <span style="margin-top: 20px;color: rgb(112, 196, 230); font-weight: b;">
                  <VIcon start size="30" icon="mdi-face-man-shimmer-outline" color="info" />
                  {{ challenge.manager }}
                </span>
                <span class="font-weight-medium me-1" style="margin-top: 20px;">정원: <span
                    style="color: rgb(127, 153, 238); font-weight: bold;">{{ challenge.mateCapacity }}</span>명</span>
              </div>
              <div class="d-flex align-center flex-wrap  mt-1 mb-0">
                <VIcon start size="18" icon="mdi-check-decagram" style="margin-top: 20px;" color="info" />
                <span style="margin-top: 20px;color: black;">
                  {{ challenge.mateSport }}
                </span>
              </div>
              <div class="d-flex align-center flex-wrap mt-1 mb-0">
                <VIcon start size="18" icon="mdi-map-marker" color="info" />
                <span style="color: black;">
                  {{ challenge.mateArea }}
                </span>
              </div>
            </VCardItem>

            <VCardText>
              <div>
                <div style=" margin-bottom: 4px;text-align: center;">
                  <span style="font-weight: bold;">{{ formatDate(challenge.mateDate) }} </span>
                </div>
                <VChip color="info" density="compact">
                  <VIcon start size="18" icon="mdi-calendar" />
                  <span class="text-xs">
                    D-day : -{{ Math.floor((getHourDifference(new Date(challenge.mateDate), new Date()) + 9) / 24) }}일
                  </span>
                </VChip>
              </div>


              <p class="mt-4 mb-0 clamp-text" style="font-weight: bold;">
                {{ challenge.mateContent }}
              </p>
            </VCardText>

            <VDivider />

            <VCardText>
              <div class="d-flex align-center justify-end flex-wrap gap-2">
                <VChip color="success" density="compact">
                  <VIcon start size="18" icon="mdi-location-enter" />
                  <span class="text-xs">
                    {{ challenge.ageMin }} ~ {{ challenge.ageMax }}세 /

                    <span v-if="challenge.glimit === 0">모두 입장가능</span>
                    <span v-else-if="challenge.glimit === 1">남자만 입장가능</span>
                    <span v-else-if="challenge.glimit === 2">여자만 입장가능</span>
                  </span>
                </VChip>
              </div>
              <div class="d-flex align-center justify-space-between flex-wrap gap-2 mt-3">
                <div class="d-flex align-center">
                  <div class="v-avatar-group me-2">
                    <VAvatar v-for="participant in challenge.participantsData" :key="participant.ID"
                      :image="participant.PRO_FILEPATH" :size="36" />
                  </div>
                  <span class="text-xs">
                    {{ challenge.participantsData.length }}
                  </span>
                </div>
                <span>
                  <VBtn v-if="challenge.participantsData.length <= challenge.mateCapacity"
                    @click="checkEntrance(challenge)">
                    입장
                    <VSnackbar v-model="isSnackbarCenteredVisible" location="center">
                      입장할 수 없습니다.
                    </VSnackbar>
                  </VBtn>
                  <strong v-else>참여불가</strong>
                </span>
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
      <VRow v-else class="d-flex flex-column align-center justify-center" style="height: 100%;">
        <VCard class="d-flex align-center justify-center"
          style="position: relative; width: 400px; height: 400px; margin-bottom: 20px; font-weight: bold;">
          방을 새로 만들어보세요!
        </VCard>
      </VRow>
    </VCol>
    <VRow style="margin-top: 50px;">
      <VCol cols="4" />
      <VCol cols="4" class="d-flex flex-column align-center justify-center">
        <VBtn :style="{ 'margin-left': '10px' }"
          @click="isAddMateRoomSettingDialogVisible = !isAddMateRoomSettingDialogVisible">
          Mate
        </VBtn>
        <AddMateRoomSetting v-model:isDialogVisible="isAddMateRoomSettingDialogVisible" />
      </VCol>
    </VRow>
  </section>
</template>
