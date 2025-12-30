<script setup>
const isUpgradeExercisePlan = ref(false)
const isCheckedRecipe = ref(false)
const isCheckedRestaurant = ref(false)
const isCategory = ref(false)

const router = useRoute()
const connectionData = ref([])



const fetchProjectData = () => {
  if (router.params.tab === 'connections') {
    axios.get('/pages/profile', { params: { tab: router.params.tab } }).then(response => {
      connectionData.value = response.data
    })
  }
}

import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// URL 쿼리 매개변수를 저장할 변수를 생성합니다.
const jsonData = ref(null)

// useRoute 훅을 사용하여 route 객체를 가져옵니다.
const route = useRoute()

// 컴포넌트가 마운트될 때 URL 쿼리 매개변수를 확인하고 변수에 저장합니다.
onMounted(() => {
  if (route.query.data) {
    try {
      // URL의 data 매개변수 값을 JSON으로 파싱하여 jsonData 변수에 저장합니다.
      jsonData.value = JSON.parse(route.query.data)
    } catch (error) {
      console.error('URL에서 데이터를 파싱하는 동안 오류가 발생했습니다:', error)
    }
  }
})
</script>

<template>
  <section>
    <VCol
      cols="10"
      class="dll"
    >
      <!-- 지식인 질문 부분 -->
      <VCol>
        <VCard
          v-if="jsonData"
          cols="12"
          style="margin: 20px 10px;"
        >
          <!-- 👉 Collapsible- -->
          <VCol style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <VIcon
              icon="mdi-help-circle-outline"
              color="success"
              style="font-size: 50px;"
            />
            <strong style="font-size: 20px;">{{ jsonData.title }}</strong>
          </VCol>
          <VCol>
            <p style="margin: 0 20px;">
              {{ jsonData.question_content }}
            </p>
          </VCol>
          <VCol style="margin: 0 10px;">         
            <span style=" margin-left: 8px;font-size: 12px; font-weight: bold;"> {{ jsonData.question_date }}</span>
            <span style=" margin-left: 8px;font-size: 12px; font-weight: bold;">{{ jsonData.question_hit }}</span>
          </VCol>
        </VCard>


        <!-- 지식인 질문 부분 -->
        <VCard 
          v-if="jsonData"
          style="margin: 10px;"
        >
          <!-- props로 지식인 내용 먼저 좀 뿌려주시면 될 것 같습니다 -->
          <VCol>
            <p style="margin: 0 20px;">
              {{ jsonData.answer_content }}
            </p>
          </VCol>
          <VCol style="margin: 30px 50px 0;">
            <VChip
              color="warning"
              size="small"
            >
              <VIcon
                start
                icon="mdi-alert-circle-outline"
              />
              알아두세요!
            </VChip>
            <VCol style="margin-top: -12px;">
              <span style="font-size: 12px;">위 답변은 답변작성자가 경험과 지식을 바탕으로 작성한 내용입니다. 운동할 때 참고해주세요.</span>
            </VCol>
          </VCol>
          <VCol style="margin: 0 20px;">
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 12px; font-weight: bold;">{{ jsonData.answer_date }}</span>
            </div>
          </VCol>
        </VCard>
        <VRow
          v-if="jsonData"
          justify="end"
          style="margin: 20px;"
        >
          <VBtn             
            target="_blank"
            :href="jsonData.url"
          >
            해당 페이지로 이동하기
          </VBtn>
        </VRow>
      </VCol>
    </VCol>
  </section>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";

.custom-scrollbar::-webkit-scrollbar {
  background-color: #f5f5f5;
  inline-size: 0;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #888;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

.vcol-ellipsis {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  text-overflow: ellipsis;
}
</style>

<style scoped>
.pointer-cursor {
  cursor: pointer;
}
</style>
