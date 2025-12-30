<script setup>
import AddressApi from '@/components/dialogs/RoomSetAddressApi.vue'
import Mategoal from '@/views/demos/register/mategoal.vue'
import axios from '@axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  userAddress: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:isDialogVisible'])

const dialogVisibleUpdate = val => {
  emit('update:isDialogVisible', val)
}

const userAddress = reactive({
  address: '',
})

const handleUpdateAddress = newAddress => {
  userAddress.address = newAddress.address
}

const store = useStore()
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = userInfo.value.id
const router = useRouter()



const sport = ref("")
const date = ref('')
const openRoomYN = ref(true) // 방공개여부
const matchingYN = ref(true) // 매칭희망여부
const userset = ref(4) //정원 수
const selectedCheckbox = ref([])
const content = ref('')
const title = ref('')

const sliderValues = ref([
  0,
  100,
])



const createRoom = async () => {
  console.log("userset---", userset) //정원
  console.log("selectedCheckbox---", selectedCheckbox) //남여
  console.log("sliderValues---", sliderValues) //나이
  console.log("sport---", sport) //종목
  console.log("openRoomYN---", openRoomYN) // 방공개
  console.log("matchingYN---", matchingYN) //매칭여부
  console.log("date---", date) //시작날짜
  console.log("connetId-----", connetId)

  try {
    console.log("userAddress.address---", userAddress.address)

    const response = await axios.post('/mroom/createRoom.do', {
      sport: sport.value,
      userset: userset.value,
      areaSet: userAddress.address,
      selectedCheckbox: selectedCheckbox.value,
      sliderValues: sliderValues.value,
      openRoomYN: openRoomYN.value,
      matchingYN: matchingYN.value,
      date: date.value,
      content: content.value,
      title: title.value,
      id: connetId,
    })



    if (response.status === 200) {
      console.log('방 생성이 완료되었습니다.')
      console.log('response.data----', response.data)
      router.push({ name: 'apps-user-mate-room', params: { room: response.data } }) //넘겨줄 Vue 경로 입력하기 //넘겨줄 Vue 경로 입력하기
    } else {
      console.log('방 생성에 실패하였습니다.')
    }
  } catch (error) {
    console.error(error)
  }
}

const handleGoalNoChanged = newGoalNo => {
  console.log('부모컴포넌트', goal_No) // 여기서 newGoalNo는 선택한 항목의 goal_No 값입니다.
  sport.value = newGoalNo
}

//유효성 검사
const isValid = computed(() => {
  if (toggleSwitch.value === true && selectedCheckbox.value.length === 0) {
    return false
  }

  return title.value !== '' && content.value !== '' && date.value !== '' && sport.value !== '' && userAddress.address !== ''
})

const usersetlabel = { //정원Silder 초기값, 끝값 라벨 
  2: '2',
  8: '8',
}

const toggleSwitch = ref(true) // 참여자 제한 유무 



const capitalizedLabel = label => {
  const convertLabelText = label.toString()

  return convertLabelText.charAt(0).toUpperCase() + convertLabelText.slice(1)
}

const checkboxContent = [
  {
    title: '남자',
    value: 1,
  },
  {
    title: '여자',
    value: 2,
  },
]
</script>


<template>
  <VDialog :model-value="props.isDialogVisible" max-width="900" persistent @update:model-value="dialogVisibleUpdate">
    <VCard class="share-project-dialog pa-5 pa-sm-8">
      <!-- 👉 dialog close btn -->
      <DialogCloseBtn variant="text" size="small" @click="emit('update:isDialogVisible', false)" />

      <VCardText>
        <VRow>
          <VCol cols="4">
            <strong>운동 종류 선택</strong>
            <Mategoal style="margin-top: 10px;" @update:model-value="handleGoalNoChanged" />
          </VCol>
          <VCol class="fitem" cols="4" rows="5">
            <strong>날짜 및 시간</strong>
            <AppDateTimePicker v-model="date" :config="{ enableTime: true, dateFormat: 'Y-m-d H:i' }"
              style="margin-top: 10px;" />
          </VCol>
          <VCol class="fitem" cols="2" rows="2" style="justify-content: center;text-align: center;">
            매칭
            <VSwitch v-model="matchingYN" :label="capitalizedLabel(matchingYN) === 'True' ? 'ON' : 'OFF'"
              style="margin-left: 18px;" />
          </VCol>
          <VCol class="fitem" cols="2" rows="2" style="justify-content: center;text-align: center;">
            방 공개
            <VSwitch v-model="openRoomYN" :label="capitalizedLabel(openRoomYN) === 'True' ? 'ON' : 'OFF'"
              style="margin-left: 18px;" />
          </VCol>
        </VRow>
        <VCol class="fbox" style="padding-bottom: 0;">
          <VCol class="fitem" cols="8" rows="5">
            <h4>
              정원 설정 : {{ userset }}
            </h4>
            <VSlider v-model="userset" :step="1" :min="2" :max="8" :ticks="usersetlabel" show-ticks="always"
              tick-size="4" />
          </VCol>

          <!--
            <VCol>
            {{type}}
            </VCol> 
          -->
          <VCol class="fitem" cols="4" rows="5" style="text-align: center;">
            <AddressApi v-model="userAddress" :new-address="userAddress" @update-address="handleUpdateAddress" />
          </VCol>
        </VCol>
        <VCol>
          <div class="d-flex align-center flex-wrap justify-space-between mt-1 mb-4">
            <h4>참여자 제한 설정</h4>
            <VSwitch v-model="toggleSwitch" style="float: inline-end;"
              :label="userlimit = capitalizedLabel(toggleSwitch) === 'True' ? 'ON' : 'OFF'" />
          </div>
          <VCol v-if="userlimit === 'ON'" class="fbox" style="border-radius: 10px;background-color: #f7f6f6;">
            <VCol class="fitem" cols="6" rows="4">
              <h4>성별</h4>
              <CustomCheckboxes v-model:selected-checkbox="selectedCheckbox" :checkbox-content="checkboxContent"
                :grid-column="{ sm: '6', cols: '12' }" />
            </VCol>
            <VCol class="fitem" cols="6" rows="4">
              <h4>
                연령 : {{ (sliderValues[0] == 0 && sliderValues[1] == 100) ? '전체 연령' : sliderValues[0].toString() + '살 ~'
                  + sliderValues[1].toString() + '살' }}
              </h4>
              <VCol style=" display: flex;width: 100%; justify-content: center;">
                <VRangeSlider v-model="sliderValues" step="1" />
              </VCol>
            </VCol>
          </VCol>
        </VCol>
        <VCol cols="12">
          <VTextarea v-model="title" rows="1" label="제목" />
        </VCol>
        <VCol cols="12" rows="4">
          <VTextarea v-model="content" label="내용" />
        </VCol>
        <VCol style="text-align: center;">
          <VBtn :disabled="!isValid" style="margin-bottom: 10%;" @click="createRoom">
            등록
          </VBtn>
        </VCol>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style>
.fbox {
  display: flex;

  /* border:2px solid red; */
}

.fitem {
  /* border:1px solid green; */
}
</style>
