<script setup>
import axios from '@axios'
import {
  avatarText,
} from '@core/utils/formatters'
import { defineProps, ref, watch } from 'vue'

const props = defineProps({
  participantsData: {
    type: Array,
    required: true,
  },
  cstartDate: {
    type: Object,
    required: true,
  },
  cendDate: {
    type: Object,
    required: true,
  },
  implementation: {
    type: Object,
    required: true,
  },
})


const isUserInfoEditDialogVisible = ref(false)
const isUpgradePlanDialogVisible = ref(false)
const file = ref(null) // 원본 파일을 저장할 ref



const resolveUserStatusVariant = stat => {
  if (stat < props.implementation)
    return 'warning'
  else (stat >= props.implementation)

  return 'info'
}

const getHourDifference = (date1, date2) => {
  const diff = Math.abs(new Date(date1) - new Date(date2))

  return diff / (1000 * 60 * 60)
}

watch(
  () => props.participantsData,
  async (newVal, oldVal) => {
    if (newVal !== oldVal && newVal.length > 0) {
      console.log("participantsData has been updated.", newVal)

      // 각 사용자의 이미지 업로드를 위한 Promise 배열 생성
      const uploadPromises = newVal.map(async participant => {
        const oldProfilePath = participant.PRO_FILEPATH // 기존 이미지 URL을 임시로 저장

        const response = await axios.get(participant.PRO_FILEPATH, { responseType: 'arraybuffer' })
        let binary = ''
        const bytes = new Uint8Array(response.data)
        const len = bytes.byteLength
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        const base64Image = window.btoa(binary)

        // File 객체로 변환
        const imageFile = dataURLtoFile(`data:image/png;base64,${base64Image}`, 'image.png')

        participant.tempFilePath = imageFile // 임시 File 객체 저장

        // 이미지 선택 및 업로드
        file.value = imageFile

        const videoUrl = await uploadImage(participant)

        if (videoUrl) {
          participant.PRO_FILEPATH = videoUrl // 동영상 URL로 업데이트
        } else {
          participant.PRO_FILEPATH = oldProfilePath // 동영상 변환에 실패했을 경우, 기존 이미지 URL로 복원
        }
      })

      // 모든 이미지 업로드가 완료될 때까지 기다림
      await Promise.all(uploadPromises)
    }
  },
  { immediate: true },
)

function dataURLtoFile(dataurl, filename) {
  let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new File([u8arr], filename, { type: mime })
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
        resolve(blob)
      }, file.type)
    }
    console.log("/", file instanceof Blob) // true가 출력되어야 합니다

    console.log("URL.createObjectURL(file)", URL.createObjectURL(file))
    console.log(file instanceof File) // true가 출력되어야 합니다.
    img.src = URL.createObjectURL(file)

    console.log("URL.createObjectURL(file)", URL.createObjectURL(file))
  })
}


// 이미지를 백엔드 서버에 업로드
async function uploadImage(participant) {
  if (!file.value) {
    console.log('Please select a file first.')

    return
  }

  let formData = new FormData()

  // 이미지 크기를 조절하고 업로드
  const blob = await resizeImage(file.value, 768, 768)
  const resizedImage = new File([blob], file.value.name, { type: file.value.type })

  // 이미지 크기 확인
  const img = new Image()

  img.onload = () => console.log('Resized image dimensions:', img.width, 'x', img.height)
  img.src = URL.createObjectURL(resizedImage)

  formData.append('image', resizedImage)

  try {
    const response = await axios.post('/upload', formData, { withCredentials: true })

    if (response.status === 200) {
      console.log('Response data:', response.data)

      // 백엔드로부터 받은 Base64 인코딩된 동영상 데이터를 디코딩하여 participant.videoFilePath에 저장합니다.
      participant.videoFilePath = "data:video/mp4;base64," + response.data.video
    } else {
      console.error(`Response ${response.status}: ${response.data.toString()}`)
    }
  } catch (error) {
    console.error(error)
  }
}
const isHovered = ref(false)

const handleMouseOver = participant => {
  participant.isHovered = true
}

const handleMouseLeave = participant => {
  participant.isHovered = false
}

const dialog = ref(false)


// 특정 참가자를 위한 dialog 상태관리
const openDialog = participant => {
  participant.dialog = true
}

const closeDialog = participant => {
  participant.dialog = false
}
</script>

<template>
  <VCol>
    <VRow>
      <!-- SECTION User Details -->
      <VCol v-for="(participant, index) in participantsData" :key="index" cols="3">
        <VCard>
          <VCardText class="text-center mt-12 mt-sm-0 pa-0">
            <!-- 👉 Avatar -->
            <VAvatar rounded="sm" :size="participant.isHovered ? 140 : 120"
              :color="!participant.PRO_FILEPATH ? 'primary' : undefined"
              :variant="!participant.PRO_FILEPATH ? 'tonal' : undefined" @click="openDialog(participant)"
              @mouseover="handleMouseOver(participant)" @mouseleave="handleMouseLeave(participant)">
              <VImg v-if="participant.PRO_FILEPATH && !participant.videoFilePath" :src="participant.PRO_FILEPATH"
                style="margin-top: 15px; margin-left: 35px;" />
              <VDialog v-model="participant.dialog" max-width="600px">
                <VCard>
                  <VImg v-if="!participant.videoFilePath" :src="participant.PRO_FILEPATH" />
                  <video v-else :src="participant.videoFilePath" autoplay loop />
                </VCard>
              </VDialog>
              <video v-if="participant.videoFilePath" :src="participant.videoFilePath" autoplay loop
                style=" width: 100%; height: 100%;margin-top: 15px; object-fit: cover;" />

              <span v-else class="text-5xl font-weight-medium">
                {{ avatarText(participant.ID) }}
              </span>
            </VAvatar>

            <!-- 👉 User fullName -->
            <VChip v-if="participant.CHALL_MANAGER === 'Y'" color="success" density="compact"
              style="margin-bottom: -10%;">
              방장
            </VChip>
            <VChip v-else color="info" density="compact" style="margin-bottom: -10%;">
              참여자
            </VChip>
            <h6 class="text-h6 mt-4">
              {{ participant.ID }}
            </h6>

            <!-- 👉 이행률 -->
            <VChip density="comfortable" class="text-capitalize mt-4" style=" margin-top: -5%;margin-bottom: 15px;"
              :color="resolveUserStatusVariant(((participant.CHALL_IMPLEMENTATION_RATE / (getHourDifference(new Date(cendDate), new Date(cstartDate)) / 24 * 3)) * 100).toFixed(0))">
              {{ ((participant.CHALL_IMPLEMENTATION_RATE / (getHourDifference(new Date(cendDate), new
                Date(cstartDate)) / 24 * 3)) * 100).toFixed(0) }}%
            </VChip>
          </VCardText>
        </VCard>
      </VCol>
      <!-- !SECTION -->
    </VRow>


    <!-- 👉 Edit user info dialog -->
    <UserInfoEditDialog v-model:isDialogVisible="isUserInfoEditDialogVisible" :user-data="props.userData" />

    <!-- 👉 Upgrade plan dialog -->
    <UserUpgradePlanDialog v-model:isDialogVisible="isUpgradePlanDialogVisible" />
  </vcol>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.75rem;
}

.current-plan {
  border: 2px solid rgb(var(--v-theme-primary));
}

.text-capitalize {
  text-transform: capitalize !important;
}

/* 마우스를 올렸을 때 큰 크기로 스타일을 변경함 */
.v-avatar:hover {
  transform: scale(1.1);
  transition: all 0.3s ease;
}
</style>
