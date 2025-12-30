<script setup>
import LoadingModal from '@/pages/LoadingModal.vue'
import ResetPasswordDialog from '@/pages/resetPasswordDialog.vue'
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()
const isDialogVisible = ref(false)
const isLoadingModalVisible = ref(false)
const isResetPasswordDialogVisible = ref(false)

const route = useRoute()

console.log("실행되니?? auth")

const executeLogic = () => {
  // URL에 resetPassword=true가 포함되어 있는지 검사
  if (route.query.resetPassword === 'true') {
    // resetPassword=true가 포함되어 있다면 함수를 종료
    return
  }

  // resetPassword=true가 포함되어 있지 않다면 아래 로직을 실행
  store.dispatch('saveToken')
    .then(() => store.dispatch('getMemberInfo'))
    .then(() => router.push('/main'))
    .catch(error => console.error(error))
}

watch(
  () => isResetPasswordDialogVisible.value,
  newVal => {
    if (!newVal) {
      executeLogic()
    }
  },
  { immediate: true },
)



watch(
  () => store.state.isResetPasswordDialogVisible,
  newVal => {
    isResetPasswordDialogVisible.value = newVal
  },
  { immediate: true },
)

watch(
  () => route.query.resetPassword,
  async (newValue, oldValue) => {
    if (newValue === 'true') {
      isLoadingModalVisible.value = true

      setTimeout(()=>{
        isLoadingModalVisible.value = false
        isResetPasswordDialogVisible.value = true
      }, 4000)

      await router.replace({ query: { ...route.query, resetPassword: null } })

      if (route.query.resetPassword == null) {
        store.dispatch('openResetPasswordDialogAction')
      }
    }
  },
  { immediate: true },
)
</script>

<template>
  <LoadingModal v-model="isLoadingModalVisible" />
  <ResetPasswordDialog
    :is-dialog-visible="isResetPasswordDialogVisible"
    @update:isDialogVisible="val => isResetPasswordDialogVisible = val"
  />
</template>
