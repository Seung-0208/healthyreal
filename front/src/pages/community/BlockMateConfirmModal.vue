<script setup>
import { defineEmits, defineProps, onUpdated } from "vue"

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


const warningReason = ref('')

onUpdated(()=>{
  const inputTags = document.querySelectorAll('[name = warningReport]')

  // inputTags.forEach(ele => {ele.checked = !ele.checked})
})


const reportController = e => { //axios로 처리
  console.log(e.target)
  warningReason.value = e.target.value
}

const clickEvt = ()=>{
  emit('update:isDialogVisible', false)
  emit('checkConfirm', warningReason, props.message)
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 450"
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
          {{ props.message }}님을<br>위험 메이트로 신고합니다
        </VCardTitle>
        <VCardText>⚠️ 신고 이유를 선택해주세요</VCardText>
        <VDivider />
        <VRadioGroup
          id="warningReport"
          :style="{'padding-left':'15px', 'display':'flex', 'justify-content':'center'}"
          color="error"
          scrollable
          @change="reportController"
        >
          <VRadio
            label="명의 도용"
            value="illegalName"
          />
          <VRadio
            label="폭력적 위협"
            value="violence"
          />
          <VRadio
            label="스팸 및 사기"
            value="spam"
          />
          <VRadio
            label="사생활 침해 및 스토킹"
            value="privacy"
          />
        </VRadioGroup>
        <VDivider />
      </VCardItem>
      <VCol
        cols="12"
        class="d-flex flex-wrap justify-center gap-4"
      >
        <VBtn
          variant="text"
          color="error"
          type="submit"
          @click="clickEvt"
        >
          YES
        </VBtn>
        <VBtn
          color="secondary"
          variant="text"
          @click="$emit('update:isDialogVisible', false)"
        >
          NO
        </VBtn>
      </VCol>
    </VCard>
  </VDialog>
</template>
