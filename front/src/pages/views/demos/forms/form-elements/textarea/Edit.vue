<script setup>
const textareaValue = ref('')
const rules = [v => v.length <= 200 || '최대 200자까지']
</script>

<template>
  <VTextarea
    v-model="textareaValue"
    :rules="rules"
    no-resize
    rows="1"
  />
</template>
