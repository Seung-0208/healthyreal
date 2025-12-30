<script setup>
import axios from '@axios'
import { ref } from 'vue'

const rules = [fileList => !fileList || !fileList.length || fileList[0].size < 1000000 || 'Avatar size should be less than 1 MB!']
const file = ref(null) // 원본 파일을 저장할 ref
const selectedFile = ref(null) // 선택된 파일의 미리보기를 위한 ref
const preview = ref(null)
const result = ref(null) // 결과 동영상 URL을 저장할 ref

const onFileChange = e => {
  const files = e.target.files || e.dataTransfer.files
  if (!files.length)
    return
  file.value = files[0] // 원본 파일 저장
  createImage(files[0])
}

function createImage(file) {
  const reader = new FileReader()

  reader.onload = e => {
    preview.value = e.target.result
  }
  reader.readAsDataURL(file)
}


// 이미지 크기를 조절하는 함수
function resizeImage(file, maxWidth, maxHeight) {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      let width = img.width
      let height = img.height

      // 원본 이미지의 비율을 유지하면서 크기 조절
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height
          height = maxHeight
        }
      }

      const canvas = document.createElement('canvas')

      canvas.width = maxWidth
      canvas.height = maxHeight

      const ctx = canvas.getContext('2d')

      // 이미지를 캔버스의 가운데에 그림
      ctx.drawImage(img, (maxWidth - width) / 2, (maxHeight - height) / 2, width, height)

      canvas.toBlob(blob => {
        resolve(new File([blob], file.name, { type: file.type }))
      }, file.type)
    }
    img.src = URL.createObjectURL(file)
  })
}


// 이미지를 백엔드 서버에 업로드
async function uploadImage() {
  if (!file.value) {
    console.log('Please select a file first.')

    return
  }

  let formData = new FormData()

  // 이미지 크기를 조절하고 업로드
  const resizedImage = await resizeImage(file.value, 768, 768)

  // 이미지 크기 확인
  const img = new Image()

  img.onload = () => console.log('Resized image dimensions:', img.width, 'x', img.height)
  img.src = URL.createObjectURL(resizedImage)

  formData.append('image', resizedImage)

  try {
    const response = await axios.post('/upload', formData)

    if (response.status === 200) {
      console.log('Response data:', response.data)

      // 백엔드로부터 받은 Base64 인코딩된 동영상 데이터를 디코딩하여 result.value에 저장합니다.
      result.value = "data:video/mp4;base64," + response.data.video
    } else {
      console.error(`Response ${response.status}: ${response.data.toString()}`)
    }
  } catch (error) {
    console.error(error)
  }
}
</script>


<template>
  <div>
    <VFileInput v-model="selectedFile" :rules="rules" label="Avatar" accept="image/png, image/jpeg, image/bmp"
      placeholder="Pick an avatar" prepend-icon="mdi-camera-outline" @change="onFileChange" />

    <div>
      <h2>입력 이미지:</h2>
      <img v-if="preview" :src="preview">
    </div>

    <VBtn color="primary" @click="uploadImage">
      Upload and Convert
    </VBtn>

    <div>
      <h2>결과 동영상:</h2>
      <video v-if="result" :src="result" controls loop autoplay />
    </div>
  </div>
</template>
