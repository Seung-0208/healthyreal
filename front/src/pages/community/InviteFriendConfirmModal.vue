<script setup>
import DialogCloseBtn from "@/@core/components/DialogCloseBtn.vue"
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
  emit('checkConfirm', true, props.message)
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
          {{ props.message }}님께<br>친구 요청을 보내시겠습니까?
        </VCardTitle>
        <VCardSubtitle>
          상대방이 친구 요청을 수락하면, 1:1 채팅이 가능해집니다!
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
