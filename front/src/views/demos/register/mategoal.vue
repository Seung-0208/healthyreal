<template>
  <VSelect
    id="goal_No"
    v-model="selectedOption"
    :items="goal_No"
    item-title="state"
    item-value="goal_No"
    persistent-hint
    return-object
    single-line
    @change="handleSelect"
  />
</template>


<script setup>
import { defineEmits, ref } from 'vue'

const emit = defineEmits('update:modelValue', goal_No)

const selectedOption = ref("스포츠 설정")

const goal_No = ref([
  { state: '탁구', value: '탁구' },
  { state: '배구', value: '배구' },
  { state: '농구', value: '농구' },
  { state: '러닝', value: '러닝' },
  { state: '풋살', value: '풋살' },
])


function handleSelect(value) {
  //var gender = document.querySelector('[name=gender]')

  // gender.value = value ? 'M' : 'W'
  // console.log('handleSelectedRadios호출:', gender.value)
  emit('update:modelValue', value)  // gender의 값을 부모 컴포넌트로 넘김
  console.log(newGoalNo)
}

const handleGoalNoChanged = newGoalNo => {
  console.log(newGoalNo)
}
</script>



<style>
.Select {
  padding-block-end: 50px;
}
</style>
