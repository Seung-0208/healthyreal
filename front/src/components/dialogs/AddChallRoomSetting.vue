<script setup>
import AddressApi from '@/components/dialogs/RoomSetAddressApi.vue'
import Goal from '@/views/demos/register/goal.vue'
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


const goal = ref("")
const userset = ref(4) //정원 수
const achievementset = ref(50) //달성기준
const store = useStore()
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = userInfo.value.id

const selectedCheckbox = ref([])

const sliderValues = ref([
  0,
  100,
])

const selectedOption1 = ref('5,000원')
const openRoomYN = ref(true) // 방공개여부
const dateRange = ref('')
const content = ref('')
const title = ref('')
const id = connetId



const createRoom = async () => {
  console.log("userset---", userset)
  console.log("achievementset---", achievementset)
  console.log("selectedCheckbox---", selectedCheckbox)
  console.log("sliderValues---", sliderValues)
  console.log("selectedOption1---", selectedOption1)
  console.log("openRoomYN---", openRoomYN)
  console.log("dateRange---", dateRange)
  console.log("connetId-----", connetId)

  try {
    console.log("userAddress.address---", userAddress.address)

    const response = await axios.post('/croom/createRoom.do', {
      goal: goal.value,
      userset: userset.value,
      achievementset: achievementset.value,
      areaSet: userAddress.address,
      selectedCheckbox: selectedCheckbox.value,
      sliderValues: sliderValues.value,
      selectedOption1: selectedOption1.value,
      openRoomYN: openRoomYN.value,
      dateRange: dateRange.value,
      content: content.value,
      title: title.value,
      id: connetId,
    })



    if (response.status === 200) {
      console.log('방 생성이 완료되었습니다.')
      console.log('response.data----', response.data)
      router.push({ name: 'apps-user-challenge-id', params: { id: response.data } }) //넘겨줄 Vue 경로 입력하기
    } else {
      console.log('방 생성에 실패하였습니다.')
    }
  } catch (error) {
    console.error(error)
  }
}


//유효성 검사
const isValid = computed(() => {
  if (toggleSwitch.value === true && selectedCheckbox.value.length === 0) {
    return false
  }

  return userset.value > 0 && achievementset.value > 0 && userAddress.address !== '' && selectedOption1.value !== '' && dateRange.value !== '' && content.value !== '' && title.value !== ''
})

const usersetlabel = { //정원Silder 초기값, 끝값 라벨 
  2: '2',
  8: '8',
}

const achievementlabel = { //달성기준Silder 초기값, 끝값 라벨 
  0: '0',
  100: '100',
}

const handleGoalNoChanged = newGoalNo => {
  console.log('부모컴포넌트', goal_No) // 여기서 newGoalNo는 선택한 항목의 goal_No 값입니다.
  goal.value = newGoalNo
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

const pay = [
  '5,000원',
  '10,000원',
  '20,000원',
  '30,000원',
  '50,000원',
]

const router = useRouter()
</script>


<template>
  <VDialog :model-value="props.isDialogVisible" max-width="900" persistent @update:model-value="dialogVisibleUpdate">
    <VCard class="share-project-dialog pa-5 pa-sm-8">
      <!-- 👉 dialog close btn -->
      <DialogCloseBtn variant="text" size="small" @click="emit('update:isDialogVisible', false)" />

      <VCardText>
        <VSwitch v-model="openRoomYN" :label="areaSet = capitalizedLabel(openRoomYN) === 'True' ? '공개' : '비공개'" />
        <VCardText style=" border-radius: 20px;">
          <div class="text-h5 mb-1 text-center">
            <Goal @update:model-value="handleGoalNoChanged" />
          </div>
        </VCardText>
        <VRow class="fbox" style="padding-bottom: 0; margin-top: 20px;">
          <VCol class="fitem" cols="4" rows="4">
            정원 설정 : <strong>{{ userset }}</strong>

            <VSlider v-model="userset" :step="1" :min="2" :max="8" :ticks="usersetlabel" show-ticks="always"
              tick-size="4" />
          </VCol>
          <VCol class="fitem" cols="4" rows="4">
            달성기준 : <strong>{{ achievementset }} % </strong>
            <VSlider v-model="achievementset" :step="1" :min="0" :max="100" :ticks="achievementlabel"
              show-ticks="always" tick-size="4" />
          </VCol>
          <VCol class="fitem" cols="4" rows="5" style="text-align: center;">
            <AddressApi v-model="userAddress" :new-address="userAddress" @update-address="handleUpdateAddress" />
          </VCol>
        </VRow>
        <VCol>
          <div class="d-flex align-center flex-wrap justify-space-between mt-1 mb-4">
            <h4>참여자 제한 설정</h4>
            <VSwitch v-model="toggleSwitch" style="float: inline-end;"
              :label="areaSet = capitalizedLabel(toggleSwitch) === 'True' ? 'ON' : 'OFF'" />
          </div>
          <Transition name="fade">
            <VRow v-if="areaSet === 'ON'" class="fbox" style="border-radius: 10px;background-color: #e9e9e9;">
              <VCol class="fitem" cols="6" rows="4">
                <h4>성별</h4>
                <CustomCheckboxes v-model:selected-checkbox="selectedCheckbox" :checkbox-content="checkboxContent"
                  :grid-column="{ sm: '6', cols: '12' }" />
              </VCol>
              <VCol class="fitem" cols="6" rows="4">
                <h4>
                  연령 : {{ (sliderValues[0] == 0 && sliderValues[1] == 100) ? '전체 연령'
                    : sliderValues[0].toString() + '살~' + sliderValues[1].toString() + '살' }}
                </h4>
                <VCol style=" display: flex;width: 100%; justify-content: center;">
                  <VRangeSlider v-model="sliderValues" step="1" />
                </VCol>
              </VCol>
            </VRow>
          </Transition>
        </VCol>
        <VRow class="fbox" style="height: 100px;margin-top: 10px;">
          <VCol class="fitem" cols="2" rows="5" style="justify-content: center;padding-top: 30px;text-align: center;">
            참여비
          </VCol>
          <VCol cols="4">
            <VSelect v-model="selectedOption1" style="height: 20px;" :items="pay" label="Select" single-line
              variant="filled" />
          </VCol>
          <VCol class="fitem" cols="2" rows="5" style="justify-content: center;padding-top: 30px;text-align: center;">
            기간 설정
          </VCol>
          <VCol>
            <AppDateTimePicker v-model="dateRange" label="기간을 설정해주세요"
              :config="{ mode: 'range', closeOnSelect: true }" />
          </VCol>
        </VRow>

        <VCol cols="12">
          <VTextarea v-model="title" rows="1" label="제목" />
        </VCol>
        <VCol cols="12" rows="4">
          <VTextarea v-model="content" label="내용" />
          <VCol style="text-align: center;">
            <VBtn :disabled="!isValid" @click="createRoom">
              확인
            </VBtn>
          </VCol>
        </vcol>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.fade-enter,
.fade-enter-active {
  opacity: 0;
  transition: opacity 0.5s;
}

.fade-enter-to {
  opacity: 1;
}

.fade-leave-active,
.fade-leave {
  opacity: 1;
  transition: opacity 0.5s;
}

.fade-leave-to {
  opacity: 0;
}
</style>
