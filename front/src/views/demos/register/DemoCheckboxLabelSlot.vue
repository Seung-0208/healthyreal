
<script setup>
const checkboxOne = ref(false)

</script>

<template>
  <VCheckbox v-model="checkboxOne">
    <template #label>
      <div>
        이용약관에 동의합니다.
      </div>
    </template>
  </VCheckbox>
</template>





