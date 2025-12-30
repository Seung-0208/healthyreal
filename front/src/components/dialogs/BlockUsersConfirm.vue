<script setup>
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
  },
  selectedUsers: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:isDialogVisible', 'requestComplete'])


const submitController = () => {
  console.log("요청이 감.")
  console.log("요청받은 유저들 목록:", props.selectedUsers)
  emit('update:isDialogVisible')

  emit('requestComplete')
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
        @click="$emit('update:isDialogVisible', false)"
      />
      <VCardItem class="text-center">
        <VCardTitle
          class="text-h5 mb-3"
          style="margin-bottom: 15px;"
        >
          선택한 사용자 전부를<br>신고 처리 하시겠습니까?
        </VCardTitle>
        <VDivider />
        <VList
          density="compact"
          :items="selectedUsers"
        />
        <VDivider />
        <VCardSubtitle style="margin-top: 15px;">
          선택한 사용자 목록은 다음과 같습니다
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
          @click="$emit('update:isDialogVisible', false)"
        >
          NO
        </VBtn>
      </VCol>
    </VCard>
  </VDialog> 
</template>
