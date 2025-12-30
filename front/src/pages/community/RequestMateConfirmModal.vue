<script setup>
import { defineEmits, defineProps, watch } from 'vue'
import axios from '@axios'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
  },
  requestedId: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['closeModal', 'requestComplete'])

const isDialogVisible = ref(false)

watch(()=>props.isDialogVisible, ()=>{
  isDialogVisible.value = props.isDialogVisible
})

const submitController = () => {
  console.log("요청이 감.")
  emit('closeModal', false)
  emit('requestComplete', props.requestedId)
}
</script>

<template>
  <VDialog
    :model-value="isDialogVisible"
    width="600"
  >
    <VCard class="pa-5 pa-sm-8">
      <DialogCloseBtn
        variant="text"
        size="small"
        @click="$emit('closeModal', false)"
      />
      <VCardItem class="text-center">
        <VCardTitle class="text-h5 mb-3">
          {{ requestedId }}님께<br>메이트 신청을 보내시겠습니까?
        </VCardTitle>
        <VCardSubtitle>
          상대방이 메이트 요청을 수락하면, 운동 경로를 함께할 수 있습니다!
        </VCardSubtitle>
      </VCardItem>
      <VCol
        cols="12"
        class="d-flex flex-wrap justify-center gap-4"
      >
        <VBtn @click="submitController">
          YES
        </VBtn>
        <VBtn
          color="secondary"
          variant="tonal"
          @click="$emit('closeModal', false)"
        >
          NO
        </VBtn>
      </VCol>
    </VCard>
  </VDialog> 
</template>
