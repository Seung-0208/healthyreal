<script setup>
const passwordCK = ref()
</script>

<template>
  <VForm @submit.prevent="() => {}">
    <VTextField
      id="passwordCK"
      v-model="passwordCK"
      type="passwordCK"
      placeholder="비밀번호 확인"
      persistent-placeholder
    />
  </VForm>
</template>
