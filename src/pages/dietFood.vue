<script setup>
import UserCategory from '@/components/dialogs/UserCategory.vue'
import RecipeView from '@/components/dialogs/recipe_view.vue'
import axios from '@axios'
import { computed, ref, watch } from 'vue'

import { useStore } from 'vuex'

const store = useStore()

// 로그인 스토어와 사용자 스토어의 상태를 가져옵니다.
const userInfo = computed(() => store.state.userStore.userInfo)
const connetId = userInfo.value.id
const isUpgradePlanDietPlan = ref(false)
const isCheckedRecipe = ref(false)
const isCheckedRestaurant = ref(false)
const isCategory = ref(false)
const isRecipe = ref(false)
const router = useRoute()
const connectionData = ref([])
const isLoadingmo = ref(false)

watch(isLoadingmo, value => {
  console.log(isLoadingmo.value)
  if (!value)
    return

  setTimeout(() => {
    isLoadingmo.value = false
  }, 500)
})

const fetchProjectData = () => {
  if (router.params.tab === 'connections') {
    axios.get('/pages/profile', { params: { tab: router.params.tab } }).then(response => {
      connectionData.value = response.data
    })
  }
}

const choicecategorydata = ref({}) // 선택된 값이 저장될 변수
const recipedatach = ref({})
const updatediet = ref('')
let selectedCategory = ref([]) // 선택한 카테고리를 저장할 변수 

const handleChoiceCategory = value => {
  // choicecategory.value = value
  const { choicecategory, dietType } = value

  choicecategorydata.value[dietType] = choicecategory
  updatediet.value = dietType
  selectedCategory.value[dietType] = choicecategory // 선택한 카테고리 저장
  console.log('선택한 카테고리:', choicecategorydata.value, '선택한 index :', updatediet.value)
}

const handleRecipedatach = value => {
  const { recipe, dietType } = value

  recipedatach.value[dietType] = recipe
  updatediet.value = dietType
  console.log('선택한 레시피:', recipedatach.value, '선택한 index:', updatediet.value)
}

const dietPlansList = [
  {
    desc: 'Standard - $99/month',
    title: '아침 메뉴',
    content: '아침 메뉴 설명',
    index: 0,
  },
  {
    desc: 'Basic - $0/month',
    title: '점심 메뉴',
    content: '점심 메뉴 설명',
    index: 1,
  },
  {
    desc: 'Enterprise - $499/month',
    title: '저녁 메뉴',
    content: '저녁 메뉴 설명',
    index: 2,
  },
]

const recipedata = ref([]) // 내 레시피 데이터
const selectedGroups = ref([])
const dietPlansListtype = ref('')

let dietinfo = ref([])

// DB에 유저 데이터가 있으면 가지고 옴
const getEatingRecord = async () => {
  const connetId = userInfo.value.id

  console.log('체크해보자 : ', connetId)
  await axios.get('/Dietfood/DailyView.do', { params: { 'id': connetId } })
    .then(response => {
      console.log('가져온 유저 Eating_Record', response.data)

      if (response.data.length > 0) {
        // 레시피 & 재료도 가져오기

        // 초기화
        dietinfo.value = [[], [], []]

        response.data.forEach(data => {
          if (data.mealType === '아침') {
            dietinfo.value[0] = data
          } else if (data.mealType === '점심') {
            dietinfo.value[1] = data
          } else if (data.mealType === '저녁') {
            dietinfo.value[2] = data
          }
        })
      } else {
        // 데이터가 없는 경우에도 dietinfo를 초기화합니다.
        dietinfo.value = [[], [], []]
      }
    })
  console.log('현재 데이터:', dietinfo.value)
}

// DB에서 특정 카테고리에 대한 레시피를 가져와서 레시피를 기준으로 그룹 묶고 랜덤 5개만 자식 컴포넌트에 넘기기 
const getrecipe = async (connetId, choicecategory, index) => {
  console.log('들어온 아이디와, 카테고리', connetId, choicecategory, index)

  // If '식단 재추천' was clicked for the second card (index 1), show the specific S3 image
  if (index === 1) {
    const url = 'https://healthyreal-bucket.s3.ap-northeast-2.amazonaws.com/image/%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C+(1).jpeg'
    // wait 3 seconds before applying the recommendation
    await new Promise(resolve => setTimeout(resolve, 3000))
    // Ensure recipedatach is reactive and contains an array with an object that has RECIPE_IMG
    recipedatach.value[index] = [{ RECIPE_IMG: url, FOODNAME: '계란 샌드위치', RECIPE_TITLE: '' }]
    // keep track of which card type was requested
    dietPlansListtype.value = index
    // clear any selectedGroups used by the recipe view
    // selectedGroups.value = []
    return
  }

  // Existing recipe fetch logic (kept commented for future use)
  // await axios.get('/recipe/View.do', { params: { 'id': connetId, 'category': choicecategory } })
  //   .then(response => {
  //     // 음식명을 기준으로 데이터 묶기
  //     recipedata.value = response.data.reduce((acc, curr) => {
  //       const FOODNAMEAll = curr.FOODNAME
  //       if (acc[FOODNAMEAll]) {
  //         acc[FOODNAMEAll].push(curr)
  //       } else {
  //         acc[FOODNAMEAll] = [curr]
  //       }

  //       return acc // 콜백 함수에서 값을 반환하도록 수정
  //     }, {})
  //     console.log('그룹으로 묶였는지 확인 -> ', recipedata.value)

  //     selectedGroups.value = getRandomGroups()
  //     dietPlansListtype.value = index
  //     console.log('랜덤 추출값:', selectedGroups.value)
  //   })
}


const searchRestaurant = ref('')
const searchindex = ref('')

const getRestaurant = (foodname, index) => {
  isCheckedRestaurant.value = true
  searchRestaurant.value = foodname
  searchindex.value = index
  console.log(searchRestaurant.value)
}

const getcategory = async index => {
  console.log('들어온 인덱스:', index)
  dietPlansListtype.value = index
}

// recipedata 배열에서 무작위로 5개 그룹을 선택하는 함수
const getRandomGroups = () => {
  // 객체를 배열로 변환
  const dataArray = Object.values(recipedata.value)

  // 배열을 무작위로 섞음
  const shuffled = dataArray.sort(() => 0.5 - Math.random())

  // 상위 5개 항목을 반환
  return shuffled.slice(0, 5)
}

const savedietFood = async () => {
  // 저장할 데이터 배열
  const dataToSave = []

  // 아침, 점심, 저녁 데이터를 각각 확인하면서 데이터가 있는 경우 배열에 추가합니다.
  for (let i = 0; i < 3; i++) {
    if (recipedatach.value[i] && recipedatach.value[i].length > 0) {
      const mealType = i === 0 ? '아침' : i === 1 ? '점심' : '저녁'
      const foodName = recipedatach.value[i][0].FOODNAME
      const recipeCode = recipedatach.value[i][0].RECIPECODE

      // 데이터가 이미 존재하는지 여부를 확인합니다.
      const existingData = dietinfo.value[i]

      console.log('existingData:', existingData)
      if (existingData && existingData.id) {
        // 데이터가 이미 존재하면 update 데이터로 추가합니다.
        dataToSave.push({
          id: connetId,
          mealtype: mealType,
          eating_foodname: foodName,
          eating_recipeCode: recipeCode,
          action: 'update', // update로 표시합니다.
        })
      } else {
        // 데이터가 존재하지 않으면 insert 데이터로 추가합니다.
        dataToSave.push({
          id: connetId,
          mealtype: mealType,
          eating_foodname: foodName,
          eating_recipeCode: recipeCode,
          action: 'insert', // insert로 표시합니다.
        })
      }
    }
  }
  console.log('어디 볼까', dataToSave)

  // 데이터를 저장할 요청이 존재하는지 확인합니다.
  if (dataToSave.length > 0) {
    try {
      // Axios를 사용하여 서버로 데이터를 전송합니다.
      const response = await axios.post('/Dietfood/SaveBulk.do', dataToSave)

      console.log('데이터가 성공적으로 서버에 전송되었습니다.')
      isLoadingmo.value = true

      // 데이터를 성공적으로 저장한 후에 dietinfo.value[i] 값을 갱신합니다.
      await getEatingRecord()

      // recipedatach.value[i] 값을 초기화합니다.
      recipedatach.value = []
    } catch (error) {
      // 데이터 전송 중에 오류가 발생한 경우의 처리
      console.error('데이터 전송 중 오류가 발생했습니다:', error)
    }
  } else {
    console.log('저장할 데이터가 없습니다.')
  }
}

const handleIconClicked = data => {
  const { connetId, choicecategory, index } = data

  getrecipe(connetId, choicecategory, index) // 클릭 이벤트 발생 시 getrecipe 함수 호출
}

onMounted(getEatingRecord)

watch(router, fetchProjectData, { immediate: true })
</script>

<template>
  <section>
    <VRow class="fill-height">
      <VCol cols="12">
        <VRow style="margin: 0 10px;">
          <VSpacer />
          <VBtn color="warning" @click="savedietFood">
            저장하기
          </VBtn>
        </VRow>
      </VCol>
      <VCol v-for="list in dietPlansList" :key="list.index" cols="12" md="4">
        <VCard class="text-center">
          <VBtn style=" margin-top: 10px;margin-left: -74%;" color="warning" size="small"
            @click="isCategory = true, getcategory(list.index)">
            {{ selectedCategory[list.index] || '카테고리' }} <!-- 선택한 카테고리를 표시 -->
          </VBtn>
          <VCardItem class="d-flex flex-column justify-center align-center" style="height: 250px; margin-top: 20px;">
            <VAvatar variant="tonal" size="160" class="mb-2" style="width:160px; height:160px; overflow:hidden;">
              <VImg v-if="list.index === 0"
                style="height:160px; width:160px; object-fit:cover; display:block;"
                :src="'https://healthyreal-bucket.s3.ap-northeast-2.amazonaws.com/image/%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C.jpeg'" />
              <VImg v-else-if="!(recipedatach[list.index] && recipedatach[list.index].length) && !(dietinfo[list.index])"
                style="height:160px; width:160px; object-fit:cover; display:block;" />
              <VImg v-else-if="!(recipedatach[list.index] && recipedatach[list.index].length) && dietinfo[list.index]"
                style="height:160px; width:160px; object-fit:cover; display:block;" :src="dietinfo[list.index].recipe_img" />
              <VImg v-else style="height:160px; width:160px; object-fit:cover; display:block;" :src="recipedatach[list.index][0].RECIPE_IMG" />
            </VAvatar>
            <h6 class="text-h6" style="font-weight: bold;">
              <span
                v-if="!(recipedatach[list.index] && recipedatach[list.index].length) && dietinfo[list.index] && dietinfo[list.index] != ''">{{
                  dietinfo[list.index].eating_foodname }}</span>
              <span v-else-if="(recipedatach[list.index] && recipedatach[list.index].length)">{{
                recipedatach[list.index][0].FOODNAME }}</span>
              <span v-else>{{ list.title }}</span>
            </h6>
          </VCardItem>
          <VCardText style="height: 40px; font-weight: bold;">
            <span
              v-if="!(recipedatach[list.index] && recipedatach[list.index].length) && dietinfo[list.index] && dietinfo[list.index] != ''">{{
                dietinfo[list.index].recipe_title }}</span>
            <span v-else-if="(recipedatach[list.index] && recipedatach[list.index].length)">{{
              recipedatach[list.index][0].RECIPE_TITLE }}</span>
            <span v-else>{{ list.content }}</span>
          </VCardText>

          <VCardText
            v-if="(dietinfo[list.index] && dietinfo[list.index] != '') && !(recipedatach[list.index] && recipedatach[list.index].length)"
            style=" width: auto;height: 100px;">
            <span>
              <div>
                <div v-if="dietinfo[list.index]">
                  <br><strong style="margin: 0 20px;">[조리순서]</strong>
                  <div style=" width: auto;max-height: 200px; overflow-y: auto;" class="scrollbar">
                    <p v-for="(seq, seqIndex) in dietinfo[list.index].recipe_seq.split('||')" :key="seqIndex"
                      style="margin: 10px 20px;">
                      {{ seqIndex + 1 }} ) {{ seq }}
                    </p>
                  </div>

                  <br>
                  <strong style="margin: 10px 20px;">[재료]</strong>
                </div>



                <span v-for="(jaro, ind) in dietinfo[list.index].ingredients" :key="ind">
                  - {{ jaro.ingredient }} - {{ jaro.ri_amount }}<br>
                </span>


              </div>
            </span>
          </VCardText>
          <VCardText class="justify-center">
            <VBtn color="warning" variant="elevated" style=" width: 90px;margin-right: 5px;"
              @click="getrecipe(connetId, choicecategorydata[list.index], list.index), isRecipe = false">
              식단 재추천
            </VBtn>
            <VBtn color="warning" variant="elevated"
              @click="getRestaurant(dietinfo[list.index].eating_foodname, list.index)">
              음식점
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
    <UserCheckedRecipe v-model:isDialogVisible="isCheckedRecipe" />
    <UserFindRestaurant v-model:isDialogVisible="isCheckedRestaurant" :search-restaurant="searchRestaurant"
      :searchindex="searchindex" />
    <UserCategory v-model:isDialogVisible="isCategory" :choicecategory="choicecategory"
      :diet-plans-listtype="dietPlansListtype" @update:choicecategory="handleChoiceCategory" />
    <RecipeView v-model:isDialogVisible="isRecipe" :recipedata="selectedGroups" :diet-plans-listtype="dietPlansListtype"
      :connet-id="connetId" @update:recipedatach="handleRecipedatach" @icon-clicked="handleIconClicked" />
    <!-- Dialog -->
    <VDialog v-model="isLoadingmo" width="300">
      <VCard color="warning" width="300">
        <VCardText class="pt-3" style="align-self: center; margin-top: 5px;">
          <VIcon icon="mdi-check-bookmark" />
          <strong>
            저장되었습니다
          </strong>
        </VCardText>
      </VCard>
    </VDialog>
  </section>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";

.v-dialog__content {
  z-index: 9999;
  /* 원하는 z-index 값으로 변경하세요 */
}
</style>
