<script setup>
const textareaValue = ref('')
const rules = [v => v.length <= 2000 || '2000이하로 작성하세요']
</script>

<template>
  <VTextarea
    v-model="textareaValue"
    :rules="rules"
    rows="18"
    placeholder="글을 입력하세요"
    no-resize
  />
</template>
