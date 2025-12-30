<script setup>
import axiosflask from '@/plugins/axiosflask'
import { defineProps, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  video: {
    type: String,
    required: true,
  },
})

const videoElement = ref(null)
let stream = null // 스트림을 저장할 변수

onMounted(async () => {
  // 페이지 로드 시 자동으로 웹캠을 시작하지 않음
})

const startWebcam = async () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoElement.value) {
        videoElement.value.srcObject = stream;
      }

      const response = await axiosflask.post('/PoseDetector', {
        video_url: "https://www.youtube.com/embed/9Rj6qd3vPBE",
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("유사도: ", response.data.average_similarity);
    } catch (error) {
      console.error('웹캠에 접근할 수 없습니다:', error);
    }
  }
};


const stopWebcam = () => {
  if (stream) {
    const tracks = stream.getTracks()

    tracks.forEach(track => track.stop())
  }
}

onUnmounted(() => {
  stopWebcam() // 컴포넌트가 언마운트 될 때 웹캠 정지
})
</script>

<template>
  <div>
    <button @click="startWebcam">
      웹캠 시작
    </button>
    <button @click="stopWebcam">
      웹캠 종료
    </button>
    <video ref="videoElement" autoplay playsinline
      style="position: absolute; bottom: 0; left: 820px; width: 500px; height: 500px;object-fit: cover;"
      class="videoStyle" />
  </div>
</template>

<style>
/* 기본 스타일 */
.videoStyle {
  position: absolute;
  block-size: 500px;
  inline-size: 500px;
  inset-block-end: 0;
  inset-inline-start: 820px;
  /* 기본 위치 */
  object-fit: cover;
}

/* 화면 너비가 1024px 이하일 때 */
@media (max-width: 1024px) {
  .videoStyle {
    inset-inline-start: 50%;
    /* 화면 중앙에 위치하도록 조정 */
    transform: translateX(-40%);
    /* 정확히 중앙에 오도록 조정 */
  }
}

/* 화면 너비가 768px 이하일 때 */
@media (max-width: 768px) {
  .videoStyle {
    block-size: auto;
    /* 비율 유지를 위해 자동으로 높이 조정 */
    inline-size: 100%;
    /* 화면 너비에 맞춰 조정 */
    inset-block-end: 0;
    inset-inline-start: 0;
  }
}
</style>
