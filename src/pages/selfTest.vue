<script setup>
import axiosflask from '@/plugins/axiosflask'
import axios from '@axios'
import ht1 from '@images/Unbalanced/1.jpg'
import ht10 from '@images/Unbalanced/10.jpg'
import ht11 from '@images/Unbalanced/11.jpg'
import ht12 from '@images/Unbalanced/12.jpg'
import ht13 from '@images/Unbalanced/13.jpg'
import ht14 from '@images/Unbalanced/14.jpg'
import ht15 from '@images/Unbalanced/15.jpg'
import ht16 from '@images/Unbalanced/16.jpg'
import ht17 from '@images/Unbalanced/17.jpg'
import ht18 from '@images/Unbalanced/18.jpg'
import ht19 from '@images/Unbalanced/19.jpg'
import ht2 from '@images/Unbalanced/2.jpg'
import ht20 from '@images/Unbalanced/20.jpg'
import ht21 from '@images/Unbalanced/21.jpg'
import ht22 from '@images/Unbalanced/22.jpg'
import ht3 from '@images/Unbalanced/3.jpg'
import ht4 from '@images/Unbalanced/4.jpg'
import ht5 from '@images/Unbalanced/5.jpg'
import ht6 from '@images/Unbalanced/6.jpg'
import ht7 from '@images/Unbalanced/7.jpg'
import ht8 from '@images/Unbalanced/8.jpg'
import ht9 from '@images/Unbalanced/9.jpg'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

// 로그인 스토어와 사용자 스토어의 상태를 가져옵니다.
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = computed(() => userInfo.value.id)
const name = computed(() => store.state.userStore.userInfo ? store.state.userStore.userInfo.name : null)

const isDialogVisible = ref(false)

const imageUrl = ref('') // 이미지 URL을 담을 변수 -- 사진 1개

let fileToUpload = ref(null)
let inbodysV = ref([])

const uploadImg = e => {
  const fileList = e.target.files
  if (fileList.length > 0) {
    const imgUrl = URL.createObjectURL(fileList[0])

    imageUrl.value = imgUrl
    fileToUpload.value = fileList[0]
  } else {
    console.error('No file selected')
  }
}

const upload = async () => {
  console.log("fileToUpload--------------------------------", fileToUpload)
  if (fileToUpload.value) {
    const formData = new FormData()

    formData.append('file', fileToUpload.value)

    isDialogVisible.value = false

    try {
      const response = await axiosflask.post('/vision/in-ocr', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      console.log(response.data)
      fileToUpload.value = null
      inbodysV.value = response.data
    } catch (error) {
      console.error(error)
    }
  } else {
    console.error('No file selected')
  }
}

const formData = ref({
  age: '',
  gender: '',
  sleep: '',
  imageUrl: '',
  twitter: 'https://twitter.com/abc',
  facebook: 'https://facebook.com/abc',
  googlePlus: 'https://plus.google.com/abc',
  linkedIn: 'https://linkedin.com/abc',
})


// Key : {key : Value} 구조의 값을 풀어서 DB에 {} 안에 Key값만 넘기기
function extractNumbers(obj) {
  return Object.values(obj)
    .map(value => parseInt(Object.keys(value)[0]))
}

/* ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ알러지ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ*/
// 알러지 음식 정보 DB에서 가져오기
const checkboxContent = ref([])

const getallergyInfo = async () => {
  await axios.get('/Allergy/ListView.do')
    .then(response => {
      console.log('성공', response.data)
      checkboxContent.value = response.data.map(item => ({
        //'@/assets/images/allergy/' item.allergy_imagepath
        bgImage: `/src/assets/images/allergy/${item.allergy_imagepath}`,
        value: item.allergy_no,
        name: item.allergy_name,
      }))
    })
    .catch(error => {
      console.log('실패', error)
    })
}

const receivedAllergyList = ref('')

const handleAllergyList = AllergyList => {
  receivedAllergyList.value = AllergyList
  console.log('선택한 알러지 목록 :', receivedAllergyList.value._rawValue)
}

/*ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ*/

// 싫어하는 음식 정보 DB에서 가져오기
// const checkboxContent2 = ref([])
// const gethatefoodInfo = async() => {
//   await axios.get('/HateFood/ListView.do')
//   .then(response => {
//     console.log('성공', response.data)
//     checkboxContent2.value = response.data.map((item) => ({
//       bgImage:item.HateFood_imagepath,
//       value:item.HateFood_no,
//       name:item.HateFood_name
//     }))
//   })
//   .catch(error => {
//     console.log('실패', error)
//   })
// }

// 탭에다 뿌려줄 사진 및 밸류
const checkboxContent2 = [
  { bgImage: ht1, value: '19', name: '오이' },
  { bgImage: ht2, value: '20', name: '버섯' },
  { bgImage: ht3, value: '21', name: '파프리카' },
  { bgImage: ht4, value: '22', name: '생선' },
  { bgImage: ht5, value: '23', name: '굴' },
  { bgImage: ht6, value: '24', name: '딸기' },
  { bgImage: ht7, value: '25', name: '당근' },
  { bgImage: ht8, value: '26', name: '치즈' },
  { bgImage: ht9, value: '27', name: '가지' },
  { bgImage: ht10, value: '28', name: '애호박' },
  { bgImage: ht11, value: '29', name: '브로콜리' },
  { bgImage: ht12, value: '30', name: '김치' },
  { bgImage: ht13, value: '31', name: '고구마' },
  { bgImage: ht14, value: '32', name: '감자' },
  { bgImage: ht15, value: '33', name: '양배추' },
  { bgImage: ht16, value: '34', name: '양상추' },
  { bgImage: ht17, value: '35', name: '비트' },
  { bgImage: ht18, value: '36', name: '닭고기' },
  { bgImage: ht19, value: '37', name: '돼지고기' },
  { bgImage: ht20, value: '38', name: '소고기' },
  { bgImage: ht21, value: '39', name: '양갈비' },
  { bgImage: ht22, value: '40', name: '해산물' },
]

const selectedCheckbox = ref(['basic'])

const iconsSteps = [
  {
    title: '알레르기',
    icon: 'mdi-allergy',
  },
  {
    title: '싫어하는 음식',
    icon: 'mdi-food-variant-off',
  },
  {
    title: '기타',
    icon: 'mdi-text-box-edit',
  },

]

const inbodydatas = computed(() => [
  {
    title: '체중',
    value: inbodysV.value[0] ? inbodysV.value[0] + 'kg' : '',
  },
  {
    title: '골격근량',
    value: inbodysV.value[1]
      ? (inbodysV.value[1] > 100 ? inbodysV.value[1] - 100 : inbodysV.value[1]) + 'kg'
      : '',
  },
  {
    title: '체지방량',
    value: inbodysV.value[2]
      ? (inbodysV.value[2] > 100 ? inbodysV.value[2] - 100 : inbodysV.value[2]) + 'kg'
      : '',
  },
  {
    title: 'BMI',
    value: inbodysV.value[3]
      ? (inbodysV.value[3] > 100 ? inbodysV.value[3] - 100 : inbodysV.value[3]) + 'kg/m2'
      : '',
  },
  {
    title: '체지방률',
    value: inbodysV.value[4]
      ? (inbodysV.value[4] > 100 ? inbodysV.value[4] - 100 : inbodysV.value[4]) + '%'
      : '',
  },
])

const currentStep = ref(0)

const onSubmit = async () => {
  console.log(inbodysV.value)
  if (inbodysV.value.length > 0) {
    const formData = new FormData()

    formData.append('id', connetId.value) //아이디
    formData.append('inb_weight', inbodysV.value[0]) //체중 (Weight)
    formData.append('inb_smm', inbodysV.value[1] > 100 ? inbodysV.value[1] - 100 : inbodysV.value[1]) //골격근량 (Skeletal Muscle Mass)
    formData.append('inb_bfm', inbodysV.value[2] > 100 ? inbodysV.value[2] - 100 : inbodysV.value[2]) //체지방량 (Body Fat Mass)
    formData.append('inb_bmi', inbodysV.value[3] > 100 ? inbodysV.value[3] - 100 : inbodysV.value[3]) //BMI (Body Mass Index)
    formData.append('inb_pbf', inbodysV.value[4] > 100 ? inbodysV.value[4] - 100 : inbodysV.value[4]) //체지방률 (Percent Body Fat)
    console.log(formData)
    await axios
      .post('/Inbody/Save.do', formData, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then(response => {
        console.log('됐나?', response.data)
        router.push('/main')
      })
  } else {
    console.log('저장할 정보가 없습니다.')
    alert('저장할 정보가 없습니다.')
  }
}

const isSelected = value => {
  return selectedCheckbox.value === value
}


const receivedHateFoodList = ref('')

const handleHateFoodList = HateFoodList => {
  receivedHateFoodList.value = HateFoodList
  console.log('선택한 싫은 음식 목록 :', receivedHateFoodList.value._rawValue)
}


/* ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ */
const saveMemberAllergy = async (receivedList, type) => {
  const formData = new FormData()

  console.log('목록', receivedList._rawValue._rawValue)

  const receivedArray = extractNumbers(receivedList._rawValue._rawValue)
  let endpoint = ''
  formData.append('id', connetId.value)
  if (type == 1) {
    formData.append('allergies', receivedArray)
    endpoint = 'Allergy'
  } else if (type == 2) {
    formData.append('hatefoods', receivedArray)
    endpoint = 'HateFood'
  }

  await axios.post(`/SaveMember/${endpoint}`, formData, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .catch(error => {
      console.log(error)
    })
}

const sendchkList = currentStep => {
  if (currentStep == 1) {
    const allergyNames = receivedAllergyList.value._rawValue.map(obj => Object.values(obj)[0])

    alert('[알러지 정보를 저장합니다.]\n\n\t선택한 알러지 목록 : ' + allergyNames.join(', '))
    saveMemberAllergy(receivedAllergyList, 1)

    // gethatefoodInfo()
  } else if (currentStep == 2) {
    console.log('[선택하신 알러지 정보를 저장합니다.]')

    const hateFoodNames = receivedHateFoodList.value._rawValue.map(obj => Object.values(obj)[0])

    alert('[싫어하는 음식 정보를 저장합니다.]\n\n\t선택한 음식 목록 : ' + hateFoodNames.join(', '))
    saveMemberAllergy(receivedHateFoodList, 2)
  }
}



onMounted(getallergyInfo)

// onMounted(getallergyInfo(), gethatefoodInfo());
</script>

<template>
  <VCard>
    <VCardText>
      <!-- 👉 Stepper -->
      <AppStepper v-model:current-step="currentStep" :items="iconsSteps" />
    </VCardText>

    <VDivider />

    <VCardText>
      <!-- 👉 stepper content -->
      <VForm>
        <VWindow v-model="currentStep" class="disable-tab-transition">
          <!-- 첫번째 탭 (알레르기) -->
          <VWindowItem>
            <VRow>
              <div>
                <CustomCheckboxesWithImage v-model:selected-checkbox="selectedCheckbox"
                  :checkbox-content="checkboxContent" :grid-column="{ sm: '3', cols: '12' }"
                  @AllergyList="handleAllergyList" />
              </div>
            </VRow>
          </VWindowItem>
          <!-- 두번쨰 탭 (좋아하는 음식) -->
          <!-- 하트 이미지 수정하려면 src\@core\components\app-form-elements\CustomCheckboxesWithImageIcon.vue 에서 수정 -->
          <VWindowItem>
            <VRow>
              <div>
                <CustomCheckboxesWithImageIcon v-model:selected-checkbox="selectedCheckbox"
                  :checkbox-content="checkboxContent2" :grid-column="{ sm: '3', cols: '12' }"
                  @HateFoodList="handleHateFoodList" />
              </div>
            </VRow>
          </VWindowItem>
          <!-- 세번쨰 탭 (싫어하는 음식) -->
          <VWindowItem>
            <!--   첫번째 줄  -->
            <VRow>
              <VCol cols="3">
                <p />평균 수면 시간
              </VCol>
              <VCol cols="12" md="6">
                <VTextField v-model="formData.sleep" placeholder="ex)8" label="평균 수면 시간" />
              </VCol>

              <VCol cols="2" />
            </VRow>
            <!--   세번째 줄  -->
            <VRow>
              <VCol cols="5">
                <p />인바디 정보 입력
              </VCol>
              <VCol cols="12" md="4">
                <VDialog v-model="isDialogVisible" width="1000">
                  <!-- Activator -->
                  <template #activator="{ props }">
                    <VBtn v-bind="props" size="x-large">
                      Inbody
                    </VBtn>
                  </template>
                  <!-- Dialog Content -->
                  <VCard title="Inbody">
                    <DialogCloseBtn variant="text" size="small" @click="isDialogVisible = false" />
                    <VCardText>
                      인바디 분석 용지를 사진 찍어주세요
                    </VCardText>
                    <VRow>
                      <VRow>
                        <!-- 원본 인바디 사진 -->
                        <VImg id="diaryImages" :src="imageUrl"
                          style=" width: 550px; height: 550px;align-self: center; margin: 50px;" />
                      </VRow>
                    </VRow>
                    <VCol cols="12">
                      <VFileInput :rules="rules" label="인바디 사진" type="file" accept="image/png, image/jpeg, image/bmp"
                        placeholder="Pick an avatar" prepend-icon="mdi-camera-outline" @change="uploadImg" />
                    </VCol>
                    <VCol>
                      <VBtn block @click="upload">
                        확인
                      </VBtn>
                    </VCol>
                  </VCard>
                </VDialog>
              </VCol>
              <VCol cols="2" />
            </VRow>
            <VRow>
              <VImg id="diaryImages" v-model="formData.imageUrl" :src="imageUrl"
                style=" width: 600px; height: 600px; align-self: center; margin: 50px;" />
            </VRow>
            <!-- 너무 길다싶으면 style="width: ;" 이거 줘서 줄이면 됩니다 -->
            <VTable v-if="imageUrl.length > 0">
              <thead>
                <tr>
                  <th class="text-uppercase">
                    골격근, 지방분석
                  </th>
                  <th class="text-uppercase align" style="text-align: end;">
                    단위
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="inbody in inbodydatas" :key="inbody.value">
                  <td>
                    {{ inbody.title }}
                  </td>
                  <td style="text-align: end;">
                    {{ inbody.value }}
                  </td>
                </tr>
              </tbody>
            </VTable>
          </VWindowItem>


          <VWindowItem>
            <div class="text-base">
              <h6 class="text-base font-weight-medium mb-2">
                Account
              </h6>

              <p class="mb-1">
                {{ formData.username }}
              </p>
              <p class="mb-1">
                {{ formData.email }}
              </p>

              <VDivider class="my-4" />

              <h6 class="text-base font-weight-medium mb-2">
                Personal Info
              </h6>

              <p class="mb-1">
                {{ formData.firstName }}
              </p>
              <p class="mb-1">
                {{ formData.lastName }}
              </p>
              <p class="mb-1">
                {{ formData.country }}
              </p>
              <p class="mb-1">
                {{ formData.language }}
              </p>

              <VDivider class="my-4" />

              <h6 class="text-base font-weight-medium mb-2">
                Address
              </h6>

              <p class="mb-1">
                {{ formData.address }}
              </p>
              <p class="mb-1">
                {{ formData.landmark }}
              </p>
              <p class="mb-1">
                {{ formData.pincode }}
              </p>
              <p class="mb-1">
                {{ formData.city }}
              </p>

              <VDivider class="my-4" />

              <h6 class="text-base font-weight-medium mb-2">
                Social Links
              </h6>

              <p class="mb-1">
                {{ formData.twitter }}
              </p>
              <p class="mb-1">
                {{ formData.facebook }}
              </p>
              <p class="mb-1">
                {{ formData.googlePlus }}
              </p>
              <p class="mb-1">
                {{ formData.linkedIn }}
              </p>
            </div>
          </VWindowItem>
        </VWindow>

        <div class="d-flex justify-sm-space-between gap-4 flex-wrap justify-center mt-8">
          <VBtn :color="currentStep === 0 ? 'secondary' : 'default'" variant="outlined" :disabled="currentStep === 0"
            @click="currentStep--">
            <VIcon icon="mdi-arrow-left" start class="flip-in-rtl" />
            이전
          </VBtn>

          <VBtn v-if="iconsSteps.length - 1 === currentStep" color="success" append-icon="mdi-check" @click="onSubmit">
            submit
          </VBtn>

          <VBtn v-else @click="currentStep++, sendchkList(currentStep)">
            다음

            <VIcon icon="mdi-arrow-right" end class="flip-in-rtl" />
          </VBtn>
        </div>
      </VForm>
    </VCardText>
  </VCard>
</template>

<style scoped>
.centered-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.text-lg {
  font-size: 1.25rem;
  /* 원하는 폰트 크기로 조정 */
}

.text-md {
  font-size: 1rem;
  /* 원하는 폰트 크기로 조정 */
}
</style>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
