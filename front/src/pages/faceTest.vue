<script setup>
import axiosflask from '@/plugins/axiosflask'
import { Quill, QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.bubble.css'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import * as Emoji from "quill-emoji"
import { createApp, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()


const app = createApp()

Quill.register("modules/emoji", Emoji)

app.component('QuillEditor', QuillEditor)



const inputEmotionPhoto = ref(false)

const userInfo = computed(() => store.state.userStore.userInfo)
const emotiondata = ref('')

const imgUrlEmotion = ref([]) // 이미지 URL 담을 변수 -- 사진 여러개

//파일 1개 업로드 함수 -- 오늘의 기분
const uploadImgEmotion = e => {
  const file = e.target.files[0] // 첫 번째 파일만 선택

  console.log('함수 안의 파일명:', file)

  if (file) {
    // 이미지 URL 생성
    const imgEmotion = URL.createObjectURL(file)

    // 이미지 URL을 배열에 추가
    imgUrlEmotion.value = [imgEmotion]

    // 파일을 formEmotion에 추가하고 서버로 업로드
    const formEmotion = new FormData()

    formEmotion.append('file', file)

    axiosflask.post('/test', formEmotion, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        console.log(response.data)
        emotiondata.value = response.data

        // 서버에서 받은 응답 처리
      })
      .catch(error => {
        console.error(error)

        // 오류 처리
      })
  } else {
    // 파일이 선택되지 않은 경우
    console.error('No file selected')
  }
}
</script>

<template>
  <VCol cols="1">
    {{ emotiondata.emotion }}
    <VDialog v-model="inputEmotionPhoto" width="600">
      <template #activator="{ props }">
        <VBtn width="50" v-bind="props">
          사진 추가
        </VBtn>
      </template>
      <!-- Dialog Content -->
      <VCard title="오늘의 얼굴을 보여주세요!!">
        <DialogCloseBtn variant="text" size="small" @click="inputEmotionPhoto = false" />
        <VCardText>
          Ai가 얼굴을 인식해 감정을 분석해줍니다
        </VCardText>
        <VImg v-for="(url, index) in imgUrlEmotion" :key="index" :src="url"
          style="width: 400px; height: 400px; align-self: center;" />
        <VCol cols="12">
          <VFileInput :rules="rules" label="Face IMG" type="file" accept="image/png, image/jpeg, image/bmp"
            placeholder="Pick an avatar" prepend-icon="mdi-camera-outline" @change="uploadImgEmotion" />
        </VCol>
        <VCol>
          <VBtn block @click="inputEmotionPhoto = false">
            확인
          </VBtn>
        </VCol>
      </VCard>
    </VDialog>
  </VCol>
</template>
