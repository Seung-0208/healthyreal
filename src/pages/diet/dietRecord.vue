<script setup>
import NutrientAnalysis from '@/components/dialogs/NutrientAnalysis.vue'
import axios from '@/plugins/axiosflask'
import { ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = computed(() => userInfo.value.id)

//영양소 분석 모달창
const isSubmitDisabled = ref(true) //submit버튼 활성화 컨트롤 변수

//이미지 파일 업로드 시 업로드한 이미지가 미리 보이도록 하는 함수
const uploadImg = (e, tagId) => {
  console.log(isSubmitDisabled)

  //(param)e : <input>태그에 발생한 change 이벤트 객체
  //(param)tagId : 업로드한 이미지를 뿌려줄 <img>태그의 아이디값
  const imgUrl = URL.createObjectURL(e.target.files[0]) //이미지 url 생성
  var imgTag = document.getElementById(tagId)
  imgTag.style.width = '250px'
  imgTag.style.height = '250px'
  imgTag.src = imgUrl
  if (tagId == 'imgBefore') {
    isSubmitDisabled.value = false
  }
  console.log(isSubmitDisabled)
  foodocr(e.target.files[0])
  console.log('함수끝')
}

const selectitem = ref(['아침', '점심', '저녁'])
const selectcurr = ref('')

// const onchangeselect = value =>{
//   const 
// }

const before_food = ref('')

// 모든 데이터를 저장할 배열 선언
let all_food_values = []
const bfood = ref('')
const totalCalory = ref(0)
const totalCarbohydrate = ref(0)
const totalProtein = ref(0)
const totalFat = ref(0)
const totalSodium = ref(0)
const totalCholesterol = ref(0)


const foodNamesString = ref('')

const foodocr = async imageFile => {
  console.log('foodocr 실행', imageFile)

  // 이미지를 처리하기 전에 all_food_values를 빈 배열로 설정
  all_food_values = []
  try {
    const reader = new FileReader()

    reader.onloadend = async function () {
      const base64Encoded = reader.result.split(',')[1]

      console.log('제발', base64Encoded)

      const formdata = new FormData()

      formdata.append('base64Encoded', base64Encoded)
      try {
        const response = await axios.post('/foodOcr', formdata)
        const data = response.data

        console.log('여기까지 들어옴', data)

        before_food.value = data.detected_food_names[0]?.replace(/"/g, '').trim() // optional chaining 사용

        // detected_food_names 배열의 각 요소를 순회하면서 모든 값을 저장하기
        for (let i = 0; i < data.detected_food_names.length; i++) {
          //각 요소의 값이 존재하는지 확인하고 빈 값이 아니면 저장
          if (data.detected_food_names[i]) {
            all_food_values.push(data.detected_food_names[i].replace(/"/g, '').trim())
          }
        }

        console.log('저장한 데이터 확인 :', all_food_values)

        // 음식명이 존재하는 경우에만 처리
        if (all_food_values.length > 0) {
          // 음식 정보를 가져와서 결과값을 저장한다.
          const foodInfos = await Promise.all(all_food_values.map(food => getfoodinfostart(food)))

          console.log('모든 음식 정보:', foodInfos)

          bfood.value = all_food_values.join(',')

          // foodInfos 배열에서 각 요소의 calory 속성을 합산
          totalCalory.value = foodInfos.reduce((acc, cur) => acc + parseInt(cur[0].calory), 0)
          totalCarbohydrate.value = foodInfos.reduce((acc, cur) => acc + parseInt(cur[0].carbohydrate), 0)
          totalProtein.value = foodInfos.reduce((acc, cur) => acc + parseInt(cur[0].protein), 0)
          totalFat.value = foodInfos.reduce((acc, cur) => acc + parseInt(cur[0].fat), 0)
          totalSodium.value = foodInfos.reduce((acc, cur) => acc + parseInt(cur[0].sodium), 0)
          totalCholesterol.value = foodInfos.reduce((acc, cur) => acc + parseInt(cur[0].cholesterol), 0)

        } else {
          console.error('음식을 인식할 수 없습니다.')
        }
      } catch (error) {
        console.error('음식 정보를 가져오는 중 오류 발생:', error)
      }
    }
    reader.readAsDataURL(imageFile) // 이미지 파일을 읽고 base64 인코딩된 데이터를 얻음
  } catch (e) {
    console.log('뭔데..')
    console.error(e)
  }
}

const getfoodinfostart = async data => {
  try {
    const response = await axios.get('/foodlist/foodinfo.do', { params: { foodname: data } })

    console.log('받은 데이터:', response.data)

    return response.data
  } catch (error) {
    console.error('음식 정보를 가져오는 중 오류 발생:', error)

    return null
  }
}


//////
const makeDisable = () => {
  console.log('함수 실행됨')

  return false
}

//버튼을 누르면 input태그가 클릭되도록 작동하는 함수
const handleUpload = tagId => {
  //(param)tagId : upload버튼을 눌렀을 때 실행되어야 할 <input>태그의 아이디값
  var filebtn = document.getElementById(tagId)
  console.log('파일버튼', filebtn)
  filebtn.click()
}

const rules = [fileList => !fileList || !fileList.length || fileList[0].size < 1000000 || 'Avatar size should be less than 1 MB!']
const isNutrientAnalysisVisible = ref(false) //모달창 컨트롤 변수


const userdietinfo = ref([])

const dietinfo = ref([])
const checkedItems = ref([])

const handleSubmit = async (connetId, selectcurr, bfood) => {
  isNutrientAnalysisVisible.value = !isNutrientAnalysisVisible.value
  console.log('유저 ID :', connetId, '음식 :', bfood, '식사타입:', selectcurr)
  await axios.get('/saverecord/dietinfo.do', { params: { id: connetId, ae_foodname: bfood, ae_diettype: selectcurr } })
    .then(response => {
      console.log('받은 데이터 :', response.data) //오늘의 식사 data를 넘겨받음
      console.log('받은 첫번째 데이터 :', response.data[0])
      userdietinfo.value = response.data
      console.log('받은 데이터 값 : ', userdietinfo.value)

      axios.get('/Dietfood/DailyView.do', { params: { 'id': connetId } })
        .then(response => {
          if (response.data.length > 0) {
            // 초기화
            dietinfo.value = [[], [], []]

            response.data.forEach(data => {
              if (data.mealType === '아침' && selectcurr == data.mealType) {
                dietinfo.value[0] = data
                if (bfood.includes(dietinfo.value[0].eating_foodname)) {
                  console.log("bfood는", dietinfo.value[0].eating_foodname, "을 포함하고 있습니다.")
                  axios.post('/croom/implementationSetting.do', { id: connetId })
                    .then(response => {
                      checkedItems.value = []
                      let eattingString = response.data.eatting

                      // eattingString이 빈 문자열이 아닌 경우에만 처리
                      if (eattingString) {
                        eattingString = eattingString.replace(/\[|\]/g, '') // 대괄호 제거
                        let eattingArray = eattingString.split(', ') // 문자열을 배열로 변환
                        checkedItems.value = eattingArray
                      }

                      checkedItems.value.push('B')
                      axios.post('/croom/implementationFood.do', {
                        foodCheckCount: checkedItems.value,
                        id: connetId,
                      })
                    })
                }
              } else if (data.mealType === '점심' && selectcurr == data.mealType) {
                dietinfo.value[1] = data
                if (bfood.includes(dietinfo.value[1].eating_foodname)) {
                  console.log("bfood는", dietinfo.value[1].eating_foodname, "을 포함하고 있습니다.")
                  axios.post('/croom/implementationSetting.do', { id: connetId })
                    .then(response => {
                      checkedItems.value = []
                      let eattingString = response.data.eatting

                      // eattingString이 빈 문자열이 아닌 경우에만 처리
                      if (eattingString) {
                        eattingString = eattingString.replace(/\[|\]/g, '') // 대괄호 제거
                        let eattingArray = eattingString.split(', ') // 문자열을 배열로 변환
                        checkedItems.value = eattingArray
                      }
                      console.log("받아온 이행률은??", checkedItems.value)

                      // L을 배열에 추가
                      checkedItems.value.push('L')
                      console.log("L을 추가한 이행률은??", checkedItems.value)

                      axios.post('/croom/implementationFood.do', {
                        foodCheckCount: checkedItems.value,
                        id: connetId,
                      })
                    })
                }
              } else if (data.mealType === '저녁' && selectcurr == data.mealType) {
                dietinfo.value[2] = data
                if (bfood.includes(dietinfo.value[2].eating_foodname)) {
                  console.log("bfood는", dietinfo.value[2].eating_foodname, "을 포함하고 있습니다.")
                  axios.post('/croom/implementationSetting.do', { id: connetId })
                    .then(response => {
                      checkedItems.value = []
                      let eattingString = response.data.eatting

                      // eattingString이 빈 문자열이 아닌 경우에만 처리
                      if (eattingString) {
                        eattingString = eattingString.replace(/\[|\]/g, '') // 대괄호 제거
                        let eattingArray = eattingString.split(', ') // 문자열을 배열로 변환
                        checkedItems.value = eattingArray
                      }
                      checkedItems.value.push('D')
                      axios.post('/croom/implementationFood.do', {
                        foodCheckCount: checkedItems.value,
                        id: connetId,
                      })
                    })
                }
              }
            })
          }
          console.log('가져온 유저 Eating_Record', dietinfo.value)
        })
    })
}
</script>

<template>
  <VCard>
    <VCardItem :style="{ 'background-color': '#F6F6F6' }">
      <VCardText>
        <p class="text-h4">
          식단의 사진을 등록해주세요
        </p>
        <VChip color="warning">
          ⚠️ 식전 사진 등록은 필수입니다
        </VChip>
      </VCardText>
    </VCardItem>
    <VRow :style="{ 'margin-top': '120px', 'display': 'flex', 'justify-content': 'center' }">
      <VCol cols="6" :style="{ 'display': 'flex', 'justify-content': 'center' }">
        <VCard class="text-high-emphasis text-center" :style="{ 'width': '80%', 'margin-bottom': '100px' }">
          <VCol>
            <VSelect v-model="selectcurr" :items="selectitem" label="식사를 선택해주세요" placeholder="식사를 선택해주세요" />
          </VCol>
          <!-- 식전사진 업로드 -->
          <div :style="{ 'margin': '30px' }">
            <h2>식전 사진</h2>
          </div>
          <VCardItem :style="{ 'margin-top': '10px' }">
            <input id="filebtn" type="file" accept="image/*" hidden @change="uploadImg($event, 'imgBefore')">
            <!-- label의 for속성값과 input의 id값을 맞춰줘야 label영역을 클릭했을 때 input태그가 활성화됨 -->
            <label for="filebtn" class="input-plus">
              <div
                :style="{ 'width': '100%', 'height': '300px', 'display': 'flex', 'justify-content': 'center', 'align-items': 'center' }">
                <img id="imgBefore" :style="{ 'width': '50px', 'height': '60px' }" src="@images/noimage.png">
              </div>
            </label>
          </VCardItem>
          <VCardText>
            <p v-if="before_food == ''" class="text-base clamp-text">
              음식이 모두 보이도록<br>사진을 업로드해주세요.
            </p>
            <p v-else>
              확인된 음식 : {{ all_food_values.join(', ') }}
            </p>
            <VBtn @click="handleUpload('filebtn')">
              upload
            </VBtn>
          </VCardText>

          <ShareProjectDialog v-model:isDialogVisible="isShareProjectDialogVisible" />
        </VCard> <!-- 식전사진 업로드 end -->
      </VCol>
      <VCol cols="6" :style="{ 'display': 'flex', 'justify-content': 'center' }">
        <VCard class="text-high-emphasis text-center" :style="{ 'width': '80%', 'margin-bottom': '100px' }">
          <!-- 식후사진 업로드 -->
          <div :style="{ 'display': 'flex', 'justify-content': 'center', 'margin': '30px' }">
            <strong style="font-size: x-large;">업로드한 식단 정보</strong>
          </div>
          <VCardItem v-if="bfood" :style="{ 'margin-top': '10px' }">
            <VCol>
              칼로리 : {{ totalCalory }} ㎉
            </VCol>
            <VCol>
              탄수화물 : {{ totalCarbohydrate }} g
            </VCol>
            <VCol>
              단백질 : {{ totalProtein }} g
            </VCol>
            <VCol>
              지방 : {{ totalFat }} g
            </VCol>
            <VCol>
              나트륨 : {{ totalSodium / 1000 }} g
            </VCol>
            <VCol>
              콜레스트롤 : {{ totalCholesterol / 1000 }} g
            </VCol>
          </VCardItem>
          <ShareProjectDialog v-model:isDialogVisible="isShareProjectDialogVisible" />
        </VCard>
      </VCol>
    </VRow>
    <VRow :style="{ 'display': 'flex', 'justify-content': 'center' }">
      <VBtn :disabled="isSubmitDisabled" :style="{ 'margin-bottom': '50px' }"
        @click="handleSubmit(connetId, selectcurr, bfood)">
        <!-- @click="isNutrientAnalysisVisible = !isNutrientAnalysisVisible" -->
        SUBMIT
      </VBtn>
      <NutrientAnalysis v-model:isDialogVisible="isNutrientAnalysisVisible" :userdietinfo="userdietinfo" />
    </VRow>
  </VCard>
</template>
