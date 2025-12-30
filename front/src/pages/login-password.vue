<script setup>
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png'
import authV2LoginIllustrationDark from '@images/pages/auth-v2-login-illustration-dark.png'
import authV2LoginIllustrationLight from '@images/pages/auth-v2-login-illustration-light.png'
import authV2MaskDark from '@images/pages/auth-v2-mask-dark.png'
import authV2MaskLight from '@images/pages/auth-v2-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import {
  requiredValidatorPw,
} from '@validators'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()
const refVForm = ref()
const errorMessage = ref('')


//const idValue = $router.params.userid;
//const id = ref('test');
const route = useRoute()

const id = ref(route.query.userid || route.query.id || '')
const pwd = ref('')





const form = ref({
  email: '',
  password: '',
  remember: false,
})

const isPasswordVisible = ref(false)
const authThemeImg = useGenerateImageVariant(authV2LoginIllustrationLight, authV2LoginIllustrationDark, authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)



const login = async () => {
  const saveData = { id: id.value, pwd: pwd.value }

  try {
    await store.dispatch('login', saveData)
    console.log("id", id.value)
    console.log("pwd", pwd.value)
  } catch (error) {
    errorMessage.value = error.message // 에러 발생 시 errorMessage에 에러 메시지 할당
  }
}
</script>

<template>
  <div>
    <video
      autoplay
      loop
      muted
    >
      <source
        src="@/assets/video/sample.mp4"
        type="video/mp4"
      >
    </video>
    <!-- Title and Logo -->
    <div class="auth-logo d-flex align-start gap-x-3">
      <VNodeRenderer :nodes="themeConfig.app.logo" />

      <h1 class="font-weight-medium leading-normal text-2xl text-uppercase">
        {{ themeConfig.app.title }}
      </h1>
    </div>

    <VRow
      no-gutters
      class="auth-wrapper"
    >
      <VCol class="d-none d-md-flex align-center justify-center position-relative" />

      <VCol
        cols="12"
        class="auth-card-v2 d-flex align-center justify-center"
      >
        <VCard
          flat
          :max-width="500"
          class="mt-12 mt-sm-0 pa-4"
          style="width: 500px;height: 500px;border: solid 2px gray;opacity: 0.8;"
        >
          <VCol
            class="text-center" 
            style="display: flex;"
          >
            <RouterLink
              class="text-primary ms-2 text-center"
              :to="{ name: 'login', params:{backid:id} }"
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
                &#128100;{{ id }}
              </h5>
            </VCardText>
          </VCol>
          <VCardText>
            <VForm 
              ref="refVForm"
              @submit.prevent="router.push('/')"
            >
              <VRow>
                <!-- 비밀번호 입력란 -->
                <VCol cols="12">
                  <VTextField
                    v-model="pwd"
                    label="비밀번호"
                    :rules="[requiredValidatorPw]"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                    @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  />
                  <p
                    class="error-text"
                    style="color: red; font-size: 18px;"
                  >
                    {{ errorMessage }}
                  </p> 
                  <div
                    class="d-flex align-center flex-wrap mt-1 mb-4"
                    style="justify-content: right;"
                  >
                    <VCol cols="12" />
                    <VBtn
                      type="submit"
                      @click.prevent="login"
                    >
                      다음
                    </VBtn>
                  </div>
                  <VCol cols="12" />
                </VCol>

                 
                <!-- create account -->                
                <VCol
                  cols="12"
                  class="text-center"
                  style="margin-top: -30px;"
                >
                  <RouterLink
                    class="text-primary ms-2 mb-1"
                    :to="{ name: 'forgot-password' }"
                  >
                    비밀번호 찾기
                  </RouterLink>
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

video {
  position: fixed;
  block-size: 100%;
  inline-size: 100%;
  inset-block-start: 0;
  inset-inline-start: 0;
  object-fit: cover;
}

@keyframes shake {
  0% { transform: translate(1px, 1px); }
  10% { transform: translate(-1px, -2px); }
  20% { transform: translate(-3px, 0); }
  30% { transform: translate(3px, 2px); }
  40% { transform: translate(1px, -1px); }
  50% { transform: translate(-1px, 2px); }
  60% { transform: translate(-3px, 1px); }
  70% { transform: translate(3px, 1px); }
  80% { transform: translate(-1px, -1px); }
  90% { transform: translate(1px, 2px); }
  100% { transform: translate(1px, -2px); }
}

.error-text {
  animation: shake 1s;
  animation-iteration-count: 2;
}
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>

