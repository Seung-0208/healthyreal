<script setup>
const checkboxAll = ref(false)


</script>

<template>
  <VCheckbox v-model="checkboxAll">
    <template #label>
      <div>
        전체 동의.
      </div>
    </template>
  </VCheckbox>
</template>






