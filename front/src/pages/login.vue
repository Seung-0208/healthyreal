<script setup>
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png'
import authV2LoginIllustrationDark from '@images/pages/auth-v2-login-illustration-dark.png'
import authV2LoginIllustrationLight from '@images/pages/auth-v2-login-illustration-light.png'
import authV2MaskDark from '@images/pages/auth-v2-mask-dark.png'
import authV2MaskLight from '@images/pages/auth-v2-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import {
  requiredValidatorId,
} from '@validators'

const router = useRouter()
const store = useStore()

onMounted(() => {
  const rememberedId = localStorage.getItem('rememberedId')
  if (rememberedId) {
    rememberMe.value = true
    id.value = rememberedId
  }
})

// const form = ref({
//   email: '',
//   password: '',
//   remember: false,
// })
const refVForm = ref()
const id = ref('')

const rememberMe = ref(false)

const isPasswordVisible = ref(false)
const authThemeImg = useGenerateImageVariant(authV2LoginIllustrationLight, authV2LoginIllustrationDark, authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

watch(rememberMe, newVal => {
  // 체크박스의 상태가 변경될 때마다 Vuex 스토어의 rememberMe 상태를 업데이트하고,
  // rememberMe 상태가 true일 때만 로컬 스토리지에 아이디를 저장합니다.
  store.commit('toggleRememberMe', { rememberMe: newVal, id: id.value })
})


const loginId = () => {
  router.push({ path: "/login-password", query: { userid: id.value } })
}

const loginNext = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid)    
      loginId()
  })
}
</script>

<script>
export default{
  data() {
    return {
      keyCombination: [], //사용자가 누른 키 조합을 저장하는 역할
      timer: null,
    } 
  },

  // mounted(){
  //   this.timer = setTimeout(() => {
  //     // 타이머가 만료되었을때 실행될 코드
  //     console.log('타이머가 만료되었습니다.');
  //   }, 30000); // 30초를 밀리초 단위로 설정    
  // },
  created(){
    window.addEventListener('keydown', this.handleKeyDown)
  },
  unmounted(){
    window.removeEventListener('keydown', this.handleKeyDown)
  },
  methods: {
    handleKeyDown(event) {
      const key = event.key

      this.keyCombination.push(key)

      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.resetKeyCombination()

        //console.log('타이머가 만료되었습니다.');
      }, 5000)

      if (this.checkKeyCombination()) {
        this.enterAdminMode()
      }
    },
    checkKeyCombination() {
      const targetKeys = ['ArrowUp', 'ArrowUp', 'ArrowRight', 'ArrowRight', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowLeft']
      
      return this.keyCombination.length === targetKeys.length && this.keyCombination.every((key, index) => key === targetKeys[index])
    },
    resetKeyCombination() {
      this.keyCombination = []
    },
    enterAdminMode() {
      // 관리자 모드로 변경
      //console.log('관리자 모드를 실행합니다.');
      location.href = '/login-admin'
    },
  },
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
          <VCol class="text-center">
            <VCardText>              
              <h5 class="text-h5 mb-1">
                &#128100;로그인
              </h5>
            </VCardText>
          </VCol>
          <VCardText>
            <VForm
              ref="refVForm" 
              @submit.prevent="router.push('/')"
            >
              <VRow>
                <!-- 아이디 입력란 -->
                <VCol cols="12">
                  <VTextField
                    v-model="id"
                    label="아이디"
                    type="id"
                    :rules="[requiredValidatorId]"
                    @keyup.enter="loginNext"
                  />
                </VCol>
                <VCol cols="12">
                  <div class="d-flex align-center flex-wrap justify-space-between mt-1 mb-4">
                    <VCheckbox
                      v-model="rememberMe"
                      label="Remember me"
                    />
                    <VBtn @click="loginNext">
                      다음
                    </VBtn>
                  </div>
                  <VCol
                    cols="12"                  
                    class="d-flex align-center"
                  >
                    <VDivider />
                    <span class="mx-4">or</span>
                    <VDivider />
                  </VCol>                  
                </VCol> 
                <!-- create account -->
                <VCol
                  cols="12"
                  class="text-center"
                  style="margin-top: -30px;"
                >
                  <!-- /AuthProvider.vue -->
                  <!-- 소셜로그인(AuthProvider) 부분 정렬 -->                
                  <VCol
                    cols="12"
                    class="text-center"
                  >
                    <AuthProvider />
                  </VCol>
                  <span>서비스가 궁금하신가요?</span>
                  <RouterLink
                    class="text-primary ms-2"
                    :to="{ name: 'register' }"
                  >
                    회원가입
                  </RouterLink>
                  <br><br>
                  <RouterLink
                    class="text-primary ms-2 mb-1"
                    :to="{ name: 'forgot-id' }"
                  >
                    아이디 찾기
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
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>
