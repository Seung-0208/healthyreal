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

const selectedOption = ref("가입목적 및 활동방향")

const goal_No = ref([
  { state: '건강 관리', value: 1 },
  { state: '체중 감량', value: 2 },
  { state: '체중 증가', value: 3 },
  { state: '근육 강화', value: 4 },
  { state: '다이어트 식단', value: 5 },
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
