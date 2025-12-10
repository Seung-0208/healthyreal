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

const isConfirmDialogVisible = ref(false)

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
  <VDialog :width="$vuetify.display.smAndDown ? 'auto' : 650" :model-value="props.isDialogVisible"
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
        <div class="d-flex justify-space-between flex-wrap">
          <CustomRadios v-model="selectedPlan" :radio-content="plansList" :selected-radio="selectedPlan"
            :grid-column="{ cols: '12', sm: '12' }" />
          <VBtn class="mt-5" @click="$emit('update:isDialogVisible', false), getData(selectedPlan, connetId)">
            확인
          </VBtn>
          <VBtn color="error" variant="tonal" class="mt-3" @click="$emit('update:isDialogVisible', false)">
            취소
          </VBtn>
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>
