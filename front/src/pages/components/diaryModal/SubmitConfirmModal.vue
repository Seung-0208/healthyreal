<script setup>
import DialogCloseBtn from '@/@core/components/DialogCloseBtn.vue'
import TextEmotionDetectionModal from '@/pages/components/diaryModal/TextEmotionDetectionModal.vue'
import { defineEmits } from 'vue'

//현재 모달창 컨트롤용
//const isEmotionDetectDialogVisible = ref(false)

const emit = defineEmits(['openModal']) ;const isDialogVisible = defineModel()//

const modalClickController = isSubmit =>{
  if(isSubmit) {
    //isEmotionDetectDialogVisible.value = true
    emit('openModal', true)
  }
  
  isDialogVisible.value = false
}
</script>

<template>
  <VDialog
    v-model="isDialogVisible"
    width="500"
  >
    <!-- Dialog Content -->
    <VCard title="등록하시겠습니까?">
      <DialogCloseBtn
        variant="text"
        size="small"
        @click="modalClickController(false)"
      />
      <VCardText>
        <VBtn 
          block
          type="submit"
          @click="modalClickController(true)"
        >
          등록
        </VBtn>
        
        <TextEmotionDetectionModal v-model="isEmotionDetectDialogVisible" />
      </VCardText>
    </VCard>
  </VDialog>
</template>
