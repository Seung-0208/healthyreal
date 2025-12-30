
<template>
  <VDialog
    v-model="isDialogTwoShow"
    class="v-dialog-sm text-center"
  >
    <VCard title="Dialog 2">
      <DialogCloseBtn
        variant="text"
        size="small"
        @click="isDialogTwoShow = false"
      />

      <VCardText>I'm a nested dialog.</VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn @click="isDialogTwoShow = false">
          Close
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup>
import { ref } from 'vue'

const isDialogTwoShow = ref(false)

const openDialog = () => {
  isDialogTwoShow.value = true
}
</script>

