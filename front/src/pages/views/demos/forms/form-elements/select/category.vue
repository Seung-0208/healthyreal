<script setup>
import { ref } from 'vue'

const emit = defineEmits(['update:selected'])

const items = [
  '식단',
  '운동',
  '심리',
]

const selected = ref([])

watch(() => selected.value, newValue => {
  emit('update:selected', newValue)
})
</script>

<template>
  <VSelect
    v-model="selected"
    :items="items"
    label="카테고리"
    chips
    multiple
  />
</template>
