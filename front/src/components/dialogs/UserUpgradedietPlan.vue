<script setup>
const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:isDialogVisible'])

const selectedPlan = ref('standard')

const plansList = [
  {
    desc: '식단 1',
    title: '식단 1',
    value: 'standard',
  },
  {
    desc: '식단 2',
    title: '식단 2',
    value: 'basic',
  },
  {
    desc: '식단 3',
    title: '식단 3',
    value: 'enterprice',
  },
  {
    desc: '식단 4',
    title: '식단 4',
    value: 'company',
  },
]

const isConfirmDialogVisible = ref(false)
</script>

<template>
  <!-- 👉 upgrade plan -->
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 650"
    :model-value="props.isDialogVisible"
    @update:model-value="val => $emit('update:isDialogVisible', val)"
  >
    <VCard class="py-8">
      <!-- 👉 dialog close btn -->
      <DialogCloseBtn
        variant="text"
        size="small"
        @click="$emit('update:isDialogVisible', false)"
      />

      <VCardItem class="text-center">
        <VCardTitle class="text-h5 mb-5">
          식단 재추천
        </VCardTitle>

        <VCardSubtitle>
          원하는 식단 고르세요.
        </VCardSubtitle>
      </VCardItem>

      <VCardText class="d-flex align-center flex-column flex-sm-nowrap px-15">
        <div class="d-flex justify-space-between flex-wrap">
          <CustomRadios
            :radio-content="plansList"
            :selected-radio="selectedPlan"
            :grid-column="{ cols: '12', sm: '12' }"
          />
          <VBtn
            class="mt-5"
            @click="$emit('update:isDialogVisible', false)"
          >
            확인
          </VBtn>
          <VBtn
            color="error"
            variant="tonal"
            class="mt-3"
            @click="isConfirmDialogVisible = true"
          >
            취소
          </VBtn>
        </div>
      </VCardText>

      <!-- 👉 Confirm Dialog -->
      <ConfirmDialog
        v-model:isDialogVisible="isConfirmDialogVisible"
        cancel-title="Not Cancelled"
        confirm-title="Cancelled"
        confirm-msg="식단 추천을 취소하셨습니다!"
        confirmation-question="식단 추천을 취소하시겠습니까?"
        cancel-msg="취소되지 않았습니다!!"
      />
    </VCard>
  </VDialog>
</template>
