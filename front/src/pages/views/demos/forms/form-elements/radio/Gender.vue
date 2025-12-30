<script setup>
import { defineProps, ref } from 'vue'

const props = defineProps({
  value: {
    type: String,
    required: true,
  },
})


const selectedRadio = ref(props.value)

const colorsRadio = [
  { value: 'Info', gender: '남자' },
  { value: 'Warning', gender: '여자' },
]

// value 값이 변경될 때마다 해당하는 라디오 버튼을 선택하도록 설정
watch(() => {
  if (props.value === 'M') {
    selectedRadio.value = 'info'
  } else if (props.value === 'F') {
    selectedRadio.value = 'warning'
  }
})
</script>

<template>
  <VRadioGroup
    v-model="selectedRadio"
    inline
  >
    <div>
      <VRadio
        v-for="radio in colorsRadio"
        :key="radio.value"        
        v-model="selectedRadio"
        :label="radio.gender"
        :color="radio.value.toLocaleLowerCase()"
        :value="radio.value.toLocaleLowerCase()"
      />
    </div>
  </VRadioGroup>
</template>
