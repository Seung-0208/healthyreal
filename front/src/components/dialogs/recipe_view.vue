<script setup>
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiRefresh } from '@mdi/js'
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  recipedata: {
    type: Array,
    required: true,
  },
  dietPlansListtype: {
    type: Number,
    required: true,
  },
  connetId: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:isDialogVisible'])
const path = mdiRefresh
const tabItemText = 'Biscuit cheesecake gingerbread oat cake tiramisu. Marzipan tiramisu jelly-o muffin biscuit jelly cake pie. Chocolate cookie candy croissant brownie cupcake powder cheesecake. Biscuit sesame snaps biscuit topping tiramisu croissant.'
const currentTab = ref('tab-1')

const closeModal = () => {
  // 모달 창을 닫는 로직을 작성합니다.
  emit('update:isDialogVisible', false)
}

const currentRecipe = ref('')

const updateRecipeData = group => {
  currentRecipe.value = group
  console.log('현재 클릭한 레시피:', currentRecipe.value)

  // emit('update:recipedatach', group);
}

const updateCurrent = () => {
  closeModal()
  console.log('지금 레시피로 넘깁니다.', currentRecipe.value)
  emit('update:recipedatach', { recipe: currentRecipe.value, dietType: props.dietPlansListtype })
}

const changeRandom = () => {
  const connetId = props.connetId // 자식 컴포넌트에서 필요한 데이터 생성
  const choicecategory = props.recipedata[0][0].CATEGORY
  const index = props.dietPlansListtype

  emit('icon-clicked', { connetId, choicecategory, index }) // 부모 컴포넌트로 데이터 전달
}
</script>

<template>
  <VDialog
    style=" width: 50%;height: 100%;"
    :model-value="props.isDialogVisible"
    @update:model-value="val => $emit('update:isDialogVisible', val)"
  >
    <VCard
      class="py-8"
      style="max-width: 100%; max-height: 100%;"
    >
      <VCardActions class="justify-space-between">
        <SvgIcon
          type="mdi"
          :path="path"
          @click="changeRandom"
        />
        <div>
          <VBtn @click="updateCurrent">
            식단 변경하기
          </VBtn>
          <VBtn
            icon
            @click="closeModal"
          >
            <VIcon>
              mdi-close
            </VIcon>
          </VBtn>
        </div>
      </VCardActions>
      <VTabs
        v-model="currentTab"
        grow
        stacked
        style="height: 180px;"
      >
        <VTab
          v-for="(group, index) in recipedata"
          :key="index"
          :value="'tab-' + (index+1)"
          style="height: 160px;"
          @click="updateRecipeData(group)"
        >
          <img
            :src="group[0].RECIPE_IMG"
            alt="레시피 사진"
            style="width: 200px;height: 130px;"            
          >          
          <a
            :href="group[0].RECIPE_URL"
            style="margin: 10px 0;"
          >
            {{ group[0].FOODNAME }}
          </a>
        </VTab>
      </VTabs>
      <VWindow
        v-model="currentTab"
        class="mt-5"
      >
        <VWindowItem
          v-for="(group, index) in recipedata"
          :key="index"
          :value="'tab-' + (index+1)"
        >
          <strong style="margin: 0 20px; color: #068002; font-size: larger;">{{ group[0].RECIPE_TITLE }}</strong>
          <div
            v-for="(gro, index) in group"
            :key="index"
          >
            <div v-if="index == 0 && gro.RECIPE_SEQ && gro.RECIPE_SEQ.length > 0">
              <br><strong style="margin: 10px 20px;">[조리순서]</strong>
              <div
                style=" width: auto;max-height: 300px; overflow-y: auto;"
                class="scrollbar"
              >
                <p
                  v-for="(seq, seqIndex) in gro.RECIPE_SEQ.split('||')"
                  :key="seqIndex"
                  style="margin: 10px 20px;"
                >
                  {{ seqIndex + 1 }} ) {{ seq }}
                </p>
              </div>
              <br>
              <strong style="margin: 10px 20px;">[재료]</strong>
            </div>
            <span
              v-if="gro.FOODNAME"
              style="margin: 20px;"
            >
              - {{ gro.INGREDIENT }} - {{ gro.RI_AMOUNT }}
            </span>
          </div>
        </VWindowItem>
      </VWindow>
    </VCard>
  </VDialog>
</template>

<style>
.scrollbar {
  overflow-y: scroll;
}

/* 스크롤바의 폭 너비 */
.scrollbar::-webkit-scrollbar {
  inline-size: 10px;
}

.scrollbar::-webkit-scrollbar-thumb {
  border-radius: 10px; /* 스크롤바 둥근 테두리 */
  background: rgb(247, 177, 177); /* 스크롤바 색상 */
}

.scrollbar::-webkit-scrollbar-track {
  background: rgba(220, 20, 60, 10%);  /* 스크롤바 뒷 배경 색상 */
}
</style>
