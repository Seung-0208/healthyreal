<script setup>
import { defineEmits, defineProps } from "vue"

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  }, 
})

const emit = defineEmits([
  'submit',
  'update:isDialogVisible',
])

const clickEvt = ()=>{
  emit('update:isDialogVisible', false)
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
          신고가 완료되었습니다.
        </VCardTitle>
        <VCardSubtitle>
          서비스의 안전하고 쾌적한 이용을 위해 신고해주셔서 감사합니다.
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
          확인
        </VBtn>
      </VCol>
    </VCard>
  </VDialog>
</template>
