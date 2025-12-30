<script setup>
const isDialogVisible = defineModel()

console.log('자식 컴포넌트:', isDialogVisible)
</script>

<template>
  <!-- 로딩용 -->
  <VDialog
    v-model="isDialogVisible"
    persistent
    width="300"
  >
    <VCard
      color="primary"
      width="300"
    >
      <VCardText class="pt-3">
        <p class="mb-2">
          감정을 분석중입니다
        </p>
        <VProgressLinear
          indeterminate
          class="mb-0"
        />
      </VCardText>
    </VCard>
  </VDialog>
</template>
