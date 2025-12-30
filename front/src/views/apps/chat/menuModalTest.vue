<script setup>
import AppStepper from '@/@core/components/AppStepper.vue'

const emit = defineEmits(['close'])
const toggleSwitch = ref(true)
const currentStep = ref(0)

const capitalizedLabel = (label, boolean) => {
  const convertLabelText = label.toString()

  return convertLabelText.charAt(0).toUpperCase() + convertLabelText.slice(1)
}

const numberedSteps = [
  {
    title: 'Account Details',
    icon: 'mdi-file-document-outline',
  },
  {
    title: 'Personal Info',
    icon: 'mdi-account-outline',
  },
  {
    title: 'Social Links',
    icon: 'mdi-link',
  },
]
</script>

<template>
  <AppStepper
    v-model:current-step="currentStep"
    direction="vertical"
    :items="numberedSteps"
    icon-size="24"
    class="stepper-icon-step-bg"
    :style="{'background-color':'#FFFFF2','width':'20%'}"
  />
</template>
