<script setup>
import { defineProps, ref } from 'vue'

const props = defineProps({
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
})

const email = ref(props.email)
const phoneNumber = ref(props.phoneNumber)

const radioContent = [
  {
    
    title: `${email.value}`,
    subtitle: '선택',
    desc: `이메일로 인증해주세요 ${email.value}`,
    value: 'email',
    
  },
  {
    title: `${phoneNumber.value}`,
    subtitle: '선택',
    desc: '이메일 인증이 불가능 하다면 휴대전화인증을 이용하세요!',
    value: 'phoneNumber',

  },
]

const selectedRadio = ref('basic')
</script>

<template>
  <CustomRadios
    v-model:selected-radio="selectedRadio"
    :radio-content="radioContent"
    :grid-column="{ sm: '12', cols: '12' }"
    :email="email"
    :phone-number="phoneNumber"
  />
</template>
