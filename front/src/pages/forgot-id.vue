<script setup>
import axios from '@axios'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2ForgotPasswordIllustrationBorderedDark from '@images/pages/auth-v2-forgot-password-illustration-bordered-dark.png'
import authV2ForgotPasswordIllustrationBorderedLight from '@images/pages/auth-v2-forgot-password-illustration-bordered-light.png'
import authV2ForgotPasswordIllustrationDark from '@images/pages/auth-v2-forgot-password-illustration-dark.png'
import authV2ForgotPasswordIllustrationLight from '@images/pages/auth-v2-forgot-password-illustration-light.png'
import authV2MaskDark from '@images/pages/auth-v2-mask-dark.png'
import authV2MaskLight from '@images/pages/auth-v2-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'


const authThemeImg = useGenerateImageVariant(authV2ForgotPasswordIllustrationLight, authV2ForgotPasswordIllustrationDark, authV2ForgotPasswordIllustrationBorderedLight, authV2ForgotPasswordIllustrationBorderedDark, true)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)


const name = ref('')
const b_day = ref('')
const email = ref('')

const checkUserExistence = async (name, b_day) => {
  try {
    console.log("data", name.value, b_day.value)

    const response = await axios.post('/check-userID', {

      name: name.value,
      b_day: b_day.value,
    })



    return response.status === 200
  } catch (error) {
    console.error('요청 처리 중 오류 발생: ', error)

    return false
  }
}

const sendEmailVerificationRequest = async (name, b_day, email) => {
  try {
    const response = await axios.post('/email-verification-request', {
      name: name.value,
      b_day: b_day.value,
      email: email.value,
    })

    if (response.status === 200) {
      console.log('이메일 전송 성공')
      alert('이메일이 발송되었습니다.')
    } else {
      console.log('이메일 전송 실패: ' + response.data)
    }
  } catch (error) {
    console.error('요청 처리 중 오류 발생: ', error)
  }
}

const handleConfirmButtonClick = async () => {
  if (await checkUserExistence(name, b_day)) {
    await sendEmailVerificationRequest(name, b_day, email)
  } else {
    alert('이름과 생년월일, 이메일을 다시 확인해주세요.')
    console.log("data", name, b_day)
    console.log('사용자가 존재하지 않습니다.')
  }
}
</script>

<template>
  <div>
    <!-- Title and Logo -->
    <div class="auth-logo d-flex align-start gap-x-3">
      <VNodeRenderer :nodes="themeConfig.app.logo" />

      <h1 class="font-weight-medium leading-normal text-2xl text-uppercase">
        {{ themeConfig.app.title }}
      </h1>
    </div>

    <VRow class="auth-wrapper" no-gutters>
      <VCol cols="12" class="auth-card-v2 d-flex align-center justify-center">
        <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4"
          style="width: 500px;height: 500px;border: solid 2px gray;">
          <VCol class="text-center" style="display: flex;">
            <RouterLink class="text-primary ms-2 text-center" :to="{ name: 'login' }" style="line-height: 70px;">
              <VIcon class="flip-in-rtl" icon="mdi-chevron-left" />
              <span>Back</span>
            </RouterLink>
            <VCardText style="padding-left: 5px;">
              <h5 class="text-h5 mb-1">
                아이디 찾기 🔒
              </h5>
            </VCardText>
          </VCol>

          <VCardText>
            <VForm>
              <VRow>
                <VCol cols="12">
                  <VTextField v-model="name" label="이름" type="name" />
                </VCol>
                <VCol cols="12">
                  <Birthyday v-model="b_day" label="생년월일" />
                </VCol>
                <VCol cols="12">
                  <VTextField v-model="email" label="이메일" type="email" />
                </VCol>

                <!-- Reset link -->
                <VCol cols="12">
                  <VBtn block type="submit" @click.prevent="handleConfirmButtonClick(name, b_day, email)">
                    Send Reset Link
                  </VBtn>
                </VCol>
              </VRow>
            </VForm>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>
