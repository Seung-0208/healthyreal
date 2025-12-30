import { ref } from 'vue'

let transcript = ref('')
let isRecognizing = ref(false)
let recognition

//stt
if (!('webkitSpeechRecognition' in window)) {
  console.log('당신의 브라우저는 STT를 지원하지 않습니다.')
} else {
  recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)()
  recognition.lang = 'ko-KR'
  recognition.interimResults = true

  //음성 인식 시작
  recognition.onspeechstart = () => {
    console.log('Recognition Start!')
  }

  //음성인식 종료
  recognition.onspeechend = () => {
    console.log('Recognition Stop!')
    recognition.stop()
    isRecognizing.value = false
  }

  //결과
  recognition.onresult = event => {
    console.log('event.results:', event.results)
    transcript.value = Array.from(event.results).map(results => results[0].transcript).join("")

  }

  //에러
  recognition.onerror = event => {
    console.error('음성 인식 오류가 발생했습니다: ' + event.error)
  }
}


//음성인식 실행 함수
const startRecognition = () => {
  if (isRecognizing.value) {
    recognition.stop()
    isRecognizing.value = false
  } else {
    transcript.value = ''
    recognition.start()
    isRecognizing.value = true
  }
}

export { isRecognizing, startRecognition, transcript }

