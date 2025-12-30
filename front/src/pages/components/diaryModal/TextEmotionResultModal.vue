<script setup>
import { defineEmits, onUpdated, ref } from 'vue'

const props = defineProps(["result", "diary", "urls"])

const emit = defineEmits(['update:submitEvent'])

const isDialogVisible = defineModel()

console.log('자식 컴포넌트:', isDialogVisible)
console.log('부모 컴포넌트의 값 확인:', typeof props.result.score)
console.log('일기장 값:', props.diary)


const btnIcons = [
  {
    icon: 'mdi-emoticon-cry',
    value: 0,
  },
  {
    icon: 'mdi-emoticon-sad',
    value: 1,
  },
  {
    icon: 'mdi-emoticon-neutral',
    value: 2,
  },
  {
    icon: 'mdi-emoticon-excited',
    value: 3,
  },
  {
    icon: 'mdi-emoticon-cool',
    value: 4,
  },
]

const previousBtn = ref(null)
const selectedBtn = ref()
const btnSize = ref('40') // 버튼 크기 설정

const selectButton = value => {
  previousBtn.value = selectedBtn.value
  selectedBtn.value = value
}

const getButtonColor = value => {
  if (selectedBtn.value === value) {
    switch (value) {
    case 0:
      return '#FF4500' // Angry - 오렌지레드
    case 1:
      return '#FF8C00' // Sad - 다크오렌지
    case 2:
      return '#FFD700' // Neutral - 노란색
    case 3:
      return '#7CFC00' // Excited - 초록색
    case 4:
      return '#00BFFF' // Cool - 딥스카이블루
    default:
      return '#E6E6FA' // 기본 대기중 색상
    }
  }
  else {
    return '#E6E6FA'
  }
}

onUpdated(()=>{
  const score = props.result.score

  console.log('일기장 값:', props.diary)
  console.log('사진값:', props.urls)
  console.log(score)
  if (typeof score != 'undefined') {
    if (-1 <= score && score <=-0.6) {
      console.log('score:', score)
      selectButton(btnIcons[0].value)
      getButtonColor(btnIcons[0].value)
    }
    else if (-0.6 < score && score <=-0.2) {
      console.log('score:', score)
      selectButton(btnIcons[1].value)
      getButtonColor(btnIcons[1].value)
    }
    else if (-0.2 < score && score <=0.2) {
      console.log('score:', score)
      selectButton(btnIcons[2].value)
      getButtonColor(btnIcons[2].value)
    }
    else if (0.2 < score && score <=0.6) {
      console.log('score:', score)
      selectButton(btnIcons[3].value)
      getButtonColor(btnIcons[3].value)
    }
    else {
      selectButton(btnIcons[4].value)
      getButtonColor(btnIcons[4].value)
    }
  }
})

const buttonController = isSubmit => {
  if(isSubmit) {
    // 감정 점수에 따라 숫자 매핑
    let emotionNumber = 2 // 기본값 (neutral)
    const score = props.result.score
    
    if (score <= -0.6) {
      emotionNumber = 0 // 매우 부정적
    } else if (score <= -0.2) {
      emotionNumber = 1 // 부정적
    } else if (score <= 0.2) {
      emotionNumber = 2 // 중립
    } else if (score <= 0.6) {
      emotionNumber = 3 // 긍정적
    } else {
      emotionNumber = 4 // 매우 긍정적
    }
    
    emit("update:submitEvent", emotionNumber)
  }
  isDialogVisible.value = false
}
</script>

<template>
  <!-- 로딩용 -->
  <VDialog
    v-model="isDialogVisible"
    persistent
    class="v-dialog-sm"
  >
    <!-- Dialog Content -->
    <VCard>
      <VCardText class="text-h6">
        <VIcon icon="mdi-chart-tree" />
        감정 분석 결과입니다
        <VTooltip
          location="top"
          activator="parent"
        >
          <span>결과가 느끼는 감정과 다르다면 수정할 수 있습니다</span>
        </VTooltip>
      </VCardText>
      
      <DialogCloseBtn
        variant="text"
        size="small"
        @click="isDialogVisible = false"
      />
      <VRow :style="{'display':'flex', 'justify-content':'center'}">
        <VCol 
          v-for="(icon, index) in btnIcons" 
          :key="index"
          :style="{'display':'flex','justify-content':'center'}"
          cols="2"
        >
          <VBtn
            :icon="icon.icon"
            :size="btnSize"
            :color="getButtonColor(icon.value)"
            @click="selectButton(icon.value)"
          />
        </VCol>
      </VRow>
      <VCol>
        <VCardText>
          {{ props.result.answer }}
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn
            color="secondary"
            @click="buttonController(false)"
          >
            돌아가기
          </VBtn>
          <VBtn
            color="success"
            @click="buttonController(true)"
          >
            등록
          </VBtn>
        </VCardActions>
      </VCol>
    </VCard>
  </VDialog>
</template>
