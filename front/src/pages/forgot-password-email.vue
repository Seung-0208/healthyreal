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
import { useRoute } from 'vue-router'

const route = useRoute()
const b_day = ref('')
const id = route.query.id

const email = ref('')

const checkUserExistence = async id => {
  try {
    console.log("data", id)

    const response = await axios.post('/check-userPWD', {

      id: id,

    })



    return response.status === 200
  } catch (error) {
    console.error('요청 처리 중 오류 발생: ', error)

    return false
  }
}

const sendEmailVerificationRequest = async (id, email) => {
  try {
    const response = await axios.post('/email-verification-request', {
      id: id,

      email: email.value,
    })

    if (response.status === 200) {
      console.log('비밀번호 재설정 이메일 전송 성공')
      alert('비밀번호 재설정 이메일이 발송되었습니다.')
    } else {
      console.log('이메일 전송 실패: ' + response.data)
    }
  } catch (error) {
    console.error('요청 처리 중 오류 발생: ', error)
  }
}

const handleConfirmButtonClick = async () => {
  if (await checkUserExistence(id)) {
    await sendEmailVerificationRequest(id, email)
  } else {
    alert('이름과 생년월일, 이메일을 다시 확인해주세요.')
    console.log("data", id, b_day)
    console.log('사용자가 존재하지 않습니다.')
  }
}


const authThemeImg = useGenerateImageVariant(authV2ForgotPasswordIllustrationLight, authV2ForgotPasswordIllustrationDark, authV2ForgotPasswordIllustrationBorderedLight, authV2ForgotPasswordIllustrationBorderedDark, true)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
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
            <RouterLink class="text-primary ms-2 text-center" :to="{ name: 'forgot-password' }"
              style="line-height: 70px;">
              <VIcon class="flip-in-rtl" icon="mdi-chevron-left" />
              <span>Back</span>
            </RouterLink>
            <VCardText style="padding-left: 5px;">
              <h5 class="text-h5 mb-1">
                비밀번호찾기 이메일 인증 🔒
              </h5>
            </VCardText>
          </VCol>

          <VCardText>
            <VForm @submit.prevent="() => { }">
              <VRow>
                <!-- email -->
                <VCol cols="12">
                  <VTextField v-model="id" label="아이디" type="id" />
                </VCol>
                <VCol cols="12">
                  <Birthyday v-model="b_day" label="생년월일" />
                </VCol>
                <VCol cols="12">
                  <VTextField v-model="email" label="Email" type="email" />
                </VCol>

                <!-- Reset link -->
                <VCol cols="12">
                  <VBtn block type="submit" @click.prevent="handleConfirmButtonClick(id, b_day, email)">
                    Send Reset Link
                  </VBtn>
                </VCol>

                <!-- back to login -->
                <!--
                  <VCol
                  cols="12"
                  class="text-center"
                  >
                  <RouterLink
                  class="text-primary ms-2"
                  :to="{ name: 'login' }"
                  >
                  <VIcon
                  class="flip-in-rtl"
                  icon="mdi-chevron-left"
                  />
                  <span>Back to login</span>
                  </RouterLink>
                  </VCol> 
                -->
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
