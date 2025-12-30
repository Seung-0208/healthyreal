<script setup>
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import authV2ForgotPasswordIllustrationBorderedDark from '@images/pages/auth-v2-forgot-password-illustration-bordered-dark.png'
import authV2ForgotPasswordIllustrationBorderedLight from '@images/pages/auth-v2-forgot-password-illustration-bordered-light.png'
import authV2ForgotPasswordIllustrationDark from '@images/pages/auth-v2-forgot-password-illustration-dark.png'
import authV2ForgotPasswordIllustrationLight from '@images/pages/auth-v2-forgot-password-illustration-light.png'
import authV2MaskDark from '@images/pages/auth-v2-mask-dark.png'
import authV2MaskLight from '@images/pages/auth-v2-mask-light.png'

const phone = ref('')
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
          :max-width="500"
          class="mt-12 mt-sm-0 pa-4"
          style="width: 500px;height: 500px;border: solid 2px gray;"
        >
          <VCol
            class="text-center" 
            style="display: flex;"
          >
            <RouterLink
              class="text-primary ms-2 text-center"
              :to="{ name: 'forgot-password' }"
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
            </VCardText>
          </VCol> 

          <VCardText>
            <VForm @submit.prevent="() => {}">
              <VRow>
                <!-- email -->
                <VCol cols="12">
                  <VTextField
                    v-model="name"
                    label="이름"
                    type="name"
                  />
                </VCol>
                <VCol cols="12">
                  <VTextField
                    v-model="birthday"
                    label="생년월일"
                    type="b_day"
                  />
                </VCol>
                <VCol cols="12">
                  <VTextField
                    v-model="phone"
                    label="전화번호"
                    type="phone"
                  />
                </VCol>

                <!-- Reset link -->
                <VCol cols="12">
                  <VBtn
                    block
                    type="submit"
                  >
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
