<script setup>
const b_day = ref('')
import AppDateTimePicker from '@/@core/components/app-form-elements/AppDateTimePicker.vue'
</script>

<template>
  <AppDateTimePicker
    v-model="b_day"
    label="Default"
  />
</template>
