<script setup>
import CustomRadios from '@/@core/components/app-form-elements/CustomRadios.vue'
import { defineEmits, defineProps, ref, toRaw } from 'vue'

const props = defineProps({
  selectedRadio: {
    type: String,
    required: true,
  },
  radioContent: {
    type: Array,
    required: true,
  },
  gridColumn: {
    type: null,
    required: false,
  },
  gender: {
    type: String,
    required: true,
  },
  
})

const emit = defineEmits('updategender', gender)

const gender = ref("")

const radioContent = [
  
  {
    title: '남자',
    subtitle: '성별',
    value: 'M',
  },
  {
    title: '여자',
    subtitle: '성별',
    value: 'F',
  },
]

function handleSelectedRadios(value) {
  //var gender = document.querySelector('[name=gender]')

  // gender.value = value ? 'M' : 'W'
  // console.log('handleSelectedRadios호출:', gender.value)
  emit('updateGender', value)  // gender의 값을 부모 컴포넌트로 넘김
}

function testRadio(value){
  console.log('라디오에 클릭이벤트 발생', value)
}
const selectedOption = ref(toRaw(props.selectedRadio))
</script>

<template>
  <CustomRadios
    id="gender"
    :radio-content="radioContent"
    :grid-column="{ sm: '6', cols: '12' }"
    @change="handleSelectedRadios"
  />

  <VRadioGroup
    v-if="props.radioContent"
    v-model="selectedOption"
    v-bind="gridColumn"
    @change="handleSelectedRadios($event.target.value)"
  >
    <VRow>
      <VCol
        v-for="item in props.radioContent"
        :key="item.title"
        v-bind="gridColumn"
      >
        <VLabel
          class="custom-input custom-radio-icon rounded cursor-pointer"
          :class="selectedOption === item.value ? 'active' : ''"
        >
          <slot :item="item">
            <div class="d-flex flex-column align-center text-center gap-2">
              <VIcon
                size="28"
                :icon="item.icon"
                class="text-high-emphasis"
              />
              <h6 class="cr-title text-base">
                {{ item.title }}
              </h6>

              <p class="text-sm mb-0 clamp-text">
                {{ item.desc }}
              </p>
            </div>
          </slot>

          <div>
            <VRadio :value="item.value" />
          </div>
        </VLabel>
      </VCol>
    </VRow>
  </VRadioGroup>
</template>

<style lang="scss" scoped>
.custom-radio-icon {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;

  .v-radio {
    margin-block-end: -0.25rem;
  }

  .cr-title {
    font-weight: 500;
  }
}
</style>

<style lang="scss">
.custom-radio-icon {
  .v-radio {
    margin-block-end: -0.25rem;

    .v-selection-control__wrapper {
      margin-inline-start: 0;
    }
  }
}
</style>
