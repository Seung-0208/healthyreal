<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  value: String,
})

const store = useStore()

// 현재 접속 중인 사용자의 정보를 불러옵니다.
const userInfo = computed(() => store.state.loginStore.userInfo)

const textareaValue = ref('자기소개')
const rules = [v => v.length <= 200 || '최대 200자까지']
</script>

<template>
  <VTextarea
    
    v-model="props.value"
    :rules="rules"
    no-resize
    rows="12"
  />
</template>

