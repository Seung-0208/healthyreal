<script setup>
import axiosflask from '@/plugins/axiosflask'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:isDialogVisible'])
const store = useStore()
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = computed(() => userInfo.value.id)

const router = useRouter()
const selectedPlan = ref('random')
const selectedLevel = ref('Beginner')
const selectedPurpose = ref('Muscle')

const plansList = [
  {
    desc: '어깨 운동',
    title: '어깨 운동',
    value: 'Shoulders',
  },
  {
    desc: '가슴 운동',
    title: '가슴 운동',
    value: 'Chest',
  },
  {
    desc: '복부 운동',
    title: '복부 운동',
    value: 'Abdominals',
  },
  {
    desc: '허리 운동',
    title: '허리 운동',
    value: 'Back',
  },
  {
    desc: '팔 운동',
    title: '팔 운동',
    value: 'arms',
  },
  {
    desc: '다리 운동',
    title: '다리 운동',
    value: 'legs',
  },
  {
    desc: ' 무작위 운동',
    title: '무작위 운동',
    value: 'random',
  },
]

const level = [
  {
    desc: '초급',
    title: '초급',
    value: 'Beginner',
  },
  {
    desc: '중급',
    title: '중급',
    value: 'Meddle',
  },
  {
    desc: '고급',
    title: '고급',
    value: 'Advanced',
  }
]

const purpose = [
  {
    desc: '유산소',
    title: '유산소',
    value: 'Beginner',
  },
  {
    desc: '근력',
    title: '근력',
    value: 'Muscle',
  }
]

const isConfirmDialogVisible = ref(false)

const showConfirmDelayed = async () => {
  // prevent accidental immediate re-open
  await new Promise(resolve => setTimeout(resolve, 2000))
  isConfirmDialogVisible.value = true
}

const getData = async (obj, connetId) => {
  console.log(connetId, "가할 운동은???", obj)

  const response = await axiosflask.post('/recommend/recommendExercise', {
    message: obj,
    id: connetId,
  })

  router.push('main')
}
</script>

<template>
  <!-- 👉 upgrade plan -->
  <VDialog :width="$vuetify.display.smAndDown ? 'auto' : 900" :model-value="props.isDialogVisible"
    @update:model-value="val => $emit('update:isDialogVisible', val)">
    <VCard class="py-8">
      <!-- 👉 dialog close btn -->
      <DialogCloseBtn variant="text" size="small" @click="$emit('update:isDialogVisible', false)" />

      <VCardItem class="text-center">
        <VCardTitle class="text-h5 mb-5">
          운동 추천 받기
        </VCardTitle>

        <VCardSubtitle>
          원하는 운동을 고르세요.
        </VCardSubtitle>
      </VCardItem>

      <VCardText class="d-flex align-center flex-column flex-sm-nowrap px-15">
        <div class="d-flex justify-space-between flex-wrap update-radios">
          부위 선택
          <CustomRadios class="w-100" style="width:100%" v-model="selectedPlan" :radio-content="plansList" :selected-radio="selectedPlan"
            :grid-column="{ cols: '12', sm: '12' }" />
          난이도 선택
          <CustomRadios class="w-100" style="width:100%" v-model="selectedLevel" :radio-content="level" :selected-radio="selectedLevel"
            :grid-column="{ cols: '12', sm: '12' }" />
          목적 선택
          <CustomRadios class="w-100" style="width:100%" v-model="selectedPurpose" :radio-content="purpose" :selected-radio="selectedPurpose"
            :grid-column="{ cols: '12', sm: '12' }" />
        </div>
        
        <div class="d-flex justify-end gap-3 mt-5">
          <VBtn @click="showConfirmDelayed()">
            확인
          </VBtn>
          <VBtn color="error" variant="tonal" @click="$emit('update:isDialogVisible', false)">
            취소
          </VBtn>
        </div>
        <!-- Confirmation / Exercise list modal -->
        <VDialog v-model="isConfirmDialogVisible" width="420">
          <VCard>
            <VCardTitle class="text-h6">추천 운동 목록</VCardTitle>
            <VCardText>
              <ul style="padding-left:16px; margin:0 0 12px 0;">
                <li>Band seated row</li>
                <li>Single-arm dumbbell row</li>
                <li>Machine low row-</li>
              </ul>
            </VCardText>
            <VCardActions>
              <VSpacer />
              <VBtn text color="primary" @click="isConfirmDialogVisible = false">닫기</VBtn>
            </VCardActions>
          </VCard>
        </VDialog>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style scoped>
.update-radios {
  gap: 20px;
}
.update-radios > * {
  margin: 0; /* prevent extra margins adding on top of gap */
}
</style>
