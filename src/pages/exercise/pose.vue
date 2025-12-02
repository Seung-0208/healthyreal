<script setup>
import AppStepper from '@/@core/components/AppStepper.vue'
import axiosflask from '@/plugins/axiosflask'
import axios from '@axios'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const userId = computed(() => store.state.userStore.userInfo.id)


console.log('connectId', userId.value)

const time = ref(60)

const videoRef1 = ref('')
const videoRef2 = ref('')
const videoRef3 = ref('')

const player = ref(null)

const numberedSteps = [
  {
    title: '운동1',
    videoSrc: videoRef1.value,
  },
  {
    title: '운동2',
    videoSrc: videoRef2.value,
  },
  {
    title: '운동3',
    videoSrc: videoRef3.value,
  },
]

const exerciseSteps = ref([
  {
    title: '1set',
    subtitle: '10회',
  },
  {
    title: '2set',
    subtitle: '10회',
  },
  {
    title: '3set',
    subtitle: '10회',
  },
  {
    title: '4set',
    subtitle: '10회',
  },
  {
    title: '5set',
    subtitle: '10회',
  },
])

const videoUrl = ref('')


const currentExerciseStep = ref(0)  // 운동 단계를 추적하는 변수
const currentNumberedStep = ref(0)  // numberedSteps 단계를 추적하는 변수
const currentVideoSrc = ref('') // iframe에 표시될 현재 비디오의 URL

const isRestTime = ref(false)

const userVideoRef = ref(null)

const fileInput = ref(null)
const state = reactive({ videoLoaded: false })

let countDownInterval = null  // 카운트다운 인터벌 저장 변수
const setCount = ref(5)
const repetitionCount = ref(10)

const resetTimerAndSets = () => {
  time.value = 60
  setCount.value = 5
  repetitionCount.value = 10
  currentExerciseStep.value = 0
}



watch([setCount, repetitionCount], () => {
  exerciseSteps.value = Array.from({ length: setCount.value }, (_, i) => ({
    title: `${i + 1}set`,
    subtitle: `${repetitionCount.value}회`,
  }))
})


watch(currentNumberedStep, () => {
  console.log(`현재 단계: ${currentNumberedStep.value}`)

  const step = numberedSteps[currentNumberedStep.value]
  if (step) {
    // 여기서 직접 videoSrc를 업데이트합니다.
    switch (currentNumberedStep.value) {
      case 0:
        currentVideoSrc.value = videoRef1.value
        break
      case 1:
        currentVideoSrc.value = videoRef2.value
        break
      case 2:
        currentVideoSrc.value = videoRef3.value
        break
    }
  }
})

const UpdateExerciseSteps = () => {
  exerciseSteps.value = Array.from({ length: setCount.value }, (_, i) => ({
    title: `${i + 1}set`,
    subtitle: `${repetitionCount.value}회`,
  }))
}

const similarity = ref(null)
const video1Path = ref(null)
const video2Path = ref(null)

// 시작하기 버튼 클릭 이벤트에 연결된 메서드
const startExercise = async () => {
  let videoUrlToSend // 서버에 전송할 비디오 URL을 저장할 변수

  // 현재 선택된 운동 단계에 따라 비디오 URL 결정
  switch (currentNumberedStep.value) {
    case 0:
      videoUrlToSend = videoRef1.value // 운동1 선택 시
      break
    case 1:
      videoUrlToSend = videoRef2.value // 운동2 선택 시
      break
    case 2:
      videoUrlToSend = videoRef3.value // 운동3 선택 시
      break
    default:
      console.error('선택된 운동 단계가 유효하지 않습니다.')

      return // 에러 시 함수 종료
  }

  // 결정된 비디오 URL을 서버에 전송
  await sendServer(videoUrlToSend)
}


const getData = async () => {
  try {
    const response = await axios.post('/exer/getData.do', { id: userId.value })
    if (response.data) {
      videoRef1.value = response.data[0].evideoPath
      videoRef2.value = response.data[1].evideoPath
      videoRef3.value = response.data[2].evideoPath

      // 초기 비디오 URL 설정
      currentVideoSrc.value = videoRef1.value
    }
  } catch (error) {
    console.error('Error fetching video:', error)
  }
}

// sendServer 함수 수정 (videoUrl 파라미터 추가)
const sendServer = async videoUrl => {
  try {
    const response = await axiosflask.post('/PoseDetector', {
      video_url: videoUrl, // 함수 호출 시 전달받은 비디오 URL 사용
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log("비디오", videoUrl)

    // 서버 응답 처리 (예: 성공 메시지 출력 등)
    console.log('서버 응답:', response)
  } catch (error) {
    console.log("비디오", videoUrl)
    console.error('서버 전송 중 에러 발생:', error)
  }
}




const startTimer = async () => {

  // if (!player.value || typeof player.value.playVideo !== 'function') {
  //   console.error('YouTube 플레이어가 준비되지 않았습니다.')

  //   // 필요한 경우 여기에 재시도 로직을 구현할 수 있습니다.
  //   return
  // }

  // player.value.playVideo()
  countDownInterval = setInterval(() => {
    if (time.value > 0) {
      time.value--
    } else {
      if (isRestTime.value) {
        // 현재 휴식 시간이면 다음 세트로 넘어갑니다.
        currentExerciseStep.value++
        if (currentExerciseStep.value >= setCount.value) {
          // 모든 세트가 완료되면 타이머를 중지합니다.
          stopTimer()
          alert('운동이 모두 끝났습니다!')

          return
        }
        time.value = 60 // 운동 시간을 다시 60초로 설정합니다.
      } else {
        time.value = 30 // 휴식 시간을 30초로 설정합니다.
      }
      isRestTime.value = !isRestTime.value
    }
  }, 1000)
}

const stopTimer = () => {
  clearInterval(countDownInterval)
  videoRef1.value.pause()
  userVideoRef.value.pause()

}

//스위치
const toggleSwitch = ref('목록 on')
const toggleFalseSwitch = ref('목록 off')
const menuSize = ref('3')
const isVisible = ref(false)

const capitalizedLabel = label => {
  const convertLabelText = label.toString()

  console.log(convertLabelText.charAt(0).toUpperCase() + convertLabelText.slice(1))
  if (convertLabelText.charAt(0).toUpperCase() + convertLabelText.slice(1) == 'True') {
    console.log('true')
    menuSize.value = 3
    isVisible.value = true
  }
  else {
    console.log('false')

    //menuSize.value = 0
    isVisible.value = false
  }
}


// 운동 목록에서 항목을 클릭했을 때 호출될 메소드입니다.
function selectStep(index) {
  currentNumberedStep.value = index
}







onMounted(async () => {
  await getData()


})
</script>

<template>
  <VContainer>
    <!-- fluid 속성 추가 -->
    <VRow>
      <VCol v-show="isVisible" :style="{ 'opacity': '0.7', 'position': 'relative' }">
        <!--
          <VDialog
          v-model="isVisible"
          :style="{'width':'100%'}"
          >
        -->
        <VCard>
          <!-- 운동 순서에 대한 메뉴창 -->
          <VCardItem>
            <AppStepper v-model:current-step="currentExerciseStep" direction="horizontal" :items="exerciseSteps"
              :style="{ 'height': '100%' }" />

            <VCardItem :style="{ 'margin-top': '10px' }">
              <VCol style="margin-bottom: -20px;">
                <VRow align="center">
                  <VCol cols="3">
                    <strong style="width: 90%; color: black; font-size: 25px;">
                      <VIcon icon="mdi-clock-time-eight" />
                      {{ isRestTime ? 'Rest time' : 'Exercise' }} <!-- 휴식 시간인지 운동 시간인지 표시 -->
                    </strong>
                  </VCol>
                  <VCol cols="3">
                    <strong id="sec" style="color: black;font-size: 25px;">
                      {{ time }}
                    </strong>
                  </VCol>
                  <VCol cols="2">
                    <VTextField v-model.number="setCount" type="number" label="세트 수" variant="outlined"
                      @input="UpdateExerciseSteps" />
                  </VCol>
                  <VCol cols="2">
                    <VTextField v-model.number="repetitionCount" type="number" label="횟수" variant="outlined"
                      @input="UpdateExerciseSteps" />
                  </VCol>
                  <VCol cols="1">
                    <VBtn @click="startTimer">
                      시작하기
                    </VBtn>
                  </VCol>
                  <VCol cols="1">
                    <VBtn @click="stopTimer">
                      중지
                    </VBtn>
                  </VCol>
                </VRow>
                <br>
                <hr :style="{ 'width': '90%', 'margin': 'auto' }">
              </vcol>
            </VCardItem>
          </vcarditem>
        </VCard>
        <!-- </VDialog> -->
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <VLayout class="chat-app-layout bg-surface">
          <VCol cols="2" :style="{ 'background-color': '#FFFFF2' }">
            <!-- 몇 세트인지에 대한 메뉴창 -->
            <VSwitch v-model="toggleSwitch" :label="capitalizedLabel(toggleSwitch)" />
            <p>시간 측정 시작하기</p>

            <AppStepper v-model:current-step="currentNumberedStep" direction="vertical" :items="numberedSteps"
              :style="{ 'height': '80%' }" />
            <VBtn color="primary" class="custom-margin" @click="startExercise">
              자세 측정
            </VBtn>
          </VCol> <!-- 몇 세트인지에 대한 메뉴창 end -->

          <!--  운동 순서에 대한 메뉴창 end -->
          <div class="responsive-iframe-container">
            <div v-for="(step, index) in numberedSteps" :key="index" @click="selectStep(index)" />
            <VCol cols="5">
              <!-- <VCol :cols="9-menuSize"> -->
              <!-- 운동 자세 영상 -->
              <iframe id="player" :src="currentVideoSrc" class="iframe" frameborder="0" allowfullscreen />
            </VCol> <!-- 운동 자세 영상 end -->
          </div>
          <VCol cols="5">
            <!-- <VCol :cols="9-menuSize"> -->
          </VCol>
        </VLayout>
      </vcol>
    </VRow>
  </VContainer>
</template>

<style lang="scss">
@use "@styles/variables/_vuetify.scss";
@use "@core/scss/base/_mixins.scss";
@use "@layouts/styles/mixins" as layoutsMixins;

// Variables
$chat-app-header-height: 68px;

// Placeholders
%chat-header {
  display: flex;
  align-items: center;
  min-block-size: $chat-app-header-height;
  padding-inline: 1rem;
}

.chat-app-layout {
  border-radius: vuetify.$card-border-radius;

  @include mixins.elevation(vuetify.$card-elevation);

  $sel-chat-app-layout: &;

  @at-root {
    .skin--bordered {
      @include mixins.bordered-skin($sel-chat-app-layout);
    }
  }

  .active-chat-user-profile-sidebar,
  .user-profile-sidebar {
    .v-navigation-drawer__content {
      display: flex;
      flex-direction: column;
    }
  }

  .chat-list-header,
  .active-chat-header {
    @extend %chat-header;
  }

  .chat-list-search {
    .v-field__outline__start {
      flex-basis: 20px !important;
      border-radius: 28px 0 0 28px !important;
    }

    .v-field__outline__end {
      border-radius: 0 28px 28px 0 !important;
    }

    @include layoutsMixins.rtl {
      .v-field__outline__start {
        flex-basis: 20px !important;
        border-radius: 0 28px 28px 0 !important;
      }

      .v-field__outline__end {
        border-radius: 28px 0 0 28px !important;
      }
    }
  }

  .chat-list-sidebar {
    .v-navigation-drawer__content {
      display: flex;
      flex-direction: column;
    }
  }
}

.chat-content-container {
  background-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));

  // Adjust the padding so text field height stays 48px
  .chat-message-input {
    .v-field__append-inner {
      align-items: center;
      padding-block-start: 0;
    }

    .v-field--appended {
      padding-inline-end: 6px;
    }
  }
}

.chat-user-profile-badge {
  .v-badge__badge {
    /* stylelint-disable liberty/use-logical-spec */
    min-width: 12px !important;
    height: 0.75rem;
    /* stylelint-enable liberty/use-logical-spec */
  }
}

.dropzone {
  display: flex;
  width: 330px;
  height: 450px;
  align-items: center;
  justify-content: center;
  border: 2px dashed #000;
  cursor: pointer;
}

.iframe {
  position: relative;
  /* 상위 요소 대비 상대적 위치 */
  top: 0;
  /* 상위 요소 대비 상단에서 50px 아래에 위치 */
  left: -40px;
  /* 상위 요소 대비 왼쪽에서 20px 옆에 위치 */
  display: block;
  /* Block-level 요소로 만들어 줌 */
  width: 1170px;
  /* 너비 조정 */
  height: 600px;
  /* 높이 조정 */
  border: 2px solid #000;
  /* 테두리 추가 */
  margin: 0 auto;
  /* 가운데 정렬을 위해 사용 */
}

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

.custom-margin {
  margin-left: 35px;
  /* 원하는 마진 크기로 조정하세요 */
}
</style>
