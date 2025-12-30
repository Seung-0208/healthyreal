<script setup>
import axios from '@axios'
import { computed, defineEmits, defineProps, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

const props = defineProps({
  isDialogVisible: {
    modelValue: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:isDialogVisible'])


watch(
  () => props.isDialogVisible,
  newVal => {
    if (!newVal) {
      store.dispatch('closeResetPasswordDialogAction')
    }
  },
)


const route = useRoute()
const store = useStore()


let id = ref(route.query.id)
let pwd = ref('')
let pwdCK = ref('')
let pwdErrorMsg = ref('')
let pwdCKErrorMsg = ref('')
let pwdSuccessMsg = ref('')
let pwdCKSuccessMsg = ref('')


const isPasswordVisible = ref(false)
const isCPasswordVisible = ref(false)


let pwdSuccess = ref(false)
let pwdCKSuccess = ref(false)

const validatePassword = () => {
  const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_-])[A-Za-z\d!@#$%^&*()_-]{8,20}$/
  if (!regex.test(pwd.value)) {
    pwdErrorMsg.value = '비밀번호는 8~20자의 영문 대/소문자, 숫자, 특수문자를 모두 사용해 주세요.'
    pwdSuccessMsg.value = ''

    return false
  } else {
    pwdSuccessMsg.value = '사용가능!'
    pwdErrorMsg.value = ''

    return true
  }
}

const closeDialog = () => {
  emit('update:isDialogVisible', false)
  store.dispatch('closeResetPasswordDialogAction')
}



const validatePasswordCK = () => {
  if (pwd.value !== pwdCK.value) {
    pwdCKErrorMsg.value = "비밀번호가 비밀번호 확인과 일치하지 않습니다."
    pwdCKSuccessMsg.value = ''
  } else {
    if (pwdCK.value !== '') {
      pwdCKSuccessMsg.value = '일치합니다!'
    }
    pwdCKErrorMsg.value = ''
  }
}

watch(pwd, () => {
  validatePassword()
})

watch(pwdCK, () => {
  validatePasswordCK()
})

const updatePassword = async () => {
  if (!validatePassword()) return

  try {
    const response = await axios.post('/update-password', {
      id: id.value,
      pwd: pwd.value,
    }, { withCredentials: true })

    if (response.status !== 200) {
      throw new Error('비밀번호 수정에 실패했습니다.')
    }

    // 비밀번호 변경 성공 메시지
    alert('비밀번호가 성공적으로 수정되었습니다. 로그인을 진행합니다.')

    // 로그인 실행
    await store.dispatch('login', { id: id.value, pwd: pwd.value })
    closeDialog()

    //window.location.reload()

    // 로그인 완료 후 모달 창 닫기


  } catch (error) {
    console.error(error)
    alert('비밀번호 수정에 실패했습니다.')
    router.push({ name: 'main' })
  }
}




const isRestDialogVisible = ref(props.modelValue)






// 상태 초기화 코드를 watch 함수보다 먼저 위치시킵니다.
const isResetPasswordDialogVisible = computed(() => store.state.isResetPasswordDialogVisible)
</script>


<template>
  <VDialog :model-value="props.isDialogVisible" max-width="600"
    @update:model-value="val => { emit('update:isDialogVisible', val); val || closeDialog(); }">
    <!-- Dialog Content -->
    <VCard title="비밀번호 수정">
      <DialogCloseBtn variant="text" size="small" @click="closeDialog" />

      <VCardText>
        <VRow>
          <VCol cols="12">
            <VTextField v-model="id" label="아이디" readonly placeholder="id" />
          </VCol>
          <VCol cols="12">
            <VTextField id="pwd" v-model="pwd" placeholder="비밀번호" persistent-placeholder
              :type="isPasswordVisible ? 'text' : 'password'"
              :append-inner-icon="isPasswordVisible ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
              @input="validatePassword" @click:append-inner="isPasswordVisible = !isPasswordVisible" />
            <div v-if="pwdErrorMsg" :style="{ color: 'red' }">
              {{ pwdErrorMsg }}
            </div> <!-- 비밀번호 오류 메세지 -->

            <div v-if="pwdSuccessMsg" :style="{ color: 'greenyellow' }">
              {{ pwdSuccessMsg }}
            </div> <!-- 비밀번호 성공 메세지 -->
          </VCol>
          <VCol cols="12">
            <VTextField id="passwordCK" v-model="pwdCK" placeholder="비밀번호 확인" persistent-placeholder
              :type="isCPasswordVisible ? 'text' : 'password'"
              :append-inner-icon="isCPasswordVisible ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
              @input="validatePasswordCK" @click:append-inner="isCPasswordVisible = !isCPasswordVisible" />
            <div v-if="pwdCKErrorMsg && pwdCK !== ''" :style="{ color: 'red' }">
              {{ pwdCKErrorMsg }}
            </div> <!-- 비밀번호 확인 오류 메세지 -->

            <div v-if="pwdCKSuccessMsg && pwdCK !== ''" :style="{ color: 'greenyellow' }">
              {{ pwdCKSuccessMsg }}
            </div> <!-- 비밀번호 확인 성공 메세지 -->
          </VCol>
        </VRow>
      </VCardText>

      <VCardActions>
        <VSpacer />
        <VBtn color="error" @click="closeDialog">
          Close
        </VBtn>
        <VBtn color="success" @click="updatePassword">
          Save
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
