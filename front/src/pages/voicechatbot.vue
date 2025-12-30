<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'


let messages = ref([{ role: 'system', content: 'You are Helthy-Real\'s customer service chatbot.' }])
let chatgpt = ref('')
let selectedVoice = ref(null)
let transcript = ref('')
let isRecognizing = ref(false)
let recognition
let voices = ref([])
let ttsText = ref('')
const API_KEY = import.meta.env.VITE_APP_OPENAI_API_KEY

console.log("api-key", import.meta.env.VITE_SOME_KEY)
console.log("api-key", import.meta.env.VITE_APP_OPENAI_API_KEY)
console.log("api-key", API_KEY )

//stt
if (!('webkitSpeechRecognition' in window)) {
  console.log('당신의 브라우저는 STT를 지원하지 않습니다.')
} else {
  recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)()
  recognition.lang = 'Microsoft Heami - Korean (Korean)', 'Google US English'
  recognition.interimResults = true

  recognition.onspeechstart = () => {
    console.log('Recognition Start!')
  }

  recognition.onspeechend = () => {
    console.log('Recognition Stop!')
    recognition.stop()
    isRecognizing.value = false
  }

  recognition.onresult = async event => {
    console.log('event.results:', event.results)
    transcript.value = Array.from(event.results).map(results => results[0].transcript).join("")

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
      // ChatGPT 응답 받기 시작
        try {
          await sendToChatGPT(transcript.value) // 음성 인식 결과를 OpenAI API에 전송
        } catch (error) {
          console.error('ChatGPT에 요청 중 오류가 발생했습니다:', error)
        }
      }
    }
  }

  recognition.onerror = event => {
    console.error('음성 인식 오류가 발생했습니다: ' + event.error)
  }
}

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

const sendToChatGPTWithInput = async () => {
  try {
    const userInput = document.getElementById('input-tts').value // 텍스트 필드에서 값을 가져옴

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are Helthy-Real\'s customer service chatbot.' },
        { role: 'user', content: userInput },
      ],
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
    }, console.log(API_KEY))

    chatgpt.value = response.data.choices[0].message.content
    messages.value.push({ role: 'assistant', content: chatgpt.value })
    startSynthesis() // 응답을 TTS로 읽기 시작
  } catch (error) {
    console.error('API 요청 중 오류가 발생했습니다:', error)
  }
}


//tts
const sendToChatGPT = async transcript => {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are Helthy-Real\'s customer service chatbot.' },
        { role: 'user', content: transcript },
      ],
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
    }, console.log(API_KEY))

    chatgpt.value = response.data.choices[0].message.content
    messages.value.push({ role: 'assistant', content: chatgpt.value })
    startSynthesis()
  } catch (error) {
    console.error('API 요청 중 오류가 발생했습니다:', error)
  }
}

// TTS functions
let synthesis, utterance, loadVoices, startSynthesis, stopSynthesis

if ('speechSynthesis' in window) {
  synthesis = window.speechSynthesis
  utterance  = new SpeechSynthesisUtterance()

  loadVoices = function() {
    return new Promise(resolve => {
      let voiceList = window.speechSynthesis.getVoices()
      if (voiceList.length !== 0) {
        voices.value = voiceList.map(voice => ({ text: voice.name, value: voice.voiceURI }))
        console.log('Loaded voices: ', voices.value) // 로드된 음성 목록 출력
        console.log('voiceList: ', voiceList)
        resolve()
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          voiceList = window.speechSynthesis.getVoices()
          voices.value = voiceList.map(voice => ({ text: voice.name, value: voice.voiceURI }))
          console.log('Loaded voices: ', voices.value.value) // 로드된 음성 목록 출력
          resolve()
        }
        window.speechSynthesis.getVoices() // 음성 목록을 불러오는 코드 추가
      }
    })
  }

  window.speechSynthesis.onvoiceschanged = loadVoices

  startSynthesis = function() {
    ttsText.value = chatgpt.value
    utterance.text = ttsText.value
    if (selectedVoice.value) {
      utterance.voiceURI = selectedVoice.value
    }
    window.speechSynthesis.speak(utterance)
  }

  stopSynthesis = function() {
    window.speechSynthesis.cancel()
  }
} else {
  console.error('Web Speech API not supported')
}

// Load voices when component is mounted
onMounted(async () => {
  window.speechSynthesis.onvoiceschanged = async () => {
    await loadVoices()

    let voice = voices.value.find(voice => voice.text.includes('Microsoft Heami - Korean (Korean)', 'Google US English'))
    console.log('voice.value: ', voices.value) // voice 변수가 정의된 이후에 console.log 호출

    if (voice) { 
      selectedVoice.value = voice.text 
    } else {
      console.log('Korean voice not found')
    }
  }
  window.speechSynthesis.getVoices() // 음성 목록을 가져오는 요청을 시작합니다.
})
</script>

<template>
  <VCard title="음성 챗봇 CCH 1.0">
    <VCardText>
      <VRow>
        <VCol cols="12">
          <VTextField
            id="result"
            v-model="transcript"
            label="아래 버튼 클릭후 말씀해 주세요"
            readonly
            placeholder="아래 버튼 클릭후 말씀해 주세요"
          />
        </VCol>
        <VCol cols="12">
          <VBtn
            id="startBtn"
            class="btn-lg btn-dark"
            @click="startRecognition"
          >
            SpeechToText Start
          </VBtn>
        </VCol>
        <VCol cols="12">
          <VTextField
            id="chat-gpt"
            v-model="chatgpt"
            placeholder="여기에 응답이 표시됩니다"
            readonly
          />
        </VCol>
        <VCol cols="12">
          <VSelect
            id="voice"
            v-model="selectedVoice"
            :items="voices.value"
            label="음성을 선택하세요"
            item-text="text"
            item-value="text"
          />
        </VCol>
        <VCol cols="12">
          <VTextField
            id="input-tts"
            v-model="ttsText"
            label="TTS에 사용할 텍스트를 입력하세요"
          />
        </VCol>
        <VCol cols="12">
          <VBtn
            id="startTtsBtn"
            class="btn-lg btn-dark mb-1"
            @click="sendToChatGPTWithInput"
          >
            TextToSpeech Start
          </VBtn>
          <VBtn
            id="stopTtsBtn"
            class="btn-lg btn-dark mb-1"
            @click="stopSynthesis"
          >
            TextToSpeech Stop
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>


