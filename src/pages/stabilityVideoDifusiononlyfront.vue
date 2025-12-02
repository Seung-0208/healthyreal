<script setup>
import axios from 'axios'
import { ref } from 'vue'

const API_KEY = import.meta.env.VITE_APP_STABILITY_AI_API_KEY

const file = ref(null)
const preview = ref(null)
const result = ref(null)

const onFileChange = e => {
  const files = e.target.files || e.dataTransfer.files
  if (!files.length) {
    console.log('Please select a file first.')
    
    return
  }
  file.value = files[0] // 파일 자체를 file.value에 할당
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

async function uploadImage() {
  if (!file.value) {
    alert('Please select a file first.')
    
    return
  }


  // 이미지 크기를 조절하고 업로드
  const resizedImage = await resizeImage(file.value, 768, 768)


  let formData = new FormData()
  formData.append('image', resizedImage)
  formData.append('seed', 42)
  formData.append('cfg_scale', 1.8)
  formData.append('motion_bucket_id', 1.2)

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${API_KEY}`,
    },
  }

  try {
    const response = await axios.post('https://api.stability.ai/v2alpha/generation/image-to-video', formData, config)
    if (response.status === 200) {
      const generationId = response.data.id

      fetchResult(generationId)
    }
  } catch (error) {
    console.error('Error uploading image:', error)
  }
}

async function fetchResult(generationID) {
  try {
    const response = await axios.get(`https://api.stability.ai/v2alpha/generation/image-to-video/result/${generationID}`, {
      headers: {
        'Accept': 'video/*',
        'Authorization': `Bearer ${API_KEY}`,
      },
      responseType: 'blob', // blob 타입으로 응답을 받도록 설정
    })

    if (response.status === 202) {
      setTimeout(() => fetchResult(generationID), 10000)
    } else if (response.status === 200) {
      // Blob을 Base64 문자열로 변환
      const reader = new FileReader()

      reader.onloadend = function() {
        result.value = reader.result // data:video/mp4;base64,Base64문자열
      }
      reader.readAsDataURL(response.data)
    }
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div>
    <VFileInput
      v-model="file"
      label="Avatar"
      accept="image/png, image/jpeg, image/bmp"
      placeholder="Pick an avatar"
      prepend-icon="mdi-camera-outline"
      @change="onFileChange"
    />

    <div>
      <h2>입력 이미지:</h2>
      <img
        v-if="preview"
        :src="preview"
      >
    </div>

    <VBtn
      color="primary"
      @click="uploadImage"
    >
      Upload and Convert
    </VBtn>

    <div>
      <h2>결과 동영상:</h2>
      <video
        v-if="result"
        :src="result"
        controls
      />
    </div>
  </div>
</template>
