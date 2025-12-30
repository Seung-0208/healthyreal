<script setup>
import axios from '@/plugins/axiosflask'
import { onUpdated, ref } from 'vue'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:isDialogVisible'])

const dialogVisibleUpdate = val => {
  emit('update:isDialogVisible', val)
}


let isLoading = ref(true)  // 로딩 상태를 나타내는 데이터 추가
const crawlingData=ref("")
const matearea = ref("")  // 검색할 지역
const matemonth = ref("")  // 검색할 월
const matedate = ref("")  // 검색할 일자

const mateareaerr = ref('')
const matemontherr = ref('')
const matedateerr = ref('')
const searchList = ref(['서울', '부산', '인천', '대전', '광주', '대구', '울산', '세종', '경기', '충북', '충남', '전북', '전남', '경북', '경남', '강원', '제주', '제주', '경기'])

const validatematearea = value => {
  const userInput = value // 사용자 입력값

  if (searchList.value.includes(userInput)) {
    mateareaerr.value = '검색 가능!'
  } else {
    mateareaerr.value = '검색 가능한 지역명으로 입력해주세요.'
  }
}

const validatematemonth = () => {
  const currentMonth = new Date().getMonth() + 1 //현재 월
  const userInput = matemonth.value // 사용자 입력값
  
  if(currentMonth <= userInput){
    matemontherr.value = '검색 가능!'
  }else{
    matemontherr.value = '현재 ' + currentMonth+'부터 12월까지 입력가능합니다.'
  }
}

const validatematedate = () => {
  const currentMonth = new Date().getMonth() + 1 //현재 월
  const currentDate = new Date().getDate()//현재 일자
  const userInput = matedate.value // 사용자 입력값
  const userInputmonth = matemonth.value // 사용자 입력값
  const month31List = ['1', '3', '5', '7', '8', '10', '12']

  if(currentMonth == userInputmonth && currentDate > userInput){
    matedateerr.value = '현재보다 이전 날짜는 입력이 불가합니다.'
  }else{
    if (userInputmonth === '2') {//2월은 윤년 체크
      const currentYear = new Date().getFullYear()
      const isLeapYear = (currentYear % 4 === 0 && currentYear % 100 !== 0) || currentYear % 400 === 0

      if (isLeapYear) {
        if (userInput >= 1 && userInput <= 29) {
          matedateerr.value = '검색 가능!'
        } else {
          matedateerr.value = '1부터 29까지의 값을 입력해주세요.'
        }
      } else {
        if (userInput >= 1 && userInput <= 28) {
          matedateerr.value = '검색 가능!'
        } else {
          matedateerr.value = '1부터 28까지의 값을 입력해주세요.'
        }
      }
    } else if(month31List.includes(userInputmonth)){
      if (userInput >= 1 && userInput <= 31) {
        matedateerr.value = '검색 가능!'
      } else {
        matedateerr.value = '1부터 31까지의 값을 입력해주세요.'
      } 
    }else {
      if (userInput >= 1 && userInput <= 30) {
        matedateerr.value = '검색 가능!'
      } else {
        matedateerr.value = '1부터 30까지의 값을 입력해주세요.'
      } 
    }
  }
}

//유효성에 따른 버튼 활성화 함수
function checkValidity() {
  return matemontherr.value === '검색 가능!' && matedateerr.value === '검색 가능!'
}

// 크롤링 함수
function startCrawling(matearea, matemonth, matedate){
  crawlingData.value=""
  isLoading.value = true
  try{        
    axios.post('/areaCrawling', { matearea: matearea, matemonth: parseInt(matemonth), matedate: parseInt(matedate) })
      .then(response => {
        // 서버로부터의 응답 처리
        console.log(response.data)//JSON.parse()
        crawlingData.value = response.data
      })
      .catch(error => { 
        // 에러 처리
        console.error(error)
      },
      )
  }catch (e) {
    console.error(e)
  }
  finally {
    isLoading.value = false  // 요청 완료 후에 로딩 상태를 false로 설정
  }
}

function btnaction(){
  if(checkValidity){
    startCrawling(matearea, matemonth, matedate)
  }
}

// Vue 컴포넌트에서 이진 데이터를 Base64로 인코딩하는 함수
function encodeToBase64(binaryData) {
  const base64Data = btoa(String.fromCharCode(...new Uint8Array(binaryData)))
  
  return `data:image/png;base64,${base64Data}`
}
</script>


<template>
  <VDialog
    :model-value="props.isDialogVisible"
    max-width="900"
    persistent  
    @update:model-value="dialogVisibleUpdate"
  >
    <VCard class="share-project-dialog pa-5 pa-sm-8">
      <!-- 👉 dialog close btn -->
      <DialogCloseBtn
        variant="text"
        size="small"
        @click="emit('update:isDialogVisible', false)"
      />
      <VCard
        cols="12"
        class="d-flex"
        style="margin-right: 10px;magin-left: 10px;"
      >
        <VCol>
          <VSelect
            v-model="matearea"
            :items="searchList"
            label="지역을 선택해주세요"
            placeholder="지역을 선택해주세요"
            @change="validatematearea(matearea)"
          />
          <div :style="{ color: mateareaerr ? (mateareaerr === '검색 가능!' ? 'green' : 'red') : '', fontSize: 'smaller' }">
            {{ mateareaerr }}
          </div>
        </VCol>
        <VCol>
          <VTextField
            id="matemonth"
            v-model="matemonth"
            style="margin-left: 15px;"
            placeholder="월 입력"
            @input="validatematemonth('matemonth')"
          />
          <!-- 입력 변경시 마다 유효성 검사 호출 -->
          <div :style="{ color: matemontherr ? (matemontherr === '검색 가능!' ? 'green' : 'red') : '' , fontSize: 'smaller'}">
            {{ matemontherr }}
          </div>
        </VCol>
        <VCol>
          <VTextField
            id="matedate"
            v-model="matedate"
            style="margin-left: 15px;"
            placeholder="일자 입력"
            @input="validatematedate('matedate')"
          />
          <!-- 입력 변경시 마다 유효성 검사 호출 -->
          <div :style="{ color: matedateerr ? (matedateerr === '검색 가능!' ? 'green' : 'red') : '' , fontSize: 'smaller'}">
            {{ matedateerr }}
          </div>
        </VCol>
        <!-- <VCol> -->
        <VBtn
          :disabled="!checkValidity()" 
          style=" margin-top: 20px; margin-right: 5px;margin-left: 15px;"
          @click="startCrawling(matearea,matemonth,matedate)"
        >
          검색
        </VBtn>
        <!-- </VCol> -->
      </VCard>
      <br>
      <div class="image-container">
        <VRow v-if="!crawlingData">
          <VProgressCircular
            v-if="!isLoading"
            class="loading"
            indeterminate
            color="primary"
          />
        </VRow>
        <VRow v-else>
          <VCol
            v-for="data in crawlingData"
            :key="data.index"
            cols="4"
          >
            <VCard cols="12">
              <VCol
                cols="12"
                style=" display: flex;flex-wrap: wrap; align-items: center; justify-content: center;"
              >
                <img
                  :src="data.src"
                  alt="이미지"
                  style="width: 300px;height: 200px;object-fit: cover;"
                >
              </VCol>
              <VCol
                cols="12"
                style="height: 50px;"
              >
                <a
                  :href="data.link"
                  class="my-custom-button"
                >{{ data.title }}</a>
              </VCol>
              <VCol cols="12">
                요금 : {{ data.pay }}         
              </VCol>
              <!-- 금액 : {{data.pay}}  -->
              <!-- </VCardItem> -->
            </VCard>
          </VCol>
        </VRow>
      </div>
    </VCard>
  </VDialog>
</template>
  
  <style scoped>
.image-container {
  position: relative;
  overflow: visible;  /* 이미지 크기 제한 풀기 */
  block-size: 500px;
  inline-size: 100%;
}

.loading {
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  transform: translate(-50%, -50%);
}
</style>
<!-- 
  <style>
  .my-custom-button {
  overflow: hidden;
  max-inline-size: 90%;
  text-overflow: ellipsis;
  white-space: nowrap;
  }
  </style> 
-->
