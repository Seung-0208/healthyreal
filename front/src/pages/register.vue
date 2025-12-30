<script setup>
import AppStepper from '@/@core/components/AppStepper.vue'
import DemoFormLayoutHorizontalForm from '@/views/demos/register/DemoFormLayoutHorizontalForm.vue'
import TermsAndConditions from '@/views/demos/register/TermsAndConditions.vue'

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
              <TermsAndConditions />
            </VRow>
          </VWindowItem>

          <VWindowItem>
            <VCol cols="12" margin-left="50px" class="centered-content" style="margin-bottom: 20px;">
              <h6 class="text-lg font-weight-medium">
                회원가입 정보 입력
              </h6>
              <p class="text-md mb-0">
                HealthyReal의 회원이 되어보세요!
              </p>
            </VCol>
            <DemoFormLayoutHorizontalForm />
          </VWindowItem>




          <VWindowItem>
            <div class="text-base">
              <h6 class="text-base font-weight-medium mb-2">
                Account
              </h6>

              <p class="mb-1">
                {{ formData.username }}
              </p>
              <p class="mb-1">
                {{ formData.email }}
              </p>

              <VDivider class="my-4" />

              <h6 class="text-base font-weight-medium mb-2">
                Personal Info
              </h6>

              <p class="mb-1">
                {{ formData.firstName }}
              </p>
              <p class="mb-1">
                {{ formData.lastName }}
              </p>
              <p class="mb-1">
                {{ formData.country }}
              </p>
              <p class="mb-1">
                {{ formData.language }}
              </p>

              <VDivider class="my-4" />

              <h6 class="text-base font-weight-medium mb-2">
                Address
              </h6>

              <p class="mb-1">
                {{ formData.address }}
              </p>
              <p class="mb-1">
                {{ formData.landmark }}
              </p>
              <p class="mb-1">
                {{ formData.pincode }}
              </p>
              <p class="mb-1">
                {{ formData.city }}
              </p>

              <VDivider class="my-4" />

              <h6 class="text-base font-weight-medium mb-2">
                Social Links
              </h6>

              <p class="mb-1">
                {{ formData.twitter }}
              </p>
              <p class="mb-1">
                {{ formData.facebook }}
              </p>
              <p class="mb-1">
                {{ formData.googlePlus }}
              </p>
              <p class="mb-1">
                {{ formData.linkedIn }}
              </p>
            </div>
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
