<script setup>
import axios from '@/plugins/axiosflask'
import { onMounted, ref } from 'vue'

// 로그인 스토어와 사용자 스토어의 상태를 가져옵니다.
import { useStore } from 'vuex'

const store = useStore()
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = ref('')

const weather = ref({})
const code = ref('')
const temp = ref(0)
const location = ref('')
const userAddress = ref('')

const getuseraddress = () => {
  if (!userInfo.value) {
    console.log('userInfo.value is null')

    return
  }

  connetId.value = userInfo.value.id
  let params = new URLSearchParams()

  params.append('id', connetId.value)

  axios.get('/getUserAddress', { params })
    .then(response => {
      console.log('받은 정보:', response.data)
      userAddress.value = response.data.user_address

      // console.log('주소:', userAddress.value)

      const addressArray = userAddress.value.split(' ')
      if (addressArray.length === 0) {
        location.value = '서울'
      }
      else if (addressArray[1] === '서울' || addressArray[1] === '부산' || addressArray[1] === '울산') {
        location.value = addressArray[1].trim()
      }
      else {
        location.value = addressArray[2].trim()

        // 시나 군으로 끝나면 맨 뒤 글자 제거
        if (location.value.endsWith('시') || location.value.endsWith('군')) {
          location.value = location.value.slice(0, -1)
        }
      }

      const data = {
        location: location.value,
      }

      axios.post('/weatherInfo', data)
        .then(response => {
          const result = response.data

          // console.log('날씨 정보:', result)
          weather.value = result
          temp.value = result.main.temp
          code.value = result.weather[0].id.toString()
        })
    })
    .catch(error => {
      console.error('오류 발생:', error)
    })
}


// 날씨 표현 시 사용될 icon 배열
const icons = [
  'mdi-weather-lightning-rainy', // 2xx : Thunderstorm
  'mdi-weather-rainy', // 3xx : Drizzle
  'mdi-weather-pouring', // 5xx : Rain
  'mdi-weather-snowy', // 6xx : Snowa
  'mdi-weather-fog', // 7xx : Atmosphere
  'mdi-weather-sunny', // 800 : Clear
  'mdi-weather-cloudy', // 8xx : Clouds
]

onMounted(() => {
  // userInfo.value가 설정될 때까지 기다림
  watch(userInfo, newVal => {
    if (newVal) {
      getuseraddress()

      // 10분마다 실행
      setInterval(() => {
        getuseraddress()
      }, 3600000) // 10분은 600000밀리초입니다.
    }
  }, { immediate: true }) // 초기 값에 대해서도 반응
})
</script>


<template>
  <div id="weather">
    <!-- 날씨 정보가 있을 경우 -->
    <div v-if="typeof weather.main != 'undefined'" class="d-flex align-center flex-wrap mt-4 mb-4">
      <div style="margin-right: 8px;">
        <strong>{{ location }}</strong>
      </div>
      <div style="margin-right: 8px;">
        <div>
          <!-- Clear -->
          <VIcon v-if="code == 800" color="error">
            {{ icons[5] }}
          </VIcon>
          <!-- Thunderstorm -->
          <VIcon v-else-if="code.substr(0, 1) == 2" color="#FFD700">
            {{ icons[0] }}
          </VIcon>
          <!-- Drizzle -->
          <VIcon v-else-if="code.substr(0, 1) == 3" color="info">
            {{ icons[1] }}
          </VIcon>
          <!-- Rain -->
          <VIcon v-else-if="code.substr(0, 1) == 5" color="#4169E1">
            {{ icons[2] }}
          </VIcon>
          <!-- Snow -->
          <VIcon v-else-if="code.substr(0, 1) == 6" color="#6A5ACD">
            {{ icons[3] }}
          </VIcon>
          <!-- Atmosphere -->
          <VIcon v-else-if="code.substr(0, 1) == 7" color="#C0C0C0">
            {{ icons[4] }}
          </VIcon>
          <!-- Clouds -->
          <VIcon v-else color="#C0C0C0">
            {{ icons[6] }}
          </VIcon>
        </div>
      </div>
      <div>
        <strong>{{ Math.round(temp) }}℃</strong>
      </div>
    </div>
    <!-- 날씨 정보가 없을 경우 -->
    <div v-else>
      <div>
        <VIcon>mdi-cancel</VIcon>
      </div>
      <div>
        {{ weather.cod }}
      </div>
    </div>
  </div>
</template>

<style scoped>
#weather {
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
