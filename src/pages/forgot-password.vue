<script setup>
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2ForgotPasswordIllustrationBorderedDark from '@images/pages/auth-v2-forgot-password-illustration-bordered-dark.png'
import authV2ForgotPasswordIllustrationBorderedLight from '@images/pages/auth-v2-forgot-password-illustration-bordered-light.png'
import authV2ForgotPasswordIllustrationDark from '@images/pages/auth-v2-forgot-password-illustration-dark.png'
import authV2ForgotPasswordIllustrationLight from '@images/pages/auth-v2-forgot-password-illustration-light.png'
import authV2MaskDark from '@images/pages/auth-v2-mask-dark.png'
import authV2MaskLight from '@images/pages/auth-v2-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { RouterLink, useRoute } from 'vue-router'
import { useRouter } from 'vue-router'

const name = ref('')
const birthday = ref('')
const email = ref('')
const authThemeImg = useGenerateImageVariant(authV2ForgotPasswordIllustrationLight, authV2ForgotPasswordIllustrationDark, authV2ForgotPasswordIllustrationBorderedLight, authV2ForgotPasswordIllustrationBorderedDark, true)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

const router = useRouter()

const route = useRoute() // 현재 라우트의 정보를 가져옵니다.
const id = route.query.id 

const redirectToLoginPassword = () => {
  router.push({ path: "/login-password", query: { id } })
}

const phone_certification = () => {
  router.push({ path: "/forgot-password-phone", query: { id } })
}

const email_certification = () => {
  router.push({ path: "/forgot-password-email", query: { id } })
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

    <VRow
      class="auth-wrapper"
      no-gutters
    >
      <VCol
        cols="12"
        class="auth-card-v2 d-flex align-center justify-center"
      >
        <VCard
          flat
          :max-width="600"
          class="mt-12 mt-sm-0 pa-4"
          style="width: 500px;height: 600px;border: solid 2px gray;"
        >
          <VCol
            class="text-center" 
            style="display: flex;"
          >
            <RouterLink
              class="text-primary ms-2 text-center"
              :to="{ name: 'login-password' }"
              style="line-height: 70px;"
            >
              <VIcon
                class="flip-in-rtl"
                icon="mdi-chevron-left"
              />
              <span>Back</span>
            </RouterLink>
            <VCardText style="padding-left: 5px;">
              <h5 class="text-h5 mb-1">
                비밀번호 찾기 🔒
              </h5>
              <VCol />
              <h5 class="text-h5">
                아이디 : {{ id }}
              </h5>
            </VCardText>
          </VCol> 

          <VCardText>
            <VForm @submit.prevent="() => {}">
              <VRow>
                <VCol
                  cols="12"
                  style="text-align: start;"
                >
                  <h3>인증 방법 선택</h3><br>
                  <VBtnGroup
                    v-model="selectedMethod"
                    style="display: grid;height: 300px;border: solid #fff 1px;"
                  >                                        
                    <VBtn
                      value="input-password"
                      class="choicebox"
                      @click="redirectToLoginPassword"
                    >
                      비밀번호 입력
                    </VBtn>
                    <VBtn
                      value="phone"
                      class="choicebox"
                      @click="phone_certification"
                    >
                      &#x1F4F1; 휴대폰 인증
                    </VBtn>
                    <VBtn
                      value="email"
                      class="choicebox"
                      @click="email_certification"
                    >
                      &#x1F4E7; 이메일 인증
                    </VBtn>
                  </VBtnGroup>
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

.choicebox {
  //border: 1px solid #fff;
  //background-color: black;
  font-size: 20px;
}
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>
