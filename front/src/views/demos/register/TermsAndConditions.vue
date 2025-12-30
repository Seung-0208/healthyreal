<script setup>
import * as text from '@/views/demos/Terms_and_Conditions'
import * as demoCode from '@/views/demos/register/demoCodeFormWizardIcons'
import { ref } from 'vue'

const textOne = ref(text.TermsAndConditions.ts)
const textTwo = ref(text.TermsAndConditionsN2.ts)
const textThr = ref(text.TermsAndConditionsN3.ts)
const textFour = ref(text.TermsAndConditionsN4.ts)
const textFive = ref(text.TermsAndConditionsN5.ts)
const textSix = ref(text.TermsAndConditionsN6.ts)

const checkboxOne = ref(false)
const checkboxTwo = ref(false)
const checkboxThr = ref(false)
const checkboxFour = ref(false)
const checkboxFive = ref(false)
const checkboxAll = ref(false)
let nextButtonDisabled = ref(true)

const handleCheckboxAllChanged = () => {
  if (checkboxAll.value) {
    checkboxOne.value = true
    checkboxTwo.value = true
    checkboxThr.value = true
    checkboxFour.value = true
    checkboxFive.value = true
  } else{
    checkboxOne.value = false
    checkboxTwo.value = false
    checkboxThr.value = false
    checkboxFour.value = false
    checkboxFive.value = false
  }
}


// 콜백함수 => 각 체크박스의 상태를 개별적으로 감시하여 checkboxall의 true 및 false값을 정합니다. 
watch([checkboxOne, checkboxTwo, checkboxThr, checkboxFour, checkboxFive], () => {
  checkboxAll.value = checkboxOne.value && checkboxTwo.value && checkboxThr.value && checkboxFour.value && checkboxFive.value
  nextButtonDisabled.value = !checkboxAll.value

})

/*
const handleCheckboxChanged = checkbox => {
  if (checkbox.checked) {
    checkboxAll.value = checkboxOne.value && checkboxTwo.value && checkboxThr.value && checkboxFour.value && checkboxFive.value
  } else {
    checkboxAll.value = false
  }
  
} */

const submit = () => {
  //다음페이지로 넘어가는 버튼에 서브밋 할 로직 추가해주세용! 체크박스 선택후 다음으로 넘어가는 버튼에 @click="submit" 클릭속성 추가하기
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard
        variant="outlined"
        title="HealthyReal 이용약관"
        :code="demoCode.vertical"
      >
        <VCol
          cols="12"
          md="12"
        >
          <!-- 👉 Label Slot -->
          <VCard title="전체 동의하기">
            <VCol
              cols="12"
              md="12"
            >
              <VTextarea 
                v-model="textSix"
                readonly
                label="약관동의"
                no-resize
                rows="2"
              />
              <VCheckbox
                v-model="checkboxAll"
                type="checkbox"
                @change="handleCheckboxAllChanged"
              >
                <template #label>
                  <div>
                    전체 동의.
                  </div>
                </template>
              </VCheckbox>
            </VCol>
          </VCard>
        </VCol>

        <VCol
          cols="12"
          md="12"
        >
          <!-- 👉 Label Slot -->
          <VCard title="[필수] 헬시리얼 이용약관">
            <VCol
              cols="12"
              md="12"
            >
              <VTextarea 
                v-model="textOne"
                readonly
                label="약관동의"
                no-resize
                rows="6"
              />
              <VCheckbox
                v-model="checkboxOne"
                @change="() => handleCheckboxChanged(checkboxOne)"
              >
                <template #label>
                  <div>
                    이용약관에 동의합니다.
                  </div>
                </template>
              </VCheckbox>
            </VCol>
          </VCard>
        </VCol>

        <VCol
          cols="12"
          md="12"
        >
          <!-- 👉 Label Slot -->
          <VCard title="[필수] 개인정보 수집 및 이용">
            <VCol
              cols="12"
              md="12"
            >
              <VTextarea 
                v-model="textTwo"
                readonly
                label="약관동의"
                no-resize
                rows="6"
              />
              <VCheckbox
                v-model="checkboxTwo"
                type="checkbox"
                @change="() => handleCheckboxChanged(checkboxTwo)"
              >
                <template #label>
                  <div>
                    이용약관에 동의합니다.
                  </div>
                </template>
              </VCheckbox>
            </VCol>
          </VCard>
        </VCol>

        <VCol
          cols="12"
          md="12"
        >
          <!-- 👉 Label Slot -->
          <VCard title="[필수] 실명 인증된 아이디로 가입">
            <VCol
              cols="12"
              md="12"
            >
              <VTextarea 
                v-model="textThr"
                readonly
                label="약관동의"
                no-resize
                rows="2"
              />
              <VCheckbox
                v-model="checkboxThr"
                type="checkbox"
                @change="() => handleCheckboxChanged(checkboxThr)"
              >
                <template #label>
                  <div>
                    이용약관에 동의합니다.
                  </div>
                </template>
              </VCheckbox>
            </VCol>
          </VCard>
        </VCol>

        <VCol
          cols="12"
          md="12"
        >
          <!-- 👉 Label Slot -->
          <VCard title="[필수] 위치기반서비스 이용약관">
            <VCol
              cols="12"
              md="12"
            >
              <VTextarea 
                v-model="textFour"
                readonly
                label="약관동의"
                no-resize
                rows="6"
              />
              <VCheckbox
                v-model="checkboxFour"
                type="checkbox"
                @change="() => handleCheckboxChanged(checkboxFour)"
              >
                <template #label>
                  <div>
                    이용약관에 동의합니다.
                  </div>
                </template>
              </VCheckbox>
            </VCol>
          </VCard>
        </VCol>

        <VCol
          cols="12"
          md="12"
        >
          <!-- 👉 Label Slot -->
          <VCard title="[필수] 개인정보 수집 및 이용">
            <VCol
              cols="12"
              md="12"
            >
              <VTextarea 
                v-model="textFive"
                readonly
                label="약관동의"
                no-resize
                rows="2"
              />
              <VCheckbox
                v-model="checkboxFive"
              
                @change="() => handleCheckboxChanged(checkboxFive)"
              >
                <template #label>
                  <div>
                    이용약관에 동의합니다.
                  </div>
                </template>
              </VCheckbox>
            </VCol>
          </VCard>
        </VCol>
      </VCard>
    </VCol>
  </VRow>
</template>







