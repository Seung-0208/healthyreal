<script setup>
import axios from '@axios'
import { defineEmits, defineProps, watch } from 'vue'
import { useStore } from 'vuex'


const props = defineProps({
  isDialogVisible: {
    type: Boolean,
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  date: {
    type: String,
  },
})

const emit = defineEmits(['returnBool', 'returnSelectedMate'])
const store = useStore()
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = ref(userInfo.value.id)

const mateLists = []
const mateListsFinal = []

const isDialogVisible = ref(false)

const isMateSelected = ref(true)
const isMateExist = ref(true)

onMounted(() => {
  //메이트 리스트 불러오기

})

const router = useRouter()

const submit = val => {
  console.log("select에서 선택된 값 확인", value)
  emit('returnBool', false)
  if (val === 'withMate' && value.value.length !== 0) {
    emit('returnSelectedMate', value.value)
  }
  if (val === 'alone') {
    emit('returnSelectedMate')

    //router.push({ path: "/main" })
  }
}

watch(() => props.isDialogVisible, () => {
  isDialogVisible.value = props.isDialogVisible
})

//메이트가 선택되었는지의 여부를 컨트롤
const mateChanged = () => {
  console.log(value.value.length)
  if (value.value.length === 0) {
    isMateSelected.value = true
  }
  else {
    isMateSelected.value = false
  }
}

const trial = ref(0)

watch(() => [props.startTime, props.endTime, props.date], () => {
  if (/[0-9]{2}:[0-9]{2}/.test(props.startTime) && /[0-9]{2}:[0-9]{2}/.test(props.endTime) && /[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(props.date)) {
    if (trial.value != 1) {
      axios.get("/comm/mate/available", {
        params: {
          id: connetId.value,
          sch_date: props.date,
          start_t: `${props.startTime}:00`,
          end_t: `${props.endTime}:00`,
        }
      })
        .then(resp => {
          trial.value = 1
          if (resp.data.length == 0) {
            isMateExist.value = false
          }
          else {
            const tempId = []
            for (const mate of resp.data) {
              if (!tempId.includes(mate.mate_id) && mate.mate_id !== connetId.value) {
                mateLists.push({
                  name: mate.mate_id,
                  avatar: mate.profilePath,
                })
                console.log("조건문:", mate.mate_id)
                tempId.push(mate.mate_id)
              }
            }
            if (tempId.length == 0) {
              isMateExist.value = false
            }
          }
        })
        .catch(err => console.error("에러발생", err))
    }
  }
  isDialogVisible.value = props.isDialogVisible
})

const value = ref()
</script>


<template>
  <VDialog :model-value="isDialogVisible" persistent width="500" style="padding-top: 20px;">
    <VCard>
      <VCardText>
        🏃‍♀️ 산책을 같이 할 메이트를 선택하세요
      </VCardText>
      <VDivider />
      <VCardItem>
        <VAlert v-show="!isMateExist" type="warning" variant="tonal">
          메이트 중 일정이 맞는 메이트가 존재하지 않습니다
        </VAlert>
        <VSelect v-show="isMateExist" v-model="value" style="margin-top: 10px;" :items="mateLists" item-title="name"
          item-value="name" label="나의 메이트 목록" clearable clear-icon="mdi-close" @update:model-value="mateChanged">
          <template #selection="{ item }">
            <VChip>
              <VAvatar start :image="item.raw.avatar" />
              <span>{{ item.title }}</span>
            </VChip>
          </template>
        </VSelect>
      </VCardItem>
      <VBtn variant="text" color="info" size="small" width="100px" style="margin: 0 auto;" @click="submit('alone')">
        혼자 걸을래요
      </VBtn>
      <VBtn id="submitBtn" :disabled="isMateSelected" style="margin-top: 20px;" @click="submit('withMate')">
        등록
      </VBtn>
    </VCard>
  </VDialog>
</template>
