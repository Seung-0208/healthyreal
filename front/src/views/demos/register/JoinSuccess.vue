<script setup>
import { inject } from 'vue'



// 'user-registered' 이벤트를 감지하여 Snackbar를 보여줍니다.
const isSnackbarVisible = inject('isSnackbarVisible')
</script>

<template>
  <!-- Snackbar -->
  <VSnackbar
    v-model="isSnackbarVisible"
    :timeout="3000"
  >
    회원가입을 축하드립니다! 3초후 메인페이지로 이동합니다.
  </VSnackbar>
</template>
