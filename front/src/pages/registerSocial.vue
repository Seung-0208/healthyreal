<script setup>
import TermsAndConditions from '@/views/demos/register/TermsAndConditions.vue'
import axios from '@axios'
import { useStore } from 'vuex'

const store = useStore()

onMounted(async () => {
  // 서버에서 토큰을 가져와 로컬 스토리지에 저장
  const response = await axios.post('/user/getToken', {}, { withCredentials: true })
  const token = response.data

  localStorage.setItem('access_token', token)

  // 토큰을 이용해 사용자 정보를 가져옴
  await store.dispatch('getMemberInfo')

  // 로그인 토큰 가져오기
  const currentToken = localStorage.getItem('access_token')

  // 사용자 정보 가져오기
  const userInfo = store.state.userStore.userInfo

  // 유저스토어의 상태값 가져오기
  const userStoreState = store.state.userStore

  console.log(currentToken, userInfo, userStoreState)
})



const iconsSteps = [
  {
    title: '약관동의',
    icon: 'custom-wizard-account',
  },
  {
    title: '회원가입 정보',
    icon: 'custom-wizard-personal',
  },


]

const currentStep = ref(0)
const isPasswordVisible = ref(false)
const isCPasswordVisible = ref(false)

const formData = ref({
  username: 'johndoe',
  email: 'john.doe@email.com',
  password: 'johndoe@J2',
  c_password: 'johndoe@J2',
  firstName: 'John',
  lastName: 'Doe',
  country: 'UK',
  language: 'English',
  address: '98 Borough bridge Road, Birmingham',
  landmark: 'Borough bridge',
  pincode: '658921',
  city: 'Birmingham',
  twitter: 'https://twitter.com/abc',
  facebook: 'https://facebook.com/abc',
  googlePlus: 'https://plus.google.com/abc',
  linkedIn: 'https://linkedin.com/abc',
})

const onSubmit = () => {
  console.log(formData.value)
}
</script>

<template>
  <VCard style="width: 70%; margin-left: 15%;">
    <VCardText>
      <!-- 👉 Stepper -->
      <AppStepper v-model:current-step="currentStep" :items="iconsSteps" />
    </VCardText>

    <VDivider />

    <VCardText cols="6">
      <!-- 👉 stepper content -->
      <VForm>
        <VWindow v-model="currentStep" class="disable-tab-transition">
          <VWindowItem>
            <VRow>
              <VCol cols="3" />
              <VCol cols="6">
                <TermsAndConditions />
              </VCol>
            </VRow>
          </VWindowItem>

          <VWindowItem>
            <VCol cols="12" margin-left="50px" class="centered-content">
              <h6 class="text-lg font-weight-medium">
                간편회원 가입 필수 추가정보 입력
              </h6>
              <p class="text-md mb-0">
                필수정보를 입력하고 HealthyReal의 다양한 서비스를 이용하세요!
              </p>
            </VCol>
            <FormLayoutSocialForm />
          </VWindowItem>
        </VWindow>

        <div class="d-flex justify-sm-space-between gap-4 flex-wrap justify-center mt-8">
          <VBtn :color="currentStep === 0 ? 'secondary' : 'default'" variant="outlined" :disabled="currentStep === 0"
            @click="currentStep--">
            <VIcon icon="mdi-arrow-left" start class="flip-in-rtl" />
            이전
          </VBtn>

          <VBtn v-if="iconsSteps.length - 1 === currentStep" color="success" append-icon="mdi-check" @click="onSubmit">
            submit
          </VBtn>

          <VBtn v-else @click="currentStep++">
            다음
            <VIcon icon="mdi-arrow-right" end class="flip-in-rtl" />
          </VBtn>
        </div>
      </VForm>
    </VCardText>
  </VCard>
</template>

<style scoped>
.centered-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.text-lg {
  font-size: 1.25rem;
  /* 원하는 폰트 크기로 조정 */
}

.text-md {
  font-size: 1rem;
  /* 원하는 폰트 크기로 조정 */
}
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>
