<script setup>
import AppDateTimePicker from '@/@core/components/app-form-elements/AppDateTimePicker.vue'
import axios from '@axios'
import DiaryView from '@images/cards/diaryView.png'
import { ref, computed, onMounted } from 'vue'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { useStore } from 'vuex'

// const props = defineProps({
//   imgUrls: {
//     type: Array,
//     required: true,
//   },
// })

const imgUrls = ref([]) //이미지 가져오는 변수

const store = useStore()
const biggeImgFile = ref(false)
const imageSize = ref(null) //이미지 마우스 올릴 때 이벤트를 위한 변수
const submitBtn = ref(false)
const writeDiaryContent = ref(false)
const selectedBtn = ref()

const date = ref(new Date()) // 날짜를 담을 변수
const todayLabel = ref(getTodayLabel()) // 오늘 날짜를 포맷팅하여 담을 변수

function getTodayLabel() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

const clickedImageUrl = ref('')

const handleImageClick = url => {
  clickedImageUrl.value = url // Set the clicked image URL
  biggeImgFile.value = true // Set biggeImgFile to true
  console.log(clickedImageUrl.value)
}

// 마우스 올릴 때
const handleMouseOver = index => {
  imageSize.value = index // Set the index of the hovered image
}

//마우스 떠날 때
const handleMouseLeave = () => {
  imageSize.value = null // Reset the index to null when mouse leaves
}

const emojiResult = score => {
  var emoji = {}
  if(score != null) {
    if (-1 <= score.value && score.value <=-0.6) {
      emoji['emoticon'] = "mdi-emoticon-cry"
      emoji['color'] = 'error'
    }
    else if (-0.6 < score.value && score.value <=-0.2) {
      emoji['emoticon'] = "mdi-emoticon-sad"
      emoji['color'] = 'warning'
    }
    else if (-0.2 < score.value && score.value <=0.2) {
      emoji['emoticon'] = "mdi-emoticon-neutral"
      emoji['color'] = 'secondary'
    }
    else if (0.2 < score.value && score.value <=0.6) {
      emoji['emoticon'] = "mdi-emoticon-excited"
      emoji['color'] = 'success'
    }
    else {
      emoji['emoticon'] = "mdi-emoticon-cool"
      emoji['color'] = 'info'
    }
  }
  else {
    emoji['emoticon'] = "mdi-close"
    emoji['color'] = 'primary'
  }
  
  return emoji
}

//다이어리에 뿌려줄 값
const score = ref(0) //긍부정 지수
const emoji = ref({}) //뿌려줄 이모지 및 색
const emotionTooltip = ref('') //tooltip에 뿌려줄 내용

const moveToWritePage = `console.log('버튼 클릭됨')`

const showDiary = diaryId => { //다이어리 내용 불러오는 함수
  const diaryShowTag = document.getElementById("diary")

  axios("/manage/diary", { params: { userNDate: diaryId } })
    .then(resp => {
      console.log('typeof 받아온 값', typeof resp.data)
      score.value = resp.data.stress
      emoji.value = emojiResult(score.value)
      if (typeof resp.data == 'string') {
        diaryShowTag.innerHTML = `<button onclick="${moveToWritePage}" class="v-btn v-theme--light text-success v-btn--density-default v-btn--size-default v-btn--variant-plain">작성된 내용이 없습니다.</button>`
        emotionTooltip.value = '작성된 내용이 없습니다'
      }
      else {
        emotionTooltip.value = `score값 : ${score.value}`
        imgUrls.value = resp.data.imgUrls //다이어리 이미지 뿌려주기
        diaryShowTag.innerHTML = resp.data.diary_content //다이어리 텍스트 뿌려주기
      }
    })
    .catch(err=>console.error(err))
}



//날짜에 맞는 데이터를 가져오기 위한 코드
const userInfo = computed(() => store.state.userStore.userInfo)
const userId = ref(userInfo.value.id)

const dateVal = todayLabel.value.replace(/-/g, '')+'-'+userId.value

showDiary(dateVal)

onMounted(()=>{ //처음 다이어리 상세보기 페이지 들어갔을 때 실행되는 코드
  const dateTag = document.getElementById("date").children[0]
  var dateVal = todayLabel.value.replace(/-/g, '')+'-'+userId.value
  console.log("dateTag", dateTag)
  console.log('오늘날짜 dateVal:', dateVal)
  showDiary(dateVal)
  dateTag.addEventListener('change', ()=>{ //클릭 이벤트 발생 시 실행되는 코드
    const dateTag = document.getElementById("date").children[0]
    
    dateVal = dateTag.value.replace(/-/g, '')+'-'+userId.value
    console.log('날짜 변경 dateVal:', dateVal)
    showDiary(dateVal)
  })
  
})
</script>

<template>
  <VRow>
    <VCol cols="12">
      <!-- Diary 시작 -->
      <VCard align="center">
        <!-- 일기 쓰기 버튼 -->
        <VCard
          :image="DiaryView"
          align="center"
          style=" width: 1000px;height: 1200px;"
        > 
          <VRow>
            <VBtn
              :icon="emoji.emoticon"
              :color="emoji.color"
              style="margin-top:80px; margin-left: 200px;"
              @click="selectButton(icon.value)"
            >
              <VIcon :icon="emoji.emotion" />
              <VTooltip
                location="right"
                activator="parent"
              >
                <span>{{ emotionTooltip }}<br></span>
              </VTooltip>
            </VBtn>
          </VRow>
          <VCol
            cols="4"
            style="margin-left: -20%; margin-top:-40px"
          >
            <AppDateTimePicker
              id="date"
              v-model="date"
              style="margin-top: 50px;"
              :style="{'color':'white'}"
            />
          </VCol>
            
          <VCol cols="10">
            <!-- 텍스트 영역 위 img 뿌려주는 공간 -->
            <Transition name="fade">
              <VRow style="height: 125px; margin-top: -13px;">
                <VImg 
                  v-for="(url, index) in imgUrls" 
                  :key="index"
                  :src="url"
                  :style="{
                    transition: 'width 0.1s, height 0.1s',
                    alignSelf: 'center',
                    width: imageSize === index ? '125px' : '120px',
                    height: imageSize === index ? '125px' : '120px',
                  }"
                  @click="handleImageClick(url)"
                  @mouseover="handleMouseOver(index)"
                  @mouseleave="handleMouseLeave"
                />
              </VRow>
            </Transition>
          </VCol>
          <VCol>
            <VCol
              cols="12"
              style="height: 1000px;"
            >
              <VCard style="display:flex; width: 75%; height: 72%; margin-top: -15px; background-color: rgba( 255, 255, 255, 0.88 );">
                <PerfectScrollbar :options="{ wheelPropagation: false }">
                  <VCardText
                    id="diary"
                    style="text-align: left; line-height:35px;"
                  />
                </PerfectScrollbar>
              </VCard>
            </VCol>
          </VCol>
        </VCard>
        <VDialog
          v-model="biggeImgFile"
          width="600"
          height="650"
        >
          <VCard cols="12">
            <VCardText>
              <VImg
                :src="clickedImageUrl"
                width="600px"
                height="600px"
              />
            </VCardText>
          </VCard>
        </VDialog>
      </VCard>
    </VCol>
  </VRow>
</template>

<style>
.disabled-textarea {
  color: black; /* 텍스트 색상을 검정색으로 설정합니다. */
}
</style>


<style lang="scss">
.fade-enter,
.fade-enter-active {
  opacity: 0;
  transition: opacity 0.5s;
}

.fade-enter-to {
  opacity: 1;
}

.fade-leave-active,
.fade-leave {
  opacity: 1;
  transition: opacity 0.5s;
}

.fade-leave-to {
  opacity: 0;
}

.animate
{
	transition: all 0.1s;
	-webkit-transition: all 0.1s;
}

.green
{
	border-bottom: 5px solid #439b00;
	text-shadow: 0px -2px #439b00;
}

.action-button
{
	position: relative;
	padding: 10px 40px;
  margin: 0px 10px 10px 0px;
  float: left;
	border-radius: 3px;
	font-family: 'Lato', sans-serif;
	font-size: 18px;
	color: #FFF;
	text-decoration: none;	
}

.action-button:active
{
	transform: translate(0px,5px);
  -webkit-transform: translate(0px,5px);
	border-bottom: 1px solid;
}
</style>



