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
  requiredValidatorId,
  requiredValidatorPw,
} from '@validators'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()

const router = useRouter()

const form = ref({
  email: '',
  password: '',
  remember: false,
})

const refVForm = ref()

const id = ref('')
const pwd = ref('')
const password = ref('')
const rememberMe = ref(false)
const isPasswordVisible = ref(false)
const authThemeImg = useGenerateImageVariant(authV2LoginIllustrationLight, authV2LoginIllustrationDark, authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

const adminLogin = () => {
  const saveData = { id: id.value, pwd: pwd.value }

  store.dispatch('adminLogin', saveData)
  console.log("id", id.value)
  console.log("pwd", pwd.value)
}


// const loginId = () => {
//   router.push({ path: "/access-control" })
// }

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

        //console.log('타이머가 만료되었습니다.')
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
      // 일반 모드로 변경
      //console.log('일반 모드를 실행합니다.');
      location.href = '/login'
    },
  },
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
      no-gutters
      class="auth-wrapper"
    >
      <VCol class="d-none d-md-flex align-center justify-center position-relative" />

      <VCol
        cols="12"
        class="auth-card-v2 d-flex align-center justify-center"
        style="background-color: gray;opacity: 0.8;"
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
                &#128100;관리자 로그인
              </h5>
            </VCardText>
          </VCol>
          <VCardText>
            <VForm
              ref="refVForm" 
              @submit.prevent="router.push('/access-control')"
            >
              <VRow>
                <!-- 아이디 입력란 -->
                <VCol cols="12">
                  <VTextField
                    v-model="id"
                    label="아이디"
                    type="id"
                    :rules="[requiredValidatorId]"
                  />                  
                </VCol>
                <VCol cols="12">
                  <VTextField
                    v-model="pwd"
                    label="비밀번호"
                    :rules="[requiredValidatorPw]"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                    @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  />                 
                </VCol>                               
                <VCol cols="12">
                  <div class="d-flex align-center flex-wrap mt-1 mb-4 justify-center">
                    <VBtn
                      type="submit"
                      @click.prevent="adminLogin"
                    >
                      로그인
                    </VBtn>
                    <div @keydown="handleKeyDown" />
                  </div>
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
