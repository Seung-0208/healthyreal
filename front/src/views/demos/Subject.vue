<script setup>
import { ref } from 'vue'

// modelValue prop 추가
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ state: '카테고리', value: '카테고리' }),
  },
})

const emit = defineEmits(['update:modelValue'])

const selectedOption = ref(props.modelValue)

const items = [
  {
    state: '운동',
    value: 2,
  },
  {
    state: '식단',
    value: 1,
  },
  {
    state: '심리',
    value: 4,
  },
]


const updateSelectedOption = newOption => {
  selectedOption.value = newOption
  emit('update:modelValue', newOption)
}
</script>

<template>
  <VSelect
    v-model="selectedOption"
    :items="items"
    item-title="state"
    item-value="value"
    persistent-hint
    return-object
    single-line
    @update:model-value="updateSelectedOption"
  />
</template>
