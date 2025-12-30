<script setup>
import { defineEmits, defineProps } from "vue"

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  }, 
  message: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'submit',
  'update:isDialogVisible',
])


const clickEvt = ()=>{
  emit('update:isDialogVisible', false)
  emit('checkEvent', props.message)
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 600"
    :model-value="props.isDialogVisible"
    @update:model-value="val => $emit('update:isDialogVisible', val)"
  >
    <VCard class="pa-5 pa-sm-8">
      <!-- 👉 dialog close btn -->
      <DialogCloseBtn
        variant="text"
        size="small"
        @click="$emit('update:isDialogVisible', false)"
      />

      <!-- 👉 Title -->
      <VCardItem class="text-center">
        <VCardTitle class="text-h5 mb-3">
          {{ props.message }}님을 회원님의 구독자 목록에서 <br>삭제하시겠습니까?
        </VCardTitle>
        <VCardSubtitle>
          상대방은 자신이 삭제된 것을 모릅니다.
        </VCardSubtitle>
      </VCardItem>
      <VCol
        cols="12"
        class="d-flex flex-wrap justify-center gap-4"
      >
        <VBtn
          type="submit"
          @click="clickEvt"
        >
          YES
        </VBtn>
        <VBtn
          color="secondary"
          variant="tonal"
          @click="$emit('update:isDialogVisible', false)"
        >
          NO
        </VBtn>
      </VCol>
    </VCard>
  </VDialog>
</template>
